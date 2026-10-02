const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const nav=v=>`#mainNav [data-view="${v}"]`;
const essay='Reliable public transport can reduce traffic congestion because one bus carries people who would otherwise drive separate cars. When services are frequent and predictable, commuters can leave their cars at home. This reduces demand for road space during rush hour.\n\nAffordable fares also help residents who cannot afford a car reach their workplace. This improves access to employment and allows more people to maintain a stable income.';
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('iwc_onboarded','true'));});

test('首页默认收起选题，整篇草稿、训练会话与改写任务分别显示',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('iwc_draft_t1',JSON.stringify({text:'The chart shows changes in travel.',question:'Travel chart',chart:'线图 Line graph',chartKey:'剑19 Test 1'}));
    localStorage.setItem('iwc_trainSession',JSON.stringify({qKey:'剑15 Test 1 T2',src:'剑15 Test 1',task:2,question:'Housing',paraTexts:['Started paragraph','','',''],stage:0,sentForDiagnosis:true}));
  });
  await page.goto('/');await expect(page.locator('#trainPicker')).not.toHaveAttribute('open','');
  await expect(page.locator('#learningHome')).toContainText('Task 1 整篇草稿');
  await page.click('[data-resume-draft="t1"]');await expect(page.locator('#fullEssay')).toHaveValue('The chart shows changes in travel.');
  await expect(page.locator('#writeTaskChart')).toContainText('本次题目图表');
});

test('范文搜索组合筛选、分页、图型和返回列表焦点',async({page})=>{
  await page.goto('/');await page.click(nav('bank'));await expect(page.locator('#mbGrid .q-card')).toHaveCount(12);
  await expect(page.locator('#mbResults')).toContainText('56');await page.selectOption('#mbBook','19');await page.click('#mbFilters [data-mb="1"]');
  await expect(page.locator('#mbGrid .q-card')).toHaveCount(4);await expect(page.locator('#mbGrid')).toContainText('线图');
  const card=page.locator('#mbGrid [data-mb="剑19 Test 1 T1"]');await card.press('Enter');await expect(page.locator('#mbDetail')).toBeVisible();
  await page.click('#mbClose');await expect(card).toBeFocused();await expect(page.locator('#mbBook')).toHaveValue('19');
  await page.fill('#mbSearch','does-not-exist-123');await expect(page.locator('#mbResults')).toContainText('0 篇');await expect(page.locator('#mbGrid')).toContainText('没有匹配');
  await page.click('#mbClear');await expect(page.locator('#mbResults')).toContainText('56');await page.click('#mbPager [data-pg="2"]');await expect(page.locator('#mbPager')).toContainText('第 2');
  await page.fill('#mbSearch','transport');await expect(page.locator('#mbPager')).not.toContainText('第 2');
});

test('Task 1 从范文带图写作，再带图送诊断',async({page})=>{
  await page.goto('/');await page.click(nav('bank'));await page.selectOption('#mbBook','19');await page.click('#mbFilters [data-mb="1"]');
  await page.click('#mbGrid [data-mb="剑19 Test 1 T1"]');await page.click('#mbWrite');
  await expect(page.locator('#view-write')).toHaveClass(/active/);await expect(page.locator('#writeModeSwitch .active')).toHaveAttribute('data-mode','t1');
  await expect(page.locator('#t1QuestionInput')).not.toHaveValue('');await expect(page.locator('#writeTaskChart img')).toBeVisible();
  await page.fill('#fullEssay',essay);await page.click('#btnToCheck');await expect(page.locator('#checkModeSwitch .active')).toHaveAttribute('data-mode','t1');
  await expect(page.locator('#essayInput')).toHaveValue(essay);await expect(page.locator('#checkChart')).toHaveValue('线图 Line graph');await expect(page.locator('#checkTaskChart img')).toBeVisible();
  await page.click('#btnCheck');await expect(page.locator('#checkResult')).toBeVisible();
});

test('Task 1 题库和 Simon 范文进入写作，缺图明确提示',async({page})=>{
  await page.goto('/');await page.click(nav('bank'));await page.selectOption('#bankTask','1');await page.locator('#bankList .q-item').first().click();
  await expect(page.locator('#writeModeSwitch .active')).toHaveAttribute('data-mode','t1');
  await page.click(nav('bank'));await page.evaluate(()=>{corpusKind='t1';renderCorpus();});await page.locator('#corpusList .q-item').first().click();
  await page.locator('#corpusDetail button[onclick]').click();await expect(page.locator('#view-write')).toHaveClass(/active/);
  await expect(page.locator('#t1QuestionInput')).not.toHaveValue('');
});

test('换题确认、原稿归档、刷新与恢复不会丢稿',async({page})=>{
  await page.goto('/');await page.click(nav('write'));await page.fill('#writeQuestionInput','Original question');await page.fill('#fullEssay',essay);
  await page.evaluate(()=>{void TaskFlow.write({task:2,question:'New question',qtype:'opinion'});});
  await page.locator('dialog button[value="cancel"]').click();await expect(page.locator('#fullEssay')).toHaveValue(essay);
  await page.evaluate(()=>{void TaskFlow.write({task:2,question:'New question',qtype:'opinion'});});await page.locator('dialog button[value="ok"]').click();
  await expect(page.locator('#writeQuestionInput')).toHaveValue('New question');await expect(page.locator('#fullEssay')).toHaveValue('');
  await page.reload();await expect(page.locator('#learningHome')).toContainText('保留的草稿');await page.locator('.draft-history summary').click();await page.click('[data-restore-draft="0"]');
  await expect(page.locator('#fullEssay')).toHaveValue(essay);await expect(page.locator('#writeQuestionInput')).toHaveValue('Original question');
});

test('保存失败阻止换题并保护原稿',async({page})=>{
  await page.goto('/');await page.click(nav('write'));await page.fill('#fullEssay',essay);
  await expect(page.locator('#writeSaveStatus')).toContainText('已保存');
  await page.evaluate(()=>{Store.saveDraft=()=>false;void TaskFlow.write({task:1,question:'New chart'});});
  await expect(page.locator('#writeSaveStatus')).toContainText('保存失败');await expect(page.locator('#fullEssay')).toHaveValue(essay);await expect(page.locator('dialog[open]')).toHaveCount(0);
});

test('同一句批注合并，首要目标含证据和标准，改写保留题目元数据',async({page})=>{
  await page.goto('/');await page.click(nav('check'));
  await page.evaluate(text=>{
    TaskFlow.diagnose(text,{mode:'t2',question:'Should cities improve transport?',qtype:'opinion',qKey:'source-question'});
    renderAiResult({mode:'t2',context:{essay:text,question:'Should cities improve transport?',mode:'t2',qtype:'opinion',qKey:'source-question'},scores:{TR:6,CC:6,LR:6,GRA:6},overall:6,
      sentenceIssues:[{quote:'commuters can leave their cars at home',problem:'Explain the cause',fix:'Connect reliability to the decision'},{quote:'commuters can leave their cars at home',problem:'Keep the meaning',fix:'Avoid adding new facts'},{quote:'a fabricated quotation',problem:'Cannot locate'}],
      learningTarget:{skill:'development',problem:'Explain why commuters switch',quote:'commuters can leave their cars at home',why:'The causal link needs support',instruction:'Explain how reliability changes the decision',checks:['State the cause','Explain the decision','Connect it to congestion']},rewrite:{improved:'Optional reference.'}});
  },essay);
  await expect(page.locator('#aiResult .annotation-item')).toHaveCount(2);await expect(page.locator('#aiResult .annotation-list')).toContainText('未能定位原句');
  await expect(page.locator('#aiResult .learning-feedback')).toContainText('The causal link needs support');await expect(page.locator('#aiResult .focus-evidence')).toContainText('commuters can leave');
  await page.locator('#aiResult .focus-checks summary').click();await expect(page.locator('#aiResult .focus-checks')).toContainText('State the cause');
  await expect(page.locator('#aiResult .reference-example')).not.toHaveAttribute('open','');
  await page.click('#aiResult .annotation-compare');await page.fill('#aiResult .revision-input',essay+' This is my revision.');await page.click('#aiResult .revision-check');
  await expect(page.locator('#checkQuestion')).toHaveValue('Should cities improve transport?');expect(await page.evaluate(()=>TaskFlow.checkMeta.qKey)).toBe('source-question');
});

test('AI 失败手动重试使用当前文本，失败提示不重复',async({page})=>{
  await page.goto('/');await page.click(nav('check'));await page.fill('#essayInput',essay);
  await page.evaluate(()=>{window.reviewCalls=[];AI.review=async opts=>{window.reviewCalls.push(opts.essay);throw new Error('Simulated network failure');};});
  await page.click('#btnAiCheck');await expect(page.locator('#aiRetry')).toBeVisible();await page.fill('#essayInput',essay+' Latest sentence.');await page.click('#aiRetry');
  await expect(page.locator('.ai-failure')).toHaveCount(1);expect(await page.evaluate(()=>window.reviewCalls.at(-1))).toBe(essay+' Latest sentence.');
  await expect(page.locator('#essayInput')).toHaveValue(essay+' Latest sentence.');
});

test('输入法组合阶段不触发范文搜索，组合完成后更新',async({page})=>{
  await page.goto('/');await page.click(nav('bank'));
  await page.evaluate(()=>{const input=document.getElementById('mbSearch');input.value='not-matched';input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));});
  await expect(page.locator('#mbGrid .q-card')).toHaveCount(12);
  await page.evaluate(()=>document.getElementById('mbSearch').dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false})));
  await expect(page.locator('#mbResults')).toContainText('0 篇');
});

test('搜索没有结果时可清除筛选，词伙收藏正常进入记录',async({page})=>{
  await page.goto('/');await page.click(nav('bank'));await page.fill('#bankSearch','no-result-123');await expect(page.locator('#bankResults')).toContainText('0 道');await page.click('#bankClear');await expect(page.locator('#bankList .q-item').first()).toBeVisible();
  await page.click(nav('library'));await page.locator('[data-lib="collocations"]').click();await page.locator('#libContent .star-btn').first().click();
  await page.click(nav('progress'));await expect(page.locator('#notebookContent .coll-item')).toHaveCount(1);await expect(page.locator('#errBanner')).toBeHidden();
  await page.click(nav('library'));await page.fill('#libSearch','no-result-123');await expect(page.locator('#libResults')).toContainText('0 条');await expect(page.locator('#libContent')).toContainText('没有匹配内容');await page.click('#libClear');await expect(page.locator('#libContent .coll-item').first()).toBeVisible();
});

test('备份包含题目关联和保留草稿，可导入旧格式',async({page})=>{
  await page.goto('/');await page.evaluate(()=>{Store.saveDraft('t1','Original chart answer',{question:'Chart',chartKey:'剑19 Test 1'});Store.archiveDraft('t2',{question:'Old question',text:'Old answer'});});
  await page.click(nav('progress'));const download=page.waitForEvent('download');await page.click('#btnExportAll');const file=await download;const data=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
  expect(JSON.parse(data.draft_t1).chartKey).toBe('剑19 Test 1');expect(JSON.parse(data.draftHistory)[0].text).toBe('Old answer');
  await page.evaluate(()=>Store.importBackup({_app:'IELTS Writing Coach',draft_t2:JSON.stringify({text:'Legacy answer'})}));
  await page.reload();await page.click(nav('write'));await expect(page.locator('#fullEssay')).toHaveValue('Legacy answer');
});

test('新手引导使用原生对话框，Escape 退出并保存状态',async({page})=>{
  await page.goto('/');await page.evaluate(()=>localStorage.removeItem('iwc_onboarded'));await page.addScriptTag({url:'/js/onboarding.js'});
  await expect(page.locator('dialog#onboardModal')).toBeVisible();await expect(page.locator('#onboardModal')).toContainText('今日训练');
  await page.keyboard.press('Escape');await expect(page.locator('#onboardModal')).toHaveCount(0);expect(await page.evaluate(()=>!!Store.get('onboarded'))).toBe(true);
});

for(const width of [1280,1440,1600])for(const dark of [false,true]){
  test(`电脑 ${width}px ${dark?'深色':'浅色'} 与 125% 等效视口无横向溢出`,async({page})=>{
    fs.mkdirSync('.impeccable/review',{recursive:true});await page.setViewportSize({width,height:1000});await page.goto('/');if(dark)await page.click('#btnTheme');
    for(const view of ['train','write','bank','library','progress']){await page.click(nav(view));if(view==='write')await page.fill('#fullEssay',essay.repeat(4));if(view==='bank'&&dark)await expect(page.locator('#mbSearch')).toHaveCSS('background-color','rgb(32, 40, 50)');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(['train','bank','library'].includes(view))await page.screenshot({path:`.impeccable/review/v1.4-${view}-${width}-${dark?'dark':'light'}.png`,fullPage:true});}
    await page.click(nav('write'));await page.screenshot({path:`.impeccable/review/v1.4-write-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    await page.setViewportSize({width:Math.floor(width/1.25),height:800});for(const view of ['train','write','bank','library','progress']){await page.click(nav(view));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}await page.click(nav('write'));
    await expect(page.locator('#btnToCheck')).toBeVisible();await expect(page.locator('#errBanner')).toBeHidden();
  });
}
