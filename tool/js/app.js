/* =========================================================
 * app.js — 主控制器（v2：Task1 全流程 / 进度追踪 / 收藏本 / 句子高亮）
 * ========================================================= */

// ---------------- 状态 ----------------
let currentQuestion = "";
let currentAnalysis = null;
let writeMode = "t2";   // 't2' | 't1' | 'mock'
let checkMode = "t2";
let timerId = null, timerLeft = 40 * 60, timerRunning = false;
let lastCheck = null;   // 最近一次诊断结果（供保存记录用）
let lastAi = null;      // 最近一次 AI 精批结果
let lastAiContext = null;
let aiReviewSeq = 0;
function matchingAi(context) {
  return lastAiContext && lastAiContext.essay === context.essay && lastAiContext.question === context.question && lastAiContext.mode === context.mode ? lastAi : null;
}
let rewriteOf = null;   // 改写对比：基于哪条旧记录
let flash = null;       // 闪卡会话状态
let corpusKind = "t2";  // 范文库当前页签
let corpusPage = 1;     // 范文库分页
let mockT1Text = "";    // 模考第 1 阶段（Task 1）暂存内容

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); if(a[0]?.isComposing)return; t = setTimeout(() => fn(...a), ms); }; }
// 知识文档链接：《01-Task2核心方法论》→ docs/01.html；docRef 如 "01 §6"、"04 §2"
function docLink(docRef) {
  const m = String(docRef).match(/^(0\d|1[0-2])/);
  if (!m) return esc(docRef);
  return `<a href="docs/${m[1]}.html" target="_blank" title="打开知识文档">${esc(docRef)}</a>`;
}
function linkifyDocs(escapedText) {
  return String(escapedText).replace(/《((0\d|1[0-2])[^》]*)》/g, (m, label, num) => `<a href="docs/${num}.html" target="_blank">《${label}》</a>`);
}
let bankPage = 1;
function pagerHtml(page, pageCount) {
  if (pageCount <= 1) return "";
  let btns = "";
  for (let i = 1; i <= pageCount; i++) {
    if (pageCount > 9 && i > 2 && i < pageCount - 1 && Math.abs(i - page) > 1) {
      if (!btns.endsWith("…")) btns += `<span class="hint">…</span>`;
      continue;
    }
    btns += `<button class="pg-btn small ${i === page ? "active" : ""}" data-pg="${i}">${i}</button>`;
  }
  return `<div class="pager"><button class="small" data-pg="${page - 1}" ${page <= 1 ? "disabled" : ""}>‹ 上一页</button>${btns}<button class="small" data-pg="${page + 1}" ${page >= pageCount ? "disabled" : ""}>下一页 ›</button><span class="hint">第 ${page} / ${pageCount} 页</span></div>`;
}

// ---------------- 主题（明/暗） ----------------
function applyTheme(t) {
  document.body.classList.toggle("dark", t === "dark");
  $("#btnTheme").innerHTML = UI.icon('sun');
  $("#btnTheme").setAttribute('aria-label',t === 'dark' ? '切换到浅色主题' : '切换到深色主题');
  Store.set("theme", t);
}
$("#btnTheme").onclick = () => applyTheme(Store.get("theme", "light") === "dark" ? "light" : "dark");
applyTheme(Store.get("theme", "light"));

// ---------------- 导航 ----------------
const viewPositions = new Map();
const viewSelections = new Map();
const VIEW_COPY = {train:['今日训练','从一个明确的目标开始，把反馈变成自己的表达。'],write:['写作室','让想法成为完整的文章。'],check:['诊断与改写','在原文中定位问题，再写出自己的下一版。'],analyze:['审题与提纲','先想清楚题目在问什么，再组织你的答案。'],library:['词伙与闪卡','在语境中回忆，把表达用进自己的文章。'],bank:['题库与范文','选一道题，读一种写法。'],plan:['学习路线','把长期目标拆成今天可以完成的练习。'],progress:['记录与词本','回看改写与复测，观察自己的进步。']};
function activateView(view, task = false) {
  const current = $('.view.active')?.id.replace('view-','');
  UI.flush();
  if (current !== view) { viewPositions.set(current,window.scrollY); viewSelections.set(current,EssayEditor.captureSelection()); }
  const b=$(`.nav-btn[data-view="${view}"]`);
  $$(".nav-btn").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  $$('.nav-btn').forEach(x=>x.setAttribute('aria-current',x===b?'page':'false'));
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + b.dataset.view).classList.add("active");
  if (view === "progress") renderProgress();
  if (view === "train" && typeof renderTraining === "function" && (!$('#trainHome').children.length || task)) renderTraining();
  else if(view==='train' && current!==view && !tc && !$('#learningPractice')?.childElementCount) renderHome();
  $('#pageTitle').textContent=VIEW_COPY[view][0];$('#pageDescription').textContent=VIEW_COPY[view][1];
  $('#pageMeta').textContent=new Date().toLocaleDateString('zh-CN',{month:'long',day:'numeric'});
  if(current!==view) requestAnimationFrame(()=>{window.scrollTo(0,task?0:viewPositions.get(view)||0);if(!task)EssayEditor.restoreSelection(viewSelections.get(view));});
}
$$(".nav-btn").forEach(b => b.onclick = () => activateView(b.dataset.view));
function goto(view) { activateView(view,true); }

// ---------------- 收藏（事件委托） ----------------
document.addEventListener("click", e => {
  const btn = e.target.closest(".star-btn");
  if (!btn) return;
  const item = { topic: btn.dataset.topic || "", en: btn.dataset.en || "", zh: btn.dataset.zh || "", kind: btn.dataset.kind || "" };
  const on = Store.toggleStar(item);
  if(on===null){UI.notice('收藏保存失败，请重试。',{error:true});return;}
  btn.classList.toggle("on", on);
  btn.setAttribute('aria-label',on?'取消收藏':'收藏到词本');
  UI.notice(on?'已收藏到词本':'已取消收藏');
});
function starBtn(topic, en, zh, kind) {
  const on = Store.isStarred(en);
  return `<button class="star-btn ${on ? "on" : ""}" data-topic="${esc(topic)}" data-en="${esc(en)}" data-zh="${esc(zh)}" data-kind="${esc(kind || "")}" title="收藏到词本"></button>`;
}

// ---------------- ① 审题与提纲 ----------------
$("#btnAnalyze").onclick = () => {
  const q = $("#questionInput").value.trim();
  const res = Analyzer.analyze(q);
  const errBox = $("#analyzeError");
  if (res.error) { errBox.textContent = res.error; errBox.classList.remove("hidden"); return; }
  errBox.classList.add("hidden");
  currentQuestion = res.question;
  currentAnalysis = res;
  renderAnalysis(res);
};

function renderAnalysis(res) {
  const pb = Analyzer.PLAYBOOK[res.det.type];
  const box = $("#analysisResult");
  box.classList.remove("hidden");

  let ammoHtml = "";
  const topics = res.topics.map(t => t.topic);
  if (typeof TopicsLibrary !== "undefined" && topics.length) {
    const libs = TopicsLibrary.filter(t => (t.keys || []).some(k => topics.includes(k)));
    const li = (arr) => (arr || []).map(x => `<li class="en">${esc(x.en)}${x.zh ? ` <span class="zh" style="color:var(--muted)">（${esc(x.zh)}）</span>` : ""}${starBtn("", x.en, x.zh, "idea")}</li>`).join("");
    const tBlocks = libs.map(lib => {
      let html = `<div class="topic-block"><h3>${esc(lib.name)} 观点弹药</h3>`;
      if (lib.ask && lib.ask.length) html += `<p class="hint">常考问法：${lib.ask.slice(0, 3).map(esc).join(" / ")}</p>`;
      if (lib.pro && lib.pro.length) html += `<div class="persp"><div class="ptitle">正方 / 支持观点（${lib.pro.length}）</div><ul>${li(lib.pro)}</ul></div>`;
      if (lib.con && lib.con.length) html += `<div class="persp"><div class="ptitle">反方 / 反对观点（${lib.con.length}）</div><ul>${li(lib.con)}</ul></div>`;
      if (lib.neutral && lib.neutral.length) html += `<div class="persp"><div class="ptitle">立场 / 解决方案 / 中立观点（${lib.neutral.length}）</div><ul>${li(lib.neutral.slice(0, 12))}</ul></div>`;
      html += `</div>`;
      return html;
    }).join("");
    if (tBlocks) ammoHtml += `<div class="ammo-box"><h3>话题观点库（想观点先来这里借，完整版在「词伙与闪卡」）</h3>${tBlocks}</div>`;
  }
  if (typeof Collocations !== "undefined" && topics.length) {
    const items = [];
    topics.forEach(name => (Collocations.BY_TOPIC[name] || []).slice(0, 10).forEach(c => items.push(c)));
    if (items.length) {
      ammoHtml += `<div class="ammo-box"><h3>本题话题词伙（LR 7 分的子弹，完整词表去词伙与闪卡）</h3><div class="coll-grid">${items.map(c => `<div class="coll-item"><span class="en">${esc(c.en)}</span> <span class="zh">—— ${esc(c.zh)}</span>${starBtn(topics[0], c.en, c.zh, "coll")}</div>`).join("")}</div></div>`;
    }
  }

  box.innerHTML = `
    <div class="card">
      <h2>路线图</h2>
      <p class="en" style="font-style:italic;color:var(--muted)">${esc(res.question)}</p>
      <p><span class="badge type">题型判定：${esc(res.det.name)}</span>
         ${res.det.evidence.map(e => `<span class="badge ok">依据："${esc(e)}"</span>`).join(" ")}
         ${topics.length ? `<span class="badge warn">话题：${topics.map(esc).join(" · ")}</span>` : `<span class="badge warn">话题：未匹配到主题库（用视角法自己生成观点：个人/经济/社会/环境/健康/时间/公平）</span>`}</p>

      <details class="fold" open><summary>立场怎么选</summary><div class="fold-body">
        <div>${pb.stance}</div>
        <div style="margin-top:6px">${pb.choose}</div>
      </div></details>

      <details class="fold" open><summary>四段作战图 <span class="badge-count">主体段占 70% 篇幅与分数</span></summary><div class="fold-body">
        <div class="roadmap-grid">
          ${pb.paragraphs.map((p, i) => `
            <div class="para-card">
              <span class="p-num">${i + 1}</span><b>${p.t}</b>
              <ul>${p.items.map(x => `<li>${x}</li>`).join("")}</ul>
            </div>`).join("")}
        </div>
      </div></details>

      <details class="fold" open><summary>句式模板 <span class="badge-count">照着填空，5 分钟写完开头</span></summary><div class="fold-body">
        ${pb.templates.map(t => `<div class="tpl"><b>${t.label}：</b><br>${t.text}</div>`).join("")}
      </div></details>

      <details class="fold"><summary>这类题最容易踩的坑</summary><div class="fold-body">
        <div class="trap">${pb.traps.map(t => `• ${t}`).join("<br>")}</div>
      </div></details>
      ${ammoHtml}
      <div class="btn-row">
        <button class="primary" onclick="gotoWrite()">→ 带着这道题去写作室</button>
        <button onclick="startOutline()">提纲训练（10 分钟）</button>
      </div>
    </div>`;
}

window.gotoWrite = async function () {
  if (!currentQuestion) return;
  await TaskFlow.write({task:2,question:currentQuestion,qtype:currentAnalysis?.det?.type||''});
};

// ---------------- ② 写作室 ----------------
let mockPhase = 1; // 模考阶段：1=T1，2=T2
function effMode() { return writeMode === "mock" ? (mockPhase === 1 ? "t1" : "t2") : writeMode; }

function renderMockBanner() {
  let old = $("#mockBanner"); if (old) old.remove();
  if (writeMode !== "mock") return;
  const div = document.createElement("div");
  div.id = "mockBanner";
  div.className = "mock-banner";
  div.innerHTML = mockPhase === 1
    ? `<span>模考第 1 阶段 / 2 —— Task 1 小作文，20 分钟。倒计时结束后自动进入 Task 2。</span><button onclick="abortMock()">退出模考</button>`
    : `<span>模考第 2 阶段 / 2 —— Task 2 大作文，40 分钟。写完后先点右侧按钮取回 Task 1，再去诊断与改写。</span>
       <span><button onclick="recallMockT1()">取回 Task 1</button> <button onclick="abortMock()">退出模考</button></span>`;
  $("#paragraphBoxes").before(div);
}
window.abortMock = function () { setWriteMode("t2"); };
window.recallMockT1 = function () {
  if (!mockT1Text) { UI.notice("第 1 阶段没有内容。"); return; }
  setCheckMode("t1");
  $("#essayInput").value = mockT1Text;
  $("#checkQuestion").value = $("#t1QuestionInput").value || "";
  goto("check");
};

function setWriteMode(mode) {
  if ($('#fullEssay') && !saveWritingDraft(true)) return;
  writeMode = mode;
  if (mode === "mock") mockPhase = 1;
  $$("#writeModeSwitch .mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  $("#t1ChartPicker").classList.toggle("hidden", !(mode === "t1" || (mode === "mock" && mockPhase === 1)));
  $('#writeQuestionInput').classList.toggle('hidden',effMode()==='t1');
  $('label[for="writeQuestionInput"]').classList.toggle('hidden',effMode()==='t1');
  resetTimer(mode === "t2" ? 40 * 60 : 20 * 60);
  syncTargets();
  buildParagraphBoxes();
}
function syncTargets() {
  const isT1 = effMode() === "t1";
  $("#wordTarget").textContent = isT1 ? "150+" : "250+";
  $("#sentTarget").textContent = isT1 ? "8–11" : "13–15";
}
$$("#writeModeSwitch .mode-btn").forEach(b => b.onclick = () => setWriteMode(b.dataset.mode));
$('#t1ChartSelect').onchange=()=>{UI.flush();saveWritingDraft(true);renderSideGuide();};

function t1Paragraphs() {
  const ct = $("#t1ChartSelect").value;
  const rule = (T1.chartTypes.find(c => c.type === ct) || {});
  return [
    { t: "Introduction（1 句改写题干）", items: ["shows → compares / illustrates / gives information about", "换核心词：the number of ↔ the figure for；proportion ↔ percentage", "换时间表达：between 1999 and 2009 ↔ over a 10-year period"] },
    { t: "Overview（2 句总体特征，不带数字）", items: ["句式：It is clear that... / It is also noticeable that... / Overall,...", "本图 overview 找什么：" + (rule.overview || "最显眼的两个总体特征"), "概括应准确呈现原图的主要特征，不能由关键词判断质量"] },
    { t: "Details 1（组织一组相关信息）", items: ["本图分组法：" + (rule.rule || ""), "核对所选信息与比较关系，数字数量取决于图表"] },
    { t: "Details 2（补齐另一组重要信息）", items: ["特殊年（峰值/交叉/剧变）+ 末年", "选能说明主要变化的节点，不机械省略或罗列"] }
  ];
}

function buildParagraphBoxes() {
  renderMockBanner();
  const mode = effMode();
  const draft=Store.getDraft(writeMode==='mock'?'mock_'+mode:mode);
  TaskFlow.writingMeta={qKey:draft?.qKey||'',chartKey:draft?.chartKey||'',qtype:draft?.qtype||''};
  if(mode==='t1' && draft?.chart) $('#t1ChartSelect').value=draft.chart;
  $('#writeTaskChart').innerHTML=mode==='t1'?TaskFlow.writingMeta.chartKey?`<details class="chart-fold" open><summary>本次题目图表</summary><div class="chart-wrap">${T1Charts.render(TaskFlow.writingMeta.chartKey)}</div></details>`:'<p class="hint">未关联原图，请对照自己的题目图表写作。</p>':'';
  $("#paragraphBoxes").innerHTML = `<div class="editor-sheet"><div class="editor-label"><label for="fullEssay">我的作文</label><span>Task ${mode==='t1'?'1':'2'} · 自由分段</span></div><textarea id="fullEssay" rows="15" spellcheck="false" placeholder="从你的第一句话开始。段落之间空一行。">${esc(draft?.text||'')}</textarea></div>`;
  $('#fullEssay').oninput=()=>{updateCounts();saveWritingDraft();};
  if (draft?.question) { $('#writeQuestionInput').value=draft.question; if(mode==='t1')$('#t1QuestionInput').value=draft.question; }
  else $('#writeQuestionInput').value=mode==='t2'?currentQuestion:$('#t1QuestionInput').value;
  $('#writeSaveStatus').textContent=draft?'已恢复本机草稿':'草稿自动保存';
  renderSideGuide();
  updateCounts();
}

function updateCounts() {
  let total = 0, totalS = 0;
  $$("#paragraphBoxes textarea").forEach((t, i) => {
    const w = Checker.words(t.value);
    total += w;
    const s = Checker.sentences(t.value).length;
    totalS += s;
    const el = $("#pc-" + i);
    if (el) { el.textContent = `${w} 词 · ${s} 句`; el.className = "box-count " + (w >= 30 ? "ok" : ""); }
  });
  $("#totalWords").textContent = total;
  $("#totalSentences").textContent = totalS;
}

function saveWritingDraft(immediate=false) {
  const text=EssayEditor.getText(), mode=effMode();
  const key=writeMode==='mock'?'mock_'+mode:mode;
  const question=mode==='t1'?$('#t1QuestionInput').value:$('#writeQuestionInput').value;
  const chart=$('#t1ChartSelect').value;
  const meta={...TaskFlow.writingMeta,question,chart};
  return UI.save('writing',()=>Store.saveDraft(key,text,meta),$('#writeSaveStatus'),immediate);
}
$('#writeQuestionInput').oninput=()=>{currentQuestion=$('#writeQuestionInput').value;TaskFlow.writingMeta={};saveWritingDraft();};
$('#t1QuestionInput').oninput=()=>{TaskFlow.writingMeta={};$('#writeTaskChart').innerHTML='<p class="hint">题干已修改，请核对原图是否仍对应当前题目。</p>';saveWritingDraft();};
function renderSideGuide() {
  if (effMode() === "t1") {
    const ct = $("#t1ChartSelect").value;
    const rule = (T1.chartTypes.find(c => c.type === ct) || {});
    $("#writeGuide").innerHTML = `
      <h3>20 分钟参考分配</h3>
      <ul><li>0-5'：读图找 overview + intro 改写</li><li>5-10'：概括主要特征</li><li>10-20'：细节两段</li><li>Task 1 只占总分 1/3，绝不超时</li></ul>
      <h3>${esc(ct)}</h3>
      <ul><li><b>分组法：</b>${esc(rule.rule || "")}</li><li><b>Overview 找：</b>${esc(rule.overview || "")}</li></ul>
      <h3>交卷七查</h3>
      <ul>${T1.checklist.map(m => `<li>${m}</li>`).join("")}</ul>
      <h3>万人坑</h3>
      <ul>${T1.mistakes.slice(0, 6).map(m => `<li>${m}</li>`).join("")}</ul>`;
  } else {
    const type = TaskFlow.writingMeta.qtype || currentAnalysis?.det?.type || "opinion";
    const pb = Analyzer.PLAYBOOK[type] || Analyzer.PLAYBOOK.opinion;
    $("#writeGuide").innerHTML = `
      <h3>40 分钟参考分配</h3>
      <ul><li>0-10'：读题+列提纲</li><li>10-15'：交代话题与回答</li><li>15-35'：两个主体段（10'/段）</li><li>35-40'：总结回答+检查</li></ul>
      <h3>立场提醒</h3>
      <div>${pb.choose}</div>
      <h3>参考表达</h3><p class="hint">按自己的回答调整，不要求固定句数或短语。</p>
      ${pb.templates.slice(0, 2).map(t => `<div class="tpl">${t.label}：${t.text}</div>`).join("")}
      <h3>避坑</h3>
      <ul>${pb.traps.map(t => `<li>${t}</li>`).join("")}</ul>
      <h3>交卷三查</h3>
      <ul><li>动词时态/主谓一致</li><li>名词单复数/冠词</li><li>Although...but、逗号粘连</li></ul>`;
  }
}

// ---- 计时器 ----
function resetTimer(sec) {
  clearInterval(timerId); timerRunning = false;
  timerLeft = sec;
  $("#timerDisplay").textContent = `${String(Math.floor(sec / 60)).padStart(2, "0")}:00`;
  $("#btnTimerStart").textContent = "开始";
}
$("#btnTimerStart").onclick = () => {
  if (timerRunning) { clearInterval(timerId); timerRunning = false; $("#btnTimerStart").textContent = "继续"; return; }
  timerRunning = true; $("#btnTimerStart").textContent = "暂停";
  timerId = setInterval(() => {
    timerLeft--;
    const m = String(Math.max(0, Math.floor(timerLeft / 60))).padStart(2, "0"), s = String(Math.max(0, timerLeft % 60)).padStart(2, "0");
    $("#timerDisplay").textContent = `${m}:${s}`;
    if (timerLeft <= 0) {
      clearInterval(timerId); timerRunning = false;
      if (writeMode === "mock" && mockPhase === 1) {
        saveWritingDraft(true);
        // 模考第 1 阶段结束 → 保留 T1 内容，进入 T2
        mockT1Text = $$("#paragraphBoxes textarea").map(t => t.value.trim()).filter(Boolean).join("\n\n");
        mockPhase = 2;
        $('#writeQuestionInput').classList.remove('hidden');$('label[for="writeQuestionInput"]').classList.remove('hidden');
        $("#t1ChartPicker").classList.add("hidden");
        syncTargets();
        buildParagraphBoxes();
        resetTimer(40 * 60);
        UI.notice("Task 1 时间到！现在开始 Task 2 大作文（40 分钟）。T1 内容已暂存，模考结束后在下方按钮取回。");
        renderMockBanner();
      } else if (writeMode === "mock") {
        UI.notice("模考结束！点击「取回 Task 1 内容」按钮，然后去诊断与改写分别诊断两篇。");
        renderMockBanner();
      } else {
        UI.notice("时间到！" + (writeMode === "t1" ? "Task 1 只占 1/3 分，立刻停笔。" : "Task 2 必须停笔。"));
      }
    }
  }, 1000);
};
$('#btnTimerReset').onclick=()=>resetTimer(effMode()==='t1'?20*60:40*60);

$("#btnSaveDraft").onclick = () => {
  if(saveWritingDraft(true)) UI.notice('草稿已保存到本机');
};
$('#btnCopyDraft').onclick=()=>UI.copy(EssayEditor.getText());

$("#btnToCheck").onclick = () => {
  const text=EssayEditor.getText().trim();
  if(!text){UI.errorAt($('#fullEssay'),'请先写下你的作文。');return;}
  if(!saveWritingDraft(true))return;
  TaskFlow.diagnose(text,{...TaskFlow.writingMeta,mode:effMode(),question:effMode()==='t1'?$('#t1QuestionInput').value:$('#writeQuestionInput').value,chart:$('#t1ChartSelect').value});
};

// ---------------- AI 考官精批 ----------------
$("#btnAiSettings").onclick = () => {
  const p = $("#aiSettingsPanel");
  p.classList.toggle("hidden");
  if (!p.classList.contains("hidden")) {
    const c = AI.cfg();
    $("#aiKey").value = c.apiKey || "";
    $("#aiBase").value = c.baseUrl || "";
    $("#aiModel").value = c.model || "deepseek-flash";
  }
};
$("#btnAiSave").onclick = () => {
  if(!Store.set("ai", { apiKey: $("#aiKey").value.trim() || IWC_CONFIG.apiKey, baseUrl: $("#aiBase").value.trim() || IWC_CONFIG.baseUrl, model: $("#aiModel").value })){UI.notice('AI 设置保存失败，请重试。',{error:true});return;}
  UI.notice("已保存 AI 设置。");
};
$("#btnAiTest").onclick = async () => {
  if(!Store.set("ai", { apiKey: $("#aiKey").value.trim() || IWC_CONFIG.apiKey, baseUrl: $("#aiBase").value.trim() || IWC_CONFIG.baseUrl, model: $("#aiModel").value })){ $('#aiTestResult').textContent='设置保存失败，请重试后测试连接。';return; }
  $("#aiTestResult").textContent = "测试中...";
  try {
    const r = await AI.ping();
    $("#aiTestResult").textContent = r.ok ? `连接成功（${r.model}，${r.ms}ms）` : "有响应但返回异常";
  } catch (e) { $("#aiTestResult").textContent = "" + e.message; }
};

$("#btnAiCheck").onclick = async () => {
  const essay = $("#essayInput").value.trim();
  if (Checker.words(essay) < 60) { UI.errorAt($('#essayInput'),'请至少写 60 个英文词，再请求精批。'); return; }
  UI.errorAt($('#essayInput'),'');
  const requestId = ++aiReviewSeq;
  const context = { ...TaskFlow.checkMeta, essay, question: $("#checkQuestion").value.trim(), mode: checkMode, qtype: $("#checkType").value, chart: $("#checkChart").value };
  const btn = $("#btnAiCheck");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span>精批中…`;
  const box = $("#aiResult");
  box.classList.remove("hidden");
  box.querySelectorAll('.ai-pending,.ai-failure').forEach(el=>el.remove());
  box.insertAdjacentHTML('beforeend', `<div class="ai-pending"><h2>AI 考官精批中…</h2>
    <p class="hint"><span class="spinner"></span>DeepSeek 正在按官方评分标准逐段精读（推理模型通常 20-60 秒）· <span id="aiChars">已接收 0 字</span></p>
    <pre class="tut-stream" id="aiStream"></pre>
    <div class="btn-row"><button class="small" id="aiCancel">取消生成</button></div></div>`);
  const aiAbort = new AbortController();
  $('#aiCancel').onclick = () => {aiAbort.abort();aiReviewSeq++;box.querySelector('.ai-pending')?.remove();UI.notice('已取消本次生成');btn.disabled=false;btn.textContent='AI 考官精批';};
  let acc = "", lastPaint = 0;
  try {
    const questionText = context.question;
    const r = await AI.review({
      essay, mode: context.mode, question: questionText,
      type: context.mode === "t2" ? context.qtype : "",
      chart: context.mode === "t1" ? context.chart : "",
      onChunk: (delta, full) => {
        if (requestId !== aiReviewSeq || aiAbort.signal.aborted) return;
        acc = full || acc;
        const now = Date.now();
        if (now - lastPaint < 80) return;
        lastPaint = now;
        const st = document.getElementById("aiChars"), el = document.getElementById("aiStream");
        if (st) st.textContent = `已接收 ${acc.length} 字`;
        if (el) { el.textContent = acc.slice(-1600); el.scrollTop = el.scrollHeight; }
      },
      signal: aiAbort.signal
    });
    if (requestId !== aiReviewSeq || aiAbort.signal.aborted) return;
    lastAi = r;
    lastAiContext = context;
    r.context = context;
    renderAiResult(r);
  } catch (e) {
    if (requestId !== aiReviewSeq) return;
    if (e && (e.name === "AbortError" || /abort/i.test(e.message || ""))) {
      box.querySelector('.ai-pending')?.remove();UI.notice('已取消本次精批');
      btn.disabled = false; btn.innerHTML = "AI 考官精批";
      return;
    }
    box.querySelector('.ai-pending')?.remove();
    box.insertAdjacentHTML('beforeend', `<div class="issue bad ai-failure" role="alert">精批失败：${esc(e.message)}<div class="btn-row"><button id="aiRetry">用当前作文重试</button><button id="aiSettingsRetry">检查 AI 设置</button></div></div>`);
    $('#aiRetry').onclick=()=>$('#btnAiCheck').click();$('#aiSettingsRetry').onclick=()=>$('#btnAiSettings').click();
  } finally {
    if(requestId === aiReviewSeq) {btn.disabled = false;btn.innerHTML = 'AI 考官精批';}
  }
};

function renderAiResult(r) {
  window._lastAi = r; // 供复盘卡 / 错因入库使用
  const box = $("#aiResult");
  box.classList.remove("hidden");
  const critNames = { TR: "任务回应", TA: "任务达成", CC: "连贯衔接", LR: "词汇资源", GRA: "语法多样与准确" };
  const scores = r.scores || {};
  const context = r.context || lastAiContext;
  const matchingRule = lastCheck && context && lastCheck.essay === context.essay && lastCheck.questionText === context.question && lastCheck.mode === context.mode ? lastCheck.res : null;
  box.innerHTML = `
    <div class="card">
      <h2>AI 考官精批（${r.mode === "t1" ? "Task 1" : "Task 2"} · DeepSeek）</h2>
      <div class="score-grid">
        ${Object.entries(scores).map(([c, s]) => `<div class="score-card"><div class="crit">${c} ${critNames[c] || ""}</div><div class="score ${scoreClass(s)}">${s}</div></div>`).join("")}
        <div class="score-card" style="background:var(--accent-bg)"><div class="crit">预估总分</div><div class="score">${r.overall}</div></div>
      </div>
      ${r.summary ? `<p><b>总评：</b>${esc(r.summary)}</p>` : ""}
      ${r.priorityFixes && r.priorityFixes.length ? `<h3>最优先修复</h3><ol>${r.priorityFixes.map(f => `<li>${esc(f)}</li>`).join("")}</ol>` : ""}
      ${r.paragraphComments && r.paragraphComments.length ? `<h3>逐段点评</h3>${r.paragraphComments.map(p => `<div class="issue"><b>${esc(p.para || p.paragraph || "段落")}：</b>${esc(p.comment || "")}</div>`).join("")}` : ""}
      <p class="hint">AI 评分是参考意见，误差大小不能保证；请结合原题、自己的证据和外部反馈核对。此结果不自动存入进度记录。</p>
      <div class="btn-row"><button id="btnAiSaveRecord">把 AI 分数存入进度</button><button id="btnAiReviewCard">复盘卡 + 错因入库</button></div>
    </div>`;
  $("#btnAiReviewCard").onclick = () => {
    document.getElementById("aiReviewPanel")?.remove();
    $("#aiResult").insertAdjacentHTML("beforeend",
      `<div id="aiReviewPanel">` + buildReviewCard(matchingRule || { issues: [], score: {} }, r)
      + `<div class="btn-row"><button class="primary" id="btnAiErrImport">错因入库（生成复习卡，进 SRS 队列）</button></div><div id="aiErrImportResult"></div></div>`);
    $("#btnAiErrImport").onclick = () => errCardsImport(context, matchingRule, r, $("#aiErrImportResult"));
    $("#btnAiErrImport").scrollIntoView({ behavior: "smooth", block: "center" });
  };
  $("#btnAiSaveRecord").onclick = () => {
    if (!context) return;
    const saved=Store.addRecord({
      date: Date.now(), mode: r.mode, ai: true,
      title: context.question || "未附题干的作文", question: context.question, essay: context.essay, qtype: context.qtype, chart: context.chart, qKey:context.qKey||'',chartKey:context.chartKey||'',
      tags: matchingRule ? issueTags(matchingRule) : [], priorityFixes: r.priorityFixes,
      W: Checker.words(context.essay), scores: scores, overall: r.overall
    });
    $("#btnAiSaveRecord").textContent = "已保存原题、作文与 AI 评分";
    if(!saved){UI.notice('评分保存失败，请重试。',{error:true});$('#btnAiSaveRecord').textContent='重试保存评分';return;}
    $("#btnAiSaveRecord").disabled = true;
  };
  if (context) mountLearningFeedback(box, context, matchingRule, r);
  if(context) Annotations.render(box,context,(r.sentenceIssues||[]).map(i=>({quote:i.quote,problem:i.problem,fix:i.fix,kind:i.kind})),r.rewrite?.improved);
  UI.foldReport(box,'完整评分、逐段分析与自评');
}


function setCheckMode(mode) {
  checkMode = mode;  $$("#checkModeSwitch .mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  $("#checkTypeLabel").classList.toggle("hidden", mode === "t1");
  $("#checkChartLabel").classList.toggle("hidden", mode !== "t1");
  $("#checkTopicLabel").classList.toggle("hidden", mode === "t1");
  Annotations.stale();
}
$$("#checkModeSwitch .mode-btn").forEach(b => b.onclick = () => setCheckMode(b.dataset.mode));

const CHECKLISTS = {
  TR: [
    "回应了题目要求的对象、范围与每个问题",
    "自己的回答清楚，立场在全文保持一致",
    "主要观点得到相关解释、细节或例子支撑",
    "字数 ≥ 250",
    "没有写题目没问的东西（如纯利弊题硬给观点）"
  ],
  CC: [
    "分段服务内容组织，每段中心清楚",
    "每个主体段开头有明确的主题句",
    "句间关系与指代清楚，衔接手段适合内容",
    "两个主体段没有用一模一样的连接词套路",
    "每个 this / it 都能明确指向"
  ],
  LR: [
    "用词和搭配准确表达了内容",
    "表达有足够范围，必要改写保留原意",
    "词语的语体和精确度适合语境，没有生硬换词",
    "拼写检查过（government, environment, beneficial...）",
    "词性正确（affect/effect, economic/economical）"
  ],
  GRA: [
    "按表达需要使用自己能控制的简单与复杂句式",
    "没有逗号粘连（两个完整句只用逗号连接）",
    "没有 Although...but / Because...so 连用",
    "检查主谓一致、单复数和冠词",
    "句长有变化（不是清一色长句或短句）"
  ]
};
const CHECKLISTS_T1 = {
  TA: [
    "准确概括了原图的主要特征或主要阶段",
    "开头改写了题干（没有照抄）",
    "细节段做了挑选（最大/最小/首末年/特殊年），没有罗列所有数字",
    "体现原图中重要的比较、变化、位置或阶段关系",
    "字数 ≥ 150"
  ],
  CC: [
    "分段和分组清楚，概括与细节有组织",
    "概括容易找到，没有混在机械罗列中",
    "没有逐线/逐国单独成段",
    "句子之间用指代和关键词自然衔接"
  ],
  LR: [
    "趋势/比较/数据语言多样（the figure for / accounted for / stood at / respectively...）",
    "趋势动词和幅度与原图一致",
    "用词准确、语体得当，没有生硬替换同义词",
    "拼写检查过"
  ],
  GRA: [
    "时态正确（过去年→过去式；未来年→is expected to）",
    "主谓逻辑：没有“国家 was 数字”“国家 increased”",
    "数字、单位和增减表达准确（区分数值与变化量）",
    "句式有变化（名词式/动词式趋势句、while 对比句）"
  ]
};

$("#btnCheck").onclick = () => {
  const essay = $("#essayInput").value.trim();
  if (Checker.words(essay) < 30) {UI.errorAt($('#essayInput'),'请至少写 30 个英文词，再开始诊断。');return;}
  UI.errorAt($('#essayInput'),'');
  const questionText = $("#checkQuestion").value.trim();
  let res, critNames, checklists;
  if (checkMode === "t1") {
    res = Checker.checkT1(essay, $("#checkChart").value, questionText);
    critNames = { TA: "任务达成", CC: "连贯衔接", LR: "词汇资源", GRA: "语法多样与准确" };
    checklists = CHECKLISTS_T1;
  } else {
    const qtype = $("#checkType").value;
    let topic = $("#checkTopic").value || "";
    if (!topic) {
      const auto = Analyzer.topicsOfText(essay);
      if (auto.length) { topic = auto[0]; $("#checkTopic").value = topic; }
    }
    res = Checker.check(essay, qtype, topic ? [topic] : [], questionText);
    critNames = { TR: "任务回应", CC: "连贯衔接", LR: "词汇资源", GRA: "语法多样与准确" };
    checklists = CHECKLISTS;
  }
  lastCheck = { ...TaskFlow.checkMeta, res, critNames, checklists, essay, questionText, mode: checkMode, qtype:$('#checkType').value,chart:$('#checkChart').value };
  renderCheck();
};

function scoreClass(s) { return s >= 7 ? "score-7" : s >= 6 ? "score-6" : "score-low"; }

// ---- 句子级高亮 ----
const FLAG_PATTERNS = [
  { re: /although[^.?!]{5,},\s*(but|yet)\b/i, sev: "bad", label: "Although...but 连用" },
  { re: /because[^.?!]{5,},\s*so\b/i, sev: "bad", label: "because...so 连用" },
  { re: /,\s+(it|this|they|we|people|students|children|parents|governments?|there|young people)\s+(is|are|was|were|have|has|can|will|would|should|tend|become|feel|think|do|does|get|make)\b/i, sev: "bad", label: "疑似逗号粘连" },
  { re: /\b(informations|advices|equipments|softwares|homeworks|moneys|knowledges|peoples|childrens|researches|staffs|trainings)\b/i, sev: "bad", label: "不可数/不规则名词" },
  { re: /\bmore (better|worse|easier|faster|higher|lower)\b/i, sev: "bad", label: "双重比较级" },
  { re: /\bmore and more\b/gi, sev: "warn", label: "more and more（换 increasingly）" },
  { re: /every coin has two sides|as we all know|with the development of (the )?society|it goes without saying|last but not least/i, sev: "warn", label: "套话" },
  { re: /\b(depicts|indicates|reveals|exhibits|portrays)\b/i, sev: "warn", label: "show 的花哨同义词" },
  { re: /\b(soar(s|ed|ing)?|rocket(s|ed|ing)?|plummet(s|ed|ing)?)\b/i, sev: "warn", label: "夸张趋势词" },
  { re: /\bcanada|china|the usa|the uk|japan\b.{0,30}\b(was|is)\s+\d/i, sev: "bad", label: "国家+数字主谓错误" }
];
const OK_PATTERN = /\b(for example|for instance|such as|as an example|it is clear that|overall)\b/i;

function sentenceViewHtml(essay) {
  const sents = essay.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  const html = sents.map(s => {
    let cls = "", labels = [];
    for (const f of FLAG_PATTERNS) {
      if (f.re.test(s)) { labels.push(f.label); if (f.sev === "bad") cls = "sv-bad"; else if (cls !== "sv-bad") cls = "sv-warn"; }
    }
    const why = labels.length ? `<span class="why">〔${esc(labels.join("；"))}〕</span>` : "";
    let okChip = "";
    if (!cls && OK_PATTERN.test(s)) { cls = "sv-ok"; okChip = `<span class="why">〔好信号〕</span>`; }
    return `<span class="sv ${cls}">${esc(s)}</span>${why}${okChip}`;
  }).join(" ");
  return `<div class="sentview">${html}</div>
    <div class="sentview-legend">句子体检：<span class="sv sv-bad">红=硬伤</span> <span class="sv sv-warn">黄=建议</span> <span class="sv sv-ok">绿=好信号</span>（原因已内联在句后）——机扫仅为定位辅助，以人工精读为准</div>`;
}

function renderCheck() {
  const { res, critNames, checklists, essay } = lastCheck;
  const box = $("#checkResult");
  box.classList.remove("hidden");
  const crits = Object.keys(critNames);
  const sevLabel = { bad: "硬伤", warn: "建议", ok: "通过" };
  const fold = (title, inner, open) => `<details class="fold"${open ? " open" : ""}><summary>${title}</summary><div class="fold-body">${inner}</div></details>`;

  const checklistHtml = crits.map(crit => `
    <h3>${crit} · ${critNames[crit]}（逐项核对自己的原文，确认做到再勾选）</h3>
    ${checklists[crit].map(it => `<label class="checklist-item"><input type="checkbox" data-crit="${crit}"> ${it}</label>`).join("")}
  `).join("");

  const issuesHtml = ["bad", "warn", "ok"].map(sev => {
    const list = res.issues.filter(i => i.sev === sev);
    if (!list.length) return "";
    const inner = list.map(i =>
      `<div class="issue ${sev === "bad" ? "bad" : sev === "ok" ? "ok" : ""}"><b>[${critNames[i.crit] || i.crit}·${sevLabel[sev]}]</b> ${i.msg} ${i.evidence ? `<div class="where en">${esc(i.evidence)}</div>` : ""}</div>`
    ).join("");
    return fold(`${sevLabel[sev]}（${list.length}）`, inner, sev !== "ok");
  }).join("");
  const issuesBlock = issuesHtml || "<p>未发现问题。</p>";

  const badN = res.issues.filter(i => i.sev === "bad").length;
  const warnN = res.issues.filter(i => i.sev === "warn").length;
  const okN = res.issues.filter(i => i.sev === "ok").length;

  box.innerHTML = `
    <div class="card">
      <h2>句子体检</h2>
      ${sentenceViewHtml(essay)}
    </div>
    <div class="card">
      <h2>硬伤扫描（规则引擎 · 不打分）</h2>
      <p class="hint">规则引擎<strong>不做评分</strong>——经官方样卷校准，它无法识别优秀作文，给分没有参考价值（已下架）。它的唯一作用是<strong>定位硬伤</strong>。要拿分数，点右侧的「AI 考官精批」（已在官方样卷上校准，见《12-评分校准报告》）。</p>
      <div class="score-grid">
        <div class="score-card"><div class="crit">硬伤</div><div class="score" style="font-size:26px;color:var(--bad)">${badN}</div><div class="crit">必须修</div></div>
        <div class="score-card"><div class="crit">建议</div><div class="score" style="font-size:26px;color:var(--warn)">${warnN}</div><div class="crit">值得改</div></div>
        <div class="score-card"><div class="crit">通过项</div><div class="score" style="font-size:26px;color:var(--ok)">${okN}</div><div class="crit">已达标</div></div>
      </div>
      ${res.info.map(i => `<p class="hint">${i}</p>`).join("")}
      ${issuesBlock}
      <h3 style="margin-top:18px">逐项自评（考官视角清单——用于复盘，不生成数字分）</h3>
      ${checklistHtml}
      <div class="btn-row">
        <button class="primary" id="btnAiCheck2">AI 考官精批（评分 + 逐段点评）</button>
        <button id="btnReviewCard">生成复盘卡 + 错因入库</button>
        <button id="btnPrintReport">打印/导出报告</button>
        <button id="btnDownloadReport">下载报告文件</button>
      </div>
      <div id="finalScoreBox"></div>
    </div>`;

  $("#btnAiCheck2").onclick = () => $("#btnAiCheck").click();
  $("#btnReviewCard").onclick = () => {
    if (!lastCheck) { UI.notice("先点「开始诊断」。"); return; }
    $("#finalScoreBox").innerHTML = buildReviewCard(lastCheck.res, matchingAi({ essay: lastCheck.essay, question: lastCheck.questionText, mode: lastCheck.mode }))
      + `<div class="btn-row"><button class="primary" id="btnErrImport">错因入库（生成复习卡，进 SRS 队列）</button></div><div id="errImportResult"></div>`;
    $("#btnErrImport").onclick = errCardsImport;
    $("#finalScoreBox").scrollIntoView({ behavior: "smooth" });
  };
  $("#btnPrintReport").onclick = () => window.print();
  $("#btnDownloadReport").onclick = () => {
    const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>IELTS 写作诊断报告</title>
<style>body{font-family:"Segoe UI","Microsoft YaHei",sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#1f2937;line-height:1.7}
.card{border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px;margin-bottom:16px}
h2,h3{margin:8px 0}.issue{border-left:3px solid #d97706;background:#fffbeb;padding:8px 12px;margin:8px 0;font-size:14px}
.issue.bad{border-color:#dc2626;background:#fef2f2}.issue.ok{border-color:#059669;background:#f0fdf4}
.overall-band{font-size:40px;font-weight:800;color:#1d4ed8}.score{font-size:26px;font-weight:700}
.en{font-family:Georgia,serif}.hint{color:#6b7280;font-size:13px}.sv{padding:2px 3px;border-radius:4px}
.sv-bad{background:#fee2e2}.sv-warn{background:#fef9c3}.sv-ok{background:#ecfdf5}</style></head><body>
${$("#checkResult").innerHTML}
<p class="hint">生成于 ${new Date().toLocaleString("zh-CN")} · IELTS Writing Coach（本地离线工具）</p>
</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "IELTS写作诊断报告_" + new Date().toISOString().slice(0, 10) + ".html";
    a.click();
  };
  mountLearningFeedback(box, { qKey:lastCheck.qKey,chartKey:lastCheck.chartKey,essay: lastCheck.essay, question: lastCheck.questionText, mode: lastCheck.mode, qtype:lastCheck.qtype,chart:lastCheck.chart }, lastCheck.res, matchingAi({ essay: lastCheck.essay, question: lastCheck.questionText, mode: lastCheck.mode }));
  Annotations.render(box,{...TaskFlow.checkMeta,essay:lastCheck.essay,question:lastCheck.questionText,mode:lastCheck.mode,qtype:lastCheck.qtype,chart:lastCheck.chart},res.issues.filter(i=>i.sev!=='ok').map(i=>({quote:(i.evidence||'').replace(/<[^>]*>/g,''),problem:i.msg.replace(/<[^>]*>/g,''),fix:adviceFor(i).act,kind:i.noscore?'可选建议':i.sev==='bad'?'明确错误':'需要核对'})));
  UI.foldReport(box,'完整硬伤扫描与自评清单');
}
$('#essayInput').addEventListener('input',()=>{Annotations.stale();UI.errorAt($('#essayInput'),'');});
$('#checkQuestion').addEventListener('input',Annotations.stale);

// ---------------- 教学闭环：问题标签 / 复盘卡 / 错误档案 / 改写对比 ----------------
// 每类问题 → 提升动作 + 方法论出处（复盘卡用）
const FIX_MAP = [
  [/不足 250|字数只有|不足 150/, { act: "补齐题目遗漏的内容，解释观点并用相关细节支撑；完成当前 Task 的最低字数", doc: "01 §6" }, "word-count"],
  [/段落|只有 \d 段|段.*偏多/, { act: "按信息与观点重新分组，让每段有清楚的中心；段数由内容决定", doc: "01 §1" }, "structure"],
  [/立场|some people|观点题问的是你/, { act: "明确表达自己的回答，检查全文立场是否一致；不要求指定位置或短语", doc: "01 §4" }, "stance"],
  [/开头段没有|照抄|开头段太短|开头与题目原文/, { act: "用自己的话准确交代题目与回答方向，避免照抄或改变题意", doc: "01 §5" }, "intro"],
  [/Overview|overview|结论段|不写结论/, { act: "对照原图概括显著特征，覆盖主要趋势、差异或阶段；不要求固定位置和句数", doc: "04 §2" }, "overview"],
  [/例子/, { act: "给薄弱观点补充解释、相关细节或具体情境；例子是支撑方式之一", doc: "01 §6" }, "example"],
  [/比较语言|罗列|一条线/, { act: "细节段改成“挑关键数据+比较”：while/whereas/by far/compared to", doc: "04 §4" }, "compare"],
  [/连接词|Moreover|Furthermore|机械|Firstly.*两次|一模一样的连接/, { act: "两段换用不同连接体系，并加 this/these 指代链替代机械连接", doc: "01 §6" }, "linker"],
  [/隐形衔接|this\/these 指代/, { act: "学隐形衔接：this/these 回指上一句、关键词复现、代词回指", doc: "01 §6" }, "cohesion"],
  [/词伙|主题搭配|数据表达单一/, { act: "从词伙与闪卡中查一个需要的表达，在自己的相关句子里核对词义和搭配", doc: "06" }, "coll"],
  [/重复过多|换说法/, { act: "同一概念准备 2-3 种说法轮换（students→these young people→school leavers）", doc: "01 §5" }, "paraphrase"],
  [/拼写/, { act: "遮住正确拼写，凭记忆写进自己的句子；核对后隔天再试", doc: "03 §2 LR" }, "spelling"],
  [/逗号粘连/, { act: "两个完整句之间用句号/which 从句/分号，不能只用逗号", doc: "01 §9" }, "comma-splice"],
  [/Although|because.*so/i, { act: "Although 不带 but；Because 不带 so——从句和主句直接相连", doc: "01 §9" }, "although-but"],
  [/不可数| informations|单复数误用|peoples/, { act: "背不可数名词清单：information/research/advice/equipment... 不加 s", doc: "03 §2 GRA" }, "uncountable"],
  [/被动|条件句|句式多样/, { act: "按真实逻辑选择句式，检查从句、时态和标点；不为凑句式增加错误", doc: "03 §2 GRA" }, "variety"],
  [/平均句长|句长/, { act: "长短句交替：主题句短句起，解释句用从句展开", doc: "01 §6" }, "sentence-length"],
  [/套话|Every coin|As we all know|With the development/, { act: "删掉套话，换成具体观点+论证", doc: "01 §9" }, "cliche"],
  [/国家不能|升跌的是数据/, { act: "Task 1 主谓逻辑：数据作主语（exports increased / the figure for X rose）", doc: "04 §5" }, "subj-logic"],
  [/大词|怪词|夸张|花哨同义/, { act: "检查词义、搭配和语体；只替换在当前语境中不准确或不合适的词", doc: "06 §1" }, "big-words"],
  [/答偏|没有出现在文中|sub-topic/, { act: "回读题目，划出所有问句/sub-topic，确认每部分都有对应段落", doc: "01 §3" }, "coverage"],
];
const CRIT_DOC = { TR: "01 §3 题型判定表", TA: "04 §1-2", CC: "01 §6 段落与衔接", LR: "06 词伙库", GRA: "03 §2 GRA" };
function tagOf(issue) {
  for (const row of FIX_MAP) {
    if (row[2] && row[0].test(issue.msg || "")) return row[2];
  }
  return null;
}
function adviceFor(issue) {
  for (const row of FIX_MAP) {
    if (row[0].test(issue.msg || "")) return { act: row[1].act, doc: row[1].doc };
  }
  const crit = issue.crit;
  return { act: `按《${CRIT_DOC[crit] || "03"}》中 ${crit} 项的 7 分要求逐条自查`, doc: CRIT_DOC[crit] || "03" };
}
const TAG_NAMES = {
  structure: "结构失衡", stance: "立场问题", intro: "开头改写", overview: "缺 overview", example: "缺例子/展开",
  compare: "缺比较", linker: "连接词堆砌", cohesion: "缺隐形衔接", coll: "词伙不足", paraphrase: "重复用词",
  spelling: "拼写", "comma-splice": "逗号粘连", "although-but": "Although...but", uncountable: "不可数名词",
  variety: "句式单一", "sentence-length": "句长失控", cliche: "套话", "subj-logic": "主谓逻辑", "big-words": "大词",
  "word-count": "字数不足", coverage: "答偏题目"
};
function issueTags(res) {
  const tags = new Set();
  res.issues.filter(i => i.sev !== "ok").forEach(i => { const tg = tagOf(i); if (tg) tags.add(tg); });
  return [...tags];
}
function buildReviewCard(res, ai) {
  const critNames = { TR: "任务回应", TA: "任务达成", CC: "连贯衔接", LR: "词汇资源", GRA: "语法多样与准确" };
  const bad = res.issues.filter(i => i.sev === "bad");
  const warn = res.issues.filter(i => i.sev === "warn");
  const top = [...bad, ...warn].slice(0, 6);
  const items = top.map(i => {
    const adv = adviceFor(i);
    return `<div class="issue ${i.sev === "bad" ? "bad" : ""}"><b>[${critNames[i.crit] || i.crit}]</b> ${i.msg}
      <div class="tr-con"><b>下次动作：</b>${adv.act} <span class="hint">（${docLink(adv.doc)}）</span></div></div>`;
  }).join("");
  const aiFixes = ai && ai.priorityFixes ? ai.priorityFixes.map(f => `<div class="issue">${esc(f)}</div>`).join("") : "";
  const weakest = Object.entries(ai?.scores || {}).filter(([, s]) => Number.isFinite(s)).sort((a, b) => a[1] - b[1])[0];
  const focus = weakest ? weakest[0] : top[0]?.crit;
  return `
    <h3>本篇复盘卡</h3>
    <p class="hint">复盘的目的是“发现问题 → 明确改法 → 下次验证”，分数只是定位用的参考。</p>
    ${items || "<p class='hint'>规则层面没有发现明显问题——用下面的自评清单和 AI 精批做更深层的检查。</p>"}
    ${aiFixes}
    ${focus ? `<p><b>本次检查重点：</b>${esc(focus)}（${esc(critNames[focus] || focus)}）。${weakest ? "来自本次 AI 参考评分。" : "来自规则提示，不代表最弱分项。"}先完成上方的针对性改写；需要方法时查 ${docLink(CRIT_DOC[focus] || "03")}。</p>` : ""}`;
}

// ---------- 错因入库：诊断问题 → SRS 错因复习卡 ----------
function errCardsImport(context, result, aiResult, output) {
  // onclick 直接绑定时第一个参数是鼠标事件，不是作文快照。
  if (!context?.essay) {
    if (!lastCheck) { UI.notice("先做一次诊断。"); return; }
    context = { essay: lastCheck.essay, question: lastCheck.questionText, mode: lastCheck.mode };
    result = lastCheck.res;
    aiResult = matchingAi(context);
  }
  const now = Date.now();
  const srcLabel = "诊断 " + new Date().toLocaleDateString("zh-CN");
  const existing = new Set(Store.get("errCards", []).map(c => (c.quote || "") + "|" + (c.problem || "").slice(0, 30)));
  const cards = [];
  const push = c => {
    const k = (c.quote || "") + "|" + (c.problem || "").slice(0, 30);
    if (c.quote && existing.has(k)) return;
    existing.add(k);
    cards.push({ id: now + "-" + cards.length, kind: "err", ...c, from: c.from || srcLabel });
  };
  (result?.issues || []).forEach(i => {
    if (i.sev === "ok" || !i.msg) return;
    const tag = tagOf(i);
    push({ quote: i.evidence || "", problem: (tag && TAG_NAMES[tag] ? "[" + TAG_NAMES[tag] + "] " : "") + i.msg, fix: "", tag: tag || "", crit: i.crit || "" });
  });
  const ai = aiResult;
  ((ai && ai.sentenceIssues) || []).forEach(i => {
    if (!i.quote) return;
    push({ quote: i.quote, problem: i.problem || "", fix: i.fix || "", tag: "ai", crit: "", from: "AI 精批 " + srcLabel });
  });
  if (!cards.length) { UI.notice("这次诊断没有可入库的句子级问题。"); return; }
  const arr = Store.get("errCards", []);
  arr.push(...cards);
  if(!Store.set("errCards",arr)){UI.notice("错因卡保存失败，请重试。",{error:true});return;}
  const box = output || $("#errImportResult");
  if (box) box.innerHTML = `<div class="issue ok">已入库 ${cards.length} 张错因卡（跳过 ${cards.length ? "重复项" : ""}）。去「词伙与闪卡 → 错因复习」开始复习；到期卡也会出现在「今日复习」里。</div>`;
}

// ---------------- 全量备份导出/导入 ----------------
$("#btnExportAll").onclick = () => {
  const data = { _app: "IELTS Writing Coach", _version: 3, _date: new Date().toISOString() };
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("iwc_")) data[k.slice(4)] = localStorage.getItem(k);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "IELTS写作教练备份_" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
};
$("#btnImportAll").onclick = () => $("#importFile").click();
$("#importFile").onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data._app) { UI.notice("不是有效的备份文件。"); return; }
      if (!(await UI.confirm(`备份日期 ${data._date || '未知'}。导入会覆盖备份中的同名本地数据，包括记录、收藏和草稿。`,{label:'导入并覆盖',danger:true}))) return;
      Store.importBackup(data);
      UI.notice("导入完成，页面将刷新。");
      location.reload();
    } catch (err) { UI.notice("备份文件解析失败：" + err.message); }
  };
  reader.readAsText(f);
  e.target.value = "";
};

// ---------------- 填空精读 ----------------
let clozeSession = null;
function renderCloze() {
  const box = $("#libContent");
  if (!clozeSession) {
    const st = Store.get("cloze", { done: 0, correct: 0 });
    box.innerHTML = `<div class="card flash-wrap">
      <h3 style="margin-top:0">填空精读（Simon worksheet 教学法）</h3>
      <p class="hint">系统从考官范文中挖掉主题词伙，你凭记忆填回——把"读范文"变成"主动回忆"，这正是 Simon 在 worksheet 里训练学生的方式。</p>
      <div class="btn-row" style="justify-content:center">
        <select id="clKind"><option value="t2">大作文范文</option><option value="t1">小作文范文</option></select>
        <select id="clCount"><option value="6">6 空</option><option value="8" selected>8 空</option><option value="10">10 空</option></select>
        <button class="primary" id="clStart">随机来一篇</button>
      </div>
      <div class="hint" style="margin-top:10px">累计：${st.done} 空 · 正确 ${st.correct}（${st.done ? Math.round(st.correct / st.done * 100) : 0}%）</div>
    </div>`;
    $("#clStart").onclick = () => {
      const kind = $("#clKind").value;
      const picked = Cloze.pickEssay(kind);
      const bank = Object.values(Collocations.BY_TOPIC).flat().concat(Collocations.UNIVERSAL, Collocations.GUJIABEI_EXTRA || []);
      const built = Cloze.build(picked.essay, bank, +$("#clCount").value);
      if (!built) { UI.notice("这篇范文没找到足够的词伙，再试一次。"); return; }
      clozeSession = { ...picked, ...built, checked: false };
      renderCloze();
    };
    return;
  }
  const s = clozeSession;
  const html = s.parts.map(p => {
    if (p.text !== undefined) return esc(p.text).replace(/\n/g, "<br>");
    return ` <input class="cl-blank" data-i="${p.blank}" size="${Math.min(28, Math.max(8, p.len))}" placeholder="${p.zh ? esc(p.zh.slice(0, 10)) : "词伙"}"> `;
  }).join("");
  box.innerHTML = `<div class="card">
    <div class="box-head"><span class="box-title">${s.kind === "t1" ? "Task 1" : "Task 2"} 范文填空（${s.blanks.length} 空）</span>
    <button class="small" onclick="clozeQuit()">换一篇</button></div>
    ${s.q ? `<p class="en hint" style="font-style:italic">${esc(s.q.slice(0, 160))}...</p>` : ""}
    <div class="cloze-text en" style="font-size:15px;line-height:2.3">${html}</div>
    <div class="btn-row"><button class="primary" id="clCheck">对答案</button><button id="clReveal">直接看答案</button></div>
    <div id="clFeedback"></div>
  </div>`;
  $("#clCheck").onclick = () => clozeGrade(false);
  $("#clReveal").onclick = () => clozeGrade(true);
}
window.clozeQuit = function () { clozeSession = null; renderCloze(); };
function clozeGrade(revealOnly) {
  const s = clozeSession;
  if (s.checked) return;
  s.checked = true;
  let correct = 0;
  $$(".cl-blank").forEach(inp => {
    const i = +inp.dataset.i;
    const expected = s.parts.filter(p => p.blank === i)[0].answer;
    const ok = !revealOnly && Cloze.check(inp.value, expected);
    if (ok) correct++;
    inp.classList.add(ok ? "cl-ok" : "cl-no");
    inp.disabled = true;
    inp.insertAdjacentHTML("afterend", `<span class="cl-ans ${ok ? "" : "cl-ans-wrong"}">${esc(expected)}</span>`);
  });
  const st = Store.get("cloze", { done: 0, correct: 0 });
  if (!revealOnly) { st.done += s.blanks.length; st.correct += correct; Store.set("cloze", st); }
  $("#clFeedback").innerHTML = `<div class="card" style="background:var(--accent-bg);margin-top:10px">
    成绩：<b>${revealOnly ? "（直接看答案，不计入统计）" : correct + " / " + s.blanks.length}</b>
    <span class="hint">错过的词伙点右上角换一篇再战，或去词伙库点星标收藏后用闪卡复习。</span></div>`;
}


$$(".lib-tab").forEach(b => b.onclick = () => {
  $$(".lib-tab").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  renderLib(b.dataset.lib, $("#libSearch").value);
});
$("#libSearch").oninput = debounce(e => {
  const active = $(".lib-tab.active").dataset.lib;
  renderLib(active, e.target.value);
}, 300);

$('#libClear').onclick=()=>{$('#libSearch').value='';renderLib($('.lib-tab.active').dataset.lib,'');$('#libSearch').focus();};
function renderLib(tab, query) {
  const q = (query || "").toLowerCase();
  const box = $("#libContent");
  $('#libResults').textContent='';box.className='lib-content';
  const searchable=tab==='topics'||tab==='collocations';$('#libSearch').disabled=!searchable;$('#libClear').disabled=!searchable;
  if (tab === "flashcards") { renderFlashcards(); return; }
  if (tab === "cloze") { renderCloze(); return; }
  if (tab === "topics") {
    let html = "";
    (typeof TopicsLibrary !== "undefined" ? TopicsLibrary : []).forEach(t => {
      const all = JSON.stringify(t).toLowerCase();
      if (q && !all.includes(q) && !t.name.toLowerCase().includes(q)) return;
      const li = (arr, cap) => (arr || []).slice(0, cap).map(x => `<li class="en">${esc(x.en)}${x.zh ? ` <span style="color:var(--muted)">（${esc(x.zh)}）</span>` : ""}${starBtn(t.name, x.en, x.zh, "idea")}</li>`).join("");
      const total = (t.pro?.length || 0) + (t.con?.length || 0) + (t.neutral?.length || 0);
      const body = `
        ${t.ask && t.ask.length ? `<p class="hint">常考问法：${t.ask.map(esc).join(" / ")}</p>` : ""}
        ${t.pro && t.pro.length ? `<div class="persp"><div class="ptitle">正方（${t.pro.length}）</div><ul>${li(t.pro)}</ul></div>` : ""}
        ${t.con && t.con.length ? `<div class="persp"><div class="ptitle">反方（${t.con.length}）</div><ul>${li(t.con)}</ul></div>` : ""}
        ${t.neutral && t.neutral.length ? `<div class="persp"><div class="ptitle">立场 / 解决方案 / 中立观点（${t.neutral.length}）</div><ul>${li(t.neutral)}</ul></div>` : ""}`;
      html += `<details class="fold"${q ? " open" : ""}><summary>${esc(t.name)} <span class="badge-count">${total} 条观点</span></summary><div class="fold-body">${body}</div></details>`;
    });
    box.innerHTML = html || "<p class='hint card'>无匹配结果。</p>";
  } else if (tab === "collocations") {
    const topics = Object.keys(Collocations.BY_TOPIC);
    if (!window._collTopic) window._collTopic = topics[0];
    if (!window._collView) window._collView = "scene";
    if (!window._collFs) window._collFs = Store.get("collFs", "md");
    box.className = "lib-content " + (window._collFs === "sm" ? "" : "fs-" + window._collFs);
    // 字号三档
    const fsBar = `<div class="fs-toggle"><span class="hint">字号：</span>
      <button class="small ${window._collFs === "sm" ? "active" : ""}" data-fs="sm">A-</button>
      <button class="small ${window._collFs === "md" ? "active" : ""}" data-fs="md">A</button>
      <button class="small ${window._collFs === "lg" ? "active" : ""}" data-fs="lg">A+</button></div>`;
    // 范文用例（来自语境卡索引）
    const exFor = en => {
      const card = ctxIndexBuild().get(fcNormKey(en));
      if (!card || !card.contexts.length) return "";
      const c = card.contexts[0];
      const rx = phraseRegex(en);
      const hl = esc(c.sent).replace(rx, m => `<u>${m}</u>`);
      return `<div class="coll-ex en">${hl}<span style="color:var(--muted)"> —— ${esc(c.src)}</span></div>`;
    };
    const renderItem = (c, topic) => `<div class="coll-item"><span class="en">${esc(c.en)}</span> <span class="zh">—— ${esc(c.zh)}</span>${starBtn(topic, c.en, c.zh, "coll")}${exFor(c.en)}</div>`;
    const renderGroup = (topic, items) => {
      const f = items.filter(c => !q || c.en.toLowerCase().includes(q) || c.zh.includes(query || ""));
      if (!f.length) return "";
      return `<div class="card topic-block"><h3>${esc(topic)}（${f.length}）</h3><div class="coll-grid">${f.map(c => renderItem(c, topic)).join("")}</div></div>`;
    };
    const viewBar = `<div class="btn-row" style="margin:0 0 12px">
      <button class="small ${window._collView === "scene" ? "primary" : ""}" data-cv="scene">按写作场景</button>
      <button class="small ${window._collView === "topic" ? "primary" : ""}" data-cv="topic">按主题查</button>
      ${fsBar}</div>`;
    let html = viewBar;
    if (window._collView === "scene") {
      // 场景视图：按"此刻要表达什么"组织（来自通用词伙的 9 个场景组）
      const groups = Collocations.UNIVERSAL_GROUPS || [];
      const sceneDesc = { "表达原因": "想说【为什么会这样】时用", "表达结果": "想说【导致了什么】时用", "表达影响": "想说【带来什么影响】时用", "表达趋势": "想说【越来越多/逐渐减少】时用", "提出解决": "想说【应该怎么办】时用，搭配主语(government/school/individual)", "表达\"重要\"": "想说【这件事很重要】时用", "表达\"有害\"": "想说【这有害】时用", "表达\"有益\"": "想说【这有益】时用", "补充：高频议论表达": "让步、对比、举例等议论骨架" };
      html += groups.map(g => renderGroup(`场景 · ${g}（${sceneDesc[g] || ""}）`, (Collocations.UNIVERSAL || []).filter(c => (c.group || "") === g))).join("");
      const extra = (Collocations.GUJIABEI_EXTRA || []).filter(c => !q || c.en.toLowerCase().includes(q) || c.zh.includes(query || ""));
      if (extra.length) html += `<div class="card topic-block"><h3>场景 · 顾家北补充</h3><div class="coll-grid">${extra.map(c => renderItem(c, "通用")).join("")}</div></div>`;
      html += `<p class="hint">主题词伙（教育/环境/犯罪…）在「按主题查」里——场景视图专管"论证语言"。每个词伙下面的灰字是考官范文/例句用法。</p>`;
    } else {
      const sel = `<div class="btn-row" style="margin:0 0 12px"><label class="hint" style="margin:0">主题：</label><select id="collTopicSel" style="width:auto">${topics.map(x => `<option ${x === window._collTopic ? "selected" : ""}>${x}</option>`).join("")}<option value="__all" ${window._collTopic === "__all" ? "selected" : ""}>全部（折叠）</option></select></div>`;
      html += sel;
      if (window._collTopic === "__all") {
        topics.forEach(topic => { html += renderGroup(topic, Collocations.BY_TOPIC[topic]); });
        const fu = Collocations.UNIVERSAL.filter(c => !q || c.en.toLowerCase().includes(q) || c.zh.includes(query || ""));
        if (fu.length) html += `<div class="card topic-block"><h3>通用论证词伙</h3><div class="coll-grid">${fu.map(c => renderItem(c, "通用")).join("")}</div></div>`;
      } else {
        html += renderGroup(window._collTopic, Collocations.BY_TOPIC[window._collTopic] || []);
        if (!q) {
          const fu = Collocations.UNIVERSAL;
          if (fu.length) html += `<div class="card topic-block"><h3>通用论证词伙（任何话题）</h3><div class="coll-grid">${fu.map(c => renderItem(c, "通用")).join("")}</div></div>`;
        }
      }
    }
    box.innerHTML = html || "<p class='hint card'>无匹配结果。</p>";
    const cs = $("#collTopicSel");
    if (cs) cs.onchange = () => { window._collTopic = cs.value; renderLib("collocations", $("#libSearch").value); };
    $$("[data-cv]").forEach(b => b.onclick = () => { window._collView = b.dataset.cv; renderLib("collocations", $("#libSearch").value); });
    $$("[data-fs]").forEach(b => b.onclick = () => { window._collFs = b.dataset.fs; Store.set("collFs", b.dataset.fs); renderLib("collocations", $("#libSearch").value); });
  } else if (tab === "t1") {
    box.innerHTML = `
      <div class="card"><h3>四段结构（20 分钟）</h3>
        ${T1.structure.map(s => `<div class="persp"><div class="ptitle">${s.n}. ${s.name}（${s.time}）</div><ul>${s.rules.map(r => `<li>${r}</li>`).join("")}</ul></div>`).join("")}
      </div>
      <div class="card"><h3>七种图表落地规则</h3>
        ${T1.chartTypes.map(c => `<div class="persp"><div class="ptitle">${c.type}</div><ul><li><b>细节段：</b>${c.rule}</li><li><b>Overview 找：</b>${c.overview}</li></ul></div>`).join("")}
      </div>
      <div class="card"><h3>语言库</h3>
        ${Object.entries(T1.lang).map(([k, arr]) => `<div class="persp"><div class="ptitle">${k}</div><div class="coll-grid">${arr.map(x => `<div class="coll-item en">${esc(x)}</div>`).join("")}</div></div>`).join("")}
      </div>
      <div class="card"><h3>中国考生 19 大错误</h3><ol>${T1.mistakes.map(m => `<li>${m}</li>`).join("")}</ol></div>
      <div class="card"><h3>交卷七查</h3><ol>${T1.checklist.map(m => `<li>${m}</li>`).join("")}</ol></div>`;
  } else if (tab === "mistakes") {
    box.innerHTML = `<div class="card"><h3>中国考生高频错误对照表（错误写法 → 正确写法）</h3>
      <table style="width:100%;font-size:13.5px;border-collapse:collapse">
      ${Plan.mistakes.map(m => `<tr style="border-bottom:1px solid var(--line)"><td style="padding:8px;color:var(--bad)" class="en">${esc(m.bad)}</td><td style="padding:8px;color:var(--ok)" class="en">${esc(m.good)}</td><td style="padding:8px;color:var(--muted)">${esc(m.why)}</td></tr>`).join("")}
      </table></div>`;
  }
  const count=tab==='topics'?box.querySelectorAll('details.fold').length:tab==='collocations'?box.querySelectorAll('.coll-item').length:null;
  if(count!==null){$('#libResults').textContent=`当前范围找到 ${count} ${tab==='topics'?'个话题':'条表达'}`;if(!count)box.insertAdjacentHTML('afterbegin','<p class="empty-state">没有匹配内容。试试更短的关键词，或切换到“按主题查”扩大范围。</p>');}
}

// ---------------- ⑤ 题库与范文 ----------------
let bankFilter = "all";
$$("#bankFilters .filter-btn").forEach(b => b.onclick = () => {
  $$("#bankFilters .filter-btn").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  bankFilter = b.dataset.filter;
  bankPage = 1;
  renderBank();
});
const TYPE_GROUP = { opinion: ["opinion"], discussion: ["discussion"], adv: ["adv-disadv", "adv-disadv-opinion"], "problem-solution": ["problem-solution"], "two-part": ["two-part"] };
function renderBank() {
  const bank = [
    ...QuestionBank,
    ...(typeof ExtraQuestions !== "undefined" ? ExtraQuestions : []),
    ...(typeof RecentQuestions !== "undefined" ? RecentQuestions : []),
    ...(typeof QuestionsC1921 !== "undefined" ? QuestionsC1921 : []),
    ...(typeof JijingQuestions !== "undefined" ? JijingQuestions : [])
  ];
  const PER = 15;
  const task=$('#bankTask').value,query=$('#bankSearch').value.trim().toLowerCase();
  const list = bank.filter(q => (task==='1'?q.t1&&!/详见原书/.test(q.t1):q.t2) && (task==='1'||bankFilter === "all" || TYPE_GROUP[bankFilter].includes(q.t2type)) && (!query||`${q.src} ${task==='1'?q.t1:q.t2}`.toLowerCase().includes(query)));
  $('#bankResults').textContent=`找到 ${list.length} 道 Task ${task} 题目`;
  $('#bankFilters').hidden=task==='1';
  const pageCount = Math.max(1, Math.ceil(list.length / PER));
  bankPage = Math.min(bankPage, pageCount);
  const pageList = list.slice((bankPage - 1) * PER, bankPage * PER);
  $("#bankList").innerHTML = pageList.map(q => `
    <div class="q-item" data-i="${bank.indexOf(q)}">
      <span class="q-src">${esc(q.src)}</span><span class="badge type">${esc(task==='1'?trainChartName(q.t1type):typeName(q.t2type))}</span>
      ${/^机经/.test(q.src) ? '<span class="badge warn">机经</span>' : ""}
      <div class="en" style="margin-top:4px">${esc(task==='1'?q.t1:q.t2)}</div>
    </div>`).join("") + pagerHtml(bankPage, pageCount) || "<p class='hint'>无匹配。</p>";
  $$("#bankList .q-item").forEach(el => el.onclick = () => {
    const q = bank[+el.dataset.i];
    if(task==='1'){TaskFlow.write({task:1,question:q.t1,qtype:q.t1type,src:q.src});return;}
    $("#questionInput").value = q.t2;
    goto("analyze");
    $("#btnAnalyze").click();
  });
  $$("#bankList .pg-btn").forEach(b => b.onclick = () => { bankPage = +b.dataset.pg; renderBank(); });
}
$('#bankSearch').oninput=debounce(()=>{bankPage=1;renderBank();},250);
$('#bankTask').onchange=()=>{bankPage=1;bankFilter='all';$('#bankFilters [data-filter="all"]').click();};
$('#bankClear').onclick=()=>{$('#bankSearch').value='';bankPage=1;$('#bankFilters [data-filter="all"]').click();$('#bankSearch').focus();};
function typeName(t) {
  return { "opinion": "观点题", "discussion": "讨论+观点", "adv-disadv": "纯利弊", "adv-disadv-opinion": "利弊比较", "problem-solution": "问题解决", "two-part": "双问题" }[t] || t;
}

function renderEssayList() {
  $("#essayList").innerHTML = EssayBank.map((e, i) =>
    `<div class="q-item" data-i="${i}"><span class="q-src">${esc(e.title)}</span><span class="badge type">${esc(typeName(e.type))}</span><div style="color:var(--muted)">${esc(e.stanceNote)}</div></div>`).join("");
  $$("#essayList .q-item").forEach(el => el.onclick = () => renderEssay(+el.dataset.i));
}
function renderEssay(i) {
  const e = EssayBank[i];
  const returnY=window.scrollY,trigger=$(`#essayList [data-i="${i}"]`);
  const roleSpan = (text, role) => `<span class="sent role-${role}">${esc(text)}</span>`;
  $("#essayDetail").classList.remove("hidden");
  $("#essayDetail").innerHTML = `
    <div class="card essay-detail">
      <div class="box-head"><h3>${esc(e.title)}（考官参考范文）</h3><button id="essayClose" class="small">返回范文列表</button></div>
      <p class="en" style="font-style:italic;color:var(--muted)">${esc(e.question)}</p>
      <div class="legend"><span class="role-topic">主题句/话题</span><span class="role-example">例子</span><span class="role-link">紫色=立场句</span></div>
      ${e.paras.map(p => `<div class="para"><b>${esc(p.label)}</b><br>${p.sents.map(([t, r]) => roleSpan(t, r) + " ").join("")}</div>`).join("")}
      <div class="btn-row"><button onclick="gotoAnalyzeEssay(${i})">拿这道题去审题</button></div>
    </div>`;
  $('#essayClose').onclick=()=>{$('#essayDetail').classList.add('hidden');trigger?.focus({preventScroll:true});window.scrollTo(0,returnY);};
  $('#essayClose').focus({preventScroll:true});$('#essayDetail').scrollIntoView({block:'start'});
}
window.gotoAnalyzeEssay = i => { $("#questionInput").value = EssayBank[i].question; goto("analyze"); $("#btnAnalyze").click(); };

// ---------------- ⑥ 学习路线 ----------------
function renderPlan() {
  const placement = Store.get("placement", null);
  const badge = placement ? `<div class="issue ok"><b>知识自测记录：</b>${esc(placement.level)} · 建议从 <b>${esc(placement.start)}</b> 学起（${new Date(placement.date).toLocaleDateString("zh-CN")}）。选择题不能估算写作分数，训练目标以独立答卷为准。</div>` : "";
  $("#planContent").innerHTML = `
    ${badge}
    <p>${esc(Plan.intro)}</p>
    ${Plan.weeks.map(w => `<div class="week-plan"><h3>${esc(w.t)}</h3><ul>${w.items.map(i => `<li>${linkifyDocs(esc(i))}</li>`).join("")}</ul></div>`).join("")}
    <h3>按评分标准写，避免模板误区</h3><ol>${Plan.rules.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
    <p class="hint">方法依据：<a href="https://ielts.org/cdn/ielts-guides/ielts-writing-band-descriptors.pdf" target="_blank" rel="noopener">IELTS 官方量表</a> · <a href="https://doi.org/10.1016/j.learninstruc.2024.101961" target="_blank" rel="noopener">写作反馈元分析（2024）</a> · <a href="https://doi.org/10.1111/lang.12479" target="_blank" rel="noopener">二语间隔练习元分析（2022）</a>。研究支持这些方向，不能据此保证个人提分幅度或唯一最优路径。</p>
    <h3>高频错误对照表</h3><table style="width:100%;font-size:13.5px;border-collapse:collapse">
    ${Plan.mistakes.map(m => `<tr style="border-bottom:1px solid var(--line)"><td style="padding:8px;color:var(--bad)" class="en">${esc(m.bad)}</td><td style="padding:8px;color:var(--ok)" class="en">${esc(m.good)}</td><td style="padding:8px;color:var(--muted)">${esc(m.why)}</td></tr>`).join("")}
    </table>`;
}

// ---------------- ⑦ 记录与词本 ----------------
let progShowAll = false;
function exportProgressReport() {
  const records = Store.get("records", []);
  const learning = Learning.read().items;
  if (!records.length && !learning.length) { UI.notice("还没有学习记录可导出。"); return; }
  const averages = ['t2','t1'].map(mode=>{
    const scored=records.filter(r=>r.mode===mode && r.ai && Number.isFinite(r.overall) && r.overall>=0 && r.overall<=9);
    return `<p>Task ${mode==='t1'?1:2} AI 参考均值：${scored.length ? (scored.reduce((n,r)=>n+r.overall,0)/scored.length).toFixed(1) : '暂无'}（${scored.length} 份）。</p>`;
  }).join('');
  const rows = records.map(r => `<tr>
    <td>${new Date(r.date).toLocaleString("zh-CN")}</td><td>${r.mode === "t1" ? "Task 1" : "Task 2"}</td>
    <td class="en">${esc(r.title || "")}</td><td>${r.W || ""}</td>
    <td>${r.ai ? Object.entries(r.scores || {}).map(([c, v]) => esc(c) + " " + esc(v)).join(" / ") : '规则记录'} </td>
    <td>${r.ai && Number.isFinite(r.overall) && r.overall>=0 && r.overall<=9 ? `<b>${r.overall}</b>（AI 参考）` : '未提供 AI 评分'}</td>
    <td>${(r.tags || []).map(t => esc(TAG_NAMES[t] || t)).join("、")}</td></tr>`).join("");
  const tagCount = {};
  records.forEach(r => (r.tags || []).forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
  const tagRows = Object.entries(tagCount).sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `<tr><td>${esc(TAG_NAMES[t] || t)}</td><td>${n} 次</td></tr>`).join("");
  const attempts = learning.map(item=>`<section><h3>${esc(Learning.drill(item).name)} · Task ${item.mode==='t1'?1:2}</h3><p class="en">${esc(item.question)}</p><p class="en original">${esc(item.essay)}</p>${item.attempts.map(a=>`<h4>${a.stage==='repair'?'原题改写':a.stage==='benchmark'?'整篇验证':'换题练习'} · ${a.passed?'自查通过':'继续练习'}${a.stage==='repair'?'':a.independent===true?' · 自报独立':a.independent===false?' · 辅助或缺少独立快照':' · 独立性未知'}</h4><p class="en">${esc(a.question)}</p><p class="en original">${esc(a.text)}</p>${a.quote?`<p class="en">证据：${esc(a.quote)}</p>`:''}<p>${esc(a.note)}</p>${a.criteria?`<ul>${a.criteria.map((c,n)=>`<li>${a.checks?.[n]?'已自查':'未确认'}：${esc(c)}</li>`).join('')}</ul>`:''}`).join('')}</section>`).join('');
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>IELTS 写作进度报告</title>
<style>body{font-family:"Segoe UI","Microsoft YaHei",sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:#1f2937;line-height:1.7}
table{border-collapse:collapse;width:100%;font-size:13.5px}th,td{border:1px solid #e5e7eb;padding:6px 9px;text-align:left}
th{background:#eff6ff}.en{font-family:Georgia,serif}.hint{color:#6b7280;font-size:13px}
.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}.kpi div{border:1px solid #e5e7eb;border-radius:10px;padding:10px 16px}
.kpi b{font-size:24px;color:#1d4ed8}.original{white-space:pre-wrap}section{border-top:1px solid #e5e7eb;margin-top:24px;padding-top:16px}</style></head><body>
<h1>IELTS 写作进度报告</h1><p class="hint">生成于 ${new Date().toLocaleString("zh-CN")} · IELTS Writing Coach</p>
<p>已保存 ${records.length} 份诊断记录、${learning.length} 项训练目标。</p>${averages}<p class="hint">AI 分数为参考，自查不代表考官认可。规则记录不进入评分均值，Task 1 和 Task 2 分别汇总。</p>
<h2>高频问题档案</h2><table><tr><th>问题类型</th><th>出现次数</th></tr>${tagRows}</table>
<h2>全部记录（${records.length}）</h2>
<table><tr><th>时间</th><th>类型</th><th>题目/作文</th><th>词数</th><th>分项</th><th>总分</th><th>问题标签</th></tr>${rows}</table>
<h2>诊断原稿与作答证据</h2>${attempts || '<p>暂无改写或复测记录。</p>'}
</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "IELTS写作进度报告_" + new Date().toISOString().slice(0, 10) + ".html";
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
}

function renderCompare(oldRec, newRes) {
  const box = $("#finalScoreBox");
  if (!box) return;
  const crits = [...new Set([...Object.keys(oldRec.scores || {}), ...Object.keys(newRes.scores)])];
  const deltas = crits.map(c => ({ c, d: (newRes.scores[c] || 0) - (oldRec.scores[c] || 0) }));
  const oldTags = new Set(oldRec.tags || []);
  const newTags = new Set(newRes.tags || []);
  const fixed = [...oldTags].filter(tg => !newTags.has(tg));
  const introduced = [...newTags].filter(tg => !oldTags.has(tg));
  const fmt = d => d > 0 ? `+${d}` : `${d}`;
  const cls = d => d > 0 ? "score-7" : d < 0 ? "score-low" : "";
  box.insertAdjacentHTML("beforeend", `
    <div class="card" style="background:var(--ok-bg);border-color:var(--ok-border)">
      <h3>改写对比（vs ${new Date(oldRec.date).toLocaleDateString("zh-CN")} 的上一版）</h3>
      <div class="score-grid">
        ${deltas.map(({ c, d }) => `<div class="score-card"><div class="crit">${c}</div><div class="score ${cls(d)}">${fmt(d)}</div><div class="crit">${oldRec.scores[c] || "-"} → ${newRes.scores[c] || "-"}</div></div>`).join("")}
        <div class="score-card"><div class="crit">定位分变化</div><div class="score ${cls(newRes.overall - oldRec.overall)}">${fmt(newRes.overall - oldRec.overall)}</div><div class="crit">${oldRec.overall} → ${newRes.overall}</div></div>
      </div>
      ${fixed.length ? `<div class="issue ok"><b>已修复 ${fixed.length} 类问题：</b>${fixed.map(tg => TAG_NAMES[tg] || tg).join("、")}——这就是真实的提升。</div>` : ""}
      ${introduced.length ? `<div class="issue bad"><b>新出现 ${introduced.length} 类问题：</b>${introduced.map(tg => TAG_NAMES[tg] || tg).join("、")}——改的时候别引入新毛病。</div>` : ""}
      <p class="hint">提升 = 问题类别的减少 + 分数的稳定上升。把这次改写中学会的表达记进收藏本。</p>
    </div>`);
  box.scrollIntoView({ behavior: "smooth" });
}
$("#progressTask").onchange = () => renderProgress();
function renderProgress() {
  const records = Store.get("records", []);
  const mode = $("#progressTask").value;
  const scored = records.filter(r => r.mode === mode && r.ai && Number.isFinite(r.overall) && r.overall >= 0 && r.overall <= 9);
  const sum = $("#progressSummary");
  if (typeof renderDashboard === "function") renderDashboard();
  if (!records.length) {
    sum.innerHTML = `<p class="hint">还没有 AI 评分记录。改写与复测不需要分数，可以直接从上方开始。</p>`;
    $("#progressList").innerHTML = "";
  } else {
    const avg = scored.length ? (scored.reduce((a, r) => a + r.overall, 0) / scored.length).toFixed(1) : "—";
    const latest = scored[0];
    // 分项统计（最近 5 次平均）
    const critKeys = mode === "t1" ? ["TA", "CC", "LR", "GRA"] : ["TR", "CC", "LR", "GRA"];
    const recent5 = scored.slice(0, 5);
    const critStats=critKeys.map(c=>{
      const vals=recent5.map(r=>r.scores?.[c]??(c==='TA'?r.scores?.TR:undefined)).filter(v=>Number.isFinite(v)&&v>=0&&v<=9);
      return {c,n:vals.length,mean:vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null};
    });
    const means=critStats.map(s=>s.mean);
    const lowest=means.every(v=>v!==null)&&Math.min(...means)<Math.max(...means)?Math.min(...means):null;
    const critTiles = critStats.map(({c,n,mean}) => {
      const avg=mean===null?'—':mean.toFixed(1);
      return `<div class="score-card"><div class="crit">${c} · 近${n}次均值</div><div class="score ${mean===null?'':scoreClass(mean)}">${avg}</div><div class="crit">${lowest!==null&&mean===lowest?'参考均值较低':''}</div></div>`;
    }).join("");
    sum.innerHTML = `
      <div class="score-card"><div class="crit">累计练习</div><div class="score" style="color:var(--primary-dark)">${records.length}</div><div class="crit">篇</div></div>
      <div class="score-card"><div class="crit">同 Task AI 均值</div><div class="score ${/\d/.test(avg) ? scoreClass(+avg) : ""}">${avg}</div><div class="crit">${scored.length} 份参考评分</div></div>
      <div class="score-card"><div class="crit">同 Task 最近一次</div><div class="score ${Number.isFinite(latest?.overall) ? scoreClass(latest.overall) : ""}">${latest?.overall ?? "—"}</div><div class="crit">${latest ? new Date(latest.date).toLocaleDateString("zh-CN") : "暂无评分"}</div></div>
      ${critTiles}`;
    // 走势条形图（最近 12 次 overall）
    const recent = scored.slice(0, 12).reverse();
    const maxS = 9;
    $("#progressList").innerHTML = `
      <h3>Task ${mode === "t1" ? "1" : "2"} AI 参考分（最近 ${recent.length} 次）</h3>
      <div class="trend-bars">${recent.map(r => `<div class="bar" style="height:${(r.overall / maxS) * 100}%" title="${new Date(r.date).toLocaleDateString("zh-CN")} ${r.overall}"><span>${r.overall}</span></div>`).join("")}</div>
      <h3>全部记录（${records.length}）<span class="badge-count">${progShowAll ? "" : "显示最近 10 条"}</span></h3>
      ${records.slice(0, progShowAll ? undefined : 10).map((r, i) => `
        <div class="prog-item">
          <div>
            <span class="badge type">${r.mode === "t1" ? "Task 1" : "Task 2"}</span>
            <span class="hint">${new Date(r.date).toLocaleString("zh-CN")} · ${r.W} 词${r.aiOverall ? " · AI已批" : ""}</span>
            <div class="en" style="color:var(--muted)">${esc(r.title)}</div>
            ${(r.tags || []).length ? `<div style="margin-top:4px">${r.tags.map(tg => `<span class="badge warn" style="font-size:11px;padding:1px 7px">${esc(TAG_NAMES[tg] || tg)}</span>`).join(" ")}</div>` : ""}
          </div>
          <div class="mini-scores">${Object.entries(r.scores || {}).map(([c, s]) => `<span class="mini">${c} ${s}</span>`).join("")}<span class="mini">${r.aiOverall ? `${r.aiOverall}` : ""}</span><span class="mini">${r.overall ?? "—"}</span></div>
          <div>
            <button class="small" data-rewrite="${records.indexOf(r)}" title="用同一道题再写一版，写完自动对比">再写一版</button>
            <button class="small" data-del="${records.indexOf(r)}">删除</button>
          </div>
        </div>`).join("")}
      ${records.length > 10 ? `<div class="btn-row"><button class="small" id="btnToggleAll">${progShowAll ? "收起" : "显示全部 " + records.length + " 条"}</button></div>` : ""}`;
    $$('#progressList [data-del]').forEach(b=>b.onclick=async()=>{if(await UI.confirm('删除这份评分记录？原稿与改写练习仍保留。',{label:'删除记录',danger:true})){if(!Store.removeRecord(+b.dataset.del)){UI.notice('删除保存失败，记录仍保留。',{error:true});return;}renderProgress();}});
    $$("#progressList [data-rewrite]").forEach(b => b.onclick = () => {
      const r = records[+b.dataset.rewrite];
      rewriteOf = r;
      $("#checkQuestion").value = r.question || (r.essay ? r.title : "") || "";
      setCheckMode(r.mode || "t2");
      if (r.qtype) $("#checkType").value = r.qtype;
      if (r.chart) $("#checkChart").value = r.chart;
      $("#essayInput").value = "";
      $("#finalScoreBox") && ($("#finalScoreBox").innerHTML = "");
      TaskFlow.checkMeta={qKey:r.qKey||'',chartKey:r.chartKey||''};TaskFlow.renderCheckChart();
      goto("check");
      UI.notice("已带入原题。请写新一版再诊断；具体问题的短改写与隔天复测可从今日训练的今日任务开始。");
    });
    const tg = $("#btnToggleAll");
    if (tg) tg.onclick = () => { progShowAll = !progShowAll; renderProgress(); };
    // 进度报告导出（单文件 HTML）
    if (!$("#btnExportProgress")) {
      sum.insertAdjacentHTML("beforeend", `<div class="btn-row"><button id="btnExportProgress">导出进度报告（HTML）</button></div>`);
      $("#btnExportProgress").onclick = exportProgressReport;
    }
  }
  if (!records.length && Learning.read().items.length) {
    sum.insertAdjacentHTML('beforeend','<div class="btn-row"><button id="btnExportProgress">导出进度报告（HTML）</button></div>');
    $('#btnExportProgress').onclick=exportProgressReport;
  }
  // 我的系统性错误档案（聚合所有记录的问题标签）
  const tagged = records.filter(r => (r.tags || []).length);
  if (tagged.length) {
    const cnt = {};
    tagged.forEach(r => new Set(r.tags).forEach(tg => cnt[tg] = (cnt[tg] || 0) + 1));
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const adviceOfTag = tag => {
      const row = FIX_MAP.find(r => r[2] === tag);
      return row ? row[1] : { act: "按对应方法论条目自查", doc: "03" };
    };
    const maxN = top[0][1];
    const box = $("#progressList");
    box.insertAdjacentHTML("beforeend", `
      <div class="card" style="border-color:var(--warn-border)">
        <h3>你的系统性错误 Top ${top.length}（${tagged.length} 篇有标签记录）</h3>
        <p class="hint">这就是你的个人弱点画像——每次写作前先看一眼，写完后用它检查。出现篇数越多越优先修。</p>
        ${top.map(([tag, n]) => {
          const adv = adviceOfTag(tag);
          return `<div class="issue ${n >= maxN * 0.6 ? "bad" : ""}">
            <b>${esc(TAG_NAMES[tag] || tag)}</b> · 出现于 ${n}/${tagged.length} 篇
            <div class="tr-con">${esc(adv.act)} <span class="hint">(${docLink(adv.doc)})</span></div>
          </div>`;
        }).join("")}
      </div>`);
  }
  // 词本
  const stars = Store.getStars();
  const nb = $("#notebookContent");
  if (!stars.length) nb.innerHTML = "<p class='hint'>收藏夹是空的——去「词伙与闪卡」点星标收藏词伙和观点。</p>";
  else {
    const groups = {};
    stars.forEach(s => { (groups[s.topic || "未分类"] = groups[s.topic || "未分类"] || []).push(s); });
    nb.innerHTML = Object.entries(groups).map(([topic, items]) => `
      <div class="notebook-topic"><h4>${esc(topic)}（${items.length}）</h4>
        ${items.map(s => `<div class="coll-item"><span class="en">${esc(s.en)}</span> <span class="zh">—— ${esc(s.zh || "")}</span> <button class="small" data-unstar="${esc(s.en)}">移除</button></div>`).join("")}
      </div>`).join("");
    $$('#notebookContent [data-unstar]').forEach(b=>b.onclick=()=>{if(!Store.removeStar(b.dataset.unstar)){UI.notice('移除失败，收藏仍保留。',{error:true});return;}renderProgress();});
  }
}
$("#btnExportNotebook").onclick = () => {
  const stars = Store.getStars();
  if (!stars.length) { UI.notice("收藏夹是空的。"); return; }
  const text = "我的雅思写作收藏本（" + new Date().toLocaleDateString("zh-CN") + "）\n\n" +
    Object.entries(stars.reduce((g, s) => { (g[s.topic || "未分类"] = g[s.topic || "未分类"] || []).push(s); return g; }, {}))
      .map(([topic, items]) => `【${topic}】\n` + items.map(s => `• ${s.en}${s.zh ? "  —— " + s.zh : ""}`).join("\n")).join("\n\n");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "我的雅思收藏本.txt";
  a.click();
};
$('#btnClearProgress').onclick = async () => {
  if (await UI.confirm('清除评分记录、收藏和独立作文草稿？今日训练与复测记录将保留。建议先导出备份。',{label:'清除这些数据',danger:true})) {
    ["records", "stars", "draft_t1", "draft_t2"].forEach(k => localStorage.removeItem("iwc_" + k));
    renderProgress();
  }
};

// ---------------- 提纲训练（审题与提纲，10 分钟练习） ----------------
window.startOutline = function () {
  if (!currentAnalysis) return;
  const t = currentAnalysis.det.type;
  const box = $("#outlineTraining");
  box.classList.remove("hidden");
  const F = (id, label, ph, rows) => `<label>${label}</label><textarea id="${id}" rows="${rows || 2}" placeholder="${ph}"></textarea>`;
  let form = "";
  if (t === "opinion" || t === "adv-disadv-opinion" || t === "two-part") {
    form = `<label>① 立场（选"最好写"的，不是"最真实"的）</label>
      <div class="outline-radio">
        <label><input type="radio" name="stance" value="agree"> 完全同意</label>
        <label><input type="radio" name="stance" value="disagree"> 完全不同意</label>
        <label><input type="radio" name="stance" value="partly"> 让步/部分同意</label>
      </div>
      <label>② 开头第二句：用一句话概括你的回答（英文）</label><input id="olIntro" type="text" placeholder="I completely agree that ... because ...">
      <label>③ 主体段 1：观点一句话（英文）</label><textarea id="olB1" rows="2" placeholder="Topic sentence: 第一个支持理由"></textarea>
      <label>④ 主体段 1 的例子（要具体：谁/哪里/什么事）</label><input id="olB1ex" type="text" placeholder="For example, ...">
      <label>⑤ 主体段 2：观点一句话（英文）</label><textarea id="olB2" rows="2" placeholder="Topic sentence: 第二个支持理由"></textarea>
      <label>⑥ 主体段 2 的例子</label><input id="olB2ex" type="text" placeholder="For example, ...">`;
  } else if (t === "discussion") {
    form = `<label>① 观点 A 的理由（2-3 条，英文短语或句子）</label><textarea id="olA" rows="3" placeholder="Firstly, ... Secondly, ..."></textarea>
      <label>② 观点 B 的理由（2-3 条）</label><textarea id="olB" rows="3" placeholder="On the other hand, ..."></textarea>
      <label>③ 你的立场（站哪边/取中间？为什么？）</label><input id="olStance" type="text" placeholder="I personally believe ... because ...">
      <label>④ 你支持那一段的例子</label><input id="olBex" type="text" placeholder="For example, ...">`;
  } else if (t === "adv-disadv") {
    form = `<label>① 好处（2-3 条，英文）</label><textarea id="olA" rows="3"></textarea>
      <label>② 坏处（2-3 条，英文）</label><textarea id="olB" rows="3"></textarea>`;
  } else if (t === "problem-solution") {
    form = `<label>① 问题/原因（2-3 条，英文）</label><textarea id="olA" rows="3" placeholder="The main issue is ... Further pressures include ..."></textarea>
      <label>② 解决措施（2-3 条，写清"谁做什么"）</label><textarea id="olB" rows="3" placeholder="Firstly, governments could ... A second measure would be ..."></textarea>`;
  }
  box.innerHTML = `
    <div class="card">
      <h2>提纲训练（目标：10 分钟内完成）</h2>
      <p class="hint">Simon：把"想"和"写"分开。提纲列好了，写作就是把提纲翻译成英语。题干：<span class="en" style="font-style:italic">${esc(currentQuestion)}</span></p>
      <div class="outline-form">${form}
        <div class="btn-row">
          <button class="primary" onclick="checkOutline()">检查提纲</button>
          <button onclick="gotoWrite()">提纲完成，去写作室 →</button>
        </div>
        <div id="outlineFeedback"></div>
      </div>
    </div>`;
  box.scrollIntoView({ behavior: "smooth" });
};

window.checkOutline = function () {
  const t = currentAnalysis.det.type;
  const fb = $("#outlineFeedback");
  const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const issues = [];
  let total = 0, done = 0;
  const need = (cond, msg) => { total++; if (cond) done++; else issues.push(msg); };
  // 题目覆盖度：提纲正文里应出现题目的一部分核心概念（防跑题）
  const allText = ["olIntro", "olB1", "olB1ex", "olB2", "olB2ex", "olA", "olB", "olStance"].map(val).join(" ").toLowerCase();
  const STOP = new Set("the a an and or but if while of to in on for with by at as is are was were be been it its this that these those there their they them we our you your i my not no do does did have has had will would can could should may might must from than then so such which who what when where how about whether some many people person believe think agree disagree extent discuss views opinion advantages disadvantages problems solutions".split(" "));
  const qWords = [...new Set((currentQuestion.toLowerCase().match(/[a-z']{4,}/g) || []).filter(w => !STOP.has(w)))];
  const covered = qWords.filter(w => allText.includes(w.slice(0, Math.max(4, w.length - 2)))).length;
  const coverage = qWords.length ? covered / qWords.length : 1;
  const stance = (document.querySelector('input[name="stance"]:checked') || {}).value;
  if (t === "opinion" || t === "adv-disadv-opinion" || t === "two-part") {
    need(!!stance, "还没选立场");
    need(val("olIntro").length >= 25, "开头概括回答太短（≥25 字符，要改写题目+亮立场）");
    need(val("olB1").length >= 20, "主体段 1 观点太短（≥20 字符）");
    need(val("olB1ex").length >= 10, "主体段 1 缺例子");
    need(val("olB2").length >= 20, "主体段 2 观点太短（≥20 字符）");
    need(val("olB2ex").length >= 10, "主体段 2 缺例子");
  } else if (t === "discussion") {
    need(val("olA").length >= 30, "观点 A 的理由太少（≥30 字符，2-3 条）");
    need(val("olB").length >= 30, "观点 B 的理由太少（≥30 字符，两边篇幅要相当）");
    need(val("olStance").length >= 20, "没写你的立场");
    need(val("olBex").length >= 10, "支持段缺例子");
  } else {
    need(val("olA").length >= 30, "第一部分内容太少（≥30 字符）");
    need(val("olB").length >= 30, "第二部分内容太少（≥30 字符）");
    if (t === "problem-solution") need(/government|school|parent|individual|company|media|people|teacher|state|person/i.test(val("olB")), "解决措施要写清“谁做什么”（government / school / individual...）");
  }
  const coverageOk = coverage >= 0.25;
  const pct = total ? Math.round(done / total * 100) : 0;
  fb.innerHTML = `
    <div class="card" style="background:var(--accent-bg);margin-top:12px">
      <div>提纲完整度：<span class="overall-band" style="font-size:28px">${pct}%</span> ${pct === 100 && coverageOk ? '<span class="badge ok">合格，可以开写</span>' : ""}</div>
      <p class="hint">题目概念覆盖度约 ${Math.round(coverage * 100)}%（提纲只需覆盖题目的核心概念，不必逐词出现；低于 25% 说明可能跑题）</p>
      ${issues.length ? issues.map(m => `<div class="issue bad">• ${m}</div>`).join("") : "<p>结构全部达标——照着这份提纲写，主体段直接展开就行。</p>"}
      ${!coverageOk ? `<div class="issue bad">题目核心概念覆盖不足——回读题目，确认每个 sub-topic 都有对应观点（工具提示：换词也算覆盖，但概念必须都出现）。</div>` : ""}
    </div>`;
};

// ---------------- 词伙闪卡 ----------------
function shuffle(a) { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

// ---------------- 范文全库浏览 ----------------
function annotateEssayText(essay) {
  return essay.split(/\n\s*\n/).map(para => {
    const sents = para.split(/(?<=[.!?])\s+/).filter(Boolean);
    return `<div class="para">` + sents.map((s, i) => {
      let cls = "";
      if (i === 0) cls = "role-topic";
      if (/\b(for example|for instance|such as|to take .+ as an example)\b/i.test(s)) cls = "role-example";
      if (/^(on the one hand|on the other hand|however|i believe|personally|in my opinion)/i.test(s.trim())) cls = "role-link";
      return `<span class="sent ${cls}">${esc(s)}</span> `;
    }).join("") + `</div>`;
  }).join("");
}

function renderCorpus() {
  const hasT2 = typeof EssayCorpus !== "undefined" && EssayCorpus.length;
  const hasT1 = typeof T1EssayCorpus !== "undefined" && T1EssayCorpus.length;
  if (!hasT2 && !hasT1) { $("#corpusSection").classList.add("hidden"); return; }
  $("#corpusSection").classList.remove("hidden");
  const bank = corpusKind === "t1" ? (hasT1 ? T1EssayCorpus : []) : (hasT2 ? EssayCorpus : []);
  $("#corpusHint").textContent = `全部来自本地语料的 Simon 原版范文：大作文 ${hasT2 ? EssayCorpus.length : 0} 篇 · 小作文 ${hasT1 ? T1EssayCorpus.length : 0} 篇。蓝色=主题句/立场，黄色=例子。`;
  const q = ($("#corpusSearch").value || "").toLowerCase();
  const typeSel = $("#corpusType");
  if (typeSel.dataset.kind !== corpusKind) {
    typeSel.dataset.kind = corpusKind;
    const opts = corpusKind === "t1"
      ? ["line", "bar", "pie", "table", "two charts", "process", "map", "comparison", "unknown"]
      : ["opinion", "discussion", "adv-disadv-opinion", "adv-disadv", "problem-solution", "two-part", "unknown"];
    typeSel.innerHTML = `<option value="">全部${corpusKind === "t1" ? "图型" : "题型"}</option>` + opts.map(o => `<option value="${o}">${o}</option>`).join("");
  }
  const ft = $("#corpusType").value;
  const list = bank.filter(e => (!ft || (corpusKind === "t1" ? e.chart : e.type) === ft) && (!q || (e.q + " " + e.essay).toLowerCase().includes(q)));
  $('#corpusResults').textContent=`找到 ${list.length} 篇 Task ${corpusKind==='t1'?'1':'2'} 范文`;
  const PER = 15;
  const pages = Math.max(1, Math.ceil(list.length / PER));
  corpusPage = Math.min(corpusPage, pages);
  const pageList = list.slice((corpusPage - 1) * PER, corpusPage * PER);
  $("#corpusList").innerHTML = pageList.map(e => `
    <div class="q-item" data-ci="${bank.indexOf(e)}">
      <span class="q-src">${esc(e.src || "范文")}</span><span class="badge type">${esc(corpusKind === "t1" ? (e.chart || "unknown") : (e.type || "unknown"))}</span>
      <div class="en" style="margin-top:4px;color:var(--muted)">${esc((e.q || e.essay).slice(0, 130))}...</div>
    </div>`).join("") + pagerHtml(corpusPage, pages);
  $$("#corpusList .pg-btn").forEach(b => b.onclick = () => { corpusPage = +b.dataset.pg; renderCorpus(); });
  $$("#corpusList .q-item").forEach(el => el.onclick = () => {
    const e = bank[+el.dataset.ci];
    const returnY=window.scrollY;
    $("#corpusDetail").classList.remove("hidden");
    $("#corpusDetail").innerHTML = `
      <div class="card essay-detail">
        <div class="box-head"><h3>范文（${esc(e.src || "")} · ${e.essay.split(/\s+/).length} 词）</h3><button id="corpusClose" class="small">返回结果</button></div>
        ${e.q ? `<p class="en" style="font-style:italic;color:var(--muted)">${esc(e.q)}</p>` : ""}
        <div class="legend"><span class="role-topic">主题句/段首</span><span class="role-example">例子</span><span class="role-link">立场/转折</span></div>
        ${annotateEssayText(e.essay)}
        ${e.q ? `<div class="btn-row"><button onclick="corpusToAnalyze(${bank.indexOf(e)})">${corpusKind==='t1'?'拿这道题去写作':'拿这道题去审题'}</button></div>` : ""}
      </div>`;
    $('#corpusClose').onclick=()=>{$('#corpusDetail').classList.add('hidden');el.focus({preventScroll:true});window.scrollTo(0,returnY);};
    $('#corpusClose').focus({preventScroll:true});
    $("#corpusDetail").scrollIntoView({ behavior: "smooth" });
  });
}
window.corpusToAnalyze = function (i) {
  const e = corpusKind === "t1" ? T1EssayCorpus[i] : EssayCorpus[i];
  if(corpusKind==='t1'){TaskFlow.write({task:1,question:e.q,qtype:e.chart,src:e.src});return;}
  $("#questionInput").value = e.q;
  goto("analyze");
  $("#btnAnalyze").click();
};
$$("#corpusTabs .filter-btn").forEach(b => b.onclick = () => {
  $$("#corpusTabs .filter-btn").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  corpusKind = b.dataset.corpus;
  corpusPage = 1;
  $("#corpusType").value = "";
  renderCorpus();
});
$('#corpusClear').onclick=()=>{$('#corpusSearch').value='';$('#corpusType').value='';corpusPage=1;renderCorpus();$('#corpusSearch').focus();};
$("#corpusSearch").oninput = debounce(() => { corpusPage = 1; renderCorpus(); }, 300);
$("#corpusType").onchange = () => { corpusPage = 1; renderCorpus(); };

// ---------------- 初始化 ----------------
function init() {
  const sel = $("#checkTopic");
  sel.innerHTML = `<option value="">（自动/不限）</option>` + Object.keys(Collocations.BY_TOPIC).map(t => `<option value="${t}">${t}</option>`).join("");
  renderBank();
  renderEssayList();
  renderPlan();
  renderLib("topics", "");
  buildParagraphBoxes();
  renderCorpus();
}
init();

$('#checkQuestion').addEventListener('input',()=>{TaskFlow.checkMeta={};TaskFlow.renderCheckChart();});
$('#checkModeSwitch').addEventListener('click',()=>{TaskFlow.checkMeta={};TaskFlow.renderCheckChart();});
