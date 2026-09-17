/* patch-t1-prompts.js — 将核实过的剑15-18 T1题干写入 data-questions-extra.js */
const fs = require("fs");
const prompts = JSON.parse(fs.readFileSync("models/t1-prompts-1518.json", "utf8"));
let src = fs.readFileSync("tool/js/data-questions-extra.js", "utf8");
let patched = 0;
const esc = s => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
for (const [key, v] of Object.entries(prompts)) {
  const re = new RegExp('(\\{ src: "' + key + '"[\\s\\S]*?)t1type: "[^"]*", t1: "[^"]*"');
  const m = src.match(re);
  if (!m) { console.log("NOT FOUND:", key); continue; }
  src = src.replace(re, m[1] + 't1type: "' + v.t1type + '", t1: "' + esc(v.t1) + '"');
  patched++;
}
fs.writeFileSync("tool/js/data-questions-extra.js", src);
console.log("patched", patched);
