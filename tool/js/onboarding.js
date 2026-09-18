/* onboarding.js — 新手引导与首次体验（M9）
 * 首开 4 步：认识功能室 → 摸底判级（离线）→ 设定路线起点 → 推荐第一题
 * 判级结果写入 localStorage（placement），学习路线页据此显示起点建议
 */
(function () {
  if (typeof Store === "undefined" || Store.get("onboarded")) return;

  const QUESTIONS = [
    { q: "“The charts below show the percentage of households with internet access in three countries between 2005 and 2015.” 这道小作文题的概括段（Overview）应该写什么？",
      opts: ["把每个国家每年的具体数字都报一遍", "指出最突出的总体特征（如哪个国家最高、整体都在上升），不带具体数字", "预测 2015 年之后的发展趋势并给出建议"], a: 1 },
    { q: "“Some people think that the best way to reduce traffic congestion is to build more roads. To what extent do you agree or disagree?” 这道大作文的开头段应该怎么写？",
      opts: ["引用题目并罗列双方所有观点，最后一句说‘我将讨论双方观点’", "第一句改写题目（如 building more roads → expanding road networks），第二句直接亮明自己的立场", "先写社会背景两句，再问一个反问句引出话题"], a: 1 },
    { q: "下面哪个主体段的写法最接近 7 分？",
      opts: ["Firstly, roads are important. Secondly, public transport is good. Moreover, cycling is healthy. Furthermore, cities should plant trees.", "Public transport is the most effective way to cut congestion. For example, when my city added a metro line in 2019, the number of buses on main roads fell noticeably, easing peak-hour jams.", "Traffic congestion is a serious problem in many cities. It causes pollution. It wastes time. It is bad for the economy. Something must be done."], a: 1 }
  ];
  const LEVELS = [
    { min: 0, name: "基础起步（5.5 目标）", start: "第 1 周", note: "先走完第 1-2 周的审题与分项训练，不要急着写整篇。" },
    { min: 2, name: "进阶冲刺（6.5 目标）", start: "第 2-3 周", note: "直接进入分项突破与限时练习，审题训练保持每天 2 道。" },
    { min: 3, name: "冲 7 强化（7.0+）", start: "第 3-4 周", note: "重点是限时模考+复盘卡对照，把 GRA/LR 细节抠到底。" }
  ];
  const NAV_NAMES = { analyze: "① 审题室", write: "② 写作室", check: "③ 诊断室", train: "④ 训练营", library: "⑤ 弹药库", bank: "⑥ 题库·范文", plan: "⑦ 学习路线", progress: "⑧ 进度·词本" };
  const TOUR = [
    ["④ 训练营", "核心。剑10-21 共 96 道真题（大作文+小作文），先看内置考官级范文，再逐段跟着学。"],
    ["③ 诊断室", "写完贴进来：硬伤定位到句子；AI 精批给分数（可选）；一键生成复盘卡和错因复习卡。"],
    ["⑤ 弹药库", "想观点、背词伙：24 个话题的观点库 + 858 条词伙 + 语境填空闪卡。"],
    ["⑥ 题库·范文", "56 篇内置范文随查随复制；Simon 范文全库检索；学习册一键导出。"]
  ];

  let step = 0, answers = [];
  const overlay = document.createElement("div");
  overlay.id = "onboardModal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,.62);z-index:1000;display:flex;align-items:center;justify-content:center";
  document.body.appendChild(overlay);

  function render() {
    let body = "";
    if (step === 0) {
      body = `<h3 style="margin-top:0">👋 欢迎！30 秒认识这个工具</h3>
        <p style="font-size:15px;line-height:1.9">这是一个<strong>纯本地离线</strong>的雅思写作训练营：所有数据只存在你的浏览器里。</p>
        <ul style="line-height:2;font-size:15px">${TOUR.map(t => `<li><b>${t[0]}</b> — ${t[1]}</li>`).join("")}</ul>
        <p class="hint">完整方法论在「📖 知识库」，随时可查。</p>`;
    } else if (step === 1) {
      const q = QUESTIONS[answers.length];
      body = `<h3 style="margin-top:0">📏 摸底 ${answers.length + 1}/3</h3>
        <p style="font-size:15px">${q.q}</p>
        ${q.opts.map((o, i) => `<button class="small ob-opt" data-i="${i}" style="display:block;width:100%;text-align:left;margin:8px 0;padding:10px 12px">${esc(String.fromCharCode(65 + i))}. ${esc(o)}</button>`).join("")}`;
    } else if (step === 2) {
      const correct = answers.filter(a => a === 1).length;
      const lv = [...LEVELS].reverse().find(l => correct >= l.min);
      body = `<h3 style="margin-top:0">🎯 你的摸底结果：${lv.name}</h3>
        <p style="font-size:15px">答对 ${correct}/3。建议路线起点：<b>${lv.start}</b>。${lv.note}</p>
        <p class="hint">已写入「⑦ 学习路线」（随时可以在那里调整）。摸底只是起点，第一次诊断后会更准。</p>`;
    } else {
      body = `<h3 style="margin-top:0">🚀 推荐你的第一道训练题</h3>
        <p style="font-size:15px"><b>剑15 Test 1 · 大作文</b>：为什么很多人想买房？这是积极的吗？<br>
        <span class="hint">流程：读图/审题课（内置，免费）→ 看考官级范文 → 对照逐段学 → 写完送诊断。</span></p>
        <p class="hint">小提示：以后每次打开工具，「④ 训练营」顶部的处方和「⑧ 进度」的错因复习就是当天要做的事。</p>`;
    }
    const buttons = step === 0 ? `<button class="primary" id="obNext">开始 30 秒摸底 →</button>`
      : step === 1 ? `<button id="obBack">← 上一题</button>`
      : step === 2 ? `<button class="primary" id="obNext">好，推荐第一题 →</button>`
      : `<button class="primary" id="obFinish">🚀 直达训练营开始</button>`;
    overlay.innerHTML = `<div style="background:var(--card);color:var(--ink);border-radius:16px;max-width:600px;width:94%;padding:26px 30px;box-shadow:0 18px 60px rgba(0,0,0,.35)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <b>新手引导 · 第 ${step + 1}/4 步</b>
        <button id="obSkip" class="small">跳过</button>
      </div>${body}
      <div class="btn-row" style="margin-top:14px">${buttons}</div></div>`;

    if (document.getElementById("obSkip")) document.getElementById("obSkip").onclick = finish;
    if (document.getElementById("obNext")) document.getElementById("obNext").onclick = () => { step++; render(); };
    if (document.getElementById("obBack")) document.getElementById("obBack").onclick = () => { answers.pop(); step = 1; render(); };
    if (document.getElementById("obFinish")) document.getElementById("obFinish").onclick = () => {
      finish();
      try {
        const q = trainingPool().find(x => tKey(x) === "剑15 Test 1 T2");
        if (q) startTraining(q);
      } catch (_) { goto("train"); }
    };
    overlay.querySelectorAll(".ob-opt").forEach(b => b.onclick = () => {
      answers.push(+b.dataset.i);
      if (answers.length === QUESTIONS.length) {
        const correct = answers.filter(a => a === 1).length;
        const lv = [...LEVELS].reverse().find(l => correct >= l.min);
        try { Store.set("placement", { level: lv.name, start: lv.start, correct, date: Date.now() }); } catch (_) {}
      }
      step++; render();
    });
  }
  function finish() {
    Store.set("onboarded", Date.now());
    overlay.remove();
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  render();
})();
