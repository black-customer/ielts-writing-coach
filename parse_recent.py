# -*- coding: utf-8 -*-
"""Parse 近期考场真题回忆.md into tool/js/data-questions-recent.js"""
import re, io, json

SRC = r"D:\project\writingzcode\knowledge\digests\近期考场真题回忆.md"
OUT = r"D:\project\writingzcode\tool\js\data-questions-recent.js"

text = io.open(SRC, encoding="utf-8").read()
# 只取 Task 2 部分（第一部分）
if "## 二、" in text:
    text = text.split("## 二、")[0]

TYPE_NAME = {
    "opinion": "opinion", "discussion": "discussion",
    "adv-disadv-opinion": "adv-disadv-opinion", "adv-disadv": "adv-disadv",
    "problem-solution": "problem-solution", "two-part": "two-part",
}

items = []
blocks = re.split(r"\n### ", text)[1:]
for b in blocks:
    mh = re.match(r"题目\s*\d+（([^）]+)）", b)
    src_label = mh.group(1).strip() if mh else "考场回忆"
    mt = re.search(r"-\s*题型：([a-z-]+)", b)
    mq = re.search(r"-\s*Task 2 题干：(.+)", b)
    if not (mt and mq):
        continue
    t = TYPE_NAME.get(mt.group(1).strip())
    q = mq.group(1).strip()
    if not t or len(q) < 40:
        continue
    items.append({"src": f"考场 {src_label}", "t2type": t, "t2": q})

js = ["/* data-questions-recent.js — 2023–2026 考场真题回忆（来源：ieltsbuddy / ielts-blog 考生回忆存档，部分双源印证） */",
      "const RecentQuestions = ["]
for it in items:
    js.append('  { src: %s, t2type: %s, t2: %s },' % (
        json.dumps(it["src"], ensure_ascii=False),
        json.dumps(it["t2type"], ensure_ascii=False),
        json.dumps(it["t2"], ensure_ascii=False)))
js.append("];")

io.open(OUT, "w", encoding="utf-8").write("\n".join(js))
from collections import Counter
print("questions:", len(items), Counter(i["t2type"] for i in items))
