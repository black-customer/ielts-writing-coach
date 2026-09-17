/* gen-grading.js — 生成盲评任务文件（含题目文本） */
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "tool", "js");
const files = ["data-questions.js", "data-questions-extra.js", "data-questions-recent.js", "data-topics.js", "data-collocations.js", "data-essays.js", "data-t1.js", "data-plan.js", "analyzer.js", "checker.js"];
const code = files.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n") + "\n;({ QuestionBank })";
const { QuestionBank } = vm.runInContext(code, vm.createContext({ console, Math, JSON }));

const cal = JSON.parse(fs.readFileSync("calibration/essays_v2.json", "utf8"));
function findBank(book, test, task) {
  const t = String(test);
  return QuestionBank.find(q => {
    const m = q.src.match(/剑(\d+)\s+Test\s+(\w+)/);
    return m && Number(m[1]) === book && m[2] === t && (task === 2 ? !!q.t2 : !!q.t1);
  });
}
fs.mkdirSync("calibration/grading", { recursive: true });
let idx = 0;
const manifest = [];
for (const e of cal) {
  const bank = findBank(e.book, e.test, e.task);
  const q = bank ? (e.task === 2 ? bank.t2 : bank.t1) : null;
  const kind = e.task === 2 ? "Task 2（议论文）" : "Task 1（图表作文，图表未提供）";
  const out = `calibration/grading/grade_${String(idx).padStart(2, "0")}_b${e.book}_t${e.test}_${e.task}.json`;
  const content = `【评分任务】IELTS Academic Writing ${kind}
${q ? `【题目原文】\n${q}` : "【题目原文】（缺失，按作文内容自行判断）"}

【考生作文】
${e.text}

【输出要求】严格输出 JSON（不要 markdown 代码块），格式：
{"scores":{"TR":x,"CC":x,"LR":x,"GRA":x},"overall":x,"reason":"每项一句话依据（中文）"}
x 为 0-9 的分数，可带 0.5。Task 1 若图表缺失，TR 按作文内部数据一致性保守评估。
`;
  fs.writeFileSync(`calibration/grading/task_${String(idx).padStart(2, "0")}_b${e.book}_t${e.test}_${e.task}.txt`, content);
  manifest.push({ taskFile: `calibration/grading/task_${String(idx).padStart(2, "0")}_b${e.book}_t${e.test}_${e.task}.txt`, out, kind, band: e.band, book: e.book, test: String(e.test), task: e.task });
  idx++;
}
const chunks = [manifest.filter((_, i) => i % 5 === 0), manifest.filter((_, i) => i % 5 === 1), manifest.filter((_, i) => i % 5 === 2), manifest.filter((_, i) => i % 5 === 3), manifest.filter((_, i) => i % 5 === 4)];
chunks.forEach((chunk, gi) => {
  fs.writeFileSync(`calibration/grade_chunk_${gi}.json`, JSON.stringify(chunk, null, 1));
});
console.log("grading tasks:", idx, "chunks:", chunks.map(c => c.length).join("/"));
