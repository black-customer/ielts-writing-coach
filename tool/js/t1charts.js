/* t1charts.js — Task 1 图表渲染引擎（把 data-t1-charts.js 的数据规格画成 SVG/HTML）
 * 支持 kind: line(含虚线预测段/负值) · bar(分组) · pie · table(HTML) · process(蛇形流程) · svg(自定义) · multi(多面板)
 */
const T1Charts = (() => {
  const C = { blue:"#2563eb", green:"#16a34a", red:"#dc2626", amber:"#d97706", purple:"#7c3aed", teal:"#0891b2", pink:"#db2777", brown:"#92400e", slate:"#475569", gray:"#94a3b8", ink:"#334155", grid:"#e2e8f0", soft:"#f1f5f9" };
  const PALETTE = [C.blue, C.red, C.green, C.amber, C.purple, C.teal, C.pink, C.slate];
  const W = 760, PADL = 62, PADR = 18, PADT = 34, PADB = 48;
  const FONT = 'font-family="Segoe UI, Microsoft YaHei, sans-serif"';

  function nice(v) { const p = Math.pow(10, Math.floor(Math.log10(Math.abs(v) || 1))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }

  function legend(items, y, x0) {
    let x = x0 || PADL + 6, out = "";
    items.forEach(it => {
      out += `<rect x="${x}" y="${y - 8}" width="12" height="4" rx="2" fill="${it.color}"/>` +
        `<text x="${x + 16}" y="${y - 3}" font-size="12" fill="${C.ink}" ${FONT}>${esc(it.name)}</text>`;
      x += 20 + it.name.length * 6.6;
    });
    return out;
  }

  // ---------- 折线 ----------
  function lineChart(p) {
    const h = p.height || 300;
    const xl = p.xLabels, n = xl.length;
    let vals = [];
    p.series.forEach(s => (s.dash ? s.data.concat(s.dash) : s.data).forEach(v => vals.push(v)));
    let yMax = p.yMax != null ? p.yMax : nice(Math.max(...vals) * 1.08);
    let yMin = p.yMin != null ? p.yMin : Math.min(0, Math.min(...vals));
    if (yMin < 0) yMin = -nice(-yMin * 1.08);
    const iw = W - PADL - PADR, ih = h - PADT - PADB;
    const X = i => PADL + (n === 1 ? iw / 2 : i * iw / (n - 1));
    const Y = v => PADT + ih - (v - yMin) / (yMax - yMin) * ih;
    let g = "";
    const labelSlots = [];
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      const v = yMin + (yMax - yMin) * i / ticks, y = Y(v);
      g += `<line x1="${PADL}" y1="${y}" x2="${W - PADR}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>` +
        `<text x="${PADL - 8}" y="${y + 4}" font-size="11.5" fill="${C.gray}" text-anchor="end" ${FONT}>${fmt(v)}</text>`;
    }
    const every = p.xTickEvery || (n > 10 ? 2 : 1);
    xl.forEach((lab, i) => { if (i % every === 0 || i === n - 1) g += `<text x="${X(i)}" y="${h - PADB + 18}" font-size="11.5" fill="${C.gray}" text-anchor="middle" ${FONT}>${esc(lab)}</text>`; });
    p.series.forEach((s, si) => {
      const color = s.color || PALETTE[si % PALETTE.length];
      const pts = s.data.map((v, i) => `${X(i)},${Y(v)}`).join(" ");
      if (s.dash && s.dash.length) {
        g += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round"/>`;
        const dpts = s.data.slice(-1).concat(s.dash).map((v, i) => `${X(s.data.length - 1 + i)},${Y(v)}`).join(" ");
        g += `<polyline points="${dpts}" fill="none" stroke="${color}" stroke-width="2.4" stroke-dasharray="6 5"/>`;
        s.dash.forEach((v, i) => { g += `<circle cx="${X(s.data.length + i)}" cy="${Y(v)}" r="3.4" fill="#fff" stroke="${color}" stroke-width="2"/>`; });
      } else {
        g += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round"/>`;
        s.data.forEach((v, i) => { g += `<circle cx="${X(i)}" cy="${Y(v)}" r="3" fill="#fff" stroke="${color}" stroke-width="2"/>`; });
      }
      if (s.label !== false && s.data.length) {
        const li = s.data.length - 1;
        labelSlots.push({ y: Y(s.data[li]), text: s.name, color });
      }
    });
    // 末端标签防重叠：从上到下排序，间距不足 14px 时下移
    labelSlots.sort((a, b) => a.y - b.y);
    for (let i = 1; i < labelSlots.length; i++) {
      if (labelSlots[i].y - labelSlots[i - 1].y < 14) labelSlots[i].y = labelSlots[i - 1].y + 14;
    }
    labelSlots.forEach(l => {
      g += `<text x="${W - PADR - 4}" y="${l.y + 4}" font-size="11.5" fill="${l.color}" font-weight="600" text-anchor="end" ${FONT}>${esc(l.text)}</text>`;
    });
    return { svg: g, h, legend: p.series.map((s, i) => ({ name: s.name, color: s.color || PALETTE[i % PALETTE.length] })) };
  }

  // ---------- 分组柱图 ----------
  function barChart(p) {
    const h = p.height || 300;
    const cats = p.categories, n = cats.length, m = p.series.length;
    let vals = []; p.series.forEach(s => s.data.forEach(v => vals.push(v)));
    const yMax = p.yMax != null ? p.yMax : nice(Math.max(...vals) * 1.1);
    const iw = W - PADL - PADR, ih = h - PADT - PADB;
    const slot = iw / n, bw = Math.min(34, slot * 0.72 / m);
    const Y = v => PADT + ih - v / yMax * ih;
    let g = "";
    for (let i = 0; i <= 5; i++) {
      const v = yMax * i / 5, y = Y(v);
      g += `<line x1="${PADL}" y1="${y}" x2="${W - PADR}" y2="${y}" stroke="${C.grid}"/>` +
        `<text x="${PADL - 8}" y="${y + 4}" font-size="11.5" fill="${C.gray}" text-anchor="end" ${FONT}>${fmt(v)}${p.ySuffix || ""}</text>`;
    }
    cats.forEach((cat, i) => {
      const cx = PADL + slot * i + slot / 2;
      p.series.forEach((s, si) => {
        const v = s.data[i], x = cx - m * bw / 2 + si * bw;
        g += `<rect x="${x + 1}" y="${Y(v)}" width="${bw - 2}" height="${PADT + ih - Y(v)}" rx="3" fill="${s.color || PALETTE[si]}" opacity="0.88"/>`;
      });
      g += `<text x="${cx}" y="${h - PADB + 18}" font-size="11.5" fill="${C.gray}" text-anchor="middle" ${FONT}>${esc(cat)}</text>`;
    });
    return { svg: g, h, legend: p.series.map((s, i) => ({ name: s.name, color: s.color || PALETTE[i] })) };
  }

  // ---------- 饼图 ----------
  function pieChart(p, width) {
    const w = width || W, h = p.height || 270;
    const cx = w * 0.36, cy = h / 2 + 6, r = Math.min(h / 2 - 26, w * 0.26);
    const total = p.slices.reduce((a, s) => a + s.value, 0);
    let a0 = -Math.PI / 2, g = "";
    p.slices.forEach((s, i) => {
      const frac = s.value / total, a1 = a0 + frac * Math.PI * 2;
      const color = s.color || PALETTE[i % PALETTE.length];
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      if (frac >= 0.999) g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.88"/>`;
      else g += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z" fill="${color}" opacity="0.88" stroke="#fff" stroke-width="2"/>`;
      if (frac >= 0.05) {
        const am = (a0 + a1) / 2, lx = cx + r * 0.62 * Math.cos(am), ly = cy + r * 0.62 * Math.sin(am);
        g += `<text x="${lx}" y="${ly + 4}" font-size="12.5" fill="#fff" text-anchor="middle" font-weight="600" ${FONT}>${fmt(frac * 100, 1)}%</text>`;
      }
      a0 = a1;
    });
    let ly = 20;
    p.slices.forEach((s, i) => {
      const color = s.color || PALETTE[i % PALETTE.length];
      g += `<rect x="${w * 0.68}" y="${ly}" width="14" height="14" rx="3" fill="${color}" opacity="0.88"/>` +
        `<text x="${w * 0.68 + 20}" y="${ly + 12}" font-size="13" fill="${C.ink}" ${FONT}>${esc(s.name)} · ${fmt(s.value, 1)}${p.unit || "%"}</text>`;
      ly += 24;
    });
    return { svg: g, h, legend: null, noLegend: true };
  }

  // ---------- 表格（HTML） ----------
  function tableHtml(p) {
    const th = p.headers.map(h2 => `<th>${esc(h2)}</th>`).join("");
    const trs = p.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<td><b>${esc(c)}</b></td>` : `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
    return `<table class="t1table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
  }

  // ---------- 流程图（蛇形布局） ----------
  function processChart(p) {
    const steps = p.steps, cols = p.cols || 3, bw = 214, bh = 62, gapX = 40, gapY = 44;
    const rows = Math.ceil(steps.length / cols);
    const w = cols * bw + (cols - 1) * gapX + 32, h = rows * bh + (rows - 1) * gapY + 40;
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="${C.soft}" rx="10"/>`;
    const pos = i => {
      const r = Math.floor(i / cols), k = i % cols, kk = r % 2 === 0 ? k : cols - 1 - k;
      return { x: 16 + kk * (bw + gapX), y: 22 + r * (bh + gapY) };
    };
    steps.forEach((s, i) => {
      const { x, y } = pos(i);
      const last = i === steps.length - 1;
      g += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="#fff" stroke="${last ? C.green : C.blue}" stroke-width="1.6"/>` +
        `<circle cx="${x + 20}" cy="${y + bh / 2}" r="12" fill="${last ? C.green : C.blue}"/>` +
        `<text x="${x + 20}" y="${y + bh / 2 + 4.5}" font-size="12" fill="#fff" text-anchor="middle" font-weight="700" ${FONT}>${i + 1}</text>` +
        `<foreignObject x="${x + 38}" y="${y + 6}" width="${bw - 48}" height="${bh - 10}"><div xmlns="http://www.w3.org/1999/xhtml" style="font:12.5px/1.35 'Segoe UI',sans-serif;color:#334155;display:table-cell;vertical-align:middle">${esc(s)}</div></foreignObject>`;
      if (i < steps.length - 1) {
        const a = pos(i), b = pos(i + 1);
        if (a.y === b.y) {
          const dir = b.x > a.x ? 1 : -1;
          const x1 = dir > 0 ? a.x + bw : a.x, x2 = dir > 0 ? b.x : b.x + bw, my = a.y + bh / 2;
          g += `<line x1="${x1}" y1="${my}" x2="${x2}" y2="${my}" stroke="${C.slate}" stroke-width="2"/>` +
            `<polygon points="${x2},${my} ${x2 - dir * 8},${my - 4.5} ${x2 - dir * 8},${my + 4.5}" fill="${C.slate}"/>`;
        } else {
          const dir = (a.x < b.x) ? 1 : -1;
          const fx = dir > 0 ? a.x + bw : a.x;
          const my = a.y + bh, ey = b.y + bh / 2, ex = b.x + (dir > 0 ? 0 : bw);
          g += `<path d="M ${fx} ${my} L ${fx} ${my + gapY / 2} L ${ex + (dir > 0 ? -14 : 14)} ${my + gapY / 2} L ${ex + (dir > 0 ? -14 : 14)} ${ey}" fill="none" stroke="${C.slate}" stroke-width="2"/>` +
            `<polygon points="${ex},${ey} ${ex + dir * 8},${ey - 4.5} ${ex + dir * 8},${ey + 4.5}" fill="${C.slate}"/>`;
        }
      }
    });
    if (p.loop) {
      const first = pos(0), lastP = pos(steps.length - 1);
      const y0 = lastP.y + bh + 14, x1 = lastP.x + bw / 2, x2 = first.x + bw / 2;
      g += `<path d="M ${x1} ${y0} L ${x1} ${y0 + 14} L ${x2} ${y0 + 14} L ${x2} ${first.y + bh + 22}" fill="none" stroke="${C.green}" stroke-width="2" stroke-dasharray="6 5"/>` +
        `<polygon points="${x2},${first.y + bh + 20} ${x2 - 5},${first.y + bh + 30} ${x2 + 5},${first.y + bh + 30}" fill="${C.green}"/>` +
        `<text x="${(x1 + x2) / 2}" y="${y0 + 28}" font-size="12" fill="${C.green}" text-anchor="middle" font-weight="600" ${FONT}>${esc(p.loopLabel || "cycle repeats")}</text>`;
    }
    return { svg: g, h: h + (p.loop ? 46 : 0), w, legend: null, noLegend: true, rawW: w };
  }

  function fmt(v, dec) {
    if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString("en-US");
    if (dec != null) return (+v).toFixed(dec).replace(/\.0$/, "");
    return (Math.round(v * 100) / 100).toString();
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  // ---------- 面板渲染 ----------
  function renderPanel(p) {
    let r;
    if (p.kind === "line") r = lineChart(p);
    else if (p.kind === "bar") r = barChart(p);
    else if (p.kind === "pie") r = pieChart(p);
    else if (p.kind === "process") r = processChart(p);
    else if (p.kind === "table") return `<div class="chart-panel"><div class="chart-title">${esc(p.title || "")}</div>${tableHtml(p)}</div>`;
    else if (p.kind === "svg") return `<div class="chart-panel"><div class="chart-title">${esc(p.title || "")}</div><div class="rawsvg">${p.svg}</div></div>`;
    else return "";
    const width = r.rawW || W;
    let out = `<svg viewBox="0 0 ${width} ${r.h}" ${FONT}>`;
    out += `<rect x="0" y="0" width="${width}" height="${r.h}" fill="#fff" rx="10"/>`;
    if (p.title) out += `<text x="${PADL}" y="20" font-size="14.5" font-weight="700" fill="${C.ink}" ${FONT}>${esc(p.title)}</text>`;
    out += r.svg;
    if (r.legend && (p.kind === "bar")) {
      let totalW = 0; r.legend.forEach(it => totalW += 20 + it.name.length * 6.8);
      let lx = width - PADR - totalW; if (lx < PADL) lx = PADL;
      out += legend(r.legend, 18, lx);
    }
    out += `</svg>`;
    return `<div class="chart-panel">${out}</div>`;
  }

  function render(qKey) {
    // 优先：剑桥原书原图（engnovate 原书扫描）
    const img = (typeof T1ChartImgs !== "undefined") ? T1ChartImgs[qKey] : null;
    if (img) return `<div class="chart-panel"><img class="t1img" src="${img}" alt="${esc(qKey)} 原题图表"></div>`;
    // 兜底：SVG 重绘规格（仅当原图缺失时显示）
    const spec = (typeof T1ChartSpecs !== "undefined") ? T1ChartSpecs[qKey] : null;
    if (!spec) return `<p class="hint">（此题图表尚未收录）</p>`;
    const panels = spec.kind === "multi" ? spec.panels : [spec];
    return panels.map(renderPanel).join(`<div class="chart-gap"></div>`);
  }

  function hasImg(qKey) {
    return typeof T1ChartImgs !== "undefined" && !!T1ChartImgs[qKey];
  }

  return { render, hasImg };
})();
