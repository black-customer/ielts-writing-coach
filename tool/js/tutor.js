/* =========================================================
 * tutor.js — AI 导师引擎（训练营核心）
 * 知识注入：Simon 方法论 + 题型 playbook + 话题弹药 + 词伙 → 注入每次调用的 system prompt
 * 阶段状态机：审题课 → 范文先行 → 开头课 → 主体1 → 主体2 → 结尾课 → 总结
 * ========================================================= */
const Tutor = (() => {

  const METHOD_COMPACT = `【教学参考：Task 2】
- 本工具的逐段训练使用四段脚手架；独立作文的段数和句数由内容决定，不能以模板匹配程度判分。
- 回应题目的主要部分，保持清楚的立场。用解释、细节或具体情境支撑观点，不要求固定例子标记。
- 根据真实逻辑使用连接、指代与替换，不能因某个连接词出现或缺失直接判断分数。
- 词汇看准确性、范围、搭配和语体，不按大词清单扣分，也不按词伙数量加分。
- 按原稿指出一个最重要的问题，逐字引用证据，给自己能完成的修改动作与检查标准。保留学生原意，不添加虚构事实。
- 准确性与句式范围都需要考虑，不能由一个句式保证某个 Band。`;

  const METHOD_T1 = `【教学参考：Task 1】
- 本工具的逐段训练使用开头、概括、两组细节作为脚手架；不要求固定句数、数字数量或概括位置。
- 对照原图选择主要特征，组织重要细节和比较。地图与流程图按实际位置、变化和阶段解释。
- 数字、单位和年份来自原图或已提供的数据；没有原图时明确无法核验，不补造数据或图外原因。
- 时态由时间关系决定，语态由主语与动作决定，不要求所有人工流程用被动或自然过程用主动。
- 衔接要表达真实关系，用词准确得体；模板、特定连接词和段落位置不能换算为分数。
- 保留学生原意，引用实际原句，给一个可执行动作和自查标准。`;

  // ---------- 知识注入组装 ----------
  // Task 1 图型指导（替代 T2 的题型 playbook）
  const CHART_GUIDE = {
    "line graph": "线图：按趋势走向分组（上升组/下降组/波动组），或按时间段分组。核心语言：increase/rise/surge/double/plateau/decline/remain stable + 倍数表达。",
    "bar chart": "柱图：柱子高低即排名，按「最大组 vs 其他」或时间前后分组。核心语言：the most popular, twice as many, followed by, in contrast。",
    "pie chart": "饼图：按占比大小分组，突出最大与最小份额及变化。核心语言：account for, make up, the largest proportion, a quarter of。",
    "table": "表格：数字较密，可先找「最值+例外」再分组。核心语言：ranked first, at the top/bottom of the list, the exception was。",
    "tables": "表格：数字较密，可先找「最值+例外」再分组。核心语言：ranked first, at the top/bottom of the list, the exception was。",
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

  async function call(stagePrompt, tc, maxTokens, opts) {
    const messages = [
      { role: "system", content: buildSystem(tc) },
      { role: "user", content: stagePrompt }
    ];
    // 统一走 ai.js 的流式助手（SSE 逐字 + AbortController 中断），两套实现收敛为一套
    const text = await AI.streamChat(messages, maxTokens || 4000, opts || {});
    return AI.extractJSON(text); // 解析 + 截断修复（复用 ai.js）
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

要求：概括段聚焦总体特征；细节段选择关键数据并作相关比较；不写图外观点或原因；时态与题干一致；没有原图数据时不能自行设定数字。`;
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
"""${(tc.model && tc.model.paraNotes && tc.model.paraNotes[paraIdx - 2] || "")}
范文该段原文：${extractPara(tc.model && tc.model.essay, paraIdx - 2)}"""

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
  async function teach0(tc, opts) { return call(promptStage0(tc), tc, 3000, opts); }
  async function modelEssay(tc, opts) {
    if (tc.task === 1) throw new Error("这道小作文尚无内置范文，当前 AI 请求也未接收原图数据。请选有内置范文的题目练习，或对照原图独立作答后做语言诊断。");
    return call(promptStage1(tc), tc, 6000, opts);
  }
  async function paraTeach(tc, paraIdx, opts) {
    const names = paraNames(tc);
    const focus = TEACH_FOCUS[tc.task === 1 ? "t1" : "t2"][paraIdx];
    const modelPara = extractPara(tc.model && tc.model.essay, paraIdx - 2);
    return call(`请为这道题的"${names[paraIdx]}"上一节微教学课（学生还没写这一段，范文对应段供你参考）。严格输出 JSON：
{"why": "这一段在全文中的任务 + 范文是怎么完成这个任务的（中文，100字内，讲清思路从哪来）",
"modelPara": "范文对应段的英文原文",
"expressions": [{"en":"这一段的关键表达","zh":"中文"}, 4-6 条],
"guideQ": "引导学生自己动笔前想清楚的一个问题（中文）"}

${focus}
范文对应段：
"""${modelPara}"""`, tc, 3000, opts);
  }
  async function paraFeedback(tc, paraIdx, opts) {
    const studentText = tc.paraTexts[paraIdx - 2] || "";
    return call(promptParaStage(tc, paraIdx, studentText), tc, 4000, opts);
  }
  async function summary(tc, opts) { return call(promptSummary(tc), tc, 2500, opts); }

  return { teach0, modelEssay, paraTeach, paraFeedback, summary, buildSystem };
})();
