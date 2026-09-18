/* =========================================================
 * ai.js — AI 考官精批引擎（DeepSeek API，OpenAI 兼容）
 * 评分依据：2023-05 官方写作量表 + Simon 考官方法论
 * ========================================================= */
const AI = (() => {

  function cfg() {
    const saved = Store.get("ai", {});
    return Object.assign({}, IWC_CONFIG, saved);
  }

  const SYSTEM_PROMPT = `你是一位前雅思考官（Simon 风格）的雅思写作精批员。你的点评要像 Simon：直接、具体、不绕弯子，用中文点评但引用学生原文和改写示例时用英文。

【校准声明】你的评分标准已在 20 篇剑桥官方样卷（Band 3.5-8 的考生手写卷 + 6 篇考官 9 分范文）上完成校准：总分平均绝对误差 0.05，无系统性偏高或偏低。请保持这个口径：不讨好、不虚高，也不矫枉过正。GRA 可允许自己略严（校准显示 GRA 天然偏严 0.25）。

【评分依据 A：雅思官方写作量表（2023 年 5 月现行版）】
- TR/TA 任务回应：题目的主要部分是否得到恰当回应；立场是否清晰且有展开（a clear and developed position）；主要观点是否 extend and supported（延伸+支撑，每个观点要有解释和例子才算支撑）。
- CC 连贯衔接：信息与观点组织是否合逻辑、全文是否有清晰推进（clear progression）；衔接手段是否多样且灵活（含指代 reference 和替换 substitution），机械堆砌连接词是 6 分特征；分段是否合理有效。
- LR 词汇资源：是否使用 less common and/or idiomatic items（不太常见和/或习语性表达）；是否体现对语域和搭配（style and collocation）的意识；拼写构词错误是否少量。
- GRA 语法：无错句子是否频繁（error-free sentences are frequent）；句式是否多样；错误是否为非系统性小错。
- 四项等权平均；打分可以到 0.5。宁可保守，不要讨好。

【评分依据 B：Simon 方法论】
- Task 2 标准结构：4 段 13-15 句（2 句开头 + 两个主体段各 5-6 句 + 1 句结尾）；主体段占全文约 70% 篇幅。
- 开头 2 句：改写题目 + 亮明立场；结尾 1 句换词重申，不加新观点。
- 段内展开：idea → explain → example；例子要具体（谁/哪里/什么事），1-2 句即可。
- 衔接真相：Firstly/Moreover 连发是 CC 6 特征；9 分衔接"几乎不引人注意"（very rarely attracts attention）——靠 this/these 指代、关键词复现、代词回指。
- 词汇真相：主题词伙（topic collocations）才加分；utilize/demerits/plethora/myriad 这类大词反而扣分；万能短语不算 LR 分。
- 语法真相：准确性优先于复杂度（accuracy over complexity）。
- Task 1 标准结构：4 段 9 句（1 句改写开头 + 2 句 overview + 两个细节段各约 3 句）；overview 写两个总体特征不带数字；细节段只挑关键数据（最大/最小/首末年/特殊年）并做比较；不写结论段；"国家 was 数字"是主谓逻辑大错。

【输出要求】
- sentenceIssues 挑最重要的 5-10 处，quote 必须是学生原文的连续片段（10 词以内，逐字摘录），每处给出问题和具体改法。
- paragraphComments 按段落顺序点评（开头段/主体段1/主体段2/结尾段，或 Task 1 的四段）。
- priorityFixes 给 3 条以内、按影响力排序的修复动作，每条要具体到"怎么改"而不是"要加强"。
- rewrite 选最弱的一个主体段做完整改写示范（英文，80-130 词，达到 band 7-7.5 水平，保持学生的观点不变，用更好的结构和词伙）。
- 严格输出 JSON，不要 markdown 代码块。`;

  function buildUserPrompt({ essay, mode, question, type, chart }) {
    const parts = [];
    parts.push(mode === "t1" ? "【任务类型】IELTS Writing Task 1（学术类图表作文）" : "【任务类型】IELTS Writing Task 2（学术类议论文）");
    if (mode === "t1" && chart) parts.push(`【图表类型】${chart}`);
    if (mode === "t2" && type) parts.push(`【题目题型】${type}`);
    parts.push(question ? `【题目原文】\n${question}` : "【题目原文】（考生未提供，按通用标准评）");
    parts.push(`【学生作文】\n${essay}`);
    parts.push(mode === "t1"
      ? "请按 Task 1 标准精批。scores 用键 TA/CC/LR/GRA。"
      : "请按 Task 2 标准精批。scores 用键 TR/CC/LR/GRA。");
    parts.push("输出 JSON 必须包含全部字段：scores、overall、summary（一句话总评）、sentenceIssues（每条含 quote/problem/fix）、paragraphComments（每段一条，含 para/comment）、priorityFixes（数组）、rewrite（含 para/improved）。缺少任何字段视为不合格。");
    return parts.join("\n\n");
  }

  async function callAPI(messages, maxTokens, opts) {
    const o = opts || {};
    if (o.onChunk || o.signal) return streamChat(messages, maxTokens, o);
    const c = cfg();
    const res = await fetch(c.baseUrl.replace(/\/$/, "") + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + c.apiKey },
      body: JSON.stringify({
        model: c.model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens || 8000,   // flash 是推理模型：约一半 token 用于隐藏推理，上限必须给足
        response_format: { type: "json_object" }
      })
    });
    if (!res.ok) {
      let msg = "HTTP " + res.status;
      try { const e = await res.json(); msg += " " + (e.error && e.error.message || ""); } catch (_) {}
      throw new Error("API 请求失败：" + msg);
    }
    const data = await res.json();
    return data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "";
  }

  // 流式对话（SSE）：onChunk(增量, 全文)；signal 支持「中断」；返回完整文本
  async function streamChat(messages, maxTokens, opts) {
    const o = opts || {};
    const c = cfg();
    const res = await fetch(c.baseUrl.replace(/\/$/, "") + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + c.apiKey },
      signal: o.signal,
      body: JSON.stringify({
        model: c.model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens || 8000,
        stream: true,
        response_format: { type: "json_object" }
      })
    });
    if (!res.ok) {
      let msg = "HTTP " + res.status;
      try { const e = await res.json(); msg += " " + (e.error && e.error.message || ""); } catch (_) {}
      throw new Error("API 请求失败：" + msg);
    }
    // 端点不支持流式时回退到一次性解析
    const ct = (res.headers.get("content-type") || "");
    if (!ct.includes("event-stream")) {
      const data = await res.json();
      const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "";
      if (o.onChunk) o.onChunk(text, text);
      return text;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "", full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop(); // 末行可能不完整
      for (const line of lines) {
        const s = line.trim();
        if (!s.startsWith("data:")) continue;
        const payload = s.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const j = JSON.parse(payload);
          const delta = j.choices && j.choices[0] && (j.choices[0].delta && j.choices[0].delta.content || j.choices[0].message && j.choices[0].message.content) || "";
          if (delta) { full += delta; if (o.onChunk) o.onChunk(delta, full); }
        } catch (_) { /* 心跳或半包，忽略 */ }
      }
    }
    return full;
  }

  function extractJSON(text) {
    text = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1) throw new Error("AI 返回的不是有效 JSON");
    let body = text.slice(start, end === -1 ? undefined : end + 1);
    try { return JSON.parse(body); } catch (_) { /* 尝试修复截断 */ }
    // 截断修复：去掉最后一个不完整的元素，逐层闭合
    const attempts = [
      body.replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, "") + "}",                    // 字符串值被截断
      body.replace(/,\s*\{[^{}]*$/, "") + "}",                               // 对象被截断
      body.replace(/,\s*"[^"]*"?\s*:?\s*$/, "") + "}",                       // 键被截断
      body.replace(/,\s*"([^"]*)"\s*:\s*\[[^\]]*$/, "") + "}"                // 数组被截断
    ];
    for (const a of attempts) {
      try { return JSON.parse(a); } catch (_) {}
    }
    throw new Error("AI 返回的 JSON 不完整（输出可能被截断），请重试");
  }

  // 精批主入口
  async function review(optsIn) {
    const { essay, mode, question, type, chart, onChunk, signal } = optsIn || {};
    const content = await callAPI([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt({ essay, mode, question, type, chart }) }
    ], 8000, { onChunk, signal });
    const r = extractJSON(content);
    // 规范化：只保留四项评分键（模型可能混入 overall/comment 等额外键）
    if (!r.scores) throw new Error("AI 返回缺少 scores");
    const want = mode === "t1" ? ["TA", "CC", "LR", "GRA"] : ["TR", "CC", "LR", "GRA"];
    const clean = {};
    want.forEach(k => { const v = Number(r.scores[k]); if (v > 0) clean[k.replace("TA", "TR")] = v; });
    if (!Object.keys(clean).length) throw new Error("AI 返回的 scores 中没有有效的四项分数");
    r.scores = clean;
    r.overall = Number(r.overall) || (Object.values(clean).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(clean).length));
    if (r.overall > 9) r.overall = Math.round(r.overall * 2) / 2; // 模型偶尔给字符串分数
    r.sentenceIssues = (r.sentenceIssues || []).filter(i => i && i.quote).slice(0, 12)
      .map(i => ({ quote: i.quote, problem: i.problem || i.issue || i.problem_cn || "", fix: i.fix || i.suggestion || i.correction || i.fix_en || "" }));
    r.paragraphComments = r.paragraphComments || [];
    r.priorityFixes = r.priorityFixes || [];
    r.rewrite = (r.rewrite && r.rewrite.improved) ? r.rewrite : null;
    r.mode = mode;
    return r;
  }

  // 连接测试
  async function ping() {
    const t0 = Date.now();
    const content = await callAPI([{ role: "user", content: "Reply with exactly: OK" }], 5);
    return { ok: content.includes("OK"), ms: Date.now() - t0, model: cfg().model };
  }

  return { review, ping, cfg, streamChat, extractJSON };
})();
