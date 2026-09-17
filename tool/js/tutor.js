/* =========================================================
 * tutor.js — AI 导师引擎（训练营核心）
 * 知识注入：Simon 方法论 + 题型 playbook + 话题弹药 + 词伙 → 注入每次调用的 system prompt
 * 阶段状态机：审题课 → 范文先行 → 开头课 → 主体1 → 主体2 → 结尾课 → 总结
 * ========================================================= */
const Tutor = (() => {

  const METHOD_COMPACT = `【教学法（前雅思考官 Simon 体系，务必贯彻）】
- Task 2 万能骨架：4 段 13-15 句。开头 2 句（句1改写题目+句2亮明立场）；主体段各 5-6 句（主题句→解释→具体例子→结果）；结尾 1 句换词重申，绝不加新观点。
- 开头改写手法：同义替换/词性转换/语序重组，但保留题目核心词。
- 主体段展开：一个观点写透（idea→explain→example），例子要具体（谁/哪里/什么事/数字）；不用贪多，全文只展开 2 个观点。
- 立场选择标准：哪个立场词伙最多、最好展开就写哪个（不是"最真实"的）。让步式用 While I accept A, I believe B。
- 衔接真相：Firstly/Moreover 连发是 6 分特征；高分靠 this/these 指代、关键词复现、代词回指。
- 词汇真相：主题词伙（topic collocations）才加分；utilize/plethora 这类大词反而扣分。
- 语法真相：准确性优先于复杂度。9 分=无懈可击；7 分=立场清晰+观点有延伸支撑+错误少。
- 评分锚点：官方样卷校准显示该体系评分与官方一致（MAE 0.05）。`;

  const METHOD_T1 = `【教学法（前雅思考官 Simon 体系，Task 1 小作文，务必贯彻）】
- Task 1 万能骨架：4 段 160-190 词。开头 1-2 句（改写题干：同义替换 show/对象/地点/时间）；概括段 2 句（选 1-2 个最显著/最总体特征，写趋势或总差异，不写细节数字）；细节段×2（把数据按"组"分开写，每段一个组，数字要选代表性的：起点/终点/峰值/交点/倍数）。
- 概括段是 8 分的分水岭：没有概括段 TA 上不了 6。概括=能从图上一眼看出的结论，不是流水账开头。
- 永远不写观点、原因、推测图外信息；数字必须来自图（教学场景图数据由题干描述给出，保持内部一致即可）。
- 时态由时间决定：过去年份用过去时；无年份/流程图用一般现在时+被动；有将来年份用将来时。
- 对比是灵魂：每个数字尽量带比较对象（倍数/差距/反超/最值），不许孤立罗列。
- 数据描述词伙按图型积累：趋势（surge, double, plateau, a threefold increase）、占比（account for, make up）、流程（is converted, before being）。
- 衔接真相：Firstly/Moreover 连发是 6 分特征；高分靠 this/these 指代、对比句内衔接、关键词复现。
- 语法真相：准确性优先于复杂度。9 分=无懈可击；7 分=概括到位+数据分组清晰+错误少。`;

  // ---------- 知识注入组装 ----------
  // Task 1 图型指导（替代 T2 的题型 playbook）
  const CHART_GUIDE = {
    "line graph": "线图：按趋势走向分组（上升组/下降组/波动组），或按时间段分组。核心语言：increase/rise/surge/double/plateau/decline/remain stable + 倍数表达。",
    "bar chart": "柱图：柱子高低即排名，按「最大组 vs 其他」或时间前后分组。核心语言：the most popular, twice as many, followed by, in contrast。",
    "pie chart": "饼图：按占比大小分组，突出最大与最小份额及变化。核心语言：account for, make up, the largest proportion, a quarter of。",
    "table": "表格：数字最密，必须先找「最值+例外」再分组。核心语言：ranked first, at the top/bottom of the list, the exception was。",
    "tables": "表格：数字最密，必须先找「最值+例外」再分组。核心语言：ranked first, at the top/bottom of the list, the exception was。",
    "maps": "地图：按时间前后分两段写变化，突出「新增/拆除/扩建/用途改变」。核心语言：was replaced by, was converted into, a new ... was built to the north of。",
    "process diagram": "流程图：按工序先后顺序写，用被动语态+顺序连接。核心语言：is transported, is then converted, before being, the final step is。",
    "mixed charts": "混合图：先分别概括两图各自的最显著特征，细节段一图一段。",
    "chart + table": "图表组合：先分别概括两图各自的最显著特征，细节段一图一段。",
    "pie + bar charts": "图表组合：先分别概括两图各自的最显著特征，细节段一图一段。"
  };
  const TREND_VOCAB = "rose/climbed to（升至） | surged/skyrocketed（暴涨） | doubled/tripled（翻倍/三倍） | a threefold increase（三倍增长） | fell/dropped/declined to（跌至） | plummeted（骤降） | remained stable/levelled off（保持平稳） | fluctuated（波动） | peaked at（达到峰值） | accounted for/made up（占） | the most popular destination（最受欢迎去向） | by contrast/in contrast（相比之下） | overtaking X（反超X） | four times as many as（是…的四倍）";

  function buildSystem(tc) {
    if (tc.task === 1) {
      const chart = CHART_GUIDE[tc.qtype] || CHART_GUIDE["mixed charts"];
      return `${METHOD_T1}

【当前题目信息】
图型：${tc.qtype}
题干：${tc.question}
图型指导：${chart}

【数据描述词伙】
${TREND_VOCAB}

【学生状态】
${tc.stage === 0 ? "尚未动笔，需要从读图审题开始教。" : `已写内容：\n${tc.paraTexts.filter(Boolean).join("\n") || "（暂无）"}`}`;
    }
    const pb = Analyzer.PLAYBOOK[tc.qtype] || Analyzer.PLAYBOOK.opinion;
    const topics = Analyzer.topicsOfText(tc.question);
    let ammo = "";
    if (typeof TopicsLibrary !== "undefined" && topics.length) {
      const libs = TopicsLibrary.filter(t => (t.keys || []).some(k => topics.includes(k)));
      libs.slice(0, 2).forEach(lib => {
        const rows = [];
        (lib.pro || []).slice(0, 4).forEach(x => rows.push("正: " + x.en));
        (lib.con || []).slice(0, 4).forEach(x => rows.push("反: " + x.en));
        (lib.neutral || []).slice(0, 4).forEach(x => rows.push("立场: " + x.en));
        if (rows.length) ammo += `\n【话题弹药·${lib.name}】\n` + rows.join("\n");
      });
    }
    let coll = "";
    if (typeof Collocations !== "undefined" && topics.length) {
      const seen = new Set(); const rows = [];
      topics.forEach(t => (Collocations.BY_TOPIC[t] || []).forEach(c => {
        if (!seen.has(c.en) && rows.length < 20) { seen.add(c.en); rows.push(`${c.en}（${c.zh}）`); }
      }));
      if (rows.length) coll = "\n【推荐词伙】\n" + rows.join(" | ");
    }
    const pbCompact = `题型：${pb.name}。段落任务：${pb.paragraphs.map((p, i) => `${i + 1}.${p.t}`).join(" / ")}。立场指导：${pb.choose.replace(/<[^>]+>/g, "")}`;
    return `${METHOD_COMPACT}

【当前题目信息】
题型：${tc.qtype}
题目：${tc.question}
${pbCompact}${ammo}${coll}

【学生状态】
${tc.stage === 0 ? "尚未动笔，需要从审题开始教。" : `已写内容：\n${tc.paraTexts.filter(Boolean).join("\n") || "（暂无）"}`}`;
  }

  async function call(stagePrompt, tc, maxTokens) {
    const messages = [
      { role: "system", content: buildSystem(tc) },
      { role: "user", content: stagePrompt }
    ];
    const content = await AICall(messages, maxTokens || 4000);
    return content;
  }

  // AICall：与 ai.js 相同的 DeepSeek 调用（独立实现避免耦合其 review 流程）
  async function AICall(messages, maxTokens) {
    const saved = Store.get("ai", {});
    const c = Object.assign({}, IWC_CONFIG, saved);
    const res = await fetch(c.baseUrl.replace(/\/$/, "") + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + c.apiKey },
      body: JSON.stringify({ model: c.model, messages, temperature: 0.4, max_tokens: maxTokens || 4000, response_format: { type: "json_object" } })
    });
    if (!res.ok) {
      let msg = "HTTP " + res.status;
      try { const e = await res.json(); msg += " " + (e.error && e.error.message || ""); } catch (_) {}
      throw new Error("API 请求失败：" + msg);
    }
    const d = await res.json();
    let text = d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content || "";
    text = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    const start = text.indexOf("{"), end = text.lastIndexOf("}");
    if (start === -1) throw new Error("AI 返回不是有效 JSON");
    let body = text.slice(start, end === -1 ? undefined : end + 1);
    try { return JSON.parse(body); } catch (_) {}
    // 截断容错（复用思路）
    const attempts = [
      body.replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, "") + "}",
      body.replace(/,\s*\{[^{}]*$/, "") + "}",
      body.replace(/,\s*"[^"]*"?\s*:?\s*$/, "") + "}"
    ];
    for (const a of attempts) { try { return JSON.parse(a); } catch (_) {} }
    throw new Error("AI 返回的 JSON 不完整，请重试");
  }

  // ---------- 各阶段提示词 ----------
  // 段落名（按任务类型）：T2 = 开头/主体1/主体2/结尾；T1 = 开头/概括/细节一/细节二
  function paraNames(tc) {
    return tc.task === 1
      ? { 2: "开头段（Introduction）", 3: "概括段（Overview）", 4: "细节段一（Detail 1）", 5: "细节段二（Detail 2）" }
      : { 2: "开头段（Introduction）", 3: "主体段 1（Body 1）", 4: "主体段 2（Body 2）", 5: "结尾段（Conclusion）" };
  }
  const TEACH_FOCUS = {
    t2: {
      2: "重点教：句1怎么改写题目（哪些词被替换、什么手法）、句2怎么亮立场。给 3-4 个开头常用改写表达。",
      3: "重点教：这个观点从哪来（对应哪个立场理由）、怎么用 idea→explain→example 展开、例子怎么选、词伙怎么嵌入。给 4-5 个本段主题表达。",
      4: "同主体段 1 的教法，但额外强调与上一段的衔接（On the other hand / Another key...）与视角转换。",
      5: "重点教：怎么换词重申立场而不引入新观点。给 2-3 个结尾句式。"
    },
    t1: {
      2: "重点教：怎么改写题干（show→什么词、对象/地点/时间怎么替换、时态怎么定）。给 3-4 个开头改写句式。",
      3: "重点教：怎么挑最显著特征写概括（总体趋势/最大最小/总差异），为什么概括段不写具体数字。给 2-3 个概括句式。",
      4: "重点教：数据怎么分组（这一段写哪几条线/哪几类/哪个阶段）、选哪些代表性数字（起点/峰值/倍数）、对比语言怎么用。给 4-5 个数据描述表达。",
      5: "重点教：与细节段一怎么分工不重复、剩余数据怎么写透。给 4-5 个数据描述表达。"
    }
  };

  function promptStage0(tc) {
    if (tc.task === 1) {
      return `请给一名中国考生上这道 Task 1 的"读图审题课"。严格输出 JSON：
{"typeExplain": "这是什么图、对象是什么、时间范围决定什么时态、单位是什么（中文，120字内）",
"stanceOptions": [{"s":"分段方案A：写清楚怎么分两组细节","why":"这样分的好处","difficulty":"好写/难写"},{"s":"分段方案B","why":"...","difficulty":"..."},{"s":"分段方案C","why":"...","difficulty":"..."}],
"recommended": "推荐的分段方案名",
"recommendedWhy": "为什么推荐这个分组（从'最好写、对比最清晰'角度，60字内）",
"ideaOutline": {"body1": "细节段一写哪个组+要点（中文一句话）", "body2": "细节段二写哪个组+要点（中文一句话）"},
"guideQ": "给学生的一道引导问题，帮他自己看出图上最显著的特征（中文）"}

要求：概括段要给出一眼可看出的总体特征（写进 typeExplain 或 recommendedWhy 里点一句）。`;
    }
    return `请给一名中国考生上这道题的"审题课"。严格输出 JSON：
{"typeExplain": "这道题是什么题型、题目里有几个部分必须回应、哪个词决定了立场方向（中文，120字内）",
"stanceOptions": [{"s":"完全同意","why":"...","difficulty":"好写/难写"},{"s":"完全不同意","why":"...","difficulty":"..."},{"s":"让步式","why":"...","difficulty":"..."}],
"recommended": "完全同意|完全不同意|让步式 之一",
"recommendedWhy": "为什么推荐这个立场（从'最好写'角度，60字内）",
"ideaOutline": {"body1": "主体段1观点（英文一句话）", "body2": "主体段2观点（英文一句话）"},
"guideQ": "给学生的一道引导问题，帮他自己想出立场（中文，如：你觉得这件事对谁最有影响？）"}

要求：观点和立场要从"中国考生最容易展开"的角度推荐，并利用上面给的【话题弹药】。`;
  }

  function promptStage1(tc) {
    if (tc.task === 1) {
      return `请为这道 Task 1 写一篇 band 8-9 的完整考官风格范文，作为教学示范。严格输出 JSON：
{"essay": "完整范文（4段：开头/概括/细节段一/细节段二，段落间用\\n\\n分隔，160-190词）",
"paraNotes": ["开头段改写了题干的哪些词、时态怎么定的（中文60字内）", "概括段挑了哪1-2个最显著特征、为什么不写数字（中文60字内）", "细节段一分了哪个组、选了哪些代表性数字（中文60字内）", "细节段二同上（中文60字内）"],
"expressions": [{"en":"范文中的数据描述/对比表达","zh":"中文"}, 8-10 条，从范文中摘取],
"wordCount": 数字}

要求：概括段绝不写细节数字；细节段的每个数字尽量带对比（倍数/差距/最值）；不写任何观点或原因；时态与题干时间范围一致；如果题干没给具体数字，就按题干描述合理设定一组内部一致的数字写出示范。`;
    }
    return `请为这道题写一篇 band 8-9 的完整考官风格范文，作为教学示范。严格输出 JSON：
{"essay": "完整范文（4段，段落间用\\n\\n分隔，250-300词）",
"paraNotes": ["开头段为什么这样写（改写了哪些词、立场怎么亮的，中文60字内）", "主体段1的写作思路（观点从哪来、怎么展开、例子怎么选，中文60字内）", "主体段2同上", "结尾段怎么换词重申的（中文40字内）"],
"expressions": [{"en":"范文中的好表达","zh":"中文"}, 8-10 条，从范文中摘取],
"wordCount": 数字}

要求：立场与观点必须与【审题课】的 ideaOutline 一致；尽量使用【推荐词伙】中的表达；例子要具体。`;
  }

  function promptParaStage(tc, paraIdx, studentText) {
    const names = paraNames(tc);
    const focus = TEACH_FOCUS[tc.task === 1 ? "t1" : "t2"][paraIdx];
    return `学生在【学生状态】里写的"${names[paraIdx]}"如下（可能为空或不完整）：
"""${studentText || "（未写）"}"""

范文对应段是：
"""${(tc.model && tc.model.paraNotes && tc.model.paraNotes[paraIdx - 1] || "")}
范文该段原文：${extractPara(tc.model && tc.model.essay, paraIdx - 1)}"""

请作为导师点评学生的这一段，并教学。严格输出 JSON：
{"verdict": "对学生这一段的总评（对比范文差距在哪，中文，80字内；未写则说明这段要完成什么任务）",
"good": ["学生写对了/做得好的点（中文，可空数组）"],
"issues": [{"problem":"问题（中文）","fix":"怎么改（中文，给到具体表达）"}],
"improved": "把学生的这段改进到 band 7-8 水平的完整英文版本（保留学生的观点和立场）",
"expressions": [{"en":"值得学的表达","zh":"中文"}, 3-5 条],
"guideQ": "检查学生是否理解的一道小问题（中文）"}

${focus}`;
  }

  function extractPara(essay, idx) {
    if (!essay) return "";
    const paras = essay.split(/\n\s*\n/);
    return (paras[idx] || "").slice(0, 600);
  }

  function promptSummary(tc) {
    const full = tc.paraTexts.filter(Boolean).join("\n\n");
    return `学生刚完成整篇作文（训练教学模式），请做完成总结。严格输出 JSON：
{"recap": ["本篇学到的要点 1（中文，指向具体方法论，如：开头两句=改写+立场）", "要点2", "要点3"],
"worthSaving": [{"en":"本篇最值得收藏进词本的表达","zh":"中文"}, 4-6 条],
"nextDrills": ["针对学生本篇弱项，推荐 1-2 个下一步练习（引用工具内功能：闪卡语境自测/填空精读/题型专项）"]}

学生全文：
"""${full.slice(0, 3000)}"""`;
  }

  // ---------- 对外接口 ----------
  async function teach0(tc) { return call(promptStage0(tc), tc, 3000); }
  async function modelEssay(tc) { return call(promptStage1(tc), tc, 6000); }
  async function paraTeach(tc, paraIdx) {
    const names = paraNames(tc);
    const focus = TEACH_FOCUS[tc.task === 1 ? "t1" : "t2"][paraIdx];
    const modelPara = extractPara(tc.model && tc.model.essay, paraIdx - 1);
    return call(`请为这道题的"${names[paraIdx]}"上一节微教学课（学生还没写这一段，范文对应段供你参考）。严格输出 JSON：
{"why": "这一段在全文中的任务 + 范文是怎么完成这个任务的（中文，100字内，讲清思路从哪来）",
"modelPara": "范文对应段的英文原文",
"expressions": [{"en":"这一段的关键表达","zh":"中文"}, 4-6 条],
"guideQ": "引导学生自己动笔前想清楚的一个问题（中文）"}

${focus}
范文对应段：
"""${modelPara}"""`, tc, 3000);
  }
  async function paraFeedback(tc, paraIdx) {
    const studentText = tc.paraTexts[paraIdx - 1] || "";
    return call(promptParaStage(tc, paraIdx, studentText), tc, 4000);
  }
  async function summary(tc) { return call(promptSummary(tc), tc, 2500); }

  return { teach0, modelEssay, paraTeach, paraFeedback, summary, buildSystem };
})();
