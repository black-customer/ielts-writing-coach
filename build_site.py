#!/usr/bin/env python3
# build_site.py — 组装部署站点 dist/
# 1) 复制 tool/ → dist/；2) 拷贝 LICENSE/PRIVACY.md；3) data-*.js 合并（--minify 可选压缩）；
# 4) 生成 sw.js（预缓存全部静态资源）；5) 生成 manifest；6) 版本号写入 index.html 与 sw.js
import os, re, shutil, hashlib, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "tool")
DIST = os.path.join(ROOT, "dist")
MINIFY = "--minify" in sys.argv

def version():
    vfile = os.path.join(ROOT, "VERSION")
    return open(vfile, encoding="utf-8").read().strip() if os.path.exists(vfile) else "0.1.0-dev"

def build():
    v = version()
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    shutil.copytree(SRC, DIST, ignore=shutil.ignore_patterns("_*.*", "*.md.bak"))
    for f in ["LICENSE", "PRIVACY.md"]:
        if os.path.exists(os.path.join(ROOT, f)):
            shutil.copy2(os.path.join(ROOT, f), os.path.join(DIST, f))

    # data-*.js 合并（保持 index.html 中的加载顺序；--minify 去整行注释/空行，模板字符串内不动）
    idxp = os.path.join(DIST, "index.html")
    html = open(idxp, encoding="utf-8").read()
    data_tags = re.findall(r'<script src="js/(data-[^"]+\.js)"></script>', html)
    merged = False
    if data_tags:
        parts = []
        for f in data_tags:
            code = open(os.path.join(DIST, "js", f), encoding="utf-8").read()
            parts.append("// ==== " + f + " ====\n" + code)
        bundle = "\n;\n".join(parts)
        if MINIFY:
            out_lines, in_block, in_tick = [], False, False
            for line in bundle.split("\n"):
                t = line.strip()
                if in_tick:
                    out_lines.append(line)
                    if t.count("`") % 2 == 1:
                        in_tick = False
                    continue
                if t.count("`") % 2 == 1:
                    in_tick = True
                if in_block:
                    if "*/" in t:
                        in_block = False
                        t = t.split("*/", 1)[1]
                    else:
                        continue
                if t.startswith("/*") and "*/" in t:
                    t = t.split("*/", 1)[1]
                elif t.startswith("/*"):
                    in_block = True
                    continue
                if t.startswith("//") or t == "":
                    continue
                out_lines.append(line.rstrip())
            bundle = "\n".join(out_lines)
        open(os.path.join(DIST, "js", "data-bundle.js"), "w", encoding="utf-8").write(bundle)
        for f in data_tags:
            os.remove(os.path.join(DIST, "js", f))
        first = '<script src="js/' + data_tags[0] + '"></script>'
        html = html.replace(first, '<script src="js/data-bundle.js"></script>', 1)
        for f in data_tags[1:]:
            html = html.replace('<script src="js/' + f + '"></script>', "", 1)
        open(idxp, "w", encoding="utf-8").write(html)
        merged = True
        print("data 合并: " + str(len(data_tags)) + " 个文件 -> js/data-bundle.js" + (" (minify)" if MINIFY else ""))

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

    sw = ("// sw.js — 由 build_site.py 自动生成（cache " + stamp + ", v" + v + "）\n"
          "const CACHE = \"iwc-" + stamp + "\";\n"
          "const ASSETS = " + json.dumps(assets, indent=1) + ";\n"
          "self.addEventListener(\"install\", e => {\n"
          "  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));\n"
          "});\n"
          "self.addEventListener(\"activate\", e => {\n"
          "  e.waitUntil(caches.keys().then(keys =>\n"
          "    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))\n"
          "  ).then(() => self.clients.claim()));\n"
          "});\n"
          "self.addEventListener(\"fetch\", e => {\n"
          "  const url = new URL(e.request.url);\n"
          "  if (e.request.method !== \"GET\" || url.origin !== location.origin) return;\n"
          "  e.respondWith(\n"
          "    caches.match(e.request).then(hit => {\n"
          "      const net = fetch(e.request).then(res => {\n"
          "        if (res.ok) {\n"
          "          const cp = res.clone();\n"
          "          caches.open(CACHE).then(c => c.put(e.request, cp));\n"
          "        }\n"
          "        return res;\n"
          "      }).catch(() => hit);\n"
          "      return hit || net;\n"
          "    })\n"
          "  );\n"
          "});\n")
    open(os.path.join(DIST, "sw.js"), "w", encoding="utf-8").write(sw)

    # 版本号写入 index.html
    idx = os.path.join(DIST, "index.html")
    html = open(idx, encoding="utf-8").read()
    html = html.replace('window.IWC_VERSION = "0.1.0-dev";', 'window.IWC_VERSION = "' + v + '";')
    open(idx, "w", encoding="utf-8").write(html)

    # sw 注册（仅 http/https）
    reg = ("\nif (\"serviceWorker\" in navigator && location.protocol.startsWith(\"http\")) {\n"
           "  window.addEventListener(\"load\", () => navigator.serviceWorker.register(\"sw.js\").catch(() => {}));\n"
           "}\n")
    html = html.replace("<script>\nwindow.IWC_VERSION", "<script>\n" + reg + "\nwindow.IWC_VERSION")
    open(idx, "w", encoding="utf-8").write(html)

    print("✅ dist/ 构建完成（v" + v + "，" + str(len(assets)) + " 个预缓存资源，data 合并: " + ("是" if merged else "否") + "，minify: " + ("是" if MINIFY else "否") + "）")

if __name__ == "__main__":
    build()
