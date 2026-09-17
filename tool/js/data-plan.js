/* data-plan.js — 学习路线 + 高频错误清单 */
const Plan = {
  intro: "目标 6.5 → 7.5 的最短路径（4–8 周，每天约 1 小时）。核心原则（Simon）：把“想”和“写”分开；分项练比整篇练涨分快；先慢后快——第一篇用 4 小时写对，比 40 分钟写错强。",
  weeks: [
    { t: "第 1 周 · 只练审题", items: [
      "通读《01-Task2核心方法论》和《03-评分标准与自查清单》",
      "用「审题室」把题库 18 道剑桥 Task 2 全部只审题+列提纲（不写全文）",
      "每道题再做一次「✏️ 提纲训练」，做到 10 分钟内提纲完整度 100%",
      "每天「⚡闪卡-语境填空」10 张 + 「今日复习」清零（在语境里记，不死背中英对照）"] },
    { t: "第 2-3 周 · 分项突破", items: [
      "每天 5 个开头（2 句版）或 3 个主体段或 5 个一句话结尾",
      "每周写 2 篇全文（不限时），写完用「诊断室」扫硬伤并保存记录",
      "「题库·范文 → Simon 范文全库」里搜本题话题的考官范文，仿写升级",
      "写前先去「弹药库-话题观点库」借 2-3 条观点"] },
    { t: "第 4-5 周 · 限时模考", items: [
      "每周 3 篇 40 分钟限时作文（写作室计时器）",
      "每周 1 次「🎓 全真模考」（Task 1 20 分钟 → Task 2 40 分钟连考）",
      "每篇写完：诊断室 → 自评清单 → 保存记录看走势",
      "小作文同步：先背《04-Task1指南》语言库，每种图写 2 篇",
      "词伙积累转入“错词本”：把自己写过的中式表达换成词伙，加⭐进词本用闪卡复习"] },
    { t: "第 6-8 周 · 考前打磨", items: [
      "每周 2 套完整模考（Task1 20min + Task2 40min）",
      "高频错误清单（下方）过 3 遍，重点消灭“系统性小错”",
      "把 20 个常考话题的观点各复习一遍（弹药库-话题观点库 + ⚡闪卡过星本）",
      "考前一周：只复习自己的收藏本 + 范文背诵段落"] }
  ],
  rules: [
    "写作铁律 1：观点好不好不是重点，能不能用英语展开才是（考官只看表达）",
    "写作铁律 2：连接词之间的内容才值钱（Simon 30 篇 9 分范文 Moreover 出现 0 次）",
    "写作铁律 3：band 7 词汇 = 主题词伙，不是大词（demerits/utilize 反而扣分）",
    "写作铁律 4：主体段占 70% 篇幅和分数，开头结尾短平快",
    "写作铁律 5：每个观点都要 explain + example，“提及”不算“论证”"
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
