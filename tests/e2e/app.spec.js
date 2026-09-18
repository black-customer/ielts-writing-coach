// tests/e2e/app.spec.js — 六条关键路径的端到端回归
// 每条测试都断言 errBanner 不出现（JS 错误哨兵）
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  // 跳过新手引导（引导本身有独立冒烟验证）
  await page.addInitScript(() => localStorage.setItem("iwc_onboarded", JSON.stringify(Date.now())));
});

const NAV = v => `#mainNav [data-view="${v}"]`;
async function assertNoJsError(page) {
  await expect(page.locator("#errBanner")).toBeHidden();
}
async function gotoView(page, view) {
  await page.click(NAV(view));
  await page.waitForTimeout(300);
  await assertNoJsError(page);
}

test.describe("审题室", () => {
  test("贴题 → 生成作战图", async ({ page }) => {
    await page.goto("/");
    await page.fill("#questionInput", "Some people think that governments should spend money on public services rather than on the arts. To what extent do you agree or disagree?");
    await page.click("#btnAnalyze");
    await expect(page.locator("#analysisResult")).toBeVisible();
    await expect(page.locator("#analysisResult")).toContainText("作战图");
    await assertNoJsError(page);
  });
});

test.describe("训练营", () => {
  test("T1：矩阵选题 → 原书图 → 直接看范文", async ({ page }) => {
    await page.goto("/");
    await page.click(NAV("train"));
    await page.click('.q-task-tabs [data-tf="1"]'); // 小作文分区
    await page.locator('.q-card[data-tq="剑19 Test 1 T1"]').click(); // 有内置范文+原书图
    await expect(page.locator(".chart-fold img.t1img")).toBeVisible(); // 原书图
    await expect(page.locator("#tcSkipToModel")).toBeVisible();
    await page.click("#tcSkipToModel");
    await expect(page.locator("#tutorFeed")).toContainText(/范文|essay/i);
    await assertNoJsError(page);
  });

  test("T2：审题课走预生成缓存（零 API）→ 范文先行", async ({ page }) => {
    await page.goto("/");
    await page.click(NAV("train"));
    await page.click('.q-task-tabs [data-tf="2"]');
    await page.locator('.q-card[data-tq="剑15 Test 1 T2"]').click(); // 有内置审题课+范文
    await page.click("#tcStage0"); // 预生成审题课
    await expect(page.locator("#tutorFeed")).toContainText(/立场选项|typeExplain|推荐/i);
    await page.click("#tcToModel");
    await expect(page.locator("#tutorFeed")).toContainText(/范文|essay/i);
    await assertNoJsError(page);
  });
});

test.describe("诊断室", () => {
  test("贴范文 → 硬伤扫描 → 复盘卡 + 错因入库", async ({ page }) => {
    await page.goto("/");
    await page.click(NAV("check"));
    await page.fill("#essayInput", "In many countries, buying a home is seen as one of the most important goals in adult life. There are clear reasons why this is the case, and in my view the situation it creates is a positive one overall. The main reason is that a house represents security. Tenants can be asked to leave, whereas owners control their own homes. A second reason is financial. Each payment builds up something valuable instead of disappearing into a landlord pocket. In conclusion, people want to own their homes because property provides security and a form of saving.");
    await page.click("#btnCheck");
    await expect(page.locator("#checkResult")).toContainText("硬伤扫描");
    await page.click("#btnReviewCard");
    await expect(page.locator("#finalScoreBox")).toContainText("复盘卡");
    await expect(page.locator("#btnErrImport")).toBeVisible();
    await page.click("#btnErrImport");
    await expect(page.locator("#errImportResult")).toContainText("已入库");
    await assertNoJsError(page);
  });
});

test.describe("范文库", () => {
  test("56 篇矩阵 → 打开详情（含图表）→ 学习册导出按钮存在", async ({ page }) => {
    await page.goto("/");
    await page.click(NAV("bank"));
    await expect(page.locator("#mbGrid .q-card")).toHaveCount(56);
    await expect(page.locator("#mbFilters [data-mb='2']")).toContainText("大作文 28");
    await page.locator('#mbGrid [data-mb="剑19 Test 1 T1"]').click();
    await expect(page.locator("#mbDetail img.t1img")).toBeVisible();
    await expect(page.locator("#mbCopy")).toBeVisible();
    await expect(page.locator("#mbExport")).toBeVisible();
    await assertNoJsError(page);
  });
});

test.describe("弹药库·闪卡", () => {
  test("错因卡入库后出现在闪卡来源里", async ({ page }) => {
    await page.goto("/");
    // 先造一张错因卡
    await page.evaluate(() => {
      const arr = Store.get("errCards", []);
      arr.push({ id: "e2e-1", kind: "err", quote: "The government should utilizes technology.", problem: "[大词] utilize 是大词", fix: "The government should use technology.", tag: "big-words", crit: "LR", from: "E2E" });
      Store.set("errCards", arr);
    });
    await page.click(NAV("library"));
    await page.click('.lib-tab[data-lib="flashcards"]');
    await expect(page.locator("#fcSource")).toContainText("错因复习");
    await page.selectOption("#fcSource", "__err");
    await page.click("#fcStart");
    await expect(page.locator(".flash-card")).toContainText("utilizes technology");
    await assertNoJsError(page);
  });
});
