/* 自查不当成分数，Task 1 / Task 2 分别汇总。 */
function renderDashboard() {
  const host = document.getElementById("dashBoard");
  if (!host) return;
  const items = Learning.read().items;
  const names = { TR: "任务回应", TA: "任务达成", CC: "连贯衔接", LR: "词汇资源", GRA: "语法" };
  const records = Store.get("records", []).filter(r => r.ai);
  const repairs = items.reduce((n, i) => n + i.attempts.filter(a => a.stage === "repair" && a.passed).length, 0);
  const transfers = items.reduce((n, i) => n + i.attempts.filter(Learning.independentPass).length, 0);
  const week = Learning.stats();
  host.innerHTML = `<h3>从改对，到换题也能写出来</h3>
    <p>已保存 ${items.length} 份诊断原稿 · 改写自查通过 ${repairs} 次 · 独立换题自查通过 ${transfers} 次</p>
    <p>最近 7 天：独立复测 ${week.independent} 次，其中自查通过 ${week.passed} 次；借助提示 ${week.assisted} 次${week.unknown ? `；独立性未知 ${week.unknown} 次` : ''}。</p>
    <p>整篇验证 ${week.benchmarks} 次，其中独立自查通过 ${week.benchmarkPassed} 次。</p>
    <p class="hint">自查是练习记录，不是考官评分。反复在新题中独立做到，再用完整限时作文检验。</p>
    <button id="dashboardPractice">${Learning.next() ? "继续今日改写与复测" : "去训练营独立练习"}</button>
    ${["t2", "t1"].map(mode => {
      const group = records.filter(r => r.mode === mode).slice(0, 5);
      if (!group.length) return `<p class="hint">Task ${mode === "t1" ? "1" : "2"}：暂无 AI 评分记录。完成一次诊断就可以开始针对性练习，无需等到 5 篇。</p>`;
      const keys = mode === "t1" ? ["TA", "CC", "LR", "GRA"] : ["TR", "CC", "LR", "GRA"];
      const stats = keys.map(key => {
        const values = group.map(r => r.scores?.[key] ?? (key === "TA" ? r.scores?.TR : undefined)).filter(v => Number.isFinite(v) && v >= 0 && v <= 9);
        return values.length ? `${names[key]} ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}` : "";
      }).filter(Boolean);
      return `<p><b>Task ${mode === "t1" ? "1" : "2"} · 最近 ${group.length} 次 AI 参考均值</b><br>${stats.join(" · ")}</p>`;
    }).join("")}
    ${items.length ? `<details class="learning-history"><summary>查看诊断原稿与练习记录（最近 12 份）</summary>
      ${items.slice(0, 12).map(i => `<details><summary>${esc(new Date(i.date).toLocaleDateString("zh-CN"))} · ${esc(i.focus.title)}</summary>
        <p class="en learning-text">${esc(i.question)}</p><p class="en learning-text">${esc(i.essay)}</p>
        ${i.attempts.map(a => `<h4>${a.stage === "repair" ? "原题改写" : a.stage === 'benchmark' ? `整篇验证 · ${a.independent ? '独立' : '辅助或独立性未知'}` : a.independent === true ? "独立换题" : a.independent === false ? "辅助练习" : "换题练习 · 独立性未知"} · ${a.passed ? "自查通过" : "继续练习"}</h4>${a.timed ? `<p class="hint">开启限时计时 · 用时约 ${Math.ceil(a.elapsedMs/60000)} 分钟${a.elapsedMs > (i.mode==='t1'?20:40)*60000 ? ' · 已超时' : ''}</p>` : ''}<p class="en">${esc(a.question)}</p><p class="en learning-text">${esc(a.text)}</p>${a.quote ? `<p class="en">证据：${esc(a.quote)}</p>` : ''}<p>${esc(a.note)}</p>${a.criteria ? `<ul>${a.criteria.map((c,n)=>`<li>${a.checks?.[n] ? '已自查' : '未确认'}：${esc(c)}</li>`).join('')}</ul>` : ''}`).join("")}
        <button data-review-packet="${esc(i.id)}">复制给老师的复核材料</button>
      </details>`).join("")}</details>` : ""}`;
  host.querySelector("button").onclick = () => goto("train");
  host.querySelectorAll('[data-review-packet]').forEach(b=>b.onclick=()=>UI.copy(Learning.reviewPacket(b.dataset.reviewPacket)));
}
