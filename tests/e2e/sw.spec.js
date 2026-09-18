// SW 注册与离线缓存验证（针对 dist/ 构建产物；需要 dist 已构建 + 本地 8200 服务）
const { test, expect } = require("@playwright/test");
const fs = require("fs");
test.use({ baseURL: "http://127.0.0.1:8200" });
test.skip(!fs.existsSync(__dirname + "/../../dist/index.html"), "dist 未构建");
test("Service Worker 注册并完成预缓存", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 });
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    let n = 0;
    for (const k of keys) n += (await (await caches.open(k)).keys()).length;
    return { keys: keys.length, n };
  });
  expect(cached.keys).toBeGreaterThanOrEqual(1);
  expect(cached.n).toBeGreaterThan(50); // 预缓存应覆盖大部分资源
});
