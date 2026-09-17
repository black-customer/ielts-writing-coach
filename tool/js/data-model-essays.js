/* data-model-essays.js — 预生成考官级范文 + 逐段教学包（由 build-model-essays.js 自动生成，勿手改）
 * 源文件: models/gen/*.json ｜ 质量标准: knowledge/13-我的写作体系.md
 * 结构: ModelEssays[qKey] = { source, chartNote?(T1), essay, paraTeach: {"2".."5": {why, modelPara, expressions, guideQ}} }
 */
const ModelEssays = {
  "剑15 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "柱图，5城市×3习惯的百分比（过去4周）：去咖啡馆喝咖啡/茶在四个城市超过55%（Sydney/Melbourne/Hobart约63%，Brisbane约55%），Adelaide例外仅约49%；速溶咖啡 Brisbane/Hobart约54-55%，Melbourne约48%，Sydney约46%；现磨咖啡全场最低：Adelaide约31%，Hobart约38%，Sydney约44%。",
    essay: "The bar chart compares the percentages of residents in five Australian cities who bought fresh coffee, bought instant coffee, or visited a café for coffee or tea in the last four weeks.\n\nIt is clear that going to a café was the most common habit in the majority of the cities shown. It is also noticeable that buying instant coffee was generally more popular than buying fresh coffee.\n\nGoing to a café was the most popular habit in four of the five cities: the proportion stood at roughly 63% in Sydney, Melbourne and Hobart, and slightly lower, at 55%, in Brisbane. In Adelaide, by contrast, the figure dipped to 49%, the only city where fewer than half of residents had done so.\n\nThe pattern for shop-bought coffee was different: in every city, instant coffee outsold the fresh variety. Around 54-55% of people in Brisbane and Hobart bought instant coffee, compared with roughly 46-48% in Melbourne and Sydney. Fresh coffee was the least common habit overall, purchased by just 31% of residents in Adelaide and 38% in Hobart, although the figure for Sydney was a little higher, at 44%.",
    paraTeach: {
      "2": {
        why: "开头一句完成全部改写：shows→compares（体系2.4规定的替换词）；people's coffee and tea buying and drinking habits→residents who bought..., bought..., or visited a café（抽象名词组改三个动词短语，信息一点不丢）；时间状语 in the last four weeks 原样保留。",
        modelPara: "The bar chart compares the percentages of residents in five Australian cities who bought fresh coffee, bought instant coffee, or visited a café for coffee or tea in the last four weeks.",
        expressions: [
          { en: "compares the percentages of residents in five Australian cities", zh: "比较五个城市居民的百分比（shows的标准替换）" },
          { en: "bought fresh coffee, bought instant coffee, or visited a café", zh: "三种习惯改写成三个并列动词短语" },
          { en: "in the last four weeks", zh: "时间状语原样保留（改写不丢信息）" }
        ],
        guideQ: "你的开头有没有把「对象+三种习惯+时间」一个不落地改写完？漏一个，TA的改写分就扣一半。"
      },
      "3": {
        why: "概括段两句、零细数字：句1给最显著特征（去咖啡馆在多数城市最流行），句2给第二总体差异（速溶普遍高于现磨）——按体系2.1，只挑「最值+总体差异」，这是TA的生死线。",
        modelPara: "It is clear that going to a café was the most common habit in the majority of the cities shown. It is also noticeable that buying instant coffee was generally more popular than buying fresh coffee.",
        expressions: [
          { en: "the most common habit in the majority of the cities", zh: "多数城市中最普遍的习惯（总体特征一）" },
          { en: "generally more popular than", zh: "普遍高于（总体差异，不带数字）" }
        ],
        guideQ: "你的概括句里有没有出现具体百分比？出现了就错了——概括是「一眼看出」，不是数据。"
      },
      "4": {
        why: "分组法第一组=去咖啡馆：最高的三个城市并排写（一个63%级带三个城市名），Brisbane用slightly lower衔接，Adelaide用by contrast点成唯一例外——每个数字都有对比对象（体系2.3数字纪律）。",
        modelPara: "Going to a café was the most popular habit in four of the five cities: the proportion stood at roughly 63% in Sydney, Melbourne and Hobart, and slightly lower, at 55%, in Brisbane. In Adelaide, by contrast, the figure dipped to 49%, the only city where fewer than half of residents had done so.",
        expressions: [
          { en: "the proportion stood at roughly 63%", zh: "比例约为63%（at补数值）" },
          { en: "slightly lower, at 55%, in Brisbane", zh: "略低，为55%（对比嵌入）" },
          { en: "the only city where fewer than half of residents had done so", zh: "唯一不到半数居民这么做的城市（例外点睛）" }
        ],
        guideQ: "你写柱图时，是不是把「最高组并排一句+例外单独一句」？一句一个数字地罗列是6分写法。"
      },
      "5": {
        why: "分组法第二组=店内购买：先给一句总体结论（速溶在每个城市都卖过现磨），再给两组代表数字（54-55% vs 46-48%），收尾抓全场最低值（Adelaide 31%）并用although带出Sydney略高——总数6-8个数字，最值与例外全覆盖。",
        modelPara: "The pattern for shop-bought coffee was different: in every city, instant coffee outsold the fresh variety. Around 54-55% of people in Brisbane and Hobart bought instant coffee, compared with roughly 46-48% in Melbourne and Sydney. Fresh coffee was the least common habit overall, purchased by just 31% of residents in Adelaide and 38% in Hobart, although the figure for Sydney was a little higher, at 44%.",
        expressions: [
          { en: "instant coffee outsold the fresh variety", zh: "速溶咖啡卖得比现磨好（总体结论句）" },
          { en: "compared with roughly", zh: "相比之下约为（对比句式）" },
          { en: "the least common habit overall", zh: "整体上最不普遍的习惯（最值）" }
        ],
        guideQ: "你的细节段二有没有先给一句总体结论再上数字？直接砸数字就是流水账。"
      }
    }
  },
  "剑15 Test 1 T2": {
    source: "ZCode 知识库生成 · 2026-09-17",
    essay: "In many countries, buying a home is seen as one of the most important goals in adult life, and far more people dream of owning property than of renting it. There are clear reasons why this is the case, and in my view the situation it creates is a positive one overall.\n\nThe main reason is that a house is much more than a place to live; it represents security. Tenants can be asked to leave, or face rising rents, through no fault of their own, whereas owners control their own homes and are protected from this uncertainty. A second reason is financial. Although a mortgage is a heavy burden, each payment gradually builds up something valuable instead of disappearing into a landlord's pocket, and property often rises in value over time. Finally, in many cultures there is a deep-rooted belief that owning a home is a sign of success, and that only those who have bought property have truly settled down.\n\nOn balance, I believe this desire to own property is a positive situation, despite the risks involved. The security that comes from ownership gives families a stable base, and homeowners tend to put down roots in a community, which strengthens neighbourhoods as a whole. Buying a home also encourages people to save, because each mortgage payment is an investment rather than an expense. Admittedly, taking out a large loan carries obvious dangers: owners who lose their income may struggle to service their debts, and it is harder to move to another city to find work. Even so, these risks can be reduced if people borrow only what they can afford, and the benefits clearly outweigh them.\n\nIn conclusion, people want to own their homes because property provides security, control and a form of saving, and I believe the stability this creates for families and communities makes it a positive situation.",
    paraTeach: {
      "2": {
        why: "开头两句 = 任务模板：句1 改写题目（owning a home rather than renting → buying a home... than of renting it；is very important → one of the most important goals in adult life），句2 一句话回答题目两问——'clear reasons why' 对应 Why 段，'a positive one overall' 对应评价段。改写手法：上义词替换、短语替换、语序重组。",
        modelPara: "In many countries, buying a home is seen as one of the most important goals in adult life, and far more people dream of owning property than of renting it. There are clear reasons why this is the case, and in my view the situation it creates is a positive one overall.",
        expressions: [
          { en: "is seen as one of the most important goals in adult life", zh: "被视为成年生活中最重要的目标之一" },
          { en: "dream of owning property", zh: "梦想拥有房产" },
          { en: "There are clear reasons why this is the case", zh: "这种现象的原因很清楚（引出解释段）" },
          { en: "a positive one overall", zh: "总体上是积极的（一句话亮明评价立场）" }
        ],
        guideQ: "题目有两个问句——你的开头第二句是否把两个问题都概括回答了？"
      },
      "3": {
        why: "原因段用一条主线（安全感）串起三个原因，层层递进：控制权（不被赶、不涨租）→ 经济（月供变资产，租房是替房东打工）→ 文化（根深蒂固的成功标志）。衔接用 The main reason / A second reason / Finally，朴素但清晰。注意 deep-rooted belief、truly settled down 这类文化角度词伙。",
        modelPara: "The main reason is that a house is much more than a place to live; it represents security. Tenants can be asked to leave, or face rising rents, through no fault of their own, whereas owners control their own homes and are protected from this uncertainty. A second reason is financial. Although a mortgage is a heavy burden, each payment gradually builds up something valuable instead of disappearing into a landlord's pocket, and property often rises in value over time. Finally, in many cultures there is a deep-rooted belief that owning a home is a sign of success, and that only those who have bought property have truly settled down.",
        expressions: [
          { en: "represents security", zh: "代表安全感" },
          { en: "through no fault of their own", zh: "并非他们自身的过错" },
          { en: "a heavy burden", zh: "沉重的负担" },
          { en: "disappearing into a landlord's pocket", zh: "钱白白流进房东口袋（租房=替房东打工）" },
          { en: "a deep-rooted belief", zh: "一种根深蒂固的观念" },
          { en: "truly settled down", zh: "真正安定下来" }
        ],
        guideQ: "三个原因分别来自什么角度？（提示：法律/经济/文化——任何'为什么人们想要X'的题都可以这样扫一遍）"
      },
      "4": {
        why: "评价段 = 立场 + 让步。先亮明 On balance... a positive situation，再给两个正面论证：心理层面（安全感→稳定→社区扎根，which 从句把个人好处推到社会层面）+ 经济层面（月供是投资不是开销）。随后 Admittedly 让步承认风险（还不起贷、锁死流动性），Even so 反驳：风险可控、利大于弊。这就是官方 7+ 描述里的 a clear and developed position。",
        modelPara: "On balance, I believe this desire to own property is a positive situation, despite the risks involved. The security that comes from ownership gives families a stable base, and homeowners tend to put down roots in a community, which strengthens neighbourhoods as a whole. Buying a home also encourages people to save, because each mortgage payment is an investment rather than an expense. Admittedly, taking out a large loan carries obvious dangers: owners who lose their income may struggle to service their debts, and it is harder to move to another city to find work. Even so, these risks can be reduced if people borrow only what they can afford, and the benefits clearly outweigh them.",
        expressions: [
          { en: "gives families a stable base", zh: "给家庭一个稳定的基础" },
          { en: "put down roots in a community", zh: "在社区扎根" },
          { en: "an investment rather than an expense", zh: "是投资而非开销" },
          { en: "service their debts", zh: "偿还债务（band 8 级搭配）" },
          { en: "the benefits clearly outweigh them", zh: "利明显大于弊" }
        ],
        guideQ: "让步（Admittedly）之后，作者是用什么词把立场拉回来的？（Even so——先承认再反驳的经典结构）"
      },
      "5": {
        why: "结尾一句话完成两件事：换词概括原因（security, control and a form of saving 分别对应三个原因）+ 重申评价（a positive situation）。绝不出现新观点。'the stability this creates for families and communities' 把收束推到社会层面，格局比复读题目高一层。",
        modelPara: "In conclusion, people want to own their homes because property provides security, control and a form of saving, and I believe the stability this creates for families and communities makes it a positive situation.",
        expressions: [
          { en: "provides security, control and a form of saving", zh: "三个原因的一句话概括（排比收束）" },
          { en: "the stability this creates for families and communities", zh: "给家庭和社区带来的稳定" },
          { en: "makes it a positive situation", zh: "重申正面评价（呼应开头）" }
        ],
        guideQ: "你的结论有没有出现范文里没有的新观点？（不应该有——结论只收束，不扩展）"
      }
    }
  },
  "剑15 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "线图，三条线（百万人）：Total（圆点实线）1.0→1.25→1.5→2.0→2.5→2.7→2.7→3.5（2010-2017）；住岛客（三角虚线）0.75→0.75→1.25→1.5 后持平，2016 小跌至 1.25，2017 回 1.5；游轮客（方块点线）0.25→0.5→0.25→0.5→1.0→1.25→1.5→2.0。2016 年游轮与住岛持平（均 1.5），2017 反超。",
    essay: "The line graph shows how many tourists visited a particular Caribbean island between 2010 and 2017, measured in millions.\n\nIt is clear that the total number of visitors rose strongly over the period. It is also noticeable that cruise passengers, the smallest group for most of the period, caught up with those staying on the island and finally overtook them in 2017.\n\nVisitors staying on the island began at 0.75 million, held that figure in 2011, and then doubled to 1.5 million by 2013. Apart from a slight dip to 1.25 million in 2016, the figure then remained at that level until the end of the period. Cruise ship passengers started far lower, at just 0.25 million, and after a brief dip in 2012 climbed continuously, drawing level with island stayers at 1.5 million in 2016 before reaching 2 million in 2017.\n\nAs a result of these trends, the total rose from one million in 2010 to 1.5 million in 2012 and 2 million in 2013. It then climbed to 2.7 million in 2015 and 2016, and ended the period at 3.5 million, the highest figure shown.",
    paraTeach: {
      "2": {
        why: "开头改写三处：shows the number of tourists visiting→illustrates how many tourists visited（名词组改从句）；加 measured in millions 交代单位；时间段保留。时态全过去式（体系2.1：时态由年份定）。",
        modelPara: "The line graph shows how many tourists visited a particular Caribbean island between 2010 and 2017, measured in millions.",
        expressions: [
          { en: "shows how many tourists visited", zh: "展示游客数量（名词改从句的改写手法）" },
          { en: "measured in millions", zh: "以百万为单位（分词补语交代单位）" }
        ],
        guideQ: "你的开头交代单位了吗？漏单位，后面的数字全部没有参照。"
      },
      "3": {
        why: "概括两句零数字：句1给总量趋势（strongly rose），句2给全图头条的交叉故事——游轮客从最小一路追平并于 2017 反超住岛客。caught up with... and finally overtook 一句话讲完追平+反超两步。",
        modelPara: "It is clear that the total number of visitors rose strongly over the period. It is also noticeable that cruise passengers, the smallest group for most of the period, caught up with those staying on the island and finally overtook them in 2017.",
        expressions: [
          { en: "the smallest group for most of the period", zh: "多数时间里的最小群体（先抑）" },
          { en: "caught up with those staying on the island and finally overtook them in 2017", zh: "追平住岛客并于2017年最终反超（两步交叉故事）" }
        ],
        guideQ: "两线交叉的故事，你的概括是一步讲完（追平+反超）还是只写了「上升」？"
      },
      "4": {
        why: "分组法：两条「成分线」一组——住岛客（翻倍后走平、2016 小跌）与游轮客（0.25 起步、2012 小跌后连续攀升、2016 追平、2017 反超）写在同一段才能完成交叉（体系2.2交叉点必写）。doubled/drew level with 每个数字带形状或对比。",
        modelPara: "Visitors staying on the island began at 0.75 million, held that figure in 2011, and then doubled to 1.5 million by 2013. Apart from a slight dip to 1.25 million in 2016, the figure then remained at that level until the end of the period. Cruise ship passengers started far lower, at just 0.25 million, and after a brief dip in 2012 climbed continuously, drawing level with island stayers at 1.5 million in 2016 before reaching 2 million in 2017.",
        expressions: [
          { en: "began at 0.75 million, held that figure in 2011", zh: "0.75起步、2011持平（held that figure）" },
          { en: "Apart from a slight dip to 1.25 million in 2016", zh: "除2016年小跌至125万外（例外插入）" },
          { en: "drawing level with island stayers at 1.5 million in 2016", zh: "2016年追平住岛客的150万（追平表达）" }
        ],
        guideQ: "追平（drew level）和反超（overtook）是两件事，你分开写清楚了吗？"
      },
      "5": {
        why: "总和线单独一段，用 As a result of these trends 承接上一段——衔接靠逻辑而非Firstly（体系1.5）。总量线节点密（1→1.5→2→2.5→2.7→3.5），只取代表性节点：2012/2013、2015-2016 平台、2017 终点最值。",
        modelPara: "As a result of these trends, the total rose from one million in 2010 to 1.5 million in 2012 and 2 million in 2013. It then climbed to 2.7 million in 2015 and 2016, and ended the period at 3.5 million, the highest figure shown.",
        expressions: [
          { en: "As a result of these trends", zh: "受这些趋势影响（段落逻辑衔接）" },
          { en: "climbed to 2.7 million in 2015 and 2016", zh: "2015-2016升至270万（两年并列）" },
          { en: "the highest figure shown", zh: "图中最值（同位语收尾点睛）" }
        ],
        guideQ: "数据点密的线，你挑了哪几个代表节点？全报就是听写。"
      }
    }
  },
  "剑15 Test 2 T2": {
    source: "ZCode 知识库生成 · 2026-09-17 · 食谱组装+人工审稿（待爱听写验证）",
    essay: "Some people predict that printed newspapers and books are likely to disappear, since readers will soon be able to read whatever they want through free online content. I completely disagree with this view for two main reasons.\n\nThe main reason for my position is that printed books and papers offer a reading experience that screens simply cannot replicate. A physical page invites deep, focused reading, free from the notifications and pop-ups that fragment attention on a screen. Paper is also considerably easier on the eyes, which matters to anyone who reads for more than a few minutes at a time. Such deep-rooted reading habits explain why so many people still buy physical books for pleasure and why new bestsellers routinely sell millions of copies. As long as this demand exists, printed media will retain a loyal audience, however advanced screens become.\n\nA second problem with the prediction is that much online content is free precisely because it is cheap to produce. Websites that rely on advertising revenue are rewarded for attracting clicks rather than for accuracy, so clickbait headlines and barely checked stories dominate. Serious newspapers, by contrast, employ trained journalists and editors who verify every claim before publication, and readers willingly pay for a reliable source of information. These professionals cannot work for nothing; publishers must invest time and money in investigating stories, and that money has to come from somewhere. If nobody paid for news or books, this investment would dry up, and the quality of public information would fall with it.\n\nIn conclusion, I firmly believe that the future of the printed word is secure because people will always value writing they have paid for.",
    paraTeach: {
      "2": {
        why: "观点题完全不同意 → 两个理由各自成段。开头句1 改写（predict/likely to disappear 保留题意），句2 直接给立场 + 预告两个理由（for two main reasons）——考官读完开头就知道全文结构。",
        modelPara: "Some people predict that printed newspapers and books are likely to disappear, since readers will soon be able to read whatever they want through free online content. I completely disagree with this view for two main reasons.",
        expressions: [
          { en: "I completely disagree with this view for two main reasons", zh: "立场+结构预告一句完成" },
          { en: "are likely to disappear", zh: "大概率消失（比 will disappear 更严谨）" },
          { en: "read whatever they want through free online content", zh: "免费在线内容里想读什么就读什么（题目说法的改写）" }
        ],
        guideQ: "你的立场句有没有预告全文结构？（两段两个理由，考官读完开头就知道你每段写什么）"
      },
      "3": {
        why: "理由1（体验）：主题句 → 两个维度展开（深度阅读 vs 碎片干扰、护眼）→ 用需求侧证据收束（畅销书销量、忠实读者）。注意 the notifications and pop-ups that fragment attention 是具体化写法——不说'屏幕不好'，说屏幕上的什么造成了什么问题。",
        modelPara: "The main reason for my position is that printed books and papers offer a reading experience that screens simply cannot replicate. A physical page invites deep, focused reading, free from the notifications and pop-ups that fragment attention on a screen. Paper is also considerably easier on the eyes, which matters to anyone who reads for more than a few minutes at a time. Such deep-rooted reading habits explain why so many people still buy physical books for pleasure and why new bestsellers routinely sell millions of copies. As long as this demand exists, printed media will retain a loyal audience, however advanced screens become.",
        expressions: [
          { en: "a reading experience that screens simply cannot replicate", zh: "屏幕无法复制的阅读体验" },
          { en: "invites deep, focused reading", zh: "引人深度专注阅读" },
          { en: "fragment attention on a screen", zh: "在屏幕上切碎注意力" },
          { en: "retain a loyal audience", zh: "保住忠实受众" },
          { en: "however advanced screens become", zh: "无论屏幕变得多先进（让步式收尾）" }
        ],
        guideQ: "你的展开句有没有从'感觉'落到'机制'？（为什么屏幕会碎片化注意力——因为通知和弹窗）"
      },
      "4": {
        why: "理由2（免费=廉价）：把'免费'反转为论证武器——免费恰恰因为廉价生产 → 点击陷阱 vs 专业核实 → 付费支撑调查报道 → 推演尽头（没人付费 → 信息质量崩塌）。'free precisely because it is cheap to produce' 是全段灵魂句；分号连接的推演句是 GRA 高分样板。",
        modelPara: "A second problem with the prediction is that much online content is free precisely because it is cheap to produce. Websites that rely on advertising revenue are rewarded for attracting clicks rather than for accuracy, so clickbait headlines and barely checked stories dominate. Serious newspapers, by contrast, employ trained journalists and editors who verify every claim before publication, and readers willingly pay for a reliable source of information. These professionals cannot work for nothing; publishers must invest time and money in investigating stories, and that money has to come from somewhere. If nobody paid for news or books, this investment would dry up, and the quality of public information would fall with it.",
        expressions: [
          { en: "free precisely because it is cheap to produce", zh: "免费恰恰因为生产成本低" },
          { en: "rewarded for attracting clicks rather than for accuracy", zh: "奖励的是点击而非准确" },
          { en: "barely checked stories dominate", zh: "缺乏核查的报道泛滥" },
          { en: "this investment would dry up", zh: "这种投入将枯竭" }
        ],
        guideQ: "你的反驳有没有推演到'如果成真会怎样'？（If nobody paid... would fall with it——把对方逻辑推到尽头）"
      },
      "5": {
        why: "一句话结尾：firmly believe 回应立场 + the future of the printed word is secure 换词重申 + because people will always value writing they have paid for 把两个理由压成一句。",
        modelPara: "In conclusion, I firmly believe that the future of the printed word is secure because people will always value writing they have paid for.",
        expressions: [
          { en: "the future of the printed word is secure", zh: "纸质文字的未来依然稳固（换词重申）" },
          { en: "the future of the printed word is secure", zh: "印刷文字的未来是稳固的" }
        ],
        guideQ: "你的结论是复述开头，还是把两个理由压进了一句话？后者才是收束。"
      }
    }
  },
  "剑15 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "流程图：速食面8阶段——面粉从silo吊入搅拌机（加油加水成dough）→压成sheets→切成strips→卷成noodle discs→油炸→晾干→装杯（加蔬菜和香料）→封口贴标运往超市。",
    essay: "The diagram illustrates the process by which instant noodles are manufactured and packaged for distribution to supermarkets.\n\nIt is clear that the production of instant noodles involves eight stages, beginning with the storage of flour and ending with cups that are sealed and labelled. It is also noticeable that the noodles are cooked in oil halfway through the process.\n\nAt the first stage of the process, flour is delivered from storage silos to a mixer, where it is combined with oil and water to form dough. The dough is then passed through rollers to create sheets, and these sheets are cut into thin strips before being formed into round noodle discs.\n\nIn the second half of the process, the discs are cooked in boiling oil and left to dry. They are then placed into cups, together with vegetables and spices, and the cups are sealed and labelled, ready to be transported and sold in supermarkets.",
    paraTeach: {
      "2": {
        why: "开头改写：shows→illustrates；how instant noodles are produced→the process by which instant noodles are manufactured（被动从句改名词短语）；put into containers for distribution→packaged for distribution（体系2.4只用compares/illustrates/gives information about）。",
        modelPara: "The diagram illustrates the process by which instant noodles are manufactured and packaged for distribution to supermarkets.",
        expressions: [
          { en: "the process by which instant noodles are manufactured", zh: "速食面的制造流程（show的高级替换句型）" },
          { en: "packaged for distribution to supermarkets", zh: "包装后分销到超市" }
        ],
        guideQ: "流程图的开头你写「How X is made」的改写了吗？直接照抄题干第一个词 show 就丢了改写分。"
      },
      "3": {
        why: "流程图的概括段（体系2.2）：句1给总特征=步数+起终点（eight stages, from flour storage to sealed cups），句2给最显著特征（油炸在流程中段）——没有数字可写，但起终点和中点必须点出来。",
        modelPara: "It is clear that the production of instant noodles involves eight stages, beginning with the storage of flour and ending with cups that are sealed and labelled. It is also noticeable that the noodles are cooked in oil halfway through the process.",
        expressions: [
          { en: "involves eight stages", zh: "包含八个阶段（流程图概括标配）" },
          { en: "beginning with the storage of flour", zh: "以面粉储存开始（起点）" },
          { en: "ending with cups that are sealed and labelled", zh: "以封口贴标的杯面结束（终点）" },
          { en: "halfway through the process", zh: "流程进行到一半（中点视角）" }
        ],
        guideQ: "流程图你的概括句给出「步数+起终点」了吗？这是流程图overview的固定动作。"
      },
      "4": {
        why: "分组法=流程图从中点切两段（体系2.2）。前四步全部被动语态串联：is delivered→is combined→is passed→are cut→being formed；步骤间的衔接用 then/these/before being，不数Firstly Secondlly（体系1.5）。",
        modelPara: "At the first stage of the process, flour is delivered from storage silos to a mixer, where it is combined with oil and water to form dough. The dough is then passed through rollers to create sheets, and these sheets are cut into thin strips before being formed into round noodle discs.",
        expressions: [
          { en: "is combined with oil and water to form dough", zh: "与油和水混合成面团（被动+结果）" },
          { en: "is then passed through rollers", zh: "随后被送入滚轮（被动+顺序）" },
          { en: "before being formed into round noodle discs", zh: "之后被卷成面饼（before being句型）" }
        ],
        guideQ: "你的人造流程全部用被动语态了吗？出现 they add/mix 主动语态就是语法失分点。"
      },
      "5": {
        why: "后半段五到八步：cooked→dry→placed into cups→sealed and labelled，继续被动串联并用 together with 带出辅料；结尾 ready to be... 收在终点，与概括段呼应（首尾闭合，体系2.2起终点必写）。",
        modelPara: "In the second half of the process, the discs are cooked in boiling oil and left to dry. They are then placed into cups, together with vegetables and spices, and the cups are sealed and labelled, ready to be transported and sold in supermarkets.",
        expressions: [
          { en: "are cooked in boiling oil and left to dry", zh: "油炸后晾干（两步合一句的并写）" },
          { en: "together with vegetables and spices", zh: "连同蔬菜和香料（辅料嵌入）" },
          { en: "ready to be transported and sold", zh: "待运输销售（终点收尾）" }
        ],
        guideQ: "你漏步骤了吗？流程图漏一步比语言错误严重得多——写完数一遍步数对不对得上。"
      }
    }
  },
  "剑15 Test 3 T2": {
    source: "ZCode 知识库生成 · 2026-09-17 · 食谱组装+人工审稿（待爱听写验证）",
    essay: "It is often claimed that building more gyms and sports centres is the best way to encourage people to live healthier lives, while others argue that this alone would achieve little. While these facilities certainly help, I believe they are not enough on their own, and other measures are needed just as much.\n\nIt is easy to see why some people support building more facilities. Convenience removes a major barrier to exercise, since those who live near a gym or pool can fit it into their daily routine. As a result, they are much more likely to exercise regularly than people who must travel across town. In my city, for example, the opening of a free public swimming pool led to a clear rise in attendance among older residents. This suggests that access really does matter, at least for those who already want to be more active.\n\nHowever, sport is only one part of public health, and facilities do nothing about the main causes of poor health. Smoking, alcohol and poor diet cause far more illness than a lack of exercise, and these problems will not disappear simply because a new gym opens. Tackling them requires taxes on tobacco and alcohol, better food labelling, and health education that begins in schools. My own view is that a combination of measures works best: facilities for those who are already motivated, and education and regulation for the wider population. Indeed, anti-smoking campaigns and sugar taxes have improved public health far more than any single gym could. These policies reach everyone, whereas a sports centre serves only a small and often privileged minority.\n\nIn conclusion, sports facilities are certainly helpful, but lasting improvements to public health require a much broader strategy.",
    paraTeach: {
      "2": {
        why: "讨论题开头必须预告双方：句1 引出观点A（建场馆是最好办法），句2 转折引出观点B（仅有场馆收效甚微）+ 句3 亮明立场（组合措施）。三句完成改写+双观点预告+立场。",
        modelPara: "It is often claimed that building more gyms and sports centres is the best way to encourage people to live healthier lives, while others argue that this alone would achieve little. While these facilities certainly help, I believe they are not enough on their own, and other measures are needed just as much.",
        expressions: [
          { en: "It is often claimed that...", zh: "常有人声称……（引出观点A）" },
          { en: "while others argue that this alone would achieve little", zh: "而另一些人认为仅此而已收效甚微" },
          { en: "other measures are needed just as much", zh: "其他措施同样必要" }
        ],
        guideQ: "你的开头有没有把双方观点各预告一句？只写一边，讨论题的 TR 就缺一半。"
      },
      "3": {
        why: "观点A段（设施的作用）：让步式认可 → 解释便利性如何降低运动门槛 → 真实感例子（免费泳池、老年居民出勤率）→ This suggests 收束并留有余地（'对本来就想动的人'），客观不绝对——讨论题的观点段要像转述而非辩护。",
        modelPara: "It is easy to see why some people support building more facilities. Convenience removes a major barrier to exercise, since those who live near a gym or pool can fit it into their daily routine. As a result, they are much more likely to exercise regularly than people who must travel across town. In my city, for example, the opening of a free public swimming pool led to a clear rise in attendance among older residents. This suggests that access really does matter, at least for those who already want to be more active.",
        expressions: [
          { en: "Convenience removes a major barrier to exercise", zh: "便利消除了运动的一大障碍" },
          { en: "fit it into their daily routine", zh: "把它纳入日常安排" },
          { en: "a clear rise in attendance among older residents", zh: "老年居民出勤率明显上升" },
          { en: "at least for those who already want to be more active", zh: "至少对本来就想多动的人" }
        ],
        guideQ: "你的例子有没有具体到'哪座城市/什么设施/哪类人'？泛泛的 for example 等于没有例子。"
      },
      "4": {
        why: "观点B段（我方立场，写得更重=暗示倾向）：指出设施管不了主因（烟酒饮食）→ 给出具体措施（烟酒税、食品标签、学校健康教育）→ 亮出组合观点（冒号列举）→ Indeed 收束并升维（政策覆盖所有人 vs 场馆只服务少数特权群体）。'reach everyone / privileged minority' 的对比是本段杀手锏。",
        modelPara: "However, sport is only one part of public health, and facilities do nothing about the main causes of poor health. Smoking, alcohol and poor diet cause far more illness than a lack of exercise, and these problems will not disappear simply because a new gym opens. Tackling them requires taxes on tobacco and alcohol, better food labelling, and health education that begins in schools. My own view is that a combination of measures works best: facilities for those who are already motivated, and education and regulation for the wider population. Indeed, anti-smoking campaigns and sugar taxes have improved public health far more than any single gym could. These policies reach everyone, whereas a sports centre serves only a small and often privileged minority.",
        expressions: [
          { en: "do nothing about the main causes of poor health", zh: "对健康主因毫无作用" },
          { en: "Tackling them requires taxes on tobacco and alcohol", zh: "解决它们需要烟酒税" },
          { en: "better food labelling", zh: "更完善的食品标签" },
          { en: "a combination of measures works best", zh: "组合措施效果最好" },
          { en: "serves only a small and often privileged minority", zh: "只服务少数（往往是特权）群体" }
        ],
        guideQ: "你的措施有没有落实到'谁做什么'？（收税/标签/教育——具体主体+具体手段才算措施）"
      },
      "5": {
        why: "一句话结尾：让步（certainly helpful）+ 重申主论点（lasting improvements require a much broader strategy）——换词重申了'组合措施'的立场，不引入新观点。",
        modelPara: "In conclusion, sports facilities are certainly helpful, but lasting improvements to public health require a much broader strategy.",
        expressions: [
          { en: "lasting improvements to public health require a much broader strategy", zh: "公共健康的持久改善需要更全面的策略" },
          { en: "sports facilities are certainly helpful", zh: "体育设施确实有用" }
        ],
        guideQ: "你的结论有没有出现前面没提过的新观点？（不应该有）"
      }
    }
  },
  "剑15 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "饼图：毕业去向——全职工作52%、兼职15%、待业12%、全职深造8%、兼职+深造5%、未知8%。表：工作5年后年薪——10万+：政府50%、自由职业40%、私营30%；7.5-10万：自由职业40%、政府30%、私营25%；低于5万：各类型仅5-10%。",
    essay: "The pie chart shows what anthropology graduates from one university did after completing their degree, while the table gives information about the salaries of those who were in work five years later.\n\nIt is clear that full-time employment was the most common destination by a wide margin. It is also noticeable that a considerable proportion of those in work were earning high salaries five years after graduating.\n\nJust over half of the graduates, at 52%, went into full-time employment, while a further 15% worked part-time. The remaining categories were much smaller: 12% were unemployed, 8% chose full-time postgraduate study, 5% combined part-time work with study, and the destinations of the final 8% were unknown.\n\nThe table shows that government employees had the highest salaries: half of them earned over $100,000, compared with 40% of freelancers and 30% of those in the private sector. In the $75,000-$99,999 band, however, freelancers were ahead, at 40%, while very few graduates in any sector earned under $50,000.",
    paraTeach: {
      "2": {
        why: "双图开头分工：一句一图（pie chart...while the table...），各自完成改写（shows what...did / gives information about salaries，体系2.4替换词），while 把两张图锁进一句话。",
        modelPara: "The pie chart shows what anthropology graduates from one university did after completing their degree, while the table gives information about the salaries of those who were in work five years later.",
        expressions: [
          { en: "shows what anthropology graduates from one university did after completing their degree", zh: "展示毕业生去向（名词改从句改写）" },
          { en: "while the table gives information about", zh: "而表格给出…（双图连接词，gives information about标准替换）" }
        ],
        guideQ: "双图题你的开头是一句一图吗？只改写了一张图，另一半就照抄题干了。"
      },
      "3": {
        why: "概括一句一图：饼图给最值（全职工作 by a wide margin 远超其他），表格给总体特征（高薪比例可观）——都不带细数字（体系2.1概括段纪律）。",
        modelPara: "It is clear that full-time employment was the most common destination by a wide margin. It is also noticeable that a considerable proportion of those in work were earning high salaries five years after graduating.",
        expressions: [
          { en: "the most common destination by a wide margin", zh: "以巨大差距成为最常见去向" },
          { en: "a considerable proportion of those in work", zh: "在职者中相当大比例（概括性表述）" }
        ],
        guideQ: "双图题你的概括是「一句一图」吗？两个特征都来自同一张图，另一张的overview就缺了。"
      },
      "4": {
        why: "细节一=饼图：先写最大项（52%用同位语 at 52% 嵌入），再用 much smaller 一笔压住四个小项、按大小顺序列完——大项展开、小项归堆，避免逐块流水账（体系2.2）。",
        modelPara: "Just over half of the graduates, at 52%, went into full-time employment, while a further 15% worked part-time. The remaining categories were much smaller: 12% were unemployed, 8% chose full-time postgraduate study, 5% combined part-time work with study, and the destinations of the final 8% were unknown.",
        expressions: [
          { en: "Just over half of the graduates, at 52%", zh: "略过半数，为52%（同位语补数值）" },
          { en: "a further 15%", zh: "另有15%（累加衔接）" },
          { en: "The remaining categories were much smaller", zh: "其余类别小得多（小项归堆句）" }
        ],
        guideQ: "你写饼图小项时是「一句归堆列完」还是一块一块报数？前者才高分。"
      },
      "5": {
        why: "细节二=表格：只挑两行最值写透（体系2.2表格只取最大最小）——最高档用 colon 引出三个数并带 compared with 对比，however 转到自由职业领先的档位，收尾用 very few under $50,000 抓全场低端最值。",
        modelPara: "The table shows that government employees had the highest salaries: half of them earned over $100,000, compared with 40% of freelancers and 30% of those in the private sector. In the $75,000-$99,999 band, however, freelancers were ahead, at 40%, while very few graduates in any sector earned under $50,000.",
        expressions: [
          { en: "had the highest salaries", zh: "薪资最高（表格最值句）" },
          { en: "half of them earned over $100,000, compared with", zh: "半数年薪超10万，对比…（对比句式）" },
          { en: "very few graduates in any sector earned under $50,000", zh: "各行业低于5万者极少（低端最值）" }
        ],
        guideQ: "表格题你挑「每行最大最小」了吗？中间档照抄全表，就是把表格题做成了数字听写。"
      }
    }
  },
  "剑15 Test 4 T2": {
    source: "ZCode 知识库生成 · 2026-09-17 · 食谱组装+人工审稿（待爱听写验证）",
    essay: "In many cultures, children are brought up with the message that hard work guarantees success and that effort alone determines what they can achieve. This message has both clear benefits and some drawbacks for children as they grow up and begin to make their own choices.\n\nThe main advantage of this message is that it builds determination and a sense of self-belief. Children who believe effort matters tend to keep trying after failure, whether at school or in sport, instead of giving up at the first hurdle. A child who struggles with mathematics, for example, may eventually pass exams that once seemed impossible simply by continuing to practise patiently. This confidence also protects children from abandoning ambitious careers simply because of the background they were born into. In this sense, the belief that effort pays off gives them the courage to aim higher than their circumstances might otherwise allow.\n\nHowever, the same message can be harmful when success is genuinely impossible. A child who is told that effort guarantees everything may blame themselves for failures caused by circumstances, such as a lack of natural talent, money or opportunity. Not every child can become a professional footballer, however hard they train, and the disappointment can be severe. This belief may also encourage unrealistic ambitions and wasted years spent chasing goals that were never within reach. Such setbacks can damage a young person's confidence far more than an early dose of realism would have done.\n\nIn conclusion, this message inspires effort and ambition in the young, but it should be balanced with honest guidance about real limits.",
    paraTeach: {
      "2": {
        why: "纯利弊题开头不表态：句1 改写消息本身（hard work guarantees success），句2 点明'有利有弊'并各占后文两段。全文不出现 I believe 哪边赢。",
        modelPara: "In many cultures, children are brought up with the message that hard work guarantees success and that effort alone determines what they can achieve. This message has both clear benefits and some drawbacks for children as they grow up and begin to make their own choices.",
        expressions: [
          { en: "are brought up with the message that...", zh: "从小被灌输这样的信息" },
          { en: "hard work guarantees success", zh: "努力保证成功（题干核心改写）" },
          { en: "both clear benefits and some drawbacks", zh: "利弊并存（纯利弊题的标准开头句）" }
        ],
        guideQ: "你有没有把利和弊都预告了？纯利弊题开头只说'有利有弊'，不站队。"
      },
      "3": {
        why: "好处段：主线=心理机制（信念→坚持→结果）。例子具体到学科（mathematics、exams），并从个人推到背景（protects children from abandoning ambitious careers），In this sense 把好处再推一层。",
        modelPara: "The main advantage of this message is that it builds determination and a sense of self-belief. Children who believe effort matters tend to keep trying after failure, whether at school or in sport, instead of giving up at the first hurdle. A child who struggles with mathematics, for example, may eventually pass exams that once seemed impossible simply by continuing to practise patiently. This confidence also protects children from abandoning ambitious careers simply because of the background they were born into. In this sense, the belief that effort pays off gives them the courage to aim higher than their circumstances might otherwise allow.",
        expressions: [
          { en: "builds determination and a sense of self-belief", zh: "培养决心与自信" },
          { en: "giving up at the first hurdle", zh: "遇到第一个坎就放弃" },
          { en: "continuing to practise patiently", zh: "坚持耐心练习" },
          { en: "aim higher than their circumstances might otherwise allow", zh: "超越出身的限制去争取更高目标" }
        ],
        guideQ: "你的好处有没有落到具体场景（学校/体育/考试）？抽象的'变得更好'不算展开。"
      },
      "4": {
        why: "坏处段：角度从心理伤害切入（把失败全归咎自己）→ 例子具体（职业球员梦）→ 追加代价（unrealistic ambitions、wasted years）→ 末句让步式收束（an early dose of realism 更好）。'genuinely impossible' 是关键限定词——坏处只在'努力确实没用'时成立，逻辑严谨。",
        modelPara: "However, the same message can be harmful when success is genuinely impossible. A child who is told that effort guarantees everything may blame themselves for failures caused by circumstances, such as a lack of natural talent, money or opportunity. Not every child can become a professional footballer, however hard they train, and the disappointment can be severe. This belief may also encourage unrealistic ambitions and wasted years spent chasing goals that were never within reach. Such setbacks can damage a young person's confidence far more than an early dose of realism would have done.",
        expressions: [
          { en: "blame themselves for failures caused by circumstances", zh: "把环境导致的失败归咎自己" },
          { en: "a lack of natural talent, money or opportunity", zh: "天赋/金钱/机会的缺失" },
          { en: "unrealistic ambitions and wasted years", zh: "不切实际的野心与蹉跎的岁月" },
          { en: "an early dose of realism", zh: "及早一点现实感" }
        ],
        guideQ: "你的坏处有没有区分'努力有用但没努力'和'努力也没用'两种情况？（后者才是这个消息的真正坏处）"
      },
      "5": {
        why: "一句话结尾：inspires effort and ambition + should be balanced with honest guidance——把两段各压成半句，不加新观点、不站队。",
        modelPara: "In conclusion, this message inspires effort and ambition in the young, but it should be balanced with honest guidance about real limits.",
        expressions: [
          { en: "should be balanced with honest guidance about real limits", zh: "应当与关于真实限度的诚实引导相平衡" },
          { en: "it should be balanced with honest guidance about real limits", zh: "应当用关于真实限度的诚实引导来平衡" }
        ],
        guideQ: "你的结论有没有出现前面没提过的新观点？（不应该有）"
      }
    }
  },
  "剑16 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "线图：家电拥有率%（1920/1940/1960/1980/2000/2019）——洗衣机40→60→65→70→65→70→75（有起伏）；冰箱0→50（1940）→90（1960）→100（1980后）；吸尘器30→50→70→90→100（2000后）。家务时长：50→35（1940）→20（1960）→15（1980）→15（2000）→约11（2019）。",
    essay: "The line graph tracks the percentage of households owning three electrical appliances, together with the number of hours spent on housework each week, in one country between 1920 and 2019.\n\nIt is clear that appliance ownership rose to near-universal levels over the period. It is also noticeable that this happened alongside a dramatic fall in the time families spent on housework.\n\nThe refrigerator saw the sharpest rise: from no ownership at all in 1920, it reached half of all households by 1940, 90% by 1960 and virtually every home by 1980. Vacuum cleaners followed a steadier path from 30% in 1920 to saturation after 2000, while the washing machine, already in 40% of homes in 1920, fluctuated gently and finished at 75%.\n\nThe time devoted to housework fell in step with these changes: from 50 hours per week in 1920 to 35 in 1940 and just 20 by 1960, before levelling off and ending at around 11 hours in 2019. In short, as machines took over the laundry and the cleaning, the weekly workload fell to less than a quarter of its former level.",
    paraTeach: {
      "2": {
        why: "开头改写：shows the changes in ownership→tracks the percentage of households owning（名词改从句）；and连接的「家务时长」补成 the number of hours spent on housework each week——双信息一个不漏；时间段1920-2019保留。",
        modelPara: "The line graph tracks the percentage of households owning three electrical appliances, together with the number of hours spent on housework each week, in one country between 1920 and 2019.",
        expressions: [
          { en: "tracks the percentage of households owning three electrical appliances", zh: "追踪三种家电的家庭拥有率（shows替换+从句改写）" },
          { en: "together with the number of hours spent on housework each week", zh: "连同每周家务小时数（第二信息嵌入）" }
        ],
        guideQ: "多信息图的题干改写，你把「每一条线/每一块信息」都装进开头了吗？"
      },
      "3": {
        why: "概括两句零数字：句1=家电拥有率升至接近普及（near-universal 比 rose dramatically 更准确：洗衣机只到75%），句2=家务时长骤降同步发生——把「一升一降伴随」的对比关系写进概括。",
        modelPara: "It is clear that appliance ownership rose to near-universal levels over the period. It is also noticeable that this happened alongside a dramatic fall in the time families spent on housework.",
        expressions: [
          { en: "rose to near-universal levels", zh: "升至接近普及的水平（比100%更严谨的说法）" },
          { en: "alongside a dramatic fall in", zh: "伴随…的骤降（两线关系的概括写法）" }
        ],
        guideQ: "洗衣机只到75%，你敢写「接近普及」吗？——概括用「总体」措辞，不夸大单条线。"
      },
      "4": {
        why: "细节一=三台家电：最陡的冰箱详写（0→50%→90%→100%，三段式爬升到顶）、吸尘器 steadier path 一句（30→饱和）、洗衣机 fluctuated gently + 终值对比——详略分明，每个数字有参照（体系2.3）。",
        modelPara: "The refrigerator saw the sharpest rise: from no ownership at all in 1920, it reached half of all households by 1940, 90% by 1960 and virtually every home by 1980. Vacuum cleaners followed a steadier path from 30% in 1920 to saturation after 2000, while the washing machine, already in 40% of homes in 1920, fluctuated gently and finished at 75%.",
        expressions: [
          { en: "from no ownership at all in 1920", zh: "从1920年的零拥有起步（起点极值）" },
          { en: "reached half of all households by 1940, 90% by 1960", zh: "1940年过半、1960年达90%（里程碑串写）" },
          { en: "fluctuated gently and finished at 75%", zh: "小幅波动、收于75%（起伏型写法）" }
        ],
        guideQ: "三条线的详略是「最陡的最详、平稳的次之、末端对比收尾」吗？"
      },
      "5": {
        why: "细节二=家务时长：50→35→20 三节点+levelling off（1980-2000平台）+约11收尾；结尾用 In short 把两图拧成一句因果（机器接管→工时降到原来的不到四分之一），呼应概括段的 alongside。",
        modelPara: "The time devoted to housework fell in step with these changes: from 50 hours per week in 1920 to 35 in 1940 and just 20 by 1960, before levelling off and ending at around 11 hours in 2019. In short, as machines took over the laundry and the cleaning, the weekly workload fell to less than a quarter of its former level.",
        expressions: [
          { en: "fell in step with these changes", zh: "随这些变化同步下降（指代衔接+关系句）" },
          { en: "before levelling off", zh: "之后趋于平稳（平台期动词）" },
          { en: "fell to less than a quarter of its former level", zh: "降到原来的不到四分之一（倍数对比收尾）" }
        ],
        guideQ: "图上有好几条线时，你有没有在最后用一句对比把所有线的关系收拢？"
      }
    }
  },
  "剑16 Test 1 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "In many countries, growing numbers of people are curious about the history of the house or building they live in. There are two main reasons for this interest, and in most cases the answers can be found through local records and the memories of long-term residents.\n\nThe desire to know a home's past is, above all, a search for identity. A house that has stood for a century has witnessed generations of arrivals and departures, and learning about the families who lived there before gives owners a sense of belonging to a story larger than their own. My neighbours, for example, discovered that their Edwardian terrace had once housed a family of railway workers, and they now display old photographs of it in the hallway. Practical concerns reinforce this emotional appeal: the age of a property shapes how it should be maintained, so owners need to know whether the wiring, foundations or drainage date from another era before they renovate.\n\nFortunately, this information is easier to uncover than ever. Local archives and land registries hold deeds, planning applications and census records that trace a building's ownership back decades, and a single afternoon's research can reveal the original date of construction. Older neighbours are another invaluable source, since their memories often fill the gaps that documents leave, recalling the shop that once occupied the corner or the winter the river flooded. Local history groups on the internet, where enthusiasts share photographs and maps, have made this kind of detective work possible for anyone with a computer.\n\nIn conclusion, people investigate the past of their homes to satisfy both an emotional need for roots and practical worries about maintenance, and archival records together with elderly residents' memories are usually enough to tell them what they wish to know.",
    paraTeach: {
      "2": {
        why: "双问题题的审题三问：必须回应 why 和 how 两部分。开头句1改写题目（more and more people are becoming interested→growing numbers of people are curious about），句2用一句话把两问的答案都预告出来（reasons=identity+practical；how=records+memories）——考官读完开头就知道全文结构。",
        modelPara: "In many countries, growing numbers of people are curious about the history of the house or building they live in. There are two main reasons for this interest, and in most cases the answers can be found through local records and the memories of long-term residents.",
        expressions: [
          { en: "growing numbers of people are curious about", zh: "越来越多的人对…好奇（more and more 的改写）" },
          { en: "There are two main reasons for this interest", zh: "这种兴趣有两个主要原因（预告why段）" },
          { en: "local records and the memories of long-term residents", zh: "本地档案与老住户的记忆（预告how段）" }
        ],
        guideQ: "双问题题你的开头第二句把两问都回答了吗？只预告一问，TR就缺一半。"
      },
      "3": {
        why: "why段用一条主线串两个原因：情感（identity，写透——century/generations/belonging）+实际（maintenance，一句带过）。例子按展开标准落到「谁+什么房+发现了什么」：邻居的爱德华排屋与铁路工人家庭——具体到可画面（体系1.4）。",
        modelPara: "The desire to know a home's past is, above all, a search for identity. A house that has stood for a century has witnessed generations of arrivals and departures, and learning about the families who lived there before gives owners a sense of belonging to a story larger than their own. My neighbours, for example, discovered that their Edwardian terrace had once housed a family of railway workers, and they now display old photographs of it in the hallway. Practical concerns reinforce this emotional appeal: the age of a property shapes how it should be maintained, so owners need to know whether the wiring, foundations or drainage date from another era before they renovate.",
        expressions: [
          { en: "a search for identity", zh: "对身份认同的追寻（主题句核心词伙）" },
          { en: "a sense of belonging to a story larger than their own", zh: "融入更大故事带来的归属感" },
          { en: "their Edwardian terrace had once housed a family of railway workers", zh: "例子具体到房型+前住户职业" },
          { en: "Practical concerns reinforce this emotional appeal", zh: "实际考量强化了这种情感吸引（this+名词衔接）" }
        ],
        guideQ: "你的例子能画出画面吗（哪栋房、什么人、发现了什么）？「for example+泛泛现象」等于没有例子。"
      },
      "4": {
        why: "how段按「渠道」组织：档案（deeds/census records）→老邻居（记忆补档案的gap）→网络社群（让人人可做）。衔接靠 these sheets 式指代与关键词复现，无Firstly链（体系1.5）；detective work 的比喻让方法段不干瘪。",
        modelPara: "Fortunately, this information is easier to uncover than ever. Local archives and land registries hold deeds, planning applications and census records that trace a building's ownership back decades, and a single afternoon's research can reveal the original date of construction. Older neighbours are another invaluable source, since their memories often fill the gaps that documents leave, recalling the shop that once occupied the corner or the winter the river flooded. Local history groups on the internet, where enthusiasts share photographs and maps, have made this kind of detective work possible for anyone with a computer.",
        expressions: [
          { en: "Local archives and land registries hold deeds, planning applications and census records", zh: "档案与土地登记处保存地契、规划申请与人口普查记录" },
          { en: "fill the gaps that documents leave", zh: "填补文档留下的空白（记忆vs档案分工）" },
          { en: "this kind of detective work", zh: "这种侦探式的工作（this+名词回指，高分衔接）" }
        ],
        guideQ: "你写的每个「方法」都能落实到具体载体吗（哪类记录、哪类人）？只说 search online 是空的。"
      },
      "5": {
        why: "一句话结尾换词重申两问答案：investigate the past of their homes↔curiosity；emotional need for roots and practical worries↔identity+maintenance；不加任何新观点（体系1.3结尾纪律）。",
        modelPara: "In conclusion, people investigate the past of their homes to satisfy both an emotional need for roots and practical worries about maintenance, and archival records together with elderly residents' memories are usually enough to tell them what they wish to know.",
        expressions: [
          { en: "an emotional need for roots", zh: "对根基的情感需求（identity的换词）" },
          { en: "archival records together with elderly residents' memories", zh: "档案+老人记忆（两渠道换词重申）" }
        ],
        guideQ: "你的结论有没有把两问各用换词收回来？只收一问，结构就缺角。"
      }
    }
  },
  "剑16 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "流程图：甘蔗制糖7阶段——种植生长12-18个月→收割（机器或人工砍伐）→压榨机榨汁→汁液过滤净化→蒸发器加热浓缩→离心分离出糖晶体→干燥冷却成糖。",
    essay: "The diagram illustrates how sugar is produced from sugar cane in seven distinct stages.\n\nIt is clear that the process begins with the growing of the crop and ends with the drying and cooling of the final crystals. It is also noticeable that harvesting can be carried out in two different ways.\n\nThe first stage takes place in the fields, where sugar cane needs 12 to 18 months to mature before it is harvested. This can be done either mechanically, with machines cutting the cane, or manually, by farmers using simple tools. The harvested cane is then fed into a crushing mill, which presses it to extract the raw juice.\n\nPreparing the juice for consumption involves the remaining four stages. It is first filtered to remove impurities, before being heated in an evaporator, which turns it into a thick syrup. Next, the syrup passes into a centrifuge, where the sugar crystals are separated from the rest of the liquid. Finally, the crystals are dried and cooled, at which point the sugar is ready for sale.",
    paraTeach: {
      "2": {
        why: "流程图开头：主动改写为被动（making sugar from sugar cane→how sugar is produced from sugar cane），并把步数直接写进开头一句（in seven distinct stages）——流程图题把步数前置，考官一眼确认你看懂了全图。",
        modelPara: "The diagram illustrates how sugar is produced from sugar cane in seven distinct stages.",
        expressions: [
          { en: "how sugar is produced from sugar cane", zh: "糖如何由甘蔗制成（被动改写）" },
          { en: "in seven distinct stages", zh: "分七个明确阶段（步数前置）" }
        ],
        guideQ: "流程图你的第一句就报出总步数了吗？"
      },
      "3": {
        why: "概括=起终点+分叉点：句1 from growing to drying and cooling 框住全程；句2点出流程里唯一的分支（收割有两种方式）——分支是这张图区别于普通线性流程的最显著特征，必须进overview。",
        modelPara: "It is clear that the process begins with the growing of the crop and ends with the drying and cooling of the final crystals. It is also noticeable that harvesting can be carried out in two different ways.",
        expressions: [
          { en: "begins with the growing of the crop and ends with", zh: "以种植开始、以…结束（起终点句）" },
          { en: "can be carried out in two different ways", zh: "可用两种方式完成（分支特征）" }
        ],
        guideQ: "这张流程图的「分叉」你找了吗？有分支不点，概括就平庸。"
      },
      "4": {
        why: "细节一=前三步（田间+榨汁）：needs 12 to 18 months 数字纪律；either...or... 并写两种收割；crushing mill 用定语从句 which presses it to explain 机制——步骤、方式、机制三层信息一句不浪费。",
        modelPara: "The first stage takes place in the fields, where sugar cane needs 12 to 18 months to mature before it is harvested. This can be done either mechanically, with machines cutting the cane, or manually, by farmers using simple tools. The harvested cane is then fed into a crushing mill, which presses it to extract the raw juice.",
        expressions: [
          { en: "needs 12 to 18 months to mature", zh: "需12-18个月成熟（唯一的数字）" },
          { en: "either mechanically, with machines cutting the cane, or manually", zh: "机械或人工两种方式（分支并写）" },
          { en: "which presses it to extract the raw juice", zh: "压榨机榨出原汁（which从句带机制）" }
        ],
        guideQ: "流程图里的分叉你是并成一句 either...or，还是当成两条流程各写一遍？前者才对。"
      },
      "5": {
        why: "细节二=后四步：先总后分（Preparing the juice involves the remaining four stages 一句交代段内结构），filtered→heated→syrup→centrifuge→dried and cooled 全被动串联，Next/Finally 两个顺序词就够，结尾 at which point the sugar is ready for sale 收在终点。",
        modelPara: "Preparing the juice for consumption involves the remaining four stages. It is first filtered to remove impurities, before being heated in an evaporator, which turns it into a thick syrup. Next, the syrup passes into a centrifuge, where the sugar crystals are separated from the rest of the liquid. Finally, the crystals are dried and cooled, at which point the sugar is ready for sale.",
        expressions: [
          { en: "before being heated in an evaporator", zh: "之后在蒸发器中加热（before being句型）" },
          { en: "the sugar crystals are separated from the rest of the liquid", zh: "糖晶体与其余液体分离（关键步骤）" },
          { en: "at which point the sugar is ready for sale", zh: "此时糖即可出售（终点收尾）" }
        ],
        guideQ: "你的细节段开头有没有「本段管哪几步」的总起句？流程图切两段后，每段都该先报边界。"
      }
    }
  },
  "剑16 Test 2 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "In their advertising, companies today almost always stress that their products are new in some way, even when the change is a modest one. This happens mainly because novelty sells, and in my view the trend is a negative development overall, despite its obvious commercial logic.\n\nThe emphasis on newness exists because consumers have been taught to equate new with improved. A phone with a slightly sharper camera or a car with a redesigned dashboard can command a higher price than last year's model, so manufacturers constantly repaint small changes as breakthroughs. Competition makes this unavoidable: when every rival claims innovation, none of them can afford to say their product is simply reliable and unchanged. Advertising therefore celebrates the new because it is the easiest way to persuade customers that an upgrade is necessary.\n\nAs a development, however, I believe this does more harm than good. It manufactures dissatisfaction with possessions that work perfectly, encouraging people to replace goods years before they need to; the mountains of discarded electronics generated each year are a direct result of this cycle. It also teaches consumers to judge products by their novelty rather than their quality, which rewards marketing skill over genuine engineering. Admittedly, the pressure to appear innovative pushes companies to make real improvements as well, and some upgrades, such as safety features in cars, justify the publicity. Even so, these benefits would survive a more honest style of advertising, whereas the waste created by artificial obsolescence will not.\n\nIn conclusion, businesses promote newness because it is the most effective way to sell, but the habit of discarding useful products it encourages makes this a development we should regret.",
    paraTeach: {
      "2": {
        why: "双问题（why+评价）开头：句1改写（emphasise that their products are new→stress that their products are new in some way），句2同时回答两问——novelty sells（原因）+ negative overall（评价立场）。利弊题必须亮比较级态度，不能骑墙（体系1.2）。",
        modelPara: "In their advertising, companies today almost always stress that their products are new in some way, even when the change is a modest one. This happens mainly because novelty sells, and in my view the trend is a negative development overall, despite its obvious commercial logic.",
        expressions: [
          { en: "even when the change is a modest one", zh: "哪怕变化很微小（让步铺垫，暗含批判立场）" },
          { en: "novelty sells", zh: "新奇感有市场（原因一句话）" },
          { en: "a negative development overall", zh: "总体是消极发展（评价立场亮明）" }
        ],
        guideQ: "「为什么」和「积极还是消极」两问，你的开头是不是各用半句都回答了？"
      },
      "3": {
        why: "why段一条因果链写到头：消费者被教会新=好→小改动能溢价→厂商把小改包装成突破→竞争让谁都说创新→所以广告只夸新。解释为主、不堆例子；sells/equate/repaint 是主题词伙不是大词（体系1.6）。",
        modelPara: "The emphasis on newness exists because consumers have been taught to equate new with improved. A phone with a slightly sharper camera or a car with a redesigned dashboard can command a higher price than last year's model, so manufacturers constantly repaint small changes as breakthroughs. Competition makes this unavoidable: when every rival claims innovation, none of them can afford to say their product is simply reliable and unchanged. Advertising therefore celebrates the new because it is the easiest way to persuade customers that an upgrade is necessary.",
        expressions: [
          { en: "equate new with improved", zh: "把「新」等同于「更好」（因果链起点）" },
          { en: "repaint small changes as breakthroughs", zh: "把小改动粉饰成突破（动词repaint准确生动）" },
          { en: "none of them can afford to say", zh: "没人敢说（竞争逻辑收口）" }
        ],
        guideQ: "你的原因段是一条连续的因果链，还是几个平行原因的清单？高分写前者。"
      },
      "4": {
        why: "评价段立场=弊大于利：先两个弊（制造不满→提前丢弃→电子垃圾；唯新论→营销胜过工程），再让步（Admittedly压力也带来真创新，如汽车安全配置），用 Even so 把让步压回去——让步式收口是讨论利弊的标准武器（体系1.2/1.4）。",
        modelPara: "As a development, however, I believe this does more harm than good. It manufactures dissatisfaction with possessions that work perfectly, encouraging people to replace goods years before they need to; the mountains of discarded electronics generated each year are a direct result of this cycle. It also teaches consumers to judge products by their novelty rather than their quality, which rewards marketing skill over genuine engineering. Admittedly, the pressure to appear innovative pushes companies to make real improvements as well, and some upgrades, such as safety features in cars, justify the publicity. Even so, these benefits would survive a more honest style of advertising, whereas the waste created by artificial obsolescence will not.",
        expressions: [
          { en: "It manufactures dissatisfaction with possessions that work perfectly", zh: "它制造了对完好物品的不满（manufacture一语双关）" },
          { en: "the mountains of discarded electronics", zh: "堆积如山的电子垃圾（具体后果）" },
          { en: "the waste created by artificial obsolescence", zh: "人为淘汰造成的浪费（收口点题）" }
        ],
        guideQ: "利弊题你给「弊」让了一步再用 Even so 压回去吗？只写一边的利弊题，GRA和TR都吃亏。"
      },
      "5": {
        why: "一句话结尾：because+it is the most effective way to sell 收原因，but+habit of discarding 收评价——两问各自换词闭合，零新观点。",
        modelPara: "In conclusion, businesses promote newness because it is the most effective way to sell, but the habit of discarding useful products it encourages makes this a development we should regret.",
        expressions: [
          { en: "the habit of discarding useful products", zh: "丢弃仍可用产品的习惯（弊的换词重申）" },
          { en: "a development we should regret", zh: "令人遗憾的发展（negative development换词）" }
        ],
        guideQ: "你的结论句有没有同时收回「原因」和「评价」？少收一个就是结构不闭合。"
      }
    }
  },
  "剑16 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "地图：Southwest Airport 现在vs翻修后。现在：8个登机口（1-8），步行通道（walkway）连接，check-in+café在出发侧，security/passport control/customs。翻修后：登机口增至18个（1-18），Y形布局，walkway改为sky train；出发侧新增bag drop（B）和shops；到达侧新增第二个café、ATM、car hire；security等位置不变。",
    essay: "The plans show the current layout of Southwest Airport and how the site will look once it has been redeveloped.\n\nIt is clear that the main change will be a huge expansion in the number of gates, from eight to eighteen. It is also noticeable that passengers will be offered several facilities that the airport does not have at present.\n\nAt present, eight gates are reached on foot along a single walkway leading from the terminal. After redevelopment, this walkway will have been replaced by a sky train, and the gates will more than double to eighteen, arranged in a Y shape on either side of the tracks.\n\nThe terminal itself will gain the most new amenities. A bag drop will sit beside the check-in desks, and a row of shops will open along the departures walkway; on the arrivals side, a second café will appear next to a new ATM and car-hire desk. Security, passport control and customs will stay exactly where they are, the only parts of the airport, apart from the check-in and one café, to survive the redevelopment untouched.",
    paraTeach: {
      "2": {
        why: "规划图地图（现在vs将来）开头：how the site will look once it has been redeveloped——will look + 完成时锁定「翻修完成」的时点，全文将来时基调由此定下（体系2.1：规划图用 will be）。",
        modelPara: "The plans show the current layout of Southwest Airport and how the site will look once it has been redeveloped.",
        expressions: [
          { en: "the current layout of Southwest Airport", zh: "机场当前布局（现状半句）" },
          { en: "how the site will look once it has been redeveloped", zh: "翻修完成后的样子（将来时+完成时）" }
        ],
        guideQ: "规划图你全文用 will be / will look 了吗？混进 was built 就时态错乱。"
      },
      "3": {
        why: "地图概括两句：句1给头条（登机口8→18，from eight to eighteen 一眼看出的最大变化），句2给第二特征（新增多种旅客设施）——概括写「最大变化的总纲」，明细留给细节段。",
        modelPara: "It is clear that the main change will be a huge expansion in the number of gates, from eight to eighteen. It is also noticeable that passengers will be offered several facilities that the airport does not have at present.",
        expressions: [
          { en: "a huge expansion in the number of gates, from eight to eighteen", zh: "登机口从8个大幅扩至18个（头条+数字对比）" },
          { en: "facilities that the airport does not have at present", zh: "现有机场没有的设施（第二特征）" }
        ],
        guideQ: "地图题的「最大变化」你放进概括第一句了吗？数字对比（8→18）是它的分量所在。"
      },
      "4": {
        why: "细节一=登机半区：现状一句（8 gates + walkway），将来一句（sky train + 18 gates Y形布局）——will have been replaced 用将来完成时写「翻修完成时已发生」的变化，是规划图的高分时态。",
        modelPara: "At present, eight gates are reached on foot along a single walkway leading from the terminal. After redevelopment, this walkway will have been replaced by a sky train, and the gates will more than double to eighteen, arranged in a Y shape on either side of the tracks.",
        expressions: [
          { en: "are reached on foot along a single walkway", zh: "步行经单一通道到达（现状被动）" },
          { en: "this walkway will have been replaced by a sky train", zh: "通道将被 Sky Train 取代（将来完成时被动）" },
          { en: "the gates will more than double to eighteen", zh: "登机口翻倍还多、增至18个（more than double）" }
        ],
        guideQ: "「翻修完成时」的变化你用将来完成时（will have been done）了吗？普通 will be 也对，但少一层精确。"
      },
      "5": {
        why: "细节二=航站楼新增设施：bag drop/shops（出发侧）+第二café/ATM/car hire（到达侧）并写；收尾句用 the only parts... to survive the redevelopment untouched 把「不变项」点出——变化与保留闭环（体系2.2地图 retained 纪律）。",
        modelPara: "The terminal itself will gain the most new amenities. A bag drop will sit beside the check-in desks, and a row of shops will open along the departures walkway; on the arrivals side, a second café will appear next to a new ATM and car-hire desk. Security, passport control and customs will stay exactly where they are, the only parts of the airport, apart from the check-in and one café, to survive the redevelopment untouched.",
        expressions: [
          { en: "will gain the most new amenities", zh: "航站楼将新增最多设施（段落主旨）" },
          { en: "a second café will appear next to a new ATM and car-hire desk", zh: "到达侧将出现第二咖啡馆、ATM与租车柜台" },
          { en: "will stay exactly where they are", zh: "位置原封不动（保留类表达）" }
        ],
        guideQ: "「不变的部分」你写了吗？机场里 security 等位置不动，与新增设施形成对照。"
      }
    }
  },
  "剑16 Test 3 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Many manufactured foods and drinks are loaded with sugar, and one proposed remedy is to tax these products heavily so that people consume less of them. I strongly agree with this approach, because prices change behaviour and because the money raised can fund prevention.\n\nThe clearest reason is that cost is one of the most powerful influences on what shoppers buy. When sugary drinks become noticeably more expensive than water or milk, many households gradually switch, exactly as smokers cut back when cigarettes were repeatedly taxed. Britain's sugar levy on soft drinks shows that the mechanism works: several manufacturers reformulated their recipes to stay below the taxable threshold, so the entire market became healthier without consumers needing to change their habits at all. A well-designed tax therefore reaches even those who ignore health warnings on labels.\n\nThe revenue gives the policy a second benefit. Money collected from sugary products can subsidise fruit in school canteens, fund dental treatment for children and pay for public health campaigns, meaning the harms of sugar are partly repaired by the tax itself. Critics rightly point out that such taxes are regressive, falling hardest on low-income families who spend a larger share of their budget on food. This objection is serious but not decisive: the poor also suffer most from diabetes and tooth decay, so the long-term effect of changing prices and funding prevention is likely to help them more than it costs them.\n\nIn conclusion, taxing sugary products is an effective and self-funding way to reduce consumption, and the fairness problem can be managed through how the revenue is spent.",
    paraTeach: {
      "2": {
        why: "观点题开头两句：句1改写（are loaded with sugar 替换 contain high levels；tax heavily↔made more expensive），句2立场+两条路线预告（prices change behaviour + fund prevention）——每条路线正好各领一个主体段。",
        modelPara: "Many manufactured foods and drinks are loaded with sugar, and one proposed remedy is to tax these products heavily so that people consume less of them. I strongly agree with this approach, because prices change behaviour and because the money raised can fund prevention.",
        expressions: [
          { en: "are loaded with sugar", zh: "含糖量极高（contain high levels of sugar的地道替换）" },
          { en: "one proposed remedy", zh: "一种被提出的对策（题目措施的改写）" },
          { en: "because prices change behaviour and because the money raised can fund prevention", zh: "价格改变行为+税款可资助预防（两条路线一句预告）" }
        ],
        guideQ: "你的立场句后面的两个 because，是不是正好就是你两个主体段的主题句？这是最高效的开头写法。"
      },
      "3": {
        why: "理由一「价格改变行为」用三层证据写透：常识机制（比水贵→换购）→类比（烟税与戒烟）→真实案例（英国糖税让厂商改配方，全市场被动变健康）。例子具体到国家与机制（体系1.4），no big words。",
        modelPara: "The clearest reason is that cost is one of the most powerful influences on what shoppers buy. When sugary drinks become noticeably more expensive than water or milk, many households gradually switch, exactly as smokers cut back when cigarettes were repeatedly taxed. Britain's sugar levy on soft drinks shows that the mechanism works: several manufacturers reformulated their recipes to stay below the taxable threshold, so the entire market became healthier without consumers needing to change their habits at all. A well-designed tax therefore reaches even those who ignore health warnings on labels.",
        expressions: [
          { en: "exactly as smokers cut back when cigarettes were repeatedly taxed", zh: "正如多次加税后烟民减量（类比论证）" },
          { en: "reformulated their recipes to stay below the taxable threshold", zh: "改配方以低于起征点（案例机制具体）" },
          { en: "reaches even those who ignore health warnings", zh: "连无视健康警告的人也覆盖到（收口）" }
        ],
        guideQ: "你的例子给了「哪个国家+什么机制+什么结果」吗？泛泛的 some countries 隔靴搔痒。"
      },
      "4": {
        why: "理由二「税款自养」+让步处理反方：先展开收益（水果补贴/牙科/宣传），再 Critics rightly point out 让步（累退、伤穷人），冒号后一句驳倒（穷人也最受害→长期反而受益）——让步不弃阵地，讨论完整（体系1.2）。",
        modelPara: "The revenue gives the policy a second benefit. Money collected from sugary products can subsidise fruit in school canteens, fund dental treatment for children and pay for public health campaigns, meaning the harms of sugar are partly repaired by the tax itself. Critics rightly point out that such taxes are regressive, falling hardest on low-income families who spend a larger share of their budget on food. This objection is serious but not decisive: the poor also suffer most from diabetes and tooth decay, so the long-term effect of changing prices and funding prevention is likely to help them more than it costs them.",
        expressions: [
          { en: "the harms of sugar are partly repaired by the tax itself", zh: "糖的危害由税自身部分修复（点睛句）" },
          { en: "such taxes are regressive, falling hardest on low-income families", zh: "这类税是累退的，穷人负担最重（反方最强点）" },
          { en: "This objection is serious but not decisive", zh: "此反对严肃但不致命（让步转折标准句）" }
        ],
        guideQ: "你承认了反方最强的点再反驳吗？忽略最强反驳的观点题，考官一眼看穿。"
      },
      "5": {
        why: "一句话结尾：effective and self-funding 收两条主线，fairness problem managed through revenue 收让步段——立场原样，词汇全换（体系1.3）。",
        modelPara: "In conclusion, taxing sugary products is an effective and self-funding way to reduce consumption, and the fairness problem can be managed through how the revenue is spent.",
        expressions: [
          { en: "an effective and self-funding way to reduce consumption", zh: "有效且自我造血的减耗手段（换词收立场）" },
          { en: "the fairness problem can be managed through how the revenue is spent", zh: "公平性问题可通过税款用途化解（收让步）" }
        ],
        guideQ: "你的结尾是不是立场不变、词汇全换？出现新观点就是违规。"
      }
    }
  },
  "剑16 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "流程图：塑料瓶回收——投入回收桶→卡车收运→回收中心分拣→压缩成块→破碎→清洗→熔化成pellets→加热制成产品原料→制成新品（衣服、玩具等）。",
    essay: "The diagram shows the stages by which plastic bottles are recycled, from the moment they are thrown away to the production of new goods.\n\nIt is clear that the process consists of nine steps, beginning at the recycling bin and ending with everyday products such as clothing and toys. It is also noticeable that both the public and industrial machinery play essential parts in the cycle.\n\nThe first three stages take place before the bottles reach the factory. Consumers drop their used bottles into recycling bins, from which the bottles are collected by lorries and taken to a sorting centre, where reusable bottles are separated from unusable ones. In the preparation stage, the sorted bottles are compressed into large blocks, crushed into small pieces and washed thoroughly.\n\nThe manufacturing stage begins when the clean pieces are melted down and formed into pellets. These pellets are then heated once more and rolled into sheets, which are used to make a wide range of end products, from clothes to stationery. What makes this process remarkable is that it never truly finishes: today's plastic bottle becomes part of tomorrow's product, and the cycle can begin again.",
    paraTeach: {
      "2": {
        why: "开头把流程的起终点装进 from...to... 介词短语（from thrown away to production of new goods），一句完成改写+全程框架——比 The diagram shows the process of recycling 更具体。",
        modelPara: "The diagram shows the stages by which plastic bottles are recycled, from the moment they are thrown away to the production of new goods.",
        expressions: [
          { en: "the stages by which plastic bottles are recycled", zh: "塑料瓶被回收的各个阶段（被动改写）" },
          { en: "from the moment they are thrown away to the production of new goods", zh: "从丢弃到新产品（起终点框架）" }
        ],
        guideQ: "你的流程图开头带了「起点和终点」吗？一句话交代全程，考官立刻知道你读懂了。"
      },
      "3": {
        why: "概括=步数+起终点（句1）+流程的结构特征（句2：公众与机器各承担一半）——第二句跳出步骤细节看「谁参与」，这是这张图比一般流程图深一层的特征。",
        modelPara: "It is clear that the process consists of nine steps, beginning at the recycling bin and ending with everyday products such as clothing and toys. It is also noticeable that both the public and industrial machinery play essential parts in the cycle.",
        expressions: [
          { en: "consists of nine steps", zh: "由九步组成（步数句）" },
          { en: "both the public and industrial machinery play essential parts", zh: "公众与机器缺一不可（参与方特征）" }
        ],
        guideQ: "除了数步数，你有没有看出流程里「人或机器」的角色分工？第二层特征往往在评分时拉开差距。"
      },
      "4": {
        why: "细节一=工厂前五步：总起句 The first three stages take place before the bottles reach the factory 先报边界；三个 where/from which 定语从句把「收集-分拣」的场景链起来；压缩-破碎-清洗三连动作用一个句子并列完成（体系2.2从中点切两段）。",
        modelPara: "The first three stages take place before the bottles reach the factory. Consumers drop their used bottles into recycling bins, from which the bottles are collected by lorries and taken to a sorting centre, where reusable bottles are separated from unusable ones. In the preparation stage, the sorted bottles are compressed into large blocks, crushed into small pieces and washed thoroughly.",
        expressions: [
          { en: "from which the bottles are collected by lorries", zh: "瓶子由此被卡车收走（from which场景链）" },
          { en: "reusable bottles are separated from unusable ones", zh: "可用瓶与不可用瓶被分开（分拣步骤）" },
          { en: "are compressed into large blocks, crushed into small pieces and washed", zh: "压块、破碎、清洗三步并一句" }
        ],
        guideQ: "相邻的三个机械动作你会并成一句写吗？一步一句的流程图，句子机械感很重。"
      },
      "5": {
        why: "细节二=后四步：melted→pellets→heated→rolled→end products；these pellets 指代衔接；结尾 What makes this process remarkable 是流程图罕见的「评论句」——点出循环本质，呼应开头 without breaking 客观原则（说的是图内事实而非观点）。",
        modelPara: "The manufacturing stage begins when the clean pieces are melted down and formed into pellets. These pellets are then heated once more and rolled into sheets, which are used to make a wide range of end products, from clothes to stationery. What makes this process remarkable is that it never truly finishes: today's plastic bottle becomes part of tomorrow's product, and the cycle can begin again.",
        expressions: [
          { en: "melted down and formed into pellets", zh: "熔化制成小球粒（关键转化步骤）" },
          { en: "a wide range of end products", zh: "各种各样的最终产品" },
          { en: "the cycle can begin again", zh: "循环可以重新开始（点出循环性）" }
        ],
        guideQ: "写完所有步骤后，你有没有用一句「流程的本质」收尾？循环图尤其需要点破 cycle。"
      }
    }
  },
  "剑16 Test 4 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "In the future, all cars, buses and trucks are expected to drive themselves, leaving passengers as the only people inside. I believe the advantages of this development will outweigh its disadvantages, provided that governments regulate the transition carefully.\n\nThe greatest gain is safety. Human error contributes to the overwhelming majority of road deaths, whether through tiredness, distraction or alcohol, and computer drivers never suffer from any of these. Countries that have already tested autonomous fleets report accident rates far below the national average, which suggests that removing people from the driver's seat would save hundreds of thousands of lives worldwide every year. Widespread automation would also free those who cannot drive: elderly citizens and disabled passengers would no longer depend on relatives or scarce public transport to reach a hospital or a job interview.\n\nThe disadvantages are real but manageable. Professional drivers, from taxi operators to lorry drivers, will lose their livelihoods, and this displacement will be painful for the families involved; governments will need retraining programmes to soften it. There is also the question of responsibility when a self-driving vehicle crashes, since the law must decide whether the manufacturer, the software company or the owner is to blame. Neither problem, however, argues for abandoning the technology, and both have existed in earlier transport revolutions, from railways to aeroplanes, where regulation eventually caught up.\n\nIn conclusion, driverless vehicles promise a transport system that is dramatically safer and more inclusive, and the disruption they cause is temporary and governable. I am convinced the balance of this development is firmly positive.",
    paraTeach: {
      "2": {
        why: "利弊比较题开头必须亮「 outweigh 」态度：句1改写（all cars... will be driverless→are expected to drive themselves），句2 advantages outweigh disadvantages + provided that 条件限定——条件句让立场更严谨不吃亏（体系1.2利弊纪律）。",
        modelPara: "In the future, all cars, buses and trucks are expected to drive themselves, leaving passengers as the only people inside. I believe the advantages of this development will outweigh its disadvantages, provided that governments regulate the transition carefully.",
        expressions: [
          { en: "are expected to drive themselves, leaving passengers as the only people inside", zh: "预期将自动驾驶，车内只剩乘客（题目两句并一句）" },
          { en: "outweigh its disadvantages", zh: "利大于弊（利弊题必须的表态动词）" },
          { en: "provided that governments regulate the transition carefully", zh: "前提是政府谨慎监管转型（条件限定立场）" }
        ],
        guideQ: "利弊题你的表态是「比较级」的吗？只说优点多不算回答 outweigh 问题。"
      },
      "3": {
        why: "优点段写透一个核心（安全）：机制（人的三大失误 vs 机器不会）→证据（测试车队事故率）→量化结果（每年救几十万人），再补第二个优点（老人残疾人出行自由）收尾。一个段=一个主论点+一个副论点，主次分明（体系1.4）。",
        modelPara: "The greatest gain is safety. Human error contributes to the overwhelming majority of road deaths, whether through tiredness, distraction or alcohol, and computer drivers never suffer from any of these. Countries that have already tested autonomous fleets report accident rates far below the national average, which suggests that removing people from the driver's seat would save hundreds of thousands of lives worldwide every year. Widespread automation would also free those who cannot drive: elderly citizens and disabled passengers would no longer depend on relatives or scarce public transport to reach a hospital or a job interview.",
        expressions: [
          { en: "Human error contributes to the overwhelming majority of road deaths", zh: "人为失误是绝大多数 road deaths 的主因（机制句）" },
          { en: "accident rates far below the national average", zh: "事故率远低于全国平均（证据句）" },
          { en: "no longer depend on relatives or scarce public transport", zh: "不再依赖亲属或稀缺公交（受益者具体化）" }
        ],
        guideQ: "你的主论点有没有「机制→证据→结果」三层？只有口号没有证据的段落撑不到7分。"
      },
      "4": {
        why: "缺点段写实但不翻车：失业（具体到 taxi/lorry+家庭痛苦+对策 retraining）与责任认定（ manufacturer/software/owner 三选一的 法律难题），用 Neither problem argues for abandoning + 历史 类比（铁路飞机）把缺点按回「可控」——呼应开头 provided that。",
        modelPara: "The disadvantages are real but manageable. Professional drivers, from taxi operators to lorry drivers, will lose their livelihoods, and this displacement will be painful for the families involved; governments will need retraining programmes to soften it. There is also the question of responsibility when a self-driving vehicle crashes, since the law must decide whether the manufacturer, the software company or the owner is to blame. Neither problem, however, argues for abandoning the technology, and both have existed in earlier transport revolutions, from railways to aeroplanes, where regulation eventually caught up.",
        expressions: [
          { en: "The disadvantages are real but manageable", zh: "缺点真实但可控（段落主旨句）" },
          { en: "governments will need retraining programmes to soften it", zh: "需要再培训计划缓冲（给对策=严谨）" },
          { en: "regulation eventually caught up", zh: "监管最终跟上了（历史类比收口）" }
        ],
        guideQ: "你写的每个缺点后面有没有「为什么它挡不住结论」？没有这一步，outweigh 的比较就不成立。"
      },
      "5": {
        why: "一句话结尾：dramatically safer and more inclusive 收优点，temporary and governable 收缺点，firmly positive 最终表态——比较题的结尾就是把比较双方各用两个形容词钉死。",
        modelPara: "In conclusion, driverless vehicles promise a transport system that is dramatically safer and more inclusive, and the disruption they cause is temporary and governable. I am convinced the balance of this development is firmly positive.",
        expressions: [
          { en: "dramatically safer and more inclusive", zh: "更安全、更包容（优点钉死）" },
          { en: "temporary and governable", zh: "暂时且可控（缺点钉死）" },
          { en: "the balance of this development is firmly positive", zh: "利弊天平坚定偏正（最终表态）" }
        ],
        guideQ: "你的结论让读者一秒看到「天平向哪边倾斜」了吗？"
      }
    }
  },
  "剑17 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "地图：Norbiton工业区现状 vs 未来规划。现状：环岛主路串起若干工厂、厂房临河。规划：全部工厂改建为住宅；主路新增环岛与支路；跨河新桥连接对岸；增设商店；学校旁新建playground；河边农田改住宅。未来规划→will be。",
    essay: "The maps show an industrial area in the town of Norbiton as it exists today and how it is planned to be developed in the future.\n\nIt is clear that the area will be transformed from a zone of factories into a residential neighbourhood. It is also noticeable that the road network will be expanded to connect the new housing with the far side of the river.\n\nAt present, the site consists of a main road encircling a series of factories, with a roundabout at its western end and a river running along the eastern edge. According to the plan, every factory will be demolished and replaced by housing on new side streets. A further roundabout will be built at the eastern end, and a new bridge will carry the road across the river, where the farmland will also become homes.\n\nThe plan makes some provision for daily life. Shops will open on the main road near the centre of the development, and the existing school in the north will be retained, with a new playground constructed on land beside it. Overall, the area is expected to become one of the town's principal residential districts.",
    paraTeach: {
      "2": {
        why: "规划图开头：as it exists today and how it is planned to be developed 一句锁死「现状+将来」双时态框架；is planned to be 被动未来是规划图的标准开场（体系2.1：规划图用 will be）。",
        modelPara: "The maps show an industrial area in the town of Norbiton as it exists today and how it is planned to be developed in the future.",
        expressions: [
          { en: "as it exists today", zh: "如今的样子（现状半句）" },
          { en: "how it is planned to be developed in the future", zh: "未来规划的样子（将来被动半句）" }
        ],
        guideQ: "规划图的开头你把「现在与将来」两种时态都用上了吗？"
      },
      "3": {
        why: "地图概括两句：句1给最大变化（工厂区→住宅区，一句话讲完土地用途逆转），句2给第二主线（路网跨河扩展）——「用途改变+基础设施延伸」是这类城乡规划图的两大标配头条。",
        modelPara: "It is clear that the area will be transformed from a zone of factories into a residential neighbourhood. It is also noticeable that the road network will be expanded to connect the new housing with the far side of the river.",
        expressions: [
          { en: "will be transformed from a zone of factories into a residential neighbourhood", zh: "将从工厂区转变为住宅区（用途逆转一句话）" },
          { en: "the road network will be expanded to connect", zh: "路网将扩展以连接（基础设施主线）" }
        ],
        guideQ: "地图题的「用途改变」你放进概括第一句了吗？这是规划图永远的第一特征。"
      },
      "4": {
        why: "细节一=主体改造：At present 一句写现状（encircling 精准描述环路），then 三连 will be（demolished/replaced/arranged）写住宅替换，再以 roundabout→bridge→farmland 的顺序写路网跨河——「现状一句+将来三改」+空间顺序推进。",
        modelPara: "At present, the site consists of a main road encircling a series of factories, with a roundabout at its western end and a river running along the eastern edge. According to the plan, every factory will be demolished and replaced by housing on new side streets. A further roundabout will be built at the eastern end, and a new bridge will carry the road across the river, where the farmland will also become homes.",
        expressions: [
          { en: "a main road encircling a series of factories", zh: "环绕一片工厂的主路（encircle精准方位动词）" },
          { en: "will be demolished and replaced by housing", zh: "将被拆除并由住宅取代（拆除+替换连用）" },
          { en: "the farmland will also become homes", zh: "对岸农田也将改为住宅（converted into改用途）" }
        ],
        guideQ: "地图变化的五类动词（新增/拆除/扩建/移位/改用途）你能各举出本图一例吗？"
      },
      "5": {
        why: "细节二=生活配套：shops 与 playground 用 will open/will be constructed，学校用 retained（保留是地图题最容易被漏写的动词类别）；Overall 收束句点出「工业属性彻底消失+预期成为主要住宅区」，呼应概括段收口。",
        modelPara: "The plan makes some provision for daily life. Shops will open on the main road near the centre of the development, and the existing school in the north will be retained, with a new playground constructed on land beside it. Overall, the area is expected to become one of the town's principal residential districts.",
        expressions: [
          { en: "makes some provision for daily life", zh: "为日常生活做了安排（配套段总起）" },
          { en: "will be retained, with a new playground constructed on land beside it", zh: "将保留，旁边将新建游乐场（保留+新增一句并写）" },
          { en: "is expected to become one of the town's principal residential districts", zh: "预计成为镇上主要的住宅区之一（呼应概括收尾）" }
        ],
        guideQ: "「保留不变」的东西你写了吗？地图题只写变化漏掉 retained 项，覆盖就不完整。"
      }
    }
  },
  "剑17 Test 1 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Taking risks is often described as an essential part of a successful life, both at work and at home. Although careless gambles can clearly damage a person's finances and relationships, I believe the advantages of taking sensible risks outweigh the disadvantages.\n\nThe case for risk-taking rests on what happens without it. Careers stall when employees only ever choose the familiar: the accountant who volunteers to lead an unfamiliar project may fail, but that project is also the only route to a promotion, and employers consistently reward those who step forward. The same logic applies to personal life. People who never risk rejection do not ask anyone on a date, move to a new city or start a friendship, and their lives shrink accordingly. Calculated risks are, in effect, the price of any meaningful change.\n\nThe disadvantages are equally real. A failed gamble can cost a family its savings, as thousands of small business owners discovered during recent economic downturns, and repeated failures slowly destroy the confidence that risk-taking depends on. There is also a moral hazard in modern life: social media celebrates the spectacular successes and hides the many quiet failures, encouraging young people to take wild chances with unrealistic expectations. This is why the type of risk matters. Weighing what can be lost against what might be gained, and never betting what one cannot afford to lose, separates entrepreneurship from mere gambling.\n\nIn conclusion, sensible risks carry the constant danger of loss, but they are the only way anyone advances professionally or grows personally. Managed with judgement, they are worth taking.",
    paraTeach: {
      "2": {
        why: "利弊比较题开头：句1改写（essential part of a successful life↔important），句2让步+比较级表态（Although careless gambles can damage... advantages outweigh）——先认代价再表态，立场立刻显得公允（体系1.2）。",
        modelPara: "Taking risks is often described as an essential part of a successful life, both at work and at home. Although careless gambles can clearly damage a person's finances and relationships, I believe the advantages of taking sensible risks outweigh the disadvantages.",
        expressions: [
          { en: "Although careless gambles can clearly damage", zh: "尽管鲁莽的冒险确实有害（让步开路）" },
          { en: "the advantages of taking sensible risks outweigh the disadvantages", zh: "明智冒险利大于弊（outweigh表态+sensible限定）" }
        ],
        guideQ: "你的表态里有没有加限定词（sensible/calculated）？裸说「冒险好」很容易被自己第二段反驳。"
      },
      "3": {
        why: "优点段核心打法：从反面论证（without it 会怎样）——职业上一条线（熟悉的路→停滞；陌生的项目→失败也可能→唯一晋升路），个人生活一条线（怕被拒→什么都不敢开始）。两个领域对应题目的 professional and personal 双场景（审题三问第2问）。",
        modelPara: "The case for risk-taking rests on what happens without it. Careers stall when employees only ever choose the familiar: the accountant who volunteers to lead an unfamiliar project may fail, but that project is also the only route to a promotion, and employers consistently reward those who step forward. The same logic applies to personal life. People who never risk rejection do not ask anyone on a date, move to a new city or start a friendship, and their lives shrink accordingly. Calculated risks are, in effect, the price of any meaningful change.",
        expressions: [
          { en: "rests on what happens without it", zh: "理由在于「不冒险会怎样」（反面论证法）" },
          { en: "the only route to a promotion", zh: "晋升的唯一途径" },
          { en: "the price of any meaningful change", zh: "任何有意义改变的代价（点睛收口）" }
        ],
        guideQ: "题目要求的两个场景（职业+个人），你的优点段是不是各有一条具体的线？"
      },
      "4": {
        why: "缺点段写实+给判据：积蓄归零（衰退期小企业主）→自信被磨掉→社交媒体只报喜诱发赌徒心态，最后用 the type of risk matters 把缺点转化为标准（可承受的赌注vs赌博）——缺点段结尾服务立场，不自我拆台。",
        modelPara: "The disadvantages are equally real. A failed gamble can cost a family its savings, as thousands of small business owners discovered during recent economic downturns, and repeated failures slowly destroy the confidence that risk-taking depends on. There is also a moral hazard in modern life: social media celebrates the spectacular successes and hides the many quiet failures, encouraging young people to take wild chances with unrealistic expectations. This is why the type of risk matters. Weighing what can be lost against what might be gained, and never betting what one cannot afford to lose, separates entrepreneurship from mere gambling.",
        expressions: [
          { en: "A failed gamble can cost a family its savings", zh: "一次失败的赌注可让家庭倾尽积蓄" },
          { en: "social media celebrates the spectacular successes and hides the many quiet failures", zh: "社交媒体只晒成功、掩盖沉默的失败（时代感例子）" },
          { en: "separates entrepreneurship from mere gambling", zh: "区分创业与赌博（判据句收口）" }
        ],
        guideQ: "你写完缺点后有没有给出「什么样的险值得冒」的判据？有判据，比较题才立得住。"
      },
      "5": {
        why: "一句话结尾：constant danger of loss 承认缺点、only way anyone advances 收优点、managed with judgement 呼应判据——利弊题结尾=缺点+优点+条件三合一。",
        modelPara: "In conclusion, sensible risks carry the constant danger of loss, but they are the only way anyone advances professionally or grows personally. Managed with judgement, they are worth taking.",
        expressions: [
          { en: "carry the constant danger of loss", zh: "始终伴随损失风险（缺点换词）" },
          { en: "Managed with judgement, they are worth taking", zh: "以判断力管理就值得一试（分词开头+最终表态）" }
        ],
        guideQ: "你的结尾是不是「缺点一句+优点一句+最终表态」的最小闭环？"
      }
    }
  },
  "剑17 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "表+双饼图：警察预算2017年304.7m→2018年318.6m；来源：national government 175.5→177.8m、local taxes 91.2→102.3m（涨幅最大）、other 38→38.5m。支出：salaries 75%→69%、technology 8%→14%（近翻倍）、buildings 17%→17%持平。",
    essay: "The table and pie charts give information on the budget of one police force in Britain in 2017 and 2018, showing where the money came from and how it was spent.\n\nIt is clear that the total budget grew over the two years. It is also noticeable that the extra money came mainly from local taxes, while the largest change in spending was the growing share taken by technology.\n\nThe budget rose from £304.7 million in 2017 to £318.6 million in 2018, an increase of just under £14 million. The government remained the biggest single source of funds, providing £175.5 million and then £177.8 million, but the sharpest rise belonged to local taxes, which jumped from £91.2 million to £102.3 million. The remaining category, other sources, was almost unchanged at around £38 million.\n\nAs for spending, salaries dominated the budget in both years, although their share fell from 75% to 69%. Buildings took a steady 17% each year, while technology was the only area to grow, its proportion nearly doubling from 8% to 14%. Overall, the pattern suggests a force receiving more money and choosing to invest a significant part of the increase in new equipment rather than staffing.",
    paraTeach: {
      "2": {
        why: "双图开头一句一图：showing 分词短语挂出两个任务（where the money came from / how it was spent），与图表标题一一对应——双图题开头先把「每张图管什么」说清，下面的分组就有了边界。",
        modelPara: "The table and pie charts give information on the budget of one police force in Britain in 2017 and 2018, showing where the money came from and how it was spent.",
        expressions: [
          { en: "give information on the budget of one police force", zh: "给出警方预算信息（gives information about标准替换）" },
          { en: "showing where the money came from and how it was spent", zh: "分词短语交代两图分工（来源+去向）" }
        ],
        guideQ: "双图题你的开头有没有把「哪张图管哪个问题」分派清楚？"
      },
      "3": {
        why: "概括两句：句1给总量趋势（预算增长），句2把两张图的关键结论各收半句（增量主要来自地方税+科技占比大增）——第二概括句用 while 对比结构一次带走两图的头条，省句又完整。",
        modelPara: "It is clear that the total budget grew over the two years. It is also noticeable that the extra money came mainly from local taxes, while the largest change in spending was the growing share taken by technology.",
        expressions: [
          { en: "the extra money came mainly from local taxes", zh: "增量主要来自地方税（表图头条）" },
          { en: "the largest change in spending was the growing share taken by technology", zh: "支出最大变化是科技占比上升（饼图头条）" }
        ],
        guideQ: "你的第二概括句有没有用 while/whereas 把两张图的结论串在一起？"
      },
      "4": {
        why: "细节一=表格（来源）：先总（rose from X to Y+增量换算 just under 14 million——数字纪律：绝对差比裸数字更值钱），再按大小与变化排（government最大但微涨、local taxes涨幅最猛、other不动）——「最值+变化率」双轴组织数据。",
        modelPara: "The budget rose from £304.7 million in 2017 to £318.6 million in 2018, an increase of just under £14 million. The government remained the biggest single source of funds, providing £175.5 million and then £177.8 million, but the sharpest rise belonged to local taxes, which jumped from £91.2 million to £102.3 million. The remaining category, other sources, was almost unchanged at around £38 million.",
        expressions: [
          { en: "an increase of just under £14 million", zh: "增长略低于1400万（同位语补增量）" },
          { en: "the sharpest rise belonged to local taxes", zh: "涨幅最大的是地方税（变化率最值）" },
          { en: "was almost unchanged at around £38 million", zh: "维持在约3800万不变（平稳项收尾）" }
        ],
        guideQ: "表格题你算了「增量」吗？两年数字相减的一句话，信息量胜过照抄四遍原值。"
      },
      "5": {
        why: "细节二=饼图（去向）：salaries 主导但占比降（75→69）、buildings 持平（steady 17%）、technology 独涨（nearly doubling from 8% to 14% 倍数表达）；结尾 Overall 句把两图接通（更多钱→投向设备而非人员）——收尾一句解读，但不越界成观点。",
        modelPara: "As for spending, salaries dominated the budget in both years, although their share fell from 75% to 69%. Buildings took a steady 17% each year, while technology was the only area to grow, its proportion nearly doubling from 8% to 14%. Overall, the pattern suggests a force receiving more money and choosing to invest a significant part of the increase in new equipment rather than staffing.",
        expressions: [
          { en: "dominated the budget in both years", zh: "两年都占预算大头（支配动词）" },
          { en: "its proportion nearly doubling from 8% to 14%", zh: "占比近翻倍，8%到14%（独立主格+倍数）" },
          { en: "invest a significant part of the increase in new equipment rather than staffing", zh: "把大部分增量投向设备而非人员（双图合读收尾）" }
        ],
        guideQ: "表格加饼图你最后有没有一句「合起来看」？双图题的高分收尾就是把两张图接通。"
      }
    }
  },
  "剑17 Test 2 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Children in many families now spend several hours a day on their smartphones, often with little supervision. The main causes of this habit lie in how the devices are designed and in parents' own routines, and in my view the phenomenon is harmful on balance.\n\nThe primary cause is that apps are engineered to capture attention. Short videos and games deliver a reward every few seconds, and a developing brain finds that stream of satisfaction almost impossible to interrupt; children are not weak-willed, they are up against products built by teams of designers. The secondary cause is imitation. Parents who scroll through their own screens at dinner provide a model of constant phone use, and no household rule survives the contradiction of adults who ignore it.\n\nThe negative effects follow directly from the lost hours. Every afternoon spent in front of a feed is an afternoon not spent on sport, homework or face-to-face friendship, and the costs appear quickly: weaker eyesight, disturbed sleep, falling grades. The educational cost alone is substantial: teachers report that pupils who sleep with phones beside them arrive tired and retain less of every lesson. More worrying still is the effect on temperament. Constant novelty makes slow activities such as reading feel unbearable, and children who conduct their friendships through messages practises the skills of conversation far less than those who play together in person.\n\nIn conclusion, smartphones absorb children's time because they are designed to and because adults set the same example, and since the hours lost cannot be replaced, this is a development families and schools should actively resist.",
    paraTeach: {
      "2": {
        why: "双问题（why+评价）开头：句1改写加细节（several hours a day, with little supervision），句2分别给原因方向（设计+家长示范）和评价立场（harmful on balance）——on balance 暗示承认有积极面但整体否定，比全盘否定更严谨。",
        modelPara: "Children in many families now spend several hours a day on their smartphones, often with little supervision. The main causes of this habit lie in how the devices are designed and in parents' own routines, and in my view the phenomenon is harmful on balance.",
        expressions: [
          { en: "often with little supervision", zh: "常常无人监管（改写时补一刀细节）" },
          { en: "lie in how the devices are designed and in parents' own routines", zh: "原因在于设计与家长示范（两原因预告）" },
          { en: "harmful on balance", zh: "总体有害（利弊天平式表态）" }
        ],
        guideQ: "你的开头第二句是不是「原因方向+评价立场」一箭双雕？"
      },
      "3": {
        why: "原因段两层：主因写到「机制深度」（每几秒一次奖励→发育中的大脑停不下来→孩子不是意志弱而是对抗专业设计团队），次因一句话（家长模仿）——一详一略，主次分明（体系1.4）。children are not weak-willed, they are up against... 是让句子有态度的写法。",
        modelPara: "The primary cause is that apps are engineered to capture attention. Short videos and games deliver a reward every few seconds, and a developing brain finds that stream of satisfaction almost impossible to interrupt; children are not weak-willed, they are up against products built by teams of designers. The secondary cause is imitation. Parents who scroll through their own screens at dinner provide a model of constant phone use, and no household rule survives the contradiction of adults who ignore it.",
        expressions: [
          { en: "apps are engineered to capture attention", zh: "应用被精心设计来抓住注意力（主因主题句）" },
          { en: "up against products built by teams of designers", zh: "对抗的是设计团队的作品（机制归因）" },
          { en: "no household rule survives the contradiction of adults who ignore it", zh: "大人带头违规，家规必然失效（次因收口）" }
        ],
        guideQ: "你的主原因挖到了「机制」一层（为什么停不下来），还是停在表面（因为好玩）？"
      },
      "4": {
        why: "评价段=危害链：先算时间账（刷手机的下午=不运动不写作业不见朋友），落到具体代价（视力/睡眠/成绩），再升一层讲性格代价（耐受不了慢节奏、缺少面对面练习）——从可见损失到隐性损失，层层加深（体系1.4结果意识）。",
        modelPara: "The negative effects follow directly from the lost hours. Every afternoon spent in front of a feed is an afternoon not spent on sport, homework or face-to-face friendship, and the costs appear quickly: weaker eyesight, disturbed sleep, falling grades. The educational cost alone is substantial: teachers report that pupils who sleep with phones beside them arrive tired and retain less of every lesson. More worrying still is the effect on temperament. Constant novelty makes slow activities such as reading feel unbearable, and children who conduct their friendships through messages practises the skills of conversation far less than those who play together in person.",
        expressions: [
          { en: "is an afternoon not spent on sport, homework or face-to-face friendship", zh: "就是一个没用来运动作业友谊的下午（机会成本写法）" },
          { en: "More worrying still is the effect on temperament", zh: "更令人担忧的是对性格的影响（升层过渡句）" },
          { en: "practises the skills of conversation far less than", zh: "练习对话技能的机会远少于…（比较收口）" }
        ],
        guideQ: "你写危害是从「看得见的损失」推进到「看不见的损失」了吗？只列三条表面危害像记流水账。"
      },
      "5": {
        why: "一句话结尾：because they are designed to and because adults set the same example 用省略换词收回两原因，since the hours lost cannot be be replaced 把评价钉死为「应主动抵制」——结论带呼吁但不喊口号。",
        modelPara: "In conclusion, smartphones absorb children's time because they are designed to and because adults set the same example, and since the hours lost cannot be replaced, this is a development families and schools should actively resist.",
        expressions: [
          { en: "because they are designed to and because adults set the same example", zh: "因为设计使然+大人言传身教（双原因省略式回收）" },
          { en: "a development families and schools should actively resist", zh: "家庭与学校应主动抵制的发展（negative development换词+行动导向）" }
        ],
        guideQ: "评价类结论你敢给出「该怎么做」吗？一句 actively resist 让结尾有落点。"
      }
    }
  },
  "剑17 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "柱图：家庭周收入支出占比 1968 vs 2018。1968：food最高35%；2018：food降至约17%，leisure升至约13%成最大项，housing约10%→19%，transport约8%→11%，personal goods等下降。",
    essay: "The bar chart compares how families in one country spent their weekly income across a range of categories in 1968 and 2018.\n\nIt is clear that the shape of household spending changed fundamentally over the fifty years. It is also noticeable that food, the largest expense by far in 1968, had surrendered that position to leisure by 2018.\n\nFood accounted for 35% of the family budget in 1968, twice as much as any other category, with housing and transport the next largest at around 10% each. Fifty years later, the food figure had fallen to about 17%, while housing had almost doubled to 19% and transport had risen slightly to 11%. Leisure showed the most dramatic change of all, climbing from a modest 6% to 13%, overtaking every category except housing.\n\nThe remaining areas of spending became less important over the period. The proportion of income devoted to clothing and footwear, household goods and personal items all fell, and the combined share taken by these smaller categories dropped noticeably. In 1968 the household budget revolved around feeding the family; by 2018, after food, shelter and travel had been paid for, entertainment had become the main claim on what was left.",
    paraTeach: {
      "2": {
        why: "开头改写：compares how families spent their weekly income（疑问词从句改写 gives information about the spending），across a range of categories 补充维度，两年份保留——柱图双年份=对比题，开头就点明比较性质。",
        modelPara: "The bar chart compares how families in one country spent their weekly income across a range of categories in 1968 and 2018.",
        expressions: [
          { en: "compares how families in one country spent their weekly income", zh: "比较家庭如何支配周收入（从句改写）" },
          { en: "across a range of categories", zh: "横跨多个类别（维度交代）" }
        ],
        guideQ: "对比两年的图，你的开头是不是也写成了比较句式（compares）？"
      },
      "3": {
        why: "概括两句：句1定性（消费结构根本改变），句2抓头条故事（王位更替：food 让位于 leisure）——「the largest expense by far... surrendered that position」用拟人动词把最值变化讲成一句话，无细数字。",
        modelPara: "It is clear that the shape of household spending changed fundamentally over the fifty years. It is also noticeable that food, the largest expense by far in 1968, had surrendered that position to leisure by 2018.",
        expressions: [
          { en: "the shape of household spending changed fundamentally", zh: "消费结构发生根本变化（定性句）" },
          { en: "had surrendered that position to leisure", zh: "把最大项的位置让给了休闲（头条故事化）" }
        ],
        guideQ: "两张柱子放一起，最大的那条故事线是什么？你的概括讲出这个故事了吗？"
      },
      "4": {
        why: "细节一=三大项：先写1968年的食物统治地位（35%+twice as much as any other 倍数对比），然后 1968→2018 三项各给一对数字（fallen to 17%/almost doubled to 19%/risen slightly to 11%），leisure 用 the most dramatic change 单独强调——「过去格局一句+五十年后三项各一句」。",
        modelPara: "Food accounted for 35% of the family budget in 1968, twice as much as any other category, with housing and transport the next largest at around 10% each. Fifty years later, the food figure had fallen to about 17%, while housing had almost doubled to 19% and transport had risen slightly to 11%. Leisure showed the most dramatic change of all, climbing from a modest 6% to 13%, overtaking every category except housing.",
        expressions: [
          { en: "twice as much as any other category", zh: "是其他任何类别的两倍（倍数对比）" },
          { en: "had almost doubled to 19%", zh: "几乎翻倍至19%（过去完成时+倍数）" },
          { en: "overtaking every category except housing", zh: "超过除住房外所有类别（位次变化）" }
        ],
        guideQ: "双年份柱图的每个类别，你都给出「两个年份+一个变化动词」三件套了吗？"
      },
      "5": {
        why: "细节二=其余小项归堆（clothing/household goods/personal items 一句打包下降）+收束句把全文拧成一句话（1968预算围着吃转；2018付完吃住行后娱乐成为最大去处）——归堆防流水账，收束句给段落一个「可记住的结论」。",
        modelPara: "The remaining areas of spending became less important over the period. The proportion of income devoted to clothing and footwear, household goods and personal items all fell, and the combined share taken by these smaller categories dropped noticeably. In 1968 the household budget revolved around feeding the family; by 2018, after food, shelter and travel had been paid for, entertainment had become the main claim on what was left.",
        expressions: [
          { en: "The remaining areas of spending became less important", zh: "其余支出项目变得次要（小项归堆句）" },
          { en: "the household budget revolved around feeding the family", zh: "预算围着全家的吃饭转（形象收束句）" },
          { en: "the main claim on what was left", zh: "剩余钱的最大去向（结尾点题）" }
        ],
        guideQ: "小项归堆后，你有没有给一句「可记住的结论」收尾？这是细节段的层次感所在。"
      }
    }
  },
  "剑17 Test 3 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Some argue that doctors, engineers and other trained professionals should be obliged to work in the country that educated them, while others defend their freedom to leave. This essay will discuss both positions before arguing that restricting such movement is neither fair nor, in the long run, effective.\n\nThose who support restriction have a straightforward case. Training a doctor costs a public university hundreds of thousands in subsidies, and that investment is meant to serve local patients; when graduates depart for higher salaries abroad, the taxpayers who funded their education receive nothing in return. The problem is most acute in poorer countries. When nurses trained in Manila or Lagos take posts in London or Sydney, the hospitals that produced them are left short-staffed, and the loss of exactly the people who should be raising local standards can hold a health system back for a generation.\n\nNevertheless, I side with those who defend free movement. Talent has always travelled to where it is valued, and attempts to trap it breed resentment rather than loyalty; a doctor forced to stay against her will will never be the colleague that a willing one would have been. There are also practical benefits in departure itself. Emigrants send home money and professional contacts, and many eventually return with superior skills, as the technology sectors of India and China demonstrate. The fairer and more effective answer to brain drain is therefore not a travel ban but better pay and conditions at home.\n\nIn conclusion, while the case for requiring service at home rests on a real financial grievance, I believe professionals must remain free to choose where they work, and that source countries profit more from making staying attractive than from making leaving illegal.",
    paraTeach: {
      "2": {
        why: "讨论题开头：句1改写并引出双方（obliged to work in the country that educated them↔required to work；defend their freedom to leave），句2用 before arguing that... 预告我方立场且立场有分量（neither fair nor effective 两把刀）——讨论题句2亮立场是TR硬要求（体系1.2）。",
        modelPara: "Some argue that doctors, engineers and other trained professionals should be obliged to work in the country that educated them, while others defend their freedom to leave. This essay will discuss both positions before arguing that restricting such movement is neither fair nor, in the long run, effective.",
        expressions: [
          { en: "should be obliged to work in the country that educated them", zh: "应被要求在培养他们的国家工作（A方改写）" },
          { en: "defend their freedom to leave", zh: "捍卫离去的自由（B方改写）" },
          { en: "neither fair nor, in the long run, effective", zh: "既不公平、长远也无效（立场双刀预告）" }
        ],
        guideQ: "讨论题你的开头有没有「改写双方+亮明自己立场」三个动作？缺一个TR就丢分。"
      },
      "3": {
        why: "A方段像转述而非辩护（讨论题视角）：straightforward case 起手，算投资账（数十万补贴→纳税人颗粒无收），再用最尖锐的场景收口（马尼拉/拉各斯的护士流失→本地医疗倒退一代人）——把对方观点写到最强，我方反驳才有分量。",
        modelPara: "Those who support restriction have a straightforward case. Training a doctor costs a public university hundreds of thousands in subsidies, and that investment is meant to serve local patients; when graduates depart for higher salaries abroad, the taxpayers who funded their education receive nothing in return. The problem is most acute in poorer countries. When nurses trained in Manila or Lagos take posts in London or Sydney, the hospitals that produced them are left short-staffed, and the loss of exactly the people who should be raising local standards can hold a health system back for a generation.",
        expressions: [
          { en: "have a straightforward case", zh: "理由直接了当（转述对方的中性起手）" },
          { en: "the taxpayers who funded their education receive nothing in return", zh: "出资的纳税人毫无回报（A方核心逻辑）" },
          { en: "hold a health system back for a generation", zh: "让医疗系统倒退一代人（后果量化）" }
        ],
        guideQ: "你把对方观点写到「最强」了吗？稻草人式转述再打倒，是讨论题大忌。"
      },
      "4": {
        why: "我方段三步：价值立场（自由流动是人才规律，强留养怨）→务实证据（侨汇+人脉+回归，印度中国科技业为例）→给出更优解（改善待遇而非禁令）——「解法句」让立场落地，讨论题的 own opinion 就有了建设性（体系1.4）。",
        modelPara: "Nevertheless, I side with those who defend free movement. Talent has always travelled to where it is valued, and attempts to trap it breed resentment rather than loyalty; a doctor forced to stay against her will will never be the colleague that a willing one would have been. There are also practical benefits in departure itself. Emigrants send home money and professional contacts, and many eventually return with superior skills, as the technology sectors of India and China demonstrate. The fairer and more effective answer to brain drain is therefore not a travel ban but better pay and conditions at home.",
        expressions: [
          { en: "Talent has always travelled to where it is valued", zh: "人才总会流向被珍视之处（价值层论证）" },
          { en: "attempts to trap it breed resentment rather than loyalty", zh: "强留只养怨恨不养忠诚" },
          { en: "not a travel ban but better pay and conditions at home", zh: "不是禁令而是改善待遇（建设性对比收口）" }
        ],
        guideQ: "你的 own opinion 除了站队，有没有给出「更好的做法」？有解法的立场比裸立场高一档。"
      },
      "5": {
        why: "一句话结论：while 让步收回A方（real financial grievance 承认其账算得对）+ 重申自由立场 + 把结论升级为对 source countries 的建议——讨论题结尾的标准三件套。",
        modelPara: "In conclusion, while the case for requiring service at home rests on a real financial grievance, I believe professionals must remain free to choose where they work, and that source countries profit more from making staying attractive than from making leaving illegal.",
        expressions: [
          { en: "rests on a real financial grievance", zh: "基于真实的经济委屈（让步回收A方）" },
          { en: "profit more from making staying attractive than from making leaving illegal", zh: "从「让留下有吸引力」中获益多于「让离开违法」（对仗收尾）" }
        ],
        guideQ: "你的结尾让步了对方一句再收束吗？全盘否定对方观点的结论显得输不起。"
      }
    }
  },
  "剑17 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "线图：关店数（实线 Closures）vs 开店数（虚线 Openings）2011-2018。开张：8500→3900（2012崩落）→5000（2013）→6200（2014回升）→4000（2015-2016）→4200（2017）→3000（2018，全图最低）；关张：6500→5900→7200（2013峰值）→6500（2014）→骤降至600（2015，全图最低）→5200（2016回升）→5000→5300。2011年开店多于关店2000家；2018年反转为关店多于开店2300家。",
    essay: "The line graph shows how many shops closed and how many new shops opened in one country over the eight years from 2011 to 2018.\n\nIt is clear that the fortunes of the two flows reversed over the period: openings began far higher but ended below closures. It is also noticeable that both lines fell over the eight years as a whole.\n\nOpenings began the period at their peak of 8,500 in 2011 and then collapsed to 3,900 a year later. They recovered to 6,200 by 2014, but the recovery was short-lived: apart from a slight rise to 4,200 in 2017, openings slid back and ended the period at just 3,000, the lowest figure shown.\n\nClosures followed a rougher path. From 6,500 in 2011 they dipped to 5,900, peaked at 7,200 in 2013, and then crashed spectacularly to only 600 in 2015. They rebounded immediately, however, and stabilised at around 5,000 to 5,300. As a result, the healthy surplus of 2,000 more openings than closures recorded in 2011 had turned, by 2018, into a shortfall of 2,300.",
    paraTeach: {
      "2": {
        why: "开头改写：owner-reported cases of shop closures and openings→how many shops closed and how many new shops opened（名词组改两个动词从句）；时间段嵌入句尾。本题的真正故事是「两条线的强弱反转」——概括第一句就点破。",
        modelPara: "The line graph shows how many shops closed and how many new shops opened in one country over the eight years from 2011 to 2018.",
        expressions: [
          { en: "how many shops closed and how many new shops opened", zh: "多少店关张、多少新店开张（两个平行从句）" },
          { en: "over the eight years from 2011 to 2018", zh: "2011至2018八年间（时间段嵌入）" }
        ],
        guideQ: "closures 和 openings 这对名词，你改写成动词从句了吗？从句比名词堆更易读。"
      },
      "3": {
        why: "概括两句：句1=强弱反转（openings began far higher but ended below closures——一句话讲完八年的故事），句2=两线总体都在下降。「反转」是这张图区别于普通双线图的灵魂。",
        modelPara: "It is clear that the fortunes of the two flows reversed over the period: openings began far higher but ended below closures. It is also noticeable that both lines fell over the eight years as a whole.",
        expressions: [
          { en: "the fortunes of the two flows reversed", zh: "两条线的命运发生了反转（定性句）" },
          { en: "openings began far higher but ended below closures", zh: "开店数起点高得多、收尾却低于关店数（反转具体化）" }
        ],
        guideQ: "双线图的概括写出「强弱关系如何变化」了吗？只写各自趋势会漏掉最值钱的一层。"
      },
      "4": {
        why: "细节一=开店线：峰值起点（8,500）→崩落（3,900）→回升（6,200）→回落到全图最低（3,000）。collapsed/the recovery was short-lived/slid back 三个形状动词拉开段落节奏；2017 小反弹用 apart from 插入处理（体系2.4趋势词伙不重复）。",
        modelPara: "Openings began the period at their peak of 8,500 in 2011 and then collapsed to 3,900 a year later. They recovered to 6,200 by 2014, but the recovery was short-lived: apart from a slight rise to 4,200 in 2017, openings slid back and ended the period at just 3,000, the lowest figure shown.",
        expressions: [
          { en: "began the period at their peak of 8,500", zh: "以期初峰值8500开局（起点即最值）" },
          { en: "the recovery was short-lived", zh: "回升是短暂的（冒号引出转折）" },
          { en: "the lowest figure shown", zh: "图中最小值（同位语点睛）" }
        ],
        guideQ: "一条线有多个拐点时，你用「不同的形状动词」分段写了吗？全段只有rose和fell一定单调。"
      },
      "5": {
        why: "细节二=关店线+反转收口：dipped→peaked→crashed spectacularly to only 600（2015异常点必写）→rebounded and stabilised；结尾用 As a result 把 2011 与 2018 的差额（+2000 → −2300）对比点出——用「净差额」数字讲完反转，呼应概括段。",
        modelPara: "Closures followed a rougher path. From 6,500 in 2011 they dipped to 5,900, peaked at 7,200 in 2013, and then crashed spectacularly to only 600 in 2015. They rebounded immediately, however, and stabilised at around 5,000 to 5,300. As a result, the healthy surplus of 2,000 more openings than closures recorded in 2011 had turned, by 2018, into a shortfall of 2,300.",
        expressions: [
          { en: "crashed spectacularly to only 600 in 2015", zh: "2015年暴跌至仅600（全图最异常点）" },
          { en: "rebounded immediately, however, and stabilised", zh: "随即反弹并企稳（ rebound/stabilise）" },
          { en: "the healthy surplus of 2,000 more openings than closures recorded in 2011 had turned, by 2018, into a shortfall of 2,300", zh: "从多开2000家的盈余转为少开2300家的缺口（反转数字化）" }
        ],
        guideQ: "两条线的强弱反转，你用「首尾净差额」的数字对比讲出来了吗？"
      }
    }
  },
  "剑17 Test 4 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "An increasing number of people who feel unwell now reach for herbal remedies, dietary supplements or other alternative treatments rather than visiting their doctor. While some of these approaches offer comfort, I consider this shift to be a negative development overall, chiefly because it delays effective care.\n\nThe appeal of alternatives is not hard to explain. Conventional appointments are short, impersonal and increasingly expensive, whereas alternative practitioners listen at length, explain their philosophy and sell hope. For chronic complaints that mainstream medicine handles poorly, such as persistent back pain or fatigue, a treatment that promises to treat the whole person naturally feels more humane than a shelf of painkillers. It is also true that a few practices, mindfulness among them, have been validated by research and can genuinely relieve symptoms.\n\nThe danger lies in what gets delayed or replaced. Cancer patients who abandon chemotherapy for herbal cures do not merely waste money; they surrender the months in which treatment works best, and the tragic cases are well documented. Even in smaller matters the arithmetic is unforgiving. Supplements that prove useless in trials are rarely harmless in the wallet, and a patient who self-diagnoses a persistent cough as an allergy may be overlooking the early signs of something serious. The warm, attentive experience that attracts people to alternatives is precisely what mainstream clinics should be copying, not a reason to bypass them.\n\nIn conclusion, although alternative medicine fills real emotional gaps left by modern healthcare, choosing it instead of a doctor trades proven treatment for comfort, and for that reason this trend deserves to be treated with caution rather than enthusiasm.",
    paraTeach: {
      "2": {
        why: "利弊评价题开头：句1改写（a growing number of people with health problems→An increasing number of people who feel unwell；具体化 alternative treatments 的例子），句2让步（offer comfort）+立场（negative overall）+核心理由前置（delays effective care）——把全文最硬的理由放进开头，考官立刻被钩住。",
        modelPara: "An increasing number of people who feel unwell now reach for herbal remedies, dietary supplements or other alternative treatments rather than visiting their doctor. While some of these approaches offer comfort, I consider this shift to be a negative development overall, chiefly because it delays effective care.",
        expressions: [
          { en: "reach for herbal remedies, dietary supplements", zh: "转向草药和保健品（题目说法的具体化改写）" },
          { en: "While some of these approaches offer comfort", zh: "尽管这些方法能带来安慰（让步开路）" },
          { en: "chiefly because it delays effective care", zh: "主要因为它延误有效治疗（核心理由前置）" }
        ],
        guideQ: "你的立场句后面跟全文最硬的那条理由了吗？核心理由放在开头比藏在主体段更有冲击力。"
      },
      "3": {
        why: "让步段写到对方最强：先解释吸引力机制（挂号短/贵/冷漠 vs 从业者倾听/给希望），再具体到主流医学短板（慢性背痛疲劳），最后承认正念有研究背书——把「为什么大家这么选」讲透，批判段才显得公允有力（体系1.2）。",
        modelPara: "The appeal of alternatives is not hard to explain. Conventional appointments are short, impersonal and increasingly expensive, whereas alternative practitioners listen at length, explain their philosophy and sell hope. For chronic complaints that mainstream medicine handles poorly, such as persistent back pain or fatigue, a treatment that promises to treat the whole person naturally feels more humane than a shelf of painkillers. It is also true that a few practices, mindfulness among them, have been validated by research and can genuinely relieve symptoms.",
        expressions: [
          { en: "Conventional appointments are short, impersonal and increasingly expensive", zh: "常规就诊短促冷漠且昂贵（吸引力机制一）" },
          { en: "listen at length, explain their philosophy and sell hope", zh: "长时间倾听、输出理念、贩卖希望（三个动词并列）" },
          { en: "validated by research and can genuinely relieve symptoms", zh: "经研究验证、真能缓解症状（承认对方最强点）" }
        ],
        guideQ: "你在批判之前，有没有把对方「为什么会赢」解释清楚？跳过这一步的批判像偏见。"
      },
      "4": {
        why: "批判段=两档危害：重（放弃化疗→错过黄金期，well documented 佐证）→轻（补品无效还烧钱；自诊咳嗽误了重症早期），收尾用对称句把对方优势反转（温暖体验该被主流诊所学走而非绕开它们）——结尾一句完成「观点反转」是本段杀手锏。",
        modelPara: "The danger lies in what gets delayed or replaced. Cancer patients who abandon chemotherapy for herbal cures do not merely waste money; they surrender the months in which treatment works best, and the tragic cases are well documented. Even in smaller matters the arithmetic is unforgiving. Supplements that prove useless in trials are rarely harmless in the wallet, and a patient who self-diagnoses a persistent cough as an allergy may be overlooking the early signs of something serious. The warm, attentive experience that attracts people to alternatives is precisely what mainstream clinics should be copying, not a reason to bypass them.",
        expressions: [
          { en: "they surrender the months in which treatment works best", zh: "他们错过了治疗最有效的窗口期" },
          { en: "useless in trials are rarely harmless in the wallet", zh: "试验无效的补品对钱包并非无害（对仗句）" },
          { en: "precisely what mainstream clinics should be copying, not a reason to bypass them", zh: "该被主流诊所学走，而非绕开它们的理由（反转收口）" }
        ],
        guideQ: "你的危害是「从重到轻」排的还是随手堆的？排序本身就是论证力。"
      },
      "5": {
        why: "一句话结论：although 让步回收（fills real emotional gaps）+ trades proven treatment for comfort 一句话钉死利弊天平+ deserves caution rather than enthusiasm 收态度——结尾给出「对该趋势的正确姿势」，比重复 negative 更有信息量。",
        modelPara: "In conclusion, although alternative medicine fills real emotional gaps left by modern healthcare, choosing it instead of a doctor trades proven treatment for comfort, and for that reason this trend deserves to be treated with caution rather than enthusiasm.",
        expressions: [
          { en: "fills real emotional gaps left by modern healthcare", zh: "填补了现代医疗留下的情感空缺（让步回收）" },
          { en: "trades proven treatment for comfort", zh: "用确证疗效换安慰（天平一句话）" }
        ],
        guideQ: "你的结论有没有一个「浓缩全文天平」的短语？一句 trades A for B 胜过三行重复。"
      }
    }
  },
  "剑18 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "线图（预测到2040）：菲律宾/马来西亚/泰国/印尼城市人口%，1970-2040（10年间隔，2020后为预测）。马来西亚30→45.5(1990)→71(2010)→76(2020)→预测81(2030)/83(2040)；菲律宾32→49(1990)→回落43(2010)→46(2020)→预测51/56；泰国18→30.5(1990)→停滞34(2020)→预测41/50；印尼14→25.5(1990)→30.5(2000)→43(2010)→52.5(2020)→预测61/64。印尼约2010超泰国、约2020超菲律宾。",
    essay: "The line graph shows the proportion of people living in cities in four Asian countries between 1970 and 2020, with predictions to 2040.\n\nIt is clear that urbanisation advanced in every country over the period. It is also noticeable that Indonesia, the least urbanised in 1970, grew fastest and is expected to overtake two of its neighbours.\n\nMalaysia was the most urbanised country throughout: from 30% in 1970 its figure climbed to 45% by 1990 and 71% in 2010, and it is forecast to reach 83% by 2040. The Philippines followed a different path — rapid growth to 49% by 1990 was followed by a decade of decline to 43%, before the figure resumed its climb, and it is predicted to stand at 56% in 2040.\n\nIndonesia urbanised from the lowest base, at just 14% in 1970, but its growth accelerated after 2000: it overtook Thailand around 2010 and the Philippines around 2020, and is forecast to reach 64% by 2040, with Thailand close behind on 50%.",
    paraTeach: {
      "2": {
        why: "含预测的线图开头：between 1970 and 2020 + with predictions to 2040 把「实线段+预测段」一次交代（本题预测轴到2040，不是2030——读图必须以图为准）。",
        modelPara: "The line graph shows the proportion of people living in cities in four Asian countries between 1970 and 2020, with predictions to 2040.",
        expressions: [
          { en: "the proportion of people living in cities", zh: "居住在城市的人口比例（percentage of urban population的改写）" },
          { en: "with predictions to 2040", zh: "预测到2040年（预测段交代）" }
        ],
        guideQ: "预测段的终点年份，你是从图上读出来的还是想当然写的？"
      },
      "3": {
        why: "概括两句：句1=四国全部城市化（总趋势），句2=本图的头条故事——起点最低的印尼增速最快、预计反超两个邻国。多线图的概括写「线间关系的变化」，比罗列谁高谁低高一档。",
        modelPara: "It is clear that urbanisation advanced in every country over the period. It is also noticeable that Indonesia, the least urbanised in 1970, grew fastest and is expected to overtake two of its neighbours.",
        expressions: [
          { en: "urbanisation advanced in every country", zh: "四国城市化全部推进（总趋势）" },
          { en: "the least urbanised in 1970, grew fastest and is expected to overtake two of its neighbours", zh: "起点最低、增速最快、预计连超两国（一句话头条）" }
        ],
        guideQ: "哪条线完成了「反超」？反超者的故事就是你的概括第二句。"
      },
      "4": {
        why: "细节一=最高者详写+回落者对比：马来西亚三节点串写（30→45%→71%→预测83）；菲律宾用破折号插叙「先快后回落再恢复」的非单调路径（49→43→回升），rapid growth/decline/resumed climb 三个形状词讲完——非单调线就写成三幕小剧。",
        modelPara: "Malaysia was the most urbanised country throughout: from 30% in 1970 its figure climbed to 45% by 1990 and 71% in 2010, and it is forecast to reach 83% by 2040. The Philippines followed a different path — rapid growth to 49% by 1990 was followed by a decade of decline to 43%, before the figure resumed its climb, and it is predicted to stand at 56% in 2040.",
        expressions: [
          { en: "was the most urbanised country throughout", zh: "始终是城市化程度最高（全程最值）" },
          { en: "rapid growth to 49% by 1990 was followed by a decade of decline to 43%", zh: "1990年快速升至49%后经历十年回落至43%（先扬后抑）" },
          { en: "before the figure resumed its climb", zh: "之后重新回升（resume句型）" }
        ],
        guideQ: "先升后降再升的线，你写成三幕了吗？只报首尾就丢了中间的回落故事。"
      },
      "5": {
        why: "细节二=追赶者印尼：from the lowest base + accelerated after 2000 + 两次反超的时间点（约2010超泰国、约2020超菲律宾）+ 预测64%；泰国以 with Thailand close behind on 50% 一笔带过——主写反超者、被超者嵌入句尾。",
        modelPara: "Indonesia urbanised from the lowest base, at just 14% in 1970, but its growth accelerated after 2000: it overtook Thailand around 2010 and the Philippines around 2020, and is forecast to reach 64% by 2040, with Thailand close behind on 50%.",
        expressions: [
          { en: "urbanised from the lowest base, at just 14% in 1970", zh: "从仅14%的最低起点城市化" },
          { en: "it overtook Thailand around 2010 and the Philippines around 2020", zh: "约2010超泰国、约2020超菲律宾（两次反超）" },
          { en: "with Thailand close behind on 50%", zh: "泰国以50%紧随其后（with独立主格带出被超者）" }
        ],
        guideQ: "反超者的两次超越各发生在哪一年？时间点是反超故事的骨架。"
      }
    }
  },
  "剑18 Test 1 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Science serves many masters: governments want security, companies want profit and researchers want knowledge for its own sake. While each of these goals has value, I largely agree that improving people's lives should be treated as the most important aim of scientific work, because that is the standard by which the public ultimately judges and funds it.\n\nThe strongest argument for putting human welfare first is that science consumes public money and public patience. Laboratories, telescopes and clinical trials are financed by taxpayers, and that support survives only as long as ordinary people can see the benefits: the vaccines, clean water and faster communications that research has delivered. When science visibly improves lives, budgets are renewed; when it cannot explain what it is for, it is quietly starved. Prioritising human welfare is therefore not just morally attractive but institutionally necessary.\n\nIt is right, however, to concede a limit. Some of the most useful science in history began as curiosity with no application in sight, and had funding followed only immediate needs, the theories behind today's computers and satellites might never have been discovered. Pure research must therefore keep a protected space. But even this concession supports the central claim: curiosity is worth funding because it so often ends up improving lives in ways nobody predicted. The aim and the accident point in the same direction.\n\nIn conclusion, although knowledge pursued for its own sake deserves protection, the improvement of human life is the proper first priority of science, both because it is the fairest test of value and because it is the only basis on which the public will continue to pay.",
    paraTeach: {
      "2": {
        why: "「To what extent」观点题开头：句1先把题目的对立面摆上桌（governments/companies/researchers 各有所求），句2表态 largely agree 并给出总理由（公众以此标准评价和出资）——先立靶再表态，agree 程度词 largely 留出让步空间。",
        modelPara: "Science serves many masters: governments want security, companies want profit and researchers want knowledge for its own sake. While each of these goals has value, I largely agree that improving people's lives should be treated as the most important aim of scientific work, because that is the standard by which the public ultimately judges and funds it.",
        expressions: [
          { en: "Science serves many masters", zh: "科学服务于多方（一句话摆出对立面）" },
          { en: "I largely agree that", zh: "我基本同意（extent类题的留余地表态）" },
          { en: "the standard by which the public ultimately judges and funds it", zh: "公众评价与出资的最终标准（总理由）" }
        ],
        guideQ: "「在多大程度上同意」的题，你的表态词是绝对的还是留了让步空间（largely/strongly）？"
      },
      "3": {
        why: "理由一写到「制度层」而非「口号层」：科学花的是纳税人的钱和耐心→好处可见则预算续期→解释不了用途就被饿死——整段是一条制度因果链，vaccines/clean water 只作例子嵌入。落到「钱和耐心」是观点具体化的范本（体系1.4）。",
        modelPara: "The strongest argument for putting human welfare first is that science consumes public money and public patience. Laboratories, telescopes and clinical trials are financed by taxpayers, and that support survives only as long as ordinary people can see the benefits: the vaccines, clean water and faster communications that research has delivered. When science visibly improves lives, budgets are renewed; when it cannot explain what it is for, it is quietly starved. Prioritising human welfare is therefore not just morally attractive but institutionally necessary.",
        expressions: [
          { en: "science consumes public money and public patience", zh: "科学消耗公共资金与公众耐心（主旨句）" },
          { en: "that support survives only as long as ordinary people can see the benefits", zh: "支持只在好处可见时存续（条件链）" },
          { en: "not just morally attractive but institutionally necessary", zh: "不仅道德上可取、制度上也不可少（递进收口）" }
        ],
        guideQ: "你的理由是停在「改善生活是好的」，还是挖到了「为什么制度上必须如此」？差一层深度差一分。"
      },
      "4": {
        why: "让步段处理「纯好奇心研究」这一最强反例：承认无应用的科学曾孕育计算机与卫星→给纯研究留保护区→再用 but even this concession supports 把让步反转回立场（好奇心最终也服务于改善生活）——让步反转结构是高分段的标志性写法。",
        modelPara: "It is right, however, to concede a limit. Some of the most useful science in history began as curiosity with no application in sight, and had funding followed only immediate needs, the theories behind today's computers and satellites might never have been discovered. Pure research must therefore keep a protected space. But even this concession supports the central claim: curiosity is worth funding because it so often ends up improving lives in ways nobody predicted. The aim and the accident point in the same direction.",
        expressions: [
          { en: "began as curiosity with no application in sight", zh: "始于看不见应用的纯好奇（让步句）" },
          { en: "had funding followed only immediate needs", zh: "假如拨款只看眼前需求（倒装虚拟条件）" },
          { en: "But even this concession supports the central claim", zh: "但连这条让步也支持中心论点（反转句）" }
        ],
        guideQ: "你让步完有没有把让步「反转」回自己的立场？让而不转等于送分给对方。"
      },
      "5": {
        why: "一句话结论：although 让步回收纯研究 deserving protection + the proper first priority 重申立场 + 双理由收口（fairest test of value + 唯一的出资基础）——extent题结尾要把「同意的程度与理由」一并收拢。",
        modelPara: "In conclusion, although knowledge pursued for its own sake deserves protection, the improvement of human life is the proper first priority of science, both because it is the fairest test of value and because it is the only basis on which the public will continue to pay.",
        expressions: [
          { en: "the proper first priority of science", zh: "科学正当的首要目标（立场换词重申）" },
          { en: "the only basis on which the public will continue to pay", zh: "公众持续出资的唯一基础（收口）" }
        ],
        guideQ: "你的结论把「立场+两条理由+让步」四件事收进两行了吗？"
      }
    }
  },
  "剑18 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "柱图：美国家庭数（百万）按5档年收入×3年。<$25k：25.5→29→28；$25-49.9k：27→30→28.5；$50-74.9k：21→21.5→21（三年不动）；$75-99.9k：14.5→14→15.5（最小档）；$100k+：29.5→28→33（2015全图最高）。头条：$100k+在2007与2015都是最大单档；中部两档纹丝不动。",
    essay: "The bar chart shows how many households in the United States fell into each of five annual income bands in 2007, 2011 and 2015, measured in millions.\n\nIt is clear that the $100,000-or-more band was the largest single group in two of the three years. It is also noticeable that the two middle bands barely moved, so that virtually all the change in the chart came at the top and the bottom.\n\nHouseholds earning $100,000 or more numbered 29.5 million in 2007, dipped to 28 million in 2011 and then jumped to 33 million in 2015, the highest figure on the chart. The $25,000-$49,999 band followed a similar arc, peaking at 30 million in 2011 before easing back to 28.5 million, while the poorest band rose from 25.5 to 28 million over the period.\n\nThe middle of the distribution, by contrast, was static. Households on $50,000-$74,999 held steady at around 21 million in all three years, and the $75,000-$99,999 band was the smallest group throughout, at roughly 14 to 15.5 million. Overall, therefore, America's income profile grew at the very top while its middle stayed exactly where it was.",
    paraTeach: {
      "2": {
        why: "开头改写：shows the number of households by their annual income→how many households fell into each of five annual income bands（档位表达+数量属性），三个年份顺排在句尾。",
        modelPara: "The bar chart shows how many households in the United States fell into each of five annual income bands in 2007, 2011 and 2015, measured in millions.",
        expressions: [
          { en: "fell into each of five annual income bands", zh: "分属五个年收入档（档位表达）" },
          { en: "measured in millions", zh: "以百万为单位（单位口径）" }
        ],
        guideQ: "你的开头点明量的是「户数（百万）」了吗？"
      },
      "3": {
        why: "概括两句：句1=$100k+档在三年中两年是最大单档（纠正直觉：最大的是最高档不是中间档），句2=中部两档几乎不动→全部变化发生在顶部和底部——「变化发生在哪里」是分组柱图概括的钥匙。",
        modelPara: "It is clear that the $100,000-or-more band was the largest single group in two of the three years. It is also noticeable that the two middle bands barely moved, so that virtually all the change in the chart came at the top and the bottom.",
        expressions: [
          { en: "the largest single group in two of the three years", zh: "三年中两年的最大单档（精确限定）" },
          { en: "virtually all the change in the chart came at the top and the bottom", zh: "几乎所有变化都发生在顶部和底部（变化定位句）" }
        ],
        guideQ: "分组柱图你先问「哪里动、哪里不动」了吗？这就是概括的两句话。"
      },
      "4": {
        why: "细节一=三个大档：$100k+（29.5→28→33，2015全图最高）详写，$25-50k「类似弧线」（峰值2011后回落）类比，最穷档一句（25.5→28）——类似走势用 similar arc 归并，避免三段重复。",
        modelPara: "Households earning $100,000 or more numbered 29.5 million in 2007, dipped to 28 million in 2011 and then jumped to 33 million in 2015, the highest figure on the chart. The $25,000-$49,999 band followed a similar arc, peaking at 30 million in 2011 before easing back to 28.5 million, while the poorest band rose from 25.5 to 28 million over the period.",
        expressions: [
          { en: "numbered 29.5 million in 2007, dipped to 28 million in 2011 and then jumped to 33 million", zh: "2950万→2800万→3300万（dip/jump节奏）" },
          { en: "followed a similar arc", zh: "走出类似的弧线（近似走势归并）" },
          { en: "peaking at 30 million in 2011 before easing back", zh: "2011年见顶3000万后回落（peaking分词）" }
        ],
        guideQ: "走势相同的档位你「归并」了吗？三个大档各写一段就是字数灾难。"
      },
      "5": {
        why: "细节二=中部两档：by contrast 转折（与上段的动形成对照），held steady at around 21 million / the smallest group throughout at roughly 14 to 15.5 million；结尾 Overall, therefore 收束句呼应概括（top grew, middle stayed）。",
        modelPara: "The middle of the distribution, by contrast, was static. Households on $50,000-$74,999 held steady at around 21 million in all three years, and the $75,000-$99,999 band was the smallest group throughout, at roughly 14 to 15.5 million. Overall, therefore, America's income profile grew at the very top while its middle stayed exactly where it was.",
        expressions: [
          { en: "The middle of the distribution, by contrast, was static", zh: "分布的中部相比之下纹丝不动（对照转折句）" },
          { en: "the smallest group throughout", zh: "始终是最小群体（持续最值）" },
          { en: "grew at the very top while its middle stayed exactly where it was", zh: "顶部增长、中部原地踏步（收束对仗）" }
        ],
        guideQ: "你的收束句把「顶部与中部」的反差钉死了吗？"
      }
    }
  },
  "剑18 Test 2 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "At university, some students prefer to broaden their studies beyond their chosen subject, while others concentrate exclusively on the qualification in front of them. Both approaches have obvious attractions, but I believe the focused path is the wiser one for most people, provided it is a genuine choice rather than an inability to explore.\n\nThose who wander into other subjects make a persuasive case. Knowledge does not respect the boundaries of a syllabus, and some of the most productive minds in history were conspicuously wide-ranging: a computer scientist who has studied psychology may design better interfaces, and an engineer with an economics background understands why her bridge should be cheap as well as strong. Sampling other fields can also rescue students who discover, sometimes too late, that they chose their main subject badly. A semester of taster courses is often all it takes to redirect a young person towards work that actually suits them.\n\nNevertheless, the case for concentration is stronger. A degree is examined, and examination results are what employers and admissions tutors see first; time spent on extra subjects is time taken from the discipline that will appear on the transcript. Deep study also builds something superficial sampling never can: the habit of sustained, difficult thinking. There will be forty working years after graduation for breadth, and the workplace itself teaches subjects faster than any seminar. University, by contrast, is the one period in life when experts are on hand to guide a student through material they could never master alone.\n\nIn conclusion, while exploring neighbouring subjects has real value, I believe students gain more from going deep on their own degree, since breadth can wait but guided depth cannot.",
    paraTeach: {
      "2": {
        why: "讨论题开头：句1改写双方（broaden their studies beyond their chosen subject ↔ concentrate exclusively），句2立场+限定（the wiser one for most people, provided...）——provided 从句把立场修得更精细，也为后文留出分寸（体系1.2）。",
        modelPara: "At university, some students prefer to broaden their studies beyond their chosen subject, while others concentrate exclusively on the qualification in front of them. Both approaches have obvious attractions, but I believe the focused path is the wiser one for most people, provided it is a genuine choice rather than an inability to explore.",
        expressions: [
          { en: "broaden their studies beyond their chosen subject", zh: "拓宽主修之外的学习（A方改写）" },
          { en: "concentrate exclusively on the qualification in front of them", zh: "只专注于眼前学位（B方改写）" },
          { en: "provided it is a genuine choice rather than an inability to explore", zh: "前提是主动选择而非无能探索（精细限定）" }
        ],
        guideQ: "你的立场句带 provided/as long as 的精细限定了吗？讨论题表态越精确越显功力。"
      },
      "3": {
        why: "A方段=两层理由+一个尖锐例子：知识不分科（跨学科生产力的历史规律，两句具体到计算机+心理/工程+经济）+试读课能救错选专业的学生——「rescue those who chose badly」是对方立场里最有人情味的论点，写足了才公平。",
        modelPara: "Those who wander into other subjects make a persuasive case. Knowledge does not respect the boundaries of a syllabus, and some of the most productive minds in history were conspicuously wide-ranging: a computer scientist who has studied psychology may design better interfaces, and an engineer with an economics background understands why her bridge should be cheap as well as strong. Sampling other fields can also rescue students who discover, sometimes too late, that they chose their main subject badly. A semester of taster courses is often all it takes to redirect a young person towards work that actually suits them.",
        expressions: [
          { en: "Knowledge does not respect the boundaries of a syllabus", zh: "知识不守教学大纲的边界（A方主题句）" },
          { en: "an engineer with an economics background understands why her bridge should be cheap as well as strong", zh: "懂经济的工程师知道桥要便宜也要结实（跨学科具体例）" },
          { en: "redirect a young person towards work that actually suits them", zh: "把年轻人引向真正适合的工作（救错选论点）" }
        ],
        guideQ: "对方立场的例子具体到「哪种人+做出什么更好」了吗？泛泛说视野开阔没有说服力。"
      },
      "4": {
        why: "我方段=务实+修养双轮：学位被考试定义→成绩单上的纪律才是雇主所见（务实）；深度学习锻造「持续艰难思考」的习惯（修养）；再加时间账（毕业后四十年可博，大学是唯一有专家引路的窗口期）——用「不可替代性」论证而非偏好。",
        modelPara: "Nevertheless, the case for concentration is stronger. A degree is examined, and examination results are what employers and admissions tutors see first; time spent on extra subjects is time taken from the discipline that will appear on the transcript. Deep study also builds something superficial sampling never can: the habit of sustained, difficult thinking. There will be forty working years after graduation for breadth, and the workplace itself teaches subjects faster than any seminar. University, by contrast, is the one period in life when experts are on hand to guide a student through material they could never master alone.",
        expressions: [
          { en: "time spent on extra subjects is time taken from the discipline that will appear on the transcript", zh: "花在别处的时间就是从成绩单纪律上挪走的（机会成本句）" },
          { en: "the habit of sustained, difficult thinking", zh: "持续艰难思考的习惯（深度价值句）" },
          { en: "the one period in life when experts are on hand to guide", zh: "一生中唯一有专家引路的时期（不可替代性收口）" }
        ],
        guideQ: "你论证己方时算过「时间账」吗？四十个工作年 vs 大学四年，数字让立场落地。"
      },
      "5": {
        why: "一句话结论：while 让步回收对方 + going deep on their own degree 重申立场 + since breadth can wait but guided depth cannot 用对仗句收口——把不可替代性论证压缩成一行对仗，是结论的记忆点。",
        modelPara: "In conclusion, while exploring neighbouring subjects has real value, I believe students gain more from going deep on their own degree, since breadth can wait but guided depth cannot.",
        expressions: [
          { en: "breadth can wait but guided depth cannot", zh: "广度可等待，有引路的深度不可等待（对仗收口）" },
          { en: "going deep on their own degree", zh: "深耕本专业（立场换词）" }
        ],
        guideQ: "你的结论有一句能被读者记住的对仗吗？"
      }
    }
  },
  "剑18 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "地图：中央图书馆20年前vs现在（房间式平面图）。20年前：CDs/videos/computer games角、儿童书（右上）、成人小说（左）、成人非小说（右）、阅览室（报刊杂志，左下）、中央tables & chairs、enquiry desk（右下，办证还书）；今天：storytelling events+sofas（原媒体角）、lecture room（原儿童书）、children's fiction（原成人小说位）、all reference books+computer room（原阅览室）、成人小说保留在右侧+information desk+self-service machines、café（原enquiry desk位）、中央桌椅取消、入口开放。",
    essay: "The diagrams show the floor plan of a public library as it was twenty years ago and the layout of the same building today.\n\nIt is clear that the library has shifted from a storehouse of physical media to a multi-purpose community space. It is also noticeable that most of the internal walls have gone, as separate rooms have been opened into one another.\n\nTwenty years ago the building was a grid of closed rooms: CDs, videos and computer games in one corner, children's books opposite, adult fiction and non-fiction down either side, a walled reading room for newspapers and magazines, and an enquiry desk by the entrance handling tickets and book returns.\n\nToday the partitions have largely disappeared. The media corner has become a storytelling events area with sofas, the children's collection has moved to the left wall, and all reference books now sit in the open beside a new computer room. On the right, adult fiction remains, but the enquiry desk has given way to an information desk, self-service machines and a café, while a lecture room occupies the old children's area. The central tables and chairs are the one casualty: the entrance hall now stands completely open.",
    paraTeach: {
      "2": {
        why: "地图开头：as it was twenty years ago and the layout of the same building today——was/today 两个时态分管两图，the same building 点明「同一建筑改造对比」。",
        modelPara: "The diagrams show the floor plan of a public library as it was twenty years ago and the layout of the same building today.",
        expressions: [
          { en: "the floor plan of a public library as it was twenty years ago", zh: "20年前的平面布局（过去半句）" },
          { en: "the layout of the same building today", zh: "同一建筑如今的布局（现在半句）" }
        ],
        guideQ: "改造对比图你的开头写明「同一对象+两个时点」了吗？"
      },
      "3": {
        why: "概括两句定性：句1=从「实体媒体仓库」转向「多用途社区空间」（转型定性一句话），句2=内部隔墙大多消失（房间打通）——从图中读出的结构特征，比逐屋罗列高一层。",
        modelPara: "It is clear that the library has shifted from a storehouse of physical media to a multi-purpose community space. It is also noticeable that most of the internal walls have gone, as separate rooms have been opened into one another.",
        expressions: [
          { en: "has shifted from a storehouse of physical media to a multi-purpose community space", zh: "从实体媒体仓库转向多用途社区空间（转型定性）" },
          { en: "most of the internal walls have gone", zh: "内部隔墙大多消失（结构特征句）" }
        ],
        guideQ: "你的概括句能当作这张图的一句话简介吗？能，就说明概括到位了。"
      },
      "4": {
        why: "细节一=旧布局（过去时）：a grid of closed rooms 一句总起（格子间），再按「一角-对面-两侧-左下-入口」的方位把五个功能区一句串完——旧图不展开，为下一段的变化留足笔墨。",
        modelPara: "Twenty years ago the building was a grid of closed rooms: CDs, videos and computer games in one corner, children's books opposite, adult fiction and non-fiction down either side, a walled reading room for newspapers and magazines, and an enquiry desk by the entrance handling tickets and book returns.",
        expressions: [
          { en: "a grid of closed rooms", zh: "一间间封闭房间的格子布局（总起比喻）" },
          { en: "an enquiry desk by the entrance handling tickets and book returns", zh: "入口咨询台办理借还（handling分词带功能）" }
        ],
        guideQ: "旧图你用一句总起+方位串写了吗？逐屋各写一句会把篇幅耗在不变化的部分。"
      },
      "5": {
        why: "细节二=今天（现在完成时+一般现在时混用）：partitions have largely disappeared 承接概括，四组变化各半句（媒体角→storytelling+sofas；儿童书迁移；enquiry desk→info desk+自助机+café；lecture room 占原儿童区），结尾 the one casualty 幽默点出「中央桌椅被取消」——保留与取消闭环。",
        modelPara: "Today the partitions have largely disappeared. The media corner has become a storytelling events area with sofas, the children's collection has moved to the left wall, and all reference books now sit in the open beside a new computer room. On the right, adult fiction remains, but the enquiry desk has given way to an information desk, self-service machines and a café, while a lecture room occupies the old children's area. The central tables and chairs are the one casualty: the entrance hall now stands completely open.",
        expressions: [
          { en: "has given way to an information desk, self-service machines and a café", zh: "咨询台让位于信息台、自助机与咖啡角（give way to）" },
          { en: "while a lecture room occupies the old children's area", zh: "演讲室占据了原儿童书区（occupy变化动词）" },
          { en: "The central tables and chairs are the one casualty", zh: "中央桌椅是唯一的牺牲品（the one casualty点睛）" }
        ],
        guideQ: "新图的每一处变化，你都能在旧图里指出「它的前身」吗？前身-后身一一对应是地图题的核心。"
      }
    }
  },
  "剑18 Test 3 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Across much of the world, villages are emptying as people move to cities, and the countryside is steadily losing population. I regard this as a negative development on balance, even though it is an understandable and partly beneficial response to economic change.\n\nThe benefits are real and should be admitted at the outset. Cities generate productivity: when firms and workers cluster together, jobs multiply, wages rise and services such as hospitals and universities become viable. A young farmer's daughter who moves to the city may triple her income and gain access to schooling her village could never support. Migration also relieves pressure on fragile rural environments, allowing exhausted farmland to recover. Nobody who has watched a thriving city absorb new arrivals can deny that, for many families, the move is a step up.\n\nThe costs, however, fall on those left behind and eventually on the cities themselves. Rural regions lose precisely the people a community needs to survive: the young, the skilled and the ambitious, leaving villages populated by the old, whose schools, clinics and buses close for lack of customers, which pushes yet more residents out. Meanwhile the receiving cities swell beyond their infrastructure, so that migrants who came for opportunity find themselves paying city-centre rents for rooms in crowded districts far from work. A country that lets its regions hollow out in this way pays twice: once in depopulated heartland and once in unmanageable metropolises.\n\nIn conclusion, although rural flight delivers individual opportunity that no policy should deny, the decline of the countryside brings costs that individuals cannot see and markets will not fix, and for that reason I judge it a development worth worrying about.",
    paraTeach: {
      "2": {
        why: "利弊评价题开头：句1改写（villages are emptying↔rural people are moving to cities；意象化改写），句2 negative on balance + 立刻预告让步（understandable and partly beneficial）——立场与让步同句亮出，段落分工提前剧透。",
        modelPara: "Across much of the world, villages are emptying as people move to cities, and the countryside is steadily losing population. I regard this as a negative development on balance, even though it is an understandable and partly beneficial response to economic change.",
        expressions: [
          { en: "villages are emptying as people move to cities", zh: "人口进城、村庄变空（题目的意象化改写）" },
          { en: "a negative development on balance", zh: "总体消极的发展（表态）" },
          { en: "an understandable and partly beneficial response", zh: "可理解且部分有益的应对（让步预告）" }
        ],
        guideQ: "你的表态和让步是不是同一句里先后亮出？这是利弊题开头最紧凑的写法。"
      },
      "3": {
        why: "让步段把「益」写实：聚集效应机制（公司+工人扎堆→岗位工资服务联动）→具体到一位农夫女儿的收益三倍+学校（体系1.4具体到人）→环境减压收尾。admitted at the outset 的姿态为下一段批判赢得公正性。",
        modelPara: "The benefits are real and should be admitted at the outset. Cities generate productivity: when firms and workers cluster together, jobs multiply, wages rise and services such as hospitals and universities become viable. A young farmer's daughter who moves to the city may triple her income and gain access to schooling her village could never support. Migration also relieves pressure on fragile rural environments, allowing exhausted farmland to recover. Nobody who has watched a thriving city absorb new arrivals can deny that, for many families, the move is a step up.",
        expressions: [
          { en: "when firms and workers cluster together, jobs multiply, wages rise", zh: "企业工人聚集→岗位与工资齐升（聚集效应机制）" },
          { en: "A young farmer's daughter who moves to the city may triple her income", zh: "农家女儿进城收入或翻三倍（具体到人）" },
          { en: "for many families, the move is a step up", zh: "对许多家庭而言进城就是向上走（让步收口）" }
        ],
        guideQ: "你写让步段时给了「一个具体的人」吗？抽象的「人们受益」不如一个农家女儿。"
      },
      "4": {
        why: "批判段=双重代价的链条：乡村端（流失的恰是社区生存所需的人→学校诊所公交关闭→更多人被迫离开的恶性循环）；城市端（基础设施被挤爆→为机会而来却在远郊挤房间）。costs fall on those left behind 的「谁来买单」框架让批判有伦理分量（体系1.4结果意识）。",
        modelPara: "The costs, however, fall on those left behind and eventually on the cities themselves. Rural regions lose precisely the people a community needs to survive: the young, the skilled and the ambitious, leaving villages populated by the old, whose schools, clinics and buses close for lack of customers, which pushes yet more residents out. Meanwhile the receiving cities swell beyond their infrastructure, so that migrants who came for opportunity find themselves paying city-centre rents for rooms in crowded districts far from work. A country that lets its regions hollow out in this way pays twice: once in depopulated heartland and once in unmanageable metropolises.",
        expressions: [
          { en: "lose precisely the people a community needs to survive", zh: "流失的恰是社区存续所需的人（批判主旨）" },
          { en: "schools, clinics and buses close for lack of customers, which pushes yet more residents out", zh: "设施因没客源关闭，又逼走更多人（恶性循环链）" },
          { en: "pays twice: once in depopulated heartland and once in unmanageable metropolises", zh: "双重买单：空心腹地+失控都市（收口金句）" }
        ],
        guideQ: "你的批判段指出了「代价由谁承担」吗？说清买单的人，利弊分析才有伦理落点。"
      },
      "5": {
        why: "一句话结论：although 让步收口（个体机会不容政策否定）+ costs that individuals cannot see and markets will not fix 点出批判的本质（外部性）+ worth worrying about 的克制表态收尾——不喊禁止口号，立场成熟。",
        modelPara: "In conclusion, although rural flight delivers individual opportunity that no policy should deny, the decline of the countryside brings costs that individuals cannot see and markets will not fix, and for that reason I judge it a development worth worrying about.",
        expressions: [
          { en: "costs that individuals cannot see and markets will not fix", zh: "个体看不见、市场不去修的代价（外部性一句话）" },
          { en: "a development worth worrying about", zh: "值得担忧的发展（克制的表态收尾）" }
        ],
        guideQ: "你的结尾表态是口号式的还是「点出问题本质」式的？后者高一个段位。"
      }
    }
  },
  "剑18 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    chartNote: "线图：铜/镍/锌2014年每月价格平均变化%（跨0轴）。镍波动最大：3月冲高约+8%，6月跌至约-5%，年末约+1%；铜上半年多负值、下半年回升，年末约+2%；锌年初约+3%，年中约-3%，年末约+1%。",
    essay: "The line graph shows how the average monthly prices of copper, nickel and zinc changed during 2014, measured as percentage movement from one month to the next.\n\nIt is clear that nickel was by far the most volatile of the three metals. It is also noticeable that all three ended the year with small price increases.\n\nNickel began the year by surging to a peak of 8% in March, after which its fortunes reversed dramatically: the rate of change fell steadily to a low of minus 5% in June, and although prices recovered in the autumn, the year closed with only a 1% rise. Zinc traced a milder version of the same pattern, starting at 3%, dipping below zero in mid-year and finishing, like nickel, at 1%.\n\nCopper behaved differently. Its price changes were negative for most of the first half of the year, hovering between minus 1% and minus 3%, but the second half brought a steady recovery, and copper ultimately recorded the strongest December figure of the three, at 2%. What the chart makes plain is that nickel, with a swing of thirteen percentage points between March and June, was the metal that tested investors most.",
    paraTeach: {
      "2": {
        why: "开头改写两处关键：average monthly change in prices→how the average monthly prices changed（名词组改从句）；measured as percentage movement 补单位口径——上下穿0轴的图必须写明「变化率」而非「价格」。",
        modelPara: "The line graph shows how the average monthly prices of copper, nickel and zinc changed during 2014, measured as percentage movement from one month to the next.",
        expressions: [
          { en: "how the average monthly prices of copper, nickel and zinc changed", zh: "铜镍锌月均价如何变化（名词改从句）" },
          { en: "measured as percentage movement from one month to the next", zh: "以环比百分比变化计（口径说明）" }
        ],
        guideQ: "变化率图你写明「量的是变化不是价格」了吗？口径不清是这类图的头号失分点。"
      },
      "3": {
        why: "概括两句：句1=镍最波动（by far the most volatile 最值定性），句2=三种金属年末都以小幅上涨收尾（共同终点）——「最极端的一条+三条的共性」各占一句，无数字。",
        modelPara: "It is clear that nickel was by far the most volatile of the three metals. It is also noticeable that all three ended the year with small price increases.",
        expressions: [
          { en: "by far the most volatile of the three metals", zh: "三种金属中波动最大的（最值定性）" },
          { en: "all three ended the year with small price increases", zh: "三者年末均小幅收涨（共性概括）" }
        ],
        guideQ: "三条线的「共同结局」进你的概括第二句了吗？共性往往是考官设的考点。"
      },
      "4": {
        why: "细节一=镍+锌（波动组）：镍四段式（surge到3月峰值8%→reversed dramatically→6月低点-5%→autumn回升→1%收尾）；锌用 a milder version of the same pattern 一句类比带过——详写极端、类比温和，省字法与线图分组（体系2.2）。",
        modelPara: "Nickel began the year by surging to a peak of 8% in March, after which its fortunes reversed dramatically: the rate of change fell steadily to a low of minus 5% in June, and although prices recovered in the autumn, the year closed with only a 1% rise. Zinc traced a milder version of the same pattern, starting at 3%, dipping below zero in mid-year and finishing, like nickel, at 1%.",
        expressions: [
          { en: "surging to a peak of 8% in March", zh: "3月冲至8%的峰值" },
          { en: "its fortunes reversed dramatically", zh: "走势急剧逆转（拟物化转折句）" },
          { en: "traced a milder version of the same pattern", zh: "走出同一模式的温和版（类比句）" }
        ],
        guideQ: "形状相似的两条线，你「详写一条、类比一条」了吗？"
      },
      "5": {
        why: "细节二=铜（平稳组）+收束判断：negative for most of the first half→hovering between（区间表达）→steady recovery→strongest December figure（小幅最值对比）；结尾 What the chart makes plain 是允许的图内事实评论（十三点的摆幅=可交易不可持有）——收在不越界的洞察上。",
        modelPara: "Copper behaved differently. Its price changes were negative for most of the first half of the year, hovering between minus 1% and minus 3%, but the second half brought a steady recovery, and copper ultimately recorded the strongest December figure of the three, at 2%. What the chart makes plain is that nickel, with a swing of thirteen percentage points between March and June, was the metal that tested investors most.",
        expressions: [
          { en: "hovering between minus 1% and minus 3%", zh: "在-1%与-3%之间徘徊（区间动词）" },
          { en: "recorded the strongest December figure of the three", zh: "录得三者中最强的年末值（对比收尾）" },
          { en: "the metal that tested investors most", zh: "最考验投资者的金属（点睛式收束）" }
        ],
        guideQ: "你的结尾是「图内事实的洞察」还是「个人观点」？前者加分，后者犯规。"
      }
    }
  },
  "剑18 Test 4 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "In many societies the share of the population over retirement age is climbing steadily. Although this trend brings some benefits, I believe its disadvantages are heavier, because the economic burden falls on a shrinking group of workers.\n\nThe advantages should be stated fairly. Older citizens are experienced consumers and volunteers whose spending and unpaid work support local economies; many care for grandchildren, allowing parents to work. Companies also retain their institutional memory, and entire industries, from healthcare to leisure travel, gain customers and staff. In a slow-growing economy, an older population can even steady demand, since pensioners spend reliably what younger households save.\n\nThese gains, however, are dwarfed by the arithmetic of support. Pensions and healthcare are paid for by current workers, and the ratio of workers to retirees worsens every year: in the countries where this shift is most advanced, there are already fewer than two contributors for every pensioner. The consequences follow inevitably. Either taxes and social contributions rise until the young are working largely to fund the old, or retirement ages climb and benefits shrink, breaking a promise that workers have paid into all their lives. Whole sectors feel the squeeze too, as care work drains staff from hospitals and schools, and economies with fewer young adults struggle to fill demanding jobs. Japan's decades of stagnation illustrate how heavily demographics can weigh on growth.\n\nIn conclusion, an ageing population may bring stability and valuable experience, but no efficiency gain reliably offsets a shrinking workforce supporting an ever larger retired one, and so the disadvantages outweigh the advantages.",
    paraTeach: {
      "2": {
        why: "利弊比较题开头：句1改写（the share of the population over retirement age is climbing↔proportion of elderly is increasing），句2表态 disadvantages are heavier+总理由（负担落在缩小的劳动者群体上）——把全文的「算术逻辑」放进开头第一句。",
        modelPara: "In many societies the share of the population over retirement age is climbing steadily. Although this trend brings some benefits, I believe its disadvantages are heavier, because the economic burden falls on a shrinking group of workers.",
        expressions: [
          { en: "the share of the population over retirement age is climbing steadily", zh: "退休以上人口比例持续攀升（题干改写）" },
          { en: "its disadvantages are heavier", zh: "弊更重（比较级表态）" },
          { en: "the economic burden falls on a shrinking group of workers", zh: "经济负担落在不断缩小的劳动者群体（总理由）" }
        ],
        guideQ: "你的 outweigh 题开头有没有一句话给出「为什么弊更重」的总逻辑？"
      },
      "3": {
        why: "让步段三连益处写到实处：消费与志愿劳动、隔代育儿解放父母、机构记忆+银发产业——每条都是可观察的事实而非赞美句。结尾 In a slow-growing economy 的稳定性论证把对方立场推到最强（体系1.2让步要够分量）。",
        modelPara: "The advantages should be stated fairly. Older citizens are experienced consumers and volunteers whose spending and unpaid work support local economies; many care for grandchildren, allowing parents to work. Companies also retain their institutional memory, and entire industries, from healthcare to leisure travel, gain customers and staff. In a slow-growing economy, an older population can even steady demand, since pensioners spend reliably what younger households save.",
        expressions: [
          { en: "The advantages should be stated fairly", zh: "优点应被公正陈述（让步段起手）" },
          { en: "many care for grandchildren, allowing parents to work", zh: "带孙辈让父母得以工作（具体益处）" },
          { en: "pensioners spend reliably what younger households save", zh: "老人稳定消费年轻人储蓄的钱（机制化让步）" }
        ],
        guideQ: "你给对方的三个优点都是「可观察的事实」吗？空泛的「老人有智慧」撑不起让步段。"
      },
      "4": {
        why: "批判段=算术碾压：抚养比数字（不到两个劳动者养一个退休者）→两条必然路径二选一（加税压垮年轻人 vs 推迟退休毁承诺）→行业挤压（护理抽空医院学校）→日本停滞的国家级例证——用「不可避免」的推导链让弊的分量无法反驳（体系1.4）。",
        modelPara: "These gains, however, are dwarfed by the arithmetic of support. Pensions and healthcare are paid for by current workers, and the ratio of workers to retirees worsens every year: in the countries where this shift is most advanced, there are already fewer than two contributors for every pensioner. The consequences follow inevitably. Either taxes and social contributions rise until the young are working largely to fund the old, or retirement ages climb and benefits shrink, breaking a promise that workers have paid into all their lives. Whole sectors feel the squeeze too, as care work drains staff from hospitals and schools, and economies with fewer young adults struggle to fill demanding jobs. Japan's decades of stagnation illustrate how heavily demographics can weigh on growth.",
        expressions: [
          { en: "dwarfed by the arithmetic of support", zh: "在养老的算术面前相形见绌（批判主旨句）" },
          { en: "fewer than two contributors for every pensioner", zh: "每个领取者对应不到两个缴费者（抚养比数字）" },
          { en: "breaking a promise that workers have paid into all their lives", zh: "毁掉劳动者终身缴费换来的承诺（代价具象化）" }
        ],
        guideQ: "你的「弊」有没有推演出「必然的二选一困境」？比罗列三条坏处有力得多。"
      },
      "5": {
        why: "一句话结论：让步短语（stability and valuable experience）+ no efficiency gain reliably offsets 的否定式比较收口——用「没有任何效率提升能可靠抵消」这种全称否定把 outweigh 问题彻底钉死。",
        modelPara: "In conclusion, an ageing population may bring stability and valuable experience, but no efficiency gain reliably offsets a shrinking workforce supporting an ever larger retired one, and so the disadvantages outweigh the advantages.",
        expressions: [
          { en: "no efficiency gain reliably offsets", zh: "没有任何效率提升能可靠抵消（全称否定收口）" },
          { en: "a shrinking workforce supporting an ever larger retired one", zh: "缩水的劳动者供养膨胀的退休群体（对仗收尾）" }
        ],
        guideQ: "你的结论敢用一次「全称否定」（no...can...）吗？用得准就是利弊题的最强收尾。"
      }
    }
  },
  "剑19 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "线图（6条线，2000/2005/2010/2015/2020五点）：film club 64→62→60→64→66（全程第一）；table tennis 16→20→20→35.5→54（暴涨，2015超amateur dramatics与martial arts）；martial arts 36→32→38→34→36（窄幅波动）；amateur dramatics 25.5→28→20→14→6（持续下滑）；musical performances 2000-2005为0，2010年12→16→18。注意：原图只有6种活动，没有yoga/pilates。",
    essay: "The line graph shows how many people took part in six different activities at one social centre in Melbourne between 2000 and 2020.\n\nIt is clear that the film club remained the most popular activity throughout. It is also noticeable that table tennis, once one of the smaller offerings, grew faster than any other activity, while amateur dramatics declined sharply.\n\nFilm club attendance was remarkably stable: it began and ended the period at 64 and 66 participants respectively, after a slight dip to 60 in 2010. Table tennis started with just 16 participants but climbed continuously, overtaking amateur dramatics and martial arts around 2015 on its way to 54 by 2020. Musical performances, which did not exist until after 2005, attracted 12 participants by 2010 and 18 by 2020.\n\nThe remaining activity went into steep decline: amateur dramatics fell steadily from 25 participants in 2000 to only 6 in 2020. Martial arts, by contrast, simply fluctuated within a narrow band, beginning and ending the period at 36 after peaking at 38 in 2010.",
    paraTeach: {
      "2": {
        why: "开头改写：gives information on the numbers of participants→shows how many people took part in six different activities（名词组改从句）；六条线在开头点名（six），与图一致。",
        modelPara: "The line graph shows how many people took part in six different activities at one social centre in Melbourne between 2000 and 2020.",
        expressions: [
          { en: "how many people took part in six different activities", zh: "多少人参加六种活动（participate动词化改写）" },
          { en: "at one social centre in Melbourne", zh: "墨尔本某社区活动中心（对象+地点保留）" }
        ],
        guideQ: "线有几条，你的开头就数到几了吗？"
      },
      "3": {
        why: "概括两句：句1=film club 始终第一（稳），句2=两条动态线的故事——table tennis 从小项目暴涨、amateur dramatics 锐减。一稳一涨一跌，六条线的命运一句话分完。",
        modelPara: "It is clear that the film club remained the most popular activity throughout. It is also noticeable that table tennis, once one of the smaller offerings, grew faster than any other activity, while amateur dramatics declined sharply.",
        expressions: [
          { en: "remained the most popular activity throughout", zh: "始终最受欢迎（稳定项头条）" },
          { en: "once one of the smaller offerings, grew faster than any other", zh: "昔日小项目、如今增速第一（反差句）" }
        ],
        guideQ: "暴涨的是 table tennis——你的概括押对宝了吗？多线图最忌把「看着眼熟」的线写成主角。"
      },
      "4": {
        why: "细节一=film club（稳）+table tennis（涨）+musical performances（新）：remarkably stable/dip/climbed continuously/overtaking 串起三条线；「2015年前后连超两项」的交叉点与「2005年前不存在」的出生点都点到位（体系2.3）。",
        modelPara: "Film club attendance was remarkably stable: it began and ended the period at 64 and 66 participants respectively, after a slight dip to 60 in 2010. Table tennis started with just 16 participants but climbed continuously, overtaking amateur dramatics and martial arts around 2015 on its way to 54 by 2020. Musical performances, which did not exist until after 2005, attracted 12 participants by 2010 and 18 by 2020.",
        expressions: [
          { en: "began and ended the period at 64 and 66 participants respectively", zh: "期初期末分别为64和66（respectively配对）" },
          { en: "overtaking amateur dramatics and martial arts around 2015", zh: "约2015年连超两项（交叉点）" },
          { en: "which did not exist until after 2005", zh: "2005年前尚不存在（出生点从句）" }
        ],
        guideQ: "「从零开始」的线，你交代它的出生点了 吗？0是它最重要的数字。"
      },
      "5": {
        why: "细节二=余下两条：amateur dramatics 稳步下滑（25→6，steep decline）；martial arts 窄幅波动（首尾都是36、2010峰值38）——一条写趋势、一条写波动，By contrast 衔接；首尾同值的「回到原点」用 beginning and ending... at 36 一句收。",
        modelPara: "The remaining activity went into steep decline: amateur dramatics fell steadily from 25 participants in 2000 to only 6 in 2020. Martial arts, by contrast, simply fluctuated within a narrow band, beginning and ending the period at 36 after peaking at 38 in 2010.",
        expressions: [
          { en: "went into steep decline", zh: "急剧衰退（趋势主旨句）" },
          { en: "fluctuated within a narrow band", zh: "窄幅波动（波动型标准表达）" },
          { en: "beginning and ending the period at 36", zh: "期初期末同为36（回到原点）" }
        ],
        guideQ: "首尾相同的线（回到原点），你用一句话框住了吗？"
      }
    }
  },
  "剑19 Test 1 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Whether competition or cooperation deserves more encouragement is a question that touches schools, workplaces and daily life alike. While competition can raise short-term performance, I believe we should put cooperation first, because almost every complex achievement of modern life is a team product.\n\nAdmittedly, competition has its uses. Rivals push effort upwards: sales teams given league tables work harder, and pupils who compete for places at top universities often study with remarkable discipline. Competition also selects for excellence, since tournaments and job markets identify the strongest performers faster than consensus ever could. In simple, measurable tasks with clear winners, these effects are genuine and valuable.\n\nMost modern work, however, does not resemble a sprint with a finish line. Surgeons, pilots and software engineers succeed by coordinating with others and by being able to admit mistakes quickly, and a hospital whose departments compete for budget learns to hide information precisely when sharing it saves lives. Research on innovation points the same way: the breakthroughs we most admire, from the internet to COVID vaccines, came from laboratories that shared data across borders. A culture of cooperation also scales better than a culture of rivalry, because it produces trust, and trust lowers the cost of every future project.\n\nIn conclusion, competition still has a place where performance is individual and measurable, but since the hardest problems of our societies are solved by groups rather than heroes, we should be teaching cooperation as the primary skill and treating competition as a useful supplement rather than an ideal.",
    paraTeach: {
      "2": {
        why: "讨论题开头：句1用「问题式」改写（Whether... deserves more encouragement），一句框住题目的三个场景（schools/workplaces/daily life）；句2让步（competition raises short-term performance）+立场（cooperation first）+总理由（现代成就都是团队产品）——总理由就是全文主轴。",
        modelPara: "Whether competition or cooperation deserves more encouragement is a question that touches schools, workplaces and daily life alike. While competition can raise short-term performance, I believe we should put cooperation first, because almost every complex achievement of modern life is a team product.",
        expressions: [
          { en: "a question that touches schools, workplaces and daily life alike", zh: "一个问题牵动学校职场与日常（题干三场景合并）" },
          { en: "While competition can raise short-term performance", zh: "尽管竞争能提升短期表现（让步限定）" },
          { en: "almost every complex achievement of modern life is a team product", zh: "现代复杂成就皆是团队产物（立场主轴）" }
        ],
        guideQ: "你的立场句后面那句总理由，能当全文的目录吗？"
      },
      "3": {
        why: "A方段写足对方三张牌：绩效上推（league tables/名校竞争的自律）+筛选功能（tournaments/job markets 识别强者）+适用条件（simple, measurable tasks with clear winners）——第三张牌「适用条件」最关键，为我方反驳精确画出靶子（体系1.2转述要像转述）。",
        modelPara: "Admittedly, competition has its uses. Rivals push effort upwards: sales teams given league tables work harder, and pupils who compete for places at top universities often study with remarkable discipline. Competition also selects for excellence, since tournaments and job markets identify the strongest performers faster than consensus ever could. In simple, measurable tasks with clear winners, these effects are genuine and valuable.",
        expressions: [
          { en: "Rivals push effort upwards", zh: "对手把努力往上推（机制短句）" },
          { en: "identify the strongest performers faster than consensus ever could", zh: "比共识更快识别出最强者（比较结构）" },
          { en: "In simple, measurable tasks with clear winners", zh: "在简单可测、赢家明确的任务中（限定条件收口）" }
        ],
        guideQ: "你转述对方观点时有没有给出「它在什么条件下成立」？这为你的反驳画出准确靶心。"
      },
      "4": {
        why: "我方段三连证据：职业协作本质（外科/飞行员/工程师+医院部门竞争的致命反例）→创新史（互联网与疫苗的跨国数据共享）→社会尺度（合作产信任、信任降成本）——「trust lowers the cost of every future project」是机制化收口，比喊口号有力（体系1.4）。",
        modelPara: "Most modern work, however, does not resemble a sprint with a finish line. Surgeons, pilots and software engineers succeed by coordinating with others and by being able to admit mistakes quickly, and a hospital whose departments compete for budget learns to hide information precisely when sharing it saves lives. Research on innovation points the same way: the breakthroughs we most admire, from the internet to COVID vaccines, came from laboratories that shared data across borders. A culture of cooperation also scales better than a culture of rivalry, because it produces trust, and trust lowers the cost of every future project.",
        expressions: [
          { en: "does not resemble a sprint with a finish line", zh: "不像一场有终点线的冲刺（反喻主题句）" },
          { en: "learns to hide information precisely when sharing it saves lives", zh: "恰在该共享救命信息时学会了隐藏（反例狠而准）" },
          { en: "trust lowers the cost of every future project", zh: "信任降低每个未来项目的成本（机制化收口）" }
        ],
        guideQ: "你的反驳有没有一个「对方逻辑走偏后的具体惨案」？医院部门竞争的例子就是这种。"
      },
      "5": {
        why: "一句话结论：competition has a place where... 承认对方适用域 + 主张把合作当 primary skill、竞争当 supplement——「主从关系」的定位式结论，比单纯重申更聪明。",
        modelPara: "In conclusion, competition still has a place where performance is individual and measurable, but since the hardest problems of our societies are solved by groups rather than heroes, we should be teaching cooperation as the primary skill and treating competition as a useful supplement rather than an ideal.",
        expressions: [
          { en: "solved by groups rather than heroes", zh: "由群体而非英雄解决（对仗）" },
          { en: "as a useful supplement rather than an ideal", zh: "是有用的补充而非理想本身（定位式收尾）" }
        ],
        guideQ: "你的结论给两个概念「定了位次」吗？主从定位让讨论题结尾格外清晰。"
      }
    }
  },
  "剑19 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "地图：Porth Harbour 2000 vs today。2000：北 marina（私人游艇）+南 dock（渔船），showers&toilets、两个car park、passenger ferries、lifeboat、public beach（东北）、Castle（disused，废弃古堡）+castle旁public beach、main road。今天：渔船与游艇码头位置互换（渔船迁北、marina迁南），docks之间新增cafés & shops，南侧新增第二处showers & toilats，Castle→Hotel，古堡旁public beach→private beach (for the hotel)；ferry/lifeboat/停车场/东北public beach不变。",
    essay: "The maps show Porth Harbour as it was in 2000 and the same harbour today.\n\nIt is clear that the harbour has been reoriented towards tourism and leisure. It is also noticeable that several new visitor facilities have appeared, while the transport features have mostly changed places rather than disappeared.\n\nThe most striking swap concerns the two docks. In 2000, private yachts were berthed in the northern marina while fishing boats used the southern dock; today the positions are reversed, with the fishing fleet to the north and the marina to the south. Cafés and shops have been built between the two, and a second block of showers and toilets now serves the southern side.\n\nThe other transformation is the conversion of the disused castle into a hotel, whose guests enjoy the former public beach as a private one. What has not changed is just as clear: the passenger ferries, the lifeboat station, both car parks, the main road and the north-east public beach all remain exactly where they were.",
    paraTeach: {
      "2": {
        why: "地图开头：as it was in 2000 and the same harbour today——was/today 时态分工，the same harbour 点明同一地点两时点，一句话完成。",
        modelPara: "The maps show Porth Harbour as it was in 2000 and the same harbour today.",
        expressions: [
          { en: "as it was in 2000", zh: "2000年时的样子（过去半句）" },
          { en: "the same harbour today", zh: "今天的同一海港（现在半句）" }
        ],
        guideQ: "两图对比题的开头你能压缩到一句话吗？"
      },
      "3": {
        why: "概括两句定性：句1=海港转向旅游休闲（性质定位），句2=新增设施多、但运输要素多是「换位」而非消失——「换位不消失」是这张图最特别的结构，概括就点它。",
        modelPara: "It is clear that the harbour has been reoriented towards tourism and leisure. It is also noticeable that several new visitor facilities have appeared, while the transport features have mostly changed places rather than disappeared.",
        expressions: [
          { en: "reoriented towards tourism and leisure", zh: "重新定位为旅游休闲（定性句）" },
          { en: "changed places rather than disappeared", zh: "换了位置而非消失（换位特征句）" }
        ],
        guideQ: "这张图里「消失」的东西多吗？还是只是「搬家」？读准这一点，全篇的结构就定了。"
      },
      "4": {
        why: "细节一=码头大换位：2000年布局一句（北marina游艇+南dock渔船），today the positions are reversed 一句反转；新增的 cafés & shops 与第二处 showers & toilets 补在换位之后——「对照一句+反转一句+新增两句」。",
        modelPara: "The most striking swap concerns the two docks. In 2000, private yachts were berthed in the northern marina while fishing boats used the southern dock; today the positions are reversed, with the fishing fleet to the north and the marina to the south. Cafés and shops have been built between the two, and a second block of showers and toilets now serves the southern side.",
        expressions: [
          { en: "The most striking swap concerns the two docks", zh: "最醒目的换位是两座码头（主旨句）" },
          { en: "today the positions are reversed", zh: "如今位置互换（反转句）" },
          { en: "a second block of showers and toilets now serves the southern side", zh: "南侧新增第二处盥洗室（serves点功能）" }
        ],
        guideQ: "「A 到了 B 的位置、B 到了 A 的位置」，你用 positions are reversed 一句收拢了吗？"
      },
      "5": {
        why: "细节二=旅游开发+保留项：disused castle→hotel（改用途）、public beach→private beach for hotel guests（改性质）；What has not changed is just as clear 引出五项不变（ferry/lifeboat/停车场/main road/东北海滩）——保留项成段，首尾闭合。",
        modelPara: "The other transformation is the conversion of the disused castle into a hotel, whose guests enjoy the former public beach as a private one. What has not changed is just as clear: the passenger ferries, the lifeboat station, both car parks, the main road and the north-east public beach all remain exactly where they were.",
        expressions: [
          { en: "the conversion of the disused castle into a hotel", zh: "废弃古堡改建为酒店（conversion into改用途）" },
          { en: "the former public beach as a private one", zh: "原公共海滩变为私人海滩（as性质转换）" },
          { en: "all remain exactly where they were", zh: "全部原地保留（保留项收尾）" }
        ],
        guideQ: "不变项你单独成句收尾了吗？「变化的对照面」让地图答案更完整。"
      }
    }
  },
  "剑19 Test 2 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Some countries are again debating a shorter working week and a longer weekend. I disagree with the idea that this should be introduced across the board, because the evidence suggests it brings real costs for output and flexibility that many economies cannot currently absorb.\n\nThe attraction of the proposal is easy to respect. Workers exhausted by five-day schedules often produce their best ideas in protected leisure time, and studies of trial four-day weeks report lower burnout and, in some offices, no loss of output at all. A longer weekend would also give people time that money struggles to buy: time for children, for elderly parents and for the voluntary work that holds communities together. These are not trivial goods, and any society able to afford them should think hard about doing so.\n\nThe difficulty is that most cannot afford them yet. Output that simply disappears is output that must be replaced, either by hiring more staff, which small firms with thin margins cannot do, or by squeezing the same work into fewer hours, which usually means more pressure rather than less. Not every job is compressible: a nurse, a train driver or a shop assistant cannot finish the same caring, driving or selling in four days. There is also a hidden inequality in the idea, because the professionals who would gain a long weekend are already the ones who enjoy flexible schedules, while shift workers on lower wages would see pay cut to match hours reduced.\n\nIn conclusion, although a shorter working week is an appealing vision and may suit certain well-paid offices, introducing it universally would shift costs onto precisely the workers and businesses least able to carry them, and for that reason I do not support it at present.",
    paraTeach: {
      "2": {
        why: "观点题开头：句1改写（debating a shorter working week——把 should 句改写成「正在被辩论」的时事情境），句2 disagree + across the board 限定 + 总理由（产出与灵活性的代价）——「先限定范围再反对」让反对更难被驳倒。",
        modelPara: "Some countries are again debating a shorter working week and a longer weekend. I disagree with the idea that this should be introduced across the board, because the evidence suggests it brings real costs for output and flexibility that many economies cannot currently absorb.",
        expressions: [
          { en: "introduced across the board", zh: "全面推行（范围限定词）" },
          { en: "real costs for output and flexibility that many economies cannot currently absorb", zh: "许多经济体目前无法吸收的产出与灵活性代价（总理由）" }
        ],
        guideQ: "你反对一个主张时，反对的是「它本身」还是「它全面推行」？后者 precision 更高。"
      },
      "3": {
        why: "让步段写满对方三大吸引力：试验数据（four-day weeks 低倦怠不掉产出）+无法用钱买的时间（孩子/老人/社区志愿）+收尾升华（not trivial goods）——对方立场写到最动人，下一段的「但是」才有千钧之力。",
        modelPara: "The attraction of the proposal is easy to respect. Workers exhausted by five-day schedules often produce their best ideas in protected leisure time, and studies of trial four-day weeks report lower burnout and, in some offices, no loss of output at all. A longer weekend would also give people time that money struggles to buy: time for children, for elderly parents and for the voluntary work that holds communities together. These are not trivial goods, and any society able to afford them should think hard about doing so.",
        expressions: [
          { en: "time that money struggles to buy", zh: "金钱难以买到的时光（点题短语）" },
          { en: "the voluntary work that holds communities together", zh: "维系社区的志愿工作" },
          { en: "any society able to afford them should think hard about doing so", zh: "负担得起的社会应认真考虑（伏笔句：关键词 afford）" }
        ],
        guideQ: "你的让步段有没有埋一个「afford」式的伏笔词，让下一段的转折顺理成章？"
      },
      "4": {
        why: "批判段三连击：产出消失必须被替代（小公司雇不起/压缩工时反增压力）→不可压缩职业（护士/司机/店员——具体职业名词排比）→隐藏不平等（灵活者得利、轮班者减薪）——「谁买单」的分配分析是本段杀器，比单纯喊「效率低」高一档。",
        modelPara: "The difficulty is that most cannot afford them yet. Output that simply disappears is output that must be replaced, either by hiring more staff, which small firms with thin margins cannot do, or by squeezing the same work into fewer hours, which usually means more pressure rather than less. Not every job is compressible: a nurse, a train driver or a shop assistant cannot finish the same caring, driving or selling in four days. There is also a hidden inequality in the idea, because the professionals who would gain a long weekend are already the ones who enjoy flexible schedules, while shift workers on lower wages would see pay cut to match hours reduced.",
        expressions: [
          { en: "Output that simply disappears is output that must be replaced", zh: "消失的产出必须被替代（顶针式主题句）" },
          { en: "Not every job is compressible", zh: "并非所有工作都可压缩（判据句）" },
          { en: "a hidden inequality in the idea", zh: "主张中隐藏的不平等（分配视角）" }
        ],
        guideQ: "你的批判段问过「谁来买单」吗？分配分析让利弊讨论立刻深刻。"
      },
      "5": {
        why: "一句话结论：appealing vision 承认愿景 + shift costs onto those least able to carry them 回收分配论 + at present 时间限定收尾——反对但不永久关门，立场老练。",
        modelPara: "In conclusion, although a shorter working week is an appealing vision and may suit certain well-paid offices, introducing it universally would shift costs onto precisely the workers and businesses least able to carry them, and for that reason I do not support it at present.",
        expressions: [
          { en: "an appealing vision", zh: "迷人的愿景（让步回收）" },
          { en: "I do not support it at present", zh: "目前不支持（时间限定收尾）" }
        ],
        guideQ: "你的反对结论加了「at present / in most cases」式的安全阀吗？"
      }
    }
  },
  "剑19 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "循环流程图：Biofuel production — how ethanol is made。环节：Energy（sunlight + carbon dioxide）→ Plants and trees grow → Harvesting → Pre-processing → Cellulose → Processing → Ethanol → 车辆使用（Carbon dioxide 排出）→ 回到植物吸收，闭环。自然环节（生长/发酵）主动语态，工业环节（harvesting/pre-processing/processing）被动语态。",
    essay: "The diagram illustrates how ethanol, a biofuel, is produced from trees and crops and then used to power vehicles.\n\nIt is clear that the process forms a closed cycle, beginning with the growing of plants and ending with carbon dioxide returning to the air, where the growing plants take it up again. It is also noticeable that the whole loop is driven by energy from sunlight.\n\nThe cycle starts as trees and plants absorb sunlight and carbon dioxide while they grow. Once harvested, the crop is taken for pre-processing, where it is reduced to cellulose; this cellulose is then processed into sugars and fermented into ethanol.\n\nThe fuel's journey completes the loop. The ethanol is sold as a biofuel and burned in vehicles, and the carbon dioxide their engines release escapes back into the atmosphere. There it is once again available for the growing plants to absorb, allowing the cycle that produced the fuel to begin anew.",
    paraTeach: {
      "2": {
        why: "循环流程图开头：produced from trees and crops and then used to power vehicles——「生产+使用」两大半各占半句，循环图的开头必须交代它是环。",
        modelPara: "The diagram illustrates how ethanol, a biofuel, is produced from trees and crops and then used to power vehicles.",
        expressions: [
          { en: "ethanol, a biofuel, is produced from trees and crops", zh: "乙醇（生物燃料）由树木作物制成（同位语解释术语）" },
          { en: "and then used to power vehicles", zh: "再用于驱动车辆（使用半环）" }
        ],
        guideQ: "循环图你的开头就把「生产与使用」两大半框出来了吗？"
      },
      "3": {
        why: "概括=闭环结构+能量来源：句1 closed cycle，首尾相接（CO2 回到植物）；句2 整个循环由阳光驱动——两张图合看才发现的「能量主线」是第二层特征。",
        modelPara: "It is clear that the process forms a closed cycle, beginning with the growing of plants and ending with carbon dioxide returning to the air, where the growing plants take it up again. It is also noticeable that the whole loop is driven by energy from sunlight.",
        expressions: [
          { en: "forms a closed cycle", zh: "构成闭环（循环图定性词）" },
          { en: "the whole loop is driven by energy from sunlight", zh: "整个循环由阳光驱动（能量主线）" }
        ],
        guideQ: "图上标注的「Energy (sunlight + carbon dioxide)」你读出来了吗？它是概括的第二句。"
      },
      "4": {
        why: "细节一=生产半环：absorb→harvested→pre-processing→reduced to cellulose→processed into sugars→fermented into ethanol；自然环节主动（trees absorb / plants grow），工业环节被动（is reduced/is processed/is fermented）——语态切换本身就是对图的理解。",
        modelPara: "The cycle starts as trees and plants absorb sunlight and carbon dioxide while they grow. Once harvested, the crop is taken for pre-processing, where it is reduced to cellulose; this cellulose is then processed into sugars and fermented into ethanol.",
        expressions: [
          { en: "trees and plants absorb sunlight and carbon dioxide while they grow", zh: "植物生长时吸收阳光与二氧化碳（主动语态）" },
          { en: "the crop is taken for pre-processing", zh: "作物送去预处理（工业环节被动）" },
          { en: "fermented into ethanol", zh: "发酵成乙醇（关键转化）" }
        ],
        guideQ: "自然环节主动、工业环节被动——你的语态跟着图的性质切换了吗？"
      },
      "5": {
        why: "细节二=使用半环+合环：sold as a biofuel→burned in vehicles→CO2 released→available for plants again；The fuel's journey completes the loop 点段旨；allowing the cycle... to begin anew 把环正式合拢，与概括段 closed cycle 首尾呼应。",
        modelPara: "The fuel's journey completes the loop. The ethanol is sold as a biofuel and burned in vehicles, and the carbon dioxide their engines release escapes back into the atmosphere. There it is once again available for the growing plants to absorb, allowing the cycle that produced the fuel to begin anew.",
        expressions: [
          { en: "completes the loop", zh: "完成闭环（循环图点睛句）" },
          { en: "escapes back into the atmosphere", zh: "排回大气（back呼应闭环）" },
          { en: "allowing the cycle that produced the fuel to begin anew", zh: "使产生燃料的循环重新开始（分词收尾合环）" }
        ],
        guideQ: "你的最后一步接回第一步了吗？循环图的结尾必须合环。"
      }
    }
  },
  "剑19 Test 3 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "It is often said that everyone, including the young, should be saving money for the future. I agree with this advice in principle, but I would apply it with some flexibility, since the capacity to save is not evenly distributed and saving should never come at the cost of basic development.\n\nThe case for saving rests on the power of early habits. Money set aside in one's twenties benefits from decades of compound growth, so a modest sum saved young is worth far more than a larger sum saved late. Savings also transform how people handle shocks: a family with three months of expenses in the bank can survive a job loss without borrowing at ruinous rates, whereas a family with nothing is one misfortune away from debt. On top of this, the habit itself matters. People who learn to live slightly below their means as teenagers find it far easier to manage a salary, a mortgage and eventually a pension than those who learn at forty.\n\nThat said, the advice needs two qualifications. First, saving is a luxury of income: the many young adults whose wages barely cover rent and transport cannot be blamed for saving nothing, and lectures about thrift only add insult to injury. Second, some investments in oneself outperform any bank account. The graduate who spends her spare cash on a professional qualification, or the young worker who moves cities for a better job market, is using that money in the most productive way available, and deferring such spending to build savings would be poor arithmetic.\n\nIn conclusion, saving from an early age is sound advice for those who can afford it, but it should be taught as a habit to grow into rather than demanded of those whose incomes and opportunities justify spending.",
    paraTeach: {
      "2": {
        why: "观点题（extent型）开头：句1改写引出建议（It is often said that...），句2 agree in principle + with some flexibility 两个限定词把立场精确化——先总表态再划边界，extent 题的教科书开头。",
        modelPara: "It is often said that everyone, including the young, should be saving money for the future. I agree with this advice in principle, but I would apply it with some flexibility, since the capacity to save is not evenly distributed and saving should never come at the cost of basic development.",
        expressions: [
          { en: "I agree with this advice in principle, but I would apply it with some flexibility", zh: "原则上同意，但应用时留有弹性（extent双段表态）" },
          { en: "the capacity to save is not evenly distributed", zh: "储蓄能力分布不均（限定理由一）" }
        ],
        guideQ: "extent 题你的表态是不是「总态度+边界」两层？只有一层算不上回答了 to what extent。"
      },
      "3": {
        why: "理由段三层递进：复利算术（二十岁存的钱数十年增值）→抗风险（三个月备用金 vs 借高息债的具体对比）→习惯本身（teenagers 学会的量入为出受用终身）——算术、风险、习惯，从物到事到人层层落地（体系1.4）。",
        modelPara: "The case for saving rests on the power of early habits. Money set aside in one's twenties benefits from decades of compound growth, so a modest sum saved young is worth far more than a larger sum saved late. Savings also transform how people handle shocks: a family with three months of expenses in the bank can survive a job loss without borrowing at ruinous rates, whereas a family with nothing is one misfortune away from debt. On top of this, the habit itself matters. People who learn to live slightly below their means as teenagers find it far easier to manage a salary, a mortgage and eventually a pension than those who learn at forty.",
        expressions: [
          { en: "benefits from decades of compound growth", zh: "享受数十年的复利增长（算术层）" },
          { en: "one misfortune away from debt", zh: "距负债只差一次厄运（风险层，具象表达）" },
          { en: "live slightly below their means", zh: "量入为出、略低于收入生活（习惯层词伙）" }
        ],
        guideQ: "你的理由段有没有「算术、风险、习惯」这样从物到人的层次？平铺三条同级理由是7分写法。"
      },
      "4": {
        why: "限定段两条边界：储蓄是收入的奢侈品（低收入年轻人无从指责，说教只添侮辱）+自我投资跑赢银行账户（读证/搬城的例子，defer such spending is poor arithmetic 用对方的算术语言反将一军）——两条限定正好呼应开头 flexibility（体系1.4）。",
        modelPara: "That said, the advice needs two qualifications. First, saving is a luxury of income: the many young adults whose wages barely cover rent and transport cannot be blamed for saving nothing, and lectures about thrift only add insult to injury. Second, some investments in oneself outperform any bank account. The graduate who spends her spare cash on a professional qualification, or the young worker who moves cities for a better job market, is using that money in the most productive way available, and deferring such spending to build savings would be poor arithmetic.",
        expressions: [
          { en: "saving is a luxury of income", zh: "储蓄是收入带来的奢侈（精辟概括句）" },
          { en: "lectures about thrift only add insult to injury", zh: "节俭说教只是往伤口撒盐" },
          { en: "deferring such spending to build savings would be poor arithmetic", zh: "为储蓄推迟这种花费是糟糕的算术（呼应句）" }
        ],
        guideQ: "你划的边界有没有在结尾被「回收」？qualifications 若不呼应开头表态，结构就散了。"
      },
      "5": {
        why: "一句话结论：sound advice for those who can afford it 收同意段 + a habit to grow into rather than demanded of those... 收限定段——用 rather than 对仗把「同意+限定」压进一行。",
        modelPara: "In conclusion, saving from an early age is sound advice for those who can afford it, but it should be taught as a habit to grow into rather than demanded of those whose incomes and opportunities justify spending.",
        expressions: [
          { en: "a habit to grow into rather than demanded of those whose incomes and opportunities justify spending", zh: "应渐次养成的习惯，而非对有理由花钱者的苛求（对仗收尾）" },
          { en: "sound advice for those who can afford it", zh: "对负担得起的人是好建议（同意段回收）" }
        ],
        guideQ: "extent 题的结论你把「同意的部分」和「保留的部分」各用半句收齐了吗？"
      }
    }
  },
  "剑19 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "饼图+横条图：饼图=舞蹈课地点——private studios 48%、school halls (after-school) 24%、community halls & other 18%、college-based studios 10%；横条图=Types of dance classes (by age group)——Ballet：11岁以下约600、11-16岁约300；Tap：约450/430；Modern：约300/510。三舞种总量相近（810-900），偏好相反：小学生偏爱ballet、中学生偏爱modern。",
    essay: "The pie chart shows where young people in a town in Australia attend dance classes, and the bar chart shows how many students take each type of dance, broken down by age group.\n\nIt is clear that private studios are the most popular venues by a wide margin. It is also noticeable that the two age groups have almost opposite tastes: ballet dominates among the under-11s, modern dance among the 11-to-16s.\n\nJust under half of all young dancers, 48%, learn in private studios, with after-school classes in school halls accounting for a further 24%. Community halls and other venues took 18%, and college-based studios the remaining 10%.\n\nBallet is the largest class type overall, with around 600 dancers under 11 compared with 300 aged 11 to 16. Tap is the most evenly split, at roughly 450 and 430, whereas modern dance is the mirror image of ballet: about 510 teenagers study it, but only 300 younger children do. Taken together, the two charts show young dancers following tradition in the early years and moving to modern styles as they grow older.",
    paraTeach: {
      "2": {
        why: "双图开头一句一图：where... attend dance classes（饼图问题）+ how many students take each type, broken down by age group（条图问题+年龄组维度）——broken down by age group 一词把条图的特殊结构点出。",
        modelPara: "The pie chart shows where young people in a town in Australia attend dance classes, and the bar chart shows how many students take each type of dance, broken down by age group.",
        expressions: [
          { en: "shows where young people in a town in Australia attend dance classes", zh: "展示澳大利亚某镇年轻人在哪上课（地点问题）" },
          { en: "broken down by age group", zh: "按年龄组细分（条图结构）" }
        ],
        guideQ: "条图被分成两组时，你在开头就点明这个结构了吗？"
      },
      "3": {
        why: "概括一句一图：饼图=private studios 遥遥领先（by a wide margin）；条图=两个年龄组口味几乎相反（ballet 主导小学生、modern 主导中学生）——第二句把条图的「镜像结构」说破，是本图真正的一眼结论。",
        modelPara: "It is clear that private studios are the most popular venues by a wide margin. It is also noticeable that the two age groups have almost opposite tastes: ballet dominates among the under-11s, modern dance among the 11-to-16s.",
        expressions: [
          { en: "the most popular venues by a wide margin", zh: "以巨大差距领先的场地（饼图最值）" },
          { en: "the two age groups have almost opposite tastes", zh: "两个年龄组口味几乎相反（镜像结构句）" }
        ],
        guideQ: "条图的「分组对比结构」（谁爱ballet、谁爱modern）你读出来了吗？只报各组人数就是流水账。"
      },
      "4": {
        why: "细节一=饼图：48% 同位语补数（Just under half... 48%），with 分词带出 24%，remaining 10% 收尾凑齐 100%——大项同位语、次项 with、小项 remaining，三步把四块份额收完（体系2.3）。",
        modelPara: "Just under half of all young dancers, 48%, learn in private studios, with after-school classes in school halls accounting for a further 24%. Community halls and other venues took 18%, and college-based studios the remaining 10%.",
        expressions: [
          { en: "Just under half of all young dancers, 48%", zh: "略低于半数，48%（同位语补数）" },
          { en: "accounting for a further 24%", zh: "占另外24%（with+分词）" },
          { en: "the remaining 10%", zh: "其余10%（凑齐100%收尾）" }
        ],
        guideQ: "饼图份额加起来是100%，你用 remaining 把「其余」收完了吗？"
      },
      "5": {
        why: "细节二=条图：ballet 最大档（600 vs 300）立标杆→tap 最平均（450/430）→modern 是 ballet 的镜像（510 vs 300），mirror image 一词点破对称结构；Taken together 合读句收尾（小时候传统、长大现代）。",
        modelPara: "Ballet is the largest class type overall, with around 600 dancers under 11 compared with 300 aged 11 to 16. Tap is the most evenly split, at roughly 450 and 430, whereas modern dance is the mirror image of ballet: about 510 teenagers study it, but only 300 younger children do. Taken together, the two charts show young dancers following tradition in the early years and moving to modern styles as they grow older.",
        expressions: [
          { en: "with around 600 dancers under 11 compared with 300 aged 11 to 16", zh: "11岁以下约600人、对比11-16岁300人（compared with）" },
          { en: "modern dance is the mirror image of ballet", zh: "现代舞与芭蕾互为镜像（对称点睛）" },
          { en: "Taken together, the two charts show", zh: "两图合看表明（双图合读句式）" }
        ],
        guideQ: "「镜像」这种结构特征，你用一个词点破了吗？点破即是高分句。"
      }
    }
  },
  "剑19 Test 4 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Shoppers in many countries can now fill a supermarket trolley with berries from Chile, prawns from Vietnam and cheese from France at any time of year. In my view this development, though convenient, is negative on balance, because its environmental and social costs are quietly pushed onto people who never see the checkout receipt.\n\nFor the individual shopper, the benefits are undeniable. Year-round variety has ended the preserve-and-scarcity era: out-of-season produce is affordable, diets are more varied, and consumers in landlocked countries can enjoy foods their grandparents never tasted. For producers, the picture can be equally bright, since farmers in developing regions gain access to lucrative export markets that local demand could never sustain.\n\nThe costs, however, accumulate far from the trolley. Air-freighted asparagus and berries carry a carbon footprint that dwarfs their nutritional value, and the emissions are invisible at the point of purchase, which is precisely why the trade keeps expanding. There is a hidden human cost too: to survive in export supply chains, producers in poorer countries are often pushed into monoculture, growing cash crops for foreigners while staples must be imported at volatile prices, and food security quietly erodes. Meanwhile, at home, the guarantee of everything in every season weakens the connection between consumers and local farming, and small domestic growers, unable to compete with industrial exporters, leave the land.\n\nIn conclusion, although global food trade delights the shopper and rewards some growers, its true costs in emissions, distorted rural economies and weakened food security are borne by others, and I therefore judge it a negative development overall.",
    paraTeach: {
      "2": {
        why: "利弊评价题开头：句1用超市购物车的具象画面改写题目（berries from Chile... 一句三个具体商品），句2 negative on balance + 总理由（代价被悄悄转嫁给看不见的人）——「谁承担代价」直接当主轴，评价题立刻有了伦理纵深。",
        modelPara: "Shoppers in many countries can now fill a supermarket trolley with berries from Chile, prawns from Vietnam and cheese from France at any time of year. In my view this development, though convenient, is negative on balance, because its environmental and social costs are quietly pushed onto people who never see the checkout receipt.",
        expressions: [
          { en: "fill a supermarket trolley with berries from Chile, prawns from Vietnam and cheese from France", zh: "购物车里装满智利莓果、越南虾、法国奶酪（具象化改写）" },
          { en: "its environmental and social costs are quietly pushed onto people who never see the checkout receipt", zh: "环境与社会代价被转嫁给看不见小票的人（主轴句）" }
        ],
        guideQ: "你的开头有没有一句「具体到看得见的画面」？ Chile莓果比 global food trade 生动十倍。"
      },
      "3": {
        why: "让步段双主体：消费者（全年供应/价格亲民/饮食多样）与生产者（发展中地区农民获得出口市场）——For the individual shopper / For producers 的双开头结构清晰对称；benefits are undeniable 的干脆让步为批判攒足信用。",
        modelPara: "For the individual shopper, the benefits are undeniable. Year-round variety has ended the preserve-and-scarcity era: out-of-season produce is affordable, diets are more varied, and consumers in landlocked countries can enjoy foods their grandparents never tasted. For producers, the picture can be equally bright, since farmers in developing regions gain access to lucrative export markets that local demand could never sustain.",
        expressions: [
          { en: "has ended the preserve-and-scarcity era", zh: "终结了腌制与匮乏的时代（时代定性）" },
          { en: "foods their grandparents never tasted", zh: "祖辈从未尝过的食物（跨代对比）" },
          { en: "lucrative export markets that local demand could never sustain", zh: "本地需求撑不起的高价值出口市场" }
        ],
        guideQ: "你的让步段按「受益的不同主体」分段内结构了吗？比笼统一句「有好处」清晰得多。"
      },
      "4": {
        why: "批判段三链：环境（空运碳足迹远超营养价值+购买时不可见所以持续扩张的机制）→生产国（单一化种植挤掉主粮→粮食安全受威胁的链条）→本国（小农竞争失败离地）——每条链都点到「机制」而非「现象」，invisible at the point of purchase 呼应开头主轴（体系1.4）。",
        modelPara: "The costs, however, accumulate far from the trolley. Air-freighted asparagus and berries carry a carbon footprint that dwarfs their nutritional value, and the emissions are invisible at the point of purchase, which is precisely why the trade keeps expanding. There is a hidden human cost too: to survive in export supply chains, producers in poorer countries are often pushed into monoculture, growing cash crops for foreigners while staples must be imported at volatile prices, and food security quietly erodes. Meanwhile, at home, the guarantee of everything in every season weakens the connection between consumers and local farming, and small domestic growers, unable to compete with industrial exporters, leave the land.",
        expressions: [
          { en: "a carbon footprint that dwarfs their nutritional value", zh: "碳足迹远超其营养价值（dwarf比较动词）" },
          { en: "pushed into monoculture, growing cash crops for foreigners while staples must be imported", zh: "被迫单一化：为外国人种经济作物、主粮靠进口" },
          { en: "The costs, however, accumulate far from the trolley", zh: "代价在远离购物车之处累积（呼应开头主轴）" }
        ],
        guideQ: "批判段每条害处你都写出了「传导链条」吗？单一化→主粮进口→粮食安全，链条才算论证。"
      },
      "5": {
        why: "一句话结论：although 双受益者回收（delights the shopper and rewards some growers）+ true costs borne by others 回收主轴 + negative development overall 定性——结尾是开头主轴的完美回声，结构闭环。",
        modelPara: "In conclusion, although global food trade delights the shopper and rewards some growers, its true costs in emissions, distorted rural economies and weakened food security are borne by others, and I therefore judge it a negative development overall.",
        expressions: [
          { en: "delights the shopper and rewards some growers", zh: "取悦消费者、回报部分生产者（双受益回收）" },
          { en: "its true costs in emissions, distorted rural economies and weakened food security are borne by others", zh: "排放、农村经济扭曲与粮食安全的真实代价由他人承担（主轴回收）" }
        ],
        guideQ: "你的结论第一句能让读者想起开头那句主轴吗？首尾回声是利弊题的闭环标志。"
      }
    }
  },
  "剑20 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "三张表（1800/1900/2000三个年份）：表1纽约五区总人口 79,216→3,437,202→8,009,185；表2曼哈顿 60,515(76%)→1,850,093(54%)→1,538,096(19%)——绝对数1900后下降；表3其他四区（Brooklyn/Bronx/Queens/Staten Island合计）18,701(24%)→1,587,109(46%)→6,471,089(81%)。",
    essay: "The tables show the population of New York City in 1800, 1900 and 2000, giving the total for all five districts and separate figures for Manhattan and the other four boroughs.\n\nIt is clear that the city grew enormously over the two centuries. It is also noticeable that the share of New Yorkers living in Manhattan collapsed, from more than three quarters to under a fifth.\n\nThe total population rose from 79,216 in 1800 to 3,437,202 in 1900 — a forty-three-fold increase — and reached 8,009,185 by 2000. Manhattan housed 60,515 of the 1800 total, or 76%, and grew to 1.85 million by 1900; by 2000, however, its population had actually fallen back to about 1.54 million, just 19% of the city.\n\nThe other districts tell the opposite story. From only 18,701 people in 1800, they overtook Manhattan between 1900 and 2000, soaring to 6,471,089, or 81% of the total — more than four times Manhattan's population. In short, New York's growth after 1900 happened almost entirely beyond the island of Manhattan.",
    paraTeach: {
      "2": {
        why: "开头改写：三张表的分工在开头一句交代——giving the total... and separate figures for Manhattan and the other four boroughs（分词短语分派三表），比 the first table/the second table 更顺。",
        modelPara: "The tables show the population of New York City in 1800, 1900 and 2000, giving the total for all five districts and separate figures for Manhattan and the other four boroughs.",
        expressions: [
          { en: "giving the total for all five districts", zh: "给出五区总人口（表一分工）" },
          { en: "separate figures for Manhattan and the other four boroughs", zh: "曼哈顿与其他四区的分开数字（表二表三分工）" }
        ],
        guideQ: "多表题你的开头把「每张表管什么」分派清楚了吗？"
      },
      "3": {
        why: "概括两句：句1=两个世纪的巨大增长（总量头条），句2=份额反转（曼哈顿从四分之三跌到不足五分之一）——份额句用 from more than three quarters to under a fifth 的对比结构，无绝对数却信息量十足。",
        modelPara: "It is clear that the city grew enormously over the two centuries. It is also noticeable that the share of New Yorkers living in Manhattan collapsed, from more than three quarters to under a fifth.",
        expressions: [
          { en: "the share of New Yorkers living in Manhattan collapsed", zh: "住曼哈顿的纽约人份额暴跌（份额主语句）" },
          { en: "from more than three quarters to under a fifth", zh: "从超过四分之三到不足五分之一（对比结构）" }
        ],
        guideQ: "表格的概括你先算了「份额」吗？份额变化比人口数更有故事性。"
      },
      "4": {
        why: "细节一=总量+曼哈顿：总量两句（79,216→3,437,202 带 forty-three-fold 倍数；8,009,185 收）；曼哈顿两句（76% 份额→1.85m 峰值→**绝对数回落**至1.54m）——「1900年后曼哈顿人不增反降」是表二的关键细节，had actually fallen 的 actually 是点睛副词。",
        modelPara: "The total population rose from 79,216 in 1800 to 3,437,202 in 1900 — a forty-three-fold increase — and reached 8,009,185 by 2000. Manhattan housed 60,515 of the 1800 total, or 76%, and grew to 1.85 million by 1900; by 2000, however, its population had actually fallen back to about 1.54 million, just 19% of the city.",
        expressions: [
          { en: "a forty-three-fold increase", zh: "43倍增长（同位语补倍数）" },
          { en: "its population had actually fallen back to about 1.54 million", zh: "人口竟然回落至约154万（过去完成时+actually）" },
          { en: "just 19% of the city", zh: "仅占全市19%（份额收尾）" }
        ],
        guideQ: "曼哈顿人口1900年后不增反降——你注意到这个「绝对数下降」了吗？"
      },
      "5": {
        why: "细节二=其他四区+收束：18,701→6,471,089（soaring）；overtook Manhattan between 1900 and 2000 点出反超时段；81% vs 曼哈顿的 more than four times 对比；In short 收束句呼应概括（增长几乎全部发生在曼哈顿之外）。",
        modelPara: "The other districts tell the opposite story. From only 18,701 people in 1800, they overtook Manhattan between 1900 and 2000, soaring to 6,471,089, or 81% of the total — more than four times Manhattan's population. In short, New York's growth after 1900 happened almost entirely beyond the island of Manhattan.",
        expressions: [
          { en: "The other districts tell the opposite story", zh: "其他区讲着相反的故事（对照主旨句）" },
          { en: "soaring to 6,471,089, or 81% of the total", zh: "飙升至647万、占全市81%（or引出份额）" },
          { en: "happened almost entirely beyond the island of Manhattan", zh: "几乎全部发生在曼哈顿岛之外（收束句）" }
        ],
        guideQ: "你的收束句把「增长发生在哪里」点破了吗？表格题的最后一句是解读，不是报数。"
      }
    }
  },
  "剑20 Test 1 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Because access to clean water is recognised as a basic human right, some argue that every household should receive a free water supply. I disagree with this demand, not because water is unimportant, but because free water would be consumed wastefully and paid for by the very people the policy claims to help.\n\nNobody disputes the principle at stake. Water is not a luxury like cable television; it is a precondition of life and public health, and a government that lets citizens go thirsty has failed at its most basic duty. The terrible epidemics that once swept cities without clean supplies, and still sweep those without them today, show exactly what is at risk when water is treated as an ordinary commodity.\n\nFree water, however, is the wrong answer to a real problem. Anything supplied at zero price is consumed without thought, and households would have no reason to fix a leaking pipe, choose efficient appliances or care how long the garden hose runs; the resulting surge in demand would have to be met by building expensive new infrastructure. Worse, nothing is truly free. If water companies receive no revenue, the state must fund them from taxation, so the cost returns through everybody's tax bill, and the heaviest users are quietly subsidised by the most careful ones. The fair and effective alternative is a cheap or free basic allowance for every household, with heavy use priced normally: the right to enough water for drinking and washing is protected, while waste still carries a cost.\n\nIn conclusion, although the human right to clean water is beyond argument, making the entire supply free would punish careful users and encourage waste, and a subsidised basic allowance achieves the same right at a fraction of the cost.",
    paraTeach: {
      "2": {
        why: "观点题开头：句1改写（recognised as a basic human right 保留题目让步），句2 disagree + 让步前置（not because unimportant）+ 双总理由（浪费+转嫁）——「我反对的不是原则而是手段」的框架，把题目里最锋利的道德武器先接过来。",
        modelPara: "Because access to clean water is recognised as a basic human right, some argue that every household should receive a free water supply. I disagree with this demand, not because water is unimportant, but because free water would be consumed wastefully and paid for by the very people the policy claims to help.",
        expressions: [
          { en: "I disagree with this demand, not because water is unimportant, but because free water would be consumed wastefully", zh: "反对的不是原则而是手段（not because...but...框架）" },
          { en: "paid for by the very people the policy claims to help", zh: "由政策声称要帮助的那些人买单（very强调）" }
        ],
        guideQ: "题目里最强的道德牌（基本人权），你是绕开它还是先接过来再打？"
      },
      "3": {
        why: "原则确认段：water is not a luxury（否定类比）+ precondition of life and public health（定性）+ 没清洁供水城市的瘟疫史实（历史证据今昔对比）——整段把「人权」立场写得无可挑剔，为下一段反对「免费」赢得合法性。",
        modelPara: "Nobody disputes the principle at stake. Water is not a luxury like cable television; it is a precondition of life and public health, and a government that lets citizens go thirsty has failed at its most basic duty. The terrible epidemics that once swept cities without clean supplies, and still sweep those without them today, show exactly what is at risk when water is treated as an ordinary commodity.",
        expressions: [
          { en: "a precondition of life and public health", zh: "生命与公共卫生的前提条件" },
          { en: "a government that lets citizens go thirsty has failed at its most basic duty", zh: "让公民口渴的政府失职（道义句）" },
          { en: "treated as an ordinary commodity", zh: "被当成普通商品对待（点出争议本质）" }
        ],
        guideQ: "反对「免费供水」前，你先确认「清洁用水是权利」了吗？先立后破，反对才不显得冷血。"
      },
      "4": {
        why: "批判段三链：零价格→零节制的机制（漏水不修/水龙头长流/需求暴增→新基建）→没有真正的免费（税收回流+重用户被轻用户补贴）→解法（basic allowance：基础量免费+超额正常计价）——「先破后立」在同段完成，给结论备好方案（体系1.4给出解法句）。",
        modelPara: "Free water, however, is the wrong answer to a real problem. Anything supplied at zero price is consumed without thought, and households would have no reason to fix a leaking pipe, choose efficient appliances or care how long the garden hose runs; the resulting surge in demand would have to be met by building expensive new infrastructure. Worse, nothing is truly free. If water companies receive no revenue, the state must fund them from taxation, so the cost returns through everybody's tax bill, and the heaviest users are quietly subsidised by the most careful ones. The fair and effective alternative is a cheap or free basic allowance for every household, with heavy use priced normally: the right to enough water for drinking and washing is protected, while waste still carries a cost.",
        expressions: [
          { en: "Anything supplied at zero price is consumed without thought", zh: "零价格供应的东西都会被无度消耗（机制主旨句）" },
          { en: "the heaviest users are quietly subsidised by the most careful ones", zh: "最浪费者被最节约者悄悄补贴（分配批判金句）" },
          { en: "a cheap or free basic allowance for every household, with heavy use priced normally", zh: "每户基础量低价免费+超额正常计价（解法句）" }
        ],
        guideQ: "你反驳政策时给出了「正确的替代方案」吗？只破不立的观点题缺少建设性。"
      },
      "5": {
        why: "一句话结论：although 回收人权原则 + punish careful users and encourage waste 回收双批判 + achieves the same right at a fraction of the cost 用解法收尾——结论直接比较两条路线的成本效益，反对显得理性而非冷漠。",
        modelPara: "In conclusion, although the human right to clean water is beyond argument, making the entire supply free would punish careful users and encourage waste, and a subsidised basic allowance achieves the same right at a fraction of the cost.",
        expressions: [
          { en: "beyond argument", zh: "无可争辩（让步回收原则）" },
          { en: "achieves the same right at a fraction of the cost", zh: "以零头成本实现同一权利（成本比较收尾）" }
        ],
        guideQ: "你的结论有没有一句「替代方案同样能实现对方的目标」？这是击败道德主张的关键一刀。"
      }
    }
  },
  "剑20 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "地图：Beechwood Farm 1950 vs today。1950：西边三块田（fruit trees/soft fruits/vegetables），北面大牧场放羊（sheep），东侧谷仓barn+农舍farmhouse+鸡群chickens，土路track网，河（西/南），main road（西北）。今天：三块田与河不变；tracks变成公路road；羊场→camping field（帐篷）+solar panels；新增farm shop（路口）+两处parking+holiday cottages（东侧）；barn迁至chickens旁；farmhouse保留。",
    essay: "The maps show Beechwood Farm in 1950 and the same site today.\n\nIt is clear that the farm has diversified from pure agriculture into tourism and energy generation. It is also noticeable that the three crop fields on the western side have survived almost unchanged.\n\nIn 1950, the site was a working farm: fruit trees, soft fruits and vegetables grew in fields west of an unpaved track, sheep grazed the large northern pasture, and the barn, farmhouse and chickens stood to the east, beside the river.\n\nToday the crops and the river remain where they were, but the surrounding economy has changed. The tracks have been upgraded into proper roads, a farm shop and parking have appeared at the main-road entrance, and the old sheep pasture now contains a camping field and rows of solar panels. Holiday cottages have been built on the eastern side, the barn has been relocated next to the chickens, and only the farmhouse links the modern site to the one in 1950.",
    paraTeach: {
      "2": {
        why: "地图开头：in 1950 and the same site today——过去/现在两个时点一句锁死；the same site 呼应地图的「同址对比」性质。",
        modelPara: "The maps show Beechwood Farm in 1950 and the same site today.",
        expressions: [
          { en: "Beechwood Farm in 1950", zh: "1950年的Beechwood农场（过去半句）" },
          { en: "the same site today", zh: "今天的同一场址（现在半句）" }
        ],
        guideQ: "对比图开头两个时点各配一个时态正确的动词了吗？"
      },
      "3": {
        why: "概括两句定性：句1=从纯农业转向旅游+能源（diversified from... into...一句话讲完转型方向），句2=西侧三块田几乎不变——「什么没变」也是地图信息，放进概括能帮下一段分工。",
        modelPara: "It is clear that the farm has diversified from pure agriculture into tourism and energy generation. It is also noticeable that the three crop fields on the western side have survived almost unchanged.",
        expressions: [
          { en: "has diversified from pure agriculture into tourism and energy generation", zh: "从纯农业多元化到旅游与能源（转型定性句）" },
          { en: "have survived almost unchanged", zh: "几乎原样保留（不变项预告）" }
        ],
        guideQ: "你的概括是不是「变什么+不变什么」各占一句？"
      },
      "4": {
        why: "细节一=1950全貌（过去时）：三块田在西（fruit trees/soft fruits/vegetables）、羊在北牧场、建筑群在东（barn/farmhouse/chickens），unpaved track 埋下「将来修路」的钩子——按西-北-东的方位走一遍。",
        modelPara: "In 1950, the site was a working farm: fruit trees, soft fruits and vegetables grew in fields west of an unpaved track, sheep grazed the large northern pasture, and the barn, farmhouse and chickens stood to the east, beside the river.",
        expressions: [
          { en: "fruit trees, soft fruits and vegetables grew in fields west of an unpaved track", zh: "果树、浆果、蔬菜种在土路西侧的田里" },
          { en: "sheep grazed the large northern pasture", zh: "羊群在北面大牧场吃草（graze精准动词）" },
          { en: "the barn, farmhouse and chickens stood to the east", zh: "谷仓、农舍、鸡群在东侧（stood方位动词）" }
        ],
        guideQ: "旧图的每个要素你都配了「方位+功能」吗？这是为下一段变化埋的坐标。"
      },
      "5": {
        why: "细节二=今天（现在完成时被动串场）：tracks→roads（升级）、farm shop+parking（新增）、sheep pasture→camping field+solar panels（改用途）、holiday cottages（新建）、barn relocated（移位）；farmhouse 保留收尾——五类变化动词各就各位。",
        modelPara: "Today the crops and the river remain where they were, but the surrounding economy has changed. The tracks have been upgraded into proper roads, a farm shop and parking have appeared at the main-road entrance, and the old sheep pasture now contains a camping field and rows of solar panels. Holiday cottages have been built on the eastern side, the barn has been relocated next to the chickens, and only the farmhouse links the modern site to the one in 1950.",
        expressions: [
          { en: "have been upgraded into proper roads", zh: "被升级为正式公路（upgrade into）" },
          { en: "the old sheep pasture now contains a camping field and rows of solar panels", zh: "原羊场如今是营地与成排太阳能板（改用途）" },
          { en: "the barn has been relocated next to the chickens", zh: "谷仓迁至鸡舍旁（relocate移位）" }
        ],
        guideQ: "五类变化动词（新增/拆除/移位/改用途/升级），你的每处变化都对上号了吗？"
      }
    }
  },
  "剑20 Test 2 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "In many countries, primary and secondary schools shut down for two months or more every summer, a practice so familiar that its purpose is rarely questioned. The holidays certainly carry value, but the case for shortening them is now strong, because a ten-week break serves neither children's learning nor most families' lives.\n\nThe traditional case for long holidays deserves a fair hearing. Children need unstructured time: weeks of freedom teach them to fill their own days, organise games with neighbours and simply be bored, which many psychologists regard as the seed of creativity. The break also allows families to travel together and gives tired teachers a genuine reset; anyone who has watched a classroom in the final week of term knows that both pupils and staff are running on empty.\n\nThe arguments for a shorter break, however, carry more weight in the modern world. The first is learning loss: studies consistently find that pupils forget a substantial share of each year's material over the summer, with children from poorer homes falling furthest behind, because their middle-class classmates spend the weeks at camps and on holidays while they stay home alone. The second is childcare arithmetic. Most parents now work full time, and ten weeks without school means ten weeks of expensive cover, shared unevenly between families who can afford summer programmes and those who cannot. A shorter, more evenly distributed calendar would keep knowledge fresh and spare household budgets without costing children the freedom that a reasonable holiday still provides.\n\nIn conclusion, long summer holidays once made sense for an agricultural society, and they still offer children rest and independence, but shrinking them to four or five weeks, spread across the year, would serve learning and fairness better than the current extreme.",
    paraTeach: {
      "2": {
        why: "双问题（value+shorter arguments）开头：句1改写并点出「习以为常以致无人追问」的切口，句2双预告（holidays carry value + case for shortening is now strong）——两个问各领一段，立场倾向第二问但不否定第一问。",
        modelPara: "In many countries, primary and secondary schools shut down for two months or more every summer, a practice so familiar that its purpose is rarely questioned. The holidays certainly carry value, but the case for shortening them is now strong, because a ten-week break serves neither children's learning nor most families' lives.",
        expressions: [
          { en: "a practice so familiar that its purpose is rarely questioned", zh: "习以为常以致无人追问其目的（同位语评论句）" },
          { en: "The holidays certainly carry value, but the case for shortening them is now strong", zh: "假期确有价值，但缩短的理由如今更强（双问各半句）" }
        ],
        guideQ: "双问题题你的开头是不是「问一给半句、问二给半句」？"
      },
      "3": {
        why: "价值段三层：非结构化时间培养自主与创造力（be bored 是创造力的种子——具体机制）→家庭旅行与教师喘息（deserves a fair hearing 起手公允）→running on empty 的画面感收尾——把对方价值写成「真实的心理学与真实的人」。",
        modelPara: "The traditional case for long holidays deserves a fair hearing. Children need unstructured time: weeks of freedom teach them to fill their own days, organise games with neighbours and simply be bored, which many psychologists regard as the seed of creativity. The break also allows families to travel together and gives tired teachers a genuine reset; anyone who has watched a classroom in the final week of term knows that both pupils and staff are running on empty.",
        expressions: [
          { en: "deserves a fair hearing", zh: "值得被公正对待（让步起手）" },
          { en: "simply be bored, which many psychologists regard as the seed of creativity", zh: "无聊本身是创造力的种子（反直觉论点）" },
          { en: "both pupils and staff are running on empty", zh: "师生都已油尽灯枯（画面感收尾）" }
        ],
        guideQ: "你给对方的理由里有没有一条「反直觉但讲得出机制」的？无聊出创造力就是这种。"
      },
      "4": {
        why: "批判段两条论点各有算法：learning loss（研究结论+公平视角——中产孩子上夏令营、穷孩子独自在家，掉队最远的恰是穷孩子）；childcare arithmetic（全职父母+十周托管开销+家庭间不均）；解法句把批判转化为方案（更短、更均摊的校历）——「损耗+算术+方案」三段式。",
        modelPara: "The arguments for a shorter break, however, carry more weight in the modern world. The first is learning loss: studies consistently find that pupils forget a substantial share of each year's material over the summer, with children from poorer homes falling furthest behind, because their middle-class classmates spend the weeks at camps and on holidays while they stay home alone. The second is childcare arithmetic. Most parents now work full time, and ten weeks without school means ten weeks of expensive cover, shared unevenly between families who can afford summer programmes and those who cannot. A shorter, more evenly distributed calendar would keep knowledge fresh and spare household budgets without costing children the freedom that a reasonable holiday still provides.",
        expressions: [
          { en: "pupils forget a substantial share of each year's material over the summer", zh: "学生在夏季遗忘当年所学的大块内容（研究结论）" },
          { en: "children from poorer homes falling furthest behind", zh: "贫困家庭的孩子掉队最远（公平视角）" },
          { en: "ten weeks of expensive cover, shared unevenly between families", zh: "十周昂贵托管、家庭间负担不均（算术句）" }
        ],
        guideQ: "你的两条批判里有没有一条「公平账」？教育话题里它最有力。"
      },
      "5": {
        why: "一句话结论：once made sense for an agricultural society（历史视角点破制度的来历）+ rest and independence 让步回收 + shrinking to four or five weeks, spread across the year 的具体方案收尾——结论带数字方案，立场落地。",
        modelPara: "In conclusion, long summer holidays once made sense for an agricultural society, and they still offer children rest and independence, but shrinking them to four or five weeks, spread across the year, would serve learning and fairness better than the current extreme.",
        expressions: [
          { en: "once made sense for an agricultural society", zh: "在农业社会曾经合理（历史溯源句）" },
          { en: "shrinking them to four or five weeks, spread across the year", zh: "缩至四五周并均摊全年（具体方案收尾）" }
        ],
        guideQ: "你的结论给出「缩短到多少、怎么放」的具体方案了吗？数字让立场可信。"
      }
    }
  },
  "剑20 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "混合图：Little Chalfont Library。饼图=2016年馆员年龄构成：children 22%、young adults 13-17 约12%、adults 18-64 51%、adults 65+ 约5%；表=2016年借书类别占比：children's fiction 38%、children's non-fiction 6%、children's DVDs 1%、young adults 2%、adult fiction 35%、adult non-fiction 13%、adult audio books 2%；柱图=2007-2016年总借书量：约16,000→21,000（2011），2013小跌至约19,500，2015-2016约21,500。",
    essay: "The charts give information about a public library in the town of Little Chalfont: the age of its members and the loans they made in 2016, and the total number of loans each year from 2007 to 2016.\n\nIt is clear that borrowing grew steadily over the decade. It is also noticeable that children's fiction, not adult books, was the library's biggest single category, even though adults made up the majority of members.\n\nTotal loans rose from about 16,000 in 2007 to 21,000 by 2011 and, apart from a dip to roughly 19,500 in 2013, continued climbing to around 21,500 in 2015 and 2016.\n\nThe members behind these figures were overwhelmingly adults: those aged 18 to 64 made up 51% of members, children 22%, and teenagers and the elderly only small slices. Their loans, however, were led by children's fiction at 38%, just ahead of adult fiction at 35%; adult non-fiction took 13%, while young-adult books and audio books accounted for a mere 2% each.",
    paraTeach: {
      "2": {
        why: "混合图开头用冒号把三块内容一次分派：成员年龄+2016借书类别（饼+表）+十年借书总量（柱图）——信息再多，开头一句也要全装下。",
        modelPara: "The charts give information about a public library in the town of Little Chalfont: the age of its members and the loans they made in 2016, and the total number of loans each year from 2007 to 2016.",
        expressions: [
          { en: "the age of its members and the loans they made in 2016", zh: "2016年成员年龄与借书类别（饼图+表）" },
          { en: "the total number of loans each year from 2007 to 2016", zh: "2007-2016逐年借书总量（柱图）" }
        ],
        guideQ: "混合图你的开头用冒号把「每块图」列清了吗？"
      },
      "3": {
        why: "概括两句：句1=十年借书稳步增长（量），句2=童书而非成人书是最大单一类别——「尽管成人会员占多数」的转折（even though）把饼图与表的反差一句话点破，这是本图最有意思的矛盾点。",
        modelPara: "It is clear that borrowing grew steadily over the decade. It is also noticeable that children's fiction, not adult books, was the library's biggest single category, even though adults made up the majority of members.",
        expressions: [
          { en: "borrowing grew steadily over the decade", zh: "十年间借书量稳步增长（量头条）" },
          { en: "children's fiction, not adult books, was the library's biggest single category", zh: "最大单一类别是童书而非成人书（not A but B强调）" }
        ],
        guideQ: "「成人会员占多数、借的却多是童书」这个反差，你的概括点破了吗？"
      },
      "4": {
        why: "细节一=柱图：16,000→21,000（2011）→apart from a dip（2013约19,500）→21,500（2015-2016）——四个节点+一个例外插入，apart from 处理小回落最省字（体系2.3：起点/峰值/例外必写）。",
        modelPara: "Total loans rose from about 16,000 in 2007 to 21,000 by 2011 and, apart from a dip to roughly 19,500 in 2013, continued climbing to around 21,500 in 2015 and 2016.",
        expressions: [
          { en: "rose from about 16,000 in 2007 to 21,000 by 2011", zh: "从2007年约1.6万升至2011年2.1万" },
          { en: "apart from a dip to roughly 19,500 in 2013", zh: "除2013年回落至约1.95万外（例外插入）" },
          { en: "continued climbing to around 21,500 in 2015 and 2016", zh: "续升至2015-2016的约2.15万" }
        ],
        guideQ: "小回落用 apart from 一笔带过，主趋势才不被打断——你会处理例外吗？"
      },
      "5": {
        why: "细节二=饼+表：先写成员构成（adults 51% / children 22% / 其余小项归堆），However 转折引出借书类别（children's fiction 38% 压过 adult fiction 35%），小类 mere 2% each 收尾——「人」与「书」两层数据在同一段内对位，反差自明。",
        modelPara: "The members behind these figures were overwhelmingly adults: those aged 18 to 64 made up 51% of members, children 22%, and teenagers and the elderly only small slices. Their loans, however, were led by children's fiction at 38%, just ahead of adult fiction at 35%; adult non-fiction took 13%, while young-adult books and audio books accounted for a mere 2% each.",
        expressions: [
          { en: "made up 51% of members", zh: "占会员的51%（make up占比）" },
          { en: "were led by children's fiction at 38%, just ahead of adult fiction at 35%", zh: "由38%的童书领衔、略高于35%的成人小说（led by+ahead of）" },
          { en: "accounted for a mere 2% each", zh: "各仅占2%（mere降格+each并写）" }
        ],
        guideQ: "「人」的构成与「书」的构成放在同一段对位了吗？反差不用你说破，读者自己会看见。"
      }
    }
  },
  "剑20 Test 3 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Some people now choose to fly less or to give up flying altogether, hoping to shrink their personal contribution to climate change. In my view the environmental gains of this choice are outweighed by its disadvantages, but only because individual abstinence is the wrong tool: the same environmental goal is better achieved through technology and policy.\n\nThere is no disputing the environmental logic behind the decision. A single long-haul return flight can emit more carbon than an average person is allowed per year if warming is to be limited, so cutting flights genuinely shrinks an individual footprint faster than almost any other lifestyle change. For the minority who fly frequently, simply flying less is by far the most effective thing they can do.\n\nThe disadvantages, however, reach further than personal inconvenience. Flying connects people to family, love and opportunity; the granddaughter who stops visiting elderly relatives abroad, or the small firm that abandons an overseas client because video calls cannot close the deal, loses something real. Business travel, whatever its carbon cost, still wins contracts, and tourism keeps whole economies alive: islands and mountain regions that cannot grow or manufacture much depend on visitors who arrive by plane. If conscientious travellers simply withdraw, those destinations lose income while the flights, filled instead by less concerned passengers, take off anyway. The emission saved by one person's virtue is cancelled by another's indifference.\n\nIn conclusion, although flying less is personally coherent and environmentally meaningful for frequent flyers, individual sacrifice cannot ground a fair climate policy, and the real answers lie in cleaner fuels, higher efficiency standards and prices that reflect carbon. Until those exist, I do not think the environmental benefits of giving up flying outweigh its human costs.",
    paraTeach: {
      "2": {
        why: "利弊比较题开头的高阶写法：句2表态后立刻给出「为什么弊更重」的精确边界（individual abstinence is the wrong tool——工具错≠目标错），并把己方替代方案（technology and policy）预埋进开头——立场、理由、解法一句全齐。",
        modelPara: "Some people now choose to fly less or to give up flying altogether, hoping to shrink their personal contribution to climate change. In my view the environmental gains of this choice are outweighed by its disadvantages, but only because individual abstinence is the wrong tool: the same environmental goal is better achieved through technology and policy.",
        expressions: [
          { en: "individual abstinence is the wrong tool", zh: "个人戒断是错误的工具（批判的精确边界）" },
          { en: "the same environmental goal is better achieved through technology and policy", zh: "同一目标靠技术与政策更好实现（解法预埋）" }
        ],
        guideQ: "你的 outweigh 判断有没有附带「弊在何处」的精确边界？工具错和目标错是两个完全不同的命题。"
      },
      "3": {
        why: "让步段只写一条但写到极致：一次往返长途航班>个人年碳配额（数字冲击）+对常飞者是最有效的个人行为（by far the most effective）——承认对方最强点时用「量化」而不是空赞，让步的分量感来自数字。",
        modelPara: "There is no disputing the environmental logic behind the decision. A single long-haul return flight can emit more carbon than an average person is allowed per year if warming is to be limited, so cutting flights genuinely shrinks an individual footprint faster than almost any other lifestyle change. For the minority who fly frequently, simply flying less is by far the most effective thing they can do.",
        expressions: [
          { en: "There is no disputing the environmental logic", zh: "环境逻辑无可争辩（让步起手）" },
          { en: "emit more carbon than an average person is allowed per year", zh: "一次长途往返排放超过个人年度配额（量化对比）" },
          { en: "by far the most effective thing they can do", zh: "他们所能做的最有效的事" }
        ],
        guideQ: "你让步时用了数字吗？「超过年度配额」比「排放很多」有力十倍。"
      },
      "4": {
        why: "批判段三层代价：亲人（孙辈停访海外老人）→生意（视频谈不成的客户）→经济（岛屿与山区靠航空游客活着）；再补机制反转：有良知者退出后航班照样起飞、座位被无所谓者填满——「一个人的美德被另一个人的冷漠抵消」金句收尾，证明个人牺牲不仅痛苦而且无效。",
        modelPara: "The disadvantages, however, reach further than personal inconvenience. Flying connects people to family, love and opportunity; the granddaughter who stops visiting elderly relatives abroad, or the small firm that abandons an overseas client because video calls cannot close the deal, loses something real. Business travel, whatever its carbon cost, still wins contracts, and tourism keeps whole economies alive: islands and mountain regions that cannot grow or manufacture much depend on visitors who arrive by plane. If conscientious travellers simply withdraw, those destinations lose income while the flights, filled instead by less concerned passengers, take off anyway. The emission saved by one person's virtue is cancelled by another's indifference.",
        expressions: [
          { en: "Flying connects people to family, love and opportunity", zh: "航空连接着亲情、爱与机会（让步段后的转折主旨）" },
          { en: "the flights, filled instead by less concerned passengers, take off anyway", zh: "航班由更不在意的乘客填满、照飞不误（无效性机制）" },
          { en: "The emission saved by one person's virtue is cancelled by another's indifference", zh: "一个人的美德省下的排放被另一个人的冷漠抵消（金句收尾）" }
        ],
        guideQ: "你批判个人牺牲时证明了「它无效」而不只是「它痛苦」了吗？"
      },
      "5": {
        why: "一句话结论：although 回收让步（personally coherent and environmentally meaningful for frequent flyers——把适用域精确到常飞者）+ the real answers lie in 三连解法 + Until those exist 的时序限定收尾——结论给出「何时我会改变判断」的条件，立场完全透明。",
        modelPara: "In conclusion, although flying less is personally coherent and environmentally meaningful for frequent flyers, individual sacrifice cannot ground a fair climate policy, and the real answers lie in cleaner fuels, higher efficiency standards and prices that reflect carbon. Until those exist, I do not think the environmental benefits of giving up flying outweigh its human costs.",
        expressions: [
          { en: "individual sacrifice cannot ground a fair climate policy", zh: "个人牺牲撑不起公平的气候政策（立场句）" },
          { en: "Until those exist, I do not think the environmental benefits of giving up flying outweigh its human costs", zh: "在这些存在之前我不认为放弃飞行的环境收益大过人的代价（时序条件收尾）" }
        ],
        guideQ: "你的结论写明「什么条件下我会改变立场」了吗？透明条件让利弊判断更显专业。"
      }
    }
  },
  "剑20 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "流程图（蛇形9步）：①Plant bamboo plants (Spring) ②Harvest (Autumn) ③Cut into strips ④Crush strips (to make liquid pulp) ⑤Filter (separate long fibres from liquid) ⑥Soften fibres (add water and amine oxide) ⑦Spin (to make yarn) ⑧Weave (to make fabric) ⑨制成成品（衣袜图）。季节节点：春种秋收；软化剂是水+胺氧化物（amine oxide）；无染色步骤。",
    essay: "The diagram shows how fabric for clothes is manufactured from bamboo, in nine stages from planting to the finished products.\n\nIt is clear that the process falls into two halves: preparing the raw material and turning the fibre into cloth. It is also noticeable that the timetable is fixed by the seasons, since the bamboo is planted in spring and harvested in autumn.\n\nThe first half begins in the fields, where bamboo plants are grown and then cut down in the autumn. The harvested canes are cut into strips and crushed to make a liquid pulp, at which point the material leaves the farm for the factory.\n\nThe second half extracts and processes the fibre. Long fibres are filtered from the liquid and then softened with water and amine oxide; they are spun to make yarn, the yarn is woven to make fabric, and the fabric is finally made into finished products such as clothes.",
    paraTeach: {
      "2": {
        why: "开头：in nine stages from planting to the finished products——步数+起终点前置一句完成改写（planting↔finished products 首尾对仗）。",
        modelPara: "The diagram shows how fabric for clothes is manufactured from bamboo, in nine stages from planting to the finished products.",
        expressions: [
          { en: "how fabric for clothes is manufactured from bamboo", zh: "衣料如何由竹子制成（被动改写）" },
          { en: "in nine stages from planting to the finished products", zh: "从种植到成品的九个阶段（步数+首尾）" }
        ],
        guideQ: "流程图开头你的步数和首尾齐了吗？"
      },
      "3": {
        why: "概括两句：句1=两半结构（备料/成布），句2=季节固定节奏（春种秋收）——季节是这张流程图最特别的信息，放进 overview 而不是埋在细节里。",
        modelPara: "It is clear that the process falls into two halves: preparing the raw material and turning the fibre into cloth. It is also noticeable that the timetable is fixed by the seasons, since the bamboo is planted in spring and harvested in autumn.",
        expressions: [
          { en: "falls into two halves", zh: "分为两半（工序结构概括）" },
          { en: "the timetable is fixed by the seasons", zh: "时间表由季节决定（季节特征句）" }
        ],
        guideQ: "图上的季节标注（Spring/Autumn）你升格为概括信息了吗？"
      },
      "4": {
        why: "细节一=①-④备料：种（春）→砍（秋）→切条→压成 liquid pulp；at which point the material leaves the farm for the factory 用「离开农场」一句话交代①-④与⑤-⑨的场景分界（体系2.2流程图分段点明边界）。",
        modelPara: "The first half begins in the fields, where bamboo plants are grown and then cut down in the autumn. The harvested canes are cut into strips and crushed to make a liquid pulp, at which point the material leaves the farm for the factory.",
        expressions: [
          { en: "bamboo plants are grown and then cut down in the autumn", zh: "竹子种植后于秋季砍伐" },
          { en: "crushed to make a liquid pulp", zh: "压碎成液态浆（目的状语）" },
          { en: "at which point the material leaves the farm for the factory", zh: "此时原料离开农场进入工厂（场景分界句）" }
        ],
        guideQ: "两半的分界位置，你用一句「场景转换」点明了吗？"
      },
      "5": {
        why: "细节二=⑤-⑨纤维到布：filtered from the liquid→softened with water and amine oxide→spun to make yarn→woven to make fabric→made into finished products；spin/weave/make 三个「to make」目的短语层层递进——术语（yarn/fabric/products）分级是本段的语言分。",
        modelPara: "The second half extracts and processes the fibre. Long fibres are filtered from the liquid and then softened with water and amine oxide; they are spun to make yarn, the yarn is woven to make fabric, and the fabric is finally made into finished products such as clothes.",
        expressions: [
          { en: "Long fibres are filtered from the liquid", zh: "长纤维从液体中滤出（filter）" },
          { en: "softened with water and amine oxide", zh: "加水与胺氧化物软化（试剂名照抄图）" },
          { en: "they are spun to make yarn, the yarn is woven to make fabric", zh: "纺成纱线、织成布料（顶针式衔接）" }
        ],
        guideQ: " yarn→fabric→products 的三级术语链，你用顶针法串起来了吗？"
      }
    }
  },
  "剑20 Test 4 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "From the clothes people wear to the phone cases they carry, global fashion trends now shape daily choices in almost every society. These trends became so powerful through a combination of commerce, media and imitation, and I regard their dominance as a negative development, though a less alarming one than it first appears.\n\nFashion's grip has three causes. The first is commercial: global brands spend billions persuading consumers that this season's style is the only acceptable one, and because production has become fast and cheap, new ranges arrive monthly rather than yearly. The second is visibility. Social media turns every street into a catwalk, and young people in Manila now dress like their counterparts in Manchester because they watch the same videos. The third is human nature itself: clothing has always signalled belonging, and wearing what the global crowd wears promises membership of a modern, international community.\n\nThe costs of this uniformity are real. Local textile traditions, from woven patterns to regional dress, are abandoning to mass-produced copies, and with them disappear skills and identities built over centuries. The environment pays too: fast fashion is among the world's most polluting industries, and clothes worn for a season fill landfills for centuries. Yet the picture is not entirely dark. Global fashion has also lowered the cost of decent clothing, dissolved some snobberies of class and region, and given individuals a vocabulary of styles with which to define themselves; the problem is not variety but the speed at which variety is discarded.\n\nIn conclusion, commerce, shared media and the ancient desire to belong explain fashion's global power, and although its costs to tradition and the planet are serious, the development could be made acceptable if the industry's pace, rather than its reach, were curbed.",
    paraTeach: {
      "2": {
        why: "双问题（how become strong + positive/negative）开头：句1用「从衣着到手机壳」的具象排比改写题目，句2双答（commerce/media/imitation 三因 + negative though less alarming）——though a less alarming one than it first appears 的克制定性让批判立刻脱离俗套。",
        modelPara: "From the clothes people wear to the phone cases they carry, global fashion trends now shape daily choices in almost every society. These trends became so powerful through a combination of commerce, media and imitation, and I regard their dominance as a negative development, though a less alarming one than it first appears.",
        expressions: [
          { en: "From the clothes people wear to the phone cases they carry", zh: "从衣着到手机壳（具象排比改写）" },
          { en: "a negative development, though a less alarming one than it first appears", zh: "消极发展，但没乍看那么可怕（克制定性）" }
        ],
        guideQ: "你的评价句带「程度修正」了吗？less alarming than it appears 比裸 negative 高一档。"
      },
      "3": {
        why: "原因段三因并列但写法各异：商业（billions+上新周期 monthly rather than yearly 用频率对比）→媒介（马尼拉与曼彻斯特的对仗地名例）→人性（clothing has always signalled belonging 的历史纵深）——三因各配一种论证手法，避免清单感（体系1.4）。",
        modelPara: "Fashion's grip has three causes. The first is commercial: global brands spend billions persuading consumers that this season's style is the only acceptable one, and because production has become fast and cheap, new ranges arrive monthly rather than yearly. The second is visibility. Social media turns every street into a catwalk, and young people in Manila now dress like their counterparts in Manchester because they watch the same videos. The third is human nature itself: clothing has always signalled belonging, and wearing what the global crowd wears promises membership of a modern, international community.",
        expressions: [
          { en: "Fashion's grip has three causes", zh: "时尚的控制力源于三个原因（总起+grip点题）" },
          { en: "new ranges arrive monthly rather than yearly", zh: "上新按月而非按年（频率对比）" },
          { en: "Social media turns every street into a catwalk", zh: "社交媒体把每条街变成T台（隐喻）" }
        ],
        guideQ: "你的「三个原因」各用了不同的论证手法吗（数据/例证/历史）？同质并列会显得机械。"
      },
      "4": {
        why: "批判+再让步双层段：先批（地方纺织传统流失——with them disappear 倒装强调技艺与身份同灭；快时尚一季衣穿几个世纪的 landfill 对比）→ Yet the picture is not entirely dark 再让步（衣服便宜/消解傲慢/风格词汇）→ not variety but the speed 一句聚焦真病灶——段内完成批判、让步、聚焦三步。",
        modelPara: "The costs of this uniformity are real. Local textile traditions, from woven patterns to regional dress, are abandoning to mass-produced copies, and with them disappear skills and identities built over centuries. The environment pays too: fast fashion is among the world's most polluting industries, and clothes worn for a season fill landfills for centuries. Yet the picture is not entirely dark. Global fashion has also lowered the cost of decent clothing, dissolved some snobberies of class and region, and given individuals a vocabulary of styles with which to define themselves; the problem is not variety but the speed at which variety is discarded.",
        expressions: [
          { en: "with them disappear skills and identities built over centuries", zh: "随之消失的是数世纪积累的技艺与身份（倒装强调）" },
          { en: "clothes worn for a season fill landfills for centuries", zh: "穿一季的衣服填埋几个世纪（一季/几世纪对仗）" },
          { en: "the problem is not variety but the speed at which variety is discarded", zh: "问题不是多样而是丢弃多样的速度（not X but Y定位句）" }
        ],
        guideQ: "你的批判段内部有没有「再让步并聚焦真问题」的一步？"
      },
      "5": {
        why: "一句话结论：三因压缩回收（commerce, shared media and the ancient desire to belong）+ could be made acceptable if the industry's pace, rather than its reach, were curbed 的虚拟语气收尾——「管速度不管范围」的精确方案把 negative 立场变成可执行主张。",
        modelPara: "In conclusion, commerce, shared media and the ancient desire to belong explain fashion's global power, and although its costs to tradition and the planet are serious, the development could be made acceptable if the industry's pace, rather than its reach, were curbed.",
        expressions: [
          { en: "the ancient desire to belong", zh: "古老的归属渴望（人性因回收）" },
          { en: "if the industry's pace, rather than its reach, were curbed", zh: "若被约束的是速度而非范围（虚拟语气+对仗收尾）" }
        ],
        guideQ: "你的结尾有没有一个「而非」（rather than）句式把批判精确化？"
      }
    }
  },
  "剑21 Test 1 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "线图：美国四经济部门就业（百万），1960/1980/2000/2020四点。Manufacturing 15→20（1980峰值）→17→13；Retail 6→10→15→16；Agriculture 2.5→3→3→2（最小最平）；Healthcare 2→5→11→16（增速最快，8倍，2020与Retail持平）。四部门=Manufacturing/Retail/Agriculture/Healthcare（不是笼统的services）。",
    essay: "The line graph shows how many people were employed in four sectors of the United States economy between 1960 and 2020, measured in millions.\n\nIt is clear that manufacturing, once the largest employer, fell away after 1980. It is also noticeable that healthcare grew faster than any other sector, ending the period level with retail.\n\nManufacturing began as the biggest source of jobs, with 15 million in 1960, and climbed to a peak of 20 million in 1980. From there it declined steadily to 13 million in 2020. Agriculture, by contrast, was always small, hovering between 2 and 3 million and finishing at the bottom of the chart.\n\nThe growth sectors told the opposite story. Retail employment rose steadily from 6 million to 16 million, while healthcare expanded fastest of all, multiplying eightfold from just 2 million in 1960 to 16 million in 2020 — the same figure as retail, and three million more than manufacturing, which it had overtaken around 2015.",
    paraTeach: {
      "2": {
        why: "开头改写：the number of jobs in four sectors→how many people were employed in four sectors（名词改从句）；单位 millions 嵌入句尾。",
        modelPara: "The line graph shows how many people were employed in four sectors of the United States economy between 1960 and 2020, measured in millions.",
        expressions: [
          { en: "how many people were employed in four sectors", zh: "多少人受雇于四大部门（名词改从句）" },
          { en: "measured in millions", zh: "以百万为单位" }
        ],
        guideQ: "「就业人数」你写成了从句还是照抄 the number of jobs？"
      },
      "3": {
        why: "概括两句：句1=制造业（昔日最大雇主）1980后衰落——once the largest employer 一个同位语交代起点地位；句2=healthcare 增速最快、期末与 retail 持平——「谁追平了谁」是四线图的头条。",
        modelPara: "It is clear that manufacturing, once the largest employer, fell away after 1980. It is also noticeable that healthcare grew faster than any other sector, ending the period level with retail.",
        expressions: [
          { en: "manufacturing, once the largest employer, fell away after 1980", zh: "昔日最大雇主的制造业1980后衰落（同位语+分词）" },
          { en: "ending the period level with retail", zh: "期末与零售业持平（分词收尾）" }
        ],
        guideQ: "「追平」发生在期末的哪两条线之间？你的概括点破了吗？"
      },
      "4": {
        why: "细节一=制造+农业：15→peak 20 (1980)→declined steadily to 13（先升后降的三幕）；agriculture by contrast：hovering between 2 and 3 million / finishing at the bottom（窄幅+垫底）——一多一少，对照成段。",
        modelPara: "Manufacturing began as the biggest source of jobs, with 15 million in 1960, and climbed to a peak of 20 million in 1980. From there it declined steadily to 13 million in 2020. Agriculture, by contrast, was always small, hovering between 2 and 3 million and finishing at the bottom of the chart.",
        expressions: [
          { en: "climbed to a peak of 20 million in 1980", zh: "1980年攀升至2000万峰值" },
          { en: "From there it declined steadily to 13 million", zh: "此后持续下滑至1300万（from there承接）" },
          { en: "hovering between 2 and 3 million", zh: "在200-300万间徘徊（hovering区间动词）" }
        ],
        guideQ: "先升后降的线，你的「峰值」句落在1980了吗？峰值年就是这条线的转折词。"
      },
      "5": {
        why: "细节二=两条增长线：retail 稳步 6→16 一句；healthcare multiplying eightfold（2→16）从句展开，破折号补两个对比（与retail持平、超制造3m、约2015反超）——反超时间点是多线图最值钱的交叉信息。",
        modelPara: "The growth sectors told the opposite story. Retail employment rose steadily from 6 million to 16 million, while healthcare expanded fastest of all, multiplying eightfold from just 2 million in 1960 to 16 million in 2020 — the same figure as retail, and three million more than manufacturing, which it had overtaken around 2015.",
        expressions: [
          { en: "multiplying eightfold from just 2 million in 1960 to 16 million", zh: "从仅200万八倍增至1600万（eightfold倍数）" },
          { en: "the same figure as retail, and three million more than manufacturing", zh: "与零售持平、比制造多300万（双重对比）" },
          { en: "which it had overtaken around 2015", zh: "约2015年已完成反超（过去完成时+反超点）" }
        ],
        guideQ: "反超发生的大致年份（2015前后），你从图上估出来了吗？交叉点是多线图的隐藏采分点。"
      }
    }
  },
  "剑21 Test 1 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Faced with housing shortages, some cities have concluded that the answer is to build upwards: tall apartment blocks, on this view, are the best way to house large populations. I disagree with this as a universal prescription, because height solves the arithmetic of housing while creating new problems of cost, community and liveability.\n\nThe case for towers is straightforward. High-rise buildings put far more homes on the same plot of land than low-rise streets ever can, which matters acutely where land is scarce and prices are high. Clustering population vertically also makes public transport viable: a city of towers can support frequent metro services that a sprawl of cottages never could, and shorter pipe, cable and road networks cost less to build and maintain. Singapore, where eighty per cent of residents live in well-run high-rise estates, shows that density done well is neither squalid nor impersonal.\n\nYet tall buildings are a tool, not a cure, and treating them as the answer produces predictable failures. Towers are expensive per flat to construct, so privately built high-rise housing tends to be small and costly, doing little for the families most in need. Height can also erode the informal contact that makes neighbourhoods safe and friendly: residents who pass in a lift rather than a garden have fewer natural chances to know one another. Most importantly, the premise is often false, since many housing crises are crises of affordability and speculation rather than of physical space, and no tower solves a problem of prices.\n\nIn conclusion, apartment towers are a valuable part of the housing toolkit, especially in land-hungry cities, but calling them the best way to provide homes mistakes a technical solution for a social one, and I would place them alongside cheaper, gentler forms of building rather than above them.",
    paraTeach: {
      "2": {
        why: "观点题开头：句1把题目主张具象成一句「信条」（build upwards... on this view），句2 disagree + universal prescription 限定 + 三靶预告（cost/community/liveability）——三个靶子正好是主体段的三发子弹（体系审题三问之「分几个部分」）。",
        modelPara: "Faced with housing shortages, some cities have concluded that the answer is to build upwards: tall apartment blocks, on this view, are the best way to house large populations. I disagree with this as a universal prescription, because height solves the arithmetic of housing while creating new problems of cost, community and liveability.",
        expressions: [
          { en: "I disagree with this as a universal prescription", zh: "反对将其视为普适药方（限定式反对）" },
          { en: "height solves the arithmetic of housing while creating new problems of cost, community and liveability", zh: "高度解决了住房算术、却带来成本/社区/宜居三问题（一句话双面+三靶预告）" }
        ],
        guideQ: "你的反对句预告了几个靶子？预告三个，主体段就必须真的打三发。"
      },
      "3": {
        why: "让步段三发认可：土地利用算术（同地更多 homes）→交通经济性（垂直聚集养活地铁+管线更短）→新加坡实例（80%住高层且治理良好，done well neither squalid nor impersonal 双否让步）——「数字+机制+实证」三件套让让步段无懈可击。",
        modelPara: "The case for towers is straightforward. High-rise buildings put far more homes on the same plot of land than low-rise streets ever can, which matters acutely where land is scarce and prices are high. Clustering population vertically also makes public transport viable: a city of towers can support frequent metro services that a sprawl of cottages never could, and shorter pipe, cable and road networks cost less to build and maintain. Singapore, where eighty per cent of residents live in well-run high-rise estates, shows that density done well is neither squalid nor impersonal.",
        expressions: [
          { en: "put far more homes on the same plot of land", zh: "同一地块放上多得多的住宅（土地算术）" },
          { en: "makes public transport viable", zh: "让公共交通变得可行（机制句）" },
          { en: "density done well is neither squalid nor impersonal", zh: "做好了的密度既不脏乱也不冷漠（双否让步）" }
        ],
        guideQ: "你让步段的例子带「数字+治理质量」了吗？新加坡80%比「某国很高」可信十倍。"
      },
      "4": {
        why: "批判段三发反击：成本（每套贵→小户型贵价→帮不到最需要的家庭）→社区（电梯里擦肩 vs 花园里的自然结识机会）→釜底抽薪（many crises are of affordability and speculation rather than physical space—— no tower solves a problem of prices 金句）——第三发直接拆掉题目的前提，是最重的一击。",
        modelPara: "Yet tall buildings are a tool, not a cure, and treating them as the answer produces predictable failures. Towers are expensive per flat to construct, so privately built high-rise housing tends to be small and costly, doing little for the families most in need. Height can also erode the informal contact that makes neighbourhoods safe and friendly: residents who pass in a lift rather than a garden have fewer natural chances to know one another. Most importantly, the premise is often false, since many housing crises are crises of affordability and speculation rather than of physical space, and no tower solves a problem of prices.",
        expressions: [
          { en: "a tool, not a cure", zh: "是工具而非解药（定位句）" },
          { en: "residents who pass in a lift rather than a garden have fewer natural chances to know one another", zh: "电梯擦肩不如花园偶遇（社区机制具体化）" },
          { en: "no tower solves a problem of prices", zh: "没有任何高塔能解决价格问题（釜底抽薪金句）" }
        ],
        guideQ: "你的三发反击里有没有一发是「拆对方前提」的？拆前提比列举缺点更致命。"
      },
      "5": {
        why: "一句话结论：a valuable part of the housing toolkit 承认价值 + mistakes a technical solution for a social one 一句话总结批判 + alongside... rather than above them 的位次安排收尾——给工具定位而非全盘否定，立场成熟。",
        modelPara: "In conclusion, apartment towers are a valuable part of the housing toolkit, especially in land-hungry cities, but calling them the best way to provide homes mistakes a technical solution for a social one, and I would place them alongside cheaper, gentler forms of building rather than above them.",
        expressions: [
          { en: "mistakes a technical solution for a social one", zh: "把技术方案误当社会方案（批判一句话）" },
          { en: "alongside cheaper, gentler forms of building rather than above them", zh: "并列使用而非凌驾其上（位次收尾）" }
        ],
        guideQ: "你的结论是「处决」还是「定位」对方主张？定位式结论更显思辨成熟度。"
      }
    }
  },
  "剑21 Test 2 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "地图：大学咖啡馆改造前后。Before：kitchen（顶部）、serving area (all food & drink)、staff dining rooms（员工餐厅，两张圆桌）、tables and chairs（主区）、Bar（右侧小间）、toilets（右下）。Today：kitchen保留+hot meals新增；salad bar（左侧新增）、take away food与coffee bar（原员工餐厅位）、tables and chairs保留、recycling bins（右下新增）、barbeque+outdoor seating（下方新增户外区）；toilets保留。",
    essay: "The diagrams show a college café before it was redesigned and the same café today.\n\nIt is clear that the café now offers a far wider range of food and drink. It is also noticeable that the space once given over to staff facilities has been handed back to customers.\n\nIn its original form, the café was simple: a kitchen with a single serving area for all food and drink, a large seating area of tables and chairs, staff dining rooms in one corner, and toilets by the side entrance.\n\nToday the kitchen is still there, but the serving area has become a hot-meals counter, and new facilities ring the seating area — a salad bar on one side, a take-away counter and coffee bar where the staff dining rooms used to be, and recycling bins near the toilets. The biggest addition of all lies outside, where a barbecue and rows of outdoor seating have been installed beside the entrance.",
    paraTeach: {
      "2": {
        why: "改造图开头：before it was redesigned and the same café today——redesigned/today 两个时间锚点，一句完成（the same 呼应同址对比）。",
        modelPara: "The diagrams show a college café before it was redesigned and the same café today.",
        expressions: [
          { en: "before it was redesigned", zh: "重新设计之前（被动时间从句）" },
          { en: "the same café today", zh: "如今的同一咖啡馆（现在锚点）" }
        ],
        guideQ: "改造图开头你的两个时间锚点用了吗？"
      },
      "3": {
        why: "概括两句定性：句1=餐饮选择大大丰富（range of food and drink），句2=员工设施的空间归还给了顾客——「空间重新分配」是本图改造的本质，比罗列新增高一层。",
        modelPara: "It is clear that the café now offers a far wider range of food and drink. It is also noticeable that the space once given over to staff facilities has been handed back to customers.",
        expressions: [
          { en: "a far wider range of food and drink", zh: "餐食饮品选择丰富得多（定性句）" },
          { en: "the space once given over to staff facilities has been handed back to customers", zh: "曾经的员工设施空间已归还顾客（空间重配句）" }
        ],
        guideQ: "改造的本质（空间给了谁）你点破了吗？它比新增了什么更能概括全图。"
      },
      "4": {
        why: "细节一=旧布局（过去时）：was simple 总起，冒号后按「厨房-服务区-座位区-员工餐厅-厕所」走一遍，each带功能（serving area for all food & drink）——旧图简写，一笔一个。",
        modelPara: "In its original form, the café was simple: a kitchen with a single serving area for all food and drink, a large seating area of tables and chairs, staff dining rooms in one corner, and toilets by the side entrance.",
        expressions: [
          { en: "a single serving area for all food and drink", zh: "唯一的售卖区供应全部餐饮（single点出简陋）" },
          { en: "staff dining rooms in one corner", zh: "一角的员工餐厅（将被改造的对象）" }
        ],
        guideQ: "旧布局里「注定要被改造」的对象，你点出了吗？single/staff 这些词就是伏笔。"
      },
      "5": {
        why: "细节二=今天（现在完成时/一般现在时）：serving area→hot-meals counter（改用途），salad bar/take away/coffee bar/recycling bins（新增）用 ring the seating area 一句归位，员工餐厅位用 where... used to be 指明前身；barbeque+outdoor seating 作为 the biggest addition of all 收尾。",
        modelPara: "Today the kitchen is still there, but the serving area has become a hot-meals counter, and new facilities ring the seating area — a salad bar on one side, a take-away counter and coffee bar where the staff dining rooms used to be, and recycling bins near the toilets. The biggest addition of all lies outside, where a barbecue and rows of outdoor seating have been installed beside the entrance.",
        expressions: [
          { en: "the serving area has become a hot-meals counter", zh: "售卖区已变为热食柜台（become改用途）" },
          { en: "a take-away counter and coffee bar where the staff dining rooms used to be", zh: "外带柜台与咖啡吧设在原员工餐厅处（where...used to be）" },
          { en: "The biggest addition of all lies outside", zh: "最大的新增在室外（收尾主旨句）" }
        ],
        guideQ: "每处新增的「前身」，你用 where...used to be 这类结构点明了吗？"
      }
    }
  },
  "剑21 Test 2 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Now that almost any film or performance can be streamed at home, some claim that theatres and cinemas have lost their reason to exist, while others insist they remain vital. I side with the second view: far from being made redundant by the digital age, live and communal entertainment offers what no screen can supply.\n\nThose who consider these venues obsolete reason from pure convenience. Streaming costs a fraction of a cinema ticket, offers unlimited choice and allows the viewer to pause, rewind and watch in pyjamas; by every measure of comfort and price, the living room has won. If the only purpose of a cinema were delivering images to an audience, the case would already be closed, and the steady closure of small venues suggests many consumers have reached exactly that conclusion.\n\nYet reducing entertainment to convenience misunderstands what people are buying. A theatre or cinema sells an event: the darkness, the shared laughter, the collective silence, and the simple fact of being one body of strangers responding together. Economically, the venues anchor whole high streets, since every ticket sold drags along restaurant meals and late buses; culturally, they are the nurseries where writers, actors and directors learn their craft, feeding the very streaming platforms that supposedly replace them. It is no accident that the most successful streaming shows are celebrated first in cinemas and theatres, which still confer the prestige that a phone screen cannot.\n\nIn conclusion, while the convenience argument explains why many people now stream rather than pay for seats, it does not follow that the venues are unimportant: they remain economic anchors, cultural nurseries and the only places where entertainment is genuinely shared, and that is a form of importance no technology has abolished.",
    paraTeach: {
      "2": {
        why: "讨论题开头：句1改写双方（lost their reason to exist ↔ remain vital，动词短语对仗），句2 I side with the second view + 冒号后立刻给出立场内核（live and communal entertainment offers what no screen can supply）——「选边+一句内核」比干巴巴的表态高一层。",
        modelPara: "Now that almost any film or performance can be streamed at home, some claim that theatres and cinemas have lost their reason to exist, while others insist they remain vital. I side with the second view: far from being made redundant by the digital age, live and communal entertainment offers what no screen can supply.",
        expressions: [
          { en: "I side with the second view", zh: "我站在第二种观点一边（选边句）" },
          { en: "far from being made redundant by the digital age", zh: "非但没有被数字时代淘汰（far from让步）" },
          { en: "offers what no screen can supply", zh: "提供屏幕给不了的东西（立场内核）" }
        ],
        guideQ: "你选边之后，有没有用冒号补一句「立场内核」？内核句决定后续两段的走向。"
      },
      "3": {
        why: "A方段从对方最强处写起（convenience 三连：价格/选择/暂停快进睡衣看），再用让步式假说推进（If the only purpose were delivering images... the case would already be closed）——虚拟语气的「假设立场」既写出对方逻辑又埋下被反驳的裂缝，还顺手承认了 small venues 倒闭的现实。",
        modelPara: "Those who consider these venues obsolete reason from pure convenience. Streaming costs a fraction of a cinema ticket, offers unlimited choice and allows the viewer to pause, rewind and watch in pyjamas; by every measure of comfort and price, the living room has won. If the only purpose of a cinema were delivering images to an audience, the case would already be closed, and the steady closure of small venues suggests many consumers have reached exactly that conclusion.",
        expressions: [
          { en: "reason from pure convenience", zh: "从纯粹的便利出发推理（A方逻辑定性）" },
          { en: "by every measure of comfort and price, the living room has won", zh: "论舒适与价格，客厅全面获胜（对仗让步）" },
          { en: "If the only purpose of a cinema were delivering images to an audience, the case would already be closed", zh: "假如影院只是传图，此案早已了结（虚拟语气埋裂缝）" }
        ],
        guideQ: "你转述对方时用了「假如他们的前提成立」的虚拟句吗？既是转述又是伏笔。"
      },
      "4": {
        why: "我方段三层：体验层（an event：黑暗/共同的笑声/集体的沉默/一群陌生人同频共振——四个具象细节替代「氛围好」的空话）→经济层（anchor high streets，一张票带动的餐饮公交链条）→文化层（ nurseries of 编剧演员导演，反哺流媒体）——最后 reciprocity 一击（最成功的流媒体剧反而在影院剧院获得礼赞）。",
        modelPara: "Yet reducing entertainment to convenience misunderstands what people are buying. A theatre or cinema sells an event: the darkness, the shared laughter, the collective silence, and the simple fact of being one body of strangers responding together. Economically, the venues anchor whole high streets, since every ticket sold drags along restaurant meals and late buses; culturally, they are the nurseries where writers, actors and directors learn their craft, feeding the very streaming platforms that supposedly replace them. It is no accident that the most successful streaming shows are celebrated first in cinemas and theatres, which still confer the prestige that a phone screen cannot.",
        expressions: [
          { en: "A theatre or cinema sells an event", zh: "剧场影院卖的是一场事件（重新定义句）" },
          { en: "one body of strangers responding together", zh: "一群陌生人同频共振的共同体（体验具象化）" },
          { en: "the nurseries where writers, actors and directors learn their craft", zh: "编剧演员导演的摇篮（文化功能）" }
        ],
        guideQ: "你反驳「便利论」时重新定义了「卖的是什么」吗？重新定义比逐条反驳更致命。"
      },
      "5": {
        why: "一句话结论：while 让步回收便利论 + it does not follow that 的逻辑否定（便利≠不重要）+ 三个身份并列收口（economic anchors, cultural nurseries, genuinely shared）+ no technology has abolished 定性——把批判写成三连标签，结尾整齐有力。",
        modelPara: "In conclusion, while the convenience argument explains why many people now stream rather than pay for seats, it does not follow that the venues are unimportant: they remain economic anchors, cultural nurseries and the only places where entertainment is genuinely shared, and that is a form of importance no technology has abolished.",
        expressions: [
          { en: "it does not follow that", zh: "但这推不出……（逻辑否定句型）" },
          { en: "economic anchors, cultural nurseries and the only places where entertainment is genuinely shared", zh: "经济锚点、文化摇篮、真正共享的场所（三连标签收口）" }
        ],
        guideQ: "你的结论用「它推不出」点破对方的逻辑跳跃了吗？指出逻辑谬误是讨论题的高级收尾。"
      }
    }
  },
  "剑21 Test 3 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "自然过程图（场景式）：The formation of rain-shadow deserts。编号7步：①Winds approach coast ②Winds forced upwards ③Moist air cools ④Clouds form ⑤Rain falls ⑥Dry air continues down leeward side ⑦Dry winds reach coast。场景：左侧sea，中部mountain（windward side迎风坡绿/leeward side背风坡黄），右侧 rain-shadow desert，比例尺 thousands of kilometres。",
    essay: "The diagram shows how a rain-shadow desert is formed on the side of a mountain range facing away from the sea.\n\nIt is clear that the desert is created not by a lack of wind or water in the region, but by a mountain range stripping the air of its moisture before that air descends. It is also noticeable that the two sides of the same mountain, just kilometres apart, end up with opposite climates.\n\nThe process begins over the ocean, where moist air is blown towards the coast. When it meets the mountain range, it has nowhere to go but upwards, and as it climbs the windward slope it cools; the vapour inside condenses into clouds and falls as heavy rain, which is why the coastal side is lush and green.\n\nBy the time the air crosses the summit, however, it has lost almost all its moisture. It sinks down the far side, and the increasing pressure warms it as it descends, so that it arrives at the leeward slope as hot, dry wind. With no moisture left to give, it brings no rain, and the land slowly dries out into the desert that gives the phenomenon its name.",
    paraTeach: {
      "2": {
        why: "自然过程图开头：is formed on the side... facing away from the sea——分词短语精确定位「背风坡」，开头即解决全图最重要的空间设定。",
        modelPara: "The diagram shows how a rain-shadow desert is formed on the side of a mountain range facing away from the sea.",
        expressions: [
          { en: "how a rain-shadow desert is formed", zh: "雨影沙漠如何形成（术语保留+被动）" },
          { en: "facing away from the sea", zh: "背向大海的一侧（分词定位背风坡）" }
        ],
        guideQ: "自然过程的开头你把「发生在哪里」一次说清了吗？"
      },
      "3": {
        why: "概括两句：句1=机制本质（不是缺水缺风，而是山「抽干」了空气水分，not by... but by 结构），句2=最强反差（同山两侧、几公里之隔，气候相反）——自然过程图的概括写机制与反差，不写步数。",
        modelPara: "It is clear that the desert is created not by a lack of wind or water in the region, but by a mountain range stripping the air of its moisture before that air descends. It is also noticeable that the two sides of the same mountain, just kilometres apart, end up with opposite climates.",
        expressions: [
          { en: "not by a lack of wind or water in the region, but by a mountain range stripping the air of its moisture", zh: "并非缺水缺风、而是山剥去了空气水分（not by but by机制定性）" },
          { en: "the two sides of the same mountain, just kilometres apart, end up with opposite climates", zh: "几公里之隔的两侧气候相反（最强反差句）" }
        ],
        guideQ: "自然过程的概括你点破「因果机制的本质」了吗？不是复述步骤而是解释为什么。"
      },
      "4": {
        why: "细节一=迎风半程（对应图①-⑤）：moist air blown coastward→nowhere to go but upwards→cools→condenses→heavy rain→lush and green（which is why 回扣结果）——主动语态讲空气的旅程，因果链一句扣一句。",
        modelPara: "The process begins over the ocean, where moist air is blown towards the coast. When it meets the mountain range, it has nowhere to go but upwards, and as it climbs the windward slope it cools; the vapour inside condenses into clouds and falls as heavy rain, which is why the coastal side is lush and green.",
        expressions: [
          { en: "it has nowhere to go but upwards", zh: "空气别无去路只能爬升（拟物句）" },
          { en: "the vapour inside condenses into clouds and falls as heavy rain", zh: "水汽凝云、化作大雨（主动语态因果链）" },
          { en: "which is why the coastal side is lush and green", zh: "这正是沿海一侧葱郁的原因（which is why回扣）" }
        ],
        guideQ: "自然过程你通篇用主动语态讲故事了吗？出现大量被动就写成了机械流程。"
      },
      "5": {
        why: "细节二=背风半程（对应图⑥-⑦）+得名收尾：By the time the air crosses the summit（转场）→sinks→pressure warms→hot, dry wind→With no moisture left to give 分词短语点根源→the desert that gives the phenomenon its name 同位语收尾——现象图的终点就是图名本身。",
        modelPara: "By the time the air crosses the summit, however, it has lost almost all its moisture. It sinks down the far side, and the increasing pressure warms it as it descends, so that it arrives at the leeward slope as hot, dry wind. With no moisture left to give, it brings no rain, and the land slowly dries out into the desert that gives the phenomenon its name.",
        expressions: [
          { en: "By the time the air crosses the summit", zh: "待空气越过山顶（转场）" },
          { en: "the increasing pressure warms it as it descends", zh: "下沉增压使空气再升温（下沉增温机制）" },
          { en: "the desert that gives the phenomenon its name", zh: "让这一现象得名的沙漠（同位语收尾）" }
        ],
        guideQ: "你的最后一步和图的名字接上了吗？现象图的终点就是图名本身。"
      }
    }
  },
  "剑21 Test 3 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "Whether every undergraduate course should include a term abroad or a work placement divides both students and employers. I believe the advantages of such a requirement would outweigh the disadvantages, provided universities treat it as part of education rather than as an administrative box-ticking exercise.\n\nThe case for the requirement rests on what classrooms cannot teach. A placement, however modest, forces students to translate theory into the messier currency of real work: deadlines that move, colleagues who disagree and clients who change their minds. Study abroad does the same for character, since navigating a foreign bureaucracy, flat hunt or simply a different classroom culture builds an independence that no lecture can. Employers consistently reward both: graduates who have spent time in industry or overseas receive more interviews and higher starting offers, because they arrive with evidence of initiative as well as knowledge.\n\nThe costs are genuine and fall unevenly. A term abroad can be ruinously expensive, and unless funding follows the student, the requirement quietly filters university opportunity towards the wealthy; a badly chosen placement can be little more than unpaid photocopying, wasting months that might have gone into serious study. Some subjects suffer too, since a chemistry laboratory course cannot simply pause for a semester away. These problems, however, are arguments for careful design rather than for abandonment: means-tested grants can neutralise the financial filter, universities can vet placements instead of outsourcing them to luck, and science degrees can meet the requirement with industrial laboratory terms that strengthen rather than interrupt the discipline.\n\nIn conclusion, a compulsory placement or period abroad would impose real costs on money and timetables, but it supplies the workplace maturity and independence that degrees otherwise lack, and its dangers are design problems that competent universities can solve.",
    paraTeach: {
      "2": {
        why: "利弊题开头：句1改写（divides both students and employers 点出争议双方），句2表态 advantages outweigh + provided 条件限定（教育而非形式主义）——条件限定既是立场的一部分，也是后文批判段的伏笔（体系1.2）。",
        modelPara: "Whether every undergraduate course should include a term abroad or a work placement divides both students and employers. I believe the advantages of such a requirement would outweigh the disadvantages, provided universities treat it as part of education rather than as an administrative box-ticking exercise.",
        expressions: [
          { en: "divides both students and employers", zh: "令学生与雇主都有分歧（争议双方具象）" },
          { en: "provided universities treat it as part of education rather than as an administrative box-ticking exercise", zh: "前提是当作教育而非打勾形式（条件限定+伏笔）" }
        ],
        guideQ: "你的表态条件（provided...）为哪一段埋了伏笔？条件式表态要前后呼应。"
      },
      "3": {
        why: "优点段「课堂教不了的」双层：实习=把理论翻译成现实工作的乱账（deadlines that move, colleagues who disagree——三个名词性从句排比具象化）；留学=性格独立（foreign bureaucracy/flat hunt 的具体小事）；第三层收在雇主回报（more interviews and higher starting offers 证据句）。",
        modelPara: "The case for the requirement rests on what classrooms cannot teach. A placement, however modest, forces students to translate theory into the messier currency of real work: deadlines that move, colleagues who disagree and clients who change their minds. Study abroad does the same for character, since navigating a foreign bureaucracy, flat hunt or simply a different classroom culture builds an independence that no lecture can. Employers consistently reward both: graduates who have spent time in industry or overseas receive more interviews and higher starting offers, because they arrive with evidence of initiative as well as knowledge.",
        expressions: [
          { en: "translate theory into the messier currency of real work", zh: "把理论兑换成更混乱的现实货币（隐喻）" },
          { en: "deadlines that move, colleagues who disagree and clients who change their minds", zh: "会漂的截止日、有异议的同事、变卦的客户（三连排比）" },
          { en: "they arrive with evidence of initiative as well as knowledge", zh: "带着主动性+知识的双重证据入职（雇主视角收口）" }
        ],
        guideQ: "你的优点有没有落到「雇主看得见的证据」？抽象成长不如一份面试邀请。"
      },
      "4": {
        why: "缺点段三连+逐条拆解：钱（ruinously expensive→筛向富人）、质量差实习（unpaid photocopying 的辛辣具象）、学科冲突（化学实验停不了）；每个缺点后 immediately 给解法（means-tested grants/vet placements/工业实验学期）——「缺点与解法一一配对」是 outweigh 题的压舱写法。",
        modelPara: "The costs are genuine and fall unevenly. A term abroad can be ruinously expensive, and unless funding follows the student, the requirement quietly filters university opportunity towards the wealthy; a badly chosen placement can be little more than unpaid photocopying, wasting months that might have gone into serious study. Some subjects suffer too, since a chemistry laboratory course cannot simply pause for a semester away. These problems, however, are arguments for careful design rather than for abandonment: means-tested grants can neutralise the financial filter, universities can vet placements instead of outsourcing them to luck, and science degrees can meet the requirement with industrial laboratory terms that strengthen rather than interrupt the discipline.",
        expressions: [
          { en: "can be little more than unpaid photocopying", zh: "可能只是无薪复印（辛辣具象）" },
          { en: "arguments for careful design rather than for abandonment", zh: "是改进设计的理由而非放弃的理由（定位句）" },
          { en: "means-tested grants can neutralise the financial filter", zh: "按需助学金可中和金钱筛子（解法对应）" }
        ],
        guideQ: "你的每个缺点后面都配了对策吗？缺点-对策一一配对让 outweigh 无懈可击。"
      },
      "5": {
        why: "一句话结论：impose real costs on money and timetables 收缺点 + supplies the workplace maturity and independence 收优点 + design problems that competent universities can solve 回收 provided 条件——结尾宣告「问题都是可解的」，与开头条件完全闭环。",
        modelPara: "In conclusion, a compulsory placement or period abroad would impose real costs on money and timetables, but it supplies the workplace maturity and independence that degrees otherwise lack, and its dangers are design problems that competent universities can solve.",
        expressions: [
          { en: "impose real costs on money and timetables", zh: "对钱包与课表都有真实代价（缺点回收）" },
          { en: "design problems that competent universities can solve", zh: "是称职大学能解决的设计问题（回收条件收尾）" }
        ],
        guideQ: "你的结论回收了开头的 provided 条件吗？首尾闭环是条件式立场的完成动作。"
      }
    }
  },
  "剑21 Test 4 T1": {
    source: "ZCode 体系生成 · 2026-09-17 · 数据已对照剑桥原书原图核正（v2）",
    chartNote: "饼图+表。饼图 Categories of library users：full-time undergraduate 44%、full-time postgraduate 25%、part-time postgraduate 16%、distance learning (all courses) 8%、academic staff 7%。表 Library user satisfaction (%)：opening hours 65/35/0；helpfulness of staff 95/5/0；availability of books 50/40/10；availability of journals 45/35/20；reliability of wi-fi 48/33/19（三列=very satisfied/fairly satisfied/not satisfied）。",
    essay: "The pie chart shows the categories of users of a university library, and the table shows how satisfied those users were with five aspects of the service.\n\nIt is clear that full-time undergraduates dominate the user base. It is also noticeable that the helpfulness of staff earned the strongest approval, while the availability of journals and the reliability of the wi-fi were the weakest points.\n\nFull-time undergraduates accounted for 44% of users, and a further 25% were full-time postgraduates, so nearly seven in ten users were studying on campus full time. Part-time postgraduates made up 16%, distance learners 8%, and academic staff the remaining 7%.\n\nThe satisfaction table shows a service strong on people and weaker on resources. Staff helpfulness was praised by 95% of users, with none dissatisfied, and even opening hours satisfied every respondent at least partly. The availability of books scored 50% very satisfied, but journals (45% and 20% not satisfied) and wi-fi reliability (48% and 19%) attracted the most criticism.",
    paraTeach: {
      "2": {
        why: "图表组合开头一句一图：the categories of users（饼图）+ how satisfied those users were with five aspects（表格问题）——两个名词/疑问短语精准概括两图。",
        modelPara: "The pie chart shows the categories of users of a university library, and the table shows how satisfied those users were with five aspects of the service.",
        expressions: [
          { en: "the categories of users of a university library", zh: "大学图书馆的用户类别（饼图主题）" },
          { en: "how satisfied those users were with five aspects of the service", zh: "用户对五方面服务的满意度（表格主题）" }
        ],
        guideQ: "双图开头是否一句一图、各领主题？"
      },
      "3": {
        why: "概括一句一图：饼图=全日制本科生主导（dominate the user base）；表=人员帮助满意度最高、期刊与wifi最弱——「最强点+最弱点」一句话把表格的结论说尽。",
        modelPara: "It is clear that full-time undergraduates dominate the user base. It is also noticeable that the helpfulness of staff earned the strongest approval, while the availability of journals and the reliability of the wi-fi were the weakest points.",
        expressions: [
          { en: "dominate the user base", zh: "主导用户群体（饼图头条）" },
          { en: "the helpfulness of staff earned the strongest approval, while the availability of journals and the reliability of the wi-fi were the weakest points", zh: "最强项与最弱项对举（表格头条）" }
        ],
        guideQ: "满意度表你先找「最高行」和「最低行」了吗？中流行不用逐个报。"
      },
      "4": {
        why: "细节一=饼图：44% + 25% 合成 nearly seven in ten（加总换算一句），其余三类 16%/8%/7% 递减排列，the remaining 7% 收尾——加总+归堆双手法（体系2.3）。",
        modelPara: "Full-time undergraduates accounted for 44% of users, and a further 25% were full-time postgraduates, so nearly seven in ten users were studying on campus full time. Part-time postgraduates made up 16%, distance learners 8%, and academic staff the remaining 7%.",
        expressions: [
          { en: "so nearly seven in ten users were studying on campus full time", zh: "近七成用户为全日制（so引出加总结论）" },
          { en: "Part-time postgraduates made up 16%, distance learners 8%", zh: "非全日制研究生16%、远程教育8%（递减并列）" },
          { en: "academic staff the remaining 7%", zh: "教职员占其余7%（省略动词收尾）" }
        ],
        guideQ: "44%+25% 你合成「七成」了吗？加总换算是饼图的加分动作。"
      },
      "5": {
        why: "细节二=满意度表：strong on people and weaker on resources 一句定性分组——人员帮助95%满赞/0不满 与 opening hours 65/35/0 归为「强项组」，books 50/40/10、journals 45/35/20、wifi 48/33/19 归为「弱项组」；括号插入数字最省字。",
        modelPara: "The satisfaction table shows a service strong on people and weaker on resources. Staff helpfulness was praised by 95% of users, with none dissatisfied, and even opening hours satisfied every respondent at least partly. The availability of books scored 50% very satisfied, but journals (45% and 20% not satisfied) and wi-fi reliability (48% and 19%) attracted the most criticism.",
        expressions: [
          { en: "a service strong on people and weaker on resources", zh: "对人是强项、对资源是弱项（定性分组句）" },
          { en: "praised by 95% of users, with none dissatisfied", zh: "95%用户称赞、无人不满（with复合结构）" },
          { en: "attracted the most criticism", zh: "招致最多批评（弱项收尾）" }
        ],
        guideQ: "五行满意度你「分组」了吗？强项组与弱项组各写一句，胜过五行各报一遍。"
      }
    }
  },
  "剑21 Test 4 T2": {
    source: "ZCode 体系生成 · 2026-09-17 · 写法标准见 knowledge/13-我的写作体系.md",
    essay: "There is a widespread complaint that primary schools have become too academic, drilling young children in formal skills at the expense of play. I largely agree that the balance has shifted too far, and I would go further: play is not a break from learning in these years but the way young children actually learn.\n\nThe concern is grounded in what has visibly changed. Reading targets, standardised tests and structured homework have crept steadily downward into classrooms once filled with sandpits and dressing-up boxes, pushed by the fear that a child who falls behind at seven can never catch up. For a minority of pupils this early formality works, but for many it produces anxiety and a conviction that school is a place where they fail; teachers report seven-year-olds worried about test scores, which tells its own story about the cost of the experiment.\n\nThe importance of play in these years is not sentimental but scientific. Through play children rehearse the very skills that formal teaching later requires: a game of shop is arithmetic in action, building blocks teach the physics of balance, and a playground quarrel over rules is a first lesson in negotiation and fairness. Developmental research adds that concentration, memory and language all grow fastest through self-directed activity, and that children who are hurried into formal instruction early often plateau sooner than those who start later through play. Play also performs the social work that no worksheet can, mixing age groups, teaching children to lose, and burning off the energy that a desk cannot absorb.\n\nIn conclusion, formal learning has indeed pushed too far into the primary years, and since play is the natural engine of young children's cognitive and social development, the case for restoring it to the centre of the early classroom is overwhelming.",
    paraTeach: {
      "2": {
        why: "双问题（agree? + play importance）开头：句1改写（drilling... at the expense of play——把 complaint 具象成画面），句2双答：largely agree + go further（play 不只是休息而是学习方式）——go further 把第二问升格为自己的主张，两问有了主从关系。",
        modelPara: "There is a widespread complaint that primary schools have become too academic, drilling young children in formal skills at the expense of play. I largely agree that the balance has shifted too far, and I would go further: play is not a break from learning in these years but the way young children actually learn.",
        expressions: [
          { en: "drilling young children in formal skills at the expense of play", zh: "以牺牲游戏为代价训练 formal skills（题干的画面化改写）" },
          { en: "I largely agree that the balance has shifted too far, and I would go further", zh: "基本同意+更进一步（双问题递进式表态）" },
          { en: "play is not a break from learning in these years but the way young children actually learn", zh: "游戏不是学习的休息，而是幼儿学习本身（not A but B 立场金句）" }
        ],
        guideQ: "双问题题你的第二问是被动的回答，还是主动的「go further」？后者立意高一档。"
      },
      "3": {
        why: "同意段=现实证据链：formal 化的下移过程（targets/tests/homework crept downward into sandpits——沙坑与练习册的意象对撞）+动因（七岁落后论）+让步（对少数学生有效）+代价（焦虑+失败者心态+七岁孩子担心分数的「讲自己的故事」句）。",
        modelPara: "The concern is grounded in what has visibly changed. Reading targets, standardised tests and structured homework have crept steadily downward into classrooms once filled with sandpits and dressing-up boxes, pushed by the fear that a child who falls behind at seven can never catch up. For a minority of pupils this early formality works, but for many it produces anxiety and a conviction that school is a place where they fail; teachers report seven-year-olds worried about test scores, which tells its own story about the cost of the experiment.",
        expressions: [
          { en: "have crept steadily downward into classrooms once filled with sandpits", zh: "悄悄下渗进曾经堆满沙坑的教室（意象对撞）" },
          { en: "a conviction that school is a place where they fail", zh: "「学校是我失败的地方」的信念（代价具象化）" },
          { en: "which tells its own story about the cost of the experiment", zh: "这本身就说明了这场实验的代价（评注句）" }
        ],
        guideQ: "你让证据「自己讲故事」了吗？七岁孩子担心分数，比一百句批判更响。"
      },
      "4": {
        why: "第二问段=play的科学性三层：游戏即技能排练（shop game=算术/blocks=物理平衡/规则争吵=谈判与公平——三个等号式映射把抽象变具体）→发展研究（concentration/memory/language 经自主动作生长最快+早起步反plateau更早）→社交功能（混龄/学会输/释放精力）——层层递进全是机制不是口号。",
        modelPara: "The importance of play in these years is not sentimental but scientific. Through play children rehearse the very skills that formal teaching later requires: a game of shop is arithmetic in action, building blocks teach the physics of balance, and a playground quarrel over rules is a first lesson in negotiation and fairness. Developmental research adds that concentration, memory and language all grow fastest through self-directed activity, and that children who are hurried into formal instruction early often plateau sooner than those who start later through play. Play also performs the social work that no worksheet can, mixing age groups, teaching children to lose, and burning off the energy that a desk cannot absorb.",
        expressions: [
          { en: "not sentimental but scientific", zh: "并非多愁善感而是有科学依据（定性句）" },
          { en: "a game of shop is arithmetic in action", zh: "开店游戏就是活的算术课（等号式映射）" },
          { en: "hurried into formal instruction early often plateau sooner", zh: "被匆忙提前的孩子反而更早进入平台期（反直觉证据）" }
        ],
        guideQ: "你的「游戏重要」论据是三个等号式的具体映射，还是「培养创造力」式的空话？"
      },
      "5": {
        why: "一句话结论：indeed pushed too far 收第一问 + the natural engine of cognitive and social development 收第二问 + restoring it to the centre of the early classroom 的方案式表态收尾——两问各回收半句，结尾给出行动方向。",
        modelPara: "In conclusion, formal learning has indeed pushed too far into the primary years, and since play is the natural engine of young children's cognitive and social development, the case for restoring it to the centre of the early classroom is overwhelming.",
        expressions: [
          { en: "the natural engine of young children's cognitive and social development", zh: "幼儿认知与社交发展的天然引擎（第二问回收）" },
          { en: "restoring it to the centre of the early classroom", zh: "把游戏恢复到幼儿课堂的中心（方案式收尾）" }
        ],
        guideQ: "你的结尾给出了「该怎么做」吗？overwhelming 的底气来自方案。"
      }
    }
  }
};
