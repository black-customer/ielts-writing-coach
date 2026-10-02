const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function env(files = ['store', 'learning']) {
  const data = new Map();
  const c = vm.createContext({ console, localStorage: { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) }, IWC_CONFIG: {} });
  for (const file of files) vm.runInContext(fs.readFileSync(`tool/js/${file}.js`, 'utf8'), c);
  return { c, run: code => vm.runInContext(code, c) };
}
const draft = 'Public transport can reduce traffic congestion because a train carries many passengers who would otherwise drive alone. For example, a reliable rail service allows commuters to leave their cars at home, which reduces demand for road space during the busiest hours.';
const context = { essay: 'original essay', question: 'old question', mode: 't2', qtype: 'opinion' };
const issue = { issues: [{ sev: 'ok', crit: 'LR', msg: 'fine' }, { sev: 'warn', crit: 'CC', msg: 'linking' }, { sev: 'bad', crit: 'TR', msg: 'support your idea' }] };
function setup() {
  const e = env(); Object.assign(e.c, { context, issue, draft });
  e.run('var item = Learning.capture(context, issue, null, 1000)');
  e.run('var valid = {quote:"Public transport can reduce traffic congestion",checks:[true,true,true]};');
  return e;
}
test('诊断立即形成任务；去重不清除改写草稿', () => {
  const { run } = setup();
  assert.equal(run('Learning.next(1000).focus.title'), 'support your idea');
  run('Learning.update(item.id, i => i.draft = "saved"); Learning.capture(context, issue, null, 2000)');
  assert.equal(run('Learning.read().items.length'), 1);
  assert.equal(run('Learning.read().items[0].draft'), 'saved');
});
test('AI 后到时只升级未开始的任务，不改掉正在练的目标', () => {
  const { run } = setup();
  run('Learning.capture(context, issue, {priorityFixes:["AI focus"]}, 2000)');
  assert.equal(run('Learning.read().items[0].focus.title'), 'AI focus');
  run('Learning.update(item.id, i => i.draft = "working"); Learning.capture(context, issue, {priorityFixes:["different"]}, 3000)');
  assert.equal(run('Learning.read().items[0].focus.title'), 'AI focus');
});
test('改写必须实际作答并写出自查证据；通过后隔 24 小时换题', () => {
  const { run } = setup();
  assert.throws(() => run('Learning.saveAttempt(item.id, {text:"too short",passed:true,note:"ok"},1000)'), /至少/);
  assert.throws(() => run('Learning.saveAttempt(item.id, {text:draft,passed:true,note:""},1000)'), /证据/);
  run('Learning.saveAttempt(item.id, {...valid,text:draft,passed:true,note:"explains the mechanism"},1000)');
  assert.equal(run('Learning.next(1001)'), null);
  assert.equal(run('Learning.next(86401000).status'), 'transfer');
  assert.throws(() => run('Learning.saveAttempt(item.id, {text:draft,question:"new question",passed:true,note:"ok"},2000)'), /未到/);
});
test('到期复测优先于新改写，成功复测逐步间隔，失败重新安排', () => {
  const { run } = setup();
  run('Learning.saveAttempt(item.id, {...valid,text:draft,passed:true,note:"evidence"},1000); Learning.capture({...context,essay:"another"},issue,null,2000)');
  assert.equal(run('Learning.next(86401000).id === item.id'), true);
  run('var newDraft = draft + " Reliable connections also help residents in rural areas reach nearby cities."; Learning.prepareReview(item.id,newDraft);Learning.saveAttempt(item.id, {...valid,text:newDraft,question:"new question",passed:true,note:"evidence"},86401000)');
  assert.equal(run('Learning.read().items.find(i => i.id === item.id).due'), 86401000 + 3 * 86400000);
  run('Learning.saveAttempt(item.id, {text:draft,question:"another question",passed:false},345601000)');
  assert.equal(run('Learning.read().items.find(i => i.id === item.id).passes'), 0);
  assert.equal(run('Learning.read().items.find(i => i.id === item.id).due'), 345601000 + 86400000);
});
test('迁移选题保持 Task 和题型，排除原题及通过的题；题池空时不回用原题', () => {
  const { run, c } = setup();
  c.pool = [{task:1,question:'chart',qtype:'opinion'}, {task:2,question:'old question',qtype:'opinion'}, {task:2,question:'different type',qtype:'discussion'}, {task:2,question:'new opinion',qtype:'opinion'}];
  assert.equal(run('Learning.selectQuestion(item,pool).question'), 'new opinion');
  assert.equal(run('Learning.selectQuestion(item,pool.slice(0,2))'), null);
});
test('相同作文重复保存不会增加分数样本，不影响旧记录', () => {
  const { run } = env();
  run('Store.addRecord({title:"legacy"}); Store.addRecord({essay:"A",question:"Q",ai:true,mode:"t2"}); Store.addRecord({essay:"A",question:"Q",ai:true,mode:"t2"})');
  assert.equal(run('Store.get("records", []).length'), 2);
});
test('导师四个阶段逐一取对学生段落和范文段落，包括最后一段', async () => {
  const { c, run } = env(['store']);
  let request;
  c.AI = { streamChat: async m => { request = m[1].content; return '{}'; }, extractJSON: JSON.parse };
  c.Analyzer = { PLAYBOOK: { opinion: { name: 'opinion', paragraphs: [], choose: '' } }, topicsOfText: () => [] };
  run(fs.readFileSync('tool/js/tutor.js', 'utf8'));
  c.session = { task:2, qtype:'opinion', question:'Q', stage:2, paraTexts:['STUDENT0','STUDENT1','STUDENT2','STUDENT3'], model:{essay:'MODEL0\n\nMODEL1\n\nMODEL2\n\nMODEL3',paraNotes:[]} };
  for (let stage = 2; stage <= 5; stage++) {
    await run(`Tutor.paraFeedback(session,${stage})`);
    assert.match(request, new RegExp(`STUDENT${stage - 2}`));
    assert.match(request, new RegExp(`MODEL${stage - 2}`));
    await run(`Tutor.paraTeach(session,${stage})`);
    assert.match(request, new RegExp(`MODEL${stage - 2}`));
  }
});
test('AI Task 1 保留 TA，四项缺失或越界不能进入分数统计', async () => {
  const { c, run } = env(['store','ai']);
  let result = { scores:{TA:6,CC:7,LR:6.5,GRA:6.5},overall:99 };
  c.fetch = async () => ({ok:true,json:async()=>({choices:[{message:{content:JSON.stringify(result)}}]})});
  run('Store.set("ai", {baseUrl:"https://example.invalid"})');
  const r = await run('AI.review({essay:"test",mode:"t1"})');
  assert.equal(r.scores.TA, 6); assert.equal(r.scores.TR, undefined); assert.equal(r.overall, 6.5);
  result = {scores:{TA:6,CC:7,LR:10,GRA:6}};
  await assert.rejects(run('AI.review({essay:"test",mode:"t1"})'), /不完整或超出/);
});
test('范文匹配使用每篇范文自身题干，不再总是返回第一篇', () => {
  const {c,run}=env(['store','training']);
  c.EssayCorpus=[{q:'zebras wildlife conservation national parks',essay:'WRONG'}, {q:'railway commuters traffic congestion',essay:'RIGHT'}];
  assert.equal(run('findRealEssay("railway commuters traffic congestion").essay'),'RIGHT');
  assert.equal(run('findRealEssay("digital libraries newspaper subscriptions")'),null);
});
test('未提供图表数据时不生成带虚构数字的小作文范文', async () => {
  const {run}=env(['store','tutor']);
  await assert.rejects(run('Tutor.modelEssay({task:1})'),/未接收原图数据/);
});
