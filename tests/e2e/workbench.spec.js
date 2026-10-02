const {test,expect}=require('@playwright/test');
const fs=require('fs');
const nav=v=>`#mainNav [data-view="${v}"]`;
const text='Reliable public transport can reduce traffic congestion because one bus carries people who would otherwise drive separate cars. When services are frequent and predictable, commuters can leave their cars at home. This reduces demand for road space during rush hour.\n\nA second benefit is that regular buses improve access to employment for people who cannot afford a car. Affordable fares can therefore make it easier for these residents to find work and maintain a stable income.';
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('iwc_onboarded','true'));});
async function result(page) {
  await page.click(nav('check'));
  await page.fill('#essayInput',text);await page.fill('#checkQuestion','Should governments invest in public transport?');
  await page.evaluate(essay=>{
    const context={essay,question:'Should governments invest in public transport?',mode:'t2'};
    renderAiResult({context,mode:'t2',scores:{TR:6.5,CC:7,LR:6.5,GRA:7},overall:7,summary:'测试示例：检查解释与支撑。',priorityFixes:['解释公共交通怎样改变通勤选择'],sentenceIssues:[{quote:'commuters can leave their cars at home',problem:'把行为改变的原因解释具体',fix:'说明可靠的班次为何减少对私家车的依赖。'}],rewrite:{improved:'Reference example, kept behind disclosure.'}});
  },text);
}
async function capture(page,name){await page.evaluate(()=>window.scrollTo(0,0));await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);await page.screenshot({path:'.impeccable/review/'+name+'.png',fullPage:true});}
test('连续全文兼容旧草稿，切换后保持正文、选区和阅读位置',async({page})=>{
  await page.addInitScript(essay=>localStorage.setItem('iwc_draft_t2',JSON.stringify({t:1,text:essay})),text);
  await page.goto('/');await page.click(nav('write'));
  await expect(page.locator('#fullEssay')).toHaveValue(text);
  await page.fill('#fullEssay',text+'\n\nConclusion with another paragraph.');
  await page.evaluate(()=>{const el=document.getElementById('fullEssay');el.focus();el.setSelectionRange(12,29);window.scrollTo(0,200);});
  await page.click(nav('library'));await page.click(nav('write'));
  await expect(page.locator('#fullEssay')).toHaveValue(text+'\n\nConclusion with another paragraph.');
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.getElementById('fullEssay').selectionStart)).toBe(12);
  await page.reload();await page.click(nav('write'));await expect(page.locator('#fullEssay')).toHaveValue(text); // initScript resets only this seeded legacy record
});
test('自动保存失败保留文本，可重试；普通操作不弹阻塞窗口',async({page})=>{
  await page.goto('/');await page.click(nav('write'));
  await page.evaluate(()=>{window.testSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('quota');};});
  await page.fill('#fullEssay',text);
  await expect(page.locator('#writeSaveStatus')).toContainText('保存失败');
  await expect(page.locator('#fullEssay')).toHaveValue(text);
  await expect(page.locator('#uiNotices')).toContainText('保存失败');
  await page.evaluate(()=>Storage.prototype.setItem=window.testSet);
  await page.locator('#uiNotices .notice-action').click();
  await expect(page.locator('#writeSaveStatus')).toContainText('已保存');
  expect(await page.evaluate(()=>Store.getDraft('t2').text)).toBe(text);
});
test('专注模式与侧栏折叠不重建编辑器，退出恢复选区',async({page})=>{
  await page.goto('/');await page.click(nav('write'));await page.fill('#fullEssay',text);
  await page.evaluate(()=>{const el=document.getElementById('fullEssay');el.focus();el.setSelectionRange(5,20);window.editorIdentity=el;});
  await page.click('#view-write [data-focus]');
  await expect(page.locator('body')).toHaveClass(/focus-mode/);await expect(page.locator('header')).toBeHidden();
  await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>document.getElementById('fullEssay')===window.editorIdentity)).toBe(true);
  expect(await page.evaluate(()=>document.getElementById('fullEssay').selectionStart)).toBe(5);
  await page.click('#view-write [data-panel]');await expect(page.locator('#view-write .write-side')).toBeHidden();
});
test('批注双向定位、重复位置选择、匹配失败与改写恢复',async({page})=>{
  await page.goto('/');await page.click(nav('check'));
  await page.evaluate(()=>{
    const context={essay:'A repeated phrase. A repeated phrase. End.',question:'Q',mode:'t2'};
    document.getElementById('essayInput').value=context.essay;document.getElementById('checkQuestion').value='Q';
    Annotations.render(document.getElementById('aiResult'),context,[{quote:'repeated phrase',problem:'Repeated wording',fix:'Try a precise alternative.'},{quote:'not present',problem:'Missing quote'}]);
    document.getElementById('aiResult').classList.remove('hidden');
  });
  await page.locator('#aiResult .annotation-select').first().click();
  await expect(page.locator('#aiResult mark.selected')).toHaveCount(2);
  await page.selectOption('#aiResult .annotation-occurrence','1');
  await page.locator('#aiResult mark').nth(1).press('Enter');await expect(page.locator('#aiResult .annotation-occurrence')).toHaveValue('1');
  await page.locator('#aiResult mark').first().press('Enter');
  await expect(page.locator('#aiResult .annotation-occurrence')).toHaveValue('0');
  await expect(page.locator('#aiResult .annotation-select').first()).toBeFocused();
  await expect(page.locator('#aiResult .annotation-item.selected')).toContainText('Repeated wording');
  await expect(page.locator('#aiResult .annotation-sidebar')).toContainText('未能定位原句');
  await page.click('#aiResult .annotation-compare');await page.fill('#aiResult .revision-input',text);
  await expect(page.locator('#aiResult .revision-input')).toHaveAttribute('id','aiResult-revision');
  await expect(page.locator('#aiResult .save-status')).toContainText('已保存');
  await page.evaluate(()=>Annotations.render(document.getElementById('aiResult'),{essay:'A repeated phrase. A repeated phrase. End.',question:'Q',mode:'t2'},[{quote:'repeated phrase',problem:'Repeated wording'}]));
  await page.click('#aiResult .annotation-compare');await expect(page.locator('#aiResult .revision-input')).toHaveValue(text);
  await page.fill('#essayInput','Changed essay');
  await expect(page.locator('#errBanner')).toBeHidden();
  await expect(page.locator('#aiResult .annotation-stale')).toBeVisible();
  await expect(page.locator('#aiResult .annotation-original')).toContainText('A repeated phrase.');
});
test('生成时可以编辑，迟到结果保留请求快照；取消后忽略结果',async({page})=>{
  await page.goto('/');await page.click(nav('check'));await page.fill('#essayInput',text);await page.fill('#checkQuestion','Original question');
  await page.evaluate(()=>{AI.review=opts=>new Promise(resolve=>window.finishReview=()=>resolve({scores:{TR:6,CC:6,LR:6,GRA:6},overall:6,mode:opts.mode,priorityFixes:['Test feedback'],sentenceIssues:[]}));});
  await page.click('#btnAiCheck');await expect(page.locator('#aiCancel')).toBeVisible();
  await page.fill('#essayInput',text+' Changed.');await page.evaluate(()=>window.finishReview());
  await expect(page.locator('#aiResult .annotation-stale')).toBeVisible();
  await expect(page.locator('#aiResult .annotation-original')).toHaveText(text);
  await page.click('#btnAiCheck');await page.click('#aiCancel');await page.evaluate(()=>window.finishReview());
  await expect(page.locator('#aiResult .annotation-original')).toHaveText(text);
  await expect(page.locator('#btnAiCheck')).toBeEnabled();
});
test('确认对话框可用键盘取消，评分记录保留',async({page})=>{
  await page.goto('/');await page.evaluate(()=>Store.addRecord({date:Date.now(),mode:'t2',ai:true,scores:{TR:6,CC:6,LR:6,GRA:6},overall:6}));
  await page.click(nav('progress'));await page.locator('[data-del]').click();await expect(page.getByRole('dialog',{name:'确认操作'})).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.locator('[data-del]')).toHaveCount(1);
});
test('过期的保存失败重试不会覆盖之后的新稿，失败时切模式保留文本',async({page})=>{
  await page.goto('/');await page.click(nav('write'));
  await page.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('quota');};});
  await page.fill('#fullEssay','Older unsaved draft');await expect(page.locator('#writeSaveStatus')).toContainText('保存失败');
  await page.evaluate(()=>window.oldRetry=document.querySelector('.notice-action'));
  await page.click('#writeModeSwitch [data-mode="t1"]');await expect(page.locator('#fullEssay')).toHaveValue('Older unsaved draft');
  expect(await page.evaluate(()=>writeMode)).toBe('t2');
  await page.evaluate(()=>Storage.prototype.setItem=window.realSet);
  await page.fill('#fullEssay',text);await expect(page.locator('#writeSaveStatus')).toContainText('已保存');
  await expect(page.locator('#uiNotices .notice-action')).toHaveCount(0);
  await page.evaluate(()=>window.oldRetry.click());
  expect(await page.evaluate(()=>Store.getDraft('t2').text)).toBe(text);
});
test('选中控件悬停保持对比度，模考无渐变，训练状态栏不遮段落',async({page})=>{
  await page.goto('/');
  for(const [view,selector] of [['write','#writeModeSwitch .active'],['bank','#bankFilters .active'],['library','.lib-tab.active'],['train','.chip[data-type=""]']]){
    await page.click(nav(view));await page.locator(selector).hover();
    await expect(page.locator(selector)).toHaveCSS('color','rgb(255, 255, 255)');
  }
  await page.click(nav('write'));await page.click('#btnTheme');await page.locator('#writeModeSwitch .active').hover();
  await expect(page.locator('#writeModeSwitch .active')).toHaveCSS('color','rgb(23, 36, 50)');
  await page.locator('#btnToCheck').focus();await page.keyboard.down('Space');
  await expect(page.locator('#btnToCheck')).toHaveCSS('background-color','rgb(187, 210, 233)');
  await expect(page.locator('#btnToCheck')).toHaveCSS('color','rgb(23, 36, 50)');await page.keyboard.up('Space');
  await page.click('#btnMock');await expect(page.locator('.mock-banner')).toHaveCSS('background-image','none');
  await page.click(nav('train'));await page.click('#learnBaseline');
  const sheet=await page.locator('.training-sheet').boundingBox(),bar=await page.locator('#trainSession .total-bar').boundingBox();
  expect(bar.y).toBeGreaterThanOrEqual(sheet.y+sheet.height);
});
test('桌面宽度明暗主题和长文布局，保存验收截图',async({page})=>{
  fs.mkdirSync('.impeccable/review',{recursive:true});
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  await capture(page,'home-1440');
  await page.click(nav('write'));await page.fill('#fullEssay',text);await page.fill('#writeQuestionInput','Should governments invest in public transport?');
  await expect(page.locator('#view-write .total-bar #timerDisplay')).toBeVisible();
  await expect(page.locator('#view-write .write-header #timerDisplay')).toHaveCount(0);
  for(const width of [1280,1440,1600]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    await expect(page.locator('#writeSaveStatus')).toContainText('已保存');await capture(page,`write-${width}`);
  }
  await page.click('#btnTheme');await page.waitForTimeout(250);await capture(page,'write-dark-1600');
  await page.click('#btnTheme');await result(page);await capture(page,'diagnosis-1600');
  await page.click('#aiResult .annotation-compare');await page.fill('#aiResult .revision-input',text);
  await expect(page.locator('#aiResult .save-status')).toContainText('已保存');await capture(page,'compare-1600');
  await page.click(nav('train'));await page.click('.q-task-tabs [data-tf="1"]');await page.locator('.q-card[data-tq="剑19 Test 1 T1"]').click();await capture(page,'task1-1600');
  await expect(page.locator('#tcPara-0')).toHaveAttribute('aria-label',/开头/);
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>Store.set('records',[
    {date:Date.now(),mode:'t2',ai:true,title:'测试记录：公共交通',overall:6.5,W:280,scores:{TR:6.5,CC:7,LR:6,GRA:6.5}},
    {date:Date.now()-86400000,mode:'t1',ai:true,title:'测试记录：活动参与人数',overall:7,W:175,scores:{TA:7,CC:7,LR:7,GRA:7}}
  ]));await page.click(nav('progress'));await capture(page,'dashboard-1440');
  await expect(page.locator('#errBanner')).toBeHidden();
});
test('新稿与题目跨刷新恢复，未保存的训练阶段能重试保存',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>{Store.saveDraft('t2','Legacy first paragraph.\n\nLegacy second paragraph.');buildParagraphBoxes();});
  await page.click(nav('write'));await expect(page.locator('#fullEssay')).toHaveValue('Legacy first paragraph.\n\nLegacy second paragraph.');
  await page.fill('#fullEssay',text);await page.fill('#writeQuestionInput','The current essay question');
  await expect(page.locator('#writeSaveStatus')).toContainText('已保存');
  await page.reload();await page.click(nav('write'));await expect(page.locator('#fullEssay')).toHaveValue(text);
  await expect(page.locator('#writeQuestionInput')).toHaveValue('The current essay question');
  await page.click(nav('train'));await page.click('#learnBaseline');await page.fill('#tcPara-0',text);
  await expect(page.locator('#trainSaveStatus')).toContainText('已保存');
  await page.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('quota');};});
  await page.click('#tcAttemptDone');await expect(page.locator('#trainSaveStatus')).toContainText('保存失败');
  await page.click('#tcExit');await expect(page.locator('#tcPara-0')).toHaveValue(text);
  await page.evaluate(()=>Storage.prototype.setItem=window.realSet);await page.locator('#uiNotices .notice-action').click();
  await expect(page.locator('#trainSaveStatus')).toContainText('已保存');
  expect(await page.evaluate(()=>Store.get('trainSession').firstAttempt.paras[0])).toBe(text);
});
test('过滤后新生成的范文卡片可以用键盘打开，收藏和设置失败不报成功',async({page})=>{
  await page.goto('/');await page.click(nav('bank'));await page.click('#mbFilters [data-mb="2"]');
  const card=page.locator('#mbGrid .q-card').first();await expect(card).toHaveAttribute('tabindex','0');await expect(card).toHaveAttribute('role','button');
  await card.press('Enter');await expect(page.locator('#mbDetail')).toBeVisible();
  await page.click(nav('library'));await page.click('.lib-tab[data-lib="collocations"]');
  await page.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('quota');};});
  const star=page.locator('#libContent .star-btn').first();await star.click();await expect(star).not.toHaveClass(/\bon\b/);
  await expect(page.locator('#uiNotices')).toContainText('收藏保存失败');expect(await page.evaluate(()=>Store.getStars().length)).toBe(0);
  await page.click(nav('check'));await page.click('#btnAiSettings');
  await page.evaluate(()=>{window.pings=0;AI.ping=async()=>{window.pings++;return{ok:true};};});
  await page.click('#btnAiSave');await expect(page.locator('#uiNotices')).toContainText('AI 设置保存失败');
  await page.click('#btnAiTest');await expect(page.locator('#aiTestResult')).toContainText('设置保存失败');expect(await page.evaluate(()=>window.pings)).toBe(0);
  await page.evaluate(()=>Storage.prototype.setItem=window.realSet);
});
test('旧导师请求结束后，新请求仍可取消，旧流式内容不会串入新窗口',async({page})=>{
  await page.goto('/');await page.click('#learnBaseline');
  await page.evaluate(()=>{
    window.firstRun=runTutorStream('','Old request',opts=>new Promise(resolve=>{window.oldOptions=opts;window.finishOld=resolve;}));
    tutorAbort.abort();tc={...tc,qKey:tc.qKey+' new'};
    window.secondRun=runTutorStream('','New request',opts=>new Promise(resolve=>{window.newOptions=opts;window.finishNew=resolve;}));
    window.oldOptions.onChunk('old content','old content');
  });
  await expect(page.locator('#tutStream')).toBeEmpty();
  await page.evaluate(async()=>{window.finishOld({});await window.firstRun;});
  await page.click('#tutCancel');expect(await page.evaluate(()=>window.newOptions.signal.aborted)).toBe(true);
  await page.evaluate(async()=>{window.finishNew({});await window.secondRun;});
  await expect(page.locator('#errBanner')).toBeHidden();
});
test('诊断后首页刷新下一步目标，未完成的短改写切页后保持',async({page})=>{
  await page.goto('/');await expect(page.locator('#learnNext')).toHaveCount(0);
  await page.click(nav('check'));await page.fill('#essayInput',text);await page.fill('#checkQuestion','A new question');await page.click('#btnCheck');
  await page.click(nav('train'));await expect(page.locator('#learnNext')).toBeVisible();await expect(page.locator('.learning-stats')).toContainText('待改写 1');
  await page.click('#learnNext');await page.fill('#learningDraft','An unfinished personal revision.');
  await page.click(nav('library'));await page.click(nav('train'));await expect(page.locator('#learningDraft')).toHaveValue('An unfinished personal revision.');
});
test('关于窗口使用同一对话框样式，键盘关闭后恢复入口焦点',async({page})=>{
  await page.goto('/');await page.click('#btnAbout');
  await expect(page.getByRole('dialog',{name:'IELTS Writing Coach'})).toBeVisible();
  await expect(page.locator('#aboutVersion')).toHaveText(require('../../package.json').version);
  await page.keyboard.press('Escape');await expect(page.locator('#aboutModal')).toBeHidden();await expect(page.locator('#btnAbout')).toBeFocused();
});
test('长题干长作文和多条长反馈在桌面宽度内保持可读，其余批注可展开',async({page})=>{
  await page.goto('/');await page.click(nav('write'));
  const question='Some people believe that governments should invest in reliable public transport rather than expanding roads. Discuss the effects on commuters and explain your position. '.repeat(5);
  await page.fill('#writeQuestionInput',question);await page.fill('#fullEssay',text.repeat(8));
  for(const width of [1280,1440,1600]){
    await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  }
  await page.click(nav('check'));await page.fill('#essayInput',text.repeat(8));await page.fill('#checkQuestion',question);
  await page.evaluate(({essay,question})=>renderAiResult({context:{essay,question,mode:'t2'},mode:'t2',scores:{TR:6,CC:6,LR:6,GRA:6},overall:6,
    sentenceIssues:['Reliable public transport','one bus carries people','commuters can leave their cars at home','access to employment','a stable income'].map((quote,i)=>({quote,problem:`检查项 ${i+1}：`+'请把行为改变的机制与题目中的条件联系起来。'.repeat(12),fix:'Explain why reliability changes the choices available to commuters. '.repeat(15)}))
  }),{essay:text.repeat(8),question});
  const fourth=page.locator('#aiResult .annotation-item').nth(3);await expect(fourth).toBeHidden();
  await page.locator('#aiResult .annotation-more summary').click();await expect(fourth).toBeVisible();
  for(const width of [1280,1440,1600]){
    await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    expect(await page.locator('#aiResult .annotation-sidebar').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  }
  await expect(page.locator('#errBanner')).toBeHidden();
});
test('同一训练会话的新请求取代旧请求，旧成功结果不再交给调用者',async({page})=>{
  await page.goto('/');await page.click('#learnBaseline');
  await page.evaluate(()=>{
    window.oldRun=runTutorStream('','Old',()=>new Promise(resolve=>window.completeOld=resolve));
    window.latestRun=runTutorStream('','Latest',opts=>new Promise(resolve=>{window.latestOptions=opts;window.completeLatest=resolve;}));
  });
  const oldResult=await page.evaluate(async()=>{window.completeOld({identity:'obsolete'});return await window.oldRun;});expect(oldResult).toBe(null);
  await page.click('#tutCancel');expect(await page.evaluate(()=>window.latestOptions.signal.aborted)).toBe(true);
  await page.evaluate(async()=>{window.completeLatest({});await window.latestRun;});await expect(page.locator('#errBanner')).toBeHidden();
});
test('训练工作台重建后仍准确显示保留的面板折叠状态',async({page})=>{
  await page.goto('/');await page.click('#learnBaseline');await page.click('#trainSession [data-panel]');
  await expect(page.locator('#trainSession .write-side')).toBeHidden();await page.click('#tcExit');await page.click('#learnBaseline');
  await expect(page.locator('#trainSession .write-side')).toBeHidden();await expect(page.locator('#trainSession [data-panel]')).toHaveAttribute('aria-expanded','false');
  await page.click('#trainSession [data-panel]');await expect(page.locator('#trainSession .write-side')).toBeVisible();
});

test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('iwc_trainPickerOpen','true'));});
