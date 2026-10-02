/* onboarding.js — 新手引导与首次体验（M9）
 * 首开 4 步：认识流程 → 方法知识自测（离线）→ 建议练习起点 → 推荐第一题
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
      opts: ["Firstly, roads are important. Secondly, public transport is good. Moreover, cycling is healthy. Furthermore, cities should plant trees.", "Reliable public transport can reduce congestion by giving commuters an alternative to driving. When trains run frequently, people are more willing to leave their cars at home, so fewer vehicles compete for road space.", "Traffic congestion is a serious problem in many cities. It causes pollution. It wastes time. It is bad for the economy. Something must be done."], a: 1 }
  ];
  const LEVELS = [
    { min: 0, name: "先熟悉任务要求", start: "第 1 周", note: "先练一个关键段落，再结合自己的作文诊断决定重点。" },
    { min: 2, name: "开始独立段落练习", start: "第 1-2 周", note: "先写后看范文，通过实际作答发现需要练习的地方。" },
    { min: 3, name: "用实际作答验证理解", start: "第 2 周", note: "你理解了这些方法，下一步用独立写作检验能否用出来。" }
  ];
  const TOUR = [
    ["今日训练", "继续草稿或改写任务，完成后换题检验。"],
    ["写作室", "先独立写作。题目与作文一起保存，教学面板可以收起。"],
    ["诊断与改写", "点击批注找到原句，先改一个问题，再检查自己的下一版。"],
    ["题库与范文", "搜索已有题目与讲解，先尝试自己的写法，再对照范文。"]
  ];

  let step = 0, answers = [];
  const previous=document.activeElement;
  const overlay = document.createElement("dialog");
  overlay.id = "onboardModal";
  overlay.className='ui-dialog onboarding-dialog';overlay.setAttribute('aria-label','新手引导');
  document.body.appendChild(overlay);
  overlay.addEventListener('cancel',e=>{e.preventDefault();finish();});

  function render() {
    let body = "";
    if (step === 0) {
      body = `<h3 style="margin-top:0">欢迎！30 秒认识这个工具</h3>
        <p style="font-size:15px;line-height:1.9">这是一个<strong>纯本地离线</strong>的雅思写作训练营：所有数据只存在你的浏览器里。</p>
        <ul style="line-height:2;font-size:15px">${TOUR.map(t => `<li><b>${t[0]}</b> — ${t[1]}</li>`).join("")}</ul>
        <p class="hint">完整方法论在「知识库」，随时可查。</p>`;
    } else if (step === 1) {
      const q = QUESTIONS[answers.length];
      body = `<h3 style="margin-top:0">方法自测 ${answers.length + 1}/3</h3>
        <p style="font-size:15px">${q.q}</p>
        ${q.opts.map((o, i) => `<button class="small ob-opt" data-i="${i}" style="display:block;width:100%;text-align:left;margin:8px 0;padding:10px 12px">${esc(String.fromCharCode(65 + i))}. ${esc(o)}</button>`).join("")}`;
    } else if (step === 2) {
      const correct = answers.filter((a, i) => a === QUESTIONS[i].a).length;
      const lv = [...LEVELS].reverse().find(l => correct >= l.min);
      body = `<h3 style="margin-top:0">你的摸底结果：${lv.name}</h3>
        <p style="font-size:15px">答对 ${correct}/3。建议路线起点：<b>${lv.start}</b>。${lv.note}</p>
        <p class="hint">这只是方法知识自测，不能估算你的雅思分数。建议已写入学习路线，写作水平需要通过真实作文评估。</p>`;
    } else {
      body = `<h3 style="margin-top:0">推荐你的第一道训练题</h3>
        <p style="font-size:15px"><b>剑15 Test 1 · 大作文</b>：为什么很多人想买房？这是积极的吗？<br>
        <span class="hint">流程：先独立写一段 → 对照教学找差距 → 针对性改写 → 隔天换题复测。</span></p>
        <p class="hint">下次打开，在「今日训练」继续草稿和改写；在「记录与词本」回看作答证据。</p>`;
    }
    const buttons = step === 0 ? `<button class="primary" id="obNext">开始 30 秒摸底 →</button>`
      : step === 1 ? `<button id="obBack">← 上一题</button>`
      : step === 2 ? `<button class="primary" id="obNext">好，推荐第一题 →</button>`
      : `<button class="primary" id="obFinish">直达训练营开始</button>`;
    overlay.innerHTML = `<div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <b>新手引导 · 第 ${step + 1}/4 步</b>
        <button id="obSkip" class="small">跳过</button>
      </div>${body}
      <div class="btn-row" style="margin-top:14px">${buttons}</div></div>`;

    if (document.getElementById("obSkip")) document.getElementById("obSkip").onclick = finish;
    if (document.getElementById("obNext")) document.getElementById("obNext").onclick = () => { step++; render(); };
    if (document.getElementById("obBack")) document.getElementById("obBack").onclick = () => { answers.pop(); step = 1; render(); };
    if (document.getElementById("obFinish")) document.getElementById("obFinish").onclick = () => {
      if(!finish())return;
      try {
        const q = trainingPool().find(x => tKey(x) === "剑15 Test 1 T2");
        if (q) startTraining(q);
      } catch (_) { goto("train"); }
    };
    overlay.querySelectorAll(".ob-opt").forEach(b => b.onclick = () => {
      answers.push(+b.dataset.i);
      if (answers.length === QUESTIONS.length) {
        const correct = answers.filter((a, i) => a === QUESTIONS[i].a).length;
        const lv = [...LEVELS].reverse().find(l => correct >= l.min);
        try { Store.set("placement", { level: lv.name, start: lv.start, correct, date: Date.now() }); } catch (_) {}
      }
      step = answers.length === QUESTIONS.length ? 2 : 1; render();
    });
    overlay.querySelector('button')?.focus();
  }
  function finish() {
    if(!Store.set("onboarded", Date.now())){UI.notice('引导状态保存失败，请重试。',{error:true});return false;}
    overlay.close();
    overlay.remove();
    previous?.focus();return true;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  render();overlay.showModal();overlay.querySelector('button')?.focus();
})();
