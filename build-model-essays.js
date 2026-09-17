/* build-model-essays.js — 合并 models/gen/*.json → tool/js/data-model-essays.js（含质量验收）
 * 用法: node build-model-essays.js
 */
const fs = require("fs");
const path = require("path");

const genDir = "models/gen";
const outFile = "tool/js/data-model-essays.js";

// ---------- 读取全部批次 ----------
const batches = fs.readdirSync(genDir).filter(f => f.endsWith(".json")).sort();
const merged = {};
let count = 0;
for (const f of batches) {
  const data = JSON.parse(fs.readFileSync(path.join(genDir, f), "utf8"));
  for (const [qKey, entry] of Object.entries(data)) {
    if (merged[qKey]) console.log(`  ⚠ 覆盖 ${qKey}（${f} 为更新版）`);
    merged[qKey] = entry;
  }
}
count = Object.keys(merged).length;

// ---------- 质量验收 ----------
const problems = [];
const isT1 = qKey => qKey.endsWith(" T1");
for (const [qKey, e] of Object.entries(merged)) {
  const t1 = isT1(qKey);
  const words = e.essay.trim().split(/\s+/).length;
  const paras = e.essay.split(/\n\s*\n/);
  if (paras.length !== 4) problems.push(`${qKey}: 段落数 ${paras.length} ≠ 4`);
  if (t1 && (words < 150 || words > 200)) problems.push(`${qKey}: T1 词数 ${words} 超出 150-200`);
  if (!t1 && (words < 250 || words > 340)) problems.push(`${qKey}: T2 词数 ${words} 超出 250-340`);
  const keys = Object.keys(e.paraTeach || {});
  if (keys.length !== 4 || ["2", "3", "4", "5"].some(k => !keys.includes(k)))
    problems.push(`${qKey}: paraTeach 段落键不完整: ${keys.join(",")}`);
  for (const [k, p] of Object.entries(e.paraTeach || {})) {
    if (!p.why || p.why.length < 30) problems.push(`${qKey}[${k}]: why 缺失或太短`);
    if (!p.modelPara || p.modelPara.length < 30) problems.push(`${qKey}[${k}]: modelPara 缺失`);
    else if (!e.essay.includes(p.modelPara)) problems.push(`${qKey}[${k}]: modelPara 不是范文原文的逐字片段`);
    if (!Array.isArray(p.expressions) || p.expressions.length < 2)
      problems.push(`${qKey}[${k}]: expressions 少于2条`);
    else for (const x of p.expressions) {
      const bare = x.en.replace(/\.{3}$/, "").trim(); // 容忍"…"省略号后缀
      if (!e.essay.includes(bare) && !(p.modelPara || "").includes(bare))
        problems.push(`${qKey}[${k}]: 表达未出现在范文中: ${x.en}`);
    }
    if (!p.guideQ) problems.push(`${qKey}[${k}]: guideQ 缺失`);
  }
  if (t1 && !e.chartNote) problems.push(`${qKey}: T1 缺 chartNote`);
}
if (problems.length) {
  console.error("❌ 质量验收未通过：");
  problems.forEach(p => console.error("  - " + p));
  process.exit(1);
}

// ---------- 排序：按 册 → Test → Task ----------
const order = {};
for (const qKey of Object.keys(merged)) {
  const m = qKey.match(/剑(\d+) Test (\d+) T(\d)/);
  order[qKey] = (+m[1]) * 1000 + (+m[2]) * 10 + (+m[3]);
}
const sortedKeys = Object.keys(merged).sort((a, b) => order[a] - order[b]);

// ---------- 生成 JS ----------
const lines = sortedKeys.map(qKey => {
  const e = merged[qKey];
  const body = [`    source: ${JSON.stringify(e.source)}`];
  if (e.chartNote) body.push(`    chartNote: ${JSON.stringify(e.chartNote)}`);
  body.push(`    essay: ${JSON.stringify(e.essay)}`);
  const teach = Object.entries(e.paraTeach).map(([k, p]) => {
    const rows = [`        why: ${JSON.stringify(p.why)}`, `        modelPara: ${JSON.stringify(p.modelPara)}`];
    rows.push(`        expressions: [\n` + p.expressions.map(x => `          { en: ${JSON.stringify(x.en)}, zh: ${JSON.stringify(x.zh)} }`).join(",\n") + `\n        ]`);
    rows.push(`        guideQ: ${JSON.stringify(p.guideQ)}`);
    return `      "${k}": {\n` + rows.join(",\n") + `\n      }`;
  });
  body.push(`    paraTeach: {\n` + teach.join(",\n") + `\n    }`);
  return `  "${qKey}": {\n` + body.join(",\n") + `\n  }`;
});

const out = `/* data-model-essays.js — 预生成考官级范文 + 逐段教学包（由 build-model-essays.js 自动生成，勿手改）
 * 源文件: models/gen/*.json ｜ 质量标准: knowledge/13-我的写作体系.md
 * 结构: ModelEssays[qKey] = { source, chartNote?(T1), essay, paraTeach: {"2".."5": {why, modelPara, expressions, guideQ}} }
 */
const ModelEssays = {
${lines.join(",\n")}
};
`;
fs.writeFileSync(outFile, out, "utf8");
console.log(`✅ 已生成 ${outFile}：${count} 篇（剑15-21 目标 56）`);
sortedKeys.forEach(k => {
  const w = merged[k].essay.trim().split(/\s+/).length;
  console.log(`   ${k}  ${w}词`);
});
