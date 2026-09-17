/* =========================================================
 * checker.js — 作文诊断引擎
 * 规则启发式：扫硬伤（结构/TR/CC/LR/GRA）+ 引导式自评清单
 * ========================================================= */
const Checker = (() => {

  const STOP = new Set(("the a an and or but if while of to in on for with by at as is are was were be been being it its this that these those there their they them he she his her we our you your i my me not no do does did done have has had will would can could should may might must from than then so such which who whom whose what when where how more most much many some any each other others people person".split(" ")));

  // 常见拼写/用词错误
  const SPELLING = {
    "goverment": "government", "enviroment": "environment", "benifit": "benefit",
    "benefical": "beneficial", "seperate": "separate", "occured": "occurred",
    "tommorow": "tomorrow", "wich": "which", "becuase": "because", "thier": "their",
    "recieve": "receive", "definately": "definitely", "neccessary": "necessary",
    "succesful": "successful", "existant": "existent", "acommodation": "accommodation",
    "alot": "a lot", "untill": "until", "wether": "whether", "acheive": "achieve",
    "arguement": "argument", "comunity": "community", "diferent": "different",
    "expence": "expense", "govermental": "governmental", "hierachy": "hierarchy",
    "independant": "independent", "occation": "occasion", "posession": "possession",
    "publically": "publicly", "recomend": "recommend", "succesfull": "successful",
    "trully": "truly", "usefull": "useful", "wether": "whether"
  };
  const UNCOUNTABLE_ERR = [
    [/\binformations\b/gi, "information 不可数"], [/\bresearches\b/gi, "research 不可数（ studies / pieces of research）"],
    [/\badvices\b/gi, "advice 不可数（ pieces of advice）"], [/\bknowledges\b/gi, "knowledge 不可数"],
    [/\bequipments\b/gi, "equipment 不可数"], [/\bsoftwares\b/gi, "software 不可数"],
    [/\bhomeworks\b/gi, "homework 不可数"], [/\bmoneys\b/gi, "money 不可数"],
    [/\bstaffs\b/gi, "staff 通常不可数"], [/\btrainings\b/gi, "training 不可数"],
    [/\ban advice\b/gi, "advice 不可数，不能加 an"], [/\ba research\b/gi, "research 不可数，不能加 a"],
    [/\bpeoples\b/gi, "people 本身是复数（peoples 仅指“多个民族”）"],
    [/\bchildrens\b/gi, "children 已是复数"]
  ];
  const CLICHES = [
    [/as we all know/i, "As we all know —— 考官最烦的套话开场"],
    [/every coin has two sides/i, "Every coin has two sides —— 用烂了的模板句，删掉"],
    [/with the development of (the )?society/i, "With the development of society —— 万年模板开头，换具体改写"],
    [/it goes without saying/i, "It goes without saying —— 套话"],
    [/in a word,/i, "In a word —— 口语化，用 In conclusion"],
    [/last but not least/i, "Last but not least —— 议论文正文别用"]
  ];

  // ---------- 文本工具 ----------
  function words(t) { return (t.match(/[A-Za-z']+/g) || []).length; }
  function sentences(t) {
    return (t.match(/[^.!?]+[.!?]+/g) || (t.trim() ? [t] : [])).map(s => s.trim()).filter(s => words(s) > 0);
  }
  function paragraphs(t) { return t.split(/\n\s*\n|\n/).map(p => p.trim()).filter(p => words(p) > 2); }

  function stem(w) { return w.replace(/(ies)$/, "y").replace(/(ing|ed|es|s)$/, ""); }
  function keywordCoverage(question, essay) {
    const qWords = (question.toLowerCase().match(/[a-z']{4,}/g) || []).filter(w => !STOP.has(w) && !["about","whether","there","should","would","could","think","people","some","believe","others","agree","disagree","extent","discuss","views","opinion","advantages","disadvantages","problems","solutions"].includes(w));
    const eStems = new Set(((essay.toLowerCase().match(/[a-z']+/g)) || []).map(stem));
    const uniq = [...new Set(qWords)];
    const hit = uniq.filter(w => eStems.has(stem(w)));
    return { covered: hit, missed: uniq.filter(w => !eStems.has(stem(w))), total: uniq.length };
  }

  // ---------- 主诊断 ----------
  function check(essay, qtype, topicKeys, questionText) {
    const issues = [];
    const info = [];
    const paras = paragraphs(essay);
    const allSents = sentences(essay);
    const W = words(essay);
    const low = essay.toLowerCase();

    const add = (sev, crit, msg, evidence) => issues.push({ sev, crit, msg, evidence });

    // ===== 结构与字数 =====
    if (W < 250) add("bad", "TR", `字数只有 ${W} 词，不足 250 —— 字数不足直接扣分，几乎没有回旋余地。`, "");
    else if (W > 380) add("warn", "TR", `字数 ${W} 词偏多。写得长≠分高，挤占检查时间；Simon 建议全文 250-300 词。`, "");
    else add("ok", "TR", `字数 ${W} 词，达标。`, "");

    if (paras.length < 3) add("bad", "CC", `只有 ${paras.length} 段。Task 2 应为 4 段（开头/主体×2/结尾）。`, "");
    else if (paras.length > 5) add("warn", "CC", `${paras.length} 段偏多，通常是主体段拆太碎，一个观点应写足一段。`, "");
    else add("ok", "CC", `共 ${paras.length} 段，结构数量正常。`, "");

    if (paras.length >= 4) {
      const introS = sentences(paras[0]).length, conclS = sentences(paras[paras.length - 1]).length;
      if (introS > 3) add("warn", "TR", `开头段有 ${introS} 句——Simon 铁律：2 句足够（改写话题+亮立场），写长了浪费时间。`, paras[0].slice(0, 80) + "...");
      if (introS <= 1 && W > 200) add("warn", "TR", `开头段只有 1 句，检查是否漏了“概括回答/立场”。`, "");
      if (conclS > 3) add("warn", "CC", `结尾段 ${conclS} 句——1 句即可，绝不出现新观点。`, "");
      const bodyS = paras.slice(1, -1).map(p => sentences(p).length);
      bodyS.forEach((s, i) => {
        if (s < 3) add("warn", "TR", `主体段 ${i + 1} 只有 ${s} 句——主体段是得分主战场，目标 5 句 85-110 词。`, "");
        const pw = words(paras[i + 1]);
        if (pw < 70) add("warn", "TR", `主体段 ${i + 1} 只有 ${pw} 词——太薄，观点没有展开（explain + example）。`, "");
      });
      const ratio = (words(paras[1]) + words(paras[2] || "")) / W;
      if (ratio < 0.6) add("warn", "CC", `两个主体段只占全文 ${Math.round(ratio * 100)}%——应约 70%。开头结尾太重、主体太轻是典型低分结构。`, "");
    }

    // ===== TR 检查 =====
    const stanceRx = new RegExp([
      "\\bI\\s+(?:\\w+\\s+){0,3}?(agree|disagree|believe|think|feel|support|oppose|argue)\\b",
      "\\bin my (opinion|view)\\b",
      "\\bit seems to me\\b",
      "\\bpersonally\\b",
      "\\bmy (own )?(view|opinion|position)\\b",
      "\\bI (accept|tend towards)\\b",
      "from my perspective"
    ].join("|"), "gi");
    const stanceHits = (essay.match(stanceRx) || []).length;
    const opinionTypes = ["opinion", "discussion", "adv-disadv-opinion", "two-part"];
    if (opinionTypes.includes(qtype)) {
      if (stanceHits === 0) add("bad", "TR", "全文找不到明确立场表达（I believe / In my opinion / I agree...）。观点题/讨论题必须多处亮明观点。", "");
      else {
        const rx1 = new RegExp(stanceRx.source, "i");
        const introHas = rx1.test(paras[0] || "");
        const conclHas = new RegExp(stanceRx.source, "i").test(paras[paras.length - 1] || "");
        if (!introHas) add("bad", "TR", "开头段没有立场——立场必须出现在开头第二句，不能留到结尾当惊喜。", "");
        else if (!conclHas) add("warn", "TR", "结尾没有回扣立场（用换词重申）。", "");
        else add("ok", "TR", `立场表达出现 ${stanceHits} 次，开头结尾均有覆盖。`, "");
      }
      if (qtype === "opinion" && /some people (think|believe|argue)[^.?!]*\.(?![^.?!]*(I |my ))/i.test(essay) && stanceHits < 2) {
        add("warn", "TR", "检测到大量 “some people think...” 句式——观点题问的是你的看法，这种写法容易写成别人的观点罗列。", "");
      }
    }
    if (qtype === "adv-disadv" && /\bI completely (agree|disagree)\b/i.test(essay)) {
      add("warn", "TR", "纯利弊讨论题不需要强立场（只有 outweigh 型才需要表态）。检查你是否写成了观点题。", "");
    }
    const exHits = (essay.match(/\b(for example|for instance|such as|as an example|an example of|example of this|a case in point|to illustrate|take [a-z ]{1,40} as an example)/gi) || []).length;
    if (exHits === 0) add("bad", "TR", "全文没有例子（For example...）。没有展开论证的观点就是“提及”，TR 上不了 7。", "");
    else if (exHits < 2) add("ok", "TR", `例子出现 ${exHits} 处。提示：考官期望每个主体段都有例子支撑（无标记词的例子也算，请自查第二主体段）。`, "");
    else add("ok", "TR", `例子出现 ${exHits} 处，主体段有支撑。`, "");

    if (questionText) {
      const cov = keywordCoverage(questionText, essay);
      if (cov.total > 3 && cov.missed.length / cov.total > 0.6) {
        add("warn", "TR", `题目关键词大半没有出现在文中（缺：${cov.missed.slice(0, 6).join(", ")}...）——注意：好的改写本来就会换词，此条仅作提醒；请人工确认题目的每个部分（尤其多个问句/sub-topic）是否都有段落回应。`, "");
        issues[issues.length - 1].noscore = true; // 改写属正常，不参与扣分
      }
    }

    // ===== CC 检查 =====
    const mech = {};
    ["firstly", "secondly", "thirdly", "finally", "moreover", "furthermore", "in addition", "additionally", "on the one hand", "on the other hand", "in conclusion", "for example", "however", "therefore"].forEach(k => {
      mech[k] = (low.match(new RegExp("\\b" + k.replace(/ /g, "\\s+") + "\\b", "g")) || []).length;
    });
    if (mech["firstly"] >= 1 && mech["secondly"] >= 1 && paras.length >= 4) {
      const bothFirstly = paras.slice(1, -1).filter(p => /\bfirstly\b/i.test(p)).length;
      if (bothFirstly >= 2) add("warn", "CC", "两个主体段都用了 Firstly, Secondly —— 同一套机械连接词不要用两次（第二段换成 The main reason... / Another argument is... / From a ... perspective）。", "");
    }
    const fancy = mech["moreover"] + mech["furthermore"] + mech["in addition"] + mech["additionally"];
    if (fancy >= 3) add("warn", "CC", `Moreover/Furthermore/In addition 类连接词出现 ${fancy} 次——Simon 30 篇 9 分范文中 Moreover 出现 0 次、Furthermore 仅 3 次。连接词不在多，段内逻辑推进才值钱。`, "");
    const thisChain = (essay.match(/\b(this|these)\s+(kind of|type of|trend|development|situation|approach|view|idea|measure|problem|children|people|young|such)/gi) || []).length;
    if (thisChain === 0) add("warn", "CC", "没有发现 this/these 指代衔接（如 “This kind of addiction can...”）——隐形衔接是 CC 7 分的关键手段之一。", "");
    else add("ok", "CC", `有 ${thisChain} 处 this/these 指代衔接，继续保持。`, "");

    // 句长多样性
    const lens = allSents.map(s => words(s)).filter(n => n > 2);
    if (lens.length) {
      const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
      if (avg > 30) add("warn", "GRA", `平均句长 ${avg.toFixed(0)} 词，太长——考生写长句更容易出错。Simon 范文平均 21 词/句。`, "");
      else if (avg < 12) add("warn", "GRA", `平均句长 ${avg.toFixed(0)} 词，全是短句——需要混合复杂句（which 从句、if 条件、while 让步）才能上 GRA 7。`, "");
      else info.push(`平均句长 ${avg.toFixed(0)} 词（范文基准 21），共 ${lens.length} 句。`);
    }

    // ===== LR 检查 =====
    // 拼写
    const misspelled = [];
    for (const [bad, good] of Object.entries(SPELLING)) {
      if (new RegExp("\\b" + bad + "\\b", "i").test(low)) misspelled.push(`${bad} → ${good}`);
    }
    if (misspelled.length) add("bad", "LR", `拼写错误：${misspelled.join("；")}。7 分要求“拼写偶错”，连续拼错直接压分。`, "");
    // 不可数名词
    const unc = [];
    UNCOUNTABLE_ERR.forEach(([re, msg]) => { if (re.test(essay)) unc.push(msg); });
    if (unc.length) add("bad", "GRA", `不可数名词误用：${unc.join("；")}。`, "");
    // 套话
    CLICHES.forEach(([re, msg]) => { if (re.test(essay)) add("warn", "LR", msg, ""); });
    // 词伙命中
    let collHit = [];
    if (typeof Collocations !== "undefined") {
      const norm = s => s.toLowerCase().replace(/['']/g, "'").replace(/\s+/g, " ");
      const lowNorm = norm(essay);
      const keys = topicKeys && topicKeys.length ? topicKeys : [];
      const seen = new Set();
      const banks = keys.map(k => Collocations.BY_TOPIC[k] || []);
      banks.push(Collocations.UNIVERSAL);
      banks.forEach(bank => {
        (bank || []).forEach(c => {
          const phrase = norm(typeof c === "string" ? c : c.en);
          if (!seen.has(phrase) && phrase.length > 3 && lowNorm.includes(phrase)) { seen.add(phrase); collHit.push(phrase); }
        });
      });
    }
    if (collHit.length === 0) add("warn", "LR", "没有检测到词伙库中的主题搭配——LR 的 7 分靠“考官想不到考生会写的词伙”。去弹药库背本题话题的词伙后重写。", "");
    else if (collHit.length < 3) add("warn", "LR", `词伙命中仅 ${collHit.length} 个（${collHit.slice(0, 5).join("; ")}）——每个主体段应有 2-3 个主题词伙。`, "");
    else add("ok", "LR", `检测到 ${collHit.length} 个词伙库搭配（如 ${collHit.slice(0, 4).join("; ")}），LR 有戏。`, "");
    // 重复用词
    const freq = {};
    (low.match(/[a-z']{5,}/g) || []).forEach(w => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
    const overused = Object.entries(freq).filter(([w, n]) => n >= 6).sort((a, b) => b[1] - a[1]);
    if (overused.length) add("warn", "LR", `以下词重复过多：${overused.slice(0, 4).map(([w, n]) => `${w}×${n}`).join(", ")}——换说法（paraphrase 链）是 CC+LR 双加分项。`, "");

    // ===== GRA 检查 =====
    if (/although[^.?!]{5,},\s*(but|yet)\b/i.test(essay)) add("bad", "GRA", "Although ..., but ... —— although 和 but 不能连用，删掉 but。", "");
    if (/because[^.?!]{5,},\s*so\b/i.test(essay)) add("bad", "GRA", "Because ..., so ... —— 不能连用，删 so。", "");
    const splice = (essay.match(/,\s+(it|this|they|we|people|students|children|parents|governments?|young people|there)\s+(is|are|was|were|have|has|can|will|would|should|tend|become|feel|think|do|does|get|make)\b/gi) || []).length;
    if (splice >= 2) add("bad", "GRA", `检测到 ${splice} 处疑似逗号粘连（comma splice）——两个完整句子不能只用逗号连接，改用句号/which 从句/分号。请人工确认。`, "");
    if (/\bmore (better|worse|easier|faster|higher|lower)\b/i.test(essay)) add("bad", "GRA", "比较级双重（more better 类），删 more。", "");
    const moremore = (low.match(/more and more/g) || []).length;
    if (moremore >= 3) add("warn", "GRA", `"more and more" 出现 ${moremore} 次——换成 an increasing number of / increasingly 更加分。`, "");
    const passives = (essay.match(/\b(is|are|was|were|be|been|being)\s+(\w+ed|given|made|taken|done|seen|held|built|paid|spent|found)\b/gi) || []).length;
    const conds = (essay.match(/\bif\s+\w+/gi) || []).length;
    const rels = (essay.match(/\b(which|who|that|where)\s+\w+/gi) || []).length;
    info.push(`句式统计：被动 ${passives} 处 · 条件句 ${conds} 处 · 从句引导词 ${rels} 处（7 分作文通常各有 2 处以上）。`);
    if (passives === 0 || conds === 0) add("warn", "GRA", "句式多样性不足：全文没有被动语态或条件句——主动加入（问题解决题天然适合被动；推演后果天然适合 If...would）。", "");
    /^\s*(and|but|so)\s+/im.test(essay) && add("warn", "GRA", "有句子以 And/But/So 开头——正式写作中避免，用 However / Therefore / In addition。", "");

    // ===== 打分 =====
    const score = { TR: 7, CC: 7, LR: 7, GRA: 7 };
    const critIssues = { TR: [], CC: [], LR: [], GRA: [] };
    issues.forEach(i => critIssues[i.crit] && critIssues[i.crit].push(i));
    for (const c of ["TR", "CC", "LR", "GRA"]) {
      let s = 7;
      critIssues[c].forEach(i => { if (i.noscore) return; if (i.sev === "bad") s -= 1; else if (i.sev === "warn") s -= 0.5; });
      score[c] = Math.max(5, s);
    }

    return { W, paras: paras.length, sents: allSents.length, issues, info, score, collHit, mech, passives, conds, rels };
  }

  // =========================================================
  // Task 1 诊断引擎（TA/CC/LR/GRA）
  // =========================================================
  const T1_CHART_COUNTRIES = /\b(canada|china|the usa|the uk|japan|india|australia|france|germany|brazil|spain|italy|korea|sweden|denmark|belgium|poland|ireland|portugal|turkey|mexico|america|britain|england|the us|somalia|egypt|ecuador)\b/i;

  function checkT1(essay, chartType, questionText) {
    const issues = [];
    const info = [];
    const paras = paragraphs(essay);
    const allSents = sentences(essay);
    const W = words(essay);
    const low = essay.toLowerCase();
    const add = (sev, crit, msg, evidence) => issues.push({ sev, crit, msg, evidence });

    // ---- 字数 ----
    if (W < 150) add("bad", "TA", `字数只有 ${W} 词，不足 150——直接扣分。`, "");
    else if (W > 230) add("warn", "TA", `字数 ${W} 词偏多。Simon 的 band 9 范文多在 160–190 词，写得长不加分。`, "");
    else add("ok", "TA", `字数 ${W} 词，在 160–190 的安全带附近。`, "");

    // ---- 段落结构 ----
    if (paras.length < 3) add("bad", "CC", `只有 ${paras.length} 段——Task 1 固定 4 段：改写开头 / Overview / 细节×2。`, "");
    else if (paras.length > 4) add("warn", "CC", `${paras.length} 段偏多（标准是 4 段）。`, "");
    else add("ok", "CC", "4 段结构正确。", "");

    // ---- Overview 检测（生死线）----
    const ovRx = /\b(it is clear that|it is noticeable|it is also noticeable|overall|we can (also )?see|it can be seen|in general|the main (developments?|features?|trends?))/i;
    const ovParaIdx = paras.findIndex((p, i) => i > 0 && ovRx.test(p));
    if (ovParaIdx === -1) {
      add("bad", "TA", "没有检测到 Overview（概述段）！考官口径：小作文最常见的失分原因就是没有 overview——第 2 段必须写两句总体特征（It is clear that... / Overall,...）。TA 上不了 6。", "");
    } else {
      const ovText = paras[ovParaIdx];
      if (ovParaIdx !== 1) add("warn", "TA", `Overview 出现在第 ${ovParaIdx + 1} 段——建议固定放开头段之后（第 2 段）。`, "");
      else add("ok", "TA", "Overview 存在且位置正确（第 2 段）。", "");
      if (/(^|[^A-Za-z])\d/.test(ovText)) add("warn", "TA", "Overview 里出现了具体数字——总体特征不带数字，数字留给细节段（CO2 这类代号的数字不算）。", "");
      const ovSents = sentences(ovText).length;
      if (ovSents < 2) add("warn", "TA", `Overview 只有 ${ovSents} 句——固定写两句（两个总体特征）。`, "");
    }

    // ---- 开头照抄题目检测 ----
    if (questionText && paras.length) {
      const norm = s => s.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
      const iw = norm(paras[0]);
      const qw = norm(questionText).split(" ");
      const introLen = iw.split(" ").length;
      let longest = 0;
      for (let n = Math.min(12, qw.length); n >= 6; n--) {
        for (let i = 0; i + n <= qw.length; i++) {
          const sub = qw.slice(i, i + n).join(" ");
          if (sub.length > 20 && iw.includes(sub)) { longest = n; break; }
        }
        if (longest) break;
      }
      const copiesOpening = qw.length >= 5 && iw.includes(qw.slice(0, 5).join(" "));
      const runDominates = longest >= 8 && longest >= 0.6 * introLen;
      if (copiesOpening || runDominates) {
        add("bad", "TA", "开头照抄题目（动词和框架句都没换）——扣分点。必须改写：shows → compares/illustrates、换核心词（the number of ↔ the figure for）、换时间表达。", "");
      } else if (paras[0] && words(paras[0]) < 8) add("warn", "TA", "开头段太短——一句话改写题干即可，但要把图表对象、类型、时间都改写进去。", "");
    }

    // ---- 数字处理 ----
    if (/-\s?\d+(\.\d+)?\s*%|fell to\s*-\s*\d|decreased to\s*-\s*\d/i.test(essay)) add("bad", "TA", "出现了负百分比写法（如 -5%）——应写 fell by 5%。", "");
    const bigNumPlural = (essay.match(/\b\d[\d,.]*\s+(millions|thousands|billions)\b/gi) || []);
    if (bigNumPlural.length) add("bad", "TA", `数字+复数单位：“${bigNumPlural[0]}”——有数字时用单数（10 million）；只有无数字才说 millions of。`, "");
    const digits = (essay.match(/\b\d[\d,.]*\b/g) || []).length;
    if (digits < 4) add("warn", "TA", `全文只出现 ${digits} 处数字——每个细节段 ≥3 个数字，全文约 6–7 个数据点。`, "");
    else if (digits > 18) add("warn", "TA", `数字出现 ${digits} 处——试图写完所有数字是常见失分做法，只挑最大/最小/首末年/特殊年。`, "");

    // ---- 主谓逻辑（Task 1 第一大错）----
    const countryNum = (essay.match(new RegExp(T1_CHART_COUNTRIES.source + "\\s+(was|were|is|are)\\s+(\\w+\\s+){0,2}([#$]?\\d|higher|lower|the (highest|lowest))", "gi")) || []);
    if (countryNum.length) add("bad", "TA", `“${countryNum[0]}”——国家不能“是”一个数字/最高值，应写 The figure for X / X exported/produced... 。`, "");
    const countryTrendRe = new RegExp(T1_CHART_COUNTRIES.source + "\\s+(increased|decreased|rose|fell|grew|declined|doubled|fluctuated|jumped|dropped)\\b", "gi");
    const countryTrend = [];
    let mct;
    while ((mct = countryTrendRe.exec(essay)) !== null) {
      const before = essay.slice(Math.max(0, mct.index - 16), mct.index).toLowerCase();
      if (/\b(in|and|or|of|for|from|than|between|unlike|like|as|while|whereas)\s+$/i.test(before)) continue; // 主语是数据（emissions in X rose / the figure for X fell）
      countryTrend.push(mct[0]);
    }
    if (countryTrend.length) add("warn", "TA", `“${countryTrend[0]}”——升跌的是数据不是国家：写成 wheat exports increased / the figure for Canada rose。`, "");

    // ---- 比较语言 ----
    const compHits = (low.match(/\b(while|whereas|by contrast|in contrast|compared (to|with)|in comparison with|respectively|than those|than that|twice as|three times as|by far|the (highest|lowest|most|least))\b/g) || []).length;
    if (compHits === 0 && chartType !== "流程图 Process") add("bad", "TA", "全程没有比较语言（while/whereas/compared to/by far...）——考官明确说考官想看 comparisons，不要逐项罗列。", "");
    else if (compHits < 2) add("warn", "TA", `比较语言只出现 ${compHits} 次——细节段的本质是“比较+挑选”，不是逐项报数。`, "");
    else add("ok", "TA", `比较语言出现 ${compHits} 次。`, "");

    // ---- 图型专项 ----
    const trendHits = (low.match(/\b(rose|fell|increased|decreased|declined|dropped|jumped|doubled|fluctuated|remained|peaked|reached|grew|went down|saw an increase|there was a (rise|fall|drop|decline))\b/g) || []).length;
    if ((chartType === "线图 Line graph" || chartType === "柱图 Bar chart") && trendHits === 0) {
      add("warn", "TA", "没有趋势动词（rose/fell/increased...）——线图和含年份的柱图必须写趋势。", "");
    }
    if (chartType === "线图 Line graph") {
      const lineByLine = paras.slice(2).filter(p => /\b(the first line|the second line|the third line|the red line|the blue line|the first graph line)\b/i.test(p)).length;
      if (lineByLine) add("warn", "TA", "疑似一条线一段/按线指代描述——考官要求 Never describe each line separately，要交叉比较。", "");
    }
    if (chartType === "流程图 Process") {
      const passives = (essay.match(/\b(is|are|was|were|be|been|being|can be|must be|then)\s+\w+(ed|en)\b/gi) || []).length;
      const seq = (low.match(/\b(first|firstly|at the first stage|next|then|after that|following this|subsequently|finally|begins? (with|at)|ends? (with|at))\b/g) || []).length;
      if (passives === 0) add("warn", "TA", "流程图没有被动语态——人造流程的标准语言是 is collected / is sorted / is transported。", "");
      if (seq === 0) add("warn", "TA", "流程图没有顺序连接词（first/next/then/finally/at the first stage...）。", "");
    }
    if (chartType === "地图 Map") {
      const mapLang = (low.match(/\b(was built|have been built|has been|were built|is located|will be|the plan is to|replaced|converted|constructed|demolished|extended)\b/g) || []).length;
      if (mapLang === 0) add("warn", "TA", "没有地图专用语言（was built / have been built / is located / will be constructed...）。", "");
    }

    // ---- 时态 ----
    if (questionText) {
      const pastYears = (questionText.match(/\b(1[89]\d\d|20[0-2]\d)\b/g) || []).map(Number);
      const hasFutureYear = (questionText.match(/\b20([3-9]\d)\b/g) || []).length > 0;
      const futureMarks = (low.match(/is expected to|is predicted to|will (rise|fall|increase|decrease|reach|be)|are expected to/g) || []).length;
      if (hasFutureYear && futureMarks === 0) add("warn", "GRA", "题目含未来年份——预测要用 is expected to / is predicted to / will。", "");
      if (pastYears.length && !hasFutureYear) {
        const pastOk = (low.match(/\b(rose|fell|increased|decreased|was|were|had|stood|accounted|made up|declined|dropped|jumped|doubled|remained|fluctuated|peaked|totalled|spent|earned|visited|used|produced|consumed|exported)\b/g) || []).length;
        if (pastOk === 0) add("warn", "GRA", "题目给的是过去年份——数据句要用一般过去式（不要现在时/完成时）。", "");
      }
    }

    // ---- 用词雷区 ----
    if (/\b(depicts|indicates|reveals|exhibits|enumerates|portrays|demonstrates)\b/i.test(essay)) add("warn", "LR", "show 的花哨同义词（depicts/exhibits...）考官并不买账——只用 compares / illustrates / gives information about。", "");
    if (/\b(soar(s|ed|ing)?|rocket(s|ed|ing)?|plummet(s|ed|ing)?|skyrocket\w*)\b/i.test(essay)) add("warn", "LR", "soar/rocket/plummet 过于夸张、新闻化——用 increase/rise/fall + 幅度副词，并用名词动词双句式展示语法控制。", "");
    if (/comparing to/i.test(essay)) add("bad", "LR", "没有 comparing to 这种表达——用 compared to / compared with / in comparison with。", "");
    if (/\bthe (number|amount|figure|percentage|proportion)[^.]{0,40}\braised\b/i.test(essay)) add("warn", "GRA", "rise/raise 混用：数据上升用 rose；raise 是及物动词（有人抬起某物）。", "");
    if (/\bin conclusion\b|\bto conclude\b|\bto sum up\b/i.test(essay)) add("warn", "TA", "Task 1 不写结论段（overview 已是总结）——删掉结论句或改为最后一条细节。", "");
    if (/\bwe can see that\s+the (chart|graph|table|diagram)\b/i.test(paras[0] || "")) add("warn", "TA", "开头段别用 we can see that——直接 The chart compares... 开头。", "");

    // ---- 拼写（复用 Task 2 词表）----
    const misspelled = [];
    for (const [bad, good] of Object.entries(SPELLING)) {
      if (new RegExp("\\b" + bad + "\\b", "i").test(low)) misspelled.push(`${bad} → ${good}`);
    }
    if (misspelled.length) add("bad", "LR", `拼写错误：${misspelled.join("；")}。`, "");

    // ---- 词伙/主题词（LR 简化：数字语言多样性）----
    const numLang = (low.match(/\b(the figure for|the number of|the amount of|the proportion of|the percentage of|accounted for|made up|stood at|per cent|%|respectively|overall)\b/g) || []).length;
    if (numLang < 3) add("warn", "LR", "数据表达单一——用活 the figure for / accounted for / stood at / make up 这组“数字语言”（考官点名的加分项）。", "");
    else add("ok", "LR", `数据表达丰富（${numLang} 处多样化表达）。`, "");

    // ---- 打分 ----
    const score = { TA: 7, CC: 7, LR: 7, GRA: 7 };
    const critIssues = { TA: [], CC: [], LR: [], GRA: [] };
    issues.forEach(i => critIssues[i.crit] && critIssues[i.crit].push(i));
    for (const c of ["TA", "CC", "LR", "GRA"]) {
      let s = 7;
      critIssues[c].forEach(i => { if (i.noscore) return; if (i.sev === "bad") s -= 1; else if (i.sev === "warn") s -= 0.5; });
      score[c] = Math.max(5, s);
    }
    info.push(`句数：${allSents.length}（参考：开头1 + overview2 + 细节 3+3 ≈ 9 句）。`);
    return { W, paras: paras.length, sents: allSents.length, issues, info, score, digits, compHits, trendHits };
  }

  return { check, checkT1, words, sentences, paragraphs };
})();
