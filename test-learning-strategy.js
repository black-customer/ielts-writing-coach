const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const DAY = 86400000;
const texts = [
  'Reliable public transport can reduce traffic congestion because one bus carries people who would otherwise drive separate cars. When services run frequently and arrive on time, commuters can leave their cars at home. This reduces demand for road space during rush hour.',
  'Schools can reduce food waste by allowing pupils to choose smaller portions. Children who are not hungry can take less food while those who need more can return for another serving. This approach reduces the amount of untouched food thrown away after lunch.',
  'Working from home allows some employees to use their time more effectively. Without a long journey to the office, parents can take their children to school before starting work. However, clear working hours are still needed to prevent work from taking over family life.',
  'Public libraries provide access to information for people who cannot afford to buy books. A student can borrow several reference works without spending money needed for food or travel. This makes independent study more accessible to residents with limited incomes.'
];
function env() {
  const data = new Map();
  const c = vm.createContext({console, localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}});
  for(const name of ['store','learning-lessons','learning','checker']) vm.runInContext(fs.readFileSync(`tool/js/${name}.js`,'utf8'),c);
  const L=vm.runInContext('Learning',c),S=vm.runInContext('Store',c);
  const item=L.capture({mode:'t2',question:'original question',essay:'original draft'}, {issues:[{sev:'bad',crit:'TR',msg:'观点缺乏解释和支撑'}]},null,1000);
  const submit=(index, now, extra={})=>L.saveAttempt(item.id,{text:texts[index],question:`new question ${index}`,passed:true,note:'This explains the mechanism using a concrete situation.',quote:texts[index].split(' ').slice(0,8).join(' '),checks:[true,true,true],...extra},now);
  return {L,S,c,item,submit,current:()=>L.read().items.find(i=>i.id===item.id)};
}
test('成功自查需要原文证据和逐项标准；失败也可保存',()=>{
  const {submit,current}=env();
  assert.throws(()=>submit(0,1000,{quote:'A sentence that does not occur here'}),/证据原句/);
  assert.throws(()=>submit(0,1000,{checks:[true,false,true]}),/逐项/);
  submit(0,1000,{passed:false,quote:'',checks:[]});
  assert.equal(current().status,'repair');assert.equal(current().draft,texts[0]);
});
test('三次不同题独立通过后必须验证整篇，拒绝旧文换题',()=>{
  const {L,item,submit,current}=env();submit(0,1000);
  assert.throws(()=>submit(0,1000+DAY),/已有作答相同/);
  let now=1000+DAY;
  for(let n=1;n<=3;n++){
    L.prepareReview(item.id,texts[n]);submit(n,now);
    assert.equal(current().passes,n);
    now=current().due;
  }
  assert.equal(current().status,'benchmark');
  assert.equal(L.drill(current()).min,250);
  assert.throws(()=>submit(3,now),/250/);
  const full=Array.from({length:7},(_,n)=>texts[n%4]).join(' ');
  L.prepareReview(item.id,full);
  submit(3,now,{text:full,question:'full new question',checks:[true,true,true,true]});
  assert.equal(current().status,'consolidated');
  assert.equal(L.stats(now).benchmarkPassed,1);
  assert.throws(()=>submit(3,now),/已完成/);
});
test('先看提示会记为辅助练习，不增加通过数，次日换题',()=>{
  const {L,item,submit,current}=env();submit(0,1000);
  L.update(item.id,i=>i.transferQuestion={question:'new question 1'});
  L.markAssisted(item.id);L.prepareReview(item.id,texts[1]);submit(1,1000+DAY);
  assert.equal(current().passes,0);assert.equal(current().due,1000+2*DAY);
  assert.equal(current().transferQuestion,null);
  assert.equal(current().attempts.at(-1).independent,false);
});
test('提交独立快照后查看反馈不抹掉原表现；修改后必须重新提交',()=>{
  const {L,item,submit,current}=env();submit(0,1000);
  L.prepareReview(item.id,texts[1]);L.markAssisted(item.id);submit(1,1000+DAY);
  assert.equal(current().passes,1);
  L.prepareReview(item.id,texts[2]);L.markAssisted(item.id);
  submit(2,current().due,{text:texts[2]+' This requires careful planning.'});
  assert.equal(current().passes,0);
  assert.equal(current().attempts.at(-1).independent,false);
});
test('外部帮助和无快照作答不能冒充独立通过；旧记录保留为未知',()=>{
  const {L,item,submit,current}=env();submit(0,1000);
  L.update(item.id,i=>{i.passes=2;i.attempts.push({stage:'transfer',passed:true,text:'legacy',date:1000});});
  L.prepareReview(item.id,texts[1]);submit(1,1000+DAY,{assisted:true});
  assert.equal(current().passes,0);
  assert.equal(L.stats(1000+DAY).unknown,1);
  assert.equal(L.stats(1000+DAY).assisted,1);
});
test('复测到期优先，其后优先未完成草稿、反复问题和较早任务',()=>{
  const {L,item}=env();
  const newer=L.capture({mode:'t2',question:'other',essay:'another'},null,{priorityFixes:['修正语法错误']},2000);
  L.capture({mode:'t2',question:'third',essay:'third'},null,{priorityFixes:['语法时态错误']},3000);
  assert.equal(L.next(4000).id,newer.id);
  assert.match(L.rationale(newer,4000),/2 份/);
  L.update(item.id,i=>i.draft='in progress');
  assert.equal(L.next(4000).id,item.id);
  L.update(newer.id,i=>{i.status='transfer';i.due=3500;});
  assert.equal(L.next(4000).id,newer.id);
});
test('完整度问题必须写整篇；可调整错误分类而保留原反馈和草稿',()=>{
  const {L,item,submit,current}=env();
  L.update(item.id,i=>{i.focus.title='字数只有 80 词';i.draft='saved';});
  assert.equal(L.drill(current()).min,250);
  assert.throws(()=>submit(0,1000),/250/);
  L.changeSkill(item.id,'grammar');
  assert.equal(L.drill(current()).id,'grammar');assert.equal(current().draft,'saved');
  assert.equal(current().focus.title,'字数只有 80 词');
  assert.throws(()=>L.changeSkill(item.id,'overview'),/不适用/);
  assert.throws(()=>L.changeSkill(item.id,'constructor'),/不适用/);
});
test('技能跟随实际反馈，而非机械采用最低分项',()=>{
  const {L}=env();
  const item=L.capture({mode:'t2',question:'another',essay:'another'},null,{scores:{TR:5,CC:6,LR:6,GRA:6},priorityFixes:['修正主谓一致的语法错误']});
  assert.equal(L.drill(item).id,'grammar');
});
test('迁移排除其他作答与训练草稿，Task 1 排除缺图题',()=>{
  const {L,S,item,c}=env();
  L.capture({mode:'t2',question:'seen',essay:'seen'},null,null,2000);
  S.set('train_B T2',{paras:['text']});
  const pool=[{task:2,question:'seen',src:'A'},{task:2,question:'draft',src:'B'},{task:2,question:'unseen',src:'C'}];
  assert.equal(L.selectQuestion(item,pool).question,'unseen');
  c.T1Charts={hasImg:src=>src==='with-chart'};
  assert.equal(L.selectQuestion({...item,mode:'t1'},[{task:1,question:'missing',src:'none'},{task:1,question:'shown',src:'with-chart'}]).question,'shown');
});
test('外部复核材料包含原题原稿新题新稿，不拿片段估 Band',()=>{
  const {L,item,submit}=env();submit(0,1000);
  const packet=L.reviewPacket(item.id);
  assert.match(packet,/original question/);assert.match(packet,/original draft/);
  assert.ok(packet.includes(texts[0]));assert.match(packet,/不给整篇 Band/);
});
test('保存失败不能让练习升级或丢失原有记录',()=>{
  const {L,S,submit,current}=env();const set=S.set;S.set=()=>false;
  assert.throws(()=>submit(0,1000),/保存失败/);S.set=set;
  assert.equal(current().status,'repair');assert.equal(current().attempts.length,0);
});
test('模板信号不能判定内容缺失或限制分数',()=>{
  const {c}=env();
  const checker=vm.runInContext('Checker',c);
  const r=checker.check(texts[0], 'opinion','Question');
  const example=r.issues.find(i=>/举例标记/.test(i.msg));
  assert.ok(example);assert.equal(example.noscore,true);assert.notEqual(example.sev,'bad');
  const t1=checker.checkT1('The main changes occurred in the north. A road was extended and several homes were built.\n\nThe southern area remained unchanged.', 'maps','A map');
  assert.ok(t1.issues.every(i=>!/固定 4 段|上不了 6|固定写两句/.test(i.msg)));
});
test('反复失败时缩小练习；未完成尝试和空说明都可保存',()=>{
  const {L,item,submit,current}=env();
  submit(0,1000,{passed:false});submit(0,2000,{passed:false});
  const drill=L.drill(current());
  assert.equal(drill.scaffold,true);assert.equal(drill.min,20);
  assert.ok(drill.lesson.weak);assert.ok(drill.lesson.stronger);assert.ok(drill.lesson.why);
  assert.match(drill.task,/两三句/);
  submit(0,3000,{text:'A short but unfinished attempt.',passed:false,quote:'',checks:[],note:''});
  assert.equal(current().draft,'A short but unfinished attempt.');
  submit(0,4000,{note:''});assert.equal(current().status,'transfer');
});
test('整篇失败回到针对性复测，Task 1 需要 150 词并保留计时',()=>{
  const {L,item,current}=env();
  L.update(item.id,i=>{i.mode='t1';i.status='benchmark';i.due=1000;i.practiceTimer={startedAt:1000,duration:20*60000};});
  assert.equal(L.drill(current()).min,150);
  L.prepareReview(item.id,texts[0]);
  L.update(item.id,i=>i.reviewSnapshot.date=22*60000);
  L.saveAttempt(item.id,{text:texts[0],question:'another chart',passed:false},22*60000);
  assert.equal(current().status,'transfer');assert.equal(current().passes,0);
  assert.equal(current().attempts.at(-1).timed,true);
  assert.equal(current().attempts.at(-1).elapsedMs,22*60000-1000);
  assert.equal(current().practiceTimer,null);
});
test('同一作答重复核验不会重置独立快照或把复盘时间加进写作时间',()=>{
  const {L,item,submit,current}=env();submit(0,1000);
  L.prepareReview(item.id,texts[1]);
  const original=current().reviewSnapshot.date;
  L.markAssisted(item.id);L.prepareReview(item.id,texts[1]);
  assert.equal(current().reviewSnapshot.date,original);assert.equal(current().reviewSnapshot.assisted,false);
});
test('缺少举例或固定段数的模板提醒不自动成为训练目标',()=>{
  const {L}=env();
  const item=L.capture({essay:'another draft',question:'another question',mode:'t2'},{issues:[{sev:'warn',crit:'TR',msg:'未匹配到举例标记词',noscore:true}]});
  assert.equal(item.focus.source,'主动自查任务');
});
test('AI 具体目标必须引用当前原稿，检查标准随目标保存；用户选择不被后到 AI 覆盖',()=>{
  const {L}=env();
  const context={essay:texts[0],question:'actual question',mode:'t2'};
  const target={skill:'development',problem:'解释机制不够清楚',quote:'Reliable public transport can reduce traffic congestion',why:'需要解释人们为什么改变选择',instruction:'补两句行为变化的解释',checks:['内容回应原题','解释了行为变化','结果与解释一致']};
  const item=L.capture(context,null,{learningTarget:target,priorityFixes:['fallback']},1000);
  assert.equal(item.focus.structured,true);assert.equal(L.drill(item).task,target.instruction);
  assert.deepEqual([...L.drill(item).checks],target.checks);
  L.changeSkill(item.id,'grammar');L.capture(context,null,{learningTarget:target},2000);
  assert.equal(L.read().items[0].focus.skillId,'grammar');
  const ungrounded=L.capture({...context,essay:'different original'},null,{learningTarget:target,priorityFixes:['fallback']},3000);
  assert.equal(ungrounded.focus.title,'fallback');assert.equal(ungrounded.focus.structured,undefined);
});
