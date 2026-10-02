/* data-plan.js — 学习路线 + 高频错误清单 */
const Plan = {
  intro: "用真实作答决定下一步：独立写 → 找一个瓶颈 → 看懂反馈并自己改写 → 隔天换题 → 用完整答卷校验。按表现推进，适用于不同起点和备考时长；没有保证提分的固定周数。",
  weeks: [
    { t: "先诊断 · 用独立作答找真实瓶颈", items: [
      "先各写一份 Task 1 和 Task 2；尝试考场时间，写不完也保留原样。记录是否超时、查词或看过范文。",
      "按官方四项标准核对；有条件时让老师评阅一份基线答卷。规则提示和 AI 分数只能辅助判断。",
      "从原文选一个最影响理解或完成任务的问题。句子错误多，就先修稳定出现的一类错误；论证薄弱，就练解释和支撑。"] },
    { t: "再修复 · 让反馈变成自己的新作答", items: [
      "在今日训练完成一项短练习：语法与搭配练新句，立场与论证练段落，字数与内容覆盖练整篇。",
      "自己先试；卡住时看少量提示或一段范文，指出它怎样解决问题。合上材料，用自己的内容再写。",
      "逐项核对成功标准，摘出作答证据。反复失败就缩小任务或请老师解释，避免反复套同一答案。",
      "词伙优先收集自己确实需要却不会写的表达；复习时从意思写出英文，再在另一题中造句。"] },
    { t: "撤掉帮助 · 隔天换题检验", items: [
      "到期复测优先。使用未记录练过的题，先凭记忆写，再看标准和反馈。",
      "独立通过后逐步拉开间隔；用了提示也保存为学习成果，但次日换题再试，不计入独立通过次数。",
      "1、3、7 天是可执行的产品默认间隔，不是对所有人最优。连续三次独立自查通过后，再在完整答卷里验证。"] },
    { t: "持续校验 · 用新题整篇写作决定是否进阶", items: [
      "建议每周至少留一份未练过的新题限时答卷。短练习不能替代整篇组织与时间管理；定期完整连写两项。",
      "Task 1 约 20 分钟、至少 150 词；Task 2 约 40 分钟、至少 250 词。Task 2 权重更高，但两项都要练。",
      "看最近几份可比答卷中同类问题是否减少，尽量用同一量表和外部评阅。自查与 AI 分数分开看。",
      "准确性稳定后，增加解释的深度、措辞的精确度和结构的灵活性。若成绩停滞，重新诊断瓶颈，不只增加刷题量。"] }
  ],
  rules: [
    "回答题目并发展相关观点。考官同时评价内容、组织、词汇和语法。",
    "衔接要表达真实关系。没有必须使用或一用就扣分的连接词清单。",
    "词语要准确、得体且有足够范围；生词数量不等于词汇分。",
    "四段结构可作为脚手架。官方没有固定段数、句数或主体段占 70% 分数的规则。",
    "观点需要解释与支撑。具体例子是一种办法，不要求每段都有 For example。"
  ],
  mistakes: [
    { bad: "Although tourism has many benefits, but it also has drawbacks.", good: "Although tourism has many benefits, it also has drawbacks.", why: "although 与 but 不共存" },
    { bad: "Many people believe that, parents should be strict.", good: "Many people believe that parents should be strict.", why: "that 后不加逗号" },
    { bad: "We have many types of music, we need music for various reasons.", good: "We have many types of music, and we need music for various reasons.", why: "逗号不能连接两个完整句" },
    { bad: "The people is more happier.", good: "People are happier.", why: "people 复数 + 比较级不加 more" },
    { bad: "If the international music would replace it, the whole historical experience will die.", good: "If international music replaced it, the whole historical experience of a country would disappear.", why: "if 从句不用 would，主句 will→would" },
    { bad: "It is clear cut evidence why we need for music.", good: "There is clear evidence that we need music.", why: "need 及物，不加 for" },
    { bad: "Advertisement should be regulated.（指行业时）", good: "Advertising should be regulated. / Advertisements should be regulated.", why: "advertising=行业不可数，advertisement=单个广告" },
    { bad: "Canada was 19 million tonnes.（Task 1）", good: "Canada exported about 19 million tonnes of wheat.", why: "国家不能“是”吨数" },
    { bad: "some people think... other people think...（观点题全文）", good: "I believe... For example...（自己的观点+论证）", why: "观点题问的是你的看法" }
  ]
};
