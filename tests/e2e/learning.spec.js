const { test, expect } = require('@playwright/test');
const essay = 'Public transport is useful in cities. Although buses can carry many people, but they are often slow. The government should improve services because people need reliable transport to get to work. This can reduce congestion and make daily journeys easier for everyone.';
const rewrite = 'Reliable public transport can reduce traffic congestion because a single bus carries passengers who would otherwise drive separate cars. When services run frequently and arrive on time, more commuters can leave their cars at home. This reduces demand for road space during rush hour.';
const nav = v => `#mainNav [data-view="${v}"]`;
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('iwc_onboarded','true'));
});

test('诊断 → 改写自动保存 → 自查 → 隔天新题复测；无 API', async ({page}) => {
  await page.route('https://**/*', route => route.abort());
  await page.goto('/');
  await expect(page.locator('#learningHome')).toContainText('今天，解决一个写作问题');
  await page.click(nav('check'));
  await page.fill('#checkQuestion','Should governments improve public transport?');
  await page.fill('#essayInput',essay);
  await page.click('#btnCheck');
  await expect(page.locator('#checkResult .learning-feedback')).toBeVisible();
  await expect(page.locator('#checkResult input[type=checkbox]:checked')).toHaveCount(0);
  await page.click('#checkResult .learning-open');
  await page.locator('summary').filter({hasText:'调整练习类型'}).click();
  await page.selectOption('#learningSkill','grammar');
  await page.fill('#learningDraft',rewrite);
  await page.reload();
  await page.click('#learnNext');
  await expect(page.locator('#learningDraft')).toHaveValue(rewrite);
  await page.click('#learningCompare');
  await page.fill('#learningQuote','Reliable public transport can reduce traffic congestion');
  for (const checkbox of await page.locator('[data-learning-check]').all()) await checkbox.check();
  await page.fill('#learningEvidence','When services run frequently: explains why commuters change their travel choices.');
  await page.click('#learningPass');
  await expect(page.locator('#learningHome')).toContainText('上次改写已安排复测');
  await page.evaluate(() => { const s=Learning.read();s.items[0].due=Date.now()-1;Store.set('learning',s); });
  await page.reload();
  await page.click('#learnNext');
  await expect(page.locator('#learningTitle')).toContainText('换题复测');
  const newQuestion = await page.evaluate(() => Learning.read().items[0].transferQuestion.question);
  expect(newQuestion).not.toBe('Should governments improve public transport?');
  await expect(page.locator('#learningDraft')).toHaveValue('');
  await expect(page.locator('#learningCheck')).toBeHidden();
  await expect(page.locator('#errBanner')).toBeHidden();
});

test('训练初稿跨刷新恢复；独立快照保留；范文辅助有记录', async ({page}) => {
  await page.goto('/'); await page.click('#learnBaseline');
  await expect(page.locator('#tcAttemptDone')).toBeVisible();
  await page.fill('#tcPara-0',rewrite);
  await page.click('#tcAttemptDone');
  await page.click('#tcSkipToModel');
  await page.reload(); await page.click('#learnBaseline');
  await expect(page.locator('#tcPara-0')).toHaveValue(rewrite);
  const saved = await page.evaluate(() => Store.get('trainSession'));
  expect(saved.firstAttempt.paras[0]).toBe(rewrite); expect(saved.assisted).toBe(true);
  await expect(page.locator('#errBanner')).toBeHidden();
});

test('真实点击最后一段点评时使用最后一段，首段也对应正确', async ({page}) => {
  await page.goto('/'); await page.click('#learnBaseline');
  await page.evaluate(() => {
    tc.stage=5;tc.paraTeach[5]={why:'test'};
    tc.paraTexts=['intro','','','In conclusion, investment in public transport is essential because reliable services can reduce traffic congestion and improve daily journeys.'];
    Tutor.paraFeedback=async(s,idx)=>({verdict:'正确段落：'+s.paraTexts[idx-2],issues:[]});
    renderTraining();
  });
  await page.click('#tcFBBtn');
  await expect(page.locator('#tutorFeed')).toContainText('正确段落：In conclusion');
});

test('AI 结果与原稿绑定，改输入后保存也不会串文；独立 AI 可以错因入库', async ({page}) => {
  await page.goto('/'); await page.click(nav('check'));
  await page.evaluate(() => {
    const ctx={essay:'ORIGINAL ESSAY',question:'ORIGINAL QUESTION',mode:'t1',chart:'表格 Table'};
    const r={context:ctx,mode:'t1',scores:{TA:6,CC:7,LR:6,GRA:6},overall:6.5,priorityFixes:['Check comparison'],sentenceIssues:[{quote:'Original phrase',problem:'wrong comparison',fix:'Fixed phrase'}]};
    lastAi=r;lastAiContext=ctx;renderAiResult(r);
  });
  await page.fill('#essayInput',rewrite);
  await page.fill('#checkQuestion','DIFFERENT QUESTION');
  await page.click('#btnAiSaveRecord');
  const record = await page.evaluate(() => Store.get('records')[0]);
  expect(record.question).toBe('ORIGINAL QUESTION'); expect(record.essay).toBe('ORIGINAL ESSAY');
  await page.click('#btnAiReviewCard'); await page.click('#btnAiErrImport');
  await expect(page.locator('#aiErrImportResult')).toContainText('已入库');
  await page.fill('#essayInput',essay); await page.click('#btnCheck');
  await page.click('#btnReviewCard');
  await expect(page.locator('#finalScoreBox')).not.toContainText('Check comparison');
});

test('新手引导完整答三题，知识自测不报雅思分数', async ({page}) => {
  await page.goto('/'); await page.evaluate(() => localStorage.removeItem('iwc_onboarded'));
  // initScript 会在刷新时重置，因此在独立页面加载脚本测试首次引导。
  await page.addScriptTag({url:'/js/onboarding.js'});
  await page.click('#obNext');
  for (let n=1;n<=3;n++) {
    await expect(page.locator('#onboardModal')).toContainText(`方法自测 ${n}/3`);
    await page.locator('.ob-opt[data-i="1"]').click();
  }
  await expect(page.locator('#onboardModal')).toContainText('答对 3/3');
  await expect(page.locator('#onboardModal')).toContainText('不能估算你的雅思分数');
});

test('电脑端今日训练与改写表单不横向溢出', async ({page}) => {
  await page.setViewportSize({width:1280,height:1000});
  await page.goto('/');
  await page.evaluate(() => { Learning.capture({essay:'original',question:'A question',mode:'t2'},null,null);renderHome(); });
  await page.click('#learnNext');
  await expect(page.locator('#learningDraft')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
  await expect(page.locator('#errBanner')).toBeHidden();
});
test('走势按 Task 分开，不把旧规则记录或另一 Task 混入平均分', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => Store.set('records',[
    {mode:'t2',ai:true,date:Date.now(),overall:7,scores:{TR:7,CC:7,LR:7,GRA:7}},
    {mode:'t1',ai:true,date:Date.now(),overall:5,scores:{TR:5,CC:5,LR:5,GRA:5}},
    {mode:'t2',date:Date.now(),overall:3,scores:{TR:3}},
    {mode:'t2',date:Date.now(),title:'legacy without scores'}
  ]));
  await page.click(nav('progress'));
  await expect(page.locator('#progressSummary')).toContainText('7.0');
  await expect(page.locator('#progressList .bar')).toHaveCount(1);
  await page.selectOption('#progressTask','t1');
  await expect(page.locator('#progressSummary')).toContainText('5.0');
  await expect(page.locator('#progressSummary')).toContainText('TA');
  await expect(page.locator('#progressList .bar')).toHaveCount(1);
  await expect(page.locator('#errBanner')).toBeHidden();
  await page.evaluate(()=>Store.set('records',[{mode:'t2',ai:true,date:Date.now(),overall:6.5,scores:{TR:7,CC:7,LR:5.5,GRA:6.5}}]));
  await page.selectOption('#progressTask','t2');
  await expect(page.locator('#progressSummary .score-card').filter({hasText:'LR ·'})).toContainText('参考均值较低');
  await expect(page.locator('#progressSummary .score-card').filter({hasText:'TR ·'})).not.toContainText('参考均值较低');
});

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('iwc_trainPickerOpen','true'));});
