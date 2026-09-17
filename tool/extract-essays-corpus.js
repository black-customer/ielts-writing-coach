#!/usr/bin/env node
/* extract-essays-corpus.js — 从 extracted/ 的 Simon Task 2 文本转储中提取范文，
 * 生成 tool/js/data-essays-corpus.js。用法：
 *   node extract-essays-corpus.js            # 生成最终文件并打印统计
 *   node extract-essays-corpus.js --review   # 额外打印候选明细（含被拒项）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC_DIR = 'D:/project/writingzcode/extracted';
const OUT_FILE = 'D:/project/writingzcode/tool/js/data-essays-corpus.js';
const REVIEW = process.argv.includes('--review');

const SRC_FILES = {
  jiuFen: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__9分范文.docx.txt', '9分范文合集'],
  ex52: ["simon writting 9+12讲 写作__simon 9 分范文  重要！__simon&#39;s examples 52页 包括大小作文 无改错纯范文版.pdf.txt", '52页范文'],
  da1: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__simon--大作文1_decrypted.pdf.txt', '大作文讲义1'],
  da2: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__simon--大作文2_decrypted.pdf.txt', '大作文讲义2'],
  da3: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__simon--大作文3_decrypted.pdf.txt', '大作文讲义3'],
  band9: ['simon writting 9+12讲 写作__9 Band Essays from ielts-simon.com 2010 - 2016.pdf.txt', '9 Band Essays 2010-2016'],
  p28: ['考官Simon雅思大作文范文(28篇).pdf.txt', '28篇精选'],
  y14a: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__14年的范文__simon  9分范文整理 14年.docx.txt', '14年整理1'],
  y14b: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__14年的范文__Simon 作文整理2.docx.txt', '14年整理2'],
  y14c: ['simon writting 9+12讲 写作__simon 9 分范文  重要！__14年的范文__Simon 作文整理3.docx.txt', '14年整理3'],
};

/* ---------------- generic helpers ---------------- */
function readF(key) {
  return fs.readFileSync(path.join(SRC_DIR, SRC_FILES[key][0]), 'utf8');
}
function srcLabel(key) { return SRC_FILES[key][1]; }

const DATE_RE = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday),\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},\s+20\d\d\s*$/i;
const DATE_PAREN_RE = /^\((monday|tuesday|wednesday|thursday|friday|saturday|sunday),?/i;
const TITLE_RE = /^IELTS (Writing|Speaking|Reading|Listening)/i;
const WATERMARK_RE = /^(posted by|permalink|comments\s*\(|email this|blogthis|share to|labels\s*:|newer post|older post|post a comment|subscribe to|1 comment|\d+ comments)/i;
const NOTE_RE = /^(note|remember|tip|feedback|ps)\b\s*[:.]?/i;
const CJK_RE = /[\u4e00-\u9fff]/;
const LESSON_LABEL_RE = /(^|\n)\s*(introduction|conclusion|main body|first main body|second main body|paragraph \d)\s*\(/i;
const PLAN_RE = /here('s| is) (the plan|my plan|a plan|my essay plan|the full essay plan)/i;
const WORDS_RE = /\(\s*(\d{2,3})\s*words/i;

function isJunkLine(l) {
  const t = l.trim();
  if (!t) return true;
  if (WATERMARK_RE.test(t)) return true;
  if (DATE_RE.test(t) || DATE_PAREN_RE.test(t)) return true;
  if (NOTE_RE.test(t)) return true;
  if (/^===== \[page \d+\] =====$/.test(t)) return true;
  if (/^\d+ \/ 52\s*$/.test(t)) return true;
  if (/^https?:\/\//i.test(t)) return true;
  if (CJK_RE.test(t)) return true;
  if (/^\(?\d{1,3}\s*words[^)]*\)?\s*$/i.test(t)) return true;
  if (/^\d+\.\s*[\u4e00-\u9fff]/.test(t)) return true; // 28篇 中文标题行
  return false;
}

function cleanText(t) {
  return t
    .replace(/\r\n?/g, '\n')
    .replace(/&#39;/g, "'").replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/===== \[page \d+\] =====/g, '\n')
    .replace(/^\s*\d+ \/ 52\s*$/gm, '')
    .replace(/^\s*https?:\/\/ielts-simon\.com.*$/gim, '')
    .replace(/^\s*9 band essays from ielts-simon\.com.*$/gim, '')
    .replace(/^\s*task 2\s+P2-P23\s*$/gim, '')
    .replace(/^\s*task 1\s+P24-P52\s*$/gim, '');
}

const QPAT = /(to what extent|agree or disagree|discuss both|advantages? and disadvantages?|drawbacks?|positive or negative|do you think|what are the|what problems|what factors|what can|what could|what should|how can|how could|why is|why do|why might|why could|should |is it|are there|do the)/i;

function looksLikeQuestion(s) {
  const t = s.trim();
  if (/discuss both (these |the )?views|give (your|you) own opinion|to what extent do you agree/i.test(t)) return true;
  if (!t.includes('?')) return false;
  if (QPAT.test(t)) return true;
  return t.length >= 25 && t.length <= 340;
}

function wordCount(s) { return (s.match(/[A-Za-z\u00c0-\u024f'-]+/g) || []).length; }

function isStopLine(t) {
  const s = t.trim();
  if (!s) return true;
  if (TITLE_RE.test(s)) return true;
  if (DATE_RE.test(s) || DATE_PAREN_RE.test(s)) return true;
  if (WATERMARK_RE.test(s) || NOTE_RE.test(s)) return true;
  if (/^(here('s| is| are)\b|i('ve| have)\b|today\b|last (week|month|time)|this (week|essay|article)\b|following\b|as i (said|mentioned)|i (wrote|made|said|received)\b|my (essay|plan|student)|you (can|should|might)\b|we (can|looked)\b|let's|read the\b|have a look|below\b|notice\b|people often ask|one of my|first,|second,)/i.test(s)) return true;
  if (/^(the (question|essay|task) below|(a |the )?(full )?essay (below|about))/i.test(s)) return true;
  if (CJK_RE.test(s)) return true;
  return false;
}

const Q_STRONG = /(to what extent|agree or disagree|discuss both|advantages? and disadvantages?|positive or negative|what problems|what can (governments|individuals|people|be done)|what are the (causes|benefits|advantages|problems|reasons|factors|drawbacks)|what other measures|suggest some measures|do you think|what could be the reasons|what factors|in what ways|why is it|why do we need|why might|is this a positive|do the (benefits|advantages))/i;

/* find question block starting at line qi; returns {q, start, end} of line indices */
function questionBlock(lines, qi, stopAt) {
  let s = qi, backed = 0;
  while (s > 0 && backed < 6) {
    const prev = lines[s - 1].trim();
    if (!prev || isStopLine(prev)) break;
    if (prev.length > (backed === 0 ? 320 : 160)) break;
    if (stopAt && stopAt(prev)) break;
    const open = !/[.!?;:)"'\u2019\u201d]$/.test(prev);   // 换行截断的续行
    const firstPerson = /\b(I|I've|I'm|I'd|my)\b/.test(prev); // 讲解口吻（含第一人称）不是题干
    const stmt = /[.'"\u2019\u201d]$/.test(prev) && !prev.includes('?') && !firstPerson && prev.length <= 260; // 题干里的陈述句
    if (open) { s--; backed++; continue; }
    if (stmt) {
      if (prev.length > 20) { s--; backed++; continue; }
      // 短收尾行（如 "merits."）：仅当再上一行是未收尾续行时一并回溯
      if (s - 2 >= 0) {
        const pp = lines[s - 2].trim();
        if (pp && !isStopLine(pp) && pp.length <= 160 && !(stopAt && stopAt(pp)) && !/[.!?;:)"'\u2019\u201d]$/.test(pp)) { s -= 2; backed += 2; continue; }
      }
      break;
    }
    break;
  }
  let e = qi;
  while (e + 1 < lines.length) {
    const last = lines[e].trim();
    const nxt = lines[e + 1].trim();
    if (!nxt || isStopLine(nxt) || nxt.length > 170) break;
    const lastOpen = !/[.!?;)"'\u2019\u201d]$/.test(last);  // 上一行没收尾 → 题干被换行截断
    const isQFrag = nxt.includes('?') && nxt.length <= 140 && /^(to what extent|do you|what |how |why |should |is |are |does |do |who |in what ways)/i.test(nxt);
    if (lastOpen || isQFrag) { e++; continue; }
    break;
  }
  const q = lines.slice(s, e + 1).map(l => l.trim()).join(' ').replace(/\s+/g, ' ').trim();
  return { q: cleanQuestion(q), start: s, end: e };
}

function cleanQuestion(q) {
  return q
    .replace(/\s*\((?:mon|tues|wednes|thurs|fri|satur|sun)day[^)]*\)\s*$/gi, ' ')
    .replace(/^\s*\(from cambridge[^)]*\)\s*/i, '')
    .replace(/^[\u2018\u201c"'][^\u2018\u2019\u201c\u201d"']{1,60}[\u2019\u201d"'](\s+(essay|topic|question|issue))?\s*/i, '')
    .replace(/^(opinion|discussion( \+ opinion)?|problem\s*\/\s*solution|two[- ]part question|advantages?\/disadvantages?( essay)?)\s+(?=[A-Z\u2018\u201c"'])/i, '')
    .replace(/^(the )?(following )?(question|task)( below)?\s*[:.]?\s*/i, '')
    .replace(/\s+/g, ' ').trim();
}

const Q_STRONG2 = /(to what extent|discuss both|do the (drawbacks|benefits|advantages)[^.?]*outweigh|outweigh the (drawbacks|benefits|disadvantages)|do you think the (advantages|disadvantages))/i;

function findQuestion(lines, fromIdx, maxScan, stopAt) {
  const upto = Math.min(lines.length, fromIdx + (maxScan || 14));
  // 1) 强特征问句（含无问号的 outweigh/discuss both 句式）
  for (let i = fromIdx; i < upto; i++) {
    if (isStopLine(lines[i])) continue;
    const l = lines[i];
    if (Q_STRONG2.test(l)) return questionBlock(lines, i, stopAt);
    if (l.includes('?') && Q_STRONG.test(l)) return questionBlock(lines, i, stopAt);
  }
  // 2) 普通问句
  for (let i = fromIdx; i < upto; i++) {
    if (isStopLine(lines[i])) continue;
    if (looksLikeQuestion(lines[i])) return questionBlock(lines, i, stopAt);
  }
  return null;
}

/* strip sentence-number prefixes used by 14年整理1 */
function deNumberY14(text) {
  let t = text;
  t = t.replace(/(^|\n)\s*1\s*,\s*/g, '$1\u00b6');           // 段首 1, → 段落标记
  t = t.replace(/(^|\n)\s*\d{1,2}\s*,\s*/g, '$1');           // 段内换行续 2, 3,
  t = t.replace(/([.!?])\s+\d{1,2}\s*,\s+(?=[A-Z'“"])/g, '$1 '); // 句间 2,Personally
  t = t.replace(/([.!?])\s+\d{1,2}\s+(?=[A-Z])/g, '$1 ');    // 句间 5 For example
  return t;
}

const PARA_OPENER = /^(in conclusion|to conclude|to summarise|in summary|on the one hand|on the other hand|firstly|secondly|thirdly|finally|in my opinion|personally,|however,|another (point|factor|reason|way|benefit|problem|advantage|disadvantage|explanation|possibility|measure|solution)|i also (believe|agree|disagree|think|feel|accept)|admittedly|of course,|looking at|despite this|at the same time|in terms of|from an economic|as well as|these days|nowadays,|it is (true|no doubt|certainly|obviously) |there are (several|various|many|a number|two|three|some)|people have (different|differing)|when choosing|my own view|i completely (dis)agree|i totally)/i;

function buildParagraphs(lines, forceWrap) {
  const ls = lines.map(l => l.trim()).filter(Boolean);
  if (!ls.length) return { paras: [], mode: 'para' };
  // 判定行模式：para=每行一段(docx)；sent=每行一句；wrap=OCR 硬换行
  let mode = 'wrap';
  if (!forceWrap) {
    const withTerm = ls.filter(l => /[.!?]["')\]’”]*$/.test(l)).length / ls.length;
    const median = (() => { const a = ls.map(l => l.length).sort((x, y) => x - y); return a[Math.floor(a.length / 2)] || 0; })();
    if (median > 130) mode = 'para';
    else if (withTerm > 0.85 && median <= 130) mode = 'sent';
  }
  if (mode === 'para') return { paras: ls, mode };
  // 保护省略号，避免句子切分把 “...” 当句号
  let text = ls.join(' ').replace(/\s+/g, ' ').replace(/\.\.\./g, '\u2026');
  const sentences = text.match(/[^.!?]*[.!?]+["')\]\u2019\u201d]*\s*/g) || [text];
  const paras = []; let cur = [];
  sentences.forEach((raw, i) => {
    const s = raw.trim().replace(/\u2026/g, '...'); if (!s) return;
    const words = s.split(/\s+/).length;
    const opener = PARA_OPENER.test(s) && words >= 6;
    if (i > 0 && opener && cur.length >= 2) { paras.push(cur.join(' ').trim()); cur = []; }
    cur.push(s);
  });
  if (cur.length) paras.push(cur.join(' ').trim().replace(/\u2026/g, '...'));
  return { paras, mode };
}

/* 行内小节课标题（如 'ageing population' topic & problem/solution essay）→ 正文边界 */
const INLINE_TITLE_RE = /^[^\n]{0,55}(topic|essay|question|lesson)\s*$/i;
function isInlineTitle(t) {
  const s = t.trim();
  if (s.length > 60 || TITLE_RE.test(s)) return false;
  if (!/(topic|essay|question|lesson)\s*$/i.test(s)) return false;
  if (/[\u2018'][^\u2018\u2019']{2,40}[\u2019']/.test(s)) return true; // 带引号的主题名
  if (/^(the |a |another |next |this )(video )?lesson/i.test(s)) return true;
  return false;
}

/* 从行数组中截取正文行：从 fromIdx 到终止条件 */
function bodyLines(lines, fromIdx) {
  const out = [];
  for (let i = fromIdx; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) { out.push(''); continue; }
    if (WATERMARK_RE.test(t) || DATE_RE.test(t) || DATE_PAREN_RE.test(t) || NOTE_RE.test(t)) break;
    if (TITLE_RE.test(t)) break;
    if (isInlineTitle(t)) break;
    if (CJK_RE.test(t)) break;
    if (/^https?:\/\//i.test(t)) continue;
    const wm = t.match(WORDS_RE);
    if (wm) {
      const cut = t.slice(0, wm.index).trim();
      if (cut) out.push(cut);
      break;
    }
    out.push(t);
  }
  return out;
}

/* 结论句截断：无词数标记时，正文止于结论段 */
function cutAtConclusion(lines) {
  let last = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^(in conclusion|to conclude|to summarise|in summary|overall,|all things considered|in summary,)/i.test(lines[i].trim())) { last = i; break; }
  }
  if (last >= 0) return lines.slice(0, last + 1);
  return lines;
}

function dropLeadIns(lines) {
  const bad = /^(here('s| is| are)|i('ve| have)|today i|last (week|month)|as (i|promised)|several people|some people have asked|notice|can you|you (can|should|might)|let's|first,|second,|read the|look at|have a look|the (question|essay|exercise) below|people often ask|my (student|friend)|one of my)/i;
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) { i++; continue; }
    if (t.length < 300 && bad.test(t)) { i++; continue; }
    break;
  }
  return lines.slice(i);
}

function makeCandidate(key, rawLines, qInfo, bodyStartIdx, opts) {
  const o = opts || {};
  let lines = bodyLines(rawLines, bodyStartIdx);
  if (o.cutConclusion) lines = cutAtConclusion(lines);
  lines = dropLeadIns(lines);
  const bp = buildParagraphs(lines, o.forceWrap);
  const essay = bp.paras.join('\n\n').replace(/\s*\(\s*\d{2,3}\s*words[^)]*\)\s*$/i, '').replace(/\s+([,.;:!?])/g, '$1').trim();
  const q = (qInfo && qInfo.q ? qInfo.q : '').replace(/\s+/g, ' ').trim();
  return { key, q, essay, paras: bp.paras, mode: o.trueParas ? 'para' : bp.mode, wc: wordCount(essay) };
}

/* 讲解文字混入题干的检测（小写开头 / 课程口吻 / 第一人称） */
const BADQ_RE = /^(i (read|call|think|wrote|did|said|asked|noticed) |confuses|here (are|is) |notice that|today i |as usual|my advice|people often|a few people|before you|some of you|some students|several (people|students)|the (question|essay|task) below|following (on|from)|in last|last (week|month) )/i;
function badQ(q) {
  if (!q) return true;
  if (/^[a-z]/.test(q)) return true;
  if (BADQ_RE.test(q)) return true;
  if (/\b(I|I've|I'm|I'd)\b/.test(q.slice(0, 60))) return true;
  return false;
}

function rejectWhy(c) {
  if (c.wc < 180) return 'short(' + c.wc + ')';
  if (c.essay.length < 2) return 'empty';
  if (LESSON_LABEL_RE.test(c.essay)) return 'lesson-labels';
  if (PLAN_RE.test(c.essay)) return 'plan';
  const numList = (c.essay.match(/(^|\n)\s*\d{1,2}\.\s+[A-Z]/g) || []).length;
  if (numList >= 3) return 'numbered-list';
  if (/^(note|remember|tip|feedback)\b/im.test(c.essay)) return 'note-inline';
  if (/FROM SIMON|Task\s*:\s*Analyse|analyse this paragraph carefully/i.test(c.essay)) return 'lesson-inline';
  if (/^task\s*:/im.test(c.essay)) return 'lesson-inline';
  if (/discussion \+ opinion/i.test(c.essay)) return 'lesson-labels';
  // 题干是讲解文字而非题目
  if (badQ(c.q)) return 'bad-q';
  // 小标题式清单（Positives of tourism: / Benefits of studying abroad: ...）不是连续范文
  const colonHeads = (c.essay.match(/\b(positives|negatives|personal perspective|professional perspective|cultural perspective|economic perspective|opinions?|ideas?|vocabulary|benefits|drawbacks|introduction|conclusion)\s*:\s/gi) || []).length;
  const ofColon = (c.essay.match(/\b(benefits|drawbacks|advantages|disadvantages|positives|negatives) of [^.:?!\n]{2,50}:/gi) || []).length;
  if (colonHeads + ofColon >= 2) return 'bullet-notes';
  if (c.paras.length >= 9) return 'too-many-paras(' + c.paras.length + ')';
  if (c.essay.split('\n\n').length === 1 && c.wc > 460) return 'single-block-long';
  return null;
}

/* ---------------- per-file parsers ---------------- */

/* 博客转储风格：标题/日期/Posted-by 行分段，段内 题目+正文 (9分范文.docx / 整理2 / 整理3) */
function parseBlogDump(key, text) {
  const lines = cleanText(text).split('\n');
  const segs = []; let cur = [];
  const isBoundary = (ln) => {
    const t = ln.trim();
    if (!t) return false;
    return TITLE_RE.test(t) || DATE_RE.test(t) || /^posted by simon/i.test(t);
  };
  for (const ln of lines) {
    if (isBoundary(ln)) { if (cur.length) segs.push(cur); cur = [ln]; continue; }
    cur.push(ln);
  }
  if (cur.length) segs.push(cur);
  const cands = [];
  for (const seg of segs) {
    const first = seg[0].trim();
    if (/^IELTS (Speaking|Reading|Listening)/i.test(first)) continue;
    const isT2 = /^IELTS Writing Task 2/i.test(first);
    if (!isT2 && seg.length < 8) continue;
    const qb = findQuestion(seg, isT2 ? 1 : 0, isT2 ? 12 : 4);
    if (!qb) continue;
    const c = makeCandidate(key, seg, qb, qb.end + 1, { cutConclusion: true });
    if (isT2) c.title = first;
    cands.push(c);
  }
  return cands;
}

/* 页式 PDF：52页范文（只取 task2 页 2-23） */
function pageChunks(rawText) {
  return rawText.replace(/\r\n?/g, '\n').split('===== [page ');
}

function parse52(key, text) {
  const cands = [];
  const chunks = pageChunks(text);
  for (const ch of chunks) {
    const m = ch.match(/^(\d+)\] =====/);
    if (!m) continue;
    const pn = +m[1];
    if (pn < 2 || pn > 23) continue;
    const lines = ch.replace(/^\d+\] =====\n?/, '').split('\n');
    const hasWM = lines.some(l => WORDS_RE.test(l));
    if (!hasWM) continue; // 讲解页/段落练习页跳过
    const qb = findQuestion(lines, 0, 10);
    if (!qb) continue;
    const c = makeCandidate(key, lines, qb, qb.end + 1, { forceWrap: true, cutConclusion: true });
    cands.push(c);
  }
  return cands;
}

/* 页式 PDF：28篇（页 2 起，中文标题+题目+范文：+正文） */
function parse28(key, text) {
  const chunks = pageChunks(text);
  const cands = [];
  for (const ch of chunks) {
    const m = ch.match(/^(\d+)\] =====/);
    if (!m) continue;
    const pn = +m[1];
    if (pn < 2) continue;
    const lines = ch.replace(/^\d+\] =====\n?/, '').split('\n');
    const fanwen = lines.findIndex(l => /范文/.test(l));
    const qb = findQuestion(lines, 0, fanwen > 0 ? fanwen : 8);
    if (!qb) continue;
    const start = fanwen > 0 ? fanwen + 1 : qb.end + 1;
    const c = makeCandidate(key, lines, qb, start, { forceWrap: true, cutConclusion: true });
    cands.push(c);
  }
  return cands;
}

/* 编号条目：9 Band Essays（题干在条目开头，正文止于词数标记） */
function parseNumbered(key, text) {
  const t = cleanText(text);
  const lines = t.split('\n');
  const itemIdx = [];
  lines.forEach((l, i) => { if (/^\d{1,2}\.\s+\S/.test(l.trim())) itemIdx.push(i); });
  const cands = [];
  for (let k = 0; k < itemIdx.length; k++) {
    const from = itemIdx[k], to = k + 1 < itemIdx.length ? itemIdx[k + 1] : lines.length;
    const seg = lines.slice(from, to).map(l => l.replace(/^\s*\d{1,2}\.\s/, '').replace(/\s+$/, ''));
    const qb = findQuestion(seg, 0, 8);
    if (!qb) continue;
    const c = makeCandidate(key, seg, qb, qb.end + 1, { forceWrap: true });
    cands.push(c);
  }
  return cands;
}

/* 编号讲义：大作文1/2/3（课程条目，杂讯多） */
function parseLessons(key, text) {
  const t = cleanText(text);
  const lines = t.split('\n');
  const itemIdx = [];
  lines.forEach((l, i) => { if (/^\s*\d{1,3}\.\s+\S/.test(l) && !/^\s*\d{1,3}\.\s*$/.test(l)) itemIdx.push(i); });
  const cands = [];
  for (let k = 0; k < itemIdx.length; k++) {
    const from = itemIdx[k], to = k + 1 < itemIdx.length ? itemIdx[k + 1] : lines.length;
    const seg = lines.slice(from, to).map(l => l.replace(/^\s*\d{1,3}\.\s*/, ''));
    const qb = findQuestion(seg, 0, 14);
    if (!qb) continue;
    const hasWM = seg.slice(qb.end + 1).some(l => WORDS_RE.test(l));
    const c = makeCandidate(key, seg, qb, qb.end + 1, { forceWrap: true, cutConclusion: !hasWM });
    cands.push(c);
  }
  return cands;
}

/* 14年整理1：句号编号格式 */
function parseY14a(key, text) {
  const t = deNumberY14(cleanText(text));
  const lines = t.split('\n');
  const cands = [];
  let i = 0;
  const stopAtPara = (l) => l.indexOf('\u00b6') === 0;
  while (i < lines.length) {
    const qb = findQuestion(lines, i, 1, stopAtPara);
    if (!qb) { i++; continue; }
    // 正文起点：第一个带编号或¶标记的行
    let start = -1;
    for (let j = qb.end + 1; j < Math.min(lines.length, qb.end + 40); j++) {
      if (/^(\u00b6|\d{1,2},)/.test(lines[j].trim()) || /^\d{1,2}\s+[A-Z]/.test(lines[j].trim())) { start = j; break; }
      if (TITLE_RE.test(lines[j]) || looksLikeQuestion(lines[j])) break;
    }
    if (start < 0) { i = qb.end + 1; continue; }
    // 正文终点：词数标记 / 下一个题目 / 标题
    const seg = [];
    for (let j = start; j < lines.length; j++) {
      const tt = lines[j].trim();
      const wm = tt.match(WORDS_RE);
      if (wm) { const cut = tt.slice(0, wm.index).trim(); if (cut) seg.push(cut); break; }
      if (TITLE_RE.test(tt)) break;
      if (looksLikeQuestion(tt) && j > start + 2 && !/^\d/.test(tt)) break;
      if (isStopLine(tt) && tt.length < 60) break;
      seg.push(tt);
    }
    const joined = seg.join('\n');
    const paras = joined.split('\u00b6').map(p => p.replace(/\s+/g, ' ').trim()).filter(p => wordCount(p) > 0);
    const essay = paras.join('\n\n').replace(/\s*\(\s*\d{2,3}\s*words[^)]*\)\s*$/i, '').trim();
    cands.push({ key, q: qb.q, essay, paras, mode: 'para', wc: wordCount(essay) });
    i = start + 1;
  }
  return cands;
}

/* ---------------- type 分类 ---------------- */
function classify(q) {
  const s = (' ' + q.toLowerCase() + ' ');
  const has2q = (q.match(/\?/g) || []).length >= 2;
  if (/discuss both/.test(s)) return 'discussion';
  const hasAdv = /advantages?|benefits?/.test(s);
  const hasDis = /disadvantages?|drawbacks?/.test(s);
  if ((hasAdv && hasDis) || /outweigh/.test(s)) {
    const opinionish = /do you think|outweigh|your opinion|do you agree|is this a positive/.test(s);
    return opinionish ? 'adv-disadv-opinion' : 'adv-disadv';
  }
  const prob = /(problems?|causes?|consequences?|damaging|damage|threats?|measures|difficulties)/.test(s);
  const sol = /(solutions?|measures|address|tackle|deal with|be done|what can|how can|how could|could be taken|governments? do|individuals? do|can governments|should governments)/.test(s);
  if (prob && sol) return 'problem-solution';
  if (has2q) return 'two-part';
  if (/to what extent|agree or disagree|do you agree|what do you think|your opinion|your view|positive or negative/.test(s)) return 'opinion';
  if (/^ what are the (benefits|advantages|drawbacks|disadvantages)/.test(s)) return 'adv-disadv';
  return 'unknown';
}

/* ---------------- 去重 ---------------- */
function normKey(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 40);
}
function essayHead(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 45).join(' ');
}
function jaccard(a, b) {
  const A = new Set(a.split(' ')), B = new Set(b.split(' '));
  let inter = 0; A.forEach(w => { if (B.has(w)) inter++; });
  return inter / Math.max(1, A.size + B.size - inter);
}

function score(c) {
  const paras = c.paras.length;
  let s = c.wc;
  // docx 真实段落结构最可信；启发式分段的段落数有噪声，封顶 4 段
  const paraBonus = c.mode === 'para' ? 45 : 12;
  const paraCap = c.mode === 'para' ? 5 : 4;
  s += Math.min(paras - 1, paraCap) * paraBonus;
  if (c.mode === 'para') s += 5;
  else if (paras >= 7) s -= 50;                     // 启发式分段过度切分嫌疑
  if (/^here|^i('ve| have)|^today|^notice|^several people/i.test(c.essay)) s -= 120; // 开头混入讲解
  if (/(note|remember|tip|feedback)\s*:/i.test(c.essay)) s -= 200;
  if (/here('s| is) (an example|my plan|the plan|a plan)/i.test(c.essay)) s -= 150;
  if (/\bperma?link\b|\bposted by\b/i.test(c.essay)) s -= 200;
  if (c.essay.split('\n\n').length === 1 && c.wc > 430) s -= 60; // 未分段长块嫌疑
  if (c.essay && /^[a-z]/.test(c.essay)) s -= 40;     // 正文开头截断嫌疑
  if (c.q) {
    if (c.q.length < 90) s -= 55;                     // 题干不完整嫌疑
    if (c.q.length >= 140 && /(to what extent|discuss both|\?)/.test(c.q)) s += 60;
  }
  return s;
}

/* ---------------- main ---------------- */
function main() {
  const all = [];
  all.push(...parseBlogDump('jiuFen', readF('jiuFen')));
  all.push(...parse52('ex52', readF('ex52')));
  all.push(...parseLessons('da1', readF('da1')));
  all.push(...parseLessons('da2', readF('da2')));
  all.push(...parseLessons('da3', readF('da3')));
  all.push(...parseNumbered('band9', readF('band9')));
  all.push(...parse28('p28', readF('p28')));
  all.push(...parseY14a('y14a', readF('y14a')));
  all.push(...parseBlogDump('y14b', readF('y14b')));
  all.push(...parseBlogDump('y14c', readF('y14c')));

  // 质量门槛
  const kept = [], rejected = [];
  for (const c of all) {
    const why = rejectWhy(c);
    (why ? rejected : kept).push(Object.assign(c, why ? { why } : {}));
  }

  // 第一遍去重：题目前 40 字符
  const groups = new Map();
  for (const c of kept) {
    const k = normKey(c.q) || normKey(essayHead(c.essay).replace(/ /g, ''));
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }
  const droppedDup = [];
  // 第二遍去重：正文开头相似（题目残缺/改写导致的漏网同文）
  const glist = [...groups.values()].map(g => g.slice().sort((a, b) => score(b) - score(a)));
  const merged = [];
  for (const g of glist) {
    let hit = null;
    for (const mm of merged) {
      if (jaccard(essayHead(mm[0].essay), essayHead(g[0].essay)) >= 0.62) { hit = mm; break; }
    }
    if (hit) hit.push(...g); else merged.push(g);
  }
  const final = [];
  for (const g of merged) {
    droppedDup.push(...g.slice(1));
    const best = g[0];
    // 组内取最完整的干净题干
    let qBest = '';
    for (const x of g) {
      if (badQ(x.q)) continue;
      if (x.q.length > qBest.length) qBest = x.q;
    }
    final.push(Object.assign({}, best, { q: qBest }));
  }

  // 输出记录
  const records = final.map(c => {
    const type = classify(c.q);
    if (c.q) return { q: c.q, type, src: srcLabel(c.key), essay: c.essay };
    return { q: '', title: c.essay.replace(/\s+/g, ' ').slice(0, 60), type, src: srcLabel(c.key), essay: c.essay };
  });

  // 统计
  const typeCount = {};
  let totalWords = 0;
  records.forEach(r => { typeCount[r.type] = (typeCount[r.type] || 0) + 1; totalWords += wordCount(r.essay); });

  console.log('candidates: ' + all.length + '  kept(gate): ' + kept.length + '  rejected(gate): ' + rejected.length);
  console.log('unique after dedup: ' + records.length + '  deduped away: ' + droppedDup.length);
  console.log('type distribution: ' + JSON.stringify(typeCount));
  console.log('total essay words: ' + totalWords);
  const srcCount = {};
  records.forEach(r => { srcCount[r.src] = (srcCount[r.src] || 0) + 1; });
  console.log('by src: ' + JSON.stringify(srcCount));
  const emptyQ = records.filter(r => !r.q).length;
  console.log('records with empty q: ' + emptyQ);
  const unknown = records.filter(r => r.type === 'unknown');
  console.log('unknown-type: ' + unknown.length);
  unknown.slice(0, 12).forEach(r => console.log('  ? ' + (r.q || r.title).slice(0, 80)));

  if (REVIEW) {
    console.log('\n===== REVIEW: accepted candidates =====');
    final.forEach((c, i) => {
      const tail = c.essay.slice(-55).replace(/\n/g, ' ');
      console.log(`[${i}] ${srcLabel(c.key)} wc=${c.wc} p=${c.paras.length} type=${classify(c.q)}\n    Q: ${(c.q || '(无题干)').slice(0, 110)}\n    H: ${c.essay.slice(0, 70).replace(/\n/g, ' ')}\n    T: ${tail}`);
    });
    console.log('\n===== REVIEW: rejected (>=120 words) =====');
    rejected.filter(c => c.wc >= 120).forEach(c => {
      console.log(`[-] ${srcLabel(c.key)} wc=${c.wc} why=${c.why}\n    Q: ${(c.q || '(无题干)').slice(0, 110)}\n    H: ${c.essay.slice(0, 70).replace(/\n/g, ' ')}`);
    });
    console.log('\n===== REVIEW: deduped-away groups =====');
    const g = {};
    droppedDup.forEach(c => { const k = normKey(c.q) || normKey(essayHead(c.essay)); (g[k] = g[k] || []).push(c); });
    Object.keys(g).forEach(k => {
      console.log(`DUP ${k} (${g[k].length} dropped): ${g[k][0].q.slice(0, 90)}`);
    });
  }

  // 写文件
  const header = '/* data-essays-corpus.js — Simon Task 2 范文全库（自动提取去重） */\n';
  const body = 'const EssayCorpus = [\n' + records.map(r => '  ' + JSON.stringify(r)).join(',\n') + '\n];\n';
  fs.writeFileSync(OUT_FILE, header + body, 'utf8');
  console.log('\nwritten: ' + OUT_FILE + ' (' + records.length + ' records)');
}

main();
