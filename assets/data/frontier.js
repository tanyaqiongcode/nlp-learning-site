/* ============================================================
   前沿动态数据 · frontier.js
   可持续更新机制（已全自动）：
   1. picks（近期动态）—— 由 scripts/update-data.mjs 每日自动重新生成
      （GitHub Actions 定时运行：核验推送时间 → 按近 60 天活跃度排序），
      请勿手工编辑本区块；手工观察请写入 trends；
   2. trends（技术趋势）—— 编者观察，建议每季度复核并注明「截至」时间；
   3. live（实时活跃度看板）—— 页面加载时自动经 GitHub API 刷新
      （12 小时缓存，离线/限流时回落到 fallback 数据，fallback 由脚本每日更新）。
   ============================================================ */
window.FRONTIER = {
  updated: "2026-10-29",

  // ---- 近期动态（最新在前）----
  picks: [
    {
      date: "2026-10-29",
      repo: "modelcontextprotocol/servers",
      label: "自动核验",
      text: "Model Context Protocol 官方服务器合集：给大模型接文件、数据库、网页等工具的标准方式。GitHub API 每日核验：最近推送 2026-10-29，当前星标 91.7k。",
    },
    {
      date: "2026-10-29",
      repo: "microsoft/generative-ai-for-beginners",
      label: "自动核验",
      text: "微软官方 21 课生成式 AI 入门，从原理讲到应用与伦理。GitHub API 每日核验：最近推送 2026-10-29，当前星标 122.4k。",
    },
    {
      date: "2026-10-29",
      repo: "openai/openai-cookbook",
      label: "自动核验",
      text: "OpenAI 官方的 API 使用示例与实操指南合集。GitHub API 每日核验：最近推送 2026-10-29，当前星标 76.9k。",
    },
    {
      date: "2026-10-29",
      repo: "huggingface/transformers",
      label: "自动核验",
      text: "Hugging Face 旗舰库：数千个预训练模型的一站式下载与使用入口。GitHub API 每日核验：最近推送 2026-10-29，当前星标 168.3k。",
    },
    {
      date: "2026-10-29",
      repo: "stanfordnlp/stanza",
      label: "自动核验",
      text: "斯坦福官方多语言 NLP 工具包，支持 70+ 种语言。GitHub API 每日核验：最近推送 2026-10-29，当前星标 7.9k。",
    },
    {
      date: "2026-10-29",
      repo: "pytorch/tutorials",
      label: "自动核验",
      text: "PyTorch 官方教程集：从张量入门到分布式训练、部署的全链路。GitHub API 每日核验：最近推送 2026-10-29，当前星标 9.4k。",
    },
    {
      date: "2026-10-29",
      repo: "hiyouga/LlamaFactory",
      label: "自动核验",
      text: "一站式大模型微调工具：100+ 模型的 LoRA/全参微调与评估（ACL 2024）。GitHub API 每日核验：最近推送 2026-10-29，当前星标 75.8k。",
    },
    {
      date: "2026-10-28",
      repo: "stanfordnlp/dspy",
      label: "自动核验",
      text: "斯坦福出品：把提示词工程变成「编程 + 自动优化」，用指标驱动地改进 LLM 流水线。GitHub API 每日核验：最近推送 2026-10-28，当前星标 38.8k。",
    },
    {
      date: "2026-10-28",
      repo: "nltk/nltk",
      label: "自动核验",
      text: "最经典的「为语言学家写的」NLP Python 库。GitHub API 每日核验：最近推送 2026-10-28，当前星标 14.8k。",
    },
    {
      date: "2026-10-28",
      repo: "vinta/awesome-python",
      label: "自动核验",
      text: "「我想用 Python 做 X，该用哪个库」的权威答案库。GitHub API 每日核验：最近推送 2026-10-28，当前星标 331k。",
    },
    {
      date: "2026-10-28",
      repo: "a2aproject/A2A",
      label: "自动核验",
      text: "Agent2Agent 开放协议（Google 发起，现由 Linux 基金会治理）：让不同框架的智能体互相发现、沟通与协作。GitHub API 每日核验：最近推送 2026-10-28，当前星标 26.3k。",
    },
    {
      date: "2026-10-28",
      repo: "programminghistorian/jekyll",
      label: "自动核验",
      text: "人文学者写给同行的编程教程集（本仓库为站点源码）。GitHub API 每日核验：最近推送 2026-10-28，当前星标 553。",
    },
  ],

  // ---- 技术趋势观察（编者视角，随季度复核）----
  trends: [
    {
      icon: "🤖",
      title: "从 Chatbot 到 Agent：协议标准化已经落地（截至 2026-10 复核）",
      text: "范式转移仍在深化，且出现了新主线——「协议化」：MCP（模型连工具）与 A2A（智能体连智能体）在 2026 年双双成为 Linux 基金会治理的开放标准，A2A v1.0 已落地、生态规模分别达到 9 万与 2.6 万星。对研究者的意义：文献综述助手、批量语料标注、多步翻译流水线都能用标准协议编排，不再绑死任何一家厂商的工具链。",
      refs: [
        { label: "MCP · 模型上下文协议官网", url: "https://modelcontextprotocol.io/" },
        { label: "A2A 协议官网（中文文档）", url: "https://a2acn.com/docs/introduction" },
        { label: "OpenAI Agents SDK（官方多智能体框架）", url: "https://github.com/openai/openai-agents-python" },
      ],
    },
    {
      icon: "🧠",
      title: "推理模型与测试时计算成为主线",
      text: "行业重心从「把模型做大」转向「让模型多想几步」：推理驱动的后训练与推理时（inference-time）技术成为竞争焦点。学术上，思维链正扩展为「智能体推理」（Agentic Reasoning）。读论文时会看到更多「思考预算」相关的表述——本质是让模型花更多算力换取更可靠的推理。",
      refs: [
        { label: "Springer：LLM 在 NLP 中的演进与架构趋势", url: "https://link.springer.com/article/10.1186/s40537-026-01429-1" },
        { label: "Epoch AI · 大模型趋势数据", url: "https://epoch.ai/" },
      ],
    },
    {
      icon: "🛠️",
      title: "评测、安全与模型格局：竞争转向落地（截至 2026-10 复核）",
      text: "各家旗舰快速迭代（GPT-5.x、Claude Opus 4.x、Gemini 3.x 与开源模型交替领跑），「谁最强」的窗口期越来越短——评测、可靠性、成本控制才是稳定主线。LMArena 盲测与 LLM-as-a-Judge 重塑判定方式之外，OWASP 2026 版把 LLM 安全十大风险（提示注入、数据泄露、幻觉）推成显学。「会设计任务、会评估输出质量」正是文科背景最擅长的部分：本站评测素养专题与项目五就是入场券。",
      refs: [
        { label: "LMArena · 真人盲测竞技场", url: "https://lmarena.ai/" },
        { label: "OWASP GenAI LLM Top 10 (2026)", url: "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026" },
        { label: "DSPy · 斯坦福「编程而非提示」框架", url: "https://github.com/stanfordnlp/dspy" },
      ],
    },
    {
      icon: "🌍",
      title: "多语言与低资源语言得到更多关注",
      text: "大模型的多语言能力持续进步，低资源语言、方言与历史文献变体的处理开始出现专门研究——这对语言学研究是直接利好：用大模型辅助濒危语言记录、历史文本转写与方言调查的门槛正在快速降低。留意 Hugging Face 上 multilingual 标签的模型与数据集。",
      refs: [
        { label: "Hugging Face 模型库（multilingual 筛选）", url: "https://huggingface.co/models?other=multilingual" },
      ],
    },
  ],

  // ---- 实时活跃度看板（自动刷新，无需手工维护）----
  live: {
    repos: [
      { repo: "huggingface/transformers", name: "Transformers", fallback: { stars: 168326, pushed: "2026-10-29" } },
      { repo: "microsoft/generative-ai-for-beginners", name: "GenAI for Beginners", fallback: { stars: 122378, pushed: "2026-10-29" } },
      { repo: "rasbt/LLMs-from-scratch", name: "LLMs from Scratch", fallback: { stars: 107472, pushed: "2026-10-02" } },
      { repo: "mlabonne/llm-course", name: "LLM Course", fallback: { stars: 84746, pushed: "2026-02-05" } },
      { repo: "d2l-ai/d2l-zh", name: "动手学深度学习", fallback: { stars: 82163, pushed: "2024-07-30" } },
      { repo: "chinese-poetry/chinese-poetry", name: "chinese-poetry", fallback: { stars: 53871, pushed: "2026-06-17" } },
      { repo: "hankcs/HanLP", name: "HanLP", fallback: { stars: 36531, pushed: "2026-10-25" } },
      { repo: "EleutherAI/lm-evaluation-harness", name: "LM Eval Harness", fallback: { stars: 14344, pushed: "2026-09-14" } },
      { repo: "explosion/spaCy", name: "spaCy", fallback: { stars: 34003, pushed: "2026-10-27" } },
    ],
  },

  // ---- 追踪前沿的固定入口（永远最新的外部页面）----
  feeds: [
    {
      name: "Hugging Face Daily Papers",
      url: "https://huggingface.co/papers",
      desc: "社区投票的每日 LLM / NLP 论文精选榜——想追论文热点，每天扫一眼这里就够了。",
    },
    {
      name: "arXiv cs.CL 最新提交",
      url: "https://arxiv.org/list/cs.CL/recent",
      desc: "计算语言学与 NLP 预印本的官方最新列表，本站书单里 SLP 教材的「活的版本」。",
    },
    {
      name: "GitHub Trending",
      url: "https://github.com/trending/python?since=weekly",
      desc: "每周热门仓库（已按 Python 过滤）——观察学习资源风向的晴雨表。",
    },
    {
      name: "The Batch（DeepLearning.AI）",
      url: "https://www.deeplearning.ai/the-batch/",
      desc: "吴恩达团队的 AI 周报，中文社区的许多解读都源于此，适合每周花十分钟建立信息底座。",
    },
  ],
};
