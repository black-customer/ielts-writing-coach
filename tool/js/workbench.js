/* Shared desktop UI. No network, no changes to existing learning data formats. */
const UI = (() => {
  const paths = {
    pen: '<path d="m16 3 5 5-12 12-6 1 1-6Z"/><path d="m14 5 5 5"/>',
    home: '<path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-2-1-6-2-10 1Z"/>',
    scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 12h10"/>',
    chart: '<path d="M4 3v18h17M9 16v-5m5 5V7m5 9V4"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9Zm-10 12 10 6 10-6M2 15l10 6 10-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
    star: '<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',
    focus: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'
  };
  const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.pen}</svg>`;
  function notice(message, { error = false, action, label = '重试' } = {}) {
    const host = document.getElementById('uiNotices');
    if (!host) return;
    const node = document.createElement('div'); node.className = 'ui-notice' + (error ? ' is-error' : '');
    node.setAttribute('role', error ? 'alert' : 'status');
    node.innerHTML = `<span>${html(message)}</span>${action ? `<button class="small notice-action">${html(label)}</button>` : ''}<button class="notice-close" aria-label="关闭提示">×</button>`;
    host.append(node);
    node.querySelector('.notice-close').onclick = () => node.remove();
    if (action) node.querySelector('.notice-action').onclick = action;
    if (!error) setTimeout(() => node.remove(), 4800);
    return node;
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); notice('已复制'); return true; }
    catch (_) { notice('无法访问剪贴板，请选中文本后复制。', {error:true}); return false; }
  }
  function confirm(message, { label = '确认', danger = false } = {}) {
    return new Promise(resolve => {
      const previous = document.activeElement, dialog = document.createElement('dialog');
      dialog.className = 'ui-dialog';
      dialog.setAttribute('aria-label','确认操作');
      dialog.innerHTML = `<form method="dialog"><h2>确认操作</h2><p>${html(message)}</p><div class="btn-row"><button value="cancel">取消</button><button value="ok" class="${danger ? 'danger' : 'primary'}">${html(label)}</button></div></form>`;
      document.body.append(dialog);
      dialog.addEventListener('close', () => { const ok = dialog.returnValue === 'ok'; dialog.remove(); previous?.focus(); resolve(ok); }, {once:true});
      dialog.showModal(); dialog.querySelector('button').focus();
    });
  }
  const errorAt = (field, text) => {
    let error = field.parentElement.querySelector(`[data-error-for="${field.id}"]`);
    if (!error) { error = document.createElement('p'); error.className = 'error'; error.id = field.id + '-error'; error.dataset.errorFor = field.id; error.setAttribute('role','status'); field.after(error); }
    error.textContent = text; field.setAttribute('aria-describedby',error.id); field.setAttribute('aria-invalid', text ? 'true' : 'false');
  };
  const saves = new Map();
  const latestSaves = new Map();
  const saveNotices = new Map();
  function save(key, task, status, immediate = false) {
    clearTimeout(saves.get(key)?.timer);
    const job={task,status,generation:(latestSaves.get(key)?.generation||0)+1};
    latestSaves.set(key,job);
    const perform = () => {
      if(latestSaves.get(key)!==job)return false;
      let ok=false;try{ok=task();}catch(_){ok=false;}
      if (status) { status.textContent = ok ? '已保存到本机' : '保存失败 · 文本仍在当前页面'; status.dataset.state = ok ? 'saved' : 'error'; }
      saves.delete(key);
      saveNotices.get(key)?.remove();saveNotices.delete(key);
      if(!ok)saveNotices.set(key,notice('保存失败。请重试或复制当前文本，避免关闭页面后丢失。',{error:true,action:()=>{
        const latest=latestSaves.get(key);if(latest)save(key,latest.task,latest.status,true);
      }}));
      return ok;
    };
    if (status) { status.textContent = '正在保存…'; status.dataset.state = 'saving'; }
    if (immediate) return perform();
    saves.set(key, {perform, timer:setTimeout(perform, 450)});
  }
  function flush() { let ok=true; for (const entry of [...saves.values()]) { clearTimeout(entry.timer); if(!entry.perform())ok=false; } return ok; }
  window.addEventListener('pagehide',flush);
  document.addEventListener('visibilitychange',()=>{ if (document.hidden) flush(); });
  let focusSelection = null;
  function focusMode() {
    const entering = !document.body.classList.contains('focus-mode');
    if (entering) focusSelection = EssayEditor.captureSelection();
    document.body.classList.toggle('focus-mode', entering);
    document.querySelectorAll('[data-focus]').forEach(b => { b.innerHTML = icon('focus') + (entering ? '退出专注' : '专注模式'); b.setAttribute('aria-pressed',String(entering)); });
    if (!entering && focusSelection) EssayEditor.restoreSelection(focusSelection);
  }
  function toolbar(host) {
    if (!host || host.querySelector('.workspace-tools')) return;
    const node = document.createElement('div'); node.className = 'workspace-tools';
    const focused=document.body.classList.contains('focus-mode'),expanded=!host.closest('.view')?.classList.contains('panel-collapsed');
    node.innerHTML = `<button data-panel aria-expanded="${expanded}">${icon('panel')}教学面板</button><button data-focus aria-pressed="${focused}">${icon('focus')}${focused?'退出专注':'专注模式'}</button>`;
    host.prepend(node);
    node.querySelector('[data-focus]').onclick = focusMode;
    node.querySelector('[data-panel]').onclick = () => { const view = host.closest('.view'); view.classList.toggle('panel-collapsed'); node.querySelector('[data-panel]').setAttribute('aria-expanded',String(!view.classList.contains('panel-collapsed'))); };
  }
  function init() {
    document.getElementById('btnTheme').setAttribute('aria-label','切换明暗主题');
    document.getElementById('btnAbout').innerHTML = icon('info');
    document.getElementById('btnAbout').setAttribute('aria-label','关于本工具');
    document.querySelectorAll('#mainNav .nav-btn').forEach(b => { const names={train:'home',analyze:'scan',write:'pen',check:'scan',library:'book',bank:'layers',plan:'book',progress:'chart'}; b.insertAdjacentHTML('afterbegin',icon(names[b.dataset.view])); });
    toolbar(document.querySelector('#view-write .write-layout'));
    document.addEventListener('keydown',e=>{ if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) focusMode(); });
    document.addEventListener('focusout',e=>{if(e.target.matches('textarea'))EssayEditor.lastSelection={id:e.target.id,start:e.target.selectionStart,end:e.target.selectionEnd,scroll:e.target.scrollTop};});
    document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.q-card,.q-item')){e.preventDefault();e.target.click();}});
    // Decorative pictographs in legacy templates become plain copy. Editor values and source data are untouched.
    const cleanNode = root => {
      if (!root || root.nodeType !== 1 || root.closest('textarea,script,style,svg,.annotation-original')) return;
      const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      let n; while ((n=walker.nextNode())) {
        if (n.parentElement.closest('textarea,script,style,svg,.en,.annotation-original')) continue;
        const cleaned=n.nodeValue.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'');
        if (cleaned !== n.nodeValue) n.nodeValue=cleaned;
      }
      root.querySelectorAll('.star-btn').forEach(b=>{ if (!b.querySelector('svg')) { b.innerHTML=icon('star'); b.setAttribute('aria-label',b.classList.contains('on')?'取消收藏':'收藏到词本'); } });
      const cards=[...(root.matches('.q-card,.q-item')?[root]:[]),...root.querySelectorAll('.q-card,.q-item')];
      cards.forEach(el=>{el.tabIndex=0;el.setAttribute('role','button');});
    };
    cleanNode(document.body);
    new MutationObserver(records=>{
      for (const record of records) for (const node of record.addedNodes) if (node.nodeType===1) cleanNode(node);
      toolbar(document.querySelector('#trainSession .write-layout'));
    }).observe(document.body,{childList:true,subtree:true});
  }
  function foldReport(host,label) {
    const card=[...host.children].find(e=>e.classList.contains('card'));
    if(!card)return;
    const actions=card.querySelector('#btnReviewCard')?.parentElement || card.querySelector('#btnAiSaveRecord')?.parentElement;
    if(actions)host.append(actions);
    const review=card.querySelector('#finalScoreBox');if(review)host.append(review);
    const fold=document.createElement('details');fold.className='detail-report';fold.innerHTML=`<summary>${html(label)}</summary>`;card.before(fold);fold.append(card);
  }
  return { html, icon, notice, copy, confirm, errorAt, save, flush, toolbar, init, foldReport };
})();

const EssayEditor = {
  getText(root = document.getElementById('paragraphBoxes')) { return [...root.querySelectorAll('textarea')].map(t=>t.value).join('\n\n'); },
  setText(text, root = document.getElementById('paragraphBoxes')) {
    const fields=[...root.querySelectorAll('textarea')];
    if (fields.length === 1) fields[0].value=text;
    else { const paras=text.split(/\n\s*\n/); fields.forEach((t,i)=>t.value=i===fields.length-1?paras.slice(i).join('\n\n'):paras[i]||''); }
    fields.forEach(t=>t.dispatchEvent(new Event('input',{bubbles:true})));
  },
  subscribe(root, fn) { const handler=e=>{if(e.target.matches('textarea')) fn(this.getText(root),e);}; root.addEventListener('input',handler);return ()=>root.removeEventListener('input',handler); },
  lastSelection:null,
  captureSelection() { const el=document.activeElement;if(el?.matches('textarea'))return {id:el.id,start:el.selectionStart,end:el.selectionEnd,scroll:el.scrollTop};const old=document.getElementById(this.lastSelection?.id);return old?.closest('.view.active')?this.lastSelection:null; },
  restoreSelection(s) { const el=document.getElementById(s?.id);if(el){el.focus({preventScroll:true});el.setSelectionRange(s.start,s.end);el.scrollTop=s.scroll;} }
};

const Annotations = (() => {
  const sessions = new Map();
  function matches(text, quote) {
    if (!quote) return [];
    const results=[]; let start=0;
    while ((start=text.indexOf(quote,start)) !== -1) {results.push({start,end:start+quote.length}); start+=quote.length;}
    return results;
  }
  function render(host, context, issues, reference) {
    if (!host || !context) return;
    host.querySelector('.annotation-workbench')?.remove();
    const merged=new Map();
    for(const issue of issues) {
      const quote=String(issue.quote||''),problem=String(issue.problem||'');
      const key=quote ? 'quote:'+quote : 'problem:'+problem;
      const previous=merged.get(key);
      if(previous) { if(problem&&!previous.problem.includes(problem))previous.problem+='；'+problem; if(issue.fix&&!previous.fix.includes(issue.fix))previous.fix+='；'+issue.fix; }
      else merged.set(key,{...issue,quote,problem,fix:String(issue.fix||'')});
    }
    const state={context:{...context},issues:[...merged.values()].map((i,n)=>({...i,id:n,matches:matches(context.essay,i.quote)})),selected:null};
    sessions.set(host.id,state);
    const key=context.mode+'|'+context.question+'|'+context.essay;
    const revisions=Store.get('revisions',{}), revision=revisions[key] || '';
    const node=document.createElement('section');node.className='annotation-workbench';node.setAttribute('aria-label','作文批注与改写');
    node.innerHTML=`<div class="annotation-heading"><div><h2>把反馈写进你的下一版</h2><p class="hint">${context.mode==='t1'?'Task 1':'Task 2'} · 本次诊断原稿 · 点击批注定位原句</p></div><button class="annotation-compare" aria-pressed="false">并排改写</button></div>
      <p class="annotation-stale hidden" role="status">当前输入已修改，下方反馈属于上一版原稿。重新诊断以检查新版本。</p>
      <div class="annotation-layout"><div class="annotation-document"><h3>诊断原稿</h3><article class="annotation-original" tabindex="0"></article></div>
      <div class="annotation-revision hidden"><label>我的改写<textarea id="${UI.html(host.id)}-revision" class="revision-input" rows="16" aria-label="我的改写">${UI.html(revision)}</textarea></label><p class="save-status" role="status">${revision?'已恢复改写':'改写会自动保存'}</p><div class="btn-row"><button class="revision-check">将改写送去诊断</button><button class="revision-copy">复制改写</button></div></div>
      <aside class="annotation-sidebar"><h3>先解决这些问题</h3><div class="annotation-list"></div>
        ${reference?`<details class="reference-example"><summary>查看参考改写</summary><p class="en">${UI.html(reference)}</p></details>`:''}</aside></div>`;
    host.prepend(node);
    const article=node.querySelector('article'),list=node.querySelector('.annotation-list');
    const draw = selected => {
      // Overlap-safe marks: each boundary segment can belong to more than one issue.
      const boundaries=[0,context.essay.length]; state.issues.forEach(i=>i.matches.forEach(m=>boundaries.push(m.start,m.end)));
      const points=[...new Set(boundaries)].sort((a,b)=>a-b);let markup='';
      for(let n=0;n<points.length-1;n++) { const a=points[n],b=points[n+1];const owners=state.issues.filter(i=>i.matches.some(m=>m.start<=a&&m.end>=b));const text=UI.html(context.essay.slice(a,b));
        markup+=owners.length?`<mark tabindex="0" role="button" data-start="${a}" data-owners="${owners.map(i=>i.id).join(',')}" class="${owners.some(i=>i.id===selected)?'selected':''}" aria-label="查看批注 ${owners.map(i=>i.id+1).join('、')}">${text}</mark>`:text;
      }
      article.innerHTML=markup || '<p class="hint">没有原稿内容。</p>';
      article.querySelectorAll('mark').forEach(mark=>{const choose=()=>{
        const id=Number(mark.dataset.owners.split(',')[0]),point=Number(mark.dataset.start);
        const occurrence=state.issues[id].matches.findIndex(m=>m.start<=point&&m.end>point);
        const picker=list.querySelector(`[data-issue="${id}"] select`);if(picker)picker.value=String(Math.max(0,occurrence));
        select(id,false);
      };mark.onclick=choose;mark.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};});
    };
    list.innerHTML=state.issues.length?state.issues.map((i,n)=>`${n===3?'<details class="annotation-more"><summary>其他检查项</summary>':''}<div class="annotation-item" data-issue="${n}"><span class="annotation-kind">${UI.html(i.kind||'需要核对')}</span><button class="annotation-select">${n+1}. ${UI.html(i.problem)}</button><p class="hint">${i.matches.length?`原文中 ${i.matches.length} 处`:'未能定位原句，请结合全文核对'}</p>
      ${i.matches.length>1?`<label class="hint">出现位置<select class="annotation-occurrence" aria-label="批注 ${n+1} 出现位置">${i.matches.map((m,j)=>`<option value="${j}">第 ${j+1} 处 · …${UI.html(context.essay.slice(Math.max(0,m.start-18),m.start))}</option>`).join('')}</select></label>`:''}
      ${i.fix?`<p>${UI.html(i.fix)}</p>`:''}</div>${n===state.issues.length-1&&n>=3?'</details>':''}`).join(''):'<p class="hint">暂无可定位的句子反馈。请结合自评清单或 AI 评阅检查。</p>';
    function select(id, scroll=true) {
      state.selected=id; draw(id);
      list.querySelectorAll('.annotation-item').forEach(el=>el.classList.toggle('selected',Number(el.dataset.issue)===id));
      const item=list.querySelector(`[data-issue="${id}"]`); const fold=item?.closest('details');if(fold)fold.open=true;
      if (!scroll) { item?.querySelector('button')?.focus({preventScroll:true});item?.scrollIntoView({block:'nearest',behavior:motion()}); return; }
      const choice=Number(item?.querySelector('select')?.value || 0), match=state.issues[id].matches[choice];
      if(match)article.querySelector(`mark[data-start="${match.start}"]`)?.scrollIntoView({block:'center',behavior:motion()});
    }
    list.querySelectorAll('.annotation-item').forEach(item=>{item.querySelector('button').onclick=()=>select(Number(item.dataset.issue));const s=item.querySelector('select');if(s)s.onchange=()=>select(Number(item.dataset.issue));});
    draw(null);
    const input=node.querySelector('.revision-input'),status=node.querySelector('.save-status');
    input.oninput=()=>UI.save('revision-'+host.id,()=>{const all=Store.get('revisions',{});all[key]=input.value;return Store.set('revisions',all);},status);
    node.querySelector('.annotation-compare').onclick=e=>{const open=node.classList.toggle('comparing');node.querySelector('.annotation-revision').classList.toggle('hidden',!open);e.currentTarget.setAttribute('aria-pressed',String(open));};
    node.querySelector('.revision-copy').onclick=()=>UI.copy(input.value);
    node.querySelector('.revision-check').onclick=()=>{
      if(!input.value.trim()){UI.errorAt(input,'请先写下你的改写。');return;}
      if(!UI.save('revision-'+host.id,()=>{const all=Store.get('revisions',{});all[key]=input.value;return Store.set('revisions',all);},status,true))return;
      TaskFlow.diagnose(input.value,context);stale();document.getElementById('btnCheck').click();
    };
    stale();
  }
  function motion(){return matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';}
  function stale(){for(const [id,s] of sessions){const node=document.querySelector(`#${id} .annotation-workbench`);if(node)node.querySelector('.annotation-stale').classList.toggle('hidden',document.getElementById('essayInput').value.trim()===s.context.essay&&document.getElementById('checkQuestion').value.trim()===s.context.question&&checkMode===s.context.mode);}}
  return { matches,render,stale };
})();

// Shared handoff keeps existing drafts and task metadata together.
const TaskFlow = {
  writingMeta: {}, checkMeta: {},
  chartLabel(type) {
    const name=typeof trainChartName==='function'?trainChartName(type):String(type||'');
    if(/\+|混合|组合|双图|two charts/i.test(name))return '双图 Two charts';
    return /地图|map/i.test(name)?'地图 Map':/流程|process|cycle/i.test(name)?'流程图 Process':/线图|line/i.test(name)?'线图 Line graph':/柱图|bar/i.test(name)?'柱图 Bar chart':/饼图|pie/i.test(name)&&!/\+|表/.test(name)?'饼图 Pie chart':/表格|table/i.test(name)?'表格 Table':'双图 Two charts';
  },
  async write(q) {
    if(!saveWritingDraft(true))return false;
    const mode=q.task===1?'t1':'t2',previous=Store.getDraft(mode);
    if(previous?.text?.trim() && previous.question!==q.question) {
      if(!await UI.confirm('当前 Task 已有另一道题的草稿。原稿将保留在首页的“保留的草稿”中，再打开新题。',{label:'保留原稿并换题'}))return false;
      if(!Store.archiveDraft(mode,previous)){UI.notice('原稿保留失败，请复制或备份后重试。',{error:true});return false;}
    }
    const meta={question:q.question||'',qtype:q.qtype||'',qKey:q.qKey|| (q.src?`${q.src} T${q.task}`:''),chartKey:q.chartKey|| (q.task===1&&q.src?q.src:''),chart:q.task===1?this.chartLabel(q.qtype):''};
    const text=previous?.question===meta.question?previous.text:'';
    if(!Store.saveDraft(mode,text,meta)){UI.notice('新题保存失败，当前草稿仍保留。',{error:true});return false;}
    // setWriteMode saves the currently mounted editor, so switch before applying the new draft.
    if(effMode()===mode && writeMode!=='mock') {this.writingMeta=meta;buildParagraphBoxes();}
    else {const old=Store.getDraft(mode);setWriteMode(mode);if(writeMode!==mode)return false;this.writingMeta=old||meta;}
    currentQuestion=meta.question;currentAnalysis=null;this.writingMeta=meta;
    if(mode==='t1')document.getElementById('t1QuestionInput').value=meta.question;
    else document.getElementById('writeQuestionInput').value=meta.question;
    goto('write');return true;
  },
  diagnose(text,context) {
    setCheckMode(context.mode);
    document.getElementById('essayInput').value=text;
    document.getElementById('checkQuestion').value=context.question||'';
    if(context.mode==='t1'&&context.chart)document.getElementById('checkChart').value=this.chartLabel(context.chart);
    if(context.mode==='t2'&&context.qtype)document.getElementById('checkType').value=context.qtype;
    this.checkMeta={qKey:context.qKey||'',chartKey:context.chartKey||''};this.renderCheckChart();
    goto('check');
  },
  renderCheckChart() {
    const host=document.getElementById('checkTaskChart');if(!host)return;
    const key=this.checkMeta.chartKey;
    host.innerHTML=checkMode==='t1' ? key?`<details class="chart-fold" open><summary>本次题目图表</summary><div class="chart-wrap">${T1Charts.render(key)}</div></details>`:'<p class="hint">未关联原图：请对照自己的图表核验数字、单位和主要特征。</p>':'';
  },
  async restore(index) {
    const saved=Store.get('draftHistory',[])[index];if(!saved)return;
    if(!await this.write({task:saved.mode==='t1'?1:2,question:saved.question,qtype:saved.qtype,chartKey:saved.chartKey,qKey:saved.qKey}))return;
    EssayEditor.setText(saved.text);saveWritingDraft(true);
  }
};
