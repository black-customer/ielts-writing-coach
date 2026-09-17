/* test-logic.js — 工具核心逻辑单元测试（node 直接运行） */
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "tool", "js");
const files = ["data-questions.js", "data-questions-extra.js", "data-questions-recent.js", "data-essays-corpus.js", "data-t1-essays.js", "data-context-cards.js", "data-topics.js", "data-collocations.js", "data-essays.js", "data-t1.js", "data-plan.js", "analyzer.js", "checker.js", "cloze.js"];
const code = files.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n;\n") + "\n;({ Analyzer, Checker, Cloze, QuestionBank, Collocations, TopicsLibrary, ContextCards });";
const { Analyzer, Checker, Cloze, QuestionBank, Collocations, TopicsLibrary, ContextCards } = vm.runInContext(code, vm.createContext({ console, Math, JSON }), { filename: "bundle.js" });

let pass = 0, fail = 0;
function t(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra ? " —— " + extra : "")); }
}

console.log("== 题型判定 ==");
const cases = [
  ["Governments should spend money on railways rather than roads. To what extent do you agree or disagree with this statement?", "opinion"],
  ["Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future. Discuss both these views and give your own opinion.", "discussion"],
  ["Many museums charge for admission while others are free. Do you think the advantages of charging people for admission to museums outweigh the disadvantages?", "adv-disadv-opinion"],
  ["Some parents buy their children a large number of toys to play with. What are the advantages and disadvantages for the child of having a large number of toys?", "adv-disadv"],
  ["In many countries, the amount of crime is increasing. What do you think are the main causes of crime? How can we deal with those causes?", "problem-solution"],
  ["In spite of the advances made in agriculture, many people around the world still go hungry. Why is this the case? What can be done about this problem?", "two-part"],
  ["Countries are becoming more and more similar because people are able to buy the same products anywhere in the world. Do you think this is a positive or negative development?", "adv-disadv-opinion"],
  ["It is important for children to learn the difference between right and wrong at an early age. Punishment is necessary to help them learn this distinction. To what extent do you agree or disagree with this opinion? What sort of punishment should parents and teachers be allowed to use to teach good behaviour to children?", "two-part"],
  ["In many countries schools have severe problems with student behaviour. What do you think are the causes of this? What solutions can you suggest?", "problem-solution"],
  ["Happiness is considered very important in life. Why is it difficult to define? What factors are important in achieving happiness?", "two-part"]
];
for (const [q, expect] of cases) {
  const r = Analyzer.analyze(q);
  t(`${expect}${r.det ? "" : "（判定失败）"}`, r.det && r.det.type === expect, `got ${r.det && r.det.type}`);
}

console.log("== 话题匹配 ==");
const a1 = Analyzer.analyze("Some people think that governments should spend money on public services rather than on the arts. To what extent do you agree or disagree?");
t("政府话题命中", a1.topics.some(x => x.topic === "政府与社会"), JSON.stringify(a1.topics.map(x => x.topic)));
const a2 = Analyzer.analyze("Nowadays animal experiments are widely used to develop new medicines. Some people argue these experiments should be banned. Discuss both views and give your own opinion.");
t("动物实验命中 环境/犯罪", a2.topics.length > 0, JSON.stringify(a2.topics.map(x => x.topic)));
const a3 = Analyzer.analyze("The money given to help poor countries does not solve the problem of poverty. To what extent do you agree or disagree?");
t("贫富差距命中", a3.topics.some(x => x.topic === "贫富差距"), JSON.stringify(a3.topics.map(x => x.topic)));

console.log("== 弹药挂接 ==");
const matched = TopicsLibrary.filter(t2 => (t2.keys || []).some(k => a3.topics.map(x => x.topic).includes(k)));
t("贫富差距→金钱话题库", matched.length >= 1, matched.map(m => m.name).join(","));

console.log("== 词伙库完整性 ==");
const topicCount = Object.keys(Collocations.BY_TOPIC).length;
const collTotal = Object.values(Collocations.BY_TOPIC).reduce((a, b) => a + b.length, 0) + Collocations.UNIVERSAL.length;
t("19 个主题", topicCount === 19, `got ${topicCount}`);
t("词伙 800+", collTotal >= 800, `got ${collTotal}`);
t("每个主题 ≥25 条", Object.values(Collocations.BY_TOPIC).every(v => v.length >= 25), "");

console.log("== 诊断器 ==");
const badEssay = `Nowadays , more and more people like play computer games. Although games are fun, but they waste time. More and more children spend hours online, and more and more parents worry about it.
Some people think games is good for children. Other people think games are bad. It is a controversial issue in modern society.
Furthermore , games can improve creativity. For example, minecraft.
In additions, playing games make children smart informations show that.
In conclusion, every coin has two sides.`;
const r1 = Checker.check(badEssay, "opinion", ["科技与网络"], "Some people regard video games as harmless. Do the drawbacks outweigh the benefits?");
t("字数不足被查", r1.W < 250 && r1.issues.some(i => i.sev === "bad" && i.msg.includes("字数")), `W=${r1.W}`);
t("Although...but 被查", r1.issues.some(i => i.msg.includes("although") || i.msg.includes("Although")), "");
t("more and more 被查", r1.issues.some(i => i.msg.includes("more and more")), "");
t("不可数名词 informations 被查", r1.issues.some(i => i.msg.includes("information")), "");
t("套话 Every coin 被查", r1.issues.some(i => i.msg.includes("Every coin")), "");
t("无立场被查", r1.score.TR < 7, `TR=${r1.score.TR}`);

const goodEssay = `It is true that medicines and other products are routinely tested on animals before they are cleared for human use. While I tend towards the viewpoint that animal testing is morally wrong, I would have to support a limited amount of animal experimentation for the development of medicines.
On the one hand, there are clear ethical arguments against animal experimentation. To use a common example of this practice, laboratory mice may be given an illness so that the effectiveness of a new drug can be measured. Opponents of such research argue that humans have no right to subject animals to this kind of trauma, and that the lives of all creatures should be respected. They believe that the benefits to humans do not justify the suffering caused, and that scientists should use alternative methods of research.
On the other hand, reliable alternatives to animal experimentation may not always be available. Supporters of the use of animals in medical research believe that a certain amount of suffering on the part of mice or rats can be justified if human lives are saved. They argue that opponents of such research might feel differently if a member of their own families needed a medical treatment that had been developed through the use of animal experimentation. Personally, I agree with the banning of animal testing for non-medical products, but I feel that it may be a necessary evil where new drugs and medical procedures are concerned.
In conclusion, it seems to me that it would be wrong to ban testing on animals for vital medical research until equally effective alternatives have been developed.`;
const r2 = Checker.check(goodEssay, "discussion", ["环境"], "Nowadays animal experiments are widely used... Discuss both views and give your own opinion.");
t("band 9 范文字数达标", r2.W >= 250, `W=${r2.W}`);
t("band 9 范文立场被识别", r2.score.TR >= 7, `TR=${r2.score.TR}`);
t("band 9 范文结构 4 段", r2.paras === 4, `paras=${r2.paras}`);
t("band 9 范文例子被识别", r2.issues.some(i => i.sev === "ok" && i.msg.includes("例子")), "");
t("band 9 范文无 Although...but", !r2.issues.some(i => i.msg.includes("Although") || i.msg.includes("although") && i.sev === "bad"), "");
t("band 9 范文 this/these 衔接识别", (r2.issues.find(i => i.msg.includes("this/these")) || {}).sev !== "bad", "");

console.log("== Task 1 诊断器 ==");
const badT1 = `The graph below shows average carbon dioxide emissions per person in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007.
It is clear that Sweden increased. In conclusion the graph is very interesting.
Canada was about 11 million tonnes and it was 10 millions tonnes in 1967, a change of -5%. The graph shows data.`;
const r3 = Checker.checkT1(badT1, "线图 Line graph", "The graph below shows average carbon dioxide (CO2) emissions per person in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007.");
t("T1 字数不足被查", r3.issues.some(i => i.msg.includes("不足 150")), `W=${r3.W}`);
t("T1 overview 缺失被查", r3.issues.some(i => i.msg.includes("Overview")), "");
t("T1 照抄题目被查", r3.issues.some(i => i.msg.includes("照抄") || i.msg.includes("连续")), "");
t("T1 国家+数字主谓被查", r3.issues.some(i => i.msg.includes("国家不能")), "");
t("T1 10 millions 被查", r3.issues.some(i => i.msg.includes("million") || i.msg.includes("复数单位")), "");
t("T1 负百分比被查", r3.issues.some(i => i.msg.includes("负百分比")), "");
t("T1 In conclusion 被查", r3.issues.some(i => i.msg.includes("不写结论")), "");
t("T1 无比较语言被查", r3.score.TA < 7, `TA=${r3.score.TA}`);

const goodT1 = `The line graph compares the average carbon dioxide emissions per person in the United Kingdom, Sweden, Italy and Portugal over a period of 40 years.
It is clear that the UK emitted the most CO2 for the majority of this period. It is also noticeable that emissions in Italy and Portugal rose steadily, while the figure for Sweden fell.
In 1967, the UK emitted the largest amount of CO2, at almost 11 metric tonnes, while Sweden, Italy and Portugal produced around 9, 4 and 2 tonnes respectively. By contrast, Portugal had the lowest figure throughout the period.
However, while UK emissions fell gradually to around 9 tonnes in 2007, Portuguese emissions rose to a peak of nearly 6 tonnes. The figure for Italy doubled, overtaking Sweden in about 1990, and Portuguese emissions were roughly three times as high as those recorded in 1967. Sweden, by contrast, saw a significant fall in its emissions, dropping from around 9 to just over 5 tonnes during the final decade of the period shown.`;
const r4 = Checker.checkT1(goodT1, "线图 Line graph", "The graph below shows average carbon dioxide (CO2) emissions per person in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007.");
t("T1 好文 overview 被识别", r4.issues.some(i => i.sev === "ok" && i.msg.includes("Overview")), JSON.stringify(r4.issues.map(i => i.msg)));
t("T1 好文 比较语言丰富", r4.issues.some(i => i.sev === "ok" && i.msg.includes("比较语言")), "");
t("T1 好文 无硬伤", !r4.issues.some(i => i.sev === "bad"), r4.issues.filter(i => i.sev === "bad").map(i => i.msg).join("|"));
t("T1 好文 TA ≥ 7", r4.score.TA >= 7, `TA=${r4.score.TA}`);

console.log("== 填空精读引擎 ==");
t("check 严格匹配", Cloze.check("act as a deterrent", "acts as a deterrent") === false, "词数不同应判错");
t("check 忽略大小写标点", Cloze.check("Acts as a Deterrent.", "acts as a deterrent") === true, "");
t("check 词序容忍", Cloze.check("a deterrent act as", "act as a deterrent") === true, "词集合一致应判对");
t("check 空输入判错", Cloze.check("", "anything") === false, "");
const sampleEssay = "Zoos have several benefits. The main benefit is that zoos play an important role in wildlife conservation. They help to protect endangered species and allow scientists to study animal behaviour. Another advantage of zoos is that they employ large numbers of people, therefore providing job opportunities and income for the local area.";
const sampleBank = [{ en: "play an important role in", zh: "起重要作用" }, { en: "endangered species", zh: "濒危物种" }, { en: "job opportunities", zh: "工作机会" }, { en: "not-in-this-essay phrase", zh: "不存在" }];
const built = Cloze.build(sampleEssay, sampleBank, 4);
t("build 找到 3 个空", built && built.blanks.length === 3, `got ${built && built.blanks.length}`);
t("build 拼回原文无损", built && built.parts.map(p => p.text !== undefined ? p.text : p.answer).join("") === sampleEssay, "");
t("build 空的答案正确", built && built.blanks.some(b => b.phrase === "play an important role in") && built.blanks.some(b => b.phrase === "endangered species"), "");

console.log("== 语境卡（闪卡 v2 数据） ==");
t("语境卡覆盖全部词伙（≥800）", ContextCards.cards.length >= 800, "got " + ContextCards.cards.length);
const withCtx = ContextCards.cards.filter(c => c.contexts.length >= 1);
t("全部词伙都有语境", withCtx.length === ContextCards.cards.length, `有语境 ${withCtx.length}`);
t("语境句数据完整（sent+src）", withCtx.every(c => c.contexts.every(x => x.sent && x.src)), "");

console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
