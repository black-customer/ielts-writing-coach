/* Local model essays: search, filter, read, then continue writing. */
let mbFilter={task:'',book:''},mbOpenKey=null,mbPage=1,mbReturn=null;
function modelKeys() {
  const query=$('#mbSearch').value.trim().toLowerCase();
  return Object.keys(ModelEssays).filter(key=>{
    const m=key.match(/剑(\d+) Test (\d+) T(\d)/),e=ModelEssays[key];
    return (!mbFilter.task||m[3]===mbFilter.task)&&(!mbFilter.book||m[1]===mbFilter.book)&&(!query||`${key} ${questionOf(key)} ${e.essay} ${JSON.stringify(e.paraTeach)}`.toLowerCase().includes(query));
  });
}
function renderModelBank() {
  if(typeof ModelEssays==='undefined')return;
  const keys=modelKeys(),pages=Math.max(1,Math.ceil(keys.length/12));mbPage=Math.min(mbPage,pages);
  $('#mbResults').textContent=`找到 ${keys.length} 篇范文 · 当前显示 ${keys.length?Math.min(12,keys.length-(mbPage-1)*12):0} 篇`;
  const pool=trainingPool();
  $('#mbGrid').innerHTML=keys.slice((mbPage-1)*12,mbPage*12).map(key=>{
    const q=pool.find(q=>tKey(q)===key),task=key.endsWith('T1')?1:2;
    const tag=task===1?trainChartName(q?.qtype):trainTypeName(q?.qtype);
    return `<div class="q-card ${mbOpenKey===key?'open':''}" data-mb="${esc(key)}"><div class="q-top"><b>${esc(key.replace(/ T[12]$/,''))}</b><span class="badge">Task ${task}</span></div><div class="q-tag">${esc(tag||'')} ${task===1&&T1Charts.hasImg(key.replace(/ T[12]$/,''))?' · 有图表':''}</div><p class="q-preview en">${esc(q?.question||'')}</p></div>`;
  }).join('')||'<p class="empty-state">没有匹配的范文。试试更短的关键词，或清除筛选。</p>';
  $('#mbPager').innerHTML=pagerHtml(mbPage,pages);
  $$('#mbPager [data-pg]').forEach(b=>b.onclick=()=>{mbPage=+b.dataset.pg;closeModelDetail(false);renderModelBank();$('#mbGrid').scrollIntoView({block:'start'});});
  $$('#mbGrid [data-mb]').forEach(c=>c.onclick=()=>{
    mbReturn={y:window.scrollY,key:c.dataset.mb};mbOpenKey=c.dataset.mb;renderModelDetail(mbOpenKey);
    $$('#mbGrid .q-card').forEach(x=>x.classList.toggle('open',x.dataset.mb===mbOpenKey));
    $('#mbClose').focus({preventScroll:true});$('#mbDetail').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
}
function closeModelDetail(restore=true) {
  $('#mbDetail').classList.add('hidden');mbOpenKey=null;
  $$('#mbGrid .q-card').forEach(c=>c.classList.remove('open'));
  if(restore&&mbReturn){$(`#mbGrid [data-mb="${mbReturn.key}"]`)?.focus({preventScroll:true});window.scrollTo(0,mbReturn.y);}
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
      <p class="tr-con">${esc(p.guideQ)}</p>
    </div></details>`;
  }).join("");
  box.classList.remove("hidden");
  box.innerHTML = `
    <div class="box-head" style="margin-top:14px"><span class="box-title">${esc(key)} · ${words} 词 ${t1 ? "· 小作文" : "· 大作文"}</span>
      <div class="btn-row" style="margin:0">
        <button class="small" id="mbCopy">复制全文去验证</button>
        <button class="primary small" id="mbWrite">用这道题独立写作</button><button class="small" id="mbTrain">查看逐段教学</button>
        <button class="small" id="mbClose">收起</button>
      </div></div>
    ${chart ? `<details class="chart-fold" open><summary>题目图表（对照读）</summary><div class="chart-wrap">${chart}</div></details>` : ""}
    <p class="en hint" style="font-style:italic">${esc(questionOf(key))}</p>
    <div class="tpl en" style="white-space:pre-wrap;line-height:1.9;font-size:var(--fs-md)">${esc(e.essay)}</div>
    ${e.chartNote ? `<p class="hint">图表数据说明：${esc(e.chartNote)}</p>` : ""}
    <h3 style="margin:16px 0 8px">逐段教学包（按我的写作体系）</h3>
    ${teach}
    <p class="hint">学习方法：先独立作答，再对照范文检查回答、展开和表达。范文和 AI 评分供参考，不能作为考试分数保证。</p>`;
  $("#mbCopy").onclick = () => {
    UI.copy(e.essay);
  };
  $('#mbWrite').onclick=()=>{const q=trainingPool().find(q=>tKey(q)===key);if(q)TaskFlow.write(q);else UI.notice('未找到对应题目，请从题库选择。',{error:true});};
  $("#mbTrain").onclick = () => {
    const q = trainingPool().find(x => tKey(x) === key);
    if (!q) { UI.notice("题池中未找到该题。"); return; }
    startTraining(q);
  };
  $('#mbClose').onclick=()=>closeModelDetail();
}

function questionOf(key) {
  const q = (typeof trainingPool === "function") ? trainingPool().find(x => tKey(x) === key) : null;
  return q ? q.question : "";
}

  $$("#mbFilters [data-mb]").forEach(b => b.onclick = () => {
    $$("#mbFilters [data-mb]").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    mbFilter.task = b.dataset.mb === "all" ? "" : b.dataset.mb;
    mbPage=1;closeModelDetail(false);renderModelBank();
  });
  const mbExport = $("#mbExport");
  if (mbExport) mbExport.onclick = exportStudyBooklet;
const mbBookSel = $("#mbBook");
if (mbBookSel) {
  const books = [...new Set(Object.keys(ModelEssays || {}).map(k => +k.match(/剑(\d+)/)[1]))].sort((a, b) => a - b);
  mbBookSel.innerHTML = '<option value="">全部册</option>' + books.map(b => `<option value="${b}">剑${b}</option>`).join("");
  mbBookSel.onchange = () => { mbFilter.book = mbBookSel.value;mbPage=1;closeModelDetail(false);renderModelBank(); };
  renderModelBank();
}

// ---------- 导出学习册（当前筛选的范文+教学包 → 可打印 HTML） ----------
function exportStudyBooklet() {
  const keys=modelKeys();
  if (!keys.length) { UI.notice("当前筛选没有范文。"); return; }
  const names = t1 => t1 ? { 2: "开头段", 3: "概括段", 4: "细节段一", 5: "细节段二" } : { 2: "开头段", 3: "主体段 1", 4: "主体段 2", 5: "结尾段" };
  const sections = keys.map(k => {
    const e = ModelEssays[k],t1=k.endsWith('T1');
    const m = k.match(/剑(\d+) Test (\d+) T(\d)/);
    const teach = Object.keys(e.paraTeach).sort().map(pk => {
      const p = e.paraTeach[pk];
      return `<div class="teach"><b>${names(t1)[pk]} · 为什么这样写</b>
        <p>${esc(p.why)}</p>
        <div class="en">${esc(p.modelPara)}</div>
        <ul>${p.expressions.map(x => `<li><span class="en">${esc(x.en)}</span> —— ${esc(x.zh)}</li>`).join("")}</ul>
        <p class="gq">${esc(p.guideQ)}</p></div>`;
    }).join("");
    return `<section><h2>${esc(k)}（${e.essay.trim().split(/\s+/).length} 词）</h2>
      ${e.chartNote ? `<p class="cn">图表数据：${esc(e.chartNote)}</p>` : ""}
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
<h1>IELTS 范文学习册</h1><p class="hint">共 ${keys.length} 篇 · 生成于 ${new Date().toLocaleString("zh-CN")} · IELTS Writing Coach（打印时每篇自动另起一页）</p>
${sections}</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const scope = (mbFilter.task === "1" ? "小作文" : mbFilter.task === "2" ? "大作文" : "全题库") + (mbFilter.book ? "_剑" + mbFilter.book : "");
  a.download = "IELTS范文学习册_" + scope + "_" + keys.length + "篇.html";
  a.click();
}



$('#mbSearch').oninput=debounce(()=>{mbPage=1;closeModelDetail(false);renderModelBank();},250);
$('#mbClear').onclick=()=>{mbFilter={task:'',book:''};mbPage=1;$('#mbSearch').value='';$('#mbBook').value='';$('#mbFilters [data-mb="all"]').click();$('#mbSearch').focus();};
