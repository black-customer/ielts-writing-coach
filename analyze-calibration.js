/* analyze-calibration.js — 校准分析：LLM盲评分 & 规则引擎 vs 官方分数 */
const fs = require("fs");
const cal = JSON.parse(fs.readFileSync("calibration/essays_v2.json", "utf8"));
const rule = JSON.parse(fs.readFileSync("calibration/rule-results.json", "utf8"));

// 收集 LLM 评分
const llm = [];
const gdir = "calibration/grading";
for (const f of fs.readdirSync(gdir).filter(f => f.startsWith("grade_"))) {
  try {
    const g = JSON.parse(fs.readFileSync(gdir + "/" + f, "utf8"));
    const m = f.match(/b(\d+)_t(\w+)_(\d)/);
    const e = cal.find(x => x.book === +m[1] && String(x.test) === m[2] && x.task === +m[3] && x.kind === "sample");
    if (!e) continue;
    llm.push({ book: e.book, test: e.test, task: e.task, band: e.band, scores: g.scores, overall: g.overall });
  } catch (err) { console.log("skip", f, err.message); }
}

const MAE = a => a.length ? a.reduce((s, x) => s + Math.abs(x), 0) / a.length : NaN;
const bias = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
const rnd = x => Math.round(x * 100) / 100;

function analyze(name, getScores, pool) {
  const rows = pool.map(e => {
    const s = getScores(e);
    if (!s) return null;
    const overall = s.overall !== undefined ? s.overall : Object.values(s.scores || s).reduce((a, b) => a + b, 0) / 4;
    return { band: e.band, overall, per: s.scores || s };
  }).filter(Boolean);
  if (!rows.length) return null;
  const dAll = rows.map(r => r.overall - r.band);
  const perCrit = {};
  Object.keys(rows[0].per).forEach(c => {
    perCrit[c] = { mae: rnd(MAE(rows.map(r => (r.per[c] || 0) - r.band))), bias: rnd(bias(rows.map(r => (r.per[c] || 0) - r.band))) };
  });
  return {
    n: rows.length,
    overallMAE: rnd(MAE(dAll)),
    overallBias: rnd(bias(dAll)),
    perCrit,
    byBand: Object.entries(rows.reduce((acc, r) => { (acc[r.band] = acc[r.band] || []).push(r.overall - r.band); return acc; }, {}))
      .map(([b, arr]) => `官方${b}: 均偏移${rnd(bias(arr))} (n=${arr.length})`).join(" · ")
  };
}

// LLM：全体 / T2 / T1
const llmT2 = llm.filter(x => x.task === 2);
const llmT1 = llm.filter(x => x.task === 1);
const ruleMap = {};
rule.forEach(r => ruleMap[`${r.book}-${r.test}-${r.task}`] = r);
const ruleT2 = cal.filter(e => e.task === 2 && e.kind === "sample").map(e => ruleMap[`${e.book}-${e.test}-${e.task}`]).filter(Boolean);

console.log("========== LLM 盲评（评分员按官方量表+Simon方法论） ==========");
const aAll = analyze("LLM全部", e => llm.find(x => x.book === e.book && String(x.test) === e.test && x.task === e.task), cal.filter(e => e.kind === "sample"));
console.log(`全体 n=${aAll.n} MAE=${aAll.overallMAE} 偏移=${aAll.overallBias}`);
console.log("  分项:", JSON.stringify(aAll.perCrit));
console.log("  分档:", aAll.byBand);
const aT2 = analyze("LLM T2", e => llm.find(x => x.book === e.book && String(x.test) === e.test && x.task === e.task), llmT2);
console.log(`T2 n=${aT2.n} MAE=${aT2.overallMAE} 偏移=${aT2.overallBias} | 分档: ${aT2.byBand}`);
const aT1 = analyze("LLM T1", e => llm.find(x => x.book === e.book && String(x.test) === e.test && x.task === e.task), llmT1);
console.log(`T1 n=${aT1.n} MAE=${aT1.overallMAE} 偏移=${aT1.overallBias}（TA 受图表缺失影响，仅参考）| 分项: ${JSON.stringify(aT1.perCrit)}`);

console.log("\n========== 规则引擎（T2） ==========");
const rRows = ruleT2.map(r => {
  const vals = Object.values(r.ruleScores);
  return { band: r.band, overall: vals.reduce((a, b) => a + b, 0) / 4, per: r.ruleScores };
});
const rA = analyze("规则T2", e => { const k = `${e.book}-${e.test}-${e.task}`; const r = ruleMap[k]; return r && r.task === 2 ? { overall: Object.values(r.ruleScores).reduce((a, b) => a + b, 0) / 4, scores: r.ruleScores } : null; }, cal.filter(e => e.task === 2 && e.kind === "sample"));
if (rA) { console.log(`T2 n=${rA.n} MAE=${rA.overallMAE} 偏移=${rA.overallBias}`); console.log("  分项:", JSON.stringify(rA.perCrit)); console.log("  分档:", rA.byBand); }

// 逐篇明细（写文件供报告引用）
fs.writeFileSync("calibration/analysis.json", JSON.stringify({ llm: { all: aAll, t2: aT2, t1: aT1 }, ruleT2: rA, detail: llm }, null, 1));
console.log("\nsaved: calibration/analysis.json");
