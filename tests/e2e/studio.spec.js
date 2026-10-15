const {test,expect}=require('@playwright/test');
const essay='Reliable public transport can reduce traffic congestion because one bus carries many people. Frequent services give commuters an alternative to driving. This helps families reach work on time and reduces pressure on roads.\n\nGovernments should also ensure that services are accessible to people who live outside the city centre. Affordable fares can make a real difference to those who cannot afford a car. These residents would then have more employment opportunities and greater independence.';
const question='Should governments invest in public transport?';
const review={scores:{TR:6,CC:7,LR:7,GRA:7},summary:'解释需要具体一些',priorityFixes:['解释如何改变通勤选择'],sentenceIssues:[{quote:'an alternative to driving',problem:'解释为什么通勤者会选择公交',fix:'补充可靠性如何影响决定',kind:'需要核对'}],paragraphComments:[],rewrite:{improved:'A demonstration.'}};
async function writing(page){await page.goto('/');await page.click('#ownQuestion');await page.fill('#writeQuestionInput',question);await page.fill('#fullEssay',essay);await page.click('#btnToCheck');}
async function feedback(page){await page.evaluate(r=>{const context={...TaskFlow.checkMeta,mode:'t2',question:document.querySelector('#checkQuestion').value,essay:document.querySelector('#essayInput').value};lastAi={...r,mode:'t2',overall:7,context};lastAiContext=context;renderAiResult(lastAi);},review);}
test('continuous work: editing, own revision, empty revision, resume and external packet',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await writing(page);await feedback(page);
  await page.click('#aiResult .annotation-compare');await expect(page.locator('#aiResult .revision-input')).toHaveValue(essay);
  await page.fill('#aiResult .revision-input','');
  await page.click('#workspaceSaveExit');await page.click('#resumeWork');
  await expect(page.locator('#aiResult .revision-input')).toHaveValue('');
  await page.fill('#aiResult .revision-input',essay+'\n\nA reliable service makes it possible to plan a journey.');
  await page.click('#workspaceSaveExit');await page.reload();await page.click('#resumeWork');
  await expect(page.locator('#aiResult .revision-input')).toContainText('');
  expect(await page.locator('#aiResult .revision-input').inputValue()).toContain('A reliable service');
  const packet=await page.evaluate(()=>EssayContext.packet({...TaskFlow.checkMeta,essay:document.querySelector('#essayInput').value,question:document.querySelector('#checkQuestion').value,mode:'t2'}));
  expect(packet).toContain(question);expect(packet).toContain(essay);expect(errors).toEqual([]);
});
test('mocked contextual conversation and targeted review keep versions and never replace writing',async({page})=>{
  await writing(page);await feedback(page);
  await page.evaluate(()=>Store.set('ai',{apiKey:'test-only',baseUrl:'https://mock.invalid',model:'test'}));
  const calls=[];await page.route('https://mock.invalid/**',async route=>{const body=route.request().postDataJSON();calls.push(body);await route.fulfill({json:{choices:[{message:{content:body.response_format?JSON.stringify({status:'已改善',evidence:'修改稿说明了可靠性',next:'换题时独立尝试'}):'需要解释公交可靠性怎样影响选择。'}}]}});});
  await page.click('#aiResult .ask-feedback >> nth=0');await page.fill('.chat-input','为什么这里还不够？');await page.click('.chat-send');
  await expect(page.locator('.chat-messages')).toContainText('公交可靠性');expect(calls[0].response_format).toBeUndefined();expect(JSON.stringify(calls[0])).toContain(question);
  await page.click('#aiResult .annotation-compare');await page.fill('.revision-input',essay+' Frequent buses reduce the uncertainty of waiting.');await page.click('.revision-check');
  await expect(page.locator('.recheck-result')).toContainText('已改善');expect(calls[1].response_format.type).toBe('json_object');
  await expect(page.locator('#essayInput')).toHaveValue(essay);
  await page.click('.chat-new');await expect(page.locator('.chat-messages')).toBeEmpty();expect(await page.evaluate(()=>Works.all()[0].conversations.length)).toBe(2);
});
test('navigation, contextual materials, exposure and independent next task remain optional',async({page})=>{
  await page.goto('/');await expect(page.locator('#onboardModal')).toHaveCount(0);
  await expect(page.locator('#auxiliaryNav')).not.toHaveAttribute('open');
  await page.click('#newWork');await page.fill('#bankSearch','');await page.locator('#bankList .q-item').first().click();
  await expect(page.locator('#view-write')).toHaveClass(/active/);await expect(page.locator('#fullEssay')).toHaveValue('');
  await page.click('#writingHelp');await expect(page.locator('#contextHelp')).toBeVisible();await page.click('#helpCourse');await expect(page.locator('.course-help > details')).toHaveCount(8);await page.click('#closeContextHelp');
  expect(await page.evaluate(()=>Store.get('exposures',[]).length)).toBeGreaterThan(0);
  await page.fill('#fullEssay',essay);await page.click('#btnToCheck');await feedback(page);
  await page.click('.learning-exits summary');await page.click('[data-exit="paragraph"]');await page.fill('#helpParagraph','My short paragraph, saved when closing.');await page.click('#closeContextHelp');
  await page.click('[data-exit="paragraph"]');await expect(page.locator('#helpParagraph')).toHaveValue('My short paragraph, saved when closing.');await page.click('#closeContextHelp');
  await page.click('[data-exit="next"]');await expect(page.locator('#nextQuestionChoice')).toBeVisible();await page.click('#startNext');
  await expect(page.locator('#practiceState')).toContainText('独立验证');await expect(page.locator('#fullEssay')).toHaveValue('');
});
test('desktop surfaces fit 1280, 1440, 1600, themes and 125% scaling',async({page})=>{
  await writing(page);await feedback(page);await page.click('.annotation-compare');
  for(const width of [1280,1440,1600])for(const dark of [false,true]){
    await page.setViewportSize({width,height:1000});await page.evaluate(d=>{document.body.classList.toggle('dark',d);document.documentElement.style.zoom='1.25';},dark);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  await page.evaluate(()=>{document.documentElement.style.zoom='';document.body.classList.remove('dark');});await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'.impeccable/review/studio-review-1440.png',fullPage:true});
  await page.click('#workspaceSaveExit');await page.screenshot({path:'.impeccable/review/studio-home-1440.png',fullPage:true});
});
test('cancel and editing during a recheck never apply a late answer to new text',async({page})=>{
  await writing(page);await feedback(page);await page.evaluate(()=>{Store.set('ai',{apiKey:'test-only'});AI.followUp=()=>new Promise(resolve=>window.finishChat=()=>resolve('Late answer'));AI.recheck=()=>new Promise(resolve=>window.finishRecheck=()=>resolve({status:'已改善',evidence:'旧版本证据',next:'旧版本建议'}));});
  await page.locator('.ask-feedback').first().click();await page.fill('.chat-input','Keep this question');await page.click('.chat-send');await page.getByRole('button',{name:'取消请求',exact:true}).click();await page.evaluate(()=>finishChat());
  await expect(page.locator('.chat-status')).toContainText('已取消');await expect(page.locator('.chat-messages')).not.toContainText('Late answer');await expect(page.locator('.chat-input')).toHaveValue('Keep this question');
  await page.click('.annotation-compare');await page.fill('.revision-input',essay+' First revision.');await page.click('.revision-check');await page.fill('.revision-input',essay+' A later revision.');await page.evaluate(()=>finishRecheck());
  await expect(page.locator('.recheck-status')).toContainText('属于提交时的版本');await expect(page.locator('.recheck-result')).toHaveCount(0);
});
test('resume keeps changed submission text and labels the older feedback snapshot',async({page})=>{
  await writing(page);await feedback(page);await page.fill('#essayInput',essay+' This is a later submission.');await page.click('#workspaceSaveExit');await page.reload();await page.click('#resumeWork');
  await expect(page.locator('#essayInput')).toHaveValue(essay+' This is a later submission.');await expect(page.locator('#aiResult .annotation-original')).toHaveText(essay);await expect(page.locator('#aiResult .annotation-stale')).toBeVisible();
});
test('verified graph evidence is tied to the exact question; unverified and custom charts stay qualified',async({page})=>{
  await page.goto('/');const data=await page.evaluate(()=>{
    const e=ChartEvidence['剑10 Test 2'];return {verified:EssayContext.chart({mode:'t1',question:e.question,chartKey:'剑10 Test 2'}),wrong:EssayContext.chart({mode:'t1',question:'different',chartKey:'剑10 Test 2'}),conflict:EssayContext.chart({mode:'t1',question:'Q',chartKey:'剑19 Test 1'}),user:EssayContext.chart({mode:'t1',chartNotes:'A = 50%'})};
  });expect(data.verified.status).toBe('verified');expect(data.verified.text).toContain('millions of euros');expect(data.wrong.status).toBe('missing');expect(data.conflict.status).toBe('missing');expect(data.user.status).toBe('user');
});
test('mock tasks survive reload independently and a fresh mock preserves the previous works',async({page})=>{
  await page.goto('/');await page.click('#newWork');await page.click('#fullMock');await page.fill('#t1QuestionInput','Mock task one');await page.fill('#fullEssay','Task one answer.');
  await page.evaluate(()=>{timerLeft=1;});await page.click('#btnTimerStart');await expect(page.locator('#writeQuestionInput')).toBeVisible();await page.fill('#writeQuestionInput','Mock task two');await page.fill('#fullEssay',essay);await page.click('#workspaceSaveExit');
  await page.reload();await page.click('#resumeWork');await expect(page.locator('#fullEssay')).toHaveValue(essay);expect(await page.evaluate(()=>writeMode)).toBe('mock');expect(await page.evaluate(()=>mockT1Text)).toBe('Task one answer.');
  await page.click('#workspaceSaveExit');await page.click('#newWork');await page.click('#fullMock');await expect(page.locator('#fullEssay')).toHaveValue('');
  expect(await page.evaluate(()=>Works.all().filter(w=>w.context.mockGroup).length)).toBe(4);
});
test('two tabs keep conflicting versions, and backup restores works without exporting credentials',async({page,context})=>{
  await writing(page);const workId=await page.evaluate(()=>TaskFlow.checkMeta.workId);await page.click('#backWriting');const second=await context.newPage();await second.goto('/');await second.click('#resumeWork');
  await page.fill('#fullEssay',essay+' Tab A.');await page.click('#btnSaveDraft');await second.fill('#fullEssay',essay+' Tab B.');await second.click('#btnSaveDraft');
  const versions=await second.evaluate(id=>JSON.parse(localStorage.getItem('iwc_work_'+id)).versions.map(v=>v.text),workId);expect(versions.some(t=>t.endsWith('Tab A.'))).toBe(true);expect(versions.some(t=>t.endsWith('Tab B.'))).toBe(true);
  await page.click('#workspaceSaveExit');await page.click('#mainNav [data-view="progress"]');await page.locator('#legacyProgress > summary').click();await page.evaluate(()=>Store.set('ai',{apiKey:'never-in-backup'}));
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#btnExportAll').click()]);const fs=require('node:fs');const backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));expect(backup.ai).toBeUndefined();expect(backup['work_'+workId]).toBeTruthy();
  await page.evaluate(data=>{Store.importBackup(data);},backup);expect(await page.evaluate(()=>Works.all().length)).toBeGreaterThan(0);await second.close();
});
