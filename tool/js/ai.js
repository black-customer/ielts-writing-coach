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

【评分边界】严格依据本次题目与学生原文给出参考评分，不以旧校准样本的误差保证新作文准确率。反馈必须有原文证据，不能把教学偏好当官方扣分规则。未提供题目时说明 TR/TA 无法充分核验；Task 1 未提供原图数据时明确无法验证选点和数字是否准确。

【评分依据 A：雅思官方写作量表（2023 年 5 月现行版）】
- TR/TA 任务回应：题目的主要部分是否得到恰当回应；立场是否清晰且有展开；主要观点是否得到解释和支撑。支撑可以是推理、具体情境或例子，不要求每段都有固定格式的例子。
- CC 连贯衔接：信息与观点组织是否合逻辑、全文是否有清晰推进（clear progression）；衔接手段是否多样且灵活（含指代 reference 和替换 substitution），机械堆砌连接词是 6 分特征；分段是否合理有效。
- LR 词汇资源：是否使用 less common and/or idiomatic items（不太常见和/或习语性表达）；是否体现对语域和搭配（style and collocation）的意识；拼写构词错误是否少量。
- GRA 语法：无错句子是否频繁（error-free sentences are frequent）；句式是否多样；错误是否为非系统性小错。
- 四项等权平均；打分可以到 0.5。宁可保守，不要讨好。

【教学参考 B：可选写法，不是扣分规则】
- Task 2 可用四段结构作为练习脚手架，但不因段落数、句数、篇幅比例不符合模板而扣分，评价实际组织和展开质量。
- 开头可以简洁交代话题和回答，结尾可以总结立场；不要求固定句数或指定立场短语。
- 段内展开可用 idea → explain → support；推理、细节和具体例子都可支撑，按实际内容评价。
- 衔接评价真实逻辑与灵活性；不能根据某个连接词或指定词语的有无判分。
- 词汇评价：以准确、得体、灵活为准。不能仅因出现 utilize/demerits/plethora/myriad 等词就扣分，也不要求每段凑固定数量的词伙。
- 语法真相：准确性优先于复杂度（accuracy over complexity）。
- Task 1 需要准确概括主要特征、选择相关细节并组织比较或阶段关系；没有固定段数、概括位置或句数。依据实际主语与指标评价语言逻辑；缺图时不能猜测数字和选点质量。

【输出要求】
- sentenceIssues 挑最重要的 5-10 处，quote 必须是学生原文的连续片段（10 词以内，逐字摘录），每处给出问题和具体改法。
- sentenceIssues 同一原句的问题合并，不重复罗列。可增加 kind 字段，值为“明确错误”“需要核对”或“可选建议”；没有证据证明错误时用“需要核对”。fix 给可执行的动作或保留原意的简短示例，不替学生添加未经原稿支持的事实。
- paragraphComments 按学生原稿的实际段落顺序点评，不假设每篇都是四段。
- priorityFixes 给 3 条以内、按影响力排序的修复动作，每条包含原文问题、一个学生可以自己完成的改写动作和可检查的成功标准。优先解释因果或修正错误，不鼓励照抄改写示范。
- learningTarget 提供一个最优先的具体训练目标：skill 从 response/development/coherence/vocabulary/grammar/overview/data/completion 选择（response/development 仅 Task 2，overview/data 仅 Task 1）；problem 描述原文问题；quote 逐字引用原稿中的连续片段（3–20 个英文词）；why 解释这个问题如何影响内容或表达；instruction 给学生自己完成的一个练习；checks 给三条可检查的成功标准。不要以最低分项代替实际问题分析，不编造学生原句。无可靠证据时省略 learningTarget，保留审慎的 priorityFixes。
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
    want.forEach(k => { const raw = r.scores[k] ?? (k === "TA" ? r.scores.TR : undefined); const v = Number(raw); if (raw !== null && raw !== "" && Number.isFinite(v) && v >= 0 && v <= 9) clean[k] = v; });
    if (Object.keys(clean).length !== 4) throw new Error("AI 返回的四项分数不完整或超出 0–9，请重试");
    r.scores = clean;
    r.overall = Math.round(Object.values(clean).reduce((a, b) => a + b, 0) / 4 * 2) / 2;
    r.sentenceIssues = (Array.isArray(r.sentenceIssues) ? r.sentenceIssues : []).filter(i => i && typeof i.quote==='string').slice(0, 12)
      .map(i => ({ quote: i.quote, problem: String(i.problem || i.issue || i.problem_cn || ""), fix: String(i.fix || i.suggestion || i.correction || i.fix_en || ""), kind:['明确错误','需要核对','可选建议'].includes(i.kind)?i.kind:'需要核对' }));
    r.paragraphComments = Array.isArray(r.paragraphComments)?r.paragraphComments.filter(p=>p&&typeof p==='object'):[];
    r.priorityFixes = (Array.isArray(r.priorityFixes)?r.priorityFixes:[]).filter(f=>typeof f==='string'&&f.trim()).slice(0,3);
    r.learningTarget = r.learningTarget && typeof r.learningTarget === 'object' && !Array.isArray(r.learningTarget) ? r.learningTarget : null;
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
