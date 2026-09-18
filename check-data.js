/* check-data.js — 内容质量门禁：全部 data-*.js 的 schema 校验 + 引用一致性
 * 用法: node check-data.js   （失败退出码 1，输出定位到具体条目）
 */
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "tool", "js");

let pass = 0, fail = 0;
const problems = [];
function check(cond, msg) {
  if (cond) { pass++; }
  else { fail++; problems.push(msg); if (problems.length <= 60) console.log("  ✗ " + msg); }
}

// ---------- 加载全部数据 ----------
const dataFiles = ["data-questions.js", "data-questions-extra.js", "data-questions-recent.js", "data-questions-c1921.js",
  "data-essays-corpus.js", "data-t1-essays.js", "data-context-cards.js", "data-topics.js", "data-collocations.js",
  "data-essays.js", "data-t1.js", "data-plan.js", "data-model-essays.js", "data-t1-charts.js", "data-jijing.js",
  "data-tutor-precache-t2.js", "data-tutor-precache-t1.js", "analyzer.js", "checker.js", "training.js"];
const code = dataFiles.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n")
  + "\n;({ QuestionBank, ExtraQuestions, RecentQuestions, QuestionsC1921, EssayCorpus, T1EssayCorpus, ContextCards, TopicsLibrary, Collocations, ModelEssays, T1ChartImgs, TutorPrecache, trainingPool, tKey, Analyzer, JijingQuestions })";
const ctx = vm.createContext({ console, Math, JSON });
const D = vm.runInContext(code, ctx, { filename: "check-data-bundle.js" });

const T2TYPES = ["opinion", "discussion", "adv-disadv", "adv-disadv-opinion", "problem-solution", "two-part"];

// ---------- 1. 题库 schema ----------
console.log("== 1. 题库 schema ==");
const banks = [
  ["QuestionBank", D.QuestionBank], ["ExtraQuestions", D.ExtraQuestions],
  ["RecentQuestions", D.RecentQuestions], ["QuestionsC1921", D.QuestionsC1921]
];
const seen = new Set();
let qTotal = 0;
for (const [name, bank] of banks) {
  (bank || []).forEach((q, i) => {
    qTotal++;
    const id = `${name}[${i}] ${q.src || "?"}`;
    check(typeof q.src === "string" && q.src.length >= 5, `${id}: src 缺失或过短`);
    check(typeof q.t2 === "string" && q.t2.length >= 60, `${id}: T2 题干缺失或过短`);
    check(T2TYPES.includes(q.t2type), `${id}: 未知题型 ${q.t2type}`);
    const dupKey = q.src + "|" + q.t2.slice(0, 50);
    check(!seen.has(dupKey), `${id}: 与已有题目重复（同源同题干前缀）`);
    seen.add(dupKey);
    if (q.t1 && !/详见原书/.test(q.t1)) {
      check(q.t1.length >= 80, `${id}: T1 题干过短`);
      check(typeof q.t1type === "string" && q.t1type.length >= 3, `${id}: 有 T1 题干但缺 t1type`);
    }
    if (/剑\d+\s+Test/.test(q.src)) check(/剑\d+\s+Test\s*\d+/.test(q.src), `${id}: 剑桥题 src 格式异常: ${q.src}`);
  });
}
console.log(`  题库共 ${qTotal} 条`);

// ---------- 2. 范文 + 教学包（ModelEssays 覆盖剑15-21；剑10-14 走 Simon 语料/AI 兜底） ----------
console.log("== 2. 范文库 ==");
const meKeys = Object.keys(D.ModelEssays);
check(meKeys.length >= 56, `ModelEssays 应 ≥56 篇，实际 ${meKeys.length}`);
const pool = D.trainingPool();
const pool1521 = pool.filter(q => q.book >= 15 && q.book <= 21 && !q.jijing);
check(pool1521.length === meKeys.length, `剑15-21 题目 ${pool1521.length} 与范文库 ${meKeys.length} 不一致`);
pool1521.forEach(q => {
  const k = D.tKey(q);
  check(!!D.ModelEssays[k], `训练营题目 ${k} 缺范文`);
});

// ---------- 3. 预生成审题课/读图课（覆盖剑15-21） ----------
console.log("== 3. 预生成审题课 ==");
const pcKeys = Object.keys(D.TutorPrecache);
check(pcKeys.length === pool1521.length, `TutorPrecache 应 ${pool1521.length} 条，实际 ${pcKeys.length}`);
pool1521.forEach(q => {
  const k = D.tKey(q), d = D.TutorPrecache[k];
  check(!!d, `缺少预生成课: ${k}`);
  if (!d) return;
  const t1 = k.endsWith(" T1");
  check(typeof d.typeExplain === "string" && d.typeExplain.length >= 40, `${k}: typeExplain 缺失或过短`);
  check(Array.isArray(d.stanceOptions) && d.stanceOptions.length >= 3, `${k}: stanceOptions 不足 3 项`);
  (d.stanceOptions || []).forEach((o, oi) => check(o.s && o.why && o.difficulty, `${k}[方案${oi}]: 缺 s/why/difficulty`));
  check(typeof d.recommended === "string" && d.recommended.length >= 2, `${k}: recommended 缺失`);
  check(typeof d.recommendedWhy === "string" && d.recommendedWhy.length >= 10, `${k}: recommendedWhy 过短`);
  check(d.ideaOutline && d.ideaOutline.body1 && d.ideaOutline.body2, `${k}: ideaOutline 缺 body1/body2`);
  check(typeof d.guideQ === "string" && d.guideQ.length >= 8, `${k}: guideQ 缺失`);
});

// ---------- 4. T1 图表映射（覆盖剑10-21 全部小作文） ----------
console.log("== 4. T1 图表 ==");
const imgKeys = Object.keys(D.T1ChartImgs || {});
check(imgKeys.length >= 48, `T1ChartImgs 应 ≥48 项，实际 ${imgKeys.length}`);
imgKeys.forEach(k => {
  const p = path.join(__dirname, "tool", D.T1ChartImgs[k]);
  check(fs.existsSync(p), `T1ChartImgs[${k}]: 图片文件不存在 ${D.T1ChartImgs[k]}`);
  if (fs.existsSync(p)) check(fs.statSync(p).size > 8000, `T1ChartImgs[${k}]: 图片过小，疑似损坏`);
});
pool.filter(q => q.task === 1).forEach(q => {
  if (q.jijing) return; // 机经 T1 为文字描述题，无原书图
  check(!!(D.T1ChartImgs || {})[q.src], `小作文 ${q.src} 无图表映射`);
});

// ---------- 5. 词伙与语境卡 ----------
console.log("== 5. 词伙/语境卡 ==");
let collTotal = 0;
Object.entries(D.Collocations.BY_TOPIC).forEach(([topic, arr]) => {
  check(Array.isArray(arr) && arr.length > 0, `词伙话题 ${topic} 为空`);
  arr.forEach((c, i) => check(c.en && c.zh, `词伙 ${topic}[${i}]: 缺 en/zh`));
  collTotal += arr.length;
});
console.log(`  词伙共 ${collTotal} 条`);
const ccList = (D.ContextCards && D.ContextCards.cards) || D.ContextCards || [];
check(Array.isArray(ccList) && ccList.length >= 800, `语境卡应 ≥800 条，实际 ${Array.isArray(ccList) ? ccList.length : "?"}`);
ccList.forEach((c, i) => {
  check(c.en && c.zh && c.topic, `语境卡[${i}] ${c.en || "?"}: 缺 en/zh/topic`);
  check(Array.isArray(c.contexts) && c.contexts.length >= 1, `语境卡[${i}] ${c.en}: 无语境句`);
  (c.contexts || []).forEach((x, xi) => check(x.sent && x.src, `语境卡[${i}][${xi}]: 缺 sent/src`));
});

// ---------- 6. 话题思路库 ----------
console.log("== 6. 话题思路库 ==");
check((D.TopicsLibrary || []).length >= 20, `话题库应 ≥20 个话题，实际 ${(D.TopicsLibrary || []).length}`);
D.TopicsLibrary.forEach(t => {
  check(t.name, `话题缺 name`);
  const n = (t.pro || []).length + (t.con || []).length + (t.neutral || []).length;
  check(n >= 10, `话题「${t.name}」观点数过少（${n}）`);
});

// ---------- 7. 机经/考场题来源完整性（recall） ----------
console.log("== 7. 机经/考场题来源 ==");
(D.RecentQuestions || []).forEach((q, i) => {
  check(/来源|回忆|双源|印证|考区|ielts/i.test(q.src || ""), `RecentQuestions[${i}]: 缺来源信息 (${q.src})`);
});
const JijingQuestions = D.JijingQuestions || [];
check(Array.isArray(JijingQuestions) && JijingQuestions.length >= 30, `机经补充批次应 ≥30 道，实际 ${JijingQuestions.length}`);
JijingQuestions.forEach((q, i) => {
  check(/^机经 \d{4}年/.test(q.src || ""), `Jijing[${i}]: src 应为「机经 YYYY年…」格式 (${q.src})`);
  if (q.t2) {
    check(q.t2.length >= 60, `Jijing[${i}]: T2 题干过短`);
    check(T2TYPES.includes(q.t2type), `Jijing[${i}]: 未知题型 ${q.t2type}`);
  } else {
    check(q.t1 && q.t1.length >= 80 && /机经·文字描述/.test(q.t1), `Jijing[${i}]: T1 文字描述缺失`);
    check(!!q.t1type, `Jijing[${i}]: T1 缺 t1type`);
  }
});
const recallTotal = (D.RecentQuestions || []).length + JijingQuestions.length;
check(recallTotal >= 110, `机经总题量应 ≥110，实际 ${recallTotal}`);
console.log(`  机经总题量（回忆+补充）：${recallTotal} 道`);

// ---------- 8. 汇总 ----------
console.log(`\n门禁结果: ${pass} 项通过, ${fail} 项失败`);
if (fail > 0) {
  console.log(`（仅显示前 60 条，共 ${problems.length} 条问题）`);
  process.exit(1);
}
console.log("✅ 内容质量门禁全部通过");
