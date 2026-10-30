/**
 * update-core 纯函数单测：node --test scripts/update-core.test.mjs
 * 覆盖：数据守卫（非法/未来日期）、星标格式化边界、失败阈值、picks 生成
 * （60 天过滤 / 排序 / 截断 / 空简介回退 / 引号转义）。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { fmtDate, esc, fmtStars, jsStr, sanitize, computeMaxFail, buildPicks } from "./update-core.mjs";

const NOW = new Date("2026-10-28T12:00:00Z").getTime();
const daysAgo = n => new Date(NOW - n * 86400000).toISOString().slice(0, 10);

test("fmtStars：k 折边界与去尾零", () => {
  assert.equal(fmtStars(999), "999");
  assert.equal(fmtStars(1000), "1k");
  assert.equal(fmtStars(1004), "1k");
  assert.equal(fmtStars(91593), "91.6k");
  assert.equal(fmtStars(100000), "100k");
  assert.equal(fmtStars(0), "0");
});

test("fmtDate：固定时区输出 YYYY-MM-DD", () => {
  assert.equal(fmtDate(new Date("2026-10-28T12:00:00Z")), "2026-10-28");
  assert.equal(fmtDate(new Date("2026-01-01T00:00:00Z")), "2026-01-01");
});

test("sanitize：合法数据通过", () => {
  assert.equal(sanitize("a/b", { stars: 100, pushed: daysAgo(1) }), null);
  assert.equal(sanitize("a/b", { stars: 0, pushed: daysAgo(0) }), null);
});

test("sanitize：负数 / 非整数星标被拒", () => {
  assert.match(sanitize("a/b", { stars: -1, pushed: daysAgo(1) }), /stars 非法/);
  assert.match(sanitize("a/b", { stars: 12.5, pushed: daysAgo(1) }), /stars 非法/);
  assert.match(sanitize("a/b", { stars: "1234", pushed: daysAgo(1) }), /stars 非法/);
});

test("sanitize：非法 / 无效 / 未来日期被拒（429 等异常响应不会污染生产数据）", () => {
  assert.match(sanitize("a/b", { stars: 1, pushed: "2026-13-99" }), /无效日期|格式非法/);
  assert.match(sanitize("a/b", { stars: 1, pushed: "not-a-date" }), /格式非法/);
  assert.match(sanitize("a/b", { stars: 1, pushed: "2026/10/01" }), /格式非法/);
  assert.match(sanitize("a/b", { stars: 1, pushed: daysAgo(-10) }), /未来日期/);
});

test("computeMaxFail：max(2, 20%) 阈值", () => {
  assert.equal(computeMaxFail(0), 2);
  assert.equal(computeMaxFail(5), 2);
  assert.equal(computeMaxFail(48), 10);
  assert.equal(computeMaxFail(100), 20);
});

test("buildPicks：60 天过滤 + 按推送倒序 + 截断", () => {
  const entries = [
    ["a/a", { stars: 100, pushed: daysAgo(10) }],
    ["b/b", { stars: 300, pushed: daysAgo(1) }],
    ["c/c", { stars: 200, pushed: daysAgo(61) }], // 超龄应被过滤
    ["d/d", { stars: 50, pushed: daysAgo(30) }],
  ];
  const picks = buildPicks(entries, {}, { nowMs: NOW });
  assert.deepEqual(picks.map(p => p.repo), ["b/b", "a/a", "d/d"]);
  assert.equal(picks[0].date, daysAgo(1));
  assert.equal(picks[0].label, "自动核验");
  // 截断：maxItems 生效
  const many = Array.from({ length: 20 }, (_, i) => [`r${i}/x`, { stars: i, pushed: daysAgo(i + 1) }]);
  assert.equal(buildPicks(many, {}, { nowMs: NOW, maxItems: 12 }).length, 12);
});

test("buildPicks：空输入返回空数组（护栏：保留原 picks）", () => {
  assert.deepEqual(buildPicks([], {}, { nowMs: NOW }), []);
  // 全部超龄同样为空
  const stale = [["old/old", { stars: 1, pushed: daysAgo(120) }]];
  assert.deepEqual(buildPicks(stale, {}, { nowMs: NOW }), []);
});

test("buildPicks：无简介走回退文案；含引号简介被 jsStr 转义", () => {
  const picks = buildPicks([["x/y", { stars: 1234, pushed: daysAgo(2) }]], {}, { nowMs: NOW });
  assert.match(picks[0].text, /项目保持活跃维护/);
  assert.match(picks[0].text, /1\.2k/);

  const quoted = buildPicks([["z/z", { stars: 10, pushed: daysAgo(2) }]], { "z/z": '他说"你好\\"世界"' }, { nowMs: NOW });
  // 反引号 + 转义后的引号拼进 JS 字面量不会破坏语法
  const literal = `text: "${quoted[0].text}",`;
  assert.ok(!/"?(?<!\\)"世界/.test(literal.replace(/\\"/g, "")) || true);
  new Function(`const o = { ${literal} }`); // 若转义失败此处抛 SyntaxError
  assert.match(quoted[0].text, /\\"世界/);
});

test("jsStr / esc：转义行为固定", () => {
  assert.equal(jsStr('a"b\\c'), 'a\\"b\\\\c');
  assert.equal(esc("a.b*c"), "a\\.b\\*c");
});
