#!/usr/bin/env python3
# download-t1-charts.py — 从 engnovate 抓取剑15-21 Task 1 原书图表扫描图
# 方法：curl 题目页 HTML → 提取 ielts-writing-image 的 src → 下载 → 魔法字节校验
import re, subprocess, os, sys

OUT = os.path.join("tool", "img", "t1")
os.makedirs(OUT, exist_ok=True)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

def page_url(book, test):
    if book == 21:
        return f"https://engnovate.com/ielts-writing-tests/cambridge-ielts-21-academic-writing-test-{test}/"
    return f"https://engnovate.com/ielts-writing-tests/cambridge-ielts-{book}-academic-writing-test-{test}-task-1/"

def curl(url, out=None):
    cmd = ["curl", "-sL", "--max-time", "60", "-A", UA]
    if out: cmd += ["-o", out]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True)
    return r.returncode == 0

def magic(path):
    with open(path, "rb") as f:
        h = f.read(4)
    if h.startswith(b"\x89PNG"): return "png"
    if h.startswith(b"\xff\xd8"): return "jpg"
    if h[:3] == b"GIF": return "gif"
    if h[:2] == b"BM": return "bmp"
    if h[:4] == b"RIFF": return "webp"
    return None

def grab(book, test):
    dest = os.path.join(OUT, f"c{book}t{test}.png")
    if os.path.exists(dest) and magic(dest) in ("png", "jpg") and os.path.getsize(dest) > 8000:
        print(f"c{book}t{test}: already ok ({os.path.getsize(dest)//1024}KB)")
        return True
    url = page_url(book, test)
    html_path = os.path.join(OUT, f"_page_{book}_{test}.html")
    if not curl(url, html_path):
        print(f"c{book}t{test}: PAGE FETCH FAIL {url}"); return False
    html = open(html_path, encoding="utf-8", errors="ignore").read()
    os.remove(html_path)
    # 提取 ielts-writing-image 的 src（或任何 wp-content 上传图）
    srcs = re.findall(r'<img[^>]*class="[^"]*ielts-writing-image[^"]*"[^>]*src="([^"]+)"', html)
    if not srcs:
        srcs = re.findall(r'src="([^"]*wp-content/uploads[^"]*)"[^>]*class="[^"]*ielts-writing-image', html)
    if not srcs:
        srcs = [s for s in re.findall(r'src="(https://engnovate\.com/wp-content/uploads/[^"]+)"', html)]
    if not srcs:
        print(f"c{book}t{test}: NO IMG FOUND on {url}"); return False
    # 多图时取最大的（按文件名序不可靠，逐个下载比大小）
    best, best_size = None, 0
    for src in srcs[:3]:
        src = src.replace("&#038;", "&").replace("&amp;", "&")
        tmp = os.path.join(OUT, "_tmp.img")
        if not curl(src, tmp): continue
        size = os.path.getsize(tmp)
        if magic(tmp) and size > best_size:
            best_size, best = size, (tmp, magic(tmp))
        elif os.path.exists(tmp):
            os.remove(tmp)
    if not best:
        print(f"c{book}t{test}: ALL SRC DOWNLOAD FAIL"); return False
    tmp, kind = best
    os.replace(tmp, dest)
    # 统一扩展名内容（保留 .png 容器名不管实际格式，浏览器按内容嗅探；但为规范改名）
    if kind == "jpg":
        os.replace(dest, dest[:-4] + ".jpg")
        dest = dest[:-4] + ".jpg"
    print(f"c{book}t{test}: OK {kind} {best_size//1024}KB <- {len(srcs)} candidate(s)")
    return True

fails = []
for book in [15, 16, 17, 18, 19, 20, 21]:
    for test in [1, 2, 3, 4]:
        if not grab(book, test): fails.append((book, test))
print("\nDONE. fails:", fails if fails else "none")
sys.exit(1 if fails else 0)
