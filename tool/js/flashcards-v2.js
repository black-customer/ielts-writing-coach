/* flashcards-v2.js — 词伙闪卡 v2：语境填空 + 间隔重复（覆盖 app.js 中的同名函数）
 * 设计依据：检索练习（testing effect）+ 编码特异性（语境记忆）+ Leitner 间隔重复
 */
const SRS_INTERVALS = [1, 3, 7, 14, 30]; // 天
const fcNormKey = s => (s || "").toLowerCase().replace(/[''`]/g, "'").replace(/[^a-z'\s]/g, " ").replace(/\s+/g, " ").trim();
let ctxIndex = null;

function ctxIndexBuild() {
  if (ctxIndex || typeof ContextCards === "undefined") return ctxIndex || new Map();
  ctxIndex = new Map();
  for (const c of ContextCards.cards) ctxIndex.set(fcNormKey(c.en), c);
  return ctxIndex;
}
function phraseRegex(phrase) {
  const words = fcNormKey(phrase).split(" ").filter(Boolean);
  const parts = words.map(w => {
    const e = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return w.length <= 3 ? e : e + "(?:s|es|ed|d|ing)?";
  });
  return new RegExp("\\b" + parts.join("\\s+") + "\\b", "i");
}
function dueCount() {
  const now = Date.now(), srs = Store.get("srs", {});
  let n = 0;
  for (const k in srs) if ((srs[k].due || 0) <= now) n++;
  return n;
}
function allPhrasesFlat() {
  const arr = [];
  for (const [topic, items] of Object.entries(Collocations.BY_TOPIC)) items.forEach(c => arr.push({ en: c.en, zh: c.zh, topic }));
  (Collocations.UNIVERSAL || []).forEach(c => arr.push({ en: c.en, zh: c.zh, topic: c.group || "通用" }));
  (Collocations.GUJIABEI_EXTRA || []).forEach(c => arr.push({ en: c.en, zh: c.zh, topic: "通用" }));
  const seen = new Set();
  return arr.filter(c => { const k = fcNormKey(c.en); if (seen.has(k) || k.length < 6) return false; seen.add(k); return true; });
}

// ---------- 错因卡（诊断硬伤 → SRS 复习） ----------
function errCardsAll() { return Store.get("errCards", []); }
function errKey(c) { return "err:" + c.id; }
function errCardDue(c) {
  const srs = Store.get("srs", {});
  const e = srs[errKey(c)];
  return !e || (e.due || 0) <= Date.now();
}
function errDueCount() { return errCardsAll().filter(errCardDue).length; }

function renderFlashcards() {
  const box = $("#libContent");
  if (!flash || flash.done) {
    const topics = Object.keys(Collocations.BY_TOPIC);
    const due = dueCount(), errDue = errDueCount();
    box.innerHTML = `<div class="card flash-wrap">
      <h3 style="margin-top:0">⚡ 词伙闪卡 <span class="badge ok">v2 语境填空</span></h3>
      <p class="hint">每张卡 = 范文语境 + 挖空句。先读语境 → 心里填空 → 对答案看考官原句用法。<br>依据：检索练习（主动回忆比重读记得牢）+ 语境记忆（在语境里学的，考场上遇到类似语境才想得起来）。</p>
      <div class="btn-row" style="justify-content:center">
        <label class="hint" style="margin:0">卡片来源：</label>
        <select id="fcSource" style="width:auto">
          <option value="due" ${due + errDue ? "selected" : ""}>🔁 今日复习（到期 ${due + errDue} 张）</option>
          ${errDue ? `<option value="__err">🩹 错因复习（到期 ${errDue} 张）</option>` : `<option value="__err">🩹 错因复习（${errCardsAll().length} 张）</option>`}
          ${topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join("")}
          <option value="__stars">⭐ 我的词本</option>
        </select>
        <label class="hint" style="margin:0">模式：</label>
        <select id="fcMode" style="width:auto"><option value="context">语境填空（推荐）</option><option value="fast">极速模式（中→英）</option></select>
        <button class="primary" id="fcStart">开始</button>
      </div>
      <div class="hint" style="margin-top:10px">间隔重复（Leitner）：认识→间隔拉长（1/3/7/14/30 天后再见）；不认识→本轮重现、明天再见。同一词伙每次复习会换不同的语境句（变式编码，促进迁移）。🩹 错因卡来自你在诊断室入库的硬伤句子（认出错误→对答案看改法）。</div>
      <div id="fcStats" class="hint"></div>
    </div>`;
    $("#fcStart").onclick = () => {
      const src = $("#fcSource").value, mode = $("#fcMode").value;
      let cards = [];
      if (src === "due") {
        const now = Date.now(), srs = Store.get("srs", {});
        const dueKeys = new Set(Object.keys(srs).filter(k => (srs[k].due || 0) <= now));
        cards = allPhrasesFlat().filter(c => dueKeys.has(fcNormKey(c.en)));
        cards = errCardsAll().filter(errCardDue).map(c => ({ ...c, __err: true })).concat(cards);
      } else if (src === "__err") {
        cards = errCardsAll().map(c => ({ ...c, __err: true }));
      } else if (src === "__stars") {
        cards = Store.getStars().map(s => ({ en: s.en, zh: s.zh, topic: s.topic || "词本" }));
      } else {
        cards = (Collocations.BY_TOPIC[src] || []).map(c => ({ ...c, topic: src }));
      }
      if (!cards.length) { alert("这一组没有卡片。"); return; }
      flash = { cards: shuffle(cards), idx: 0, mode, show: false, hint: false, yes: 0, no: 0, retry: [], topic: src };
      renderFlashcards();
    };
    const st = Store.get("cloze", { done: 0, correct: 0 });
    $("#fcStats").textContent = st.done ? `填空精读历史：已评 ${st.done} 空 · 正确率 ${Math.round(st.correct / st.done * 100)}%` : "";
    return;
  }

  const c = flash.cards[flash.idx];
  const key = c.__err ? errKey(c) : fcNormKey(c.en);

  // 错因卡：正面 = 原句（自己找错）→ 背面 = 改法 + 错因说明
  if (c.__err) {
    const tagName = (typeof TAG_NAMES !== "undefined" && TAG_NAMES[c.tag]) || c.tag || c.crit || "写作错误";
    let face;
    if (!flash.show) {
      face = `
        <div class="flash-ctx-q">🩹 错因卡 · ${esc(tagName)} · 来自${esc(c.from || "诊断")}</div>
        <div class="flash-ctx-s en">${esc(c.quote || "（这条没有原句，直接看背面）")}</div>
        <div class="fc-hint">💡 这句有什么问题？先在心里改出来，再对答案</div>`;
    } else {
      face = `
        <div class="flash-ctx-q">🩹 错因卡 · ${esc(tagName)}</div>
        <div class="flash-ctx-s en" style="text-decoration:line-through;opacity:.65">${esc(c.quote || "（无原句）")}</div>
        ${c.fix ? `<div class="fc-reveal en">✓ ${esc(c.fix)}</div>` : ""}
        <div class="fc-hint" style="margin-top:8px">⚠️ 错因：${esc(c.problem || "见上方说明")}</div>`;
    }
    const srcLabel2 = flash.topic === "due" ? "今日复习" : "错因复习";
    box.innerHTML = `<div class="card flash-wrap">
      <div class="flash-meta">${srcLabel2} · 第 ${flash.idx + 1} / ${flash.cards.length} 张 · ✓${flash.yes} ✗${flash.no}</div>
      <div class="flash-card" id="fcCard">${face}</div>
      <div class="flash-btns">
        ${!flash.show ? `<button class="primary" id="fcFlip">对答案（看改法）</button>` : `<button class="no" id="fcNo">😵 还是会错</button><button class="yes" id="fcYes">😎 已掌握</button>`}
        <button id="fcEnd">结束本组</button>
      </div>
    </div>`;
    const flipE = () => { flash.show = true; renderFlashcards(); };
    $("#fcCard").onclick = () => { if (!flash.show) flipE(); };
    if ($("#fcFlip")) $("#fcFlip").onclick = flipE;
    const nextE = ok => {
      const srs = Store.get("srs", {});
      const e = srs[key] || { box: 0, due: 0 };
      if (ok) { e.box = Math.min(SRS_INTERVALS.length, e.box + 1); e.due = Date.now() + SRS_INTERVALS[Math.min(e.box, SRS_INTERVALS.length) - 1] * 864e5; }
      else { e.box = 0; e.due = Date.now() + 864e5; }
      srs[key] = e; Store.set("srs", srs);
      if (ok) flash.yes++; else { flash.no++; flash.retry.push(c); }
      flash.idx++;
      if (flash.idx >= flash.cards.length) {
        if (flash.retry.length) { flash.cards = shuffle(flash.retry); flash.retry = []; flash.idx = 0; }
        else { flash = null; renderFlashcards(); return; }
      }
      flash.show = false; flash.hint = false;
      renderFlashcards();
    };
    if ($("#fcYes")) $("#fcYes").onclick = () => nextE(true);
    if ($("#fcNo")) $("#fcNo").onclick = () => nextE(false);
    $("#fcEnd").onclick = () => { flash = null; renderFlashcards(); };
    return;
  }

  const ctxCard = ctxIndexBuild().get(key);
  const useCtx = flash.mode === "context" && ctxCard && ctxCard.contexts.length;
  const ctx = useCtx ? ctxCard.contexts[Math.floor(Math.random() * ctxCard.contexts.length)] : null;

  let face = "";
  if (useCtx) {
    const rx = phraseRegex(c.en);
    const blanked = ctx.sent.replace(rx, () => `<span class="fc-blank">${"＿".repeat(Math.min(14, Math.max(8, c.en.length * 1.2)))}</span>`);
    const firstWord = fcNormKey(c.en).split(" ")[0];
    face = `
      ${ctx.q ? `<div class="flash-ctx-q">📌 题目背景：<span class="en">${esc(ctx.q)}…</span></div>` : ""}
      <div class="flash-ctx-s en">${blanked}</div>
      <div class="fc-hint">💡 这里要表达：${esc(c.zh)}${flash.hint ? ` · 首词提示：<b>${esc(firstWord)}…</b>` : ""}</div>
      ${flash.show
        ? `<div class="fc-reveal en">✓ ${esc(ctx.sent.replace(rx, m => `<u>${esc(m)}</u>`))}</div>`
        : `<div class="hint" style="margin-top:10px">对着语境把词伙说出来，再对答案看考官原句</div>`}`;
  } else {
    face = `<div class="zh-big">${esc(c.zh || "（无中文提示）")}</div>
      ${flash.show
        ? `<div class="en-answer en">${esc(c.en)}</div>`
        : `<div class="hint" style="margin-top:14px">心里默念英文说法，点卡片对答案</div>`}`;
  }

  const srcLabel = flash.topic === "due" ? "今日复习" : flash.topic === "__stars" ? "我的词本" : flash.topic === "通用" ? "通用词伙" : esc(flash.topic);
  box.innerHTML = `<div class="card flash-wrap">
    <div class="flash-meta">${srcLabel} · 第 ${flash.idx + 1} / ${flash.cards.length} 张 · ✓${flash.yes} ✗${flash.no}
    ${flash.mode === "context" && ctx ? `<br><span style="font-size:11px">语境来源：${esc(ctx.src)}（${ctx.kind === "t1" ? "Task 1" : "Task 2"} 范文）</span>` : ""}</div>
    <div class="flash-card" id="fcCard">${face}</div>
    <div class="flash-btns">
      ${useCtx && !flash.show ? `<button id="fcHint">🔤 首词提示</button>` : ""}
      ${!flash.show ? `<button class="primary" id="fcFlip">对答案</button>` : `<button class="no" id="fcNo">😵 不认识</button><button class="yes" id="fcYes">😎 认识</button>`}
      <button id="fcEnd">结束本组</button>
    </div>
  </div>`;

  const flip = () => { flash.show = true; renderFlashcards(); };
  $("#fcCard").onclick = () => { if (!flash.show) flip(); };
  if ($("#fcHint")) $("#fcHint").onclick = () => { flash.hint = true; renderFlashcards(); };
  if ($("#fcFlip")) $("#fcFlip").onclick = flip;
  const next = ok => {
    const srs = Store.get("srs", {});
    const e = srs[key] || { box: 0, due: 0 };
    if (ok) { e.box = Math.min(SRS_INTERVALS.length, e.box + 1); e.due = Date.now() + SRS_INTERVALS[Math.min(e.box, SRS_INTERVALS.length) - 1] * 864e5; }
    else { e.box = 0; e.due = Date.now() + 864e5; }
    srs[key] = e; Store.set("srs", srs);
    if (ok) flash.yes++; else { flash.no++; flash.retry.push(c); }
    flash.idx++;
    if (flash.idx >= flash.cards.length) {
      if (flash.retry.length) { flash.cards = shuffle(flash.retry); flash.retry = []; flash.idx = 0; }
      else {
        const y = flash.yes, nn = flash.no; flash.done = true; flash = null;
        renderFlashcards();
        const h = $("#libContent .flash-wrap h3");
        if (h) h.insertAdjacentHTML("afterend", `<p class="hint">本组成绩：认识 ${y} · 不认识 ${nn}（不认识的明天会出现在「今日复习」里）</p>`);
        return;
      }
    }
    flash.show = false; flash.hint = false;
    renderFlashcards();
  };
  if ($("#fcYes")) $("#fcYes").onclick = () => next(true);
  if ($("#fcNo")) $("#fcNo").onclick = () => next(false);
  $("#fcEnd").onclick = () => { flash = null; renderFlashcards(); };
}
