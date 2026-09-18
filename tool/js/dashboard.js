/* dashboard.js — 智能复盘仪表盘（M7）
 * 弱点画像（分项×题型×错误标签聚合）→ 今日处方（弱项题+到期卡+专题）→ 一键直达
 * 注入位置：进度页顶部（renderProgress 调用）
 */
function renderDashboard() {
  const host = document.getElementById("dashBoard");
  if (!host) return;
  const records = Store.get("records", []);
  if (records.length < 5) {
    host.innerHTML = `<div class="issue ok"><b>📈 智能复盘需要至少 5 篇诊断记录</b>（当前 ${records.length} 篇）。
      去训练营完成几道题，或在诊断室诊断你写过的作文，仪表盘就能给出弱点画像和今日处方。</div>`;
    return;
  }

  // ---- 1. 弱点画像 ----
  const critOf = r => Object.entries(r.scores || {});
  const critAgg = {}; // crit -> {sum,n}
  const typeAgg = {}; // t2type/mode -> {sum,n}
  records.forEach(r => {
    critOf(r).forEach(([c, v]) => { (critAgg[c] = critAgg[c] || { sum: 0, n: 0 }).sum += v; critAgg[c].n++; });
    const t = r.title || "";
    const mode = r.mode === "t1" ? "Task 1" : "Task 2";
    (typeAgg[mode] = typeAgg[mode] || { sum: 0, n: 0 }).sum += r.overall || 0; typeAgg[mode].n++;
  });
  const crits = Object.entries(critAgg).map(([c, a]) => ({ c, avg: a.sum / a.n, n: a.n })).sort((x, y) => x.avg - y.avg);
  const weakest = crits[0];
  const names = { TR: "任务回应", TA: "任务达成", CC: "连贯衔接", LR: "词汇资源", GRA: "语法" };
  const critDoc = { TR: "01 §3", TA: "04 §1-2", CC: "01 §6", LR: "06", GRA: "03 §2" };

  // 错误标签 top3
  const tagCount = {};
  records.forEach(r => (r.tags || []).forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const TAG_NAMES2 = (typeof TAG_NAMES !== "undefined") ? TAG_NAMES : {};

  // 近 5 次是否在进步
  const recent = records.slice(0, 5).map(r => r.overall || 0);
  const older = records.slice(5, 10).map(r => r.overall || 0);
  const trend = older.length ? (recent.reduce((a, b) => a + b, 0) / recent.length) - (older.reduce((a, b) => a + b, 0) / older.length) : 0;
  const trendTxt = trend > 0.2 ? `近 5 篇比之前平均高 ${trend.toFixed(1)} 分，保持节奏 👍` : trend < -0.2 ? `近 5 篇比之前平均低 ${Math.abs(trend).toFixed(1)} 分，建议放慢速度、逐篇复盘` : "水平总体稳定";

  // ---- 2. 今日处方 ----
  const rx = [];
  if (weakest) {
    // 从训练营挑 1 道未做过的、匹配最弱分项的题
    let q = null;
    try {
      const pool = (typeof trainingPool === "function") ? trainingPool().filter(x => x.book >= 15) : [];
      const s = (typeof trainStore === "function") ? trainStore() : { done: {} };
      const undone = pool.filter(x => !s.done[tKey(x)]);
      const wantT1 = weakest.c === "TA";
      q = undone.find(x => (x.task === 1) === wantT1) || undone[0];
    } catch (_) {}
    if (q) rx.push({ icon: "✍️", txt: `练 1 道${weakest.c} 弱项题（${q.src}·${q.task === 1 ? "小作文" : "大作文"}）`, act: `startTraining(trainingPool().find(x => tKey(x) === ${JSON.stringify(tKey(q))})); goto("train");` });
  }
  const due = (typeof dueCount === "function") ? dueCount() + (typeof errDueCount === "function" ? errDueCount() : 0) : 0;
  if (due > 0) rx.push({ icon: "🔁", txt: `复习 ${due} 张到期闪卡（含错因卡）`, act: `goto("library"); setTimeout(function(){ var t=document.querySelector(".lib-tab[data-lib=flashcards]"); if(t) t.click(); }, 50);` });
  if (topTags.length) {
    const t = topTags[0][0];
    rx.push({ icon: "📖", txt: `重读高频问题「${TAG_NAMES2[t] || t}」的改法（近 ${topTags[0][1]} 篇反复出现）`, act: `goto("library"); setTimeout(function(){ var el=document.querySelector(".lib-tab[data-lib=mistakes]"); if(el) el.click(); }, 50);` });
  } else if (weakest) {
    rx.push({ icon: "📖", txt: `重读《${critDoc[weakest.c] || "03"}》里 ${weakest.c} 的 7 分要求`, act: `window.open("docs/index.html","_blank")` });
  }
  if (rx.length < 3) {
    rx.push({ icon: "✍️", txt: "在训练营再完成 1 道未做过的题", act: `goto("train");` });
  }

  // ---- 3. 热力图（最近 12 次 × 分项） ----
  const recent12 = records.slice(0, 12).reverse();
  const allCrits = [...new Set(recent12.flatMap(r => Object.keys(r.scores || {})))];
  const heat = `<table class="heat"><tr><th></th>${allCrits.map(c => `<th>${c}</th>`).join("")}<th>总分</th></tr>
    ${recent12.map(r => `<tr><td class="hd">${new Date(r.date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}</td>
      ${allCrits.map(c => { const v = (r.scores || {})[c]; const cls = v == null ? "" : v >= 7 ? "g" : v >= 6 ? "y" : "r"; return `<td class="${cls}">${v == null ? "—" : v}</td>`; }).join("")}
      <td><b>${r.overall || "—"}</b></td></tr>`).join("")}
  </table>`;

  host.innerHTML = `
    <div class="dash-head">
      <div class="dash-card">
        <div class="ptitle">🎯 弱点画像</div>
        ${weakest ? `<p>最弱分项：<b>${weakest.c}（${names[weakest.c] || weakest.c}）</b> 近 ${weakest.n} 次均值 ${weakest.avg.toFixed(1)}</p>` : ""}
        ${topTags.map(([t, n]) => `<p class="hint">· 高频问题：<b>${TAG_NAMES2[t] || t}</b>（${n} 次）</p>`).join("")}
        <p class="hint">${trendTxt}</p>
      </div>
      <div class="dash-card">
        <div class="ptitle">💊 今日处方</div>
        <ul class="rx">${rx.map(x => `<li><button class="small" onclick='${x.act}'>${x.icon} 开始</button> ${x.txt}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="ptitle" style="margin-top:12px">📊 最近 12 次分项热力图（<span class="lg g">≥7</span> <span class="lg y">6-6.5</span> <span class="lg r">&lt;6</span>）</div>
    ${heat}`;

  host.querySelectorAll("button").forEach(b => { if (!b.onclick) b.onclick = new Function(b.getAttribute("onclick")); });
}

