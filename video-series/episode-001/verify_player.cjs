const {chromium}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  await page.waitForFunction(()=>Number.isFinite(document.querySelector('video').duration),undefined,{timeout:20000});
  const duration=await page.locator('video').evaluate(v=>v.duration);
  if(duration<1500||duration>2100)throw Error('Wrong video duration: '+duration);
  if(await page.locator('details[open]').count())throw Error('Answer or transcript is initially exposed.');
  await page.locator('video').evaluate(v=>v.muted=true);
  const chapterButtons=page.locator('.chapters button');
  if(await chapterButtons.count()!==7)throw Error('Missing phases');
  await chapterButtons.nth(2).click();
  await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('落笔·开头'));
  await page.locator('video').evaluate(v=>v.pause());
  const at=await page.locator('video').evaluate(v=>v.currentTime);
  if(Math.abs(at-421.8)>3)throw Error('Chapter seek mismatch: '+at);
  await page.screenshot({path:path.join(__dirname,'build/qa/player-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(__dirname,'build/qa/player-mobile.png'),fullPage:true});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  if(overflow)throw Error('Mobile page overflows horizontally');
  if(errors.length)throw Error(errors.join('\n'));
  const report={result:'pass',duration_seconds:duration,phase_buttons:7,seek_verified:true,answer_initially_collapsed:true,mobile_horizontal_overflow:false,page_errors:errors};
  fs.writeFileSync(path.join(__dirname,'player-quality-report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
