/* grade-rule.js — 用规则引擎给校准语料打分（本地运行，不花钱） */
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "tool", "js");
const files = ["data-questions.js", "data-questions-extra.js", "data-questions-recent.js", "data-topics.js", "data-collocations.js", "data-essays.js", "data-t1.js", "data-plan.js", "analyzer.js", "checker.js"];
const code = files.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n") + "\n;({ Analyzer, Checker, QuestionBank });";
const { Checker, QuestionBank } = vm.runInContext(code, vm.createContext({ console, Math, JSON }));

const cal = JSON.parse(fs.readFileSync("calibration/essays_v2.json", "utf8"));

// book/test → 题库题目（拿 qtype / t1type / questionText）
function findBank(book, test, task) {
  const tStr = String(test);
  return QuestionBank.find(q => {
    const m = q.src.match(/剑(\d+)\s+Test\s+(\w+)/);
    if (!m) return false;
    if (Number(m[1]) !== book) return false;
    if (String(m[2]) !== tStr) return false;
    if (task === 2) return !!q.t2;
    return !!q.t1;
  });
}
function chartOf(t1type) {
  const s = (t1type || "").toLowerCase();
  if (s.includes("line")) return "线图 Line graph";
  if (s.includes("bar")) return "柱图 Bar chart";
  if (s.includes("pie")) return "饼图 Pie chart";
  if (s.includes("table")) return "表格 Table";
  if (s.includes("map") || s.includes("plan")) return "地图 Map";
  if (s.includes("process") || s.includes("diagram")) return "流程图 Process";
  if (s.includes("two")) return "双图 Two charts";
  return "饼图 Pie chart";
}
function typeOf(t2type) {
  return { opinion: "opinion", discussion: "discussion", "adv-disadv-opinion": "adv-disadv-opinion", "adv-disadv": "adv-disadv", "problem-solution": "problem-solution", "two-part": "two-part" }[t2type] || "opinion";
}

const out = [];
for (const e of cal) {
  let r;
  if (e.task === 2) {
    const bank = findBank(e.book, e.test, 2);
    const qtype = bank ? typeOf(bank.t2type) : "opinion";
    const q = bank ? bank.t2 : "";
    r = Checker.check(e.text, qtype, [], q);
  } else {
    const bank = findBank(e.book, e.test, 1);
    const chart = chartOf(bank ? bank.t1type : "");
    const q = bank ? bank.t1 : "";
    r = Checker.checkT1(e.text, chart, q);
  }
  out.push({ book: e.book, test: String(e.test), task: e.task, kind: e.kind, band: e.band, gt: !!e.gt,
    ruleScores: r.score, ruleIssues: r.issues.filter(i => i.sev === "bad").length, W: r.W });
}
fs.writeFileSync("calibration/rule-results.json", JSON.stringify(out, null, 1));

// 快速摘要：规则分 vs 官方分
const MAE = arr => arr.length ? (arr.reduce((a, b) => a + Math.abs(b), 0) / arr.length) : 0;
const t2 = out.filter(o => o.task === 2);
const deltas = t2.map(o => {
  const ruleAvg = Math.round((Object.values(o.ruleScores).reduce((a, b) => a + b, 0) / 4) * 2) / 2;
  return ruleAvg - o.band;
});
console.log("T2 n=" + t2.length, "规则引擎整体平均分 vs 官方分：平均偏差", (deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2), "MAE", MAE(deltas).toFixed(2));
t2.forEach(o => {
  const ruleAvg = Math.round((Object.values(o.ruleScores).reduce((a, b) => a + b, 0) / 4) * 2) / 2;
  console.log(`  b${o.book} T${o.test}.${o.task} 官方${o.band} 规则${ruleAvg} (${JSON.stringify(o.ruleScores)})`);
});
