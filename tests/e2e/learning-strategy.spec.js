const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const rewrite='Reliable public transport can reduce traffic congestion because one bus carries people who would otherwise drive separate cars. When services are frequent and predictable, commuters can leave their cars at home. This reduces demand for road space during rush hour.';
const transfer='Schools can reduce food waste by allowing pupils to choose smaller portions. Children who are not hungry can take less food while those who need more can return for another serving. This reduces the amount of untouched food thrown away after lunch.';
test.beforeEach(async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('iwc_onboarded','true'));
  await page.route('https://**/*',route=>route.abort());
  await page.goto('/');
});
async function seed(page,mode='t2'){
  await page.evaluate(mode=>{
    Learning.capture({mode,question:'Original question',essay:'Original essay'},null,{priorityFixes:[mode==='t1'?'写清总体特征':'解释观点并用具体内容支撑']});renderHome();
  },mode);
  await page.click('#learnNext');
}
async function selfCheck(page,text){
  await page.fill('#learningDraft',text);
  await page.click('#learningCompare');
  await page.fill('#learningQuote',text.split(' ').slice(0,8).join(' '));
  await page.fill('#learningEvidence','This sentence explains how the action leads to a specific result.');
  for(const c of await page.locator('[data-learning-check]').all())await c.check();
}
async function due(page){
  await page.evaluate(()=>{const s=Learning.read();s.items[0].due=Date.now()-1;Store.set('learning',s);renderHome();});
  await page.click('#learnNext');
}
test('证据和标准缺失时阻止通过；保存自查草稿，独立换题后留存完整证据',async({page})=>{
  await seed(page);await page.fill('#learningDraft',rewrite);await page.click('#learningCompare');
  await page.fill('#learningEvidence','I explained the reason.');await page.click('#learningPass');
  await expect(page.locator('#learningError')).toContainText('证据原句');
  await page.fill('#learningQuote','Reliable public transport can reduce traffic congestion');await page.click('#learningPass');
  await expect(page.locator('#learningError')).toContainText('逐项');
  await selfCheck(page,rewrite);
  await page.reload();await page.click('#learnNext');await page.click('#learningCompare');
  await expect(page.locator('#learningQuote')).toHaveValue(rewrite.split(' ').slice(0,8).join(' '));
  await expect(page.locator('[data-learning-check]:checked')).toHaveCount(3);
  await page.click('#learningPass');await due(page);await selfCheck(page,transfer);await page.click('#learningPass');
  const item=await page.evaluate(()=>Learning.read().items[0]);
  expect(item.passes).toBe(1);expect(item.attempts[1].independent).toBe(true);expect(item.attempts[1].criteria).toHaveLength(3);
  await page.click('#viewLearningHistory');
  await expect(page.locator('#dashBoard')).toContainText('独立复测 1 次，其中自查通过 1 次');
  await expect(page.locator('#errBanner')).toBeHidden();
});
test('先看提示会跨刷新保留辅助状态，次日换题，不能刷独立通过次数',async({page})=>{
  await seed(page);await selfCheck(page,rewrite);await page.click('#learningPass');await due(page);
  const first=await page.evaluate(()=>Learning.read().items[0].transferQuestion.question);
  await page.locator('#learningHint summary').click();
  expect(await page.evaluate(()=>Learning.read().items[0].attemptAssisted)).toBe(true);
  await page.reload();await page.click('#learnNext');
  await expect(page.locator('#learningAssisted')).toBeChecked();
  await selfCheck(page,transfer);await page.click('#learningPass');
  await expect(page.locator('#learningHome')).toContainText('本次不增加独立通过次数');
  const item=await page.evaluate(()=>Learning.read().items[0]);
  expect(item.passes).toBe(0);expect(item.attempts[1].independent).toBe(false);
  expect(item.due-Date.now()).toBeGreaterThan(23*3600000);
  await due(page);
  expect(await page.evaluate(()=>Learning.read().items[0].transferQuestion.question)).not.toBe(first);
});
test('独立提交后查看反馈保留原表现，之后改写则需要重新检验',async({page})=>{
  await seed(page);await selfCheck(page,rewrite);await page.click('#learningPass');await due(page);
  await selfCheck(page,transfer);await page.locator('#learningHint summary').click();await page.click('#learningPass');
  expect(await page.evaluate(()=>Learning.read().items[0].passes)).toBe(1);
  await due(page);await selfCheck(page,transfer+' This approach needs careful preparation.');
  await page.locator('#learningHint summary').click();
  await page.fill('#learningDraft',transfer+' This approach needs careful preparation and regular review.');
  await expect(page.locator('#learningCheck')).toBeHidden();
  await page.click('#learningCompare');
  await page.fill('#learningQuote','Schools can reduce food waste');await page.fill('#learningEvidence','explains why');
  for(const c of await page.locator('[data-learning-check]').all())await c.check();
  await page.click('#learningPass');
  expect(await page.evaluate(()=>Learning.read().items[0].passes)).toBe(0);
});
test('外部帮助标记与保存失败均有真实状态，完整度练习要求整篇',async({page})=>{
  await seed(page);await page.locator('summary').filter({hasText:'调整练习类型'}).click();await page.selectOption('#learningSkill','completion');
  await page.fill('#learningDraft',rewrite);await page.click('#learningCompare');await expect(page.locator('#learningError')).toContainText('250');
  await page.locator('summary').filter({hasText:'调整练习类型'}).click();await page.selectOption('#learningSkill','development');
  await selfCheck(page,rewrite);await page.click('#learningPass');await due(page);
  await selfCheck(page,transfer);await page.check('#learningAssisted');await page.click('#learningPass');
  expect(await page.evaluate(()=>Learning.read().items[0].attempts.at(-1).independent)).toBe(false);
  await due(page);
  await page.evaluate(()=>{window.savedSet=Store.set;Store.set=()=>false;});
  await page.fill('#learningDraft',rewrite);await page.click('#learningCompare');
  await expect(page.locator('#learningError')).toContainText('保存失败');
  await expect(page.locator('#learningDraft')).toHaveValue(rewrite);
  await page.evaluate(()=>Store.set=window.savedSet);
});
test('Task 1 复测附图，明暗主题与桌面窄屏表单可操作',async({page})=>{
  await seed(page,'t1');await selfCheck(page,rewrite);await page.click('#learningPass');await due(page);
  await expect(page.locator('#learningPractice .chart-panel')).not.toHaveCount(0);
  for(const img of await page.locator('#learningPractice .chart-panel img').all()) {
    await expect.poll(()=>img.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
  }
  await selfCheck(page,transfer);
  for(const [width,dark] of [[1280,false],[1440,true],[1600,false]]){
    await page.setViewportSize({width,height:1000});
    await page.evaluate(dark=>document.body.classList.toggle('dark',dark),dark);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('#learningTitle').scrollIntoViewIfNeeded();
    await page.screenshot({path:`.impeccable/review/learning-strategy-${width}${dark?'-dark':''}.png`,animations:'disabled'});
  }
  await expect(page.locator('#errBanner')).toBeHidden();
});
test('短练习三次通过后安排整篇验证，计时与原稿跨刷新恢复',async({page})=>{
  await seed(page);await selfCheck(page,rewrite);await page.click('#learningPass');
  for(let n=1;n<=3;n++){
    await due(page);await selfCheck(page,transfer+` Teachers can review this arrangement every ${['week','month','term'][n-1]} to ensure that children receive enough food.`);await page.click('#learningPass');
  }
  await expect(page.locator('#learningHome')).toContainText('明天安排一份完整新题答卷');
  expect(await page.evaluate(()=>Learning.read().items[0].status)).toBe('benchmark');
  await due(page);await expect(page.locator('#learningTitle')).toContainText('完整答卷验证');
  await page.click('#learningTimerStart');
  await expect(page.locator('#learningTimerStatus')).toContainText('剩余');
  await page.fill('#learningDraft',rewrite);await page.click('#learningCompare');
  await expect(page.locator('#learningPass')).toBeDisabled();
  await page.reload();await page.click('#learnNext');
  await expect(page.locator('#learningDraft')).toHaveValue(rewrite);
  await expect(page.locator('#learningTimerStart')).toBeDisabled();
  const full=Array.from({length:7},(_,n)=>n%2?rewrite:transfer).join('\n\n');
  await selfCheck(page,full);await page.click('#learningPass');
  const item=await page.evaluate(()=>Learning.read().items[0]);
  expect(item.status).toBe('consolidated');expect(item.attempts.at(-1).stage).toBe('benchmark');
  expect(item.attempts.at(-1).timed).toBe(true);expect(item.attempts.at(-1).independent).toBe(true);
  await page.click('#viewLearningHistory');await expect(page.locator('#dashBoard')).toContainText('整篇验证 1 次，其中独立自查通过 1 次');
});
test('讲解提供对比与原因，反复失败缩小任务，允许保留不完整尝试',async({page})=>{
  await seed(page);await page.locator('#learningHint summary').click();
  await expect(page.locator('.learning-lesson')).toContainText('为什么会减少拥堵');
  await expect(page.locator('.learning-lesson')).toContainText('Reliable bus services');
  await page.locator('#learningHint').screenshot({path:'.impeccable/review/learning-lesson.png',animations:'disabled'});
  for(let n=0;n<2;n++){
    await page.fill('#learningDraft','I need to explain this idea more clearly.');await page.click('#learningCompare');
    await expect(page.locator('#learningPass')).toBeDisabled();
    await page.click('#learningRetry');await page.click('#learnNext');
  }
  await expect(page.locator('#learningPractice')).toContainText('这次缩小任务');
  await expect(page.locator('#learningPractice')).toContainText('先只写两三句');
  await page.fill('#learningDraft',rewrite);await page.click('#learningCompare');
  await page.evaluate(()=>{const el=document.getElementById('learningDraft');el.setSelectionRange(0,el.value.indexOf('.'));});
  await page.click('#learningUseQuote');
  for(const c of await page.locator('[data-learning-check]').all())await c.check();
  await page.click('#learningPass');
  expect(await page.evaluate(()=>Learning.read().items[0].status)).toBe('transfer');
});
test('个人诊断直接形成具体练习，保留原句和成功标准',async({page})=>{
  await page.evaluate(essay=>{
    Learning.capture({mode:'t2',question:'Public transport question',essay},null,{learningTarget:{
      skill:'development',problem:'行为变化解释不够具体',quote:'Reliable public transport can reduce traffic congestion',
      why:'需要让读者知道可靠班次怎样影响通勤选择。',instruction:'补两句，解释可靠班次如何影响人们是否开车。',
      checks:['回答了原题','解释了通勤选择','结果与行为改变相连']
    }});renderHome();
  },rewrite);
  await page.click('#learnNext');
  await expect(page.locator('#learningPractice')).toContainText('补两句，解释可靠班次');
  await expect(page.locator('#learningPractice')).toContainText('需要让读者知道');
  await page.fill('#learningDraft',transfer);await page.click('#learningCompare');
  await expect(page.locator('.learning-criteria')).toContainText('解释了通勤选择');
});
test('导出报告包含练习证据，Task 分别汇总且排除规则分数',async({page})=>{
  await seed(page);await selfCheck(page,rewrite);await page.click('#learningPass');
  await page.evaluate(()=>Store.set('records',[
    {ai:true,mode:'t1',overall:5,date:Date.now(),scores:{TA:5,CC:5,LR:5,GRA:5}},
    {ai:true,mode:'t2',overall:7,date:Date.now(),scores:{TR:7,CC:7,LR:7,GRA:7}},
    {mode:'t2',overall:1,date:Date.now(),scores:{TR:1}}
  ]));
  await page.click('#viewLearningHistory');
  const downloadPromise=page.waitForEvent('download');await page.click('#btnExportProgress');
  const file=await (await downloadPromise).path();const html=fs.readFileSync(file,'utf8');
  expect(html).toContain('Task 1 AI 参考均值：5.0');expect(html).toContain('Task 2 AI 参考均值：7.0');
  expect(html).toContain(rewrite);expect(html).toContain('证据：');expect(html).not.toContain('平均预估分');
  await page.evaluate(()=>Store.set('records',[]));
  await page.click('#mainNav [data-view="train"]');await page.click('#mainNav [data-view="progress"]');
  await expect(page.locator('#btnExportProgress')).toBeVisible();
});
test('保存失败时保留当前改写，选题保存失败有提示并可恢复',async({page})=>{
  await seed(page);await selfCheck(page,rewrite);await page.click('#learningPass');
  await page.evaluate(()=>{const s=Learning.read();s.items[0].due=Date.now()-1;Store.set('learning',s);window.savedSet=Store.set;Store.set=()=>false;renderHome();});
  await page.click('#learnNext');await expect(page.locator('#uiNotices')).toContainText('保存失败');
  await expect(page.locator('#errBanner')).toBeHidden();
  await page.evaluate(()=>Store.set=window.savedSet);await page.click('#learnNext');
  await page.fill('#learningDraft',transfer);
  await page.evaluate(()=>Store.set=()=>false);
  await page.click('#learningBack');
  await expect(page.locator('#learningDraft')).toHaveValue(transfer);
  await expect(page.locator('#learningSaveStatus')).toContainText('保存失败');
  await page.evaluate(()=>Store.set=window.savedSet);await page.click('#learningBack');
  await page.click('#learnNext');await expect(page.locator('#learningDraft')).toHaveValue(transfer);
});

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('iwc_trainPickerOpen','true'));});
