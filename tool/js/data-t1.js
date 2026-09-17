/* data-t1.js — Task 1 小作文作战数据（源自 Simon 课程与范文规律分析） */
const T1 = {
  structure: [
    { n: 1, name: "Introduction", time: "5 分钟", rules: ["改写题干一句话：换动词（shows→compares/illustrates）+ 换核心词（the number of→the figure for）+ 换时间表达", "不要用 depict/indicate/reveal/exhibit——考官觉得奇怪", "双图可拆两句"] },
    { n: 2, name: "Overview（生死线）", time: "5 分钟", rules: ["固定两句 = 两个总体特征", "不带任何具体数字", "It is clear that... / It is also noticeable that... / Overall,...", "没有清晰 overview，TA 上不了 6（考官口径：小作文最常见错误就是没 overview）"] },
    { n: 3, name: "Details 1", time: "5 分钟", rules: ["约 3 句，≥3 个数字", "按图型的分组法（见下表）"] },
    { n: 4, name: "Details 2", time: "5 分钟", rules: ["约 3 句，≥3 个数字", "全文共 6–7 个数字，首年/末年/特殊年（峰值、交叉、剧变）必写"] }
  ],
  chartTypes: [
    { type: "线图 Line graph", rule: "永远不一条线一段！段1：首年横向对比→变化写到关键点；段2：关键点后→末年对比。时态：过去年份用过去式，禁被动/进行时", overview: "谁最高/最低 + 谁升谁降" },
    { type: "柱图 Bar chart", rule: "先判断类型：X轴是年份=变化型（按时间分段，写趋势）；X轴是项目=比较型（最大两项一段+其余一段，只比较禁升降）", overview: "谁遥遥领先（by far the most）/ 整体趋势" },
    { type: "饼图 Pie chart", rule: "多年份→按年分段（同段内跨国比较）；多类别→按类别归组。绝不一个国家/类别一段", overview: "最大占比 + 最小占比" },
    { type: "表格 Table", rule: "只挑每行/列的最大最小值，中间值全扔。最高一组一段 + 最低一组一段", overview: "跨类别比较（不是单个格子）" },
    { type: "双图 Two charts", rule: "一句一图（overview），一段一图（details）。单位不同就不强行对比", overview: "一句一图各抓主特征" },
    { type: "流程图 Process", rule: "唯一特殊语言题：overview=步数+起终点；步骤一个不漏，从中点切两段；人造过程用被动语态+顺序词；自然过程用主动", overview: "There are N stages, beginning with... and ending with..." },
    { type: "地图 Map", rule: "发展型（按时间分期，过去时被动 was built / 完成时 have been built）；对比型（两址同段对比，按维度分）；规划图用 will be", overview: "发展主线 / 变化数量+主要变化" }
  ],
  lang: {
    intro: ["The line graph compares...", "The bar chart compares A in terms of B", "The table gives information about...", "The diagrams illustrate...", "The two pictures compare..."],
    overview: ["It is clear that...", "It is also noticeable that...", "We can also see that...", "Overall,..."],
    up: ["rose (to/by)", "increased", "jumped (to)", "doubled", "saw an increase", "there was a rise in"],
    down: ["fell (to/by)", "dropped", "decreased", "declined", "fell back to", "went down by"],
    flat: ["remained stable/steady", "stayed roughly the same", "remained at a similar level", "there was relatively little change"],
    special: ["reached a peak of / peaked at", "overtook ... as the primary source", "fluctuated between...and..."],
    degree: ["dramatically", "significantly", "considerably", "markedly", "rapidly", "steadily", "gradually", "slightly"],
    number: ["twice as high as", "three times as ... as", "a twofold increase", "account for", "make up", "stand at", "the figure for", "compared to", "respectively"],
    preps: ["to = 到达值 rose to 10%", "by = 变化量 fell by 2%", "with = 拥有值 with 52%", "at = 补数值 at 10%"],
    time: ["over the period shown", "over a 10-year period", "between 1999 and 2009", "from ... to ...", "by 2007 (had risen)", "throughout the period"],
    future: ["is expected to", "is predicted to", "it is predicted that ... will rise", "are likely to be"],
    process: ["at the first stage", "next / then / after that", "following this", "finally", "is collected / is sorted / is transported / are removed（人造过程被动）", "lays an egg / hatches / grows（自然过程主动）"],
    map: ["was built", "have been built", "has changed considerably", "The main developments are that...", "will be installed / the plan is to...", "to the north of / runs through / lies on"]
  },
  mistakes: [
    "没有 overview，或用一句话“结论”充当（最常见错误！）",
    "开头照抄题目（必须改写）",
    "“Canada was 19 million tonnes.”“Canada increased.”——国家不是数字的主语",
    "10 millions / millions of tonnes 带数字用（应为 10 million）",
    "百分比当主语：“text message was 95%” ❌",
    "该主动却用被动：the number was increased ❌（线图禁被动/进行/完成时）",
    "过去年份不用过去式",
    "写 -5%（应写 fell by 5%）",
    "一条线/一个国家单独写一段，全程无比较",
    "试图写完所有数字（36 个数字的表格只挑最大最小）",
    "非竞赛型图表用 in first/second place",
    "滥用 show 的“高级同义词”（depicts/exhibits 考官反感）",
    "用 soar/rocket/plummet 等夸张词",
    "rise/raise 混用（物作主语用 rise）",
    "忘记分段（4 段之间空行）",
    "给原因做分析（Task 1 只描述不解释）",
    "单复数照抄图例（single parent → 句中应 single parents）",
    "comparing to（不存在，用 compared to/with）",
    "同义替换过度导致语义漂移"
  ],
  checklist: [
    "有 overview 吗？两句、无数字？",
    "开头是否改写了题目？",
    "有没有逐线/逐国罗列（=没比较）？",
    "主谓逻辑：“国家 was 数字”清零？",
    "时态、单位（10 million）正确？",
    "全文 ≥6 个数字、每段 ≥3 个？",
    "段落空行分明？"
  ]
};
