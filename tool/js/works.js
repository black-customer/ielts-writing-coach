/* Versioned, local-only writing records. Legacy iwc_ data is never removed. */
const Works = (() => {
  const cache = new Map(), bases = new Map(),working = new Map();
  const id = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  const clone = x => JSON.parse(JSON.stringify(x));
  const stamp = () => Date.now();
  const safeContext = c => Object.fromEntries(['mode','question','qKey','chartKey','qtype','chart','chartNotes','practice','reminder','mockGroup'].map(k=>[k,c?.[k]??'']));
  function keys() { return Object.keys(localStorage).filter(k=>k.startsWith('iwc_work_')).map(k=>k.slice(4)); }
  function invalidate(){cache.clear();bases.clear();working.clear();}
  function get(workId) {
    if(!workId)return null;
    if(cache.has(workId))return cache.get(workId);
    const w=Store.get('work_'+workId,null);
    if(w?.id===workId&&Array.isArray(w.versions)&&Array.isArray(w.feedback)&&Array.isArray(w.checks)&&Array.isArray(w.conversations)){cache.set(w.id,w);bases.set(w.id,w.rev||0);return w;}return null;
  }
  function all() {
    const ids=new Set([...keys().map(k=>k.slice(5)),...cache.keys()]);
    return [...ids].map(get).filter(Boolean).sort((a,b)=>b.updatedAt-a.updatedAt);
  }
  function save(w) {
    const remote=Store.get('work_'+w.id,null);
    if(remote && remote.rev!==(bases.get(w.id)||0)) {
      for(const key of ['versions','feedback','conversations','checks']) {
        const byId=new Map((remote[key]||[]).map(x=>[x.id,x]));
        for(const x of w[key]||[]) {
          const old=byId.get(x.id);
          if(key==='conversations'&&old) {
            const messages=new Map((old.messages||[]).map(m=>[m.id,m]));
            (x.messages||[]).forEach(m=>messages.set(m.id,m));
            byId.set(x.id,{...x,messages:[...messages.values()].sort((a,b)=>a.at-b.at)});
          } else byId.set(x.id,x);
        }
        w[key]=[...byId.values()];
      }
      w.conflict=true; // Both versions remain available; never replace an editor value.
      if(remote.note!==w.note)w.noteAlternatives=[...new Set([...(remote.noteAlternatives||[]),...(w.noteAlternatives||[]),remote.note||''])];
    }
    w.rev=Math.max(w.rev||0,remote?.rev||0)+1;
    cache.set(w.id,w);
    if(!Store.set('work_'+w.id,w))return false;
    bases.set(w.id,w.rev);return true;
  }
  function create(context={},text='',source='new',forcedId) {
    const w={id:forcedId||id(),schema:1,rev:0,context:safeContext(context),createdAt:stamp(),updatedAt:stamp(),versions:[],feedback:[],checks:[],conversations:[],note:'',resume:{view:'write'},source};
    cache.set(w.id,w);bases.set(w.id,0);
    addVersion(w,text,'draft');return w;
  }
  function version(w,versionId) {return w?.versions.find(v=>v.id===versionId);}
  function addVersion(w,text,kind='draft',parentId,coalesce=false) {
    const last=version(w,w.currentVersion);
    if(last && last.text===text && last.kind===kind && JSON.stringify(last.context)===JSON.stringify(w.context))return last;
    const pinned=last&&(w.feedback.some(f=>f.versionId===last.id)||w.conversations.some(c=>c.versionId===last.id)||Object.keys(w.revisions||{}).includes(last.id));
    // Autosave updates this tab's unsubmitted working copy. Feedback-bound and
    // imported versions stay immutable; concurrent remote copies merge in save().
    if(coalesce&&last&&working.get(w.id)===last.id&&!pinned&&last.kind===kind&&JSON.stringify(last.context)===JSON.stringify(w.context))w.versions=w.versions.filter(v=>v.id!==last.id);
    const v={id:id(),text:String(text??''),kind,parentId:parentId||null,context:clone(w.context),at:stamp()};
    w.versions.push(v);w.currentVersion=v.id;w.updatedAt=stamp();if(coalesce)working.set(w.id,v.id);return v;
  }
  function capture(context,text,kind='draft') {
    let w=get(context.workId);
    if(!w)w=create(context,text);
    w.context={...w.context,...safeContext(context)};
    const v=addVersion(w,text,kind,undefined,true);return {w,v,ok:save(w)};
  }
  function bind(context,text=context.essay||'',freeze=true) {
    const w=get(context.workId);
    const v=version(w,context.versionId);
    if(v && v.text===text && v.context.question===(context.question||'') && v.context.mode===context.mode){if(freeze)working.delete(w.id);return {...context};}
    const bound=capture(context,text);
    if(freeze)working.delete(bound.w.id);
    return {...context,workId:bound.w.id,versionId:bound.v.id};
  }
  function feedback(context,kind,result,activate=true) {
    const c=bind(context),w=get(c.workId);
    const clean=clone(result);delete clean.context;
    let f=w.feedback.find(f=>f.versionId===c.versionId&&f.kind===kind&&JSON.stringify(f.result)===JSON.stringify(clean));
    if(!f){f={id:id(),versionId:c.versionId,kind,result:clean,at:stamp()};w.feedback.push(f);}
    if(activate){w.resume={...w.resume,view:'check',feedbackId:f.id};w.updatedAt=stamp();}
    if(!save(w)&&typeof UI!=='undefined')UI.notice('评阅尚未保存，结果仍在当前页面。请重试或复制。',{error:true,action:()=>save(w)});
    return {...c,feedbackId:f.id};
  }
  function revision(context,text) {
    const w=get(context.workId);if(!w)return false;
    const v=addVersion(w,text,'revision',context.versionId,true);
    w.revisions=w.revisions||{};w.revisions[context.versionId]=v.id;
    w.resume={...w.resume,view:'check',feedbackId:context.feedbackId,comparing:true};return save(w);
  }
  function revisionText(context) {
    const w=get(context.workId),v=version(w,w?.revisions?.[context.versionId]);return v?{exists:true,text:v.text}:null;
  }
  function resume(workId,data) {const w=get(workId);if(!w)return true;w.resume={...w.resume,...data};return save(w);}
  function migrate() {
    const manifests=Store.get('worksImports',{}),done={...manifests};let ok=true;
    const imports=[];
    for(const mode of ['t1','t2','mock_t1','mock_t2']){const d=Store.getDraft(mode);if(d?.text||d?.question)imports.push({token:'draft:'+mode,c:{...d,mode:mode.endsWith('t1')?'t1':'t2',mockGroup:mode.startsWith('mock')?'legacy-mock':''},text:d.text||'',d,mode});}
    Store.get('draftHistory',[]).forEach((d,n)=>imports.push({token:'archive:'+n+':'+d.t,c:d,text:d.text||''}));
    Store.get('records',[]).forEach((d,n)=>imports.push({token:'record:'+n+':'+d.date,c:d,text:d.essay||'',record:d}));
    (Store.get('learning',{items:[]}).items||[]).forEach(d=>{imports.push({token:'learning:'+d.id,c:d,text:d.essay||'',learning:d});});
    const s=Store.get('trainSession',null);
    if(s?.paraTexts?.some(t=>t.trim()))imports.push({token:'session:'+s.qKey,c:{...s,mode:s.task===1?'t1':'t2'},text:s.paraTexts.join('\n\n')});
    for(const key of Object.keys(localStorage).filter(k=>/^iwc_(?:draft_)?train_/.test(k))) {
      const d=Store.get(key.slice(4),null);if(!Array.isArray(d?.paras)||!d.paras.some(t=>String(t).trim()))continue;
      const qKey=key.replace(/^iwc_(?:draft_)?train_/,''),q=typeof trainingPool==='function'?trainingPool().find(q=>tKey(q)===qKey):null;
      imports.push({token:key,c:{mode:/ T1$/.test(qKey)?'t1':'t2',qKey,question:q?.question||'',qtype:q?.qtype||'',practice:d.assisted?'assisted':'unknown'},text:d.paras.join('\n\n')});
    }
    for(const x of imports) {
      if(done[x.token]&&get(done[x.token])?.versions.some(v=>v.text===x.text))continue;
      let w=get(x.d?.workId)||all().find(w=>w.context.mode===x.c.mode&&w.context.question===(x.c.question||'')&&w.versions.some(v=>v.text===x.text));
      if(!w)w=create(x.c,x.text,'legacy');
      const v=w.versions.find(v=>v.text===x.text)||addVersion(w,x.text);
      if(x.record?.ai&&!w.feedback.some(f=>f.versionId===v.id&&f.kind==='legacy-ai'))w.feedback.push({id:id(),versionId:v.id,kind:'legacy-ai',result:clone(x.record),at:x.record.date||stamp()});
      const oldRevisions=Store.get('revisions',{}),rk=x.c.mode+'|'+(x.c.question||'')+'|'+x.text;
      if(Object.prototype.hasOwnProperty.call(oldRevisions,rk)&&!w.revisions?.[v.id]){const r=addVersion(w,oldRevisions[rk],'revision',v.id);w.revisions={...w.revisions,[v.id]:r.id};}
      if(x.learning){w.legacyLearning=x.learning;for(const a of x.learning.attempts||[]){const token=a.id||JSON.stringify(a);if(!w.versions.some(v=>v.legacyAttempt===token)){const av=addVersion(w,a.text||'','legacy-practice');av.legacyAttempt=token;av.context={...w.context,question:a.question||w.context.question};}}}
      if(!save(w)){ok=false;continue;}
      done[x.token]=w.id;
      if(x.d && !Store.saveDraft(x.mode,x.text,{...x.d,workId:w.id}))ok=false;
    }
    for(const [key,text] of Object.entries(Store.get('revisions',{}))){
      if(typeof text!=='string')continue;
      const token='orphan-revision:'+key;
      if(done[token]&&get(done[token]))continue;
      const linked=all().find(w=>w.versions.some(v=>v.context.mode+'|'+v.context.question+'|'+v.text===key));
      if(linked)continue;
      const w=create({mode:key.startsWith('t1|')?'t1':'t2',question:'历史改写（关联待确认）'},text,'legacy-revision');
      w.note='旧版关联信息（保留原始题目与原稿）：\n'+key;
      if(save(w))done[token]=w.id;else ok=false;
    }
    if(!Store.set('worksImports',done))ok=false;return ok;
  }
  function exposure(context,reason) {
    const list=Store.get('exposures',[]),key=context.qKey||((context.mode||'')+'|'+context.question);
    const old=list.find(x=>x.key===key);if(old){old.at=stamp();old.reason=reason;}else list.push({key,question:context.question||'',at:stamp(),reason});
    return Store.set('exposures',list);
  }
  function seen(q) {const key=q.qKey||q.src+' T'+q.task;return Store.get('exposures',[]).some(e=>e.key===key||e.question===q.question);}
  return {id,get,all,save,create,version,addVersion,capture,bind,feedback,revision,revisionText,resume,migrate,exposure,seen,safeContext,invalidate};
})();

const EssayContext = (() => {
  function chart(c) {
    if(c.mode!=='t1')return {status:'none',text:''};
    const key=c.chartKey,verified=typeof ChartEvidence!=='undefined'?ChartEvidence[key]:null;
    if(verified?.verified && verified.question===c.question)return {status:'verified',text:verified.description};
    if(c.chartNotes?.trim())return {status:'user',text:'用户补充的图表说明（未独立核验）：\n'+c.chartNotes.trim()};
    return {status:'missing',text:'未提供已核验图表数据。无法核验数字、单位、选点、主要特征及地图或流程关系；请另外附上原图。'};
  }
  function packet(c,{issue,revision,teacher=false}={}) {
    const parts=[`IELTS Writing ${c.mode==='t1'?'Task 1':'Task 2'}`,`题目：\n${c.question||'未提供，请先补充题目。'}`];
    if(c.mode==='t1')parts.push('图表上下文：\n'+chart(c).text);
    parts.push('学生原稿：\n'+(c.essay||''));
    if(issue)parts.push('本次想解决的问题：\n'+[issue.quote,issue.problem].filter(Boolean).join('\n'));
    if(revision!==undefined)parts.push('学生修改稿：\n'+revision);
    parts.push(teacher?'请独立评价作答与修改，指出有原文依据的问题；材料未提供既有评分。':revision!==undefined?'请针对上述问题比较原稿和修改稿，结合全文解释是否改善、证据和下一步。不必重新给全文评分。':'请依据题目找出最值得先处理的至多三个问题，用原文解释原因和可执行修改方向。先指导我自己修改，需要时再给示范。缺少材料时说明核验范围。');
    return parts.join('\n\n');
  }
  return {chart,packet};
})();
