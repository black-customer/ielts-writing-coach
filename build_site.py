#!/usr/bin/env python3
# build_site.py — 组装部署站点 dist/
# 1) 复制 tool/ → dist/；2) 拷贝 LICENSE/PRIVACY.md；3) 生成 sw.js（预缓存全部静态资源）；
# 4) 生成 manifest；5) 把版本号写入 index.html 与 sw.js 缓存戳
import os, re, shutil, hashlib, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "tool")
DIST = os.path.join(ROOT, "dist")

def version():
    vfile = os.path.join(ROOT, "VERSION")
    return open(vfile, encoding="utf-8").read().strip() if os.path.exists(vfile) else "0.1.0-dev"

def build():
    v = version()
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    shutil.copytree(SRC, DIST,
                    ignore=shutil.ignore_patterns("_*.*", "*.md.bak"))
    for f in ["LICENSE", "PRIVACY.md"]:
        if os.path.exists(os.path.join(ROOT, f)):
            shutil.copy2(os.path.join(ROOT, f), os.path.join(DIST, f))

    # 收集静态资源清单（sw 预缓存）
    assets = ["./", "index.html", "css/style.css", "manifest.webmanifest"]
    jsdir = os.path.join(DIST, "js")
    for f in sorted(os.listdir(jsdir)):
        if f.endswith(".js"):
            assets.append("js/" + f)
    docs = os.path.join(DIST, "docs")
    for root, _, fs in os.walk(docs):
        for f in fs:
            rel = os.path.relpath(os.path.join(root, f), DIST).replace("\\", "/")
            assets.append(rel)
    imgdir = os.path.join(DIST, "img", "t1")
    if os.path.isdir(imgdir):
        for f in sorted(os.listdir(imgdir)):
            assets.append("img/t1/" + f)

    stamp = hashlib.md5(("|".join(assets) + v).encode()).hexdigest()[:10]

    sw = f"""// sw.js — 由 build_site.py 自动生成（cache v{stamp}, v{v}）
const CACHE = "iwc-{stamp}";
const ASSETS = {json.dumps(assets, indent=1)};
self.addEventListener("install", e => {{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
}});
self.addEventListener("activate", e => {{
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
}});
self.addEventListener("fetch", e => {{
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit => {{
      const net = fetch(e.request).then(res => {{
        if (res.ok) {{
          const cp = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }}
        return res;
      }}).catch(() => hit);
      return hit || net;
    }})
  );
}});
"""
    open(os.path.join(DIST, "sw.js"), "w", encoding="utf-8").write(sw)

    # 版本号写入 index.html
    idx = os.path.join(DIST, "index.html")
    html = open(idx, encoding="utf-8").read()
    html = html.replace("window.IWC_VERSION = \"0.1.0-dev\";", f"window.IWC_VERSION = \"{v}\";")
    open(idx, "w", encoding="utf-8").write(html)

    # sw 注册（仅 http/https）
    reg = """
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
"""
    html = html.replace("<script>\nwindow.IWC_VERSION", "<script>\n" + reg + "\nwindow.IWC_VERSION")
    open(idx, "w", encoding="utf-8").write(html)

    print(f"✅ dist/ 构建完成（v{v}，{len(assets)} 个预缓存资源）")

if __name__ == "__main__":
    build()
