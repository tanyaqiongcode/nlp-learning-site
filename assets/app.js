/* ============================================================
   app.js · 路由 / 学习进度 / 启动引导
   模块划分：
     core.js         —— 工具函数、存储、主题、代码块工具
     experiments.js  —— 五个在线实验
     content.js      —— 知识库与前沿动态渲染
     app.js          —— hash 路由、进度系统、页面导航、启动
   加载顺序（index.html）：数据文件 → core → experiments → content → app
   ============================================================ */
"use strict";

/* ---------------- 导航 / 路由 ---------------- */
const PAGES = [
  { id: "home", title: "首页" },
  { id: "roadmap", title: "学习路线图" },
  { id: "math", title: "数学基础" },
  { id: "python", title: "Python 编程" },
  { id: "nlp", title: "NLP 概念" },
  { id: "projects", title: "实操项目" },
  { id: "kb", title: "资源知识库" },
  { id: "frontier", title: "前沿动态" },
  { id: "resources", title: "书单与资源" },
];

function currentPageId() {
  const m = location.hash.match(/^#\/([a-z]+)/);
  return m && PAGES.some(p => p.id === m[1]) ? m[1] : "home";
}

function renderRoute() {
  const id = currentPageId();
  $$(".page").forEach(sec => sec.classList.toggle("active", sec.id === `page-${id}`));
  $$(".nav-link").forEach(a => {
    const active = a.getAttribute("href") === `#/${id}`;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  const meta = PAGES.find(p => p.id === id);
  document.title = (meta && id !== "home" ? `${meta.title} · ` : "") + "文科生学 NLP";
  $("#topbar").classList.remove("nav-open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0 });
}

function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  $("#menuToggle").addEventListener("click", () => {
    const open = $("#topbar").classList.toggle("nav-open");
    $("#menuToggle").setAttribute("aria-expanded", String(open));
  });
  buildPager();
}

function buildPager() {
  PAGES.forEach((p, i) => {
    const sec = $(`#page-${p.id}`);
    if (!sec) return;
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    if (!prev && !next) return;
    const div = document.createElement("div");
    div.className = "pager";
    div.innerHTML =
      (prev ? `<a href="#/${prev.id}"><small>← 上一页</small>${prev.title}</a>` : "<span></span>") +
      (next ? `<a class="next" href="#/${next.id}"><small>下一页 →</small>${next.title}</a>` : "<span></span>");
    sec.querySelector(".container").appendChild(div);
  });
}

/* ---------------- 学习进度 ---------------- */
const PROGRESS_KEY = "nlp-map-progress-v1";
// 存储内容可能被篡改或损坏（null / 数组 / 字符串），非普通对象一律重置，避免启动崩溃
let progress = STORE.get(PROGRESS_KEY, {});
if (!progress || typeof progress !== "object" || Array.isArray(progress)) progress = {};

function initProgress() {
  $$(".check-btn[data-pid]").forEach(btn => {
    const pid = btn.dataset.pid;
    const sync = () => btn.setAttribute("aria-pressed", String(!!progress[pid]));
    sync();
    btn.addEventListener("click", () => {
      if (progress[pid]) delete progress[pid];
      else progress[pid] = Date.now();
      const ok = STORE.set(PROGRESS_KEY, progress);
      sync();
      btn.closest(".kcard")?.classList.toggle("done", !!progress[pid]);
      refreshProgressUI();
      flashSaveStatus(ok);
    });
    // 初始卡片状态
    if (progress[pid]) btn.closest(".kcard")?.classList.add("done");
  });
  refreshProgressUI();

  $("#resetProgress").addEventListener("click", () => {
    if (!confirm("确定要清空全部学习进度吗？此操作不可恢复。")) return;
    progress = {};
    flashSaveStatus(STORE.set(PROGRESS_KEY, progress));
    $$(".check-btn[data-pid]").forEach(b => {
      b.setAttribute("aria-pressed", "false");
      b.closest(".kcard")?.classList.remove("done");
    });
    refreshProgressUI();
  });
  initBackup();
}

/* ---------------- 保存状态提示 + 进度导入/导出 ---------------- */
let statusTimer = null;
function flashSaveStatus(ok) {
  const el = $("#saveStatus");
  if (!el) return;
  el.textContent = ok ? "已保存 ✓" : "⚠️ 存储不可用（隐私模式或空间已满）——进度仅本次会话有效，请及时导出";
  el.className = "save-status " + (ok ? "save-ok" : "save-warn");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { el.textContent = ""; el.className = "save-status"; }, ok ? 2000 : 12000);
}

function initBackup() {
  $("#exportProgress").addEventListener("click", () => {
    const payload = { app: "nlp-learning-site", key: PROGRESS_KEY, exported: new Date().toISOString(), progress };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nlp-progress-${payload.exported.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    flashSaveStatus(true);
  });
  $("#importProgress").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const p = data && data.app === "nlp-learning-site" && data.key === PROGRESS_KEY ? data.progress : null;
        const valid = p && typeof p === "object" && Object.values(p).every(v => v === null || typeof v === "number");
        if (!valid) throw new Error("不是本站导出的进度文件");
        progress = Object.fromEntries(Object.entries(p).filter(([, v]) => typeof v === "number"));
        flashSaveStatus(STORE.set(PROGRESS_KEY, progress));
        $$(".check-btn[data-pid]").forEach(b => {
          const on = !!progress[b.dataset.pid];
          b.setAttribute("aria-pressed", String(on));
          b.closest(".kcard")?.classList.toggle("done", on);
        });
        refreshProgressUI();
      } catch (err) {
        flashSaveStatus(false);
        $("#saveStatus").textContent = "⚠️ 导入失败：不是本站导出的进度文件";
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
}

function moduleStats(module) {
  const btns = $$(`.check-btn[data-module="${module}"]`);
  const done = btns.filter(b => progress[b.dataset.pid]).length;
  return { done, total: btns.length };
}

function refreshProgressUI() {
  $$("[data-module-progress]").forEach(el => {
    const { done, total } = moduleStats(el.dataset.moduleProgress);
    if (el.classList.contains("bar-fill")) el.style.width = total ? `${(done / total) * 100}%` : "0%";
    else el.textContent = `${done} / ${total}`;
  });
  const all = $$(".check-btn[data-pid]");
  const doneAll = all.filter(b => progress[b.dataset.pid]).length;
  const pct = all.length ? Math.round((doneAll / all.length) * 100) : 0;
  $("#overallNum").textContent = `已掌握 ${doneAll} / ${all.length} 项`;
  $("#overallPct").textContent = `完成 ${pct}%`;
  $("#overallBar").style.width = `${pct}%`;
}

/* ---------------- 启动 ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initRouter();
  initProgress();
  initCodeTools();
  initExperiments();
  initContent();
  renderRoute();
});
