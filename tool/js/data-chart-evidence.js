/* Manually checked against local source images, 2026-10-15.
 * Rendering specs are NOT evidence. Only descriptions explicitly verified below
 * may be sent as source facts. Unverified entries remain useful for viewing. */
const ChartEvidence = (() => {
  const descriptions={
    '剑10 Test 2': 'Two tables: sales of Fairtrade-labelled coffee and bananas, 1999 and 2004, millions of euros. Coffee (1999 → 2004): UK 1.5 → 20; Switzerland 3 → 6; Denmark 1.8 → 2; Belgium 1 → 1.7; Sweden 0.8 → 1. Bananas: Switzerland 15 → 47; UK 1 → 5.5; Belgium 0.6 → 4; Sweden 1.8 → 1; Denmark 2 → 0.9. Coffee sales increased in all five countries; banana sales fell in Sweden and Denmark.',
    '剑12 Test 4': 'Geothermal power plant. Cold water is pumped 4.5 km underground through an injection well. It passes through the geothermal zone (hot rocks). Heated water returns through a production well, entering a condenser, where steam is produced. Steam drives a turbine; the turbine powers a generator, which produces electricity for transmission. Five numbered parts: cold water pumped down; injection well; production well; steam; generator powered by turbine. Do not infer extra temperatures, quantities or fuel sources.',
    '剑13 Test 4': 'University sports centre, present and future plans; north is up. Present: central 25m pool, changing room west of pool, seating east, gym north, reception south; outdoor courts on both west and east. Future: building expands over both sets of outdoor courts. Leisure pool in west extension; new changing room in southwest, sports shop beside it near southern entrance. Existing changing room, 25m pool, seating and reception retained. Gym extends east; sports hall east of existing seating; two dance studios at far east, new changing room southeast, cafe south near entrance. No scale or exact new facility sizes stated.',
    '剑15 Test 4': 'Anthropology graduate destinations (%): full-time work 52; part-time work 15; part-time work plus postgraduate study 5; full-time postgraduate study 8; unemployed 12; not known 8. Salary distribution after five years of work, columns $25,000–49,999 / $50,000–74,999 / $75,000–99,999 / $100,000+: freelance consultants 5/15/40/40%; government sector 5/15/30/50%; private companies 10/35/25/30%. These are salary-band percentages, not absolute numbers of graduates.',
    '剑17 Test 2': 'Police budget, £m, 2017 → 2018: national government 175.5 → 177.8; local taxes 91.2 → 102.3; other sources (e.g. grants) 38.0 → 38.5; total 304.7 → 318.6. Spending shares 2017 → 2018: salaries (officers and staff) 75% → 69%; technology 8% → 14%; buildings and transport 17% → 17%. Budget amounts and expenditure percentages use different units.',
    '剑21 Test 4': 'Library user categories: full-time undergraduate 44%, full-time postgraduate 25%, part-time postgraduate 16%, distance learning (all courses) 8%, academic staff 7%. Satisfaction table columns very satisfied / fairly satisfied / not satisfied (%): opening hours 65/35/0; helpfulness of staff 95/5/0; availability of books 50/40/10; availability of journals 45/35/20; reliability of wi-fi 48/33/19. No visit-frequency data is shown.'
  };
  const conflicts={
    '剑15 Test 1':'重绘中多处咖啡购买比例与原图不同。','剑15 Test 2':'游客总量与分组数值不同。','剑15 Test 3':'重绘将烘干与装杯阶段重新分组，不能作完整原图证据。',
    '剑16 Test 1':'年份和家电拥有率不一致。','剑16 Test 2':'需逐阶段核验原图，暂不作为事实依据。','剑16 Test 3':'机场设施与位置重绘不同。','剑16 Test 4':'需逐阶段核验回收流程，暂不作为事实依据。',
    '剑17 Test 1':'工业区地图重绘无法作位置依据。','剑17 Test 3':'重绘类别与数值需核对。','剑17 Test 4':'关店年份低点和数值不一致。',
    '剑18 Test 1':'年份范围、人口比例与原图不同。','剑18 Test 2':'家庭收入分组数值不一致。','剑18 Test 3':'图书馆地图需以原图为准。','剑18 Test 4':'镍、锌等月度变化不一致。',
    '剑19 Test 1':'重绘增加原图不存在的活动类别。','剑19 Test 2':'港口设施和位置需以原图为准。','剑19 Test 3':'乙醇流程需逐阶段核验。','剑19 Test 4':'重绘舞种和年龄组与原图不同。',
    '剑20 Test 1':'人口表需逐单元格核验。','剑20 Test 2':'农场重绘与原图用途和设施不同。','剑20 Test 3':'重绘含原图没有的访问原因和访问量。','剑20 Test 4':'竹纤维流程需逐阶段核验。',
    '剑21 Test 1':'就业类别和数值与原图不同。','剑21 Test 2':'咖啡馆重绘设施与原图不同。','剑21 Test 3':'重绘含原图未标明的细节。'
  };
  const banks=[...QuestionBank,...(typeof ExtraQuestions==='undefined'?[]:ExtraQuestions),...(typeof QuestionsC1921==='undefined'?[]:QuestionsC1921)];
  const result={};
  Object.entries(T1ChartImgs).forEach(([key,path])=>{
    const q=banks.find(q=>q.src===key&&q.t1&&!/详见原书/.test(q.t1));
    result[key]={verified:!!descriptions[key],question:q?.t1||'',description:descriptions[key]||'',source:path,audited:'2026-10-15',note:descriptions[key]?'已逐项核对该文字描述；未使用旧重绘规格。':conflicts[key]||'已检查展示材料，尚无逐项核验的结构化转录，不使用绘图规格判断事实。'};
  });return result;
})();
