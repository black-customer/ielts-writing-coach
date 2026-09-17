# -*- coding: utf-8 -*-
"""Parse 话题思路库.md into tool/js/data-topics.js (full version, 24 topics)"""
import re, io, json

SRC = r"D:\project\writingzcode\knowledge\digests\话题思路库.md"
OUT = r"D:\project\writingzcode\tool\js\data-topics.js"

# 中文匹配键（与词伙库 BY_TOPIC 键一致）
KEYMAP = {
    "Advertising": ["媒体与广告"],
    "Animal Rights": ["环境", "犯罪"],
    "Cities": ["城市化"],
    "Crime": ["犯罪"],
    "Education": ["教育"],
    "Environment": ["环境"],
    "Family": ["家庭与性别"],
    "Gender": ["家庭与性别"],
    "Genetic Engineering": ["食品", "科技与网络"],
    "Global Issues": ["全球化"],
    "Government and Society": ["政府与社会"],
    "Guns and Weapons": ["犯罪"],
    "Health": ["健康"],
    "Housing": ["城市化"],
    "Language": ["教育", "文化与旅游"],
    "Money": ["贫富差距"],
    "Personality": ["政府与社会"],
    "Sport": ["体育"],
    "TV/Internet/Phones": ["科技与网络"],
    "Television, Internet, Phones": ["科技与网络"],
    "Tourism": ["文化与旅游"],
    "Traditional vs Modern": ["文化与旅游"],
    "Transport": ["交通"],
    "Water": ["能源与水资源"],
    "Work": ["工作与职业"],
    "Music": ["艺术与音乐"],
}

text = io.open(SRC, encoding="utf-8").read()
# 只取第三部分（完整话题树），截止到第四部分
if "# 第三部分" in text:
    text = text.split("# 第三部分", 1)[1]
if "# 第四部分" in text:
    text = text.split("# 第四部分", 1)[0]
body = text

def find_keys(header):
    h = re.sub(r"[^a-z0-9 ]", " ", header.lower())
    keys = []
    for en_key, ks in KEYMAP.items():
        probe = re.sub(r"[^a-z0-9 ]", " ", en_key.lower())
        words = probe.split()
        if all(re.search(r"\b" + re.escape(w) + r"\b", h) for w in words):
            keys.extend(ks)
    return list(dict.fromkeys(keys))

def zh_name_of(header):
    m = re.search(r"[\u4e00-\u9fa5][\u4e00-\u9fa5·（）a-zA-Z0-9，、]*", header)
    return m.group(0).strip() if m else header

def parse_items(lines):
    items = []
    for ln in lines:
        m = re.match(r"^-\s*(.+?)\s*——\s*(.+?)\s*$", ln.strip())
        if m:
            en = m.group(1).strip().strip("*")
            zh = re.sub(r"〔[^〕]*〕", "", m.group(2)).strip()
            if 2 < len(en) < 200:
                items.append({"en": en, "zh": zh})
    return items

topics = []
cur = None
section = None  # 'ask' | 'pro' | 'con' | 'neutral'
sec_lines = []

def flush_section():
    global sec_lines
    if cur is None or not sec_lines:
        sec_lines = []
        return
    items = parse_items(sec_lines)
    if section == "pro":
        cur["pro"].extend(items)
    elif section == "con":
        cur["con"].extend(items)
    elif section == "neutral":
        cur["neutral"].extend(items)
    elif section == "ask":
        cur["ask"].extend([l.strip().lstrip("- ").strip() for l in sec_lines if l.strip().startswith("-")])
    sec_lines = []

for line in body.splitlines():
    mt = re.match(r"^## (\d+)\.\s*(.+)$", line)
    mh = re.match(r"^###\s*(.+)$", line)
    if mt:
        flush_section()
        full = mt.group(2).strip()
        cur = {"name": f"{zh_name_of(full)}", "en": full, "keys": find_keys(full), "ask": [], "pro": [], "con": [], "neutral": []}
        topics.append(cur)
        section = None
    elif cur is not None:
        if line.startswith("【问法方向】"):
            flush_section(); section = "ask"
        elif mh:
            h = mh.group(1)
            flush_section()
            if h.startswith("正方"):
                section = "pro"
            elif h.startswith("反方"):
                section = "con"
            else:
                section = "neutral"
        elif line.startswith("- ") and section:
            sec_lines.append(line)
        elif line.startswith("【") or line.startswith("# "):
            flush_section(); section = None

flush_section()

total = sum(len(t["pro"]) + len(t["con"]) + len(t["neutral"]) for t in topics)
js = ["/* data-topics.js — 话题观点库（由 knowledge/digests/话题思路库.md 生成，Simon《Ideas for IELTS Topics》全 24 话题） */",
      "const TopicsLibrary = ["]
for t in topics:
    js.append("  {")
    js.append('    name: %s,' % json.dumps(t["name"], ensure_ascii=False))
    js.append('    keys: %s,' % json.dumps(t["keys"], ensure_ascii=False))
    js.append('    ask: %s,' % json.dumps(t["ask"], ensure_ascii=False))
    for fld in ("pro", "con", "neutral"):
        js.append('    %s: [' % fld)
        for it in t[fld]:
            js.append('      { en: %s, zh: %s },' % (json.dumps(it["en"], ensure_ascii=False), json.dumps(it["zh"], ensure_ascii=False)))
        js.append('    ],')
    js.append("  },")
js.append("];")

io.open(OUT, "w", encoding="utf-8").write("\n".join(js))
print("topics:", len(topics), "ideas total:", total)
for t in topics:
    print(f'  {t["name"]}: pro={len(t["pro"])} con={len(t["con"])} neutral={len(t["neutral"])} keys={t["keys"]}')
