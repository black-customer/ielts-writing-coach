/* test-corpus.js — 范文全库数据质量测试（依赖小分队产出的 data 文件） */
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "tool", "js");
const present = ["data-questions.js", "data-topics.js", "data-collocations.js", "data-essays.js", "data-t1.js", "data-plan.js", "analyzer.js", "checker.js"];
const optional = ["data-essays-corpus.js", "data-t1-essays.js"];
const files = [...present, ...optional.filter(f => fs.existsSync(path.join(dir, f)))];
const code = files.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n") + "\n;({ EssayCorpus: typeof EssayCorpus !== 'undefined' ? EssayCorpus : undefined, T1EssayCorpus: typeof T1EssayCorpus !== 'undefined' ? T1EssayCorpus : undefined });";
const { EssayCorpus, T1EssayCorpus } = vm.runInContext(code, vm.createContext({ console, Math, JSON }), { filename: "bundle.js" });

let pass = 0, fail = 0;
const t = (name, cond, extra) => { if (cond) { pass++; console.log("  ✓ " + name); } else { fail++; console.log("  ✗ " + name + (extra ? " —— " + extra : "")); } };
const wc = s => (s.match(/[A-Za-z']+/g) || []).length;
const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

console.log("== 大作文范文库 ==");
if (typeof EssayCorpus === "undefined") { console.log("  （文件未生成，跳过）"); }
else {
  t("条数 ≥ 25", EssayCorpus.length >= 25, `got ${EssayCorpus.length}`);
  const badType = EssayCorpus.filter(e => !["opinion", "discussion", "adv-disadv-opinion", "adv-disadv", "problem-solution", "two-part", "unknown"].includes(e.type));
  t("题型值合法", badType.length === 0, badType.slice(0, 3).map(e => e.type).join(","));
  const short = EssayCorpus.filter(e => wc(e.essay) < 180);
  t("无残篇（≥180词）", short.length === 0, short.slice(0, 3).map(e => wc(e.essay) + "词").join(","));
  const seen = new Set(); const dups = [];
  EssayCorpus.forEach(e => { const k = norm(e.q).slice(0, 40); if (k && seen.has(k)) dups.push(k); seen.add(k); });
  t("无重复题目", dups.length === 0, dups.slice(0, 3).join(" | "));
  const noisy = EssayCorpus.filter(e => /Posted by Simon|Permalink|===== \[page/.test(e.essay));
  t("无网站噪音", noisy.length === 0, `${noisy.length} 条`);
  const typed = EssayCorpus.filter(e => e.type !== "unknown").length;
  console.log(`  ℹ 共 ${EssayCorpus.length} 篇，总词数 ${EssayCorpus.reduce((a, e) => a + wc(e.essay), 0)}，已判题型 ${typed} 篇`);
  const dist = {};
  EssayCorpus.forEach(e => dist[e.type] = (dist[e.type] || 0) + 1);
  console.log("  ℹ 题型分布:", JSON.stringify(dist));
}

console.log("== 小作文范文库 ==");
if (typeof T1EssayCorpus === "undefined") { console.log("  （文件未生成，跳过）"); }
else {
  t("条数 ≥ 15", T1EssayCorpus.length >= 15, `got ${T1EssayCorpus.length}`);
  const badChart = T1EssayCorpus.filter(e => !["line", "bar", "pie", "table", "two charts", "process", "map", "comparison", "unknown"].includes(e.chart));
  t("图型值合法", badChart.length === 0, badChart.slice(0, 3).map(e => e.chart).join(","));
  const short = T1EssayCorpus.filter(e => wc(e.essay) < 120);
  t("无残篇（≥120词）", short.length === 0, short.slice(0, 3).map(e => wc(e.essay) + "词").join(","));
  const seen = new Set(); const dups = [];
  T1EssayCorpus.forEach(e => { const k = norm(e.q).slice(0, 40); if (k && seen.has(k)) dups.push(k); seen.add(k); });
  t("无重复题目", dups.length === 0, dups.slice(0, 3).join(" | "));
  console.log(`  ℹ 共 ${T1EssayCorpus.length} 篇，总词数 ${T1EssayCorpus.reduce((a, e) => a + wc(e.essay), 0)}`);
}

console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
