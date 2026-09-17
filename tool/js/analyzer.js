/* =========================================================
 * analyzer.js — 审题引擎
 * 把 Simon 的审题思维（题型判定→路线图→立场→模板→弹药）变成自动流程
 * ========================================================= */
const Analyzer = (() => {

  // ---------- 题型判定规则（按优先级） ----------
  const TYPE_RULES = [
    {
      type: "discussion",
      name: "讨论 + 观点题",
      en: "Discussion + Opinion",
      patterns: [/discuss both (these )?views/i, /discuss both sides/i],
      mustGiveOpinion: true
    },
    {
      type: "adv-disadv-opinion",
      name: "利弊比较题（需表态）",
      en: "Do the advantages outweigh the disadvantages?",
      patterns: [/outweigh/i, /(is|has been).*(positive|negative) (development|trend|impact|effect)/i, /benefits of .* outweigh/i, /disadvantages of .* outweigh/i],
      mustGiveOpinion: true
    },
    {
      type: "problem-solution",
      name: "问题-解决题",
      en: "Problem & Solution",
      patterns: [/(what|explain).*(problems|causes|reasons|effects)/i, /suggest.*(solutions?|measures?|ways)/i, /(solutions?|measures?).*(could|can|should) be/i, /how can.*(be (solved|addressed|tackled))/i, /what problems/i],
      mustGiveOpinion: false
    },
    {
      type: "two-part",
      name: "双问题题",
      en: "Two-part question",
      patterns: [/\?[^?.]*\?/],  // 两个问句（“agree + 追加问句”“why + 措施”都必须各答一段）
      mustGiveOpinion: false
    },
    {
      type: "opinion",
      name: "观点题",
      en: "Opinion (agree/disagree)",
      patterns: [/agree or disagree/i, /do you agree/i, /to what extent/i, /what (is|do).*(your|you).*(opinion|view|think)/i],
      mustGiveOpinion: true
    },
    {
      type: "adv-disadv",
      name: "纯利弊讨论题（不用表态）",
      en: "Advantages & Disadvantages",
      patterns: [/(what|discuss).*(advantages|disadvantages)/i, /benefits and drawbacks/i, /advantages and disadvantages/i, /positives and negatives/i],
      mustGiveOpinion: false
    },
    {
      type: "problem-solution",
      name: "问题-解决题",
      en: "Problem & Solution",
      patterns: [/(what|explain).*(problems|causes|reasons|effects)/i, /suggest.*(solutions?|measures?|ways)/i, /(solutions?|measures?).*(could|can|should) be/i, /how can.*(be (solved|addressed|tackled))/i, /what problems/i],
      mustGiveOpinion: false
    },
    {
      type: "two-part",
      name: "双问题题",
      en: "Two-part question",
      patterns: [/\?[^?.]*\?/],  // 两个问句
      mustGiveOpinion: false
    }
  ];

  // ---------- 各题型完整作战方案 ----------
  const PLAYBOOK = {
    opinion: {
      stance: `观点题 = 问你的看法。两个选择：
<strong>强观点</strong>（I completely agree/disagree）→ 两个主体段都写支持理由，不用提对方（Simon：完全同意/不同意时不需要写反方）。
<strong>让步观点</strong>（While I accept A, I believe B）→ 想不到两个同向理由时用，但开头结尾必须说清倾向。`,
      choose: `选择标准只有一条：<strong>哪个立场你的词伙最多、最好展开</strong>，就写哪个（不是哪个更"真实"）。`,
      paragraphs: [
        { t: "Introduction（2 句）", items: ["句1 改写题目背景", "句2 亮明立场（强观点或让步式）", "⏱ 5 分钟内写完"] },
        { t: "Body 1（5 句，85–110 词）", items: ["主题句：第一个支持理由", "解释：说清因果链（because/this means）", "例子：For example, ...（具体到人/地/事）", "收束：which leads to... / As a result..."] },
        { t: "Body 2（5 句，85–110 词）", items: ["主题句：第二个支持理由", "解释 + 例子", "（让步式写法：On the other hand, 先承认对方有理，再说明为什么我方更重要）"] },
        { t: "Conclusion（1 句）", items: ["For the reasons mentioned above, I believe that...（换词重申立场）", "绝不出现新观点"] }
      ],
      templates: [
        { label: "强不同意开头", text: `It is sometimes argued that <span class="slot">[改写题目观点]</span>. I completely disagree with this idea.` },
        { label: "强同意开头", text: `It is true that <span class="slot">[改写背景]</span>. I completely agree that <span class="slot">[立场]</span>.` },
        { label: "让步式开头（while 句式）", text: `People have different views about <span class="slot">[话题]</span>. While I accept that <span class="slot">[对方有理的点]</span>, I believe that <span class="slot">[我方观点]</span>.` },
        { label: "结尾", text: `In conclusion, I do not accept the argument that <span class="slot">[题目观点，换词]</span>. / For the reasons mentioned above, I believe that <span class="slot">[立场换词]</span>.` }
      ],
      traps: [
        "写了 “some people think... other people think...” —— 题目问的是你的观点！",
        "开头说 agree，主体段却大篇幅替反方说话，立场漂移（TR 直接掉 6）",
        "两个主体段用了一模一样的 Firstly/Secondly/Finally 套路（CC 扣分）",
        "连接词堆砌但段内没有解释和例子（考官在意连接词之间的内容）"
      ]
    },
    discussion: {
      stance: `讨论题 = 双方都要写、篇幅相当，你的立场嵌在里面（开头、你支持的那一段、结尾，共 3 处提示）。<br>
<strong>不需要单独一个"我的观点段"</strong>——直接 4 段：让步式开头亮立场 → 观点 A 段 → 观点 B 段（写明 I believe 这边）→ 结论总结双方+立场。`,
      choose: `先给双方各列 2-3 条理由，看哪边理由更好写，就站哪边；也可以站"中间"（如 "两者都需要"，Simon 的 artists/museums 范文都是这种写法）。`,
      paragraphs: [
        { t: "Introduction（2 句）", items: ["句1：People have different views about + 话题", "句2：While/Although + 观点A, I personally believe 观点B（亮立场）"] },
        { t: "Body 1：第一种观点（5 句）", items: ["主题句：On the one hand, + 观点A 有理", "解释 ×2 + 例子 ×1（或 Firstly/Secondly 两个理由）", "客观写，但如果我不同意这边，结尾句可轻轻回踩"] },
        { t: "Body 2：第二种观点（5 句）", items: ["主题句：On the other hand, + 观点B", "解释 + 例子", "明确写出 I believe / This is the view I support"] },
        { t: "Conclusion（1 句）", items: ["In conclusion, there are convincing arguments both for and against..., but I believe that..."] }
      ],
      templates: [
        { label: "开头", text: `People have different views about <span class="slot">[话题]</span>. While there are some good arguments in favour of <span class="slot">[观点A]</span>, I personally believe that <span class="slot">[观点B = 我的立场]</span>.` },
        { label: "Body 1 首句", text: `On the one hand, <span class="slot">[支持观点A的理由]</span>.` },
        { label: "Body 2 首句", text: `On the other hand, I believe that <span class="slot">[观点B]</span>.` },
        { label: "结尾", text: `In conclusion, there are convincing arguments both for and against <span class="slot">[话题]</span>, but I believe that <span class="slot">[我的立场]</span>.` }
      ],
      traps: [
        "两边篇幅悬殊（一边 120 词一边 40 词）——讨论题要求 similar amount",
        "忘了给观点：只讨论不站队（题目说了 give your own opinion！）",
        "观点只出现在结尾（开头就必须亮出来）"
      ]
    },
    "adv-disadv-opinion": {
      stance: `这种题必须"选边"：好处多还是坏处多（outweigh）。两边都要写一段，但开头结尾必须说清哪边占上风。`,
      choose: `先各列 2-3 条利弊，数哪边多/哪边好写 → 那边就是 outweigh 的一边。让 outweigh 那边的内容更充实（放更多词伙）。`,
      paragraphs: [
        { t: "Introduction（2 句）", items: ["句1 改写趋势/现象", "句2：Although this trend has some benefits, I would argue that there are more drawbacks.（或反之）"] },
        { t: "Body 1：好处段（5 句）", items: ["On the one hand, the benefits of X are clear. / X has some benefits.", "解释 + 例子 ×2"] },
        { t: "Body 2：坏处段（5 句，写得更充分）", items: ["On the other hand, I believe the disadvantages are more significant.", "解释 + 例子（这段给更多细节=暗示 outweigh）"] },
        { t: "Conclusion（1 句）", items: ["In conclusion, it seems to me that the potential dangers/drawbacks of X are more significant than the possible benefits."] }
      ],
      templates: [
        { label: "开头（坏处占上风版）", text: `It is true that <span class="slot">[现象改写]</span>. While I accept that this trend has certain benefits, I believe that its drawbacks are more significant.` },
        { label: "Is this a positive or negative development 版", text: `In recent years, <span class="slot">[现象改写]</span>. In my opinion, this is <span class="slot">a negative / a positive</span> development, <span class="slot">[because...一句话理由]</span>.` },
        { label: "结尾", text: `In conclusion, I would argue that the benefits of <span class="slot">[话题]</span> do / do not outweigh the drawbacks.` }
      ],
      traps: [
        "写成纯利弊讨论、不表态（这题问的就是 outweigh！）",
        "两边写得一样长、一样力度，看不出倾向（TR 6）"
      ]
    },
    "adv-disadv": {
      stance: `纯利弊题<strong>不需要给观点</strong>！客观讨论两边即可。给观点反而画蛇添足（跟 outweigh 题区分开——这是 Simon 特别强调的区别）。`,
      choose: `无需选边。两边各想 2-3 条即可，也可以"一段之内利弊同框"（Simon 的 media 范文：The main advantage of books is... On the other hand, books quickly go out of date...）。`,
      paragraphs: [
        { t: "Introduction（2 句）", items: ["句1 改写话题", "句2：While public transport has many benefits, there are also some drawbacks which are worth considering.（无立场！）"] },
        { t: "Body 1：好处段（5 句）", items: ["主题句 + 解释 + 例子"] },
        { t: "Body 2：坏处段（5 句）", items: ["主题句 + 解释 + 例子"] },
        { t: "Conclusion（1 句）", items: ["客观总结：In conclusion, X offers ... but ...（不出现 I believe 哪边赢）"] }
      ],
      templates: [
        { label: "开头", text: `<span class="slot">[话题改写]</span> has both advantages and disadvantages. / While <span class="slot">[话题]</span> has many benefits, there are also some drawbacks which are worth considering.` },
        { label: "结尾", text: `In conclusion, <span class="slot">[话题]</span> clearly brings <span class="slot">[好处概括]</span>, although <span class="slot">[坏处概括]</span> should not be ignored.` }
      ],
      traps: [
        "给了“我认为好处更多”的结论（题目没问！）",
        "把 advantages/disadvantages 写成两个观点的讨论（方向错了）"
      ]
    },
    "problem-solution": {
      stance: `问题解决题不需要观点，但要<strong>答全两部分</strong>：原因/问题 一段 + 解决措施 一段。causes / effects / problems 都算"问题"那段的内容。`,
      choose: `问题段用视角法找原因（个人/政府/社会/经济）；解决段用"主体行动法"：政府做什么、学校做什么、个人做什么。措施必须跟问题对得上。`,
      paragraphs: [
        { t: "Introduction（2 句）", items: ["句1 改写问题背景", "句2：There are several causes/reasons for this, but measures could certainly be taken to tackle the problem."] },
        { t: "Body 1：原因/问题段（5 句）", items: ["主题句：There are two main reasons/problems...", "Firstly + 展开, Secondly + 展开（或 main issue + further pressures）"] },
        { t: "Body 2：解决段（5 句）", items: ["主题句：Several actions could be taken to...", "Firstly + 措施1（具体到谁做什么）, A second measure would be..., Finally..."] },
        { t: "Conclusion（1 句）", items: ["In conclusion, various measures can be taken to tackle the problems that..."] }
      ],
      templates: [
        { label: "开头", text: `It is true that <span class="slot">[问题现象改写]</span>. There are several reasons for this alarming trend, but measures could certainly be taken to tackle the problem.` },
        { label: "问题段首句", text: `Several related problems can be anticipated as <span class="slot">[趋势]</span>. / There are two main reasons why <span class="slot">[问题]</span>.` },
        { label: "解决段首句", text: `There are several actions that governments could take to solve the problems described above.` },
        { label: "结尾", text: `In conclusion, it is clear that there are various reasons for <span class="slot">[问题]</span>, and steps need to be taken to tackle it.` }
      ],
      traps: [
        "只写问题不写解决（或反过来）——答一半 TR 上不了 7",
        "解决措施太空（“government should raise awareness” 却不说怎么做）",
        "问题和措施对不上号（问题讲污染，措施讲教育）"
      ]
    },
    "two-part": {
      stance: `双问题题 = 题目里有两个直接问句，<strong>一段答一个</strong>，篇幅相当。开头对两个问题都给概括回答。`,
      choose: `按问句顺序写。第二问常是"你的看法"性质（Is it positive? / What factors...?），该给观点就清楚给。`,
      paragraphs: [
        { t: "Introduction（2 句）", items: ["句1 改写话题", "句2：概括回答两个问题（各半句）"] },
        { t: "Body 1：答第一个问（5 句）", items: ["主题句直接回答问题 1", "解释 + 例子 ×2"] },
        { t: "Body 2：答第二个问（5 句）", items: ["主题句直接回答问题 2", "解释 + 例子"] },
        { t: "Conclusion（1 句）", items: ["用不同说法概括两个答案"] }
      ],
      templates: [
        { label: "开头", text: `It is true that <span class="slot">[话题改写]</span>. <span class="slot">[对问1的概括回答]</span>, and in my opinion <span class="slot">[对问2的概括回答]</span>.` },
        { label: "结尾", text: `In conclusion, <span class="slot">[答1换词]</span>, and <span class="slot">[答2换词]</span>.` }
      ],
      traps: [
        "两段之间穿插着答（应一段一问）",
        "只答了第二个问题（更容易写的那问）",
        "两个问句其实暗含“先因后果”关系，答的时候要自洽"
      ]
    }
  };

  // ---------- 话题关键词映射（键名与词伙库/思路库的主题名对齐） ----------
  const TOPIC_KEYWORDS = {
    "教育": [/education/i, /school/i, /universit/i, /student/i, /pupil/i, /learn/i, /teach(er)?/i, /exam/i, /curriculum/i, /homework/i, /literac/i, /language/i],
    "科技与网络": [/technolog/i, /internet/i, /computer/i, /smartphone/i, /mobile phone/i, /online/i, /\bAI\b/i, /robot/i, /social media/i, /digital/i, /machine/i],
    "环境": [/environment/i, /pollut/i, /climate/i, /global warming/i, /recycl/i, /wildlife/i, /animal/i, /species/i, /nature/i, /zoo/i],
    "政府与社会": [/government/i, /tax/i, /public service/i, /\bstate\b/i, /policy/i, /politician/i, /law\b/i],
    "工作与职业": [/\bwork/i, /\bjob/i, /career/i, /employ/i, /salary|salaries/i, /profession/i, /company|companies/i, /business/i, /volunteer/i, /unpaid/i],
    "健康": [/health/i, /obes/i, /diet/i, /exercise/i, /medical/i, /hospital/i, /smok/i, /doctor/i, /medicine/i],
    "犯罪": [/crime/i, /criminal/i, /prison/i, /punish/i, /police/i, /offen(ce|der|ses)/i, /theft/i, /violence/i],
    "媒体与广告": [/advertis/i, /\bmedia\b/i, /\bnews\b/i, /\bTV\b/i, /television/i, /celebrit/i, /\bfame/i, /newspaper/i],
    "文化与旅游": [/culture|cultural/i, /tradition/i, /museum/i, /history|historical/i, /touris/i, /travel/i, /holiday/i, /monument/i],
    "全球化": [/global/i, /international/i, /\btrade\b/i, /foreign/i, /immigra/i, /import/i, /export/i],
    "家庭与性别": [/famil/i, /parent/i, /child/i, /women|woman/i, /gender/i, /marri/i, /teenager/i, /young people/i, /generational/i],
    "城市化": [/cit(y|ies)/i, /urban/i, /rural/i, /countryside/i, /\btown\b/i, /hous(e|ing)/i, /overcrowd/i, /migrat/i],
    "交通": [/traffic/i, /transport/i, /vehicle/i, /car\b|cars\b/i, /railway/i, /road\b|roads\b/i, /commut/i, /petrol/i, /congestion/i],
    "能源与水资源": [/energy/i, /fuel/i, /nuclear/i, /electricit/i, /\bwater\b/i, /solar/i, /oil\b/i, /coal/i],
    "老龄化": [/old people/i, /elderly/i, /ageing|aging/i, /retire/i, /pension/i, /life expectancy/i, /senior/i],
    "体育": [/\bsport/i, /athlet/i, /football/i, / Olympic/i, /fitness/i],
    "艺术与音乐": [/\bart\b/i, /artist/i, /music/i, /paint/i, /galler/i, /film/i, /cinema/i, /creative/i],
    "食品": [/\bfood\b/i, /fast food/i, /organic/i, /crop/i, /farm/i, /genetically|genetic/i, /hungry|hunger/i, /agriculture/i],
    "贫富差距": [/poverty/i, /poor (countries?|people|nations?)/i, /rich and poor/i, /wealth/i, /inequalit/i, /equality|egalitarian/i, /donat/i, /charit/i, /aid\b/i]
  };

  // ---------- 主流程 ----------
  function detectType(q) {
    const scores = [];
    for (const rule of TYPE_RULES) {
      let hits = 0, evidence = [];
      for (const re of rule.patterns) {
        const m = q.match(re);
        if (m) { hits++; evidence.push(m[0].length > 40 ? m[0].slice(0, 40) + "..." : m[0]); }
      }
      if (hits > 0) scores.push({ rule, hits, evidence });
    }
    if (!scores.length) return null;
    const byHits = [...scores].sort((a, b) => b.hits - a.hits);
    const twoPart = scores.find(s => s.rule.type === "two-part");
    const ps = scores.find(s => s.rule.type === "problem-solution");
    let winner;
    if (twoPart && ps) winner = ps;          // 双问句 + 问题解决语义（causes/solutions）→ 问题解决题
    else if (twoPart) winner = twoPart;      // 双问句（agree+追问 / why+观点 等）→ 双问题题
    else winner = byHits[0];
    return { type: winner.rule.type, name: winner.rule.name, evidence: winner.evidence };
  }

  function detectTopics(q) {
    const found = [];
    for (const [topic, res] of Object.entries(TOPIC_KEYWORDS)) {
      for (const re of res) {
        const m = q.match(re);
        if (m) { found.push({ topic, kw: m[0] }); break; }
      }
    }
    return found;
  }

  function analyze(question) {
    question = question.trim().replace(/\s+/g, " ");
    if (question.length < 20) return { error: "题目太短，请粘贴完整题目（含问句）。" };
    const det = detectType(question);
    const topics = detectTopics(question);
    return { question, det, topics };
  }

  // 从作文正文反查话题（诊断室自动选题用）
  function topicsOfText(text) {
    return detectTopics(text || "").map(t => t.topic);
  }

  return { analyze, topicsOfText, PLAYBOOK };
})();
