/* The writing loop: local work, optional help, explicit AI requests. */
const Studio = (() => {
  const $=s=>document.querySelector(s),h=UI.html;
  let helpReturn=null,pending=new Map(),generation=0;
  const writing=()=>({...TaskFlow.writingMeta,mode:effMode(),question:effMode()==='t1'?$('#t1QuestionInput').value:$('#writeQuestionInput').value,chart:$('#t1ChartSelect').value,essay:EssayEditor.getText()});
  const checking=()=>({...TaskFlow.checkMeta,mode:checkMode,question:$('#checkQuestion').value,chart:$('#checkChart').value,qtype:$('#checkType').value,essay:$('#essayInput').value});
  function saved(ok){if(!ok)UI.notice('作品保存失败，文本仍在当前页面。请重试或复制后再离开。',{error:true});return ok;}
  function available(){return navigator.onLine!==false&&!!AI.cfg().apiKey;}
  function stopRequests(){generation++;for(const p of pending.values())p.abort();pending.clear();}
  function view(name){
    stopRequests();
    const titles={train:['继续练习','从上次停下的地方继续。'],bank:['选题写作','选一道题，先写自己的回答。'],progress:['作品记录','看原稿、修改和下一次的实际表现。'],write:['写作工作台','题目在旁边，先写自己的回答。'],check:['写作工作台','理解一个问题，写出自己的下一版。']};
    if(titles[name]){$('#pageTitle').textContent=titles[name][0];$('#pageDescription').textContent=titles[name][1];}
    $('#studioSteps')?.classList.toggle('hidden',!['write','check'].includes(name));
    $('#studioSteps')?.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.step===name?'step':'false'));
    const active=$(`#mainNav [data-view="${name}"]`);if(active?.closest('details'))active.closest('details').open=true;
    if(name==='progress')records();
    if(name==='check')checkMounted();
    if(name==='train'&&!tc)home();
    if(name==='bank')$('#bankWritingActions')?.classList.remove('hidden');
    const w=Works.get(name==='write'?TaskFlow.writingMeta.workId:TaskFlow.checkMeta.workId);
    if(w?.conflict)UI.notice('检测到其他标签页的修改，双方版本均已保留，可在作品记录中比较。');
  }
  function home(){
    const host=$('#trainHome');if(!host||tc)return;
    let old=host.querySelector('#optionalTraining');
    if(!old){old=document.createElement('details');old.id='optionalTraining';old.className='optional-training';old.innerHTML='<summary>辅助训练与原有复习安排（可选）</summary>';while(host.firstChild)old.append(host.firstChild);host.append(old);}
    host.querySelector('#continueWork')?.remove();
    const w=Works.all()[0],v=Works.version(w,w?.currentVersion);
    const node=document.createElement('section');node.id='continueWork';node.className='continue-work';
    node.innerHTML=w?`<h2>${w.resume.view==='check'?'继续修改这篇作文':'继续上次的写作'}</h2><p class="hint">Task ${w.context.mode==='t1'?'1':'2'} · ${new Date(w.updatedAt).toLocaleString('zh-CN')} · ${h(w.context.mockGroup?'模考作品':'本机作品')}</p><p class="en work-question">${h(w.context.question||'自选题目')}</p><p class="en work-excerpt">${h((v?.text||'还没有正文，从第一句话开始。').slice(0,240))}</p><div class="btn-row"><button class="primary" id="resumeWork">${w.resume.view==='check'?'继续修改':'继续写'}</button><button id="newWork">选一道新题</button><button id="homeRecords">查看作品</button></div><p class="hint">这次只处理一个问题也可以，随时保存，下次接着做。</p>`:`<h2>从一篇自己的作文开始</h2><p>选一道题直接写。写完再看反馈，有问题就问清楚，然后自己修改。</p><div class="btn-row"><button id="newWork" class="primary">选题开始写作</button><button id="ownQuestion">使用自己的题目</button></div><p class="hint">无需先上课或做测试。文字和资料可离线使用，AI 仅在主动请求时联网。</p>`;
    host.prepend(node);
    node.querySelector('#resumeWork')?.addEventListener('click',()=>open(w.id));
    node.querySelector('#newWork').onclick=()=>goto('bank');
    node.querySelector('#homeRecords')?.addEventListener('click',()=>goto('progress'));
    node.querySelector('#ownQuestion')?.addEventListener('click',()=>newWork('t2'));
  }
  async function newWork(mode,practice='practice',q){
    if(!UI.flush()||($('#view-write').classList.contains('active')&&!saveWritingDraft(true)))return;
    const c={mode,question:q?.question||'',qKey:q?tKey(q):'',qtype:q?.qtype||'',chartKey:mode==='t1'?(q?.src||''):'',chart:mode==='t1'?TaskFlow.chartLabel(q?.qtype):'',practice};
    const w=Works.create(c);if(!saved(Works.save(w)))return;
    await open(w.id,'write');
    $('#fullEssay').focus();
  }
  function startMock(){
    if(!UI.flush()||($('#view-write').classList.contains('active')&&!saveWritingDraft(true)))return;
    const group='mock-'+Works.id(),works=['t1','t2'].map(mode=>Works.create({mode,mockGroup:group,practice:'independent'}));
    if(!works.every(w=>saved(Works.save(w))))return;
    if(!saved(Store.set('activeMockGroup',group)))return;
    for(const w of works)if(!saved(Store.saveDraft('mock_'+w.context.mode,'',{...w.context,workId:w.id})))return;
    writeMode='mock';mockPhase=1;mockT1Text='';buildParagraphBoxes();syncTargets();resetTimer(1200);
    $('#t1ChartPicker').classList.remove('hidden');$('#writeQuestionInput').classList.add('hidden');$('label[for="writeQuestionInput"]').classList.add('hidden');
    document.querySelectorAll('#writeModeSwitch .mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode==='mock'));goto('write');
  }
  async function open(workId,target){
    if(!UI.flush()||($('#view-write').classList.contains('active')&&!saveWritingDraft(true)))return;
    const w=Works.get(workId);if(!w)return;
    const f=w.feedback.find(f=>f.id===w.resume.feedbackId)||w.feedback[w.feedback.length-1];
    if((target||w.resume.view)==='check'&&f&&['ai','rules'].includes(f.kind)){
      const v=Works.version(w,f.versionId),c={...v.context,workId:w.id,versionId:v.id,feedbackId:f.id,essay:v.text};
      const inputVersion=Works.version(w,w.resume.inputVersionId);
      TaskFlow.diagnose(inputVersion?.text??v.text,inputVersion?{...inputVersion.context,workId:w.id,versionId:inputVersion.id}:c);
      $('#checkResult').classList.add('hidden');$('#aiResult').classList.add('hidden');
      if(f.kind==='ai'){lastAi={...f.result,context:c};lastAiContext=c;renderAiResult(lastAi);}
      else {lastCheck={...f.result,essay:v.text,questionText:c.question,mode:c.mode};TaskFlow.checkMeta=c;renderCheck();}
      return;
    }
    const v=Works.version(w,w.currentVersion)||w.versions[0];
    if(!v)return;
    const c={...v.context,workId:w.id};
    const mock=w.context.mockGroup;
    if(mock){writeMode='mock';mockPhase=c.mode==='t1'?1:2;}
    else writeMode=c.mode;
    const draftKey=mock?'mock_'+c.mode:c.mode;
    if(!saved(Store.saveDraft(draftKey,v.text,c)))return;
    buildParagraphBoxes();
    document.querySelectorAll('#writeModeSwitch .mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===writeMode));
    $('#t1ChartPicker').classList.toggle('hidden',c.mode!=='t1');$('#writeQuestionInput').classList.toggle('hidden',c.mode==='t1');$('label[for="writeQuestionInput"]').classList.toggle('hidden',c.mode==='t1');
    $('#t1QuestionInput').value=c.mode==='t1'?c.question:$('#t1QuestionInput').value;$('#writeQuestionInput').value=c.question;
    syncTargets();resetTimer(w.resume.timerLeft??(c.mode==='t1'?1200:2400));
    if(mock){const other=Works.all().find(o=>o.id!==w.id&&o.context.mockGroup===mock);if(other?.context.mode==='t1')mockT1Text=Works.version(other,other.currentVersion)?.text||'';}
    goto('write');
    requestAnimationFrame(()=>EssayEditor.restoreSelection(w.resume.selection));
  }
  function copy(c,opts){return UI.copy(EssayContext.packet(c,opts));}
  function notes(host,c){
    host.querySelector('.external-note')?.remove();
    const w=Works.get(c.workId),box=document.createElement('details');box.className='external-note';
    box.innerHTML='<summary>外部 AI 使用方法与可选备注</summary><p class="hint">点击“复制给 AI”，粘贴到你常用的 AI 对话；Task 1 缺图时同时附上原图。回来后直接修改，有用的反馈也可记在下面。</p><label>备注（可留空）<textarea rows="3" class="external-note-input" aria-label="外部反馈备注"></textarea></label><span class="save-status" role="status"></span>';
    const input=box.querySelector('textarea');input.value=w?.note||'';
    input.oninput=()=>UI.save('note-'+c.workId,()=>{const w=Works.get(c.workId);if(!w)return false;w.note=input.value;return Works.save(w);},box.querySelector('.save-status'));
    host.append(box);
  }
  function editorMounted(){
    const view=$('#view-write');view.classList.add('panel-collapsed');
    if(!$('#writingActions')){
      const actions=document.createElement('div');actions.id='writingActions';actions.className='studio-action-bar';
      actions.innerHTML='<button id="copyWritingAI">复制给 AI</button><button id="writingHelp">看示范／看讲解</button><button id="writingNew">选新题</button><button id="writingFinish">保存并返回</button>';
      $('#paragraphBoxes').before(actions);
      $('#copyWritingAI').onclick=()=>copy(writing());$('#writingHelp').onclick=()=>help(writing());$('#writingNew').onclick=()=>goto('bank');$('#writingFinish').onclick=()=>{if(saveWritingDraft(true)&&UI.flush())goto('train');};
    }
    let context=writing();
    if(context.mode==='t1'){
      let box=$('#chartNotes');if(!box){box=document.createElement('details');box.id='chartNotes';box.innerHTML='<summary>补充图表文字数据（可选）</summary><p class="hint">可填写数字、单位、年份，或流程与地图关系。只会作为用户补充说明，不能替代已核验原图。</p><label>图表说明<textarea id="writingChartNotes" rows="4"></textarea></label><p id="chartEvidenceState" class="hint"></p>';$('#writeTaskChart').after(box);}
      box.classList.remove('hidden');$('#writingChartNotes').value=context.chartNotes||'';$('#chartEvidenceState').textContent=EssayContext.chart(context).text;
      $('#writingChartNotes').oninput=()=>{TaskFlow.writingMeta.chartNotes=$('#writingChartNotes').value;saveWritingDraft();};
    }else $('#chartNotes')?.classList.add('hidden');
    $('#practiceState')?.remove();const state=document.createElement('div');state.id='practiceState';
    state.innerHTML=`<p class="hint">${context.practice==='independent'?'独立验证 · 先独立完成，帮助默认收起；产品外的帮助无法自动检测。':context.practice==='assisted'?'辅助练习 · 已使用帮助。':'完整写作或局部练习均可，随时保存退出。'}</p>${context.reminder?`<details id="oldReminder"><summary>上次的一条提醒（可选）</summary><p>${h(context.reminder)}</p></details>`:''}<label class="hint"><input type="checkbox" id="outsideHelp"> 本次使用了其他帮助（可选）</label>`;
    $('#writingActions').after(state);
    $('#outsideHelp').checked=context.practice==='assisted';$('#outsideHelp').onchange=()=>{TaskFlow.writingMeta.practice=$('#outsideHelp').checked?'assisted':'unknown';saveWritingDraft();};
    $('#oldReminder')?.addEventListener('toggle',e=>{if(e.target.open)markHelp(writing(),'旧问题提醒');});
    if(context.practice==='independent')$('#view-write').classList.add('panel-collapsed');
    const chartHost=$('#writeTaskChart');
    if(chartHost.querySelector('.t1img')&&!chartHost.querySelector('.expand-chart')){
      const expand=document.createElement('button');expand.className='expand-chart small';expand.textContent='放大图表';expand.onclick=()=>{const section=$('#view-write');section.classList.toggle('expanded-chart');expand.textContent=section.classList.contains('expanded-chart')?'还原图表':'放大图表';};chartHost.append(expand);
    }
  }
  function checkMounted(){
    const c=checking(),host=$('#view-check > .card');
    if(!$('#checkWritingActions')){
      const bar=document.createElement('div');bar.id='checkWritingActions';bar.className='studio-action-bar';bar.innerHTML='<button id="copyCheckAI">复制给 AI</button><button id="backWriting">回到正文</button><button id="checkHelp">看示范／看讲解</button><button id="saveReviewExit">保存并返回</button>';
      host.prepend(bar);$('#copyCheckAI').onclick=()=>copy(checking());$('#backWriting').onclick=()=>{const c=Works.bind(checking());saved(Works.save(Works.get(c.workId)));open(c.workId,'write');};$('#checkHelp').onclick=()=>help(checking());$('#saveReviewExit').onclick=()=>{UI.flush();if(persistCheck())goto('train');};
    }
    if(!$('#quickSelfCheck')){const p=document.createElement('p');p.id='quickSelfCheck';p.className='hint';p.textContent='先通读一遍：回答了题目吗？理由说清楚了吗？有能自己修正的错误吗？可以直接请求反馈，无须填写清单。';$('#essayInput').before(p);}
    $('#btnCheck').textContent='基础规则检查';
    if(c.workId)notes(host,c);
    let graph=$('#checkChartEvidence');if(!graph){graph=document.createElement('p');graph.id='checkChartEvidence';graph.className='hint';$('#checkTaskChart').after(graph);}graph.textContent=c.mode==='t1'?EssayContext.chart(c).text:'';
  }
  function persistCheck(){
    const c=checking();if(!c.essay.trim())return true;
    const bound=Works.bind(c,c.essay,false),w=Works.get(bound.workId);TaskFlow.checkMeta={...TaskFlow.checkMeta,workId:w.id,versionId:bound.versionId};
    w.resume={...w.resume,view:w.feedback.length?'check':'write',inputVersionId:bound.versionId};return saved(Works.save(w));
  }
  function markHelp(c,reason){
    saved(Works.exposure(c,reason));const w=Works.get(c.workId);if(w&&w.context.practice==='independent'){w.context.practice='assisted';saved(Works.save(w));if(TaskFlow.writingMeta.workId===w.id)TaskFlow.writingMeta.practice='assisted';}
  }
  function help(c,paragraph=false){
    if(!UI.flush())return;
    c=Works.bind(c);
    if($('#view-write').classList.contains('active'))TaskFlow.writingMeta.workId=c.workId;
    else TaskFlow.checkMeta={...TaskFlow.checkMeta,workId:c.workId,versionId:c.versionId};
    UI.flush();helpReturn={selection:EssayEditor.captureSelection(),focus:document.activeElement};markHelp(c,paragraph?'段落教学':'范文讲解');
    $('#contextHelp')?.remove();const panel=document.createElement('aside');panel.id='contextHelp';panel.className='context-help';panel.setAttribute('aria-label','按需学习资料');
    const pool=trainingPool(),q=pool.find(q=>tKey(q)===c.qKey&&q.question===c.question)||pool.find(q=>q.question===c.question&&q.task===(c.mode==='t1'?1:2));
    const model=q&&ModelEssays[tKey(q)];
    panel.innerHTML=`<div class="box-head"><h2>${paragraph?'先练一个段落':'需要时再看帮助'}</h2><button id="closeContextHelp">收起并返回</button></div>${model?`<p class="hint">与当前题目一致的已有材料 · ${h(tKey(q))}</p>${Object.values(model.paraTeach||{}).map(p=>`<details><summary>${h(p.guideQ||'段落讲解')}</summary><p>${h(p.why)}</p><p class="en">${h(p.modelPara)}</p></details>`).join('')}<details><summary>查看完整示范</summary><p class="en">${h(model.essay)}</p></details>`:'<p>没有找到与这道题准确对应的示范，可查看通用资料，或针对当前问题继续追问。</p>'}${paragraph?'<label>试写一个段落（可选）<textarea id="helpParagraph" rows="5"></textarea></label><p class="save-status" id="helpParagraphSave" role="status"></p>':''}<div class="btn-row"><a href="docs/index.html" target="_blank">知识库</a><button id="helpCourse">短课讲解与练习</button><button id="helpMaterialBank">其他范文与资料</button></div>`;
    $('.view.active').prepend(panel);
    $('#closeContextHelp').onclick=()=>{if(!UI.flush())return;panel.remove();EssayEditor.restoreSelection(helpReturn.selection);if(!helpReturn.selection&&helpReturn.focus?.isConnected)helpReturn.focus.focus();};
    const courseLink=panel.querySelector('#helpCourse');
    $('#helpMaterialBank').onclick=()=>{if(!UI.flush())return;panel.remove();goto('bank');$('#modelBankFold').open=true;};
    if(courseLink){const button=courseLink;button.onclick=()=>{
      panel.querySelector('.course-help')?.remove();const materials=document.createElement('div');materials.className='course-help';materials.innerHTML=`<h3>${h(CourseHelp.title)} · 文字讲解</h3><p class="hint">复用已有原创课程，按需查看，不要求完成课程才能继续写作。</p>${CourseHelp.lessons.map(l=>`<details><summary>${h(l.title)}</summary><p>${h(l.goal)}</p><p>${h(l.exercise)}</p>${l.scenes.map(s=>`<h4>${h(s.title)}</h4>${s.narration.map(n=>`<p>${h(n.text)}</p>`).join('')}`).join('')}<details><summary>参考讲评与自查提示</summary><p>${h(l.answer)}</p><ul>${l.rubric.map(r=>`<li>${h(r)}</li>`).join('')}</ul></details><p>${h(l.transfer)}</p></details>`).join('')}`;panel.append(materials);
    };}
    if(paragraph){const w=Works.get(c.workId),input=$('#helpParagraph');input.value=w?.paragraphDraft||'';input.oninput=()=>UI.save('paragraph-'+c.workId,()=>{if(!w)return false;w.paragraphDraft=input.value;return Works.save(w);},$('#helpParagraphSave'));}
    $('#closeContextHelp').focus();panel.scrollIntoView({block:'start'});
  }
  function diff(original,revision){
    const a=original.split(/\n\s*\n/),b=revision.split(/\n\s*\n/);
    return `<div class="revision-diff"><div><h4>原稿</h4>${a.map((p,i)=>`<p class="en ${p===b[i]?'':'diff-removed'}">${h(p)}</p>`).join('')}</div><div><h4>修改稿</h4>${b.map((p,i)=>`<p class="en ${p===a[i]?'':'diff-added'}">${h(p)}</p>`).join('')}</div></div>`;
  }
  function annotate(node,context,state,host,select){
    $('#view-check').classList.add('has-feedback');
    const kind=host.id==='aiResult'?'ai':'rules';
    if(!context.feedbackId){const result=kind==='ai'?(window._lastAi||lastAi):{...lastCheck};Object.assign(context,Works.feedback(context,kind,result||{}));}
    const w=Works.get(context.workId);state.context=context;
    node.querySelector('.annotation-heading .hint').textContent=`Task ${context.mode==='t1'?'1':'2'} · 第 ${w.versions.findIndex(v=>v.id===context.versionId)+1} 版评阅原稿 · 点击批注定位`;
    if(checking().essay.trim()===context.essay&&checking().question.trim()===context.question)TaskFlow.checkMeta={...TaskFlow.checkMeta,workId:context.workId,versionId:context.versionId,feedbackId:context.feedbackId};
    if(w.resume.feedbackId===context.feedbackId&&Number.isInteger(w.resume.selected)&&state.issues[w.resume.selected]){select(w.resume.selected,false);state.selected=w.resume.selected;}
    node.querySelectorAll('.annotation-item').forEach((item,n)=>{
      const ask=document.createElement('button');ask.className='ask-feedback small';ask.textContent='问清楚';ask.onclick=()=>{select(n);chat(node,context,state.issues[n]);};item.append(ask);
      item.querySelector('.annotation-select').addEventListener('click',()=>saved(Works.resume(w.id,{view:'check',feedbackId:context.feedbackId,selected:n})));
    });
    const compare=node.querySelector('.annotation-compare');compare.textContent='在原稿上修改';
    compare.addEventListener('click',()=>saved(Works.resume(w.id,{view:'check',feedbackId:context.feedbackId,comparing:node.classList.contains('comparing')})));
    if(w.resume.comparing){node.classList.add('comparing');node.querySelector('.annotation-revision').classList.remove('hidden');compare.setAttribute('aria-pressed','true');}
    const input=node.querySelector('.revision-input');
    if(w.resume.revisionSelection) {input.setSelectionRange(w.resume.revisionSelection.start,w.resume.revisionSelection.end);input.scrollTop=w.resume.revisionSelection.scroll;}
    input.addEventListener('blur',()=>saved(Works.resume(w.id,{revisionSelection:{start:input.selectionStart,end:input.selectionEnd,scroll:input.scrollTop}})));
    node.querySelector('.revision-check').textContent='检查这次修改';
    const tools=document.createElement('div');tools.className='btn-row';tools.innerHTML='<button class="copy-recheck small">复制复核材料</button><button class="show-diff small">查看修改差异</button>';
    node.querySelector('.annotation-revision').append(tools);tools.querySelector('.copy-recheck').onclick=()=>copy(context,{issue:state.issues[state.selected??0],revision:input.value});
    tools.querySelector('.show-diff').onclick=()=>{node.querySelector('.diff-output')?.remove();const out=document.createElement('div');out.className='diff-output';out.innerHTML=diff(context.essay,input.value);node.append(out);};
    const checks=w.checks.filter(c=>c.versionId===context.versionId);if(checks.length)showRecheck(node,checks[checks.length-1].result);
    const exits=document.createElement('details');exits.className='learning-exits';exits.innerHTML='<summary>卡住时，可以这样继续</summary><div class="btn-row"><button data-exit="explain">没理解，问清楚</button><button data-exit="paragraph">理解了，试写一段</button><button data-exit="timed">限时写不完，练完整作文</button><button data-exit="teacher">反馈有疑问，请老师复核</button><button data-exit="next">换一道题验证</button><button data-exit="leave">保存并返回</button></div>';
    node.append(exits);exits.querySelectorAll('[data-exit]').forEach(b=>b.onclick=()=>{
      const action=b.dataset.exit,issue=state.issues[state.selected??0];
      if(action==='explain')chat(node,context,issue);if(action==='paragraph')help(context,true);
      if(action==='teacher')copy(context,{revision:input.value,teacher:true});
      if(action==='next')next(context,issue?.problem||'');
      if(action==='timed')newWork(context.mode,'independent');
      if(action==='leave'&&UI.flush())goto('train');
    });
    const oldLearning=host.querySelector('.learning-feedback');if(oldLearning){const fold=document.createElement('details');fold.className='optional-learning';fold.innerHTML='<summary>结构化练习与自查（可选）</summary>';oldLearning.before(fold);fold.append(oldLearning);}
    if(w.resume.conversationId){const conv=w.conversations.find(c=>c.id===w.resume.conversationId&&c.versionId===context.versionId&&c.feedbackId===context.feedbackId);if(conv)chat(node,context,conv.issue,conv);}
  }
  async function request(key,run,output,button,onSuccess){
    if(pending.has(key))return;
    const controller=new AbortController(),seq=generation;pending.set(key,controller);button.disabled=true;output.textContent='正在请求…';
    const cancel=document.createElement('button');cancel.textContent='取消请求';output.after(cancel);
    let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort();},90000);
    cancel.onclick=()=>{controller.abort();output.textContent='请求已取消，文本已保留。';};
    try{const result=await run(controller.signal);if(controller.signal.aborted||seq!==generation)return;onSuccess(result);}
    catch(e){if(output.isConnected){output.textContent=timedOut?'请求超时，请重试或复制给外部 AI。':controller.signal.aborted?'请求已取消，文本已保留。':'请求失败：'+e.message;}}
    finally{clearTimeout(timer);cancel.remove();button.disabled=false;if(pending.get(key)===controller)pending.delete(key);}
  }
  function showRecheck(node,r){node.querySelector('.recheck-result')?.remove();const out=document.createElement('div');out.className='recheck-result';out.setAttribute('role','status');out.innerHTML=`<h3>${h(r.status)}</h3><p>${h(r.evidence)}</p><p>${h(r.next)}</p><p class="hint">本结论仅针对这次修改，不代表已掌握，也不是考试评分。</p>`;node.querySelector('.annotation-revision').append(out);}
  function checkRevision(node,c,state){
    const input=node.querySelector('.revision-input'),text=input.value,issue=state.issues[state.selected??0];
    if(!available()){UI.notice('站内复核需要联网并配置 AI。可使用“复制复核材料”，到常用 AI 中请教。');return;}
    if(node.closest('#checkResult')){UI.notice('原反馈来自基础规则检查。此按钮将请求 AI 语义复核，规则结果本身不能证明内容改善。');}
    let status=node.querySelector('.recheck-status');if(!status){status=document.createElement('p');status.className='recheck-status';status.setAttribute('role','status');input.after(status);}
    request('recheck-'+c.workId,signal=>AI.recheck(c,issue,text,{signal}),status,node.querySelector('.revision-check'),r=>{
      const w=Works.get(c.workId);w.checks.push({id:Works.id(),versionId:c.versionId,revision:text,issue,result:r,at:Date.now()});saved(Works.save(w));
      if(input.value!==text){status.textContent='修改稿已变化，此复核属于提交时的版本，可在作品记录中查看。';return;}
      status.textContent='复核已保存';showRecheck(node,r);
    });
  }
  function chat(node,c,issue,existing){
    if(!UI.flush())return;
    const w=Works.get(c.workId);if(!w)return;
    let conv=existing||w.conversations.findLast?.(x=>x.versionId===c.versionId&&x.feedbackId===c.feedbackId&&x.issue?.quote===issue?.quote&&x.issue?.problem===issue?.problem&&!x.closed);
    if(!conv){conv={id:Works.id(),versionId:c.versionId,feedbackId:c.feedbackId,issue:issue||{},messages:[],draft:'',at:Date.now()};w.conversations.push(conv);saved(Works.save(w));}
    saved(Works.resume(w.id,{conversationId:conv.id}));
    node.querySelector('.feedback-chat')?.remove();const panel=document.createElement('section');panel.className='feedback-chat';panel.setAttribute('aria-label','针对反馈追问');
    panel.innerHTML=`<div class="box-head"><h3>把这个问题问清楚</h3><button class="close-chat small">收起</button></div><p class="hint">当前原稿 · ${h(issue?.problem||'针对这篇作文提问')}</p><div class="chat-messages"></div><label>你的问题<textarea class="chat-input" rows="3" placeholder="例如：为什么这一段还没有解释清楚？"></textarea></label><p class="chat-status" role="status"></p><div class="btn-row"><button class="chat-send primary">发送追问</button><button class="chat-copy">复制给外部 AI</button><button class="chat-new">开启新一轮</button></div>`;
    node.querySelector('.annotation-sidebar').append(panel);
    const input=panel.querySelector('textarea'),status=panel.querySelector('.chat-status'),out=panel.querySelector('.chat-messages');input.value=conv.draft||'';
    const draw=()=>{out.innerHTML=conv.messages.map(m=>`<div class="chat-message"><b>${m.role==='user'?'我':'AI'}</b><p>${h(m.content)}</p></div>`).join('');};draw();
    input.oninput=()=>UI.save('chat-'+conv.id,()=>{conv.draft=input.value;return Works.save(w);},status);
    panel.querySelector('.close-chat').onclick=()=>{if(!UI.flush())return;pending.get('chat-'+conv.id)?.abort();saved(Works.resume(w.id,{conversationId:null}));panel.remove();node.querySelector('.annotation-item.selected .ask-feedback')?.focus();};
    panel.querySelector('.chat-copy').onclick=()=>UI.copy(EssayContext.packet(c,{issue})+'\n\n'+conv.messages.map(m=>(m.role==='user'?'学生：':'AI：')+m.content).join('\n\n')+'\n\n我的追问：'+input.value);
    panel.querySelector('.chat-new').onclick=()=>{if(!UI.flush())return;pending.get('chat-'+conv.id)?.abort();conv.closed=true;saved(Works.save(w));chat(node,c,issue);};
    panel.querySelector('.chat-send').onclick=()=>{
      const question=input.value.trim();if(!question){status.textContent='请先输入你的问题。';return;}if(!available()){status.textContent='请联网并配置 AI，或复制到常用 AI 对话。';return;}
      request('chat-'+conv.id,signal=>AI.followUp(c,issue,[...conv.messages,{role:'user',content:question}],{signal}),status,panel.querySelector('.chat-send'),answer=>{
        conv.messages.push({id:Works.id(),role:'user',content:question,at:Date.now()},{id:Works.id(),role:'assistant',content:answer,at:Date.now()+1});
        conv.draft=input.value===question?'':input.value;input.value=conv.draft;saved(Works.save(w));draw();status.textContent='对话已保存';
      });
    };
    input.focus({preventScroll:true});
  }
  function next(c,reminder=''){
    $('#nextQuestionChoice')?.remove();
    const written=new Set(Works.all().flatMap(w=>w.versions.filter(v=>v.text.trim()).map(v=>v.context.mode+'|'+v.context.question)));
    const pool=trainingPool().filter(q=>q.task===(c.mode==='t1'?1:2)&&q.question!==c.question&&!written.has(c.mode+'|'+q.question)&&!Works.seen(q));
    let n=0;const box=document.createElement('section');box.id='nextQuestionChoice';box.className='context-help';
    const draw=()=>{const q=pool[n%Math.max(1,pool.length)];box.innerHTML=`<h3>换一道题，独立试一次</h3><p class="en">${h(q?.question||'暂时没有未写且未查看同题材料的题目，可以自带题目，或从题库自行选择。')}</p><label><input id="carryReminder" type="checkbox"> 带上这一条提醒：${h(reminder||'回看上次遇到的问题')}</label><p class="hint">仅依据本产品内的写作与资料打开记录筛选；无法确认你在其他地方是否见过。</p><div class="btn-row"><button id="startNext" class="primary" ${q?'':'disabled'}>开始写作</button><button id="changeNext" ${pool.length>1?'':'disabled'}>换一题</button><button id="ownNext">自带题目</button><button id="closeNext">取消</button></div>`;
      $('#changeNext').onclick=()=>{n++;draw();};$('#closeNext').onclick=()=>box.remove();$('#ownNext').onclick=()=>{box.remove();newWork(c.mode,'independent');};$('#startNext').onclick=async()=>{const r=$('#carryReminder').checked?reminder:'';box.remove();await newWork(c.mode,'independent',q);TaskFlow.writingMeta.reminder=r;saveWritingDraft(true);editorMounted();};};
    $('.view.active').prepend(box);draw();box.scrollIntoView({block:'start'});
  }
  function records(){
    const host=$('#view-progress');let fold=$('#legacyProgress');if(!fold){fold=document.createElement('details');fold.id='legacyProgress';fold.innerHTML='<summary>历史评分、自查统计与词本</summary>';while(host.firstChild)fold.append(host.firstChild);host.append(fold);}
    $('#worksRecords')?.remove();const box=document.createElement('section');box.id='worksRecords';
    const works=Works.all();box.innerHTML=`<h2>我的作品</h2><p class="hint">修改效果看具体内容；自查和 AI 意见分别保留，不能替代独立写作的表现。</p><div class="btn-row"><label>比较作品<select id="compareA" aria-label="第一篇作品">${works.map(w=>`<option value="${h(w.id)}">${h(w.context.question||'未命名作品')}</option>`).join('')}</select></label><label>与<select id="compareB" aria-label="第二篇作品">${works.map((w,n)=>`<option value="${h(w.id)}" ${n===1?'selected':''}>${h(w.context.question||'未命名作品')}</option>`).join('')}</select></label><button id="compareWorks" ${works.length<2?'disabled':''}>比较两篇</button><button id="copyBlind" ${works.length<2?'disabled':''}>复制盲评材料</button></div><div id="worksComparison"></div>${works.length?works.map(w=>`<article class="work-record"><p class="hint">Task ${w.context.mode==='t1'?'1':'2'} · ${w.context.practice==='assisted'?'辅助练习':w.context.practice==='independent'?'独立作答（外部帮助未自动核验）':'独立性未知'}${w.conflict?' · 有多标签页版本':''}</p><h3 class="en">${h(w.context.question||'未命名作品')}</h3><div class="btn-row"><button data-open-work="${h(w.id)}">继续这篇</button><button data-next-work="${h(w.id)}">换题验证</button></div><details><summary>原稿、修改与反馈 · ${w.versions.length} 个版本</summary><div class="btn-row"><label>原稿<select data-version-a="${h(w.id)}">${w.versions.map((v,n)=>`<option value="${h(v.id)}">${n+1} · ${h(v.kind)} · ${new Date(v.at).toLocaleString('zh-CN')}</option>`).join('')}</select></label><label>修改<select data-version-b="${h(w.id)}">${w.versions.map((v,n)=>`<option value="${h(v.id)}" ${v.id===w.currentVersion?'selected':''}>${n+1} · ${h(v.kind)}</option>`).join('')}</select></label><button data-diff-work="${h(w.id)}">对比所选版本</button><button data-use-version="${h(w.id)}">继续编辑所选修改版</button></div><div data-history="${h(w.id)}"></div><details><summary>已保存的反馈与复核</summary>${w.feedback.map(f=>`<p>${h(f.kind==='rules'?'基础规则检查':f.kind==='ai'?'AI 参考反馈':'历史评价')} · ${new Date(f.at).toLocaleString('zh-CN')}</p><p>${h(f.result.summary||(f.result.priorityFixes||[]).join('；')||'查看原反馈或历史评分统计')}</p>`).join('')}${w.checks.map(c=>`<p>${h(c.result.status)}：${h(c.result.evidence)} ${h(c.result.next)}</p>`).join('')}</details>${w.note?`<h4>备注</h4><p>${h(w.note)}</p>`:''}${w.noteAlternatives?.length?`<details><summary>其他标签页的备注</summary>${w.noteAlternatives.map(n=>`<p>${h(n)}</p>`).join('')}</details>`:''}<details><summary>历史追问</summary>${w.conversations.map(c=>`<p>${h(c.issue.problem||'作文追问')}</p>${c.messages.map(m=>`<p>${m.role==='user'?'我':'AI'}：${h(m.content)}</p>`).join('')}`).join('')||'<p>暂无追问</p>'}</details></details></article>`).join(''):'<p class="empty-state">还没有作品，选一道题开始写作。</p>'}`;
    host.prepend(box);
    box.querySelectorAll('[data-open-work]').forEach(b=>b.onclick=()=>open(b.dataset.openWork));
    box.querySelectorAll('[data-next-work]').forEach(b=>b.onclick=()=>{const w=Works.get(b.dataset.nextWork);next(w.context,w.feedback.findLast?.(f=>f.kind==='ai')?.result.priorityFixes?.[0]||'');});
    box.querySelectorAll('[data-diff-work]').forEach(b=>b.onclick=()=>{const w=Works.get(b.dataset.diffWork),a=Works.version(w,box.querySelector(`[data-version-a="${w.id}"]`).value),v=Works.version(w,box.querySelector(`[data-version-b="${w.id}"]`).value);box.querySelector(`[data-history="${w.id}"]`).innerHTML=diff(a.text,v.text);});
    box.querySelectorAll('[data-use-version]').forEach(b=>b.onclick=()=>{const w=Works.get(b.dataset.useVersion),v=Works.version(w,box.querySelector(`[data-version-b="${w.id}"]`).value);w.currentVersion=v.id;if(saved(Works.save(w)))open(w.id,'write');});
    const pair=()=>[$('#compareA').value,$('#compareB').value].map(id=>{const w=Works.get(id),v=Works.version(w,w.currentVersion);return {...v.context,essay:v.text};});
    $('#compareWorks').onclick=()=>{const [a,b]=pair();$('#worksComparison').innerHTML=`<p class="en">${h(a.question)} / ${h(b.question)}</p>`+diff(a.essay,b.essay);};
    $('#copyBlind').onclick=()=>UI.copy(pair().map((c,n)=>'作品 '+(n+1)+'\n'+EssayContext.packet(c,{teacher:true})).join('\n\n——\n\n'));
  }
  function init(){
    if(!Works.migrate())UI.notice('部分旧记录尚未迁移，原数据仍保留。请释放空间后重新打开。',{error:true});
    const nav=$('#mainNav'),aux=document.createElement('details');aux.id='auxiliaryNav';aux.innerHTML='<summary>辅助学习</summary>';
    const labels={train:'继续练习',bank:'选题写作',progress:'作品记录'};
    nav.querySelectorAll('.nav-group').forEach(n=>n.remove());
    nav.querySelectorAll('.nav-btn').forEach(b=>{if(labels[b.dataset.view]){b.lastChild.textContent=labels[b.dataset.view];}else aux.append(b);});
    nav.append(aux);
    const onboarding=document.createElement('button');onboarding.className='nav-btn';onboarding.textContent='使用引导与方法自测';onboarding.onclick=()=>window.showOptionalOnboarding?.();aux.append(onboarding);
    const steps=document.createElement('div');steps.id='studioSteps';steps.className='studio-steps hidden';steps.innerHTML='<button data-step="write">正文与题目</button><button data-step="check">反馈与修改</button><button id="workspaceSaveExit">保存并返回</button>';
    $('.page-heading').after(steps);
    steps.querySelector('[data-step="write"]').onclick=()=>{const c=checking();if(c.workId)open(c.workId,'write');else goto('write');};
    steps.querySelector('[data-step="check"]').onclick=()=>$('#btnToCheck').click();
    $('#workspaceSaveExit').onclick=()=>{const ok=$('#view-write').classList.contains('active')?saveWritingDraft(true):persistCheck();if(ok&&UI.flush())goto('train');};
    const bankActions=document.createElement('div');bankActions.id='bankWritingActions';bankActions.className='studio-action-bar';bankActions.innerHTML='<button id="ownTask2">自带 Task 2 题目</button><button id="ownTask1">自带 Task 1 题目</button><button id="fullTask2">Task 2 限时验证</button><button id="fullTask1">Task 1 限时验证</button><button id="fullMock">双任务模考</button>';
    $('#view-bank').prepend(bankActions);$('#ownTask2').onclick=()=>newWork('t2');$('#ownTask1').onclick=()=>newWork('t1');$('#fullTask2').onclick=()=>newWork('t2','independent');$('#fullTask1').onclick=()=>newWork('t1','independent');$('#fullMock').onclick=startMock;
    $('#btnMock').onclick=startMock;
    const modelSection=$('#mbSearch')?.closest('.card');if(modelSection){const fold=document.createElement('details');fold.id='modelBankFold';fold.innerHTML='<summary>范文与教学资料（按需查看）</summary>';modelSection.before(fold);fold.append(modelSection);}
    $('#essayInput').addEventListener('input',()=>UI.save('checkDraft',persistCheck,null));
    $('#checkQuestion').addEventListener('input',()=>{stopRequests();persistCheck();checkMounted();});
    const oldToCheck=$('#btnToCheck').onclick;$('#btnToCheck').onclick=()=>{oldToCheck();if($('#view-check').classList.contains('active'))checkMounted();};
    const rule=$('#btnCheck').onclick;$('#btnCheck').onclick=()=>{if(persistCheck())rule();};
    document.addEventListener('click',e=>{if(e.target.closest('[data-panel]')&&TaskFlow.writingMeta.practice==='independent')markHelp(writing(),'教学面板');});
    window.addEventListener('storage',e=>{if(e.key?.startsWith('iwc_work_'))UI.notice('其他标签页更新了作品。当前输入保留，下一次保存会同时保留双方版本。');});
    window.addEventListener('beforeunload',e=>{const ok=UI.flush()&&(!$('#view-write').classList.contains('active')||saveWritingDraft(true));if(!ok){e.preventDefault();e.returnValue='';}});
    editorMounted();checkMounted();
  }
  return {init,view,home,editorMounted,checkMounted,annotate,checkRevision,help,next,newWork,open,markHelp,diff};
})();
