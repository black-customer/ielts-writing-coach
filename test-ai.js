/* test-ai.js — AI 考官精批端到端测试（真实调用 DeepSeek API） */
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "tool", "js");

// 浏览器环境 stub（Store 依赖 localStorage）
const mem = {};
global.localStorage = {
  getItem: k => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: k => { delete mem[k]; }
};
const load = f => fs.readFileSync(path.join(dir, f), "utf8");
const vm = require("vm");
const ctxCode = load("store.js") + "\n;\n" + load("config.js") + "\n;\n" + load("ai.js") + "\n;({ AI, IWC_CONFIG })";
const { AI, IWC_CONFIG } = vm.runInContext(ctxCode, vm.createContext({ localStorage: global.localStorage, console, fetch, JSON, Date, Number, Array, Object }));

const essay = `Nowadays, more and more people like play computer games. Although games are fun, but they waste time. This is a controversial issue in modern society.
Some people think games is good for children, other people think games are bad. Furthermore, games can improve creativity. For example, minecraft can teach children to build houses. In additions, playing games make children smart, informations show that many students become clever.
However, gaming is very addictive. Many children spend hours each day to play games instead of studying. Their eyesight become worse and worse. Moreover, games contain violence which is harmful for young people, it can make them aggressive.
In conclusion, every coin has two sides, I think government should control the games industry and parents should limit the time.`;

const question = "Some people regard video games as harmless fun, or even as a useful educational tool. Others, however, believe that video games are having an adverse effect on the people who play them. In your opinion, do the drawbacks of video games outweigh the benefits?";

(async () => {
  let pass = 0, fail = 0;
  const t = (n, c, x) => { if (c) { pass++; console.log("  ✓ " + n); } else { fail++; console.log("  ✗ " + n + (x ? " —— " + x : "")); } };
  console.log("== AI 精批端到端（真实 API） ==");
  try {
    const t0 = Date.now();
    const r = await AI.review({ essay, mode: "t2", question, type: "观点题" });
    const ms = Date.now() - t0;
    console.log(`  ℹ 耗时 ${(ms / 1000).toFixed(1)}s，模型 ${IWC_CONFIG.model}`);
    const keys = Object.keys(r.scores);
    t("四项分数齐全（TR/CC/LR/GRA）", ["TR", "CC", "LR", "GRA"].every(k => keys.includes(k) && r.scores[k] > 0 && r.scores[k] <= 9), JSON.stringify(r.scores));
    t("总分合理（4-7 区间，弱文应偏低）", r.overall >= 4 && r.overall <= 7, "overall=" + r.overall);
    t("句子级问题 5-12 条", r.sentenceIssues.length >= 5 && r.sentenceIssues.length <= 12, "n=" + r.sentenceIssues.length);
    t("句子级问题有 quote/problem/fix", r.sentenceIssues.every(i => i.quote && (i.problem || i.fix)), "");
    t("quote 确实摘自原文（抽查第一条）", r.sentenceIssues.some(i => { const q = (i.quote || "").toLowerCase().replace(/[^a-z ]/g, "").slice(0, 25); return q.length > 10 && essay.toLowerCase().includes(q.slice(0, 20)); }), "");
    t("有逐段点评或句子问题足够覆盖", (r.paragraphComments && r.paragraphComments.length >= 3) || r.sentenceIssues.length >= 6, "comments n=" + (r.paragraphComments || []).length);
    t("有优先修复项", Array.isArray(r.priorityFixes) && r.priorityFixes.length >= 1, "");
    t("改写示范（若返回则必须完整）", !r.rewrite || (r.rewrite.improved && r.rewrite.improved.length > 80), "");
    t("改写是英文", /^[\x00-\xFF\s]*$/.test(r.rewrite && r.rewrite.improved || "") || /[a-zA-Z]/.test((r.rewrite && r.rewrite.improved || "").slice(0, 50)), "");
    console.log("  ℹ 总评:", (r.summary || "").slice(0, 80));
    console.log("  ℹ 分数:", JSON.stringify(r.scores), "overall", r.overall);
  } catch (e) {
    console.log("  ✗ API 调用失败 ——", e.message);
    fail++;
  }
  console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
  process.exitCode = fail ? 1 : 0;
})();
