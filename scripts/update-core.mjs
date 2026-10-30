/**
 * update-data.mjs 的纯函数层：无 IO，便于固定响应单测（node --test）。
 */
export const fmtDate = dt => dt.toISOString().slice(0, 10);
export const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const fmtStars = n => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n));
export const jsStr = s => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const DATE_FULL = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_SKEW_MS = 36 * 3600 * 1000; // 容忍 36 小时时钟偏差

/** 数据合法性守卫：返回 null 表示合法，否则返回错误说明 */
export function sanitize(repo, d) {
  if (!Number.isInteger(d.stars) || d.stars < 0) return `stars 非法: ${d.stars}`;
  if (!DATE_FULL.test(d.pushed)) return `pushed 格式非法: "${d.pushed}"`;
  const t = new Date(d.pushed);
  if (Number.isNaN(t.getTime())) return `pushed 是无效日期: "${d.pushed}"`;
  if (!fmtDate(t).startsWith(d.pushed)) return `pushed 是无效日期: "${d.pushed}"`;
  if (t.getTime() > Date.now() + ALLOWED_SKEW_MS) return `pushed 是未来日期: "${d.pushed}"`;
  return null;
}

/** 失败阈值：max(2, 20%)，低于则中止更新保护生产数据 */
export const computeMaxFail = total => Math.max(2, Math.ceil(total * 0.2));

/**
 * 生成「近期动态」条目（纯函数）。
 * entries: [repo, {stars, pushed}]；kbDesc: repo→简介；nowMs: 当前毫秒。
 * 返回 pick 对象数组（text 已转义，可直接拼接为 JS 字面量）。
 */
export function buildPicks(entries, kbDesc, { nowMs = Date.now(), maxAgeDays = 60, maxItems = 12 } = {}) {
  return entries
    .filter(([, d]) => d.pushed && (nowMs - new Date(d.pushed)) / 86400000 <= maxAgeDays)
    .sort((a, b) => b[1].pushed.localeCompare(a[1].pushed))
    .slice(0, maxItems)
    .map(([repo, d]) => {
      const desc = kbDesc[repo] || "";
      const tail = `GitHub API 每日核验：最近推送 ${d.pushed}，当前星标 ${fmtStars(d.stars)}。`;
      const text = desc ? `${jsStr(desc)}${tail}` : `项目保持活跃维护。${tail}`;
      return { date: d.pushed, repo, label: "自动核验", text };
    });
}
