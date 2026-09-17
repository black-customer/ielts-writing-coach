# -*- coding: utf-8 -*-
"""extract_calibration.py — 从剑10-13 书后答案提取评分校准语料
输出 calibration/essays.json：{book, test, task, kind, band, pdfPageStart, pdfPageEnd, text, examinerComment}
"""
import re, io, json, os

ROOT = r"D:\project\writingzcode"
FILES = {
    10: os.path.join(ROOT, "extracted", "[真题]10-16__【10】剑桥雅思真题10.pdf.txt"),
    11: os.path.join(ROOT, "extracted", "[真题]10-16__【11】剑桥雅思真题11.pdf.txt"),
    12: os.path.join(ROOT, "extracted", "[真题]10-16__【12】剑桥雅思真题12.pdf.txt"),
    13: os.path.join(ROOT, "extracted", "[真题]10-16__【13】剑桥雅思真题13.pdf.txt"),
}
# 源 PDF（vision OCR 用）
PDFS = {
    10: os.path.join(ROOT, "[真题]10-16", "【10】剑桥雅思真题10.pdf"),
    11: os.path.join(ROOT, "[真题]10-16", "【11】剑桥雅思真题11.pdf"),
    12: os.path.join(ROOT, "[真题]10-16", "【12】剑桥雅思真题12.pdf"),
    13: os.path.join(ROOT, "[真题]10-16", "【13】剑桥雅思真题13.pdf"),
}

RE_TEST = re.compile(r"TEST\s*([0-9A-B])\s*[~,;.]?\s*W\s*R\s*I\s*T\s*I\s*N\s*G\s*T\s*A\s*S\s*K\s*(\d+)", re.I)
# 标记必须"整行独立出现"（书后答案页的标题行），避免误匹配行文中的 sample answers
RE_MODEL = re.compile(r"^\s*M\s*O\s*D\s*E\s*L\s*A\s*N\s*S\s*W\s*E\s*R\s*\.?\s*$", re.I | re.M)
RE_SAMPLE = re.compile(r"^\s*S\s*A\s*M\s*P\s*L\s*E\s*A\s*N\s*S\s*W\s*E\s*R\s*\.?\s*$", re.I | re.M)
# 章节起点：书后答案部分标题（两种版式）
RE_SECTION = re.compile(r"(Model and sample answers for|Sample answers for)\s*(\n|Writing)", re.I)
RE_PAGE = re.compile(r"={3,}\s*\[page (\d+)\]\s*={3,}")
RE_BAND = re.compile(r"achieved a Band\s*(\d(?:\.\d)?)\s*score", re.I)
RE_PAGEFOOT = re.compile(r"^\s*\d{2,3}\s*$", re.M)

def clean_lines(text):
    """去掉页眉重复、页码行、page 标记；返回 (cleanText, pageMap函数)。"""
    lines = text.split("\n")
    out, pages = [], []
    cur = 0
    for ln in lines:
        mp = RE_PAGE.search(ln)
        if mp:
            cur = int(mp.group(1)); continue
        if re.match(r"^\s*(Model and sample answers for|Sample answers for)\s*$", ln, re.I):
            continue
        if re.match(r"^\s*(Writing|Writing tasks|Model and sample answers)\s*$", ln.strip(), re.I) and len(ln.strip()) < 45:
            continue
        out.append(ln.rstrip())
        pages.append(cur)
    return "\n".join(out), pages

def strip_footer(block):
    return RE_PAGEFOOT.sub("", block)

entries = []
for book, path in FILES.items():
    text = io.open(path, encoding="utf-8").read()
    text, page_of = clean_lines(text)

    # 只取书后答案章节：以"第一个独立样卷标记之前、离它最近的章节头"为起点
    # （剑11 的章节头在书前介绍页也出现过，直接取首个会引入假条目）
    sec_matches = [m.start() for m in RE_SECTION.finditer(text)]
    first_sample = RE_SAMPLE.search(text)
    first_model = RE_MODEL.search(text)
    first_mark = min([p for p in (first_sample, first_model) if p], key=lambda m: m.start(), default=None)
    if not first_mark:
        print(f"book {book}: NO answer markers found"); continue
    before = [p for p in sec_matches if p < first_mark.start()]
    if not before:
        print(f"book {book}: NO answers section found"); continue
    text = text[max(before):]

    # 收集所有标记位置
    marks = []
    for m in RE_TEST.finditer(text):
        tid = m.group(1).upper()
        marks.append((m.start(), "test", (tid, int(m.group(2)), tid in "AB")))
    for m in RE_MODEL.finditer(text):
        marks.append((m.start(), "model", None))
    for m in RE_SAMPLE.finditer(text):
        marks.append((m.start(), "sample", None))
    marks.sort(key=lambda x: x[0])

    cur_test = cur_task = cur_gt = None
    for i, (pos, kind, meta) in enumerate(marks):
        if kind == "test":
            cur_test, cur_task, cur_gt = meta
            continue
        nxt = marks[i + 1][0] if i + 1 < len(marks) else len(text)
        block = text[pos:nxt]
        # 无 test 上下文的样卷（答案册直接以样卷开头）也保留，test 记为 None
        block_clean = strip_footer(block)
        # 该 block 的 PDF 页范围（按标记前行数查 page_of）
        line_idx = text.count("\n", 0, pos)
        pg1 = page_of[min(line_idx, len(page_of) - 1)]
        line_idx2 = text.count("\n", 0, nxt)
        pg2 = page_of[min(line_idx2, len(page_of) - 1)]
        if kind == "model":
            # 去掉 boilerplate 两句
            m = re.search(r"possible approaches\.\s*", block_clean, re.I)
            essay = block_clean[m.end():] if m else block_clean
            essay = re.sub(r"\n{3,}", "\n\n", essay).strip()
            # 段内换行合并（PDF 硬换行）→ 段落内合并为空格
            paras = [re.sub(r"\s*\n\s*", " ", p).strip() for p in essay.split("\n\n")]
            essay = "\n\n".join(p for p in paras if p)
            entries.append({
                "book": book, "test": cur_test, "task": cur_task, "kind": "model",
                "band": 9.0, "pdfPage": pg1, "pdfPageEnd": pg2, "gt": cur_gt,
                "text": essay, "examinerComment": "", "ocrNeeded": False
            })
        else:
            mb = RE_BAND.search(block_clean)
            band = float(mb.group(1)) if mb else None
            # comment 与正文分离：comment 以 "examiner's comment:" 后开始；
            # 正文（手写 OCR 噪声）从第一行含异常字符比例高/明显噪声的行开始
            m = re.search(r"examiner.s comment:?\s*", block_clean, re.I)
            after = block_clean[m.end():] if m else block_clean
            lines = after.split("\n")
            comment_lines, essay_lines, in_essay = [], [], False
            for ln in lines:
                if not in_essay:
                    # 噪声判定：非ASCII比例、非常规大小写混杂、或以小写字母+异常符号开头
                    non_ascii = sum(1 for ch in ln if ord(ch) > 127)
                    weird = len(re.findall(r"[A-Za-z]*[0-9][A-Za-z]|\b[a-z]{1,2}[A-Z]", ln))
                    if ln.strip() and (non_ascii > 2 or weird >= 2 or re.search(r"[^\x00-\x7F]", ln)):
                        in_essay = True
                    elif re.match(r"^\s*(T|h)e\s+(response|answer)", ln):  # 评语常见开头已在 after 里
                        comment_lines.append(ln)
                    else:
                        comment_lines.append(ln)
                else:
                    essay_lines.append(ln)
            comment = " ".join(x.strip() for x in comment_lines if x.strip())
            essay_noisy = "\n".join(x for x in essay_lines).strip()
            entries.append({
                "book": book, "test": cur_test, "task": cur_task, "kind": "sample",
                "band": band, "pdfPage": pg1, "pdfPageEnd": pg2, "gt": cur_gt,
                "text": essay_noisy, "examinerComment": comment, "ocrNeeded": True
            })

out = os.path.join(ROOT, "calibration", "essays.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
io.open(out, "w", encoding="utf-8").write(json.dumps(entries, ensure_ascii=False, indent=1))

# 统计
from collections import Counter
kinds = Counter((e["kind"], e["task"]) for e in entries)
bands = Counter(e["band"] for e in entries if e["kind"] == "sample")
words = lambda t: len(re.findall(r"[A-Za-z']+", t))
model_w = [words(e["text"]) for e in entries if e["kind"] == "model"]
print("total entries:", len(entries))
print("by kind/task:", dict(kinds))
print("sample bands:", dict(sorted(bands.items(), key=lambda x: (x[0] or 0))))
print("model word counts:", model_w)
short = [e for e in entries if e["kind"] == "model" and words(e["text"]) < 120]
print("models too short (<120w):", len(short))
nulled = [e for e in entries if e["kind"] == "sample" and e["band"] is None]
print("samples missing band:", len(nulled))
