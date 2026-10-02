/* 从反馈到迁移：离线练习队列。自查结果不作为 IELTS 分数或自动掌握判定。 */
const Learning = (() => {
  const DAY = 86400000;
  const clean = value => String(value || "").replace(/<[^>]*>/g, "").trim();
  const norm = value => clean(value).toLowerCase().replace(/\s+/g, " ");
  const words = value => (String(value || "").match(/[a-z]+(?:['’-][a-z]+)*/gi) || []).length;
  const read = () => Store.get("learning", { version: 2, items: [] });
  function write(state) { state.version = Math.max(2,state.version || 1);if(!Store.set('learning',state)) throw new Error('学习记录保存失败，当前文本仍在页面中，请备份或复制后重试。'); }
  // 这些是可调整的教学练习，不是官方评分子项，也不自动判分。
  const skills = {
    response: { name: '回应题目与明确立场', crit: 'TR', modes: ['t2'], minutes: 8,
      task: '先列出题目要求回答的每个问题，再用英文写出立场和一个主体段的中心句。检查它们能否逐一回答原题。',
      checks: ['回应了题目要求的对象、范围和每个问题', '我的立场明确，前后没有变化', '每个中心句都能说明它如何支持立场'],
      hint: '圈出题目中的动词、对象和限定词。双问题要分别回答；讨论双方并发表意见，需要覆盖三件事。' },
    development: { name: '把观点解释具体', crit: 'TR', modes: ['t2'], minutes: 10,
      task: '只写一个主体段。先提出观点，再说明为什么或怎样发生，最后用具体情境、细节或例子支撑。',
      checks: ['中心观点直接回应这道题', '说明了为什么或怎样，而不是换词重复观点', '支撑内容具体、相关，读者不需要替我补推理'],
      hint: '问自己：谁会改变什么行为？为什么？会造成什么结果？例子只是支撑方式之一，不要求每段必须出现 For example。' },
    coherence: { name: '让段内逻辑连起来', crit: 'CC', modes: ['t1', 't2'], minutes: 10,
      task: '重写一个段落，为每句确定作用：观点、解释、对比、支撑或结果。删除重复信息，补上跳过的逻辑。',
      checks: ['段落围绕一个清楚的中心或一组信息', '每句话与上一句的逻辑关系明确', '代词指代清楚，连接词表达真实关系'],
      hint: '先暂时去掉 Moreover、Therefore 等连接词，检查内容本身能否顺下来。再按需要补连接或指代。' },
    vocabulary: { name: '准确使用词语和搭配', crit: 'LR', modes: ['t1', 't2'], minutes: 8,
      task: '从反馈中选一个意思不准或搭配不当的表达。写两三句相关内容，在新语境中准确使用它。',
      checks: ['词义准确表达了我想说的内容', '搭配、词形和语体适合这个语境', '能解释选择这个表达的原因，没有生硬替换同义词'],
      hint: '先用简单词把意思写清楚；需要时再查可靠词典中的搭配和用例。查过资料就记录为辅助练习。' },
    grammar: { name: '修正一种反复出现的语法错误', crit: 'GRA', modes: ['t1', 't2'], minutes: 8,
      task: '只选本次反馈中的一种语法问题。修改原句，再写两句与题目有关的新句，检查同一规则。',
      checks: ['找到了本次要改的具体语法规则', '原句和新句都检查了这条规则', '句子完整，主谓、时态与标点没有引入新错误'],
      hint: '先找主语和谓语，再检查从句与句子边界。优先写准确，再尝试自己能控制的复杂结构。' },
    overview: { name: '选出图表的总体特征', crit: 'TA', modes: ['t1'], minutes: 8,
      task: '对照原图写概括段：动态图找总体变化，静态图找主要差异，地图找主要改变，流程图概括主要阶段。',
      checks: ['选择的是原图中最显著的总体特征', '概括覆盖了图表整体，没有只报一个局部数字', '内容与原图一致，没有编造图外原因'],
      hint: '先退一步看整张图，再选最值得告诉读者的特征。不同图型不必套同一套最高、最低模板。' },
    data: { name: '准确比较与描述图表', crit: 'TA', modes: ['t1'], minutes: 10,
      task: '对照原图写一个细节段。统计图组织比较，地图组织位置变化，流程图按阶段说明关系。',
      checks: ['每项数字、单位、位置或阶段都核对过原图', '选择和分组体现了重要关系，而不是机械罗列', '主语、时态和比较对象准确，没有推测原因'],
      hint: '统计图先确认单位与年份；地图确认方向与前后变化；流程图确认顺序和连接。没有原图时先补齐材料。' },
    completion: { name: '完成一份完整答卷', crit: null, modes: ['t1', 't2'], minutes: 40,
      task: '这次需要写完整作文，检查题目要求、内容覆盖和时间分配。Task 1 至少 150 词，Task 2 至少 250 词。',
      checks: ['按当前 Task 的要求完成了整篇作答', '覆盖题目主要要求，保留了检查时间', '内容有组织地展开，没有为凑字数重复'],
      hint: '字数不足只能由完整答卷验证。先列关键内容，再分配时间；段数和句数是可选写法，不是得分公式。' }
  };
  function skillFor(focus, mode) {
    if (skills[focus.skillId]?.modes?.includes(mode)) return focus.skillId;
    const text = `${focus.title || ''} ${focus.instruction || ''}`;
    if (/字数|underlength|word count|too short/i.test(text)) return 'completion';
    if (/概括|overview|总体特征/i.test(text) && mode === 't1') return 'overview';
    if (/数据|比较|单位|图表|地图|流程|data|compar|figure|unit/i.test(text) && mode === 't1') return 'data';
    if (/语法|主谓|冠词|时态|从句|逗号|不可数|grammar|tense|article|agreement|although.+but/i.test(text)) return 'grammar';
    if (/词汇|搭配|词形|拼写|用词|vocab|collocation|word choice|spelling/i.test(text)) return 'vocabulary';
    if (/审题|立场|跑题|偏题|漏答|题目.*覆盖|position|address.*question|off.topic/i.test(text) && mode === 't2') return 'response';
    if (/论证|解释|支撑|展开|develop|support|explain/i.test(text) && mode === 't2') return 'development';
    const crit = mode === 't1' && focus.crit === 'TR' ? 'TA' : focus.crit;
    return ({TR:'development',TA:'overview',CC:'coherence',LR:'vocabulary',GRA:'grammar'})[crit] || (mode === 't1' ? 'overview' : 'development');
  }
  function drill(item) {
    const id = skillFor(item.focus, item.mode), skill = skills[id];
    let failures = 0;
    for (const a of (item.attempts || []).slice().reverse()) { if (a.passed) break; failures++; }
    const lesson = typeof LearningLessons !== 'undefined' ? LearningLessons[id] : null;
    const benchmark = item.status === 'benchmark';
    const scaffold = !benchmark && id !== 'completion' && failures >= 2;
    return { ...skill, id, lesson, scaffold, benchmark,
      task: benchmark ? `写一份完整答卷，并核验“${skill.name}”能否在整篇写作中做到。` : scaffold && lesson ? lesson.smaller : item.focus.structured ? item.focus.instruction : skill.task,
      minutes: benchmark || id === 'completion' ? (item.mode === 't1' ? 20 : 40) : scaffold ? 5 : skill.minutes,
      min: benchmark || id === 'completion' ? (item.mode === 't1' ? 150 : 250) : scaffold ? 20 : (item.mode === 't1' ? 20 : 35),
      checks: benchmark ? [...(item.focus.structured ? item.focus.checks : skill.checks), '整篇覆盖了题目要求，并核对了组织、语言和图表信息'] : item.focus.structured ? item.focus.checks : skill.checks };
  }
  const independentPass = a => a.stage === 'transfer' && a.passed && a.independent === true;
  function stats(now = Date.now()) {
    const items = read().items;
    const recent = items.flatMap(i => i.attempts || []).filter(a => a.date >= now - 7 * DAY && a.date <= now);
    const transfers = recent.filter(a => a.stage === 'transfer');
    const benchmarks = recent.filter(a => a.stage === 'benchmark');
    return { repairs: recent.filter(a => a.stage === 'repair').length,
      independent: transfers.filter(a => a.independent === true).length,
      passed: transfers.filter(independentPass).length,
      assisted: transfers.filter(a => a.independent === false).length,
      unknown: transfers.filter(a => typeof a.independent !== 'boolean').length,
      benchmarks: benchmarks.length, benchmarkPassed: benchmarks.filter(a => a.passed && a.independent === true).length };
  }
  function repeatCount(item, items = read().items, now = Date.now()) {
    // 相同作文的规则/AI 诊断不会重复增加次数；只使用最近 30 天记录。
    return new Set(items.filter(i => i.mode === item.mode && i.date >= now - 30 * DAY && i.date <= now
      && skillFor(i.focus, i.mode) === skillFor(item.focus, item.mode)).map(i => norm(i.question) + '\n' + norm(i.essay))).size;
  }
  function rationale(item, now = Date.now()) {
    if (item.status === 'benchmark') return '短练习已连续三次独立自查通过，现在检验整篇作答中的表现。';
    if (item.status === 'transfer') return '间隔已到：先验证隔天能否在新题上独立做到。';
    if (item.draft) return '先完成已开始的改写，减少来回切换。';
    const count = repeatCount(item, read().items, now);
    return count > 1 ? `最近 30 天有 ${count} 份作答被归入同类问题，优先修复；分类可调整。` : '从一份真实作答暴露的问题开始，先解决一个可检查的目标。';
  }
  function prepareReview(id, text) {
    return update(id, item => {
      if (words(text) < 3) throw new Error('请先写一句真实的尝试，再对照标准检查。');
      item.draft = text;
      if (item.reviewSnapshot?.text !== text) item.reviewSnapshot = { text, assisted: !!item.attemptAssisted, date: Date.now() };
    });
  }
  function markAssisted(id) { return update(id, i => { i.attemptAssisted = true; }); }
  function changeSkill(id, skillId) {
    return update(id, item => {
      if (item.status !== 'repair') throw new Error('已开始复测的目标保留原训练标准，请从新的诊断建立其他目标。');
      if (!skills[skillId]?.modes?.includes(item.mode)) throw new Error('这个练习不适用于当前 Task。');
      item.focus.skillId = skillId;
      item.focus.skillSource = '用户选择';
      item.focus.structured = false;
      item.reviewSnapshot = null;
    });
  }
  function focusFor(crit, mode) {
    const map = {
      TR: ["把一个观点解释清楚", "写一个主体段：明确回答题目中的一个问题，解释为什么，再用具体情境支撑。"],
      TA: ["准确概括图表", "对照原图写概括段，挑出最显著的总体特征；不要推测图外原因。"],
      CC: ["让句子之间的逻辑清楚", "重写一个段落，确保每句都在推进同一个中心，并能说清它与上一句的关系。"],
      LR: ["把表达写准确", "重写有问题的句子及上下文，检查词义、搭配和词形；换一道题再独立使用。"],
      GRA: ["在自己的句子里修正语法", "重写有问题的句子及上下文，检查主谓、时态、冠词和句子边界。"]
    };
    return map[crit === "TR" && mode === "t1" ? "TA" : crit] || map[mode === "t1" ? "TA" : "TR"];
  }
  function selectFocus(res, ai, mode, essay = '') {
    const target = ai?.learningTarget;
    if (target && skills[target.skill]?.modes?.includes(mode)
      && ['problem','quote','why','instruction'].every(k=>typeof target[k]==='string' && target[k].trim())
      && words(target.quote)>=3 && essay.includes(target.quote)
      && Array.isArray(target.checks) && target.checks.length===3 && target.checks.every(c=>typeof c==='string' && c.trim())) {
      return {crit:skills[target.skill].crit || (mode==='t1'?'TA':'TR'),skillId:target.skill,structured:true,
        title:clean(target.problem).slice(0,600),instruction:clean(target.instruction).slice(0,1200),
        quote:clean(target.quote),why:clean(target.why).slice(0,600),checks:target.checks.map(c=>clean(c).slice(0,300)),
        example:'',source:'AI 反馈，已核对原句引用'};
    }
    const issue = (res?.issues || []).filter(i => !i.noscore && (i.sev === "bad" || i.sev === "warn"))
      .sort((a, b) => (a.sev === "bad" ? 0 : 1) - (b.sev === "bad" ? 0 : 1))[0];
    const sentence = ai?.sentenceIssues?.find(i => i.quote && i.problem);
    const scores = Object.entries(ai?.scores || {}).filter(([, s]) => Number.isFinite(s) && s >= 0 && s <= 9);
    const crit = (scores.sort((a, b) => a[1] - b[1])[0] || [issue?.crit || (mode === "t1" ? "TA" : "TR")])[0];
    const fallback = focusFor(crit, mode);
    if (ai?.priorityFixes?.length) return { crit, title: clean(ai.priorityFixes[0]), instruction: clean(ai.priorityFixes[0]), quote: "", example: "", source: "AI 反馈" };
    if (sentence) return { crit: /词|搭配|拼写/.test(sentence.problem) ? "LR" : "GRA", title: clean(sentence.problem), instruction: "重写这句话及相关上下文，解决指出的问题；先尝试自己的改法，再查看示范。", quote: sentence.quote, example: sentence.fix || "", source: "AI 反馈" };
    if (issue) return { crit: issue.crit, title: clean(issue.msg), instruction: typeof adviceFor === "function" ? clean(adviceFor(issue).act) : fallback[1], quote: clean(issue.evidence), example: "", tag: typeof tagOf === "function" ? tagOf(issue) : null, source: "规则提示，需自查确认" };
    return { crit, title: fallback[0], instruction: fallback[1], quote: "", example: "", source: "主动自查任务" };
  }
  function capture(context, res, ai, now = Date.now()) {
    const state = read();
    const mode = context.mode === "t1" ? "t1" : "t2";
    const existing = state.items.find(i => i.mode === mode && i.essay === context.essay && i.question === context.question);
    if (existing) {
      // 已经练过的任务保留学习历史；尚未开始时用后到的 AI 反馈提升针对性。
      if (ai && !existing.attempts.length && !existing.draft && !existing.focus.skillSource) existing.focus = selectFocus(res, ai, mode, context.essay);
      write(state); return existing;
    }
    const original = typeof trainingPool === "function" ? trainingPool().find(q => q.task === (mode === "t1" ? 1 : 2) && norm(q.question) === norm(context.question)) : null;
    const item = { id: now.toString(36) + "-" + Math.random().toString(36).slice(2, 9), date: now, mode,
      question: context.question || "", qtype: original?.qtype || (mode === "t1" ? context.chart : context.qtype) || "", chart: context.chart || "", qKey:context.qKey||'', chartKey:context.chartKey|| (mode==='t1'?original?.src||'':''), essay: context.essay,
      focus: selectFocus(res, ai, mode, context.essay), status: "repair", due: now, passes: 0, draft: "", attempts: [] };
    state.items.unshift(item); write(state); return item;
  }
  function next(now = Date.now()) {
    const items = read().items;
    return items.filter(i => i.status === "transfer" && i.due <= now).sort((a, b) => a.due - b.due)[0]
      || items.filter(i => i.status === 'benchmark' && i.due <= now).sort((a,b)=>a.due-b.due)[0]
      || items.filter(i => i.status === "repair").sort((a, b) =>
        Number(!!b.draft) - Number(!!a.draft) || repeatCount(b, items, now) - repeatCount(a, items, now) || a.date - b.date)[0] || null;
  }
  function selectQuestion(item, pool) {
    const used = new Set([norm(item.question), ...(item.attempts || []).map(a => norm(a.question)),
      ...read().items.filter(i => i.id !== item.id).flatMap(i => [norm(i.question), ...(i.attempts || []).map(a => norm(a.question))])]);
    const done = Store.get('training', {done:{}}).done || {};
    const candidates = pool.filter(q => q.task === (item.mode === "t1" ? 1 : 2) && !used.has(norm(q.question))
      && !done[`${q.src} T${q.task}`] && !Store.get('train_' + `${q.src} T${q.task}`, null)
      && (item.mode !== 't1' || typeof T1Charts === 'undefined' || T1Charts.hasImg(q.src)
        || (typeof T1ChartSpecs !== 'undefined' && !!T1ChartSpecs[q.src])));
    // 同任务、同题型的另一道题；没同题型则明示普通迁移，不声称题目测得了特定分项。
    return candidates.find(q => norm(q.qtype) === norm(item.qtype) || (item.mode === "t1" && norm(item.qtype).includes(norm(q.qtype)))) || candidates[0] || null;
  }
  function update(id, fn) {
    const state = read(), item = state.items.find(i => i.id === id);
    if (!item) return null;
    fn(item); write(state); return item;
  }
  function saveAttempt(id, { text, question, passed, note, quote, checks, assisted = false }, now = Date.now()) {
    const state = read(), item = state.items.find(i => i.id === id);
    if (!item) throw new Error("练习记录不存在，请返回今日训练。");
    if (!['repair', 'transfer', 'benchmark'].includes(item.status)) throw new Error('该目标已完成，请从新的诊断建立下一项练习。');
    const min = drill(item).min;
    if (words(text) < 3) throw new Error('请至少写 3 个英文词，再保存这次尝试。');
    if (passed && words(text) < min) throw new Error(`请至少写 ${min} 个英文词，再对照目标检查。`);
    const newQuestion = item.status !== 'repair';
    if (newQuestion && item.due > now) throw new Error("还未到复测时间，请先完成其他训练。");
    if (newQuestion && (!question || norm(question) === norm(item.question))) throw new Error("请换一道新题验证。");
    if (newQuestion && item.transferQuestion && norm(question) !== norm(item.transferQuestion.question)) throw new Error('题目与当前练习不一致，请返回今日训练重新打开。');
    if (passed && (words(quote) < 3 || !norm(text).includes(norm(quote)))) throw new Error('请从当前作答中摘出至少 3 个英文词作为证据原句。');
    if (passed && (!Array.isArray(checks) || checks.length !== drill(item).checks.length || !checks.every(c => c === true))) throw new Error('请逐项核对这次练习的成功标准；尚未做到可以选择继续练。');
    if (passed && item.status === "repair" && norm(text) === norm(item.essay)) throw new Error("内容与原文相同，请先针对目标修改。");
    const stage = item.status;
    if (passed && newQuestion && (norm(text) === norm(item.essay) || item.attempts.some(a => a.passed && norm(a.text) === norm(text)))) throw new Error('这段文字与已有作答相同。请针对新题重新组织内容，再检验迁移。');
    if (passed && newQuestion && item.attempts.some(a => a.passed && a.independent === true && norm(a.question) === norm(question))) throw new Error('这道题已独立通过，请换一道题验证。');
    const snapshot = item.reviewSnapshot;
    const independent = newQuestion && !assisted && !!snapshot && snapshot.text === text && !snapshot.assisted;
    const credited = passed && independent;
    item.attempts.push({ date: now, stage, text, question: question || item.question, passed: !!passed, note: clean(note),
      quote: clean(quote), checks: checks || [], skillId: drill(item).id, independent: newQuestion ? independent : null,
      timed: item.practiceTimer?.duration === (item.mode === 't1' ? 20 : 40) * 60000 && !!item.practiceTimer?.startedAt,
      elapsedMs: item.practiceTimer?.startedAt ? Math.max(0,(snapshot?.text===text ? snapshot.date : now)-item.practiceTimer.startedAt) : null,
      assessment: 'self', criteria: drill(item).checks.slice() });
    item.draft = "";
    item.reviewSnapshot = null;
    item.attemptAssisted = false;
    item.reviewDraft = null;
    item.practiceTimer = null;
    if (stage === "repair") {
      if (passed) { item.status = "transfer"; item.due = now + DAY; }
      else item.draft = text;
    } else if (stage === 'benchmark') {
      item.status = credited ? 'consolidated' : 'transfer';
      if (!credited) item.passes = 0;
      item.due = now + DAY;
      item.transferQuestion = null;
    } else {
      // 老记录没有独立性证据；只累计本轮标准下连续通过的新题。
      let streak = 0;
      for (const a of item.attempts.slice().reverse()) { if (!independentPass(a)) break; streak++; }
      item.passes = streak;
      item.status = item.passes >= 3 ? "benchmark" : "transfer";
      item.due = now + (item.status === 'benchmark' ? 1 : credited ? [3, 7][Math.min(item.passes - 1, 1)] : 1) * DAY;
      // 通过或用过帮助的题已暴露解法，下次换题；独立失败可次日再试本题。
      if (passed || !independent) item.transferQuestion = null;
    }
    write(state); return item;
  }
  function reviewPacket(id) {
    const item = read().items.find(i => i.id === id);
    if (!item) return '';
    const latest = item.attempts[item.attempts.length - 1];
    return [
      '请复核这份 IELTS 写作练习。请独立判断内容质量，不根据学生自查结果推定正确。',
      `Task ${item.mode === 't1' ? 1 : 2}；训练目标：${drill(item).name}`,
      '只检查这次目标是否做到：引用作答中的证据，指出一个仍需修复的问题，并给一个可执行的下一步。',
      '若只是片段，不给整篇 Band 分；Task 1 缺原图时，请先索要原图，不猜数据。',
      '原题：\n' + item.question, '诊断时的原稿：\n' + item.essay,
      latest ? `最近作答题目：\n${latest.question}\n最近作答：\n${latest.text}\n条件：${latest.stage === 'repair' ? '原题改写' : latest.stage === 'benchmark' ? '整篇验证' : latest.independent === true ? '自报独立换题' : latest.independent === false ? '使用过帮助或未保留独立快照' : '旧记录，独立性未知'}${latest.stage === 'benchmark' ? `；${latest.independent ? '自报独立完成' : '使用帮助或独立性未验证'}` : ''}${latest.timed ? `；开启限时计时，用时约 ${Math.ceil(latest.elapsedMs/60000)} 分钟` : '；未记录限时计时'}` : '尚未提交改写。',
      item.mode === 't1' ? '请另附原题图表，以上文本不含图片。' : ''
    ].filter(Boolean).join('\n\n');
  }
  return { read, next, capture, selectQuestion, update, saveAttempt, words, focusFor,
    skills, skillFor, drill, stats, rationale, independentPass, prepareReview, markAssisted, changeSkill, reviewPacket };
})();

function renderLearningHome(host) {
  const state = Learning.read(), next = Learning.next();
  const waiting = state.items.filter(i => ['transfer','benchmark'].includes(i.status) && i.due > Date.now());
  const repairs = state.items.filter(i => i.status === "repair").length;
  const due = state.items.filter(i => i.status === "transfer" && i.due <= Date.now()).length;
  const checked = state.items.reduce((n, i) => n + i.attempts.filter(Learning.independentPass).length, 0);
  const savedSession = Store.get("trainSession", null);
  const session = savedSession && !savedSession.sentForDiagnosis ? savedSession : null;
  const drafts=['t2','t1'].map(mode=>({mode,...Store.getDraft(mode)})).filter(d=>d.text?.trim());
  const history=Store.get('draftHistory',[]);
  host.innerHTML = `<h2>今天，解决一个写作问题</h2>
    <div id="learningOverview">
    <p class="hint">先独立写，再对照反馈修改，隔天换题检验。每次只聚焦一个目标。</p>
    ${next ? `<h3>${next.status === "repair" ? "改写上次的薄弱处" : next.status === 'benchmark' ? '完整答卷：把短练习带回整篇' : "到期复测：换题独立写"}</h3>
      <p>${esc(Learning.drill(next).name)}</p><p class="hint">${esc(next.focus.source)} · Task ${next.mode === "t1" ? "1" : "2"} · 约 ${Learning.drill(next).minutes} 分钟</p>
      <p class="hint">${esc(Learning.rationale(next))}</p>
      <button class="primary" id="learnNext">${next.status === "repair" ? "开始针对性改写" : next.status === 'benchmark' ? '开始整篇验证' : "开始换题复测"}</button>`
      : `<p>${waiting.length ? `上次改写已安排复测，最近一次在 ${new Date(Math.min(...waiting.map(i => i.due))).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}。现在可以练一道新题。` : "从一份独立草稿开始，诊断后会生成你的改写任务。已有作文也可以直接送去诊断。"}</p>
        <div class="btn-row"><button class="primary" id="learnBaseline">${session ? "继续上次的独立练习" : "开始一道独立练习"}</button><button id="learnExisting">诊断已有作文</button></div>`}
    <p class="hint learning-stats">待改写 ${repairs} · 到期复测 ${due} · 独立换题自查通过 ${checked} 次（不代表考试评分）</p>
    </div>
    <div id="learningPractice"></div>`;
  if (next) host.querySelector("#learnNext").onclick = () => openLearningPractice(next.id);
  const baseline = host.querySelector("#learnBaseline");
  if (baseline) baseline.onclick = () => {
    if (session) { tc = session; renderTraining(); return; }
    const done = trainStore().done;
    const q = trainingPool().find(q => q.task === 2 && q.book >= 15 && !done[tKey(q)]);
    if (q) startTraining(q); else goto("write");
  };
  const existing = host.querySelector("#learnExisting");
  if (existing) existing.onclick = () => goto("check");
  const support=document.createElement('div');support.className='learning-support';
  const week = Learning.stats();
  support.innerHTML=`<div><h3>继续写作</h3>${session?`<p>${esc(session.src)} · 已写 ${Learning.words(session.paraTexts.join(' '))} 词</p><button id="continueTraining">继续段落练习</button>`:''}
    ${drafts.map(d=>`<div class="resume-draft"><p><b>Task ${d.mode==='t1'?'1':'2'} 整篇草稿</b> · ${Learning.words(d.text)} 词</p><p class="hint draft-title">${esc(d.question||'未附题干')}</p><button data-resume-draft="${d.mode}">继续这份草稿</button></div>`).join('')}
    ${!drafts.length&&!session?'<p class="hint">整篇作文会自动保存在本机，下次从这里继续。</p>':''}<button id="continueWriting">打开写作室</button>
    ${history.length?`<details class="draft-history"><summary>保留的草稿（${history.length} 份）</summary>${history.map((d,n)=>`<div class="resume-draft"><p class="draft-title">Task ${d.mode==='t1'?'1':'2'} · ${esc(d.question||'未附题干')} · ${Learning.words(d.text)} 词</p><button data-restore-draft="${n}">恢复这份草稿</button></div>`).join('')}</details>`:''}</div>
    <div><h3>最近 7 天，能独立做到多少</h3><p>针对性改写 ${week.repairs} 次 · 独立复测 ${week.independent} 次，其中自查通过 ${week.passed} 次</p><p>整篇验证 ${week.benchmarks} 次，其中独立自查通过 ${week.benchmarkPassed} 次</p><p>借助提示 ${week.assisted} 次${week.unknown ? ` · 旧记录未注明独立性 ${week.unknown} 次` : ''}。用完整答卷和外部反馈校验自查。</p><button id="viewLearningHistory">查看作答证据</button> <button id="learningMethod">查看训练方法</button></div>`;
  host.append(support);
  support.querySelector('#continueWriting').onclick=()=>goto('write');
  const resumeTraining=support.querySelector('#continueTraining');if(resumeTraining)resumeTraining.onclick=()=>{tc=session;renderTraining();};
  support.querySelectorAll('[data-resume-draft]').forEach(b=>b.onclick=()=>{setWriteMode(b.dataset.resumeDraft);if(writeMode===b.dataset.resumeDraft)goto('write');});
  support.querySelectorAll('[data-restore-draft]').forEach(b=>b.onclick=()=>TaskFlow.restore(+b.dataset.restoreDraft));
  support.querySelector('#viewLearningHistory').onclick=()=>goto('progress');
  support.querySelector('#learningMethod').onclick=()=>goto('plan');
}

function openLearningPractice(id) {
  // 先保留训练中的草稿，再展示短练习。
  if (tc && !persistDraft(true)) return;
  tc = null;
  goto("train");
  const item = Learning.read().items.find(i => i.id === id);
  if (!item) return;
  const transfer = ['transfer','benchmark'].includes(item.status);
  if (transfer && item.due > Date.now()) return;
  let q = item.transferQuestion;
  if (transfer && !q) {
    q = Learning.selectQuestion(item, trainingPool());
    if (q) {try{Learning.update(id, i => { i.transferQuestion = q; });}catch(e){UI.notice(e.message,{error:true});return;}}
  }
  const drill = Learning.drill(item);
  const full = drill.benchmark || drill.id === 'completion';
  const host = document.getElementById("learningPractice");
  document.querySelectorAll('#trainHome > .card:not(#learningHome)').forEach(card=>card.classList.add('hidden'));
  document.getElementById('learningOverview').classList.add('hidden');
  document.querySelector('#learningHome .learning-support').classList.add('hidden');
  host.innerHTML = `<section class="learning-work" aria-labelledby="learningTitle">
    <h3 id="learningTitle" tabindex="-1">${drill.benchmark ? '完整答卷验证：检验整篇中的表现' : transfer ? "换题复测：先凭记忆独立写" : "针对性改写：只解决这一个问题"}</h3>
    <p><b>本次目标：</b>${esc(drill.name)} · 约 ${drill.minutes} 分钟</p>
    ${!transfer && item.focus.why ? `<p>${esc(item.focus.why)}</p>` : ''}
    ${!transfer ? `<p>${esc(drill.task)}</p><details><summary>为什么练这个 · 调整练习类型</summary><p>${esc(item.focus.title)}</p><p>${esc(item.focus.instruction)}</p><p class="hint">由反馈关键词建议，可按真实问题调整；不自动判定能力。</p><label for="learningSkill">这次要练的能力</label><select id="learningSkill">${Object.entries(Learning.skills).filter(([,s])=>s.modes.includes(item.mode)).map(([key,s])=>`<option value="${key}" ${key===drill.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></details>` : `<p>把“${esc(drill.name)}”应用到这道新题。${full ? `请写完整篇，至少 ${drill.min} 词。` : drill.scaffold ? esc(drill.task) : '写一个关键段落或几句相关的新句。'}观点、支撑和数据都要回应新题。</p>`}
    ${drill.scaffold ? '<p class="hint">最近两次还没通过，这次缩小任务。先做清楚一个小步骤，卡住时看下方的对比例子。</p>' : ''}
    <p class="hint">${transfer ? "先独立作答，再核对标准。使用提示会记录为辅助练习，次日用另一题复测。" : "先尝试自己的改法，卡住时再看提示。短练习的最低字数用于留够检查材料，不是官方评分规则。"}</p>
    <p class="en">${esc(transfer ? q?.question || "暂无不同题目可供复测，请先在题库补充新题。" : item.question || "原诊断未附题干，请对照原题完成改写。")}</p>
    ${item.mode === "t1" && typeof T1Charts !== "undefined" ? (q ? T1Charts.render(q.src) : (() => { const original = trainingPool().find(p => p.question === item.question && p.task === 1); return original ? T1Charts.render(original.src) : "<p class='hint'>请同时打开原题图表核对，规则扫描无法验证图表数据。</p>"; })()) : ""}
    ${!transfer ? `<details><summary>查看自己的原稿</summary><p class="en learning-text">${esc(item.essay)}</p></details>` : ""}
    ${full ? `<div class="learning-timer"><button id="learningTimerStart">开始 ${drill.minutes} 分钟计时</button><span id="learningTimerStatus" role="timer" aria-live="off">可选；超时也可保存作答</span></div>` : ''}
    <label class="learning-label" for="learningDraft">${transfer ? "新题独立作答" : "我的改写"}（自动保存）</label>
    <textarea id="learningDraft" rows="7" spellcheck="false">${esc(item.draft)}</textarea>
    <p id="learningCount" class="hint"></p>
    <p id="learningSaveStatus" class="save-status" role="status"></p>
    <details id="learningHint"><summary>卡住了，查看讲解与对比例子</summary><p>${esc(drill.hint)}</p>${drill.lesson ? `<div class="learning-lesson"><p class="hint">${esc(drill.lesson.context)}</p><h4>较弱写法</h4><p class="en">${esc(drill.lesson.weak)}</p><h4>改进写法</h4><p class="en">${esc(drill.lesson.stronger)}</p><h4>为什么这样改</h4><p>${esc(drill.lesson.why)}</p><p>${esc(drill.lesson.try)}</p></div>` : ''}<h4>对照你的原反馈</h4><p>${esc(item.focus.instruction)}</p>${item.focus.quote ? `<p class="en">原句：${esc(item.focus.quote)}</p>` : ''}${item.focus.example ? `<p class="en">参考改法：${esc(item.focus.example)}</p>` : ''}</details>
    ${transfer ? `<label class="learning-check-row"><input type="checkbox" id="learningAssisted" ${item.attemptAssisted ? 'checked disabled' : ''}>本次用过范文、词典、AI 或其他提示</label><p id="learningIndependence" class="hint" role="status">${item.attemptAssisted ? '本次已记录使用帮助；仍可完成练习，明天换题再试。' : '可如实记录外部帮助，不影响保存本次练习。'}</p>` : ''}
    <div class="btn-row"><button class="primary" id="learningCompare" ${transfer && !q ? "disabled" : ""}>写好了，对照目标自查</button><button id="learningBack">保存并返回</button></div>
    <p class="error" id="learningError" role="status"></p>
    <div id="learningCheck" class="hidden">
      <fieldset class="learning-criteria"><legend>逐项核验成功标准</legend>${drill.checks.map((check,n)=>`<label class="learning-check-row"><input type="checkbox" data-learning-check="${n}" ${item.reviewDraft?.checks?.[n] ? 'checked' : ''}>${esc(check)}</label>`).join('')}</fieldset>
      <p class="hint">自查结果保留为个人判断。工具只核验引用和练习条件；内容质量需要对照原题或请老师复核。</p>
      <label class="learning-label" for="learningQuote">从当前作答摘出证据原句</label><textarea id="learningQuote" rows="2" placeholder="在上方选中一句，再点“使用选中的句子”。">${esc(item.reviewDraft?.quote || '')}</textarea><button id="learningUseQuote">使用选中的句子</button>
      <label class="learning-label" for="learningEvidence">说明这句话如何做到，或写下疑问（可选）</label>
      <textarea id="learningEvidence" rows="2" placeholder="说明它解决了什么问题，或仍有哪些不确定。">${esc(item.reviewDraft?.note || '')}</textarea>
      <div class="btn-row"><button class="primary" id="learningPass">自查通过，安排下次复测</button><button id="learningRetry">还没掌握，继续练</button></div>
    </div>
  </section>`;
  const draft = host.querySelector("#learningDraft"), error = host.querySelector("#learningError");
  let sessionAssisted = !!item.attemptAssisted, externalHelp = false;
  const saveText = () => {try {Learning.update(id,i=>{if(i.draft!==draft.value){i.reviewSnapshot=null;i.reviewDraft=null;}i.draft=draft.value;});return true;}catch(e){error.textContent=e.message;return false;}};
  draft.oninput = () => {
    UI.save('learning-'+id,saveText,host.querySelector('#learningSaveStatus'));
    host.querySelector("#learningCount").textContent = `${Learning.words(draft.value)} 词`;
    host.querySelectorAll('[data-learning-check]').forEach(c=>{c.checked=false;});
    host.querySelector('#learningQuote').value='';
    host.querySelector('#learningEvidence').value='';
    host.querySelector("#learningCheck").classList.add("hidden");
  };
  host.querySelector('#learningCount').textContent=`${Learning.words(draft.value)} 词`;
  const persistReview = () => {
    try { Learning.update(id,i=>{i.reviewDraft={quote:host.querySelector('#learningQuote').value,note:host.querySelector('#learningEvidence').value,checks:[...host.querySelectorAll('[data-learning-check]')].map(c=>c.checked)};}); }
    catch(e){error.textContent=e.message;}
  };
  host.querySelectorAll('#learningQuote,#learningEvidence,[data-learning-check]').forEach(el=>el.oninput=persistReview);
  host.querySelector('#learningUseQuote').onclick=()=>{host.querySelector('#learningQuote').value=draft.value.slice(draft.selectionStart,draft.selectionEnd);persistReview();};
  const markHelp = external => {
    sessionAssisted = true; externalHelp ||= external;
    try { UI.flush();Learning.markAssisted(id);if(external)Learning.update(id,i=>{if(i.reviewSnapshot)i.reviewSnapshot.assisted=true;}); }
    catch(e){error.textContent=e.message;}
    const status=host.querySelector('#learningIndependence');
    if(status)status.textContent='已记录提示使用。自查前已提交的原作答可保留独立性；看提示后再改写需次日换题检验。';
  };
  const hint=host.querySelector('#learningHint');
  // Native toggle is queued; persist before a user can immediately reload.
  hint.querySelector('summary').onclick=()=>{if(!hint.open)markHelp(false);};
  hint.ontoggle=e=>{if(e.target.open&&!sessionAssisted)markHelp(false);};
  const assisted=host.querySelector('#learningAssisted');
  if(assisted)assisted.onchange=()=>{if(assisted.checked){assisted.disabled=true;markHelp(true);}};
  const skill=host.querySelector('#learningSkill');
  if(skill)skill.onchange=()=>{try{UI.flush();Learning.changeSkill(id,skill.value);openLearningPractice(id);}catch(e){error.textContent=e.message;}};
  host.querySelector("#learningBack").onclick = () => {UI.flush();if(UI.save('learning-'+id,saveText,host.querySelector('#learningSaveStatus'),true))renderHome();};
  host.querySelector("#learningCompare").onclick = () => {
    try { UI.flush();if(sessionAssisted)Learning.markAssisted(id);Learning.prepareReview(id,draft.value); } catch(e){error.textContent=e.message;return;}
    const complete = Learning.words(draft.value) >= drill.min;
    error.textContent = complete ? '' : `请至少写 ${drill.min} 个英文词才能标记通过；当前尝试可以选择“还没掌握，继续练”保存。`;
    host.querySelector('#learningPass').disabled=!complete;
    host.querySelector("#learningCheck").classList.remove("hidden");
  };
  const submit = passed => {
    try {
      UI.flush();
      const saved = Learning.saveAttempt(id, { text: draft.value, question: transfer ? q?.question : item.question, passed,
        note: host.querySelector("#learningEvidence").value, quote: host.querySelector('#learningQuote').value,
        checks:[...host.querySelectorAll('[data-learning-check]')].map(c=>c.checked), assisted:externalHelp });
      renderHome();
      const message = document.createElement("p");
      message.className = "learning-notice"; message.setAttribute("role", "status");
      const last=saved.attempts[saved.attempts.length-1];
      message.textContent = saved.status === "consolidated" ? "已保存整篇验证与证据。这个目标已完成独立自查，请再用外部反馈核验写作质量。" : saved.status === 'benchmark' ? '已连续三次独立换题自查通过，明天安排一份完整新题答卷验证。' : transfer && !last.independent ? "已保存辅助练习。本次不增加独立通过次数，明天换一道题复测。" : drill.benchmark ? '整篇验证还有待修复，明天先回到针对性练习，重新检验这个目标。' : passed ? "已保存自查与作答。下次将用另一道题检验能否独立做到。" : "已记录这次练习。保留这个目标，继续修改或明天再试。";
      document.getElementById("learningHome").prepend(message);
    } catch (e) { error.textContent = e.message; }
  };
  host.querySelector("#learningPass").onclick = () => submit(true);
  host.querySelector("#learningRetry").onclick = () => submit(false);
  if(full)mountLearningTimer(host,id,drill.minutes);
  host.querySelector("#learningTitle").focus();
}

let learningTimerId = null;
function mountLearningTimer(host,id,minutes) {
  clearInterval(learningTimerId);
  const status=host.querySelector('#learningTimerStatus'),button=host.querySelector('#learningTimerStart');
  const tick = () => {
    if(!status.isConnected){clearInterval(learningTimerId);return;}
    const item=Learning.read().items.find(i=>i.id===id),timer=item?.practiceTimer;
    if(!timer)return;
    button.disabled=true;
    const frozen=item.reviewSnapshot?.text===item.draft;
    const left=Math.ceil((timer.startedAt+timer.duration-(frozen ? item.reviewSnapshot.date : Date.now()))/1000),abs=Math.abs(left);
    status.textContent=(frozen?'提交时 ':'')+(left>=0?'剩余 ':'已超时 ')+`${String(Math.floor(abs/60)).padStart(2,'0')}:${String(abs%60).padStart(2,'0')}`;
  };
  button.onclick=()=>{try{Learning.update(id,i=>{i.practiceTimer ||= {startedAt:Date.now(),duration:minutes*60000};});tick();}catch(e){host.querySelector('#learningError').textContent=e.message;}};
  tick();learningTimerId=setInterval(tick,1000);
}

function mountLearningFeedback(host, context, res, ai) {
  let item;
  try {item=Learning.capture(context,res,ai);}catch(e){UI.notice(e.message,{error:true});return;}
  const box = document.createElement("div");
  box.className = "learning-feedback";
  const drill=Learning.drill(item);
  box.innerHTML = `<h3>这次先改一个问题</h3><p><b>${esc(item.focus.title)}</b></p>
    ${item.focus.quote&&context.essay.includes(item.focus.quote)?`<blockquote class="focus-evidence en">${esc(item.focus.quote)}</blockquote>`:''}
    ${item.focus.why?`<p>${esc(item.focus.why)}</p>`:''}<p>${esc(drill.task)}</p>
    <details class="focus-checks"><summary>怎样知道改好了</summary><ul>${drill.checks.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></details>
    <p class="hint">${esc(item.focus.source)} · 原稿已保存到今日训练 · 约 ${Learning.drill(item).minutes} 分钟</p>
    <button class="primary learning-open">${item.status === "repair" ? "现在改写这个问题" : "查看今日训练与复测安排"}</button>`;
  host.prepend(box);
  box.querySelector("button").onclick = () => item.status === "repair" ? openLearningPractice(item.id) : goto("train");
}
