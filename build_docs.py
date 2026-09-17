# -*- coding: utf-8 -*-
"""build_docs.py — 把 knowledge/*.md 预构建为 tool/docs/*.html
用法：python build_docs.py （知识文档更新后重跑一次）
"""
import os, re, io, glob
import markdown

ROOT = r"D:\project\writingzcode"
SRC = os.path.join(ROOT, "knowledge")
OUT = os.path.join(ROOT, "tool", "docs")
os.makedirs(OUT, exist_ok=True)

# 文件名 → (序号, 短标题)
DOC_META = {
    "00-知识体系总纲.md": ("00", "总纲 · 学习地图"),
    "01-Task2核心方法论.md": ("01", "Task 2 核心方法论"),
    "02-考官范文规律.md": ("02", "考官范文规律"),
    "03-评分标准与自查清单.md": ("03", "评分标准与自查清单"),
    "04-Task1小作文完全指南.md": ("04", "Task 1 小作文完全指南"),
    "05-话题思路库.md": ("05", "话题思路库"),
    "06-词伙与句式储备.md": ("06", "词伙与句式储备"),
    "07-剑桥真题写作题库.md": ("07", "剑桥真题写作题库"),
    "08-近期考场真题回忆.md": ("08", "近期考场真题回忆"),
    "09-Simon网站增量调研.md": ("09", "Simon 增量调研"),
    "10-范文全库与仿写训练指南.md": ("10", "范文全库与仿写指南"),
    "11-AI考官精批使用指南.md": ("11", "AI 考官精批指南"),
    "12-评分校准报告.md": ("12", "评分校准报告"),
}

TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} · IELTS Writing Coach 知识库</title>
<style>
:root {{ --bg:#f4f6fb; --card:#fff; --ink:#1f2937; --muted:#64748b; --line:#e2e8f0; --primary:#2563eb; --accent:#eff6ff; }}
@media (prefers-color-scheme: dark) {{ :root {{ --bg:#0b1220; --card:#141e30; --ink:#e2e8f0; --muted:#94a3b8; --line:#263650; --accent:#16233c; }} }}
* {{ box-sizing: border-box; }}
body {{ margin:0; background:var(--bg); color:var(--ink); font-family:"Segoe UI","Microsoft YaHei",-apple-system,sans-serif; line-height:1.85; font-size:17px; }}
.wrap {{ max-width: 76ch; margin: 0 auto; padding: 40px 20px 80px; }}
h1,h2,h3 {{ line-height:1.4; }}
h1 {{ font-size: 28px; border-bottom: 3px solid var(--primary); padding-bottom: 10px; }}
h2 {{ font-size: 22px; margin-top: 40px; }}
h3 {{ font-size: 18px; margin-top: 28px; }}
a {{ color: var(--primary); text-decoration: none; border-bottom: 1px dotted; }}
a:hover {{ border-bottom-style: solid; }}
blockquote {{ border-left: 4px solid var(--primary); margin: 16px 0; padding: 8px 18px; background: var(--accent); border-radius: 0 8px 8px 0; }}
code {{ background: var(--accent); border-radius: 4px; padding: 2px 6px; font-size: 15px; }}
pre code {{ display:block; padding: 14px; overflow-x: auto; }}
table {{ border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 15.5px; }}
th, td {{ border: 1px solid var(--line); padding: 8px 12px; text-align: left; }}
th {{ background: var(--accent); }}
.top {{ display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px; flex-wrap: wrap; gap: 10px; }}
.top a.home {{ font-weight: 700; }}
nav.docs {{ margin-top: 50px; border-top: 2px solid var(--line); padding-top: 16px; font-size: 15px; }}
nav.docs a {{ margin-right: 14px; }}
</style>
</head>
<body><div class="wrap">
<div class="top"><a class="home" href="index.html">← 知识库首页</a><span style="color:var(--muted);font-size:14px">IELTS Writing Coach 知识库</span></div>
{body}
<nav class="docs">{nav}</nav>
</div></body></html>
"""

def convert(md_text):
    # 知识文档互链：《01-Task2核心方法论》 → 01.html
    def link_ref(m):
        name = m.group(1)
        for fname, (num, short) in DOC_META.items():
            key = fname[:-3]
            if name.startswith(key) or name == key:
                return f'<a href="{num}.html">《{name}》</a>'
        return m.group(0)
    md_text = re.sub(r"《((?:0\d|1[0-2])[^》]*)》", link_ref, md_text)
    return markdown.markdown(md_text, extensions=["tables", "fenced_code"])

files = sorted(glob.glob(os.path.join(SRC, "*.md")))
built = []
for fp in files:
    base = os.path.basename(fp)
    if base not in DOC_META:
        continue
    num, title = DOC_META[base]
    md = io.open(fp, encoding="utf-8").read()
    body = convert(md)
    # 生成文档间导航
    nums = [DOC_META[os.path.basename(f)] for f in files if os.path.basename(f) in DOC_META]
    nav = " ".join(
        f'<a href="{n}.html" style="font-weight:{700 if n == num else 400}">{n}</a>'
        for n, _ in nums
    )
    html = TEMPLATE.format(title=f"{num} {title}", body=body, nav=nav)
    outp = os.path.join(OUT, f"{num}.html")
    io.open(outp, "w", encoding="utf-8").write(html)
    built.append((num, title, os.path.getsize(outp)))

# 知识库首页
cards = "".join(
    f'<a href="{n}.html" style="display:block;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 20px;margin-bottom:10px"><b>{n}</b> · {t}</a>'
    for n, t in nums
)
home = TEMPLATE.format(title="知识库首页", body=f"<h1>📚 知识库</h1><p>点击进入对应文档（内文可互相跳转，与工具内的引用一致）：</p>{cards}", nav="")
io.open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(home)

for n, t, s in built:
    print(f"  {n}.html  {s:>7,} bytes  {t}")
print("built:", len(built), "+ index.html")
