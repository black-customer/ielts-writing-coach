/* =========================================================
 * cloze.js — 填空精读引擎（Simon worksheet 教学法的自动化版）
 * 从范文中挖掉主题词伙，学生凭记忆填回
 * ========================================================= */
const Cloze = (() => {

  const norm = s => (s || "").toLowerCase().replace(/[''`]/g, "'").replace(/[^a-z'\s]/g, " ").replace(/\s+/g, " ").trim();

  // 在 essay 中定位词伙出现位置（返回 [{start, end, phrase}]，字符级区间）
  function findBlanks(essay, bank, maxBlanks) {
    const hits = [];
    const seen = new Set();
    for (const c of bank) {
      const phrase = norm(c.en);
      if (phrase.length < 6 || seen.has(phrase)) continue;
      // 转义正则特殊字符，允许空格弹性
      const rx = new RegExp("\\b" + phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+") + "\\b", "i");
      const m = essay.match(rx);
      if (m && m.index !== undefined) {
        seen.add(phrase);
        hits.push({ start: m.index, end: m.index + m[0].length, phrase: c.en, zh: c.zh || "" });
      }
    }
    // 按出现位置排序，分散取样（每段最多 ~3 个，总量 maxBlanks）
    hits.sort((a, b) => a.start - b.start);
    // 先标记段落边界
    const paraBreaks = [];
    let idx = essay.indexOf("\n\n");
    while (idx !== -1) { paraBreaks.push(idx); idx = essay.indexOf("\n\n", idx + 1); }
    const paraOf = pos => { let p = 0; for (const b of paraBreaks) { if (pos > b) p++; } return p; };
    const perPara = {};
    const picked = [];
    for (const h of hits) {
      const p = paraOf(h.start);
      perPara[p] = (perPara[p] || 0);
      if (perPara[p] < 3) { picked.push(h); perPara[p]++; }
      if (picked.length >= maxBlanks) break;
    }
    return picked;
  }

  // 生成练习：把命中区间替换为占位结构
  function build(essay, bank, maxBlanks) {
    const blanks = findBlanks(essay, bank, maxBlanks || 8);
    if (!blanks.length) return null;
    const parts = [];
    let cursor = 0;
    blanks.forEach((b, i) => {
      parts.push({ text: essay.slice(cursor, b.start) });
      parts.push({ blank: i, answer: b.phrase, zh: b.zh, len: b.phrase.length });
      cursor = b.end;
    });
    parts.push({ text: essay.slice(cursor) });
    return { parts, blanks };
  }

  // 判分：忽略大小写/标点/多余空格；词集合一致即通过（允许词序微调）
  function check(input, expected) {
    const a = norm(input), b = norm(expected);
    if (!a) return false;
    if (a === b) return true;
    const wa = new Set(a.split(" ")), wb = new Set(b.split(" "));
    if (wa.size !== wb.size) return false;
    for (const w of wa) if (!wb.has(w)) return false;
    return true;
  }

  // 随机选一篇范文
  function pickEssay(kind) {
    if (kind === "t1" && typeof T1EssayCorpus !== "undefined" && T1EssayCorpus.length) {
      const e = T1EssayCorpus[Math.floor(Math.random() * T1EssayCorpus.length)];
      return { q: e.q, essay: e.essay, kind: "t1" };
    }
    if (typeof EssayCorpus !== "undefined" && EssayCorpus.length) {
      const e = EssayCorpus[Math.floor(Math.random() * EssayCorpus.length)];
      return { q: e.q, essay: e.essay, kind: "t2" };
    }
    return null;
  }

  return { build, check, pickEssay, norm };
})();
