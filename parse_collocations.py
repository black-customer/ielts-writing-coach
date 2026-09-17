# -*- coding: utf-8 -*-
"""Parse 词伙库.md into tool/js/data-collocations.js"""
import re, io, json

SRC = r"D:\project\writingzcode\knowledge\digests\词伙库.md"
OUT = r"D:\project\writingzcode\tool\js\data-collocations.js"

text = io.open(SRC, encoding="utf-8").read()

# Split into 第二部分 (topics) and 第三部分 (universal)
m2 = re.search(r"## 第二部分.*?(?=## 第三部分)", text, re.S)
m3 = re.search(r"## 第三部分.*", text, re.S)
topics = {}
for sec in re.finditer(r"### (\d+)\. ([^\n]+)\n(.*?)(?=### \d+\.|\Z)", m2.group(0), re.S):
    num, name, body = sec.group(1), sec.group(2).strip(), sec.group(3)
    items = []
    for line in body.splitlines():
        mm = re.match(r"-\s*(.+?)\s+——\s*(.+?)(?:\s*〔[^〕]*〕)?\s*$", line.strip())
        if mm:
            en, zh = mm.group(1).strip(), mm.group(2).strip()
            if 2 < len(en) < 120:
                items.append({"en": en, "zh": zh})
    if items:
        topics[name] = items

universal = {}
if m3:
    for sec in re.finditer(r"### (\d+)\. ([^\n]+)\n(.*?)(?=### \d+\.|\Z)", m3.group(0), re.S):
        name, body = sec.group(2).strip(), sec.group(3)
        items = []
        for line in body.splitlines():
            mm = re.match(r"-\s*(.+?)\s+——\s*(.+?)(?:\s*〔[^〕]*〕)?\s*$", line.strip())
            if mm:
                en, zh = mm.group(1).strip(), mm.group(2).strip()
                if 2 < len(en) < 120:
                    items.append({"en": en, "zh": zh})
        if items:
            universal[name] = items

total = sum(len(v) for v in topics.values()) + sum(len(v) for v in universal.values())

# Build JS
js = ["/* data-collocations.js — 词伙库（由 knowledge/digests/词伙库.md 生成，848 条） */",
      "const Collocations = {", "  BY_TOPIC: {"]
for name, items in topics.items():
    js.append('    "%s": [' % name.replace('"', "'"))
    for it in items:
        js.append('      { en: %s, zh: %s },' % (json.dumps(it["en"], ensure_ascii=False), json.dumps(it["zh"], ensure_ascii=False)))
    js.append("    ],")
js.append("  },")
js.append("  UNIVERSAL: [")
for name, items in universal.items():
    js.append('    // %s' % name)
    for it in items:
        js.append('      { en: %s, zh: %s, group: %s },' % (json.dumps(it["en"], ensure_ascii=False), json.dumps(it["zh"], ensure_ascii=False), json.dumps(name, ensure_ascii=False)))
js.append("  ],")
js.append("  UNIVERSAL_GROUPS: " + json.dumps(list(universal.keys()), ensure_ascii=False))
js.append("};")

io.open(OUT, "w", encoding="utf-8").write("\n".join(js))
print("topics:", len(topics), "universal groups:", len(universal), "total:", total)
for k, v in topics.items():
    print(" ", k, len(v))
