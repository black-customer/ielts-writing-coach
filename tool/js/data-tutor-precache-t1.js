/* data-tutor-precache-t1.js — 剑15-21 小作文（Task 1）读图课预生成（零 API 消耗）
 * 结构与 Tutor.teach0（task 1 分支）的 JSON 输出一致：stanceOptions=分段方案，ideaOutline=两个细节段分工 */
const TutorPrecacheT1 = {
  "剑15 Test 1 T1": {
    typeExplain: "分组柱图：5 个澳大利亚城市 × 3 种习惯（去咖啡馆/买速溶/买现磨）的百分比（过去4周），无年份→一般过去时。一眼可见：去咖啡馆在 4 城超过 55%，Adelaide（约49%）是唯一例外；店内购买中速溶普遍高于现磨。",
    stanceOptions: [
      { s: "按习惯分两段：咖啡馆一段、店内购买一段", why: "每段内部自然形成城市对比，最清晰", difficulty: "好写" },
      { s: "按城市写：一城一句", why: "5 个城市各写一遍=流水账", difficulty: "难写" },
      { s: "按最高组+例外分两段", why: "可以，但速溶vs现磨的对比放不下", difficulty: "一般" }
    ],
    recommended: "按习惯分两段：咖啡馆一段、店内购买一段",
    recommendedWhy: "柱图的比较维度是习惯，按习惯分组每段都有现成的对比结构。",
    ideaOutline: { body1: "Café visits: Sydney/Melbourne/Hobart ~63-64%, Brisbane 55%, Adelaide the only sub-50%", body2: "Instant outsells fresh everywhere (54-55% vs 46-48%); fresh lowest overall (Adelaide 31%)" },
    guideQ: "三种习惯里，哪一栏的城市间差异最大？差异最大的最先写。"
  },
  "剑15 Test 2 T1": {
    typeExplain: "三线图：总游客/乘游轮/住岛，单位百万人，2010-2017→全过去时。头条：游轮客从最小（0.25m）一路爬升，2016 年前后反超住岛客；总量升至 3.5m。",
    stanceOptions: [
      { s: "成分线一组+总量线单独一段", why: "反超交叉点必须在同一段才写得清；总量段用 As a result 衔接", difficulty: "好写" },
      { s: "按时间分两段（2010-13 / 2014-17）", why: "三线交叉时分不清主语", difficulty: "难写" },
      { s: "一条线一段", why: "反超关系被拆散，概括白写", difficulty: "难写" }
    ],
    recommended: "成分线一组+总量线单独一段",
    recommendedWhy: "住岛与游轮的交叉是全图头条，必须同段呈现。",
    ideaOutline: { body1: "Island stayers 0.75→1.5m (2013) then flat; cruise 0.25m→2.0m, overtaking in 2016", body2: "Total 1.0→1.5m (2012-13)→2.5m (2015-16)→3.5m (2017), the highest shown" },
    guideQ: "哪两条线有交叉？交叉点在第几年？——它们必须在同一段里。"
  },
  "剑15 Test 3 T1": {
    typeExplain: "流程图：速食面 8 步，无时间→一般现在时+被动语态。起点=面粉从储存仓运出，终点=封口贴标待运；前四步是成型（mixer→sheets→strips→discs），后四步是烹制装杯。",
    stanceOptions: [
      { s: "中点切两段：前四步一段、后四步一段", why: "天然分界（成型vs烹制），每段四步负担均衡", difficulty: "好写" },
      { s: "按原料/加工/包装分三段", why: "超出四段结构，字数爆", difficulty: "难写" },
      { s: "一步一句顺写", why: "流水账，衔接词连发", difficulty: "难写" }
    ],
    recommended: "中点切两段：前四步一段、后四步一段",
    recommendedWhy: "油炸是自然中点，两边各四步正好对称。",
    ideaOutline: { body1: "Silos → mixer (flour+oil+water→dough) → rollers → sheets → strips → discs", body2: "Cooked in boiling oil → dried → cups with vegetables & spices → sealed & labelled" },
    guideQ: "第一步和第八步分别是什么？流程图的概括必须由这两个端点框住。"
  },
  "剑15 Test 4 T1": {
    typeExplain: "饼图+表格：饼图=毕业生去向（6类%），表=三类在职者5年后各薪资段占比。调查结果→一般过去时或现在时皆可（保持一致）。头条：52% 全职工作；$100k+ 段政府雇员占 50%。",
    stanceOptions: [
      { s: "一图一段：饼图一段、表格一段", why: "双图题的标准分工，overview 一句一图", difficulty: "好写" },
      { s: "按「就业去向/薪资高低」交叉分", why: "两图数据无法对应，结构混乱", difficulty: "难写" },
      { s: "饼图逐块写+表格逐行写", why: "纯罗列，分组全无", difficulty: "难写" }
    ],
    recommended: "一图一段：饼图一段、表格一段",
    recommendedWhy: "两张图主题独立（去向 vs 薪资），按图分最干净。",
    ideaOutline: { body1: "52% full-time + 15% part-time; remaining categories grouped and listed in order", body2: "Government tops $100k+ (50%) vs freelance 40%, private 30%; very few under $50k" },
    guideQ: "每张图各用一句话说出它最显眼的结论——这两句就是你的 overview。"
  },
  "剑16 Test 1 T1": {
    typeExplain: "线图：3 种家电拥有率（%）+ 每周家务小时数，1920-2019→过去时。头条：冰箱/吸尘器趋近 100% 普及的同时家务时长从 50 小时跌到 10 小时——两条信息一升一降互为因果。",
    stanceOptions: [
      { s: "一图一段：家电三条线一段、家务线一段，结尾对比", why: "两条信息单位不同，分面板最干净", difficulty: "好写" },
      { s: "按时间两段（1920-1969 / 1970-2019）", why: "跨图分时段，读者要来回对位", difficulty: "难写" },
      { s: "四条线各一段", why: "段数爆、且家务线撑不起一段", difficulty: "难写" }
    ],
    recommended: "一图一段：家电三条线一段、家务线一段，结尾对比",
    recommendedWhy: "结尾用「家务缩到原来的五分之一」把两张图拧在一起。",
    ideaOutline: { body1: "Fridge 0→45% (1940)→100% (1980); vacuum→~100% (2000); washing slowest 40→75%", body2: "Hours halved 50→20 by 1950, then 10 by 2019 — shrinking to a fifth overall" },
    guideQ: "两条信息单位不同（% 和小时），能画进同一个 Y 轴吗？不能就该分开写。"
  },
  "剑16 Test 2 T1": {
    typeExplain: "流程图：甘蔗制糖 7 步，无时间→现在时被动。起点=种植（12-18 个月），终点=干燥冷却；有一个分支（收割可机器可人工）；第四步起进入工厂。",
    stanceOptions: [
      { s: "田间三步一段、工厂四步一段", why: "以「进厂」为界，前后各自成体系", difficulty: "好写" },
      { s: "按步数对半切（3/4）", why: "恰好也是田间/工厂的分界，但表述要点明", difficulty: "一般" },
      { s: "一步一句顺写", why: "流水账", difficulty: "难写" }
    ],
    recommended: "田间三步一段、工厂四步一段",
    recommendedWhy: "「fields → factory」是这张图最自然的叙事分界。",
    ideaOutline: { body1: "Grow 12-18 months → harvest mechanically or by hand → crushing mill extracts juice", body2: "Filter → evaporator heat → syrup → centrifuge separates crystals → dry & cool" },
    guideQ: "收割的两种方式（机器/人工）你打算怎么写？并成一句 either...or 才对。"
  },
  "剑16 Test 3 T1": {
    typeExplain: "地图：机场现状 vs 明年翻修后→现状一般现在时+规划将来时（will be）。头条：登机口 8→10；登机走廊改为 sky train；新增 bag drop、security 后移、café 扩为 café+shop。",
    stanceOptions: [
      { s: "按区域两段：入口半区一段、登机半区一段", why: "每段内部「现状一句+将来改动」，时态切换清晰", difficulty: "好写" },
      { s: "按时间两段：现在全部→将来全部", why: "所有设施要说两遍，字数爆炸", difficulty: "难写" },
      { s: "逐变化罗列", why: "地图变化罗列=流水账", difficulty: "难写" }
    ],
    recommended: "按区域两段：入口半区一段、登机半区一段",
    recommendedWhy: "区域分半让每处变化都落位，动词（add/move/convert）各就各位。",
    ideaOutline: { body1: "Entrance: bag drop added, security moved behind check-in, café → café+shop", body2: "Walkway → sky train; 8 → 10 gates; bigger waiting area with more facilities" },
    guideQ: "每处变化属于新增/拆除/移位/改用途哪一类？你的动词选对类了吗？"
  },
  "剑16 Test 4 T1": {
    typeExplain: "流程图：塑料瓶回收 9 步，无时间→现在时被动。起点=投入回收桶，终点=新产品；前半是收集与预处理（人工+卡车+分拣），后半是工厂制造。",
    stanceOptions: [
      { s: "进厂前一段（1-6步）、制造一段（7-9步）", why: "以 bottle reaches the factory 为界，段旨清晰", difficulty: "好写" },
      { s: "三三三分三段", why: "超出四段结构", difficulty: "难写" },
      { s: "顺写不分组", why: "9 步顺写必然流水账", difficulty: "难写" }
    ],
    recommended: "进厂前一段（1-6步）、制造一段（7-9步）",
    recommendedWhy: "「进厂」是流程里最醒目的场景切换。",
    ideaOutline: { body1: "Bins → collected by lorry → sorted → compressed → crushed → washed", body2: "Melted → pellets → heated & rolled → sheets → new products (clothes, toys)" },
    guideQ: "相邻的几个机械步骤，你并成一句写了吗？一步一句太机械。"
  },
  "剑17 Test 1 T1": {
    typeExplain: "地图：Norbiton 工业区现状 vs 未来规划→现在时+将来时（will be）。头条：工厂全部改住宅；路网扩展+跨河新桥；farmland 改住宅；学校保留+新增 playground。",
    stanceOptions: [
      { s: "主体改造一段+生活配套一段", why: "「拆工厂建住宅+桥」是主戏，配套第二幕", difficulty: "好写" },
      { s: "按方位（路北/路南）分", why: "变化跨方位，切割别扭", difficulty: "难写" },
      { s: "按变化清单罗列", why: "没有空间叙事", difficulty: "难写" }
    ],
    recommended: "主体改造一段+生活配套一段",
    recommendedWhy: "第一段讲「变成什么」，第二段讲「配套与保留」，主次分明。",
    ideaOutline: { body1: "Every factory → housing on new side streets; new roundabout, bridge; farmland converted", body2: "Shops on main road; school retained + new playground; area becomes residential" },
    guideQ: "保留下来的学校你打算写在哪段？不变项也是地图信息。"
  },
  "剑17 Test 2 T1": {
    typeExplain: "表+双饼图：警察预算来源（2017/2018 金额 £m）+支出占比。金额→过去时。头条：总预算 304.7→318.6m，主要增量来自 local taxes；支出中 technology 8%→14% 近翻倍。",
    stanceOptions: [
      { s: "来源（表）一段+支出（双饼合写）一段", why: "一图一段的标准双图结构", difficulty: "好写" },
      { s: "按年份 2017/2018 分两段", why: "两张图被拆开，overview 难写", difficulty: "难写" },
      { s: "只写表格，饼图一笔带过", why: "漏一半图，TA 重伤", difficulty: "难写" }
    ],
    recommended: "来源（表）一段+支出（双饼合写）一段",
    recommendedWhy: "表格算增量、饼图比占比，两段各有算法。",
    ideaOutline: { body1: "Total 304.7→318.6m; local taxes biggest jump 91.2→102.3; government largest source", body2: "Salaries 75→69%, technology 8→14% (nearly doubled), buildings steady 17%" },
    guideQ: "表格两个年份的数字，你算了「增量」吗？增量比原值更有信息量。"
  },
  "剑17 Test 3 T1": {
    typeExplain: "分组柱图：7 类支出 × 2 年（1968/2018）占比%。全过去时。头条：food 35→17 仍居前列；housing 10→19、leisure 6→13 大涨（leisure 完成超越）。",
    stanceOptions: [
      { s: "大变化类别一段+其余归堆一段", why: "food/housing/leisure 各有一对数字，小项打包", difficulty: "好写" },
      { s: "按年份两段", why: "类内对比被拆散，只能罗列", difficulty: "难写" },
      { s: "按涨/跌分两段", why: "可行但 transport 类涨跌不明显易乱", difficulty: "一般" }
    ],
    recommended: "大变化类别一段+其余归堆一段",
    recommendedWhy: "「王位更替」（food 让位 leisure）是第一段的故事线。",
    ideaOutline: { body1: "Food 35→17; housing 10→19; transport 8→11; leisure 6→13 overtakes all but housing", body2: "Clothing, household goods & personal items all fell; budget shifted to living well" },
    guideQ: "1968 年和 2018 年「最大的一根柱子」分别是什么？这就是你的概括。"
  },
  "剑17 Test 4 T1": {
    typeExplain: "双线图：商店开张 vs 关张数，2011-2018。全过去时。头条：两线都剧烈波动，2012 关店骤降至 600，2014 交叉（约7000），2018 汇聚于约 3000。",
    stanceOptions: [
      { s: "一线一段：开张一段、关张一段（交叉点写进关张段）", why: "每条线 4 个拐点，单独成段才装得下", difficulty: "好写" },
      { s: "按时间两段", why: "两线混写易乱", difficulty: "难写" },
      { s: "按涨跌分段", why: "两线都多次涨跌，切不清", difficulty: "难写" }
    ],
    recommended: "一线一段：开张一段、关张一段（交叉点写进关张段）",
    recommendedWhy: "每条线形状丰富（骤降/回升/走低），各自成段正好写足。",
    ideaOutline: { body1: "Openings 8,500→4,000 (2012)→recover to ~7,000 (2014-15)→3,000 (2018)", body2: "Closures 7,000→600 (2012)→cross above openings in 2014→ease to 3,000" },
    guideQ: "两线的交叉在哪一年？交叉点是双线图最值钱的一个数。"
  },
  "剑18 Test 1 T1": {
    typeExplain: "四线图（含 2030 预测虚线）：四国城市人口 %，1970-2020+2030。过去时+将来时（is forecast to）。头条：四国全部上升；马来西亚一直最高；到 2030 差距收窄至 55-78%。",
    stanceOptions: [
      { s: "最高者一段（详写）+其余三国一段", why: "近似线合并（菲泰）、追赶者（印尼）单独讲收窄", difficulty: "好写" },
      { s: "四线各一段", why: "段数爆且菲律宾泰国高度重复", difficulty: "难写" },
      { s: "按年份两段", why: "预测段与历史段混切，时态乱", difficulty: "难写" }
    ],
    recommended: "最高者一段（详写）+其余三国一段",
    recommendedWhy: "详写最陡的马来西亚，近似并写、追赶收尾，详略分明。",
    ideaOutline: { body1: "Malaysia 30→70, forecast 78; Philippines & Thailand follow similar mid-paths", body2: "Indonesia lowest 15→42, forecast ~55 — all four within 55-78% by 2030" },
    guideQ: "形状相近的两条线，你合并成一句写了吗？逐条写既慢又重复。"
  },
  "剑18 Test 2 T1": {
    typeExplain: "分组柱图：5 个年收入档 × 3 年（2007/2011/2015），单位百万户。过去时。头条：$25-49.9k 档始终最大（约30m）；$100k+ 档连续增长至 26m。",
    stanceOptions: [
      { s: "稳定底部一段+变化顶部一段", where: "", why: "「哪里不变+哪里在变」各一段，正好呼应概括", difficulty: "好写" },
      { s: "按年份三段", why: "段数多且重复", difficulty: "难写" },
      { s: "按档位五段", why: "流水账", difficulty: "难写" }
    ],
    recommended: "稳定底部一段+变化顶部一段",
    recommendedWhy: "底部三档并写、顶部两档对比，结尾一句「bottom stable, top expanding」。",
    ideaOutline: { body1: "25-49.9k largest just under 30m; <$25k 26-27m; middle band slightly smaller", body2: "75-100k 16→18m; 100k+ 18→26m, overtaking every band except the largest" },
    guideQ: "哪里三年不动、哪里在涨？你的两段就按这个切。"
  },
  "剑18 Test 3 T1": {
    typeExplain: "地图：中央图书馆 20 年前 vs 现在。过去布局用过去时，现在用现在完成时被动（has been converted）。头条：藏书空间→社交/活动空间；技术替代人工服务；儿童区保留。",
    stanceOptions: [
      { s: "过去布局一段+现在布局一段", why: "时态天然分段，进门动线走一遍", difficulty: "好写" },
      { s: "按房间逐个对比", why: "房间多，逐个对比=流水账", difficulty: "难写" },
      { s: "只写变化不写原布局", why: "缺对照，改写无从谈起", difficulty: "难写" }
    ],
    recommended: "过去布局一段+现在布局一段",
    recommendedWhy: "旧图立坐标、新图讲变化，give way to / replaced by 动词有对照。",
    ideaOutline: { body1: "Shelves, staffed enquiry desk, newspapers room, CDs corner, children's area", body2: "Sofas & study tables, café, self-service machines, storytelling space; children's books remain" },
    guideQ: "旧图的每个设施，在新图里找到了「下落」吗？消失/替换/保留三选一。"
  },
  "剑18 Test 4 T1": {
    typeExplain: "三线图：铜/镍/锌 2014 年每月价格环比变化（%），上下穿过 0 轴。过去时。头条：镍最波动（3月+8%→6月-5%）；三者年末都以小涨收尾。注意量的是「变化率」不是价格。",
    stanceOptions: [
      { s: "波动组一段（镍详写+锌类比）+平稳组一段（铜）", why: "详写极端、类比温和，最后铜给年末对比", difficulty: "好写" },
      { s: "三线各一段", why: "镍内容多、铜内容少，失衡", difficulty: "一般" },
      { s: "按上半年/下半年", why: "三线混切，主语混乱", difficulty: "难写" }
    ],
    recommended: "波动组一段（镍详写+锌类比）+平稳组一段（铜）",
    recommendedWhy: "镍 13 个点的摆幅是全图头条，锌用 a milder version 一句带过最省。",
    ideaOutline: { body1: "Nickel surges to 8% (Mar), sinks to -5% (Jun), closes at 1%; zinc milder same shape", body2: "Copper negative first half, steady recovery, strongest December at 2%" },
    guideQ: "开头交代「量的是环比变化」了吗？这类图的头号失分点就是口径不清。"
  },
  "剑19 Test 1 T1": {
    typeExplain: "八线图：墨尔本某活动中心 8 种活动参与人数，2000-2020。全过去时。头条：yoga/pilates 从零飙升（新活动）；film club 一直第一；table tennis 几乎腰斩再腰斩。",
    stanceOptions: [
      { s: "新兴活动一段+老牌活动一段", why: "按「兴、稳、衰」命运分类，八线变两组", difficulty: "好写" },
      { s: "八线各一段", why: "不可能写完", difficulty: "难写" },
      { s: "只写涨跌最狠的三条", why: "漏掉 film club 第一与 steady 组，覆盖不全", difficulty: "一般" }
    ],
    recommended: "新兴活动一段+老牌活动一段",
    recommendedWhy: "新活动有「出生点」故事（2005年3人起步），老牌按稳/衰归堆。",
    ideaOutline: { body1: "Yoga from 3 (2005)→55; pilates 28 (2010)→55; Middle Eastern dance 18→30", body2: "Film club 65→68 top throughout; dramatics/musical steady; table tennis 15→5" },
    guideQ: "八条线按「兴/稳/衰」分成三堆——你堆好了吗？"
  },
  "剑19 Test 2 T1": {
    typeExplain: "地图：海港 2000 vs 今天。过去时+现在完成时被动。头条：渔港转休闲港——渔船消失、码头泊游艇、仓库改公寓餐厅、marina 扩建；渡轮码头保留。",
    stanceOptions: [
      { s: "2000 布局一段+今天一段", why: "旧图立坐标（每设施带用途），新图写变化与保留", difficulty: "好写" },
      { s: "按码头/仓库/商店分三段", why: "拆散时间线，时态乱", difficulty: "难写" },
      { s: "只写变化清单", why: "没有旧貌对照", difficulty: "难写" }
    ],
    recommended: "2000 布局一段+今天一段",
    recommendedWhy: "「性质转变」（fishing→leisure）放概括，两段细节各有分工。",
    ideaOutline: { body1: "Fishing pier + warehouses, small marina, one café, ferry terminal (2000)", body2: "Yachts replace fleet; warehouses → apartments & restaurants; marina extended; ferry stays" },
    guideQ: "旧图的每个设施（ pier/仓库/marina/café/渡轮），今天都「有了下落」吗？"
  },
  "剑19 Test 3 T1": {
    typeExplain: "循环流程图：乙醇（生物燃料）的生产与使用闭环，约9步。一般现在时；自然环节（树吸收、微生物发酵）主动语态，工业环节被动。头条：闭环——车辆排放的 CO₂ 回到树。",
    stanceOptions: [
      { s: "生产半环一段+使用半环一段", why: "「树→乙醇」与「油→CO₂→回树」天然两幕", difficulty: "好写" },
      { s: "按步数对半切", why: "切点不在场景转换处，叙事突兀", difficulty: "一般" },
      { s: "顺写九步", why: "闭环感全无，flow 全靠 Firstly", difficulty: "难写" }
    ],
    recommended: "生产半环一段+使用半环一段",
    recommendedWhy: "第二段结尾「the cycle begins anew」把环正式合拢。",
    ideaOutline: { body1: "Absorb sunlight & CO₂ → harvest → store → chip → cellulose → sugars → ferment → ethanol", body2: "Distributed & burned in vehicles → CO₂ released → absorbed by trees again" },
    guideQ: "你的最后一步接回第一步了吗？循环图的结尾必须合环。"
  },
  "剑19 Test 4 T1": {
    typeExplain: "饼图+柱图：澳大利亚某镇年轻人舞蹈课——饼图=上课地点占比，柱图=各舞种人数。过去时/现在时保持一致。头条：私教室 48% 遥遥领先；ballet 600 人第一。",
    stanceOptions: [
      { s: "一图一段：饼图一段、柱图一段", why: "两图主题独立（where vs what），标准分工", difficulty: "好写" },
      { s: "按学生类型交叉写", why: "两图维度无法对应", difficulty: "难写" },
      { s: "只写各自最大值", why: "漏掉梯度与次要份额", difficulty: "难写" }
    ],
    recommended: "一图一段：饼图一段、柱图一段",
    recommendedWhy: "饼图讲份额归堆，柱图讲梯度与倍数，最后 Taken together 合读。",
    ideaOutline: { body1: "Private studios 48%, school halls 24%, community 18%, college 10%", body2: "Ballet ~600 top; modern/tap ~510/450; ballroom half of ballet; folk <100" },
    guideQ: "饼图份额加起来是 100%——「其余的」你用 remaining 收完了吗？"
  },
  "剑20 Test 1 T1": {
    typeExplain: "双表：纽约市总人口（1800-2000）+五区分布。全过去时。头条：人口 57 倍增长至 800 万；份额从曼哈顿（期初几乎全部）反转到外区（曼哈顿 2000 年仅约 1/5）。",
    stanceOptions: [
      { s: "总量表一段+分区表一段", why: "每张表独立成段，各自算账（倍数/份额）", difficulty: "好写" },
      { s: "按世纪分两段", why: "两表拆乱", difficulty: "难写" },
      { s: "只写总量", why: "漏半图", difficulty: "难写" }
    ],
    recommended: "总量表一段+分区表一段",
    recommendedWhy: "总量算倍数（57 倍），分区算份额反转（1 in 5），两段各有一个高光算法。",
    ideaOutline: { body1: "60,000→3.4m (1900, 57-fold) → peak ~8m (1950), stable to 2000", body2: "Queens & Bronx multiply 1900-1950; Manhattan down to about one resident in five" },
    guideQ: "两个数字到手先算什么？倍数和份额——表格题的两个算法。"
  },
  "剑20 Test 2 T1": {
    typeExplain: "地图：农场 1950 vs 今天。过去时+现在完成时被动。头条：农场消失、场地转住宅（谷仓改住宅、农田部分改 housing estate）；乡路拓宽为公路+新增公交站。",
    stanceOptions: [
      { s: "1950 布局一段+今天一段", why: "旧图按「院中心-环绕-延伸」立坐标，新图按变化类别写", difficulty: "好写" },
      { s: "按建筑/土地/道路三段", why: "段内时态混切", difficulty: "难写" },
      { s: "只写变化", why: "无对照", difficulty: "难写" }
    ],
    recommended: "1950 布局一段+今天一段",
    recommendedWhy: "结尾用「公交站在旧时农场大门处」做同址今昔对照，最有力。",
    ideaOutline: { body1: "Farmhouse, barn, dairy, sheep pens, well grouped in a yard; fields all round; narrow lane", body2: "Barn → second dwelling; pens → lawns & driveway; field → estate + car park; lane → main road" },
    guideQ: "变化动词分五类（新增/拆除/移位/改用途/扩建）——你的每处变化选对类了吗？"
  },
  "剑20 Test 3 T1": {
    typeExplain: "混合图：Little Chalfont 图书馆——线图（年访问量 2000-2020）+柱图（到馆目的 2000 vs 2020 %）。过去时。头条：访问量翻倍（40k→80k）；目的质变——借书从 60% 主导降到 30%，被电脑（40%）反超。",
    stanceOptions: [
      { s: "一图一段：线图一段（量）、柱图一段（质）", why: "量与质各一段，结尾合读一句", difficulty: "好写" },
      { s: "按年份两段", why: "两图数据被拆乱", difficulty: "难写" },
      { s: "只写访问量", why: "漏半图", difficulty: "难写" }
    ],
    recommended: "一图一段：线图一段（量）、柱图一段（质）",
    recommendedWhy: "量增的原因藏在质变里，结尾一句把两图接通。",
    ideaOutline: { body1: "Visits 40,000 (2000) → 65,000 (2010) → 80,000 (2020), doubling over the period", body2: "Borrowing 60→30% overtaken by computers 5→40%; events 0→20%; study shrinks" },
    guideQ: "「量」和「质」两图——你的 overview 是否各给了一句？"
  },
  "剑20 Test 4 T1": {
    typeExplain: "流程图：竹子制布 9 步，无时间→现在时被动。起点=生长的竹子，终点=成衣；特殊信息：竹子自根系再生、无需再植（可作点睛）。",
    stanceOptions: [
      { s: "成纤维一段（1-6步）+纺织成衣一段（7-9步）", why: "「纤维化→纺织」是工序天然分界", difficulty: "好写" },
      { s: "按室外/工厂分", why: "与纤维/纺织分界重合但表述更绕", difficulty: "一般" },
      { s: "顺写九步", why: "流水账", difficulty: "难写" }
    ],
    recommended: "成纤维一段（1-6步）+纺织成衣一段（7-9步）",
    recommendedWhy: "结尾可回扣「自再生」特性，让流程图有超出步骤的一层。",
    ideaOutline: { body1: "Grows (self-regenerating) → cut in spring → strips → crushed → soaked → fibres combed", body2: "Spun into yarn → woven → dyed, cut & sewn into garments; no replanting needed" },
    guideQ: "流程图里除步骤外的「隐藏信息」（竹子自再生），你读出来了吗？"
  },
  "剑21 Test 1 T1": {
    typeExplain: "四线图：美国四大经济部门就业人数（百万），1960-2020。全过去时。头条：services 从 14m 涨到 50m、超过其余三部门总和；manufacturing 从 15m 跌破 8m。",
    stanceOptions: [
      { s: "服务业主线一段+其余三线一段", why: "最陡的一条线独占一段（里程碑+倍数），其余打包", difficulty: "好写" },
      { s: "四线各一段", why: "construction/agriculture 内容撑不起一段", difficulty: "难写" },
      { s: "按年份两段", why: "四线混切", difficulty: "难写" }
    ],
    recommended: "服务业主线一段+其余三线一段",
    recommendedWhy: "结尾「超过三部门总和」的加总对比最有冲击力。",
    ideaOutline: { body1: "Services 14m→25m (1980)→35m (2000)→50m (2020), more than tripling", body2: "Manufacturing 15m→below 8m; construction 4-7m with 2010 dip; agriculture drifts 3→1.5m" },
    guideQ: "最陡的一条线值得单独一段+里程碑年份——你打算给哪条线这个待遇？"
  },
  "剑21 Test 2 T1": {
    typeExplain: "地图：大学咖啡馆改造前 vs 现在。过去时+现在完成时被动。头条：空间扩大（并入储藏间）+功能重定位——从「买咖啡的地方」变成「学习枢纽」；部分柜台服务自动化。",
    stanceOptions: [
      { s: "改造前一段+改造后一段", why: "旧图埋「无学习设施」的钩子，新图逐条解决", difficulty: "好写" },
      { s: "按设施逐个对比", why: "设施少，拆散反而碎", difficulty: "一般" },
      { s: "只写新布局", why: "没有 before 的对照，改写无从体现", difficulty: "难写" }
    ],
    recommended: "改造前一段+改造后一段",
    recommendedWhy: "结尾重新定性（in effect, a small study hub）是改造图的终极答案。",
    ideaOutline: { body1: "One room, long counter, kitchen, rows of tables; nothing for studying", body2: "Absorbed storage room; counter shortened + self-service machine; high tables with sockets; sofa corner" },
    guideQ: "旧布局的哪个缺陷是新布局重点解决的？点破它，你的文章就有了主线。"
  },
  "剑21 Test 3 T1": {
    typeExplain: "自然过程图：雨影沙漠的形成（海洋→山→两侧气候相反）。主动语态为主（空气爬升/下沉），一般现在时。头条：不是缺水，而是山在迎风坡「抽干」了空气；同山两侧气候相反。",
    stanceOptions: [
      { s: "迎风半程一段+背风半程一段", why: "山顶是天然分界；两段因果链各自完整", difficulty: "好写" },
      { s: "按空气状态（湿/干）分", why: "与半程切分重合但不好定位", difficulty: "一般" },
      { s: "按图上箭头顺写", why: "无分组叙事", difficulty: "难写" }
    ],
    recommended: "迎风半程一段+背风半程一段",
    recommendedWhy: "每段结尾各有一个「结果」（绿侧/沙漠），因果闭环。",
    ideaOutline: { body1: "Moist ocean air blown coastward; rises up windward slope, cools, condenses → heavy rain, lush side", body2: "Dry air sinks leeward, compressed & warmed → no rain, land dries into rain-shadow desert" },
    guideQ: "为什么迎风坡绿、背风坡黄？一句话讲清，你的 overview 就成了。"
  },
  "剑21 Test 4 T1": {
    typeExplain: "柱图+表格：大学图书馆用户调查——柱图=到馆频次分布（%），表=三类用户的频率/用途/满意度。调查→过去时或现在时一致。头条：38% 天天到馆（超2/3每周3次以上）；职员到馆最少却最满意。",
    stanceOptions: [
      { s: "一图一段：柱图一段+表格一段", why: "柱图讲分布（加总一句），表格讲三类对比（反差一句）", difficulty: "好写" },
      { s: "按用户类型分三段", why: "柱图数据会被拆散", difficulty: "难写" },
      { s: "只写柱图", why: "漏表格", difficulty: "难写" }
    ],
    recommended: "一图一段：柱图一段+表格一段",
    recommendedWhy: "结尾 Taken together 点出「频次随研究能力下降」的结构。",
    ideaOutline: { body1: "Daily 38%, 3-5×/week 30%, 1-2× 25%, <1× 7% — over two thirds visit most days", body2: "Undergraduates most frequent (books/spaces); staff least frequent, most satisfied" },
    guideQ: "表格里最反直觉的一对事实是什么？把它写进 overview。"
  }
};
const TutorPrecache = Object.assign({}, TutorPrecacheT2, TutorPrecacheT1);
