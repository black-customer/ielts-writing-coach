/* modelbank.js — 预生成范文库浏览器（剑15-21 · 56 篇）
 * 点开即读、一键复制去外部平台验证；小作文附图表对照；可直达训练营教学 */
let mbFilter = { task: "", book: "" };
let mbOpenKey = null;

function renderModelBank() {
  if (typeof ModelEssays === "undefined") return;
  const grid = $("#mbGrid");
  if (!grid) return;
  const keys = Object.keys(ModelEssays).filter(k => {
    const m = k.match(/剑(\d+) Test (\d+) T(\d)/);
    if (mbFilter.task && +m[3] !== +mbFilter.task) return false;
    if (mbFilter.book && +m[1] !== +mbFilter.book) return false;
    return true;
  });
  const chartName = t => ({ "line graph": "线图", "line graphs": "线图", "bar chart": "柱图", "pie chart": "饼图", "pie + bar charts": "饼+柱", "pie + table": "饼+表", "table + pie charts": "表+饼", "table": "表格", "tables": "表格", "maps": "地图", "map": "地图", "process diagram": "流程图", "mixed charts": "混合图", "chart + table": "图+表" });
  const t2Name = { opinion: "观点", discussion: "讨论", "adv-disadv-opinion": "利弊", "adv-disadv": "纯利弊", "problem-solution": "解决", "two-part": "双问" };
  const qpool = (typeof trainingPool === "function") ? trainingPool() : [];
  grid.innerHTML = keys.map(k => {
    const m = k.match(/剑(\d+) Test (\d+) T(\d)/);
    const poolQ = qpool.find(q => tKey(q) === k);
    const tag = +m[3] === 1 ? (chartName[poolQ && poolQ.qtype] || "图表") : (t2Name[poolQ && poolQ.qtype] || "");
    const hasChart = +m[3] === 1 && typeof T1Charts !== "undefined" && T1Charts.hasImg(k.replace(/ T\d$/, ""));
    return `<div class="q-card ${mbOpenKey === k ? "open" : ""}" data-mb="${esc(k)}">
      <div class="q-top"><b>剑${m[1]} · Test ${m[2]}</b><span class="badge">${+m[3] === 1 ? "小" : "大"}</span></div>
      <div class="q-tag">${esc(tag)}${hasChart ? " · 📊" : ""}</div>
    </div>`;
  }).join("") || "<p class='hint'>无匹配。</p>";
  $$("#mbGrid [data-mb]").forEach(c => c.onclick = () => {
    mbOpenKey = c.dataset.mb;
    renderModelDetail(mbOpenKey);
    $$("#mbGrid .q-card").forEach(x => x.classList.toggle("open", x.dataset.mb === mbOpenKey));
    if (window.matchMedia) window.scrollTo({ top: $("#mbDetail").offsetTop - 70, behavior: "smooth" });
  });
}

function renderModelDetail(key) {
  const e = ModelEssays[key];
  const box = $("#mbDetail");
  const m = key.match(/剑(\d+) Test (\d+) T(\d)/);
  const t1 = +m[3] === 1;
  const chart = (t1 && typeof T1Charts !== "undefined") ? T1Charts.render(key.replace(/ T\d$/, "")) : "";
  const words = e.essay.trim().split(/\s+/).length;
  const teach = Object.keys(e.paraTeach).sort().map(pk => {
    const p = e.paraTeach[pk];
    const names = t1 ? { 2: "开头段", 3: "概括段", 4: "细节段一", 5: "细节段二" } : { 2: "开头段", 3: "主体段 1", 4: "主体段 2", 5: "结尾段" };
    return `<details class="fold"><summary>${names[pk]} · 为什么这样写</summary><div class="fold-body">
      <p>${esc(p.why)}</p>
      <div class="tpl en">${esc(p.modelPara)}</div>
      <div class="persp"><div class="ptitle">本段表达</div><div class="coll-grid">${p.expressions.map(x => `<div class="coll-item"><span class="en">${esc(x.en)}</span> <span class="zh">—— ${esc(x.zh)}</span>${starBtn("范文库", x.en, x.zh, "coll")}</div>`).join("")}</div></div>
      <p class="tr-con">🤔 ${esc(p.guideQ)}</p>
    </div></details>`;
  }).join("");
  box.classList.remove("hidden");
  box.innerHTML = `
    <div class="box-head" style="margin-top:14px"><span class="box-title">📄 ${esc(key)} · ${words} 词 ${t1 ? "· 小作文" : "· 大作文"}</span>
      <div class="btn-row" style="margin:0">
        <button class="small" id="mbCopy">📋 复制全文去验证</button>
        <button class="small" id="mbTrain">🎓 进训练营逐段学</button>
        <button class="small" id="mbClose">收起</button>
      </div></div>
    ${chart ? `<details class="chart-fold" open><summary>📊 题目图表（对照读）</summary><div class="chart-wrap">${chart}</div></details>` : ""}
    <p class="en hint" style="font-style:italic">${esc(questionOf(key))}</p>
    <div class="tpl en" style="white-space:pre-wrap;line-height:1.9;font-size:var(--fs-md)">${esc(e.essay)}</div>
    ${e.chartNote ? `<p class="hint">📊 图表数据说明：${esc(e.chartNote)}</p>` : ""}
    <h3 style="margin:16px 0 8px">逐段教学包（按我的写作体系）</h3>
    ${teach}
    <p class="hint">验证方法：复制全文 → 外部 AI 评分平台提交 → 三模型均分 ≥7.5 为达标。把分数和评语告诉我，可反向修正写作体系。</p>`;
  $("#mbCopy").onclick = () => {
    navigator.clipboard.writeText(e.essay).then(() => alert("范文已复制，去外部评分平台验证吧（目标均分 ≥7.5）"));
  };
  $("#mbTrain").onclick = () => {
    const q = trainingPool().find(x => tKey(x) === key);
    if (!q) { alert("题池中未找到该题。"); return; }
    startTraining(q);
  };
  $("#mbClose").onclick = () => { box.classList.add("hidden"); mbOpenKey = null; renderModelBank(); };
}

function questionOf(key) {
  const q = (typeof trainingPool === "function") ? trainingPool().find(x => tKey(x) === key) : null;
  return q ? q.question : "";
}

  $$("#mbFilters [data-mb]").forEach(b => b.onclick = () => {
    $$("#mbFilters [data-mb]").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    mbFilter.task = b.dataset.mb === "all" ? "" : b.dataset.mb;
    renderModelBank();
  });
  const mbExport = $("#mbExport");
  if (mbExport) mbExport.onclick = exportStudyBooklet;
const mbBookSel = $("#mbBook");
if (mbBookSel) {
  const books = [...new Set(Object.keys(ModelEssays || {}).map(k => +k.match(/剑(\d+)/)[1]))].sort((a, b) => a - b);
  mbBookSel.innerHTML = '<option value="">全部册</option>' + books.map(b => `<option value="${b}">剑${b}</option>`).join("");
  mbBookSel.onchange = () => { mbFilter.book = mbBookSel.value; renderModelBank(); };
  renderModelBank();
}

// ---------- 🖨 导出学习册（当前筛选的范文+教学包 → 可打印 HTML） ----------
function exportStudyBooklet() {
  const keys = Object.keys(ModelEssays).filter(k => {
    const m = k.match(/剑(\d+) Test (\d+) T(\d)/);
    if (mbFilter.task && +m[3] !== +mbFilter.task) return false;
    if (mbFilter.book && +m[1] !== +mbFilter.book) return false;
    return true;
  });
  if (!keys.length) { alert("当前筛选没有范文。"); return; }
  const names = t1 => t1 ? { 2: "开头段", 3: "概括段", 4: "细节段一", 5: "细节段二" } : { 2: "开头段", 3: "主体段 1", 4: "主体段 2", 5: "结尾段" };
  const sections = keys.map(k => {
    const e = ModelEssays[k];
    const m = k.match(/剑(\d+) Test (\d+) T(\d)/);
    const teach = Object.keys(e.paraTeach).sort().map(pk => {
      const p = e.paraTeach[pk];
      return `<div class="teach"><b>${names(t1)[pk]} · 为什么这样写</b>
        <p>${esc(p.why)}</p>
        <div class="en">${esc(p.modelPara)}</div>
        <ul>${p.expressions.map(x => `<li><span class="en">${esc(x.en)}</span> —— ${esc(x.zh)}</li>`).join("")}</ul>
        <p class="gq">🤔 ${esc(p.guideQ)}</p></div>`;
    }).join("");
    return `<section><h2>${esc(k)}（${e.essay.trim().split(/\s+/).length} 词）</h2>
      ${e.chartNote ? `<p class="cn">📊 图表数据：${esc(e.chartNote)}</p>` : ""}
      <div class="essay en">${esc(e.essay).replace(/\n/g, "<br>")}</div>
      <h3>逐段教学</h3>${teach}</section>`;
  }).join("");
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>IELTS 范文学习册（${keys.length} 篇）</title>
<style>@page{size:A4;margin:16mm 14mm}
body{font-family:"Segoe UI","Microsoft YaHei",sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#1f2937;line-height:1.8}
h1{font-size:22px}h2{font-size:18px;border-bottom:2px solid #2563eb;padding-bottom:6px;margin-top:34px}
section{page-break-before:always}
.essay{font-family:Georgia,serif;font-size:15.5px;line-height:1.95;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin:12px 0}
.teach{border-left:3px solid #2563eb;padding:6px 14px;margin:14px 0;background:#f8fafc;border-radius:0 8px 8px 0}
.teach b{color:#1d4ed8}.en{font-family:Georgia,serif}
ul{margin:6px 0;padding-left:20px}li{margin:3px 0}.gq{color:#92400e}
.cn{font-size:13px;color:#64748b}.hint{color:#6b7280;font-size:13px}</style></head><body>
<h1>📚 IELTS 范文学习册</h1><p class="hint">共 ${keys.length} 篇 · 生成于 ${new Date().toLocaleString("zh-CN")} · IELTS Writing Coach（打印时每篇自动另起一页）</p>
${sections}</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const scope = (mbFilter.task === "1" ? "小作文" : mbFilter.task === "2" ? "大作文" : "全题库") + (mbFilter.book ? "_剑" + mbFilter.book : "");
  a.download = "IELTS范文学习册_" + scope + "_" + keys.length + "篇.html";
  a.click();
}


