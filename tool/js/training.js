/* =========================================================
 * training.js — 训练营：选题 → AI 导师逐段带写 → 诊断复盘闭环
 * ========================================================= */

// ---------- 数据 ----------
function trainingPool() {
  const pool = [];
  const all = [
    ...(typeof QuestionBank !== "undefined" ? QuestionBank : []),
    ...(typeof ExtraQuestions !== "undefined" ? ExtraQuestions : []),
    ...(typeof QuestionsC1921 !== "undefined" ? QuestionsC1921 : []),
    ...(typeof JijingQuestions !== "undefined" ? JijingQuestions : [])
  ];
  all.forEach(q => {
    const jijing = /^机经/.test(q.src || "");
    const m = q.src.match(/剑(\d+)\s+Test\s+(\w+)/);
    if (!jijing && (!m || +m[1] < 10)) return; // 训练营范围：剑10-21 + 机经
    const book = jijing ? 99 : +m[1];          // 机经以"剑99"分组排序，显示为独立区块
    const test = jijing ? (q.src.match(/(\d+)月/) || [])[1] || "1" : m[2];
    const srcField = jijing ? q.src : q.src;
    if (q.t2) pool.push({ src: srcField, book, test, task: 2, question: q.t2, qtype: q.t2type, t1type: q.t1type || "", jijing });
    // Task 1：题干完整才入池（剑15-18 老数据里是"详见原书"占位）
    if (q.t1 && !/详见原书/.test(q.t1)) pool.push({ src: srcField, book, test, task: 1, question: q.t1, qtype: q.t1type || "mixed charts", t2type: q.t2type, jijing });
  });
  return pool.sort((a, b) => a.book - b.book || a.test.localeCompare(b.test, undefined, { numeric: true }) || a.task - b.task);
}
function tKey(q) { return `${q.src} T${q.task}`; }
function trainStore() { return Store.get("training", { done: {} }); }
function saveTrainStore(s) { Store.set("training", s); }
const trainTypeName = t => ({ "opinion": "观点题", "discussion": "讨论+观点", "adv-disadv": "纯利弊", "adv-disadv-opinion": "利弊比较", "problem-solution": "问题解决", "two-part": "双问题" }[t] || t);
const trainChartName = t => ({ "line graph": "线图", "line graphs": "线图", "bar chart": "柱图", "bar charts": "柱图", "pie chart": "饼图", "pie charts": "饼图", "pie + bar charts": "饼图+柱图", "pie + table": "饼图+表", "table + pie charts": "表+饼图", "table": "表格", "tables": "表格", "maps": "地图", "map": "地图", "plans": "地图", "process diagram": "流程图", "diagram (life cycle)": "流程图", "diagram (process)": "流程图", "mixed charts": "混合图", "chart + table": "图表组合", "chart": "图表", "letter (GT)": "书信" }[t] || t || "图表");
function poolBadge(q) { return q.task === 1 ? trainChartName(q.qtype) + " · 小作文" : trainTypeName(q.qtype); }

// ---------- 会话状态 ----------
let tc = null; // 当前训练会话
function saveSession() { if (tc) Store.set("trainSession", tc); }
function clearSession() { tc = null; Store.set("trainSession", null); }

// 在语料库中找同题考官范文（内容词重合度 ≥ 0.5）
function findRealEssay(question) {
  if (typeof EssayCorpus === "undefined") return null;
  const STOP = new Set("the a an and or but if while of to in on for with by at as is are was were be been it its this that these those there their they them he she his her we our you your i my me not no do does did have has had will would can could should may might must from than then so such which who whom whose what when where how about whether some many people person believe think agree disagree extent discuss views opinion advantages disadvantages problems solutions reasons".split(" "));
  const toks = q => new Set((question.toLowerCase().match(/[a-z']{4,}/g) || []).filter(w => !STOP.has(w)));
  const qt = toks(question);
  let best = null, bestScore = 0;
  for (const e of EssayCorpus) {
    if (!e.q) continue;
    const et = toks(e.q);
    if (!et.size || !qt.size) continue;
    let inter = 0;
    et.forEach(w => { if (qt.has(w)) inter++; });
    const score = inter / Math.min(qt.size, et.size);
    if (score > bestScore) { bestScore = score; best = e; }
  }
  return bestScore >= 0.5 ? { essay: best.essay, src: best.src, matchScore: bestScore } : null;
}

function startTraining(q) {
  const s = trainStore();
  const prev = s.done[tKey(q)];
  tc = {
    qKey: tKey(q), src: q.src, book: q.book, test: String(q.test), task: q.task || 2,
    question: q.question, qtype: q.qtype,
    stage: 0, paraTexts: ["", "", "", ""],
    stage0: null, model: null, paraTeach: {}, paraFeedback: {}, summary: null,
    resumedNote: prev ? `（此前已训练：${prev.status === "done" ? "已完成" : "进行中"}）` : ""
  };
  // 恢复或初始化段落草稿
  const draft = Store.getDraft("train_" + tc.qKey);
  if (draft && draft.paras) tc.paraTexts = draft.paras;
  renderTraining();
  goto("train");
}
function persistDraft() {
  if (!tc) return;
  Store.set("train_" + tc.qKey, { t: Date.now(), paras: tc.paraTexts });
}

// ---------- 主渲染 ----------
function renderTraining() {
  $("#trainHome").classList.toggle("hidden", !!tc);
  $("#trainSession").classList.toggle("hidden", !tc);
  if (tc) renderSession(); else renderHome();
}

// 矩阵选题状态（大/小作文分区 + 题型筛选）
let trainFilter = { task: 2, type: "" };
const T2_SHORT = { opinion: "观点", discussion: "讨论", "adv-disadv-opinion": "利弊", "adv-disadv": "纯利弊", "problem-solution": "解决", "two-part": "双问" };

function renderHome() {
  const pool = trainingPool();
  const s = trainStore();
  const books = [...new Set(pool.map(q => q.book))].sort((a, b) => a - b);
  const t2 = pool.filter(q => q.task === 2), t1 = pool.filter(q => q.task === 1);
  const stat = list => list.reduce((a, q) => { const st = s.done[tKey(q)]; return st && st.status === "done" ? a + 1 : a; }, 0);
  const totalDone = stat(pool), total = pool.length;
  const curAll = trainFilter.task === 1 ? t1 : t2;
  const cur = curAll.filter(q => !trainFilter.src || (trainFilter.src === "jijing" ? q.jijing : !q.jijing));
  const shown = trainFilter.type ? cur.filter(q => q.qtype === trainFilter.type) : cur;
  const jN = stat(curAll.filter(q => q.jijing)), yN = stat(curAll.filter(q => !q.jijing));
  const groups = trainFilter.src === "jijing" ? [99] : [...books, ...(trainFilter.src === "" ? [99] : [])];
  const typeCounts = {};
  cur.forEach(q => typeCounts[q.qtype] = (typeCounts[q.qtype] || 0) + 1);
  const cachedCount = cur.filter(q => typeof ModelEssays !== "undefined" && ModelEssays[tKey(q)]).length;

  $("#trainHome").innerHTML = `
    <div class="card">
      <h2>🎓 训练营 — AI 导师逐段带写</h2>
      <p class="hint">目标：把 <b>剑10-21</b> 的写作全部写完并复盘（共 ${total} 道：大作文 + 小作文）。当前完成：<b>${totalDone}</b> 篇。<br>
      ✅ 剑15-21 的 56 篇范文与逐段教学包、审题课<b>已内置</b>（看范文、读教学零消耗）；剑10-14 的范文自动匹配 Simon 考官语料，AI 仅在点评你的段落时消耗。</p>
      <div class="score-grid">
        ${books.map(b => {
          const qs = pool.filter(q => q.book === b);
          const done = stat(qs);
          return `<div class="score-card"><div class="crit">剑${b}</div><div class="score" style="font-size:22px;color:var(--primary-dark)">${done}/${qs.length}</div><div class="crit">T1+T2</div></div>`;
        }).join("")}
      </div>
      <div class="trend-bars" style="height:14px">
        ${books.map(b => {
          const qs = pool.filter(q => q.book === b); const done = stat(qs);
          return `<div style="flex:1;height:12px;background:var(--line);border-radius:6px;overflow:hidden"><div style="width:${qs.length ? done / qs.length * 100 : 0}%;height:100%;background:var(--primary)"></div></div>`;
        }).join("")}
      </div>
    </div>
    <div class="card">
      <div class="q-src-tabs">
        <button class="chip ${trainFilter.src === "" ? "on" : ""}" data-src="">📚 全部题源</button>
        <button class="chip ${trainFilter.src === "jianya" ? "on" : ""}" data-src="jianya">📕 剑雅真题 <span class="hint">${yN}</span></button>
        <button class="chip ${trainFilter.src === "jijing" ? "on" : ""}" data-src="jijing">🗒 机经考题 <span class="hint">${jN}</span></button>
      </div>
      <div class="q-task-tabs">
        <button class="mode-btn ${trainFilter.task === 2 ? "active" : ""}" data-tf="2">📝 大作文 <span class="hint">${stat(t2)}/${t2.length}</span></button>
        <button class="mode-btn ${trainFilter.task === 1 ? "active" : ""}" data-tf="1">📊 小作文 <span class="hint">${stat(t1)}/${t1.length}</span></button>
      </div>
      <div class="chip-row">
        <button class="chip ${trainFilter.type === "" ? "on" : ""}" data-type="">全部</button>
        ${Object.keys(typeCounts).map(t => `<button class="chip ${trainFilter.type === t ? "on" : ""}" data-type="${esc(t)}">${trainFilter.task === 1 ? esc(trainChartName(t)) : esc(T2_SHORT[t] || t)} <span class="hint">${typeCounts[t]}</span></button>`).join("")}
      </div>
      ${groups.map(b => {
        const qs = shown.filter(q => q.book === b);
        if (!qs.length) return "";
        const head = b === 99 ? "🗒 机经·考场回忆" : `剑${b}`;
        return `<h3 class="q-book-head">${head}</h3>
        <div class="q-grid">
          ${qs.map(q => {
            const st = s.done[tKey(q)];
            const done = st && st.status === "done";
            const has = typeof ModelEssays !== "undefined" && !!ModelEssays[tKey(q)];
            const tag = trainFilter.task === 1 ? trainChartName(q.qtype) : (T2_SHORT[q.qtype] || q.qtype);
            return `<div class="q-card ${done ? "done" : st ? "wip" : ""}" data-tq="${esc(tKey(q))}" title="${esc(q.question.slice(0, 90))}…
${esc(q.question.length > 90 ? q.question.slice(90, 180) : "")}">
              <div class="q-top"><b>${esc(b === 99 ? q.src.replace(/^机经 /, "") : q.src.replace("剑" + b + " ", ""))}</b>
                <span class="badge ${done ? "ok" : st ? "warn" : ""}">${done ? "✅" : st ? "✍️" : has ? "📄" : ""}</span></div>
              <div class="q-tag">${esc(tag)}</div>
            </div>`;
          }).join("")}
        </div>`;
      }).join("")}
      <p class="hint">📄 = 已内置范文 · ✍️ = 进行中 · ✅ = 已完成。点卡片直接开始（不消耗 API，看到范文后才需要你决定是否用 AI 点评）。</p>
    </div>`;

  $$("#trainHome [data-src]").forEach(b => b.onclick = () => { trainFilter.src = b.dataset.src; renderHome(); });
  $$("#trainHome [data-tf]").forEach(b => b.onclick = () => { trainFilter = { task: +b.dataset.tf, type: trainFilter.type, src: trainFilter.src }; renderHome(); });
  $$("#trainHome .chip[data-type]").forEach(b => b.onclick = () => { trainFilter.type = b.dataset.type; renderHome(); });
  $$("#trainHome [data-tq]").forEach(card => card.onclick = () => {
    const q = pool.find(x => tKey(x) === card.dataset.tq);
    if (q) startTraining(q);
  });
}

// ---------- 会话渲染 ----------
// 任务感知的阶段/段落命名：T2 = 开头/主体1/主体2/结尾；T1 = 开头/概括/细节一/细节二
function paraLabel(idx) {
  return tc && tc.task === 1
    ? ["", "", "开头段", "概括段", "细节段一", "细节段二"][idx]
    : ["", "", "开头段", "主体段 1", "主体段 2", "结尾段"][idx];
}
function paraHint(idx) {
  return tc && tc.task === 1
    ? ["", "", "开头段（1-2 句）", "概括段（2 句）", "细节段一（5-7 句）", "细节段二（5-7 句）"][idx]
    : ["", "", "开头段（2 句）", "主体段 1（5-6 句）", "主体段 2（5-6 句）", "结尾段（1 句）"][idx];
}
const STAGES = ["审题课", "范文先行", "开头段", "主体段 1", "主体段 2", "结尾段", "完成"];
function stageBar() {
  const t1Stages = ["读图课", "范文先行", "开头段", "概括段", "细节段一", "细节段二", "完成"];
  const names = (tc && tc.task === 1) ? t1Stages : STAGES;
  return `<div class="stage-bar">${names.map((s, i) =>
    `<span class="stage-node ${i < tc.stage ? "done" : i === tc.stage ? "cur" : ""}">${i + 1}. ${s}</span>`).join("<span class='stage-arrow'>→</span>")}</div>`;
}

function renderSession() {
  const paraTitles = [paraHint(2), paraHint(3), paraHint(4), paraHint(5)];
  $("#trainSession").innerHTML = `
    <div class="card">
      <div class="write-header">
        <div style="flex:1">
          <h2>🎓 训练中：${esc(tc.src)} · ${tc.task === 1 ? "小作文 · " + esc(trainChartName(tc.qtype)) : esc(trainTypeName(tc.qtype))}</h2>
          <div class="en question-echo" style="font-size:var(--fs-md);color:var(--ink);margin:6px 0">${esc(tc.question)}</div>
          ${tc.resumedNote ? `<div class="hint">${esc(tc.resumedNote)}</div>` : ""}
        </div>
        <div class="btn-row" style="margin:0">
          <button class="small" id="tcExit">退出（进度已存）</button>
        </div>
      </div>
      ${stageBar()}
      ${tc.task === 1 && typeof T1Charts !== "undefined" ? `
      <details class="chart-fold" open>
        <summary>📊 题目图表（做题请对照此图）</summary>
        <div class="chart-wrap">${T1Charts.render(tc.src)}</div>
        <p class="hint">图为剑桥原书原题图表（原书扫描版），与考试所见图一致。</p>
      </details>` : ""}
    </div>
    <div class="write-layout">
      <div class="write-main">
        ${paraTitles.map((t, i) => `
          <div class="card para-box">
            <div class="box-head"><span class="box-title">${i + 1}. ${t}</span><span class="box-count" id="tcCount-${i}">0 词</span></div>
            <textarea rows="5" id="tcPara-${i}">${esc(tc.paraTexts[i] || "")}</textarea>
          </div>`).join("")}
        <div class="card total-bar">
          <span>已写 <b id="tcWords">0</b> 词</span>
          <button class="small" id="tcSaveDraft">💾 存草稿</button>
          <button class="primary" id="tcDiagnose">→ 全文送去诊断室</button>
        </div>
      </div>
      <aside class="write-side">
        <div id="tutorFeed" class="side-guide tutor-feed"></div>
      </aside>
    </div>`;

  // 段落输入与计数
  for (let i = 0; i < 4; i++) {
    const el = $(`#tcPara-${i}`);
    el.oninput = () => {
      tc.paraTexts[i] = el.value;
      const w = Checker.words(el.value);
      const c = $(`#tcCount-${i}`);
      c.textContent = `${w} 词`;
      c.className = "box-count " + (w >= 30 ? "ok" : "");
      $("#tcWords").textContent = tc.paraTexts.reduce((a, x) => a + Checker.words(x), 0);
      persistDraft();
    };
    el.dispatchEvent(new Event("input"));
  }
  $("#tcSaveDraft").onclick = () => { persistDraft(); alert("草稿已存。"); };
  $("#tcExit").onclick = () => { persistDraft(); tc = null; renderTraining(); };
  $("#tcDiagnose").onclick = () => {
    persistDraft();
    const full = tc.paraTexts.filter(Boolean).join("\n\n");
    if (Checker.words(full) < 100) { alert("先写多一点再诊断（或继续教学流程）。"); return; }
    const s = trainStore();
    s.done[tc.qKey] = s.done[tc.qKey] || { status: "written", date: Date.now() };
    s.done[tc.qKey].status = "done"; s.done[tc.qKey].date = Date.now();
    saveTrainStore(s);
    if (tc.task === 1) {
      setCheckMode("t1");
      const chartOpt = [...$("#checkChart").options].find(o => trainChartName(tc.qtype) && o.textContent.startsWith(trainChartName(tc.qtype)));
      if (chartOpt) $("#checkChart").value = chartOpt.value;
    } else {
      setCheckMode("t2");
    }
    $("#essayInput").value = full;
    $("#checkQuestion").value = tc.question;
    if (currentAnalysis) $("#checkType").value = currentAnalysis.det.type;
    goto("check");
  };

  renderTutorStage();
  $("#tutorFeed").scrollTop = 0;
}

// ---------- 导师阶段渲染与控制 ----------
function tutorBusy(html) {
  $("#tutorFeed").innerHTML = `<div class="tut-card"><span class="spinner"></span> ${html}</div>`;
}
// 流式运行器：SSE 逐字上屏（节流）+ 中断按钮；fn(opts) 返回解析后的 JSON
let tutorAbort = null;
async function runTutorStream(icon, title, fn) {
  tutorAbort = new AbortController();
  const signal = tutorAbort.signal;
  $("#tutorFeed").innerHTML = `<div class="tut-card"><div class="tut-title">${icon} ${esc(title)}…</div>
    <pre class="tut-stream" id="tutStream"></pre>
    <div class="btn-row" style="margin-top:8px"><span class="hint" id="tutChars">已接收 0 字</span><button class="small" id="tutCancel">■ 中断生成</button></div></div>`;
  $("#tutCancel").onclick = () => tutorAbort.abort();
  let acc = "", lastPaint = 0;
  try {
    const data = await fn({
      onChunk: (delta, full) => {
        acc = full || ((acc += delta));
        const now = Date.now();
        if (now - lastPaint < 80) return;
        lastPaint = now;
        const e = document.getElementById("tutStream");
        if (e) { e.textContent = acc.slice(-1600); e.scrollTop = e.scrollHeight; }
        const ch = document.getElementById("tutChars");
        if (ch) ch.textContent = `已接收 ${acc.length} 字`;
      },
      signal
    });
    if (!data) { $("#tutorFeed").insertAdjacentHTML("beforeend", `<div class="tut-card">⏹ 已中断。可重新点击本阶段按钮再次生成。</div>`); return null; }
    return data;
  } catch (e) {
    if (e && (e.name === "AbortError" || /abort/i.test(e.message || ""))) {
      $("#tutorFeed").insertAdjacentHTML("beforeend", `<div class="tut-card">⏹ 已中断。可重新点击本阶段按钮再次生成。</div>`);
      return null;
    }
    throw e;
  } finally { tutorAbort = null; }
}
function tutorError(e) {
  $("#tutorFeed").insertAdjacentHTML("beforeend", `<div class="tut-card tut-err">❌ ${esc(e.message)}<br><span class="hint">检查「诊断室-AI 设置」的连接；重试即可。</span>
  <div class="btn-row"><button class="small" onclick="renderTraining()">重试本阶段</button></div></div>`);
}

function renderTutorStage() {
  const feed = $("#tutorFeed");
  const stage = tc.stage;
  const cards = [];

  // 历史卡片（审题/范文/各段反馈）
  if (tc.stage0) cards.push(tutorCard0(tc.stage0));
  if (tc.model) cards.push(tutorCardModel(tc.model));
  for (const idx of [2, 3, 4, 5]) {
    if (tc.paraTeach[idx]) cards.push(tutorCardTeach(idx, tc.paraTeach[idx]));
    if (tc.paraFeedback[idx]) cards.push(tutorCardFeedback(idx, tc.paraFeedback[idx]));
  }
  if (tc.summary) cards.push(tutorCardSummary(tc.summary));

  // 当前阶段操作
  const foldBody = (label, inner) => fold ? fold : inner;
  let action = "";
  if (stage === 0) {
    const precached = typeof TutorPrecache !== "undefined" && TutorPrecache[tc.qKey];
    const cached = typeof ModelEssays !== "undefined" && ModelEssays[tc.qKey];
    action = `
      ${cached ? `<div class="btn-row"><button class="primary" id="tcSkipToModel">📄 直接看范文（已内置 · 零消耗）</button></div>` : ""}
      ${tc.stage0
        ? `<div class="btn-row"><button class="primary" id="tcToModel">✅ ${tc.task === 1 ? "分段定了" : "立场定了"}，看考官级范文 →</button></div>`
        : `<div class="btn-row"><button class="primary" id="tcStage0">🎬 开始${tc.task === 1 ? "读图课" : "审题课"}${precached ? "（已内置 · 零消耗）" : "（AI 讲解这道题怎么下手）"}</button></div>`}`;
  } else if (stage === 1) {
    action = tc.model
      ? `<div class="btn-row"><button class="primary" id="tcToPara2">✅ 范文已研读，开始开头段教学 →</button></div>`
      : `<div class="btn-row"><button class="primary" id="tcStage1">📝 生成考官级范文（先看范文再学）</button></div>
         <p class="hint">💰 约 1.5 万 token。生成后可一键复制，拿去外部评分网站验证——这是检验我们教学能力的试金石。</p>`;
  } else if (stage >= 2 && stage <= 5) {
    const taught = !!tc.paraTeach[stage];
    const fb = !!tc.paraFeedback[stage];
    action = `
      ${taught ? `<div class="issue ok"><b>📖 教学已就绪</b>（右侧卡片）。对照教学要点，在左侧写你的"${paraLabel(stage)}"。</div>` : `<div class="btn-row"><button class="primary" id="tcTeachBtn" data-teach="${stage}">📖 开始${paraLabel(stage)}教学</button></div>`}
      <div class="btn-row">
        ${taught ? `<button class="primary" id="tcFBBtn" data-fb="${stage}">🔍 点评我写的这一段</button>` : ""}
        ${fb ? `<button class="primary" id="tcNextBtn" data-next="${stage + 1}">✅ 下一阶段 →</button>` : ""}
      </div>`;
  } else if (stage === 6) {
    action = tc.summary
      ? `<div class="btn-row"><button class="primary" id="tcDoneBtn">🏁 标记此题完成</button></div>`
      : `<div class="btn-row"><button class="primary" id="tcSumBtn">🏁 生成完成总结</button></div>`;
  }

  feed.innerHTML = cards.join("") + `<div class="tut-actions">${action}</div>`;

  // 绑定（事件委托：feed 内动态按钮统一处理）
  feed.querySelectorAll("[data-teach]").forEach(b => b.onclick = async () => {
    const idx = +b.dataset.teach;
    b.disabled = true;
    try {
      const data = await runTutorStream("📖", paraLabel(idx) + "教学", o => Tutor.paraTeach(tc, idx, o));
      if (data) { tc.paraTeach[idx] = data; saveSession(); renderTutorStage(); } else b.disabled = false;
    } catch (e) { tutorError(e); }
  });
  feed.querySelectorAll("[data-fb]").forEach(b => b.onclick = async () => {
    const idx = +b.dataset.fb;
    const student = tc.paraTexts[idx - 1];
    if (Checker.words(student) < 10) { alert("先在左侧写这一段（哪怕一两句），再点评。"); return; }
    b.disabled = true;
    try {
      const data = await runTutorStream("🔍", "点评你的" + paraLabel(idx), o => Tutor.paraFeedback(tc, idx, o));
      if (data) { tc.paraFeedback[idx] = data; saveSession(); renderTutorStage(); } else b.disabled = false;
    } catch (e) { tutorError(e); }
  });
  feed.querySelectorAll("[data-next]").forEach(b => b.onclick = () => {
    tc.stage = +b.dataset.next; saveSession(); renderTutorStage();
  });
  const b0 = document.getElementById("tcStage0");
  if (b0) b0.onclick = async () => {
    b0.disabled = true;
    // 来源1：预生成读图/审题课（零 API 消耗）
    const pre = (typeof TutorPrecache !== "undefined") ? TutorPrecache[tc.qKey] : null;
    if (pre) { tc.stage0 = pre; saveSession(); renderTutorStage(); return; }
    try {
      const data = await runTutorStream("🎬", "读图/审题课", o => Tutor.teach0(tc, o));
      if (data) { tc.stage0 = data; saveSession(); renderTutorStage(); } else b0.disabled = false;
    } catch (e) { tutorError(e); b0.disabled = false; }
  };
  const bSkip = document.getElementById("tcSkipToModel");
  if (bSkip) bSkip.onclick = () => {
    const cached = (typeof ModelEssays !== "undefined") ? ModelEssays[tc.qKey] : null;
    if (!cached) return;
    tc.model = { essay: cached.essay, paraNotes: [], expressions: [] };
    tc.paraTeach = Object.assign({}, cached.paraTeach);
    tc.modelSource = "cached";
    tc.stage = 1; saveSession(); renderTutorStage();
  };
  const bm = document.getElementById("tcToModel");
  if (bm) bm.onclick = () => { tc.stage = 1; saveSession(); renderTutorStage(); };
  const b1 = document.getElementById("tcStage1");
  if (b1) b1.onclick = async () => {
    b1.disabled = true;
    // 来源1：预生成缓存（零 API 成本，教学包齐全）
    const cached = (typeof ModelEssays !== "undefined") ? ModelEssays[tc.qKey] : null;
    if (cached) {
      tutorBusy("从知识库加载预生成范文与逐段教学包…");
      tc.model = { essay: cached.essay, paraNotes: [], expressions: [] };
      tc.paraTeach = Object.assign({}, cached.paraTeach);
      tc.modelSource = "cached";
      tc.stage = 1; saveSession(); renderTutorStage();
      return;
    }
    // 来源2：语料库同题考官原文
    const simon = (typeof findRealEssay === "function") ? findRealEssay(tc.question) : null;
    if (simon) {
      tc.model = { essay: simon.essay, paraNotes: [], expressions: [] };
      tc.modelSource = "simon:" + (simon.src || "语料库");
      tc.stage = 1; saveSession(); renderTutorStage();
      return;
    }
    // 来源3：AI 生成（强模型）
    try {
      const data = await runTutorStream("📝", "写考官级范文（注入审题思路·话题观点·词伙）", o => Tutor.modelEssay(tc, o));
      if (data) { tc.model = data; tc.modelSource = "AI"; tc.stage = 1; saveSession(); renderTutorStage(); } else b1.disabled = false;
    } catch (e) { tutorError(e); b1.disabled = false; }
  };
  const bn = document.getElementById("tcToPara2");
  if (bn) bn.onclick = () => { tc.stage = 2; saveSession(); renderTutorStage(); };
  const bs = document.getElementById("tcSumBtn");
  if (bs) bs.onclick = async () => {
    bs.disabled = true;
    try {
      const data = await runTutorStream("🏁", "完成总结", o => Tutor.summary(tc, o));
      if (data) { tc.summary = data; tc.stage = 6; saveSession(); renderTutorStage(); } else bs.disabled = false;
    } catch (e) { tutorError(e); bs.disabled = false; }
  };
  const bd = document.getElementById("tcDoneBtn");
  if (bd) bd.onclick = () => {
    const s = trainStore();
    s.done[tc.qKey] = { status: "done", date: Date.now() };
    saveTrainStore(s);
    alert("🎉 此题完成！进度已更新。");
    tc = null; renderTraining();
  };
}
// ---------- 导师卡片模板 ----------
function tutCard(icon, title, bodyHtml) {
  return `<div class="tut-card"><div class="tut-title">${icon} ${title}</div>${bodyHtml}</div>`;
}
function tutorCard0(d) {
  const t1 = tc && tc.task === 1;
  return tutCard(t1 ? "🎬" : "🎬", t1 ? "读图课" : "审题课", `
    <p>${esc(d.typeExplain)}</p>
    <div class="persp"><div class="ptitle">${t1 ? "分段方案" : "立场选项"}</div><ul>
      ${(d.stanceOptions || []).map(o => `<li><b>${esc(o.s)}</b> — ${esc(o.why)} <span class="hint">(${esc(o.difficulty)})</span>${d.recommended === o.s ? ' <span class="badge ok">推荐</span>' : ""}</li>`).join("")}
    </ul></div>
    <p>✅ <b>${t1 ? "推荐分段" : "推荐立场"}：</b>${esc(d.recommended)} —— ${esc(d.recommendedWhy)}</p>
    ${d.ideaOutline ? `<p class="en">${t1 ? "Detail 1" : "Body 1"}: ${esc(d.ideaOutline.body1)}<br>${t1 ? "Detail 2" : "Body 2"}: ${esc(d.ideaOutline.body2)}</p>` : ""}
    ${d.guideQ ? `<p class="tr-con">🤔 ${esc(d.guideQ)}</p>` : ""}`);
}
function tutorCardModel(m) {
  return tutCard("📝", `考官级范文（${m.wordCount || "?"} 词）—— 先通读，再学怎么写`, `
    <div class="en" style="white-space:pre-wrap;line-height:1.9;font-size:var(--fs-md)">${esc(m.essay)}</div>
    ${(m.paraNotes || []).length ? `<div class="persp"><div class="ptitle">每段写作思路</div><ul>${m.paraNotes.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>` : ""}
    ${(m.expressions || []).length ? `<div class="persp"><div class="ptitle">值得学的表达</div><div class="coll-grid">${m.expressions.map(x => `<div class="coll-item"><span class="en">${esc(x.en)}</span> <span class="zh">—— ${esc(x.zh)}</span>${starBtn("训练营", x.en, x.zh, "coll")}</div>`).join("")}</div></div>` : ""}
    <div class="btn-row"><button class="small" onclick="navigator.clipboard.writeText(${esc(JSON.stringify(m.essay)).replace(/"/g, "&quot;")}); alert('范文已复制，去外部评分网站验证吧')">📋 复制范文</button>
    <span class="hint">复制去外部网站验证这篇范文的水准——这就是我们教学能力的试金石。</span></div>`);
}
function tutorCardTeach(idx, d) {
  return tutCard("📖", `${paraLabel(idx)} · 为什么这样写`, `
    <p>${esc(d.why)}</p>
    <div class="tpl en">${esc(d.modelPara)}</div>
    ${(d.expressions || []).length ? `<div class="persp"><div class="ptitle">本段表达</div><div class="coll-grid">${d.expressions.map(x => `<div class="coll-item"><span class="en">${esc(x.en)}</span> <span class="zh">—— ${esc(x.zh)}</span>${starBtn("训练营", x.en, x.zh, "coll")}</div>`).join("")}</div></div>` : ""}
    ${d.guideQ ? `<p class="tr-con">🤔 ${esc(d.guideQ)}</p>` : ""}`);
}
function tutorCardFeedback(idx, d) {
  return tutCard("🔍", `${paraLabel(idx)} · 你的版本点评`, `
    <p><b>${esc(d.verdict)}</b></p>
    ${(d.good || []).length ? `<div class="issue ok">${d.good.map(g => `✓ ${esc(g)}`).join("<br>")}</div>` : ""}
    ${(d.issues || []).map(i => `<div class="issue bad">⚠️ ${esc(i.problem)}<br><span style="color:var(--ok)">→ ${esc(i.fix)}</span></div>`).join("")}
    ${d.improved ? `<div class="tpl en" style="margin-top:8px"><b>改进版：</b><br>${esc(d.improved)}</div>` : ""}
    ${(d.expressions || []).length ? `<div class="persp"><div class="ptitle">本段表达</div><div class="coll-grid">${d.expressions.map(x => `<div class="coll-item"><span class="en">${esc(x.en)}</span> <span class="zh">—— ${esc(x.zh)}</span></div>`).join("")}</div></div>` : ""}`);
}
function tutorCardSummary(d) {
  return tutCard("🏁", "完成总结", `
    ${(d.recap || []).length ? `<div class="persp"><div class="ptitle">本篇学到的要点</div><ul>${d.recap.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>` : ""}
    ${(d.worthSaving || []).length ? `<div class="persp"><div class="ptitle">收进词本</div><div class="coll-grid">${d.worthSaving.map(x => `<div class="coll-item"><span class="en">${esc(x.en)}</span> <span class="zh">—— ${esc(x.zh)}</span>${starBtn("训练营", x.en, x.zh, "coll")}</div>`).join("")}</div></div>` : ""}
    ${(d.nextDrills || []).length ? `<div class="issue ok"><b>下一步：</b><ul style="margin:4px 0 0;padding-left:18px">${d.nextDrills.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}`);
}
