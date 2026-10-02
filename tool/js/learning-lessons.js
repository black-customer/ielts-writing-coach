/* 原创教学例子。与当前考题无关；图表数值为明确标注的假设数据。 */
const LearningLessons = {
  response: {
    context: '示例题：讨论在家办公的两种观点，并给出自己的意见。',
    weak: 'Working from home is popular nowadays. There are many opinions about this issue.',
    stronger: 'Some people value the flexibility of working from home, while others prefer the support available in an office. I believe a combination of the two can meet both needs.',
    why: '较弱写法只介绍话题。改进写法明确双方讨论的内容，并给出可发展的立场；正文还需要分别讨论双方，不能只靠开头满足任务。',
    try: '回到你的题目：列出要回答的每个问题，再写立场和中心句。逐项检查：正文准备在哪里回答它？',
    smaller: '先只检查题目中的一个限定词或问题，写出直接回答它的立场和中心句。'
  },
  development: {
    context: '示例观点：公共交通能减少拥堵。',
    weak: 'Public transport is good because it can reduce traffic congestion. This is beneficial for cities.',
    stronger: 'Reliable bus services can reduce congestion by giving commuters an alternative to driving. When buses run frequently, people are more willing to leave their cars at home, so fewer vehicles compete for road space during rush hour.',
    why: '较弱写法重复“有好处”。改进写法补齐了条件、行为变化和结果，让读者知道为什么会减少拥堵。具体例子也可以支撑观点，选择适合这道题的方式。',
    try: '合上示例，用你的观点回答：谁会改变什么行为，为什么，会带来什么结果？删除仅仅重复“有好处”的句子。',
    smaller: '先只写两三句，补上“为什么会发生”这一环；清楚后再扩成主体段。'
  },
  coherence: {
    context: '示例段落：在家办公的优点和限制。',
    weak: 'Working from home saves travel time. Therefore, some employees feel isolated. Moreover, they need contact with colleagues.',
    stronger: 'Working from home saves travel time, but it can also leave employees feeling isolated. Regular meetings with colleagues can help maintain the contact they would otherwise have in an office.',
    why: '省下通勤时间并不能直接推出孤独感，Therefore 表达了错误关系。改进写法先用转折引入限制，再提出对应办法，指代也有清楚的对象。',
    try: '给你的每句话标一个作用，再检查相邻两句的关系能否说清楚。把代词指向的对象也圈出来。',
    smaller: '先只连接两句话，确定是原因、结果、对比还是补充，再扩展段落。'
  },
  vocabulary: {
    context: '示例句：描述城市的空气污染。',
    weak: 'Cars make big pollution and bring bad effects to people.',
    stronger: 'Vehicle emissions contribute to high levels of air pollution, which can harm residents’ health.',
    why: '改进写法明确污染来源、污染程度和受到的影响。练习重点是词义与搭配符合语境，不是把每个简单词换成生词。',
    try: '选你原稿中一个表达，先说清想表达的意思，再在两种相关情境中准确使用。',
    smaller: '先只修一个搭配，再用它写两句意思不同的新句。'
  },
  grammar: {
    context: '示例只讲一种语法问题；本次训练仍以你的原反馈为准。',
    weak: 'Although public transport is cheaper, but many people still drive.',
    stronger: 'Although public transport is cheaper, many people still drive.',
    why: 'Although 引导让步从句，这个结构不再用 but 连接主句。先找到从句和主句，再在自己的新句中检验同一规则。复杂度应随准确性提高。',
    try: '从你的反馈选一条规则：改原句，再写两句与题目相关的新句。逐句标出主语和谓语，检查同一错误是否还出现。',
    smaller: '先找出原句的主语、谓语和句子边界，只修本次指出的一种错误。'
  },
  overview: {
    context: '假设图表：汽车占比从 40% 升至 60%，公交从 45% 降至 25%，骑行保持 15%。以下数值仅为教学示例。',
    weak: 'The chart shows changes in three forms of transport. There are many differences.',
    stronger: 'Overall, cars became the most common means of transport, while the share of bus journeys declined. The proportion of cyclists remained unchanged.',
    why: '较弱写法没有选出主要特征。改进写法概括了主导方式的变化、相反趋势和不变项。地图或流程图需要概括其主要改变或阶段，不套用统计图的趋势句。',
    try: '回到原图，先用中文说出最显著的特征，再准确写成英文。指出每个特征在图中的依据，避免只概括一个局部。',
    smaller: '先只找一项显著的总体特征，说明它为何重要，再补齐概括。'
  },
  data: {
    context: '假设表格：2000 年 A 国小麦出口 20 million tonnes，B 国 10 million tonnes。以下数值仅为教学示例。',
    weak: 'Country A was 20 millions. Country B was 10 millions.',
    stronger: 'In 2000, Country A exported 20 million tonnes of wheat, twice the amount exported by Country B.',
    why: '国家不能“是”一个出口量。改进写法写清了指标、时间、单位和比较关系，million 在明确数字后不加 s。地图和流程练习则核对位置、改变或阶段。',
    try: '从原图选一组有意义的关系，核对每个数字、单位和比较对象。地图核对方位与变化，流程核对动作与先后关系。',
    smaller: '先只核对一组比较或两个相邻阶段，把关系写准确。'
  },
  completion: {
    context: '示意提纲：讨论在家办公的两种观点并给出意见。这里不提供完整答卷。',
    weak: '开头反复介绍“工作很重要”；正文只写自己喜欢在家办公；结尾临时补一句“办公室也很好”。',
    stronger: '先列出三项任务：在家办公的理由、办公室办公的理由、自己的立场。正文分别解释双方，立场在全文保持一致，最后检查遗漏和语言错误。',
    why: '时间应该留给完整回应任务和必要检查。四段可作为组织办法，具体段数、句数和篇幅比例都不是官方得分公式。',
    try: '先列要覆盖的内容，再写完整答卷。写不完也保存尝试，标出卡在审题、展开还是语言，再调整下次的时间分配。',
    smaller: '先补齐遗漏的任务内容，再回到完整答卷；最终仍需达到当前 Task 的最低字数。'
  }
};
