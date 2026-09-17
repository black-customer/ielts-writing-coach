# -*- coding: utf-8 -*-
"""locate_render.py — 定位每篇带分样卷在源 PDF 中的页码并渲染为 PNG（供视觉转录）"""
import json, io, os, re
import fitz

ROOT = r"D:\project\writingzcode"
cal = json.load(io.open(os.path.join(ROOT, "calibration", "essays.json"), encoding="utf-8"))
PDFS = {
    10: os.path.join(ROOT, "[真题]10-16", "【10】剑桥雅思真题10.pdf"),
    11: os.path.join(ROOT, "[真题]10-16", "【11】剑桥雅思真题11.pdf"),
    12: os.path.join(ROOT, "[真题]10-16", "【12】剑桥雅思真题12.pdf"),
    13: os.path.join(ROOT, "[真题]10-16", "【13】剑桥雅思真题13.pdf"),
}

def norm(s):
    return re.sub(r"[^a-z]+", " ", s.lower())

outdir = os.path.join(ROOT, "calibration", "pages")
os.makedirs(outdir, exist_ok=True)

# 按册分组处理
docs = {}
tasks = [e for e in cal if e["kind"] == "sample" and e["band"] is not None]
for e in tasks:
    e["_render"] = None

for book in (10, 11, 12, 13):
    entries = [e for e in tasks if e["book"] == book]
    if not entries:
        continue
    doc = fitz.open(PDFS[book])
    docs[book] = doc
    # 每页文本规范化（低频字符去掉，保留词序列）
    page_texts = []
    for pno in range(doc.page_count):
        page_texts.append(norm(doc[pno].get_text()))
    for e in entries:
        # 用正文的中段 8 个词做指纹（开头可能是评语尾/噪声）
        words = norm(e["text"]).split()
        snippet = " ".join(words[max(0, len(words)//2 - 4): len(words)//2 + 4]).strip()
        found = None
        if len(snippet) > 15:
            for pno, pt in enumerate(page_texts):
                if snippet in pt:
                    found = pno
                    break
        if found is None:
            # 退路：用前 8 个词找
            snippet2 = " ".join(words[:8])
            for pno, pt in enumerate(page_texts):
                if len(snippet2) > 15 and snippet2 in pt:
                    found = pno
                    break
        e["_render"] = found
        print(f"book{book} T{e['test']}.{e['task']} band{e['band']} → page {found if found is not None else 'NOT FOUND'}")

# 渲染：每篇渲染命中页 + 下一页（文章可能跨页）
rendered = []
for e in tasks:
    pno = e.get("_render")
    if pno is None:
        continue
    doc = docs[e["book"]]
    name = f"cal_b{e['book']}_t{e['test']}_{e['task']}_{str(e['band']).replace('.','')}"
    for off in (0, 1):
        p = pno + off
        if p >= doc.page_count:
            break
        pix = doc[p].get_pixmap(dpi=140)
        fp = os.path.join(outdir, f"{name}_p{p+1}.png")
        pix.save(fp)
        rendered.append(fp)

json.dump([{k: e[k] for k in ("book", "test", "task", "kind", "band", "_render", "text", "examinerComment")} for e in tasks],
          io.open(os.path.join(ROOT, "calibration", "tasks_with_pages.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("rendered pages:", len(rendered))
