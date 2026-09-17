/* build-context-cards.js — 从考官范文中为每个词伙抽取语境句，生成 data-context-cards.js
 * 用法：node build-context-cards.js （语料/词伙库更新后重跑）
 */
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "tool", "js");
const ROOT = __dirname;
const files = ["data-questions.js", "data-questions-extra.js", "data-questions-recent.js", "data-essays-corpus.js", "data-t1-essays.js", "data-topics.js", "data-collocations.js", "data-essays.js", "data-t1.js", "data-plan.js", "analyzer.js", "checker.js"];
const code = files.filter(f => fs.existsSync(path.join(dir, f))).map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n")
  + "\n;({ Collocations, EssayCorpus: typeof EssayCorpus !== 'undefined' ? EssayCorpus : [], T1EssayCorpus: typeof T1EssayCorpus !== 'undefined' ? T1EssayCorpus : [] })";
const { Collocations, EssayCorpus, T1EssayCorpus } = vm.runInContext(code, vm.createContext({ console, Math, JSON }));

const norm = s => (s || "").toLowerCase().replace(/[''`]/g, "'").replace(/[^a-z'\s]/g, " ").replace(/\s+/g, " ").trim();
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 语料池：大作文 + 小作文（每篇带题目与来源）
const corpus = [
  ...(typeof EssayCorpus !== "undefined" ? EssayCorpus : []).map(e => ({ q: e.q || "", src: e.src || "范文", text: e.essay, kind: "t2" })),
  ...(typeof T1EssayCorpus !== "undefined" ? T1EssayCorpus : []).map(e => ({ q: e.q || "", src: e.src || "范文", text: e.essay, kind: "t1" }))
];

// 预切句
const allSents = [];
for (const doc of corpus) {
  for (const para of doc.text.split(/\n\s*\n/)) {
    for (const s of para.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(x => x.length > 25)) {
      allSents.push({ sent: s.replace(/\s+/g, " "), q: doc.q, src: doc.src, kind: doc.kind });
    }
  }
}
console.log("corpus sentences:", allSents.length);

// 词伙清单（全部词伙 + 通用 + 顾家北补充），带 topic
const items = [];
for (const [topic, arr] of Object.entries(Collocations.BY_TOPIC)) {
  for (const c of arr) items.push({ en: c.en, zh: c.zh, topic, source: "topic" });
}
for (const c of Collocations.UNIVERSAL) items.push({ en: c.en, zh: c.zh, topic: c.group || "通用", source: "universal" });
for (const c of (Collocations.GUJIABEI_EXTRA || [])) items.push({ en: c.en, zh: c.zh, topic: "通用", source: "universal" });

// 去重（同一 en 取第一次出现的 topic）
const seen = new Set();
const uniq = [];
for (const it of items) {
  const k = norm(it.en);
  if (!k || k.length < 6 || seen.has(k)) continue;
  seen.add(k);
  uniq.push(it);
}

// 挖空：把句中的词伙替换为等词数的下划线（含词尾变化）
function blankSentence(sent, phrase) {
  const rx = phraseRx(phrase);
  const m = sent.match(rx);
  if (!m) return null;
  const baseWords = norm(phrase).split(" ").length;
  const blank = Array.from({ length: baseWords }, (_, i) => `<b class="w${i}">${i === 0 ? "________" : "______"}</b>`).join(" ");
  return sent.replace(rx, blank);
}
// 词伙匹配正则：允许每个词带 s/es/ed/ing/d 词尾变化（如 play→plays/played/playing）
function phraseRx(phrase) {
  const words = norm(phrase).split(" ").filter(Boolean);
  const parts = words.map(w => {
    const e = escRe(w);
    if (w.length <= 3) return e;
    return e + "(?:s|es|ed|d|ing)?";
  });
  return new RegExp("\\b" + parts.join("\\s+") + "\\b", "i");
}

const cards = [];
let withCtx = 0;
// AI 生成的示例句（标注来源；文件由生成小分队产出，缺席时跳过）
const genCtx = {};
for (let i = 0; i < 8; i++) {
  const fp = path.join(ROOT, "calibration", `ctx_gen_${i}.json`);
  if (!fs.existsSync(fp)) continue;
  try {
    for (const g of JSON.parse(fs.readFileSync(fp, "utf8"))) {
      const k = norm(g.en);
      if (!k) continue;
      (genCtx[k] = genCtx[k] || []).push(g.sent);
    }
  } catch (e) { console.log("skip ctx_gen_" + i + ": " + e.message); }
}
console.log("AI 生成例句覆盖词伙:", Object.keys(genCtx).length);

for (const it of uniq) {
  const rx = phraseRx(it.en);
  const contexts = [];
  const seenSent = new Set();
  for (const s of allSents) {
    if (contexts.length >= 3) break;
    if (rx.test(s.sent) && !seenSent.has(s.sent)) {
      seenSent.add(s.sent);
      contexts.push({ sent: s.sent, q: (s.q || "").slice(0, 160), src: s.src });
    }
  }
  if (contexts.length) withCtx++;
  // 补充 AI 示例句（真实范文语境优先，最多保留 3 个语境）
  const gen = genCtx[norm(it.en)] || [];
  for (const sent of gen) {
    if (contexts.length >= 3) break;
    if (!contexts.some(c => norm(c.sent) === norm(sent))) contexts.push({ sent, q: "", src: "AI 示例句" });
  }
  cards.push({ en: it.en, zh: it.zh, topic: it.topic, contexts });
}

const withMulti = cards.filter(c => c.contexts.length >= 2).length;
const totalCtx = cards.reduce((a, c) => a + c.contexts.length, 0);

const js = "/* data-context-cards.js — 词伙语境卡（由考官范文自动抽取；node build-context-cards.js 可重生成） */\n"
  + "const ContextCards = " + JSON.stringify({ generated: new Date().toISOString().slice(0, 10), cards }, null, 0).replace(/\{"en"/g, "\n  {\"en\"") + ";";
fs.writeFileSync(path.join(dir, "data-context-cards.js"), js);

console.log(`词伙总数 ${cards.length}，有语境的 ${withCtx}，多语境(≥2)的 ${withMulti}，语境句总数 ${totalCtx}`);
const noCtxTopics = {};
cards.filter(c => !c.contexts.length).forEach(c => noCtxTopics[c.topic] = (noCtxTopics[c.topic] || 0) + 1);
console.log("无语境分布:", JSON.stringify(noCtxTopics));
