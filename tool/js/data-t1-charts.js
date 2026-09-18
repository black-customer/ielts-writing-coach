/* data-t1-charts.js — 剑15-21 Task 1 图表：原书原图（engnovate 原书扫描，本地 PDF 兜底）
 * T1ChartImgs: qKey → 图片路径；render() 优先显示原图，找不到时才回落到下方 SVG 规格 */
const T1ChartImgs = {
  "剑10 Test 1": "img/t1/c10t1.png",
  "剑10 Test 2": "img/t1/c10t2.png",
  "剑10 Test 3": "img/t1/c10t3.png",
  "剑10 Test 4": "img/t1/c10t4.png",
  "剑11 Test 1": "img/t1/c11t1.png",
  "剑11 Test 2": "img/t1/c11t2.png",
  "剑11 Test 3": "img/t1/c11t3.png",
  "剑11 Test 4": "img/t1/c11t4.png",
  "剑12 Test 1": "img/t1/c12t1.png",
  "剑12 Test 2": "img/t1/c12t2.png",
  "剑12 Test 3": "img/t1/c12t3.png",
  "剑12 Test 4": "img/t1/c12t4.png",
  "剑13 Test 1": "img/t1/c13t1.png",
  "剑13 Test 2": "img/t1/c13t2.png",
  "剑13 Test 3": "img/t1/c13t3.png",
  "剑13 Test 4": "img/t1/c13t4.png",
  "剑14 Test 1": "img/t1/c14t1.png",
  "剑14 Test 2": "img/t1/c14t2.png",
  "剑14 Test 3": "img/t1/c14t3.png",
  "剑14 Test 4": "img/t1/c14t4.png",
  "剑15 Test 1": "img/t1/c15t1.png",
  "剑15 Test 2": "img/t1/c15t2.png",
  "剑15 Test 3": "img/t1/c15t3.png",
  "剑15 Test 4": "img/t1/c15t4.png",
  "剑16 Test 1": "img/t1/c16t1.png",
  "剑16 Test 2": "img/t1/c16t2.png",
  "剑16 Test 3": "img/t1/c16t3.png",
  "剑16 Test 4": "img/t1/c16t4.png",
  "剑17 Test 1": "img/t1/c17t1.png",
  "剑17 Test 2": "img/t1/c17t2.png",
  "剑17 Test 3": "img/t1/c17t3.png",
  "剑17 Test 4": "img/t1/c17t4.png",
  "剑18 Test 1": "img/t1/c18t1.png",
  "剑18 Test 2": "img/t1/c18t2.png",
  "剑18 Test 3": "img/t1/c18t3.png",
  "剑18 Test 4": "img/t1/c18t4.png",
  "剑19 Test 1": "img/t1/c19t1.png",
  "剑19 Test 2": "img/t1/c19t2.png",
  "剑19 Test 3": "img/t1/c19t3.png",
  "剑19 Test 4": "img/t1/c19t4.png",
  "剑20 Test 1": "img/t1/c20t1.png",
  "剑20 Test 2": "img/t1/c20t2.png",
  "剑20 Test 3": "img/t1/c20t3.png",
  "剑20 Test 4": "img/t1/c20t4.png",
  "剑21 Test 1": "img/t1/c21t1.jpg",
  "剑21 Test 2": "img/t1/c21t2.jpg",
  "剑21 Test 3": "img/t1/c21t3.jpg",
  "剑21 Test 4": "img/t1/c21t4.jpg"
};

const T1ChartSpecs = (() => {
  const BLUE = "#2563eb", RED = "#dc2626", GREEN = "#16a34a", AMBER = "#d97706", PURPLE = "#7c3aed", TEAL = "#0891b2", PINK = "#db2777", SLATE = "#475569";
  const FONT = 'font-family="Segoe UI, Microsoft YaHei, sans-serif"';

  // ---------- 地图小工具 ----------
  function label(x, y, t, size = 12, fill = "#334155", anchor = "middle", weight = "normal") {
    return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" ${FONT}>${t}</text>`;
  }
  function box(x, y, w, h, fill, stroke = "#64748b", rx = 4, dash = "") {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
  }
  function mapFrame(titleA, titleB) {
    return `<rect x="0" y="0" width="760" height="470" fill="#f8fafc" rx="10"/>` +
      `<rect x="30" y="34" width="330" height="400" fill="#fff" stroke="#cbd5e1" rx="8"/>` +
      `<rect x="400" y="34" width="330" height="400" fill="#fff" stroke="#cbd5e1" rx="8"/>` +
      label(195, 26, titleA, 14, "#334155", "middle", "700") +
      label(565, 26, titleB, 14, "#1d4ed8", "middle", "700");
  }

  // 剑16 Test 3 机场
  function svgAirport() {
    let s = mapFrame("Southwest Airport · now", "after redevelopment next year");
    const plane = (x, y) => `<text x="${x}" y="${y}" font-size="11" fill="#64748b">✈ gate</text>`;
    // 现在
    s += box(60, 70, 270, 220, "#f1f5f9");
    s += box(80, 90, 130, 26, "#cbd5e1") + label(145, 107, "Check-in");
    s += box(225, 90, 85, 26, "#e2e8f0") + label(267, 107, "Security");
    s += box(80, 128, 60, 22, "#fde68a") + label(110, 143, "Café", 11);
    s += `<line x1="195" y1="130" x2="195" y2="240" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>` + label(210, 185, "walkway", 11, "#64748b", "start");
    for (let i = 0; i < 8; i++) {
      const gx = 80 + (i % 4) * 62, gy = i < 4 ? 160 : 230;
      s += box(gx, gy, 46, 40, "#e2e8f0", "#94a3b8") + label(gx + 23, gy + 24, "G" + (i + 1), 12);
    }
    s += label(195, 322, "8 gates · walk to gates · café only", 11.5, "#64748b");
    // 改造后
    s += box(430, 70, 270, 220, "#f1f5f9");
    s += box(450, 90, 90, 26, "#cbd5e1") + label(495, 107, "Check-in");
    s += box(548, 90, 76, 26, "#bfdbfe", BLUE) + label(586, 107, "Bag drop", 11);
    s += box(632, 90, 52, 26, "#e2e8f0") + label(658, 107, "Café", 10);
    s += box(450, 128, 150, 24, "#fecaca", "#ef4444") + label(525, 144, "Security (moved)", 10.5);
    s += `<line x1="520" y1="160" x2="520" y2="245" stroke="#2563eb" stroke-width="5" stroke-dasharray="8 5"/>`;
    s += `<rect x="500" y="196" width="42" height="16" rx="8" fill="#2563eb"/>` + label(521, 208, "train", 9.5, "#fff");
    for (let i = 0; i < 10; i++) {
      const gx = 450 + (i % 5) * 51, gy = i < 5 ? 252 : 160;
      s += box(gx, gy, 42, 36, "#bfdbfe", BLUE) + label(gx + 21, gy + 22, "G" + (i + 1), 11.5);
    }
    s += box(560, 128, 62, 24, "#fde68a") + label(591, 144, "Shop", 10.5);
    s += label(565, 322, "10 gates · sky train · bag drop · café + shop", 11.5, "#1d4ed8");
    return `<svg viewBox="0 0 760 360" ${FONT}>${s}</svg>`;
  }

  // 剑17 Test 1 Norbiton
  function svgNorbiton() {
    let s = mapFrame("Norbiton industrial area · now", "planned future development");
    const river = x => `<path d="M ${x} 34 L ${x} 434" stroke="#93c5fd" stroke-width="26" fill="none"/>` + label(x + 22, 240, "river", 11, "#3b82f6", "middle");
    // 现在：主路环 + 工厂
    s += river(318);
    s += `<rect x="70" y="90" width="200" height="150" rx="40" fill="none" stroke="#94a3b8" stroke-width="7"/>` + label(170, 84, "main road", 11, "#64748b");
    s += `<circle cx="78" cy="165" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>` + label(78, 196, "roundabout", 10, "#64748b");
    [[110, 110], [170, 110], [230, 110], [140, 170], [200, 170]].forEach(p => {
      s += box(p[0], p[1], 48, 32, "#cbd5e1") + label(p[0] + 24, p[1] + 20, "factory", 9.5);
    });
    s += box(90, 262, 90, 30, "#d9f99d") + label(135, 281, "school", 11);
    s += `<path d="M 322 300 L 430 300 L 430 434" stroke="#a3e635" stroke-width="3" fill="none" opacity="0.6"/>`;
    s += box(330, 310, 90, 100, "#ecfccb", "#a3a3a3") + label(375, 365, "farmland", 11);
    s += label(195, 415, "a ring road, factories, one school", 11.5, "#64748b");
    // 规划后
    s += river(688);
    s += `<rect x="440" y="90" width="200" height="150" rx="40" fill="none" stroke="#94a3b8" stroke-width="7"/>`;
    s += `<circle cx="448" cy="165" r="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>`;
    s += `<circle cx="632" cy="165" r="14" fill="#bfdbfe" stroke="${BLUE}" stroke-width="2"/>` + label(632, 196, "new", 10, BLUE);
    for (let i = 0; i < 12; i++) {
      const hx = 470 + (i % 4) * 44, hy = 108 + Math.floor(i / 4) * 42;
      s += box(hx, hy, 26, 20, "#bfdbfe", BLUE, 3);
    }
    s += box(470, 262, 60, 26, "#d9f99d") + label(500, 280, "school", 10.5);
    s += box(536, 262, 66, 26, "#bfdbfe", BLUE) + label(569, 280, "playground", 9);
    s += box(470, 300, 70, 26, "#fde68a", BLUE) + label(505, 318, "shops", 10.5);
    s += `<rect x="700" y="150" width="22" height="120" fill="#e2e8f0"/>` + label(712, 292, "bridge", 10, BLUE);
    s += box(700, 310, 26, 90, "#bfdbfe", BLUE, 3);
    s += label(565, 415, "houses everywhere, shops, bridge, playground", 11.5, "#1d4ed8");
    return `<svg viewBox="0 0 760 440" ${FONT}>${s}</svg>`;
  }

  // 剑18 Test 3 图书馆
  function svgLibrary() {
    let s = mapFrame("Central library · 20 years ago", "the same library now");
    const floor = (ox) => {
      let f = box(ox + 20, 60, 300, 330, "#f8fafc", "#94a3b8", 6);
      f += box(ox + 150, 374, 60, 16, "#fff") + label(ox + 180, 386, "entrance", 9);
      return f;
    };
    s += floor(30); s += floor(400);
    // 20年前
    for (let i = 0; i < 3; i++) s += box(60 + i * 8, 150 + i * 46, 220, 22, "#cbd5e1") + label(170, 165 + i * 46, "bookshelves", 10);
    s += box(230, 330, 80, 24, "#e2e8f0") + label(270, 346, "enquiry desk", 9);
    s += box(42, 80, 90, 46, "#e2e8f0") + label(87, 106, "newspapers", 9.5);
    s += box(230, 74, 80, 52, "#e2e8f0") + label(270, 96, "CDs &", 9.5) + label(270, 110, "videos", 9.5);
    s += box(42, 300, 100, 60, "#d9f99d") + label(92, 334, "children's", 10);
    s += label(180, 415, "books first · staffed desk", 11.5, "#64748b");
    // 现在
    for (let i = 0; i < 2; i++) s += box(430 + i * 8, 150 + i * 46, 160, 22, "#bfdbfe", BLUE) + label(520, 165 + i * 46, "sofas & study tables", 9.5);
    s += box(630, 330, 80, 24, "#fde68a", BLUE) + label(670, 346, "café", 10);
    s += box(412, 80, 90, 46, "#bfdbfe", BLUE) + label(457, 100, "self-service", 9) + label(457, 113, "machines", 9);
    s += box(630, 74, 80, 52, "#bfdbfe", BLUE) + label(670, 96, "storytelling", 9.5) + label(670, 110, "events", 9.5);
    s += box(412, 300, 100, 60, "#d9f99d") + label(462, 334, "children's books", 9.5);
    s += label(565, 415, "space for people · self-service · café", 11.5, "#1d4ed8");
    return `<svg viewBox="0 0 760 440" ${FONT}>${s}</svg>`;
  }

  // 剑19 Test 2 海港
  function svgHarbour() {
    let s = mapFrame("The harbour in 2000", "the same harbour today");
    const sea = ox => `<rect x="${ox + 20}" y="250" width="300" height="170" fill="#bfdbfe"/>` + label(ox + 40, 400, "sea", 12, "#1d4ed8", "start");
    s += sea(30); s += sea(400);
    const pier = (ox, x, w, color, label1, label2) => {
      let p2 = box(ox + x, 236, w, 26, color) + label(ox + x + w / 2, 253, label1, 10.5);
      const boats = label2 || "";
      for (let i = 0; i < 4; i++) p2 += `<path d="M ${ox + x + 12 + i * ((w - 30) / 3.4)} 292 q 8 10 16 0 z" fill="#1d4ed8"/>`;
      p2 += label(ox + x + w / 2, 312, boats, 10.5, "#1e40af");
      return p2;
    };
    // 2000
    s += pier(30, 120, 130, "#e2e8f0", "fishing pier", "fishing boats");
    s += box(60, 150, 70, 70, "#cbd5e1") + label(95, 190, "warehouses", 10);
    s += pier(30, 30, 76, "#e2e8f0", "marina");
    s += box(200, 190, 60, 24, "#fde68a") + label(230, 206, "café", 10.5);
    s += box(280, 176, 60, 60, "#e2e8f0") + label(310, 200, "ferry", 10.5) + label(310, 214, "terminal", 10.5);
    s += label(195, 440, "fishing boats · warehouses · small marina", 11.5, "#64748b");
    // 今天
    s += pier(400, 120, 130, "#bfdbfe", "yacht pier", "private yachts");
    s += box(430, 150, 70, 70, "#bfdbfe", BLUE) + label(465, 178, "apartments", 9.5) + label(465, 192, "& restaurants", 9.5);
    s += pier(400, 20, 130, "#bfdbfe", "marina (extended)");
    s += box(560, 216, 130, 24, "#fde68a", BLUE) + label(625, 232, "cafés & boutiques", 10);
    s += box(650, 176, 60, 60, "#e2e8f0") + label(680, 200, "ferry", 10.5) + label(680, 214, "terminal", 10.5);
    s += label(565, 440, "yachts · apartments · bigger marina · shops", 11.5, "#1d4ed8");
    return `<svg viewBox="0 0 760 460" ${FONT}>${s}</svg>`;
  }

  // 剑20 Test 2 农场
  function svgFarm() {
    let s = mapFrame("The farm site in 1950", "the same site today");
    const fields = ox => {
      let f = `<rect x="${ox + 30}" y="50" width="320" height="380" fill="#ecfccb" stroke="#d9e8c2"/>`;
      f += label(ox + 180, 70, "fields", 11, "#65a30d");
      return f;
    };
    s += fields(20); s += fields(390);
    // 1950
    s += box(140, 160, 70, 44, "#fef3c7") + label(175, 186, "farmhouse", 10);
    s += box(226, 160, 60, 44, "#cbd5e1") + label(256, 186, "barn", 10);
    s += box(140, 216, 54, 30, "#e2e8f0") + label(167, 234, "dairy", 9.5);
    s += box(204, 216, 50, 30, "#e2e8f0") + label(229, 234, "sheep", 9.5);
    s += `<circle cx="270" cy="230" r="9" fill="#bfdbfe" stroke="#64748b"/>` + label(270, 256, "well", 9);
    s += `<path d="M 60 396 L 380 396" stroke="#94a3b8" stroke-width="4"/>` + label(120, 388, "lane", 10, "#64748b");
    s += label(195, 340, "a working farm in the middle of fields", 11.5, "#64748b");
    // 今天
    s += box(540, 156, 84, 52, "#bfdbfe", BLUE) + label(582, 186, "farmhouse", 10) + label(582, 199, "(extended)", 8.5, BLUE);
    s += box(636, 156, 66, 52, "#bfdbfe", BLUE) + label(669, 178, "barn →", 10) + label(669, 192, "dwelling", 10);
    s += box(540, 216, 70, 30, "#d9f99d") + label(575, 234, "lawn", 9.5);
    s += box(620, 216, 80, 30, "#bfdbfe", BLUE) + label(660, 234, "driveway", 9.5);
    for (let i = 0; i < 6; i++) s += box(440 + (i % 3) * 34, 120 + Math.floor(i / 3) * 36, 26, 22, "#bfdbfe", BLUE, 3);
    s += box(436, 200, 106, 60, "#fde68a", BLUE) + label(489, 226, "housing estate", 9.5) + label(489, 240, "+ car park", 9);
    s += box(430, 330, 130, 60, "#ecfccb", "#a3e635") + label(495, 364, "farmland", 10.5);
    s += `<path d="M 420 400 L 730 400" stroke="#475569" stroke-width="9"/>` + label(560, 390, "main road", 10, "#334155");
    s += `<circle cx="628" cy="400" r="6" fill="${BLUE}"/>` + label(640, 418, "bus stop", 10, BLUE, "start");
    s += label(565, 90, "housing estate + converted barn + road", 11.5, "#1d4ed8");
    return `<svg viewBox="0 0 760 440" ${FONT}>${s}</svg>`;
  }

  // 剑21 Test 2 大学咖啡馆
  function svgCafe() {
    let s = mapFrame("College cafe · before", "after redesign");
    // before
    s += box(60, 80, 270, 220, "#f8fafc", "#94a3b8", 6);
    s += box(80, 96, 220, 30, "#cbd5e1") + label(190, 115, "long counter", 11);
    s += box(80, 66, 120, 16, "#e2e8f0") + label(140, 78, "kitchen", 9.5);
    for (let i = 0; i < 6; i++) {
      const tx = 92 + (i % 3) * 84, ty = 160 + Math.floor(i / 3) * 56;
      s += `<circle cx="${tx + 20}" cy="${ty + 20}" r="17" fill="#e2e8f0" stroke="#94a3b8"/>`;
    }
    s += label(250, 290, "door", 10, "#64748b");
    s += label(195, 322, "rows of tables · nothing for studying", 11.5, "#64748b");
    // after
    s += box(400, 60, 300, 250, "#f8fafc", BLUE, 6);
    s += box(420, 76, 130, 26, "#cbd5e1") + label(485, 93, "serving point", 10);
    s += box(558, 76, 46, 26, "#bfdbfe", BLUE) + label(581, 93, "self-", 8.5) + label(581, 99, "", 8);
    s += box(612, 76, 70, 26, "#bfdbfe", BLUE) + label(647, 93, "storage→seats", 8.5);
    for (let i = 0; i < 3; i++) {
      const tx = 424 + i * 92;
      s += box(tx, 150, 70, 22, "#bfdbfe", BLUE, 4) + label(tx + 35, 165, "high table", 8.5);
      s += `<circle cx="${tx + 60}" cy="${145}" r="4" fill="${RED}"/>`;
    }
    s += label(700, 140, "⚡", 11, RED);
    s += box(420, 210, 110, 60, "#fde68a", BLUE) + label(475, 244, "sofa corner", 10.5);
    for (let i = 0; i < 4; i++) s += `<circle cx="${560 + i * 40}" cy="${230 + (i % 2) * 40}" r="8" fill="#86efac" stroke="#16a34a"/>`;
    s += label(700, 290, "door", 10, "#64748b");
    s += label(550, 322, "high tables + sockets · sofas · plants", 11.5, "#1d4ed8");
    return `<svg viewBox="0 0 760 350" ${FONT}>${s}</svg>`;
  }

  // 剑21 Test 3 雨影沙漠（自然场景）
  function svgRainShadow() {
    let s = `<rect x="0" y="0" width="760" height="430" fill="#eff6ff" rx="10"/>`;
    s += `<rect x="0" y="330" width="760" height="100" fill="#dbeafe"/>` + label(60, 396, "ocean", 13, "#1d4ed8");
    // 山
    s += `<path d="M 380 330 L 520 110 L 660 330 Z" fill="#a8a29e"/>`;
    s += `<path d="M 380 330 L 520 110 L 450 330 Z" fill="#4ade80" opacity="0.55"/>`;
    s += `<path d="M 520 110 L 660 330 L 580 330 Z" fill="#fcd34d" opacity="0.75"/>`;
    s += label(430, 320, "windward", 11, "#166534", "middle", "700");
    s += label(612, 320, "leeward", 11, "#92400e", "middle", "700");
    // 湿气箭头
    s += `<path d="M 90 300 Q 240 300 380 220" fill="none" stroke="${BLUE}" stroke-width="5"/>` + `<polygon points="384,216 366,222 374,236" fill="${BLUE}"/>`;
    s += label(170, 282, "warm, moist air", 12, BLUE, "middle", "600");
    // 上升冷却降雨
    s += `<path d="M 400 200 Q 450 140 505 118" fill="none" stroke="${BLUE}" stroke-width="5"/>` + `<polygon points="510,116 492,120 500,134" fill="${BLUE}"/>`;
    s += label(432, 176, "air rises & cools", 11.5, "#1e40af", "start");
    [[452, 96], [492, 84], [532, 92]].forEach(c => {
      s += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="26" ry="13" fill="#e2e8f0" stroke="#94a3b8"/>`;
      for (let i = 0; i < 3; i++) s += `<line x1="${c[0] - 12 + i * 12}" y1="${c[1] + 16}" x2="${c[0] - 12 + i * 12}" y2="${c[1] + 30}" stroke="${BLUE}" stroke-width="2.4"/>`;
    });
    s += label(492, 60, "clouds & heavy rain", 12, "#334155", "middle", "600");
    // 下沉干热
    s += `<path d="M 545 120 Q 620 200 680 300" fill="none" stroke="${RED}" stroke-width="5"/>` + `<polygon points="684,306 668,298 662,312" fill="${RED}"/>`;
    s += label(668, 210, "dry air sinks", 11.5, "#b91c1c", "start");
    s += label(668, 228, "& warms", 11.5, "#b91c1c", "start");
    s += `<circle cx="700" cy="60" r="20" fill="#fbbf24"/>`;
    s += label(628, 356, "RAIN-SHADOW DESERT", 13, "#92400e", "middle", "700");
    s += label(120, 356, "lush & green", 12, "#166534", "middle", "600");
    return `<svg viewBox="0 0 760 430" ${FONT}>${s}</svg>`;
  }

  return {
    "剑15 Test 1": { kind: "bar", title: "Coffee and tea buying and drinking habits in five Australian cities (% of residents, last 4 weeks)", categories: ["Sydney", "Melbourne", "Brisbane", "Adelaide", "Hobart"], yLabel: "%", series: [
      { name: "Went to a café for coffee/tea", color: BLUE, data: [63, 64, 55, 49, 63] },
      { name: "Bought instant coffee", color: AMBER, data: [46, 48, 55, 50, 55] },
      { name: "Bought fresh coffee", color: GREEN, data: [44, 43, 34, 31, 38] }
    ] },
    "剑15 Test 2": { kind: "line", title: "Tourists visiting a Caribbean island, 2010-2017 (millions)", xLabels: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], yLabel: "millions", series: [
      { name: "Total", color: SLATE, data: [1.0, 1.25, 1.5, 1.5, 2.0, 2.5, 2.5, 3.5] },
      { name: "Staying on cruise ships", color: RED, data: [0.25, 0.5, 0.4, 0.7, 1.0, 1.3, 1.6, 2.0] },
      { name: "Staying on the island", color: BLUE, data: [0.75, 1.0, 1.25, 1.5, 1.5, 1.5, 1.5, 1.5] }
    ] },
    "剑15 Test 3": { kind: "process", title: "How instant noodles are produced", steps: ["Flour delivered from storage silos", "Mixed with oil and water → dough", "Passed through rollers → sheets", "Cut into thin strips", "Formed into round noodle discs", "Cooked in boiling oil", "Dried", "Filled into cups with vegetables & spices, sealed & labelled"] },
    "剑15 Test 4": { kind: "multi", panels: [
      { kind: "pie", title: "What anthropology graduates did after their degree", slices: [
        { name: "Full-time work", value: 52, color: BLUE }, { name: "Part-time work", value: 15, color: TEAL },
        { name: "Unemployed", value: 12, color: RED }, { name: "Full-time postgrad study", value: 8, color: AMBER },
        { name: "Part-time work + study", value: 5, color: PURPLE }, { name: "Unknown", value: 8, color: " #94a3b8" }
      ] },
      { kind: "table", title: "Salaries of anthropologists in work after five years (% earning each band)", headers: ["Salary band", "Freelance", "Government", "Private sector"], rows: [
        ["$100,000+", "40%", "50%", "30%"], ["$75,000-99,999", "40%", "30%", "25%"],
        ["$50,000-74,999", "15%", "15%", "35%"], ["$25,000-49,999", "5%", "5%", "10%"]
      ] }
    ] },
    "剑16 Test 1": { kind: "multi", panels: [
      { kind: "line", title: "Ownership of electrical appliances (% of households)", xLabels: [1920, 1950, 1960, 1980, 2000, 2019], yMax: 100, series: [
        { name: "Refrigerator", color: BLUE, data: [0, 60, 80, 100, 100, 100] },
        { name: "Vacuum cleaner", color: RED, data: [30, 65, 75, 90, 98, 100] },
        { name: "Washing machine", color: GREEN, data: [40, 48, 55, 62, 70, 75] }
      ] },
      { kind: "line", title: "Time spent on housework (hours per week)", xLabels: [1920, 1950, 1960, 1980, 2000, 2019], yMax: 60, series: [
        { name: "Hours per week", color: PURPLE, data: [50, 20, 18, 14, 12, 10] }
      ] }
    ] },
    "剑16 Test 2": { kind: "process", title: "How sugar is produced from sugar cane", steps: ["Grow sugar cane (12-18 months)", "Harvest by machine or by hand", "Crush in a mill → raw juice", "Filter the juice", "Heat in evaporator → syrup", "Centrifuge → sugar crystals", "Dry and cool the sugar"] },
    "剑16 Test 3": { kind: "svg", title: "Southwest Airport: now and after redevelopment", svg: svgAirport() },
    "剑16 Test 4": { kind: "process", title: "How plastic bottles are recycled", steps: ["Bottles dropped into recycling bins", "Collected by lorry", "Sorted at a recycling centre", "Compressed into large blocks", "Crushed into small pieces", "Washed thoroughly", "Melted down → pellets", "Heated & rolled into sheets", "Made into new products"] },
    "剑17 Test 1": { kind: "svg", title: "Norbiton industrial area: now and planned development", svg: svgNorbiton() },
    "剑17 Test 2": { kind: "multi", panels: [
      { kind: "table", title: "Where the police budget came from", headers: ["Source", "2017", "2018"], rows: [
        ["National government", "£175.5m", "£177.8m"], ["Local taxes", "£91.2m", "£102.3m"], ["Other", "£38.0m", "£38.5m"], ["Total", "£304.7m", "£318.6m"]
      ] },
      { kind: "pie", title: "Spending 2017", height: 230, slices: [{ name: "Salaries", value: 75, color: BLUE }, { name: "Buildings", value: 17, color: AMBER }, { name: "Technology", value: 8, color: GREEN }] },
      { kind: "pie", title: "Spending 2018", height: 230, slices: [{ name: "Salaries", value: 69, color: BLUE }, { name: "Buildings", value: 17, color: AMBER }, { name: "Technology", value: 14, color: GREEN }] }
    ] },
    "剑17 Test 3": { kind: "bar", title: "How families spent their weekly income (% in each category)", categories: ["Food", "Housing", "Transport", "Leisure", "Clothing", "Household goods", "Personal items"], series: [
      { name: "1968", color: " #94a3b8", data: [35, 10, 8, 6, 10, 8, 7] },
      { name: "2018", color: BLUE, data: [17, 19, 11, 13, 5, 6, 5] }
    ] },
    "剑17 Test 4": { kind: "line", title: "Shop closures and openings in one country, 2011-2018", xLabels: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018], yLabel: "shops", series: [
      { name: "Openings", color: GREEN, data: [8500, 4000, 6000, 6500, 6800, 5000, 4000, 3000] },
      { name: "Closures", color: RED, data: [7000, 600, 3500, 7000, 6500, 5000, 4000, 3000] }
    ] },
    "剑18 Test 1": { kind: "line", title: "Urban population in four Asian countries, 1970-2020 (predicted to 2030)", xLabels: [1970, 1980, 1990, 2000, 2010, 2020, 2030], yLabel: "%", yMax: 100, series: [
      { name: "Malaysia", color: BLUE, data: [30, 40, 50, 60, 66, 70], dash: [78] },
      { name: "Philippines", color: RED, data: [30, 35, 40, 44, 48, 50], dash: [56] },
      { name: "Thailand", color: GREEN, data: [20, 25, 31, 38, 45, 50], dash: [58] },
      { name: "Indonesia", color: AMBER, data: [15, 20, 26, 32, 38, 42], dash: [55] }
    ] },
    "剑18 Test 2": { kind: "bar", title: "US households by annual income (millions)", categories: ["<$25k", "$25-49.9k", "$50-74.9k", "$75-99.9k", "$100k+"], yLabel: "millions", series: [
      { name: "2007", color: " #94a3b8", data: [26, 29.5, 24.5, 16, 18] },
      { name: "2011", color: AMBER, data: [26.5, 29.5, 24.5, 16.5, 19] },
      { name: "2015", color: BLUE, data: [27, 30, 25, 18, 26] }
    ] },
    "剑18 Test 3": { kind: "svg", title: "A public library: 20 years ago and now", svg: svgLibrary() },
    "剑18 Test 4": { kind: "line", title: "Average monthly change in copper, nickel and zinc prices, 2014 (%)", xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], yLabel: "% change", yMin: -8, yMax: 10, series: [
      { name: "Nickel", color: RED, data: [1, 3, 8, 4, 0, -5, -3, -2, 1, 2, 1, 1] },
      { name: "Copper", color: BLUE, data: [-2, -3, -3, -2, -1, -1, 0, 1, 1, 2, 2, 2] },
      { name: "Zinc", color: GREEN, data: [3, 2, 1, -1, -2, -3, -1, 0, 1, 1, 0, 1] }
    ] },
    "剑19 Test 1": { kind: "line", title: "Participation in eight activities at one social centre in Melbourne, 2000-2020", xLabels: [2000, 2005, 2010, 2015, 2020], yLabel: "people", height: 330, series: [
      { name: "Film club", color: BLUE, data: [65, 66, 67, 68, 68] },
      { name: "Yoga", color: RED, data: [0, 3, 25, 40, 55] },
      { name: "Pilates", color: GREEN, data: [0, 0, 28, 42, 55] },
      { name: "Middle Eastern dance", color: AMBER, data: [18, 22, 25, 28, 30] },
      { name: "Amateur dramatics", color: PURPLE, data: [28, 28, 27, 28, 28] },
      { name: "Musical performances", color: TEAL, data: [12, 12, 11, 12, 12] },
      { name: "Table tennis", color: " #94a3b8", data: [15, 12, 9, 7, 5] },
      { name: "Martial arts", color: PINK, data: [35, 30, 25, 20, 15] }
    ] },
    "剑19 Test 2": { kind: "svg", title: "A harbour: 2000 and today", svg: svgHarbour() },
    "剑19 Test 3": { kind: "process", title: "How ethanol (a biofuel) is produced and used", loop: true, loopLabel: "CO₂ absorbed by trees again — the cycle repeats", steps: ["Trees absorb sunlight & CO₂ while growing", "Harvested by machine", "Stored until needed", "Chipped into small pieces", "Processed → cellulose extracted", "Cellulose converted into sugars", "Sugars fermented → ethanol", "Ethanol fuels cars & lorries", "Engines release CO₂ into the air"] },
    "剑19 Test 4": { kind: "multi", panels: [
      { kind: "pie", title: "Where young people attend dance classes", slices: [
        { name: "Private studios", value: 48, color: BLUE }, { name: "School halls (after lessons)", value: 24, color: TEAL },
        { name: "Community halls", value: 18, color: AMBER }, { name: "College-based studios", value: 10, color: PURPLE }
      ] },
      { kind: "bar", title: "Number of students by type of dance", categories: ["Ballet", "Modern", "Tap", "Ballroom", "Folk"], series: [{ name: "Students", color: BLUE, data: [600, 510, 450, 300, 90] }] }
    ] },
    "剑20 Test 1": { kind: "multi", panels: [
      { kind: "table", title: "Total population of New York City", headers: ["Year", "1800", "1850", "1900", "1950", "2000"], rows: [["Population", "60,000", "515,000", "3.4m", "7.9m", "8.0m"]] },
      { kind: "table", title: "Population by borough", headers: ["Borough", "1800", "1900", "1950", "2000"], rows: [
        ["Manhattan", "60,000", "1.85m", "1.96m", "1.54m"], ["Brooklyn", "1,600", "1.17m", "2.74m", "2.47m"],
        ["Bronx", "—", "0.20m", "1.44m", "1.33m"], ["Queens", "—", "0.15m", "1.55m", "2.23m"], ["Staten Island", "—", "0.07m", "0.17m", "0.44m"]
      ] }
    ] },
    "剑20 Test 2": { kind: "svg", title: "A farm site: 1950 and today", svg: svgFarm() },
    "剑20 Test 3": { kind: "multi", panels: [
      { kind: "line", title: "Annual visits to Little Chalfont library", xLabels: [2000, 2010, 2020], yLabel: "visits", series: [{ name: "Visits", color: BLUE, data: [40000, 65000, 80000] }] },
      { kind: "bar", title: "Reasons for visiting (% of visits)", categories: ["Borrow books", "Use computers", "Attend events", "Study on site"], yMax: 70, series: [
        { name: "2000", color: " #94a3b8", data: [60, 5, 0, 35] }, { name: "2020", color: BLUE, data: [30, 40, 20, 10] }
      ] }
    ] },
    "剑20 Test 4": { kind: "process", title: "How cloth is made from bamboo", steps: ["Bamboo grows (regrows from own roots)", "Cut in spring", "Sliced into strips", "Crushed", "Soaked with softening agents → fibres separate", "Fibres combed clean & dried", "Spun into yarn", "Woven on looms → fabric", "Dyed, cut & sewn → garments"] },
    "剑21 Test 1": { kind: "line", title: "Employment in four sectors of the US economy, 1960-2020 (millions of jobs)", xLabels: [1960, 1970, 1980, 1990, 2000, 2010, 2020], yLabel: "millions", series: [
      { name: "Services", color: BLUE, data: [14, 18, 25, 30, 36, 42, 50] },
      { name: "Manufacturing", color: RED, data: [15, 16, 15, 13, 11, 8.5, 7.5] },
      { name: "Construction", color: AMBER, data: [4.5, 5, 6, 6.5, 6.8, 5.2, 7] },
      { name: "Agriculture", color: GREEN, data: [3, 2.8, 2.5, 2.2, 1.9, 1.7, 1.5] }
    ] },
    "剑21 Test 2": { kind: "svg", title: "A college cafe: before and after redesign", svg: svgCafe() },
    "剑21 Test 3": { kind: "svg", title: "How a rain-shadow desert is formed", svg: svgRainShadow() },
    "剑21 Test 4": { kind: "multi", panels: [
      { kind: "bar", title: "How often library users visit", categories: ["Daily+", "3-5×/week", "1-2×/week", "<1×/week"], ySuffix: "%", series: [{ name: "Users", color: BLUE, data: [38, 30, 25, 7] }] },
      { kind: "table", title: "The three types of user", headers: ["User type", "Visit frequency", "Main use", "Satisfaction"], rows: [
        ["Undergraduates", "Highest", "Books & study spaces", "★★★"], ["Postgraduates", "High", "Books & databases", "★★★"], ["Academic staff", "Lowest", "Databases", "★★★★★"]
      ] }
    ] }
  };
})();
