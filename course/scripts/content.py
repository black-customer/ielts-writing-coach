"""Original course content. No paid source paragraphs are reproduced here."""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]

def line(text, tag='', lang='en'):
    return {'text':text,'tag':tag,'lang':lang}

def scene(title, lines, *narration, chart=False):
    return {'title':title,'lines':lines,'narration':[{'text':n,'lang':'zh-CN'} if isinstance(n,str) else {'text':n[0],'lang':'en-GB'} for n in narration], 'chart':chart}

ESSAY_PROMPT = 'Governments should make public transport free for everyone to reduce traffic congestion. To what extent do you agree or disagree?'
ESSAY = [
    'Making public transport free is often proposed as a way to reduce congestion. I partly agree: cheaper travel can encourage some drivers to leave their cars at home, but reliable services and targeted support should take priority over free fares for everyone.',
    'Lower fares could make public transport a realistic option for people on tight budgets. A commuter comparing parking charges with the cost of a daily bus ticket may prefer driving if the bus offers little financial advantage. Removing the fare would change that comparison, particularly where services are frequent and the journey does not require several transfers. For example, a worker travelling directly from a residential area to the city centre could save money by switching to a free bus. In such circumstances, lower costs could reduce the number of cars on busy roads rather than simply benefit existing passengers.',
    'However, a universal free-fare policy would also subsidise passengers who can already afford to travel, while leaving more important barriers unresolved. A bus that arrives late or stops far from workplaces remains unattractive even when the ticket costs nothing. If governments use a limited transport budget to replace fare revenue, they may have less money to increase service frequency or maintain vehicles. Targeted discounts for low-income passengers, combined with dependable routes, would address both affordability and convenience. These improvements are more likely to persuade a wider range of commuters to stop driving because they respond to the reasons those people choose a car.',
    'Overall, free travel could help in some settings, but it is insufficient on its own. I would prioritise reliable public transport and financial support for those who need it most.'
]
REPORT_PROMPT='The table shows the percentage of commuters using three main modes of transport in the fictional city of Norchester in 2005, 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
REPORT=[
    'The table compares the proportions of commuters travelling by car, bus and bicycle in Norchester in three years between 2005 and 2025.',
    'Overall, the share of car users declined, while both bus use and cycling became more common. Cars were the leading mode in the first two years, but buses accounted for the largest proportion by 2025.',
    'In 2005, 55% of commuters used cars, compared with 30% who took buses and 15% who cycled. Ten years later, the car figure had fallen to 48%, although it remained ahead of buses and bicycles, which accounted for 32% and 20% respectively.',
    'By 2025, car use had dropped further to 35%, a decrease of 20 percentage points from its initial level. The proportion travelling by bus reached 40%, overtaking the car figure by five percentage points. Cycling also rose throughout the period, finishing at 25%. Both buses and bicycles gained ten percentage points over the two decades, and bicycles remained the least common option in each year.'
]

lessons=[]
def lesson(id,title,goal,prerequisite,scenes,exercise,answer,transfer,rubric,sources):
    lessons.append(dict(id=id,title=title,goal=goal,prerequisite=prerequisite,scenes=scenes,exercise=exercise,answer=answer,transfer=transfer,rubric=rubric,sources=sources,status='produced'))

lesson('01','听懂了，为什么还是写不出来？','从自己的初稿定位一个可修复的瓶颈，建立独立复测。','已了解 Task 1 / Task 2 的基本要求。',[
scene('先写，再解释',[line('Free buses can reduce traffic congestion.','原创观点'),line('写 70-100 词，解释为什么、在什么条件下成立。','先独立尝试','zh'),line('保留初稿；暂时不查范文和词伙库。','3 分钟','zh')],
'你已经看过 Simon，知道要有观点、解释和例子。但知道这些名称，并不意味着你能在新题上完成这些动作。这节课先不背方法。请暂停视频，用三分钟把免费公交能够减少拥堵这个观点展开。',
'保留第一次写的版本，包括卡住的地方。我们需要看见真实的起点。如果先读示范，再写相似句子，你测到的可能只是模仿能力。播放器下方可以保存初稿；也可以用自己的笔记本。'),
scene('结构齐全，也可能没有展开',[line('Free buses are good for society.','弱稿'),line('This is because public transport is important.','解释？'),line('For example, many people take buses.','例子？')],
'这是一段原创的弱稿。它有观点、有因为、有例如，看起来很像你学过的结构。问题是，重要没有解释好处怎样产生，许多人乘公交也没有证明免费会让开车的人换乘。形式填满了，推理仍然空着。',
'我们不会凭这三句话宣布一个官方分数。整篇写作还需要结合题目、其他段落和语言判断。这里只定位一个可观察的问题：免费票价到减少拥堵之间，缺了一条能够跟随的机制。'),
scene('把四项标准变成四个检查动作',[line('TR / TA：我回答并支撑了题目要求吗？','任务','zh'),line('CC：读者能跟着每句信息往前走吗？','组织','zh'),line('LR：词语表达的意思和搭配准确吗？','词汇','zh'),line('GRA：我能控制所使用的句式吗？','语法','zh')],
'官方评分观察任务、组织、词汇和语法。我们的训练把它们转成检查动作：先看是否答对问题，再看推理是否连得起来，再检查具体词义和句式。它们共同作用，不能把某一个技巧当成高分的捷径。',
'拿这段弱稿来说，优先补推理比把 good 换成一个生僻形容词更值得做。这是针对这段文字的修复次序，不是说词汇和语法不重要。如果错误已经让意思无法理解，当然要先恢复基本表达。'),
scene('一次只修一个瓶颈',[line('lower fares → cheaper commute → some drivers switch','机制'),line('Only if buses are frequent and routes are convenient.','条件'),line('For a direct city-centre journey, ...','具体场景')],
'现在把笼统好处拆开：票价降低，通勤成本可能下降，一部分司机才有理由换乘。再加一个条件：班次足够、线路方便。否则，免费但难用的服务并不能吸引他们。你开始在回答为什么，而不只是说它很好。',
('Lower fares may encourage some drivers to use buses, especially when frequent services connect their homes directly with their workplaces.',),
'注意 may 和 some。它们把结论限制在我们能够支撑的范围内。条件不是装饰，它防止你把一条可能成立的因果链夸大成对所有人的保证。'),
scene('改写要留下证据',[line('初稿：public transport is important','原句'),line('改稿：fare → cost → switching, under a condition','新信息'),line('自查：圈出机制，划出条件。','验证','zh')],
'请回到你的初稿，只改这一件事：写明为什么某类人会改变出行选择。改完，圈出机制，划出条件。不要只写已经展开了，要能指给别人看是哪一句提供了什么新信息。',
'如果你现在只是把屏幕上的句子抄下来，也没有关系，但请将它标记为辅助改写。我们不会把辅助完成算成独立掌握。真正的检验发生在下一步。'),
scene('换题，检验方法能否留下来',[line('Should libraries stay open later for working adults?','新题'),line('写一段：谁受益 → 怎么受益 → 什么条件。','24 小时后','zh'),line('不查旧范文；比较机制是否具体。','复测','zh')],
'明天换到图书馆延长开放时间的题目，不看今天的句子，解释上班族怎样受益。场景变了，但你仍要找出主体、改变和条件。如果只能在免费公交上写出来，说明你记住的是例句，还没有掌握动作。',
'记录三件事：初稿卡在哪里，改稿补了什么，换题还能不能独立做到。播放完成只是学习记录。目标是逐渐把这些动作带进完整的限时作文，最后再用外部反馈检验成绩。')
],
'教学模拟题：Free buses can reduce traffic congestion. 不查资料写 70-100 词支撑段。保留初稿。随后只改一个问题，并用中文写出「我补了什么信息」。',
'参考机制：降低通勤成本 → 线路直接且班次可靠时，一部分原本开车的通勤者转乘 → 高峰车流可能减少。不是所有乘客增加都等于司机减少；原本步行者或现有乘客受益不直接证明拥堵改善。',
'24 小时后：Should libraries stay open later for working adults? 独立写 70-100 词；3 天后换到 flexible working hours。',
['有明确的受益者或决策者','解释了改变产生效果的中间步骤','写出了适用条件或范围','能够在未见题上复现同一个思考动作'],['S01','S02','L01']),

lesson('02','审题之后，要有一张回答地图','把题目的对象、限制与问句映射到提纲，避免写成宽泛话题作文。','能辨认观点题、讨论题与直接问句。',[
scene('同一话题，不是同一道任务',[line('Some people think online courses should replace','题干'),line('classroom teaching at universities.','范围'),line('To what extent do you agree or disagree?','任务')],
'很多人看到 online courses，就拿出在线教育的好处和坏处。但这道原创题问的是大学课堂是否应该被替代。在线教育有用，并不能自动证明它应该完全取代课堂。把话题写熟，仍然可能没有回答任务。',
'请暂停，写下题目里的三个限制：谁的教育，替代什么，替代到什么程度。然后用一句话直接回答应不应该替代。先用中文也可以，关键是答案不要躲在大话题背后。'),
scene('回答地图：对象、动作、程度',[line('对象：university students','谁','zh'),line('动作：replace classroom teaching','做什么','zh'),line('程度：fully / partly / in selected situations','到什么程度','zh'),line('任务：给出并论证你的判断。','回应','zh')],
'回答地图不是题型标签，而是你的写作责任。对象是大学学习者，动作是替代课堂，程度要由你的立场说清楚。题目里的 should 是政策判断，你需要解释选择的理由，而不只是描述现象。',
'如果你选择部分同意，就把边界写清楚。比如理论讲授可转线上，而实验和互动讨论仍需要面对面的安排。边界随后必须被两个主体段实际论证，不能只在开头说取决于情况。'),
scene('从空立场到可执行立场',[line('Both methods have advantages and disadvantages.','未回答替代'),line('Online lectures can supplement university teaching,','立场'),line('but practical classes should remain face to face.','边界')],
'两种方式都有优缺点，这句话没有告诉读者你对替代的判断。下面的立场则直接说线上讲授可以补充大学教学，而实践课保留面授。它给提纲提供了两项具体任务。',
('Online lectures can supplement university teaching, but practical classes should remain face to face.',),
'表达可以有许多版本。我们不要求你记住这一句，而是要求读者能从你的立场预测接下来应该看到什么证据。'),
scene('先分任务，再分段',[line('主体段 A：线上理论课的价值与适用范围','为什么可用','zh'),line('主体段 B：实践任务为何仍需面对面','为什么不能全替','zh'),line('结论：补充与选择性使用，保留核心边界','判断一致','zh')],
'四段是这道题方便的安排：开头、两段理由、结尾。它方便，是因为两段有不同任务，而不是因为评分表规定必须四段。若任务更复杂，也可以采用不同结构。段落数跟着内容走。',
'检查提纲时，问两个问题。第一，哪一段解释了线上可以承担哪些任务。第二，哪一段解释了为什么不能完全替代。如果你有一段只赞美互联网发展，它可能没有承担题目要求。'),
scene('改一下问句，提纲就必须跟着改',[line('Why are online courses becoming more common?','新问句 1'),line('Is this a positive or negative development?','新问句 2'),line('需要：原因 + 评价；不能只讨论替代。','覆盖检查','zh')],
'现在保留在线课程这个话题，换成两个问题：为什么越来越普遍，是积极还是消极的发展。此时你要解释普及的原因，再作评价。原来的替代课堂提纲不能原样搬过去。',
'一种可行安排是先讲原因，再讲带有边界的评价。但你也可以作其他合理安排。重要的是，每个问句都能在文章里找到明确回答，回答之间有清楚的组织关系。'),
scene('90 秒提纲复测',[line('Museums should offer free entry to all visitors.','教学模拟题'),line('To what extent do you agree or disagree?','任务'),line('标范围，选立场，给两段各写一项任务。','暂停练习','zh')],
'请用九十秒给博物馆免费开放写一张回答地图。注意 all visitors 的范围，想一想免费对可及性和运营资金分别意味着什么。先不要写长句，也不要查博物馆话题词。',
'完成后，用另一种颜色圈出直接回答 should 的部分。每个主体段再写一句：这一段为什么能支持我的判断。如果你解释不出来，就先修改提纲，别急着扩写。')
],
'给在线课程替代大学课堂题写回答地图，随后给「原因 + 评价」版本重写提纲。列出保留了什么、必须改变什么。每份提纲不超过 80 字中文。',
'替代题：选择性使用，线上适合可重复理论讲授，面授适合实践及即时反馈。原因/评价题：成本与灵活性解释普及；可及性收益与学习互动限制支持条件性评价。只有题干相同，才可能沿用任务地图。',
'新题：Museums should offer free entry to all visitors. 90 秒完成对象/动作/范围/立场/两段任务。',
['立场直接回应问句','范围没有悄悄扩大或缩小','每个主体段承担不同的回答责任','更换问句后确实调整了提纲'],['S01','S02','S08']),

lesson('03','没有思路时，怎样造出可写的观点','用具体人物的决策生成因果链，再筛选相关、可解释、有差异的两条观点。','已经会圈出题目对象与范围。',[
scene('先让一个具体的人进入题目',[line('Free public transport for everyone?','教学模拟题'),line('Who changes a decision, and why?','思考入口'),line('不要先列 economy / society / environment。','避免空分类','zh')],
'没有思路时，许多人先列经济、社会、环境三个大词，然后每个大词又解释不出来。我们换一个入口：谁会因为这项政策改变一个决定。对于免费公交，想一个住在郊区、每天去市中心工作的通勤者。',
'不用捏造调查和百分比。只需给这个人物一个合理场景，观察价格、时间和线路怎样影响他的选择。具体场景是推理工具，不是你知道某个真实城市事实的证明。'),
scene('先拆决策，再选理由',[line('Person：a commuter on a limited budget','主体'),line('Choice：drive or take a direct bus','决策'),line('Barrier：cost / unreliable service / long transfers','障碍'),line('Policy：remove fares, but not all other barriers','政策边界')],
'这个人选择开车还是公交。价格可能是障碍，班次不可靠和换乘过长也可能是障碍。免费只处理价格。于是你自然获得两个可写方向：对价格敏感的人可能受益，但其他人仍需要可靠、直接的服务。',
'这比只写公共交通有利于环境更贴合题目，因为我们能解释政策怎样影响出行方式，再连接到拥堵。你并没有靠搜到一个高深观点，而是把决策中的变量拆开了。'),
scene('把箭头说成完整解释',[line('fare removed → lower travel cost','第一步'),line('lower cost + usable route → some drivers switch','关键条件'),line('fewer cars at peak times → less congestion','回到题目')],
'画出箭头之后，每一条箭头都要经得起追问。为什么价格下降就会换乘？只有在服务本来就可用、成本又是重要顾虑时才较合理。为什么乘客更多就减轻拥堵？新增乘客必须有一部分原本开车。',
'最后一步回到题目，而不是停在省钱。题目目标是减少拥堵，省钱只是中间机制。写作时最容易遗漏的正是从你喜欢的好处返回题目评价的这一段。'),
scene('两条理由必须有不同的工作',[line('Reason A：fare reduction addresses affordability','作用 A'),line('Reason B：reliability addresses convenience','作用 B'),line('Rejected：good for society / good for people','重复空泛')],
'现在筛选两条理由。可负担性和可靠性处理不同障碍，可以形成互补的论证。对社会好和对人们好则很可能在重复同一层意思。段落数量再多，也不会自动增加深度。',
'给每条理由做三个检查：是否直接回答题目，能否解释至少一个中间步骤，两条之间是否有不同任务。任何一项过不去，就换理由，别花时间给空观点找漂亮英语。'),
scene('让步不是突然倒向反方',[line('Free fares may help where services are already good.','承认作用'),line('They are less useful when poor service is the barrier.','限定范围'),line('Therefore, targeted support and reliability come first.','同一判断')],
'这组三句话承认免费在一些条件下有效，也解释为什么我们不支持对所有人一律免费。让步是在完善同一个判断，不是在写到一半突然反对自己。',
('Free fares may help where services are already good. They are less useful when poor service is the main barrier.',),
'你可以完全同意，也可以部分同意。选哪一个，取决于你能够稳定论证的答案。复杂立场如果让你自相矛盾，就没有必要追求复杂。'),
scene('不看资料，生成新机制',[line('Should employers allow flexible working hours?','新题'),line('谁 → 哪个决定 → 什么障碍 → 怎样改变','3 分钟','zh'),line('生成三条，再淘汰最弱的一条。','筛选','zh')],
'现在把免费公交放下。用三分钟为灵活工作时间造三条机制，再选最强的两条。你可以从照顾孩子的员工、需要共同开会的团队、拥挤时段通勤的人进入。',
'不要把这三个角色都机械写进文章。它们只是生成工具。真正留下的是你能够解释、能够回应问句、并且彼此有差异的理由。答案不必与教师一致，但必须让读者看见推理。')
],
'免费公交题：列三名可能受影响的人，各写「障碍 → 政策改变 → 结果 → 条件」。最后选择两条不同理由，写出淘汰第三条的原因。',
'可用方向：低预算通勤者的可负担性；受班次和线路限制的司机的便利性；交通部门预算在补贴现有乘客与改善服务间的取舍。不能直接从「公交乘客增加」推导「汽车一定减少」。',
'Flexible working hours：为个人安排和团队协作各生成一条完整机制；下一天换到 later school starting times。',
['观点相关而不是只有话题词','中间机制可解释','结论的范围有依据','两条理由解决不同的问题'],['S01','S02','S07','L01']),

lesson('04','把一段空话，改成真正的论证','逐句增加机制、场景与回扣，理解支撑关系而不是机械填模板。','完成第 2、3 课的任务地图与机制链。',[
scene('这段话的问题在哪里？',[line('Free buses are good for society.','弱稿'),line('People can save money.','可能的理由'),line('For example, many people take buses every day.','没有支撑换乘')],
'同一段弱稿，现在进入编辑室。第一句太宽，第二句有用但没连到拥堵，第三句只描述很多人坐公交。请先暂停，选一个最重要的问题。我们的目标不是把这段句子全部变长，而是让它能支持题目里的判断。',
'这节课示范一个单链段落：价格改变如何影响部分司机。它是可用的写法，不是每个主体段必须遵守的固定公式。只要信息关系清楚，具体解释与对比也能提供支撑。'),
scene('第一刀：收窄主张',[line('Lower fares could encourage some commuters','主张'),line('to switch from cars to buses.','直接连接拥堵'),line('some / could：主张范围与证据相称','表达判断','zh')],
'先改主题句。降低票价可能促使一部分通勤者从汽车换到公交。现在主体是谁、发生什么改变、与题目有什么关系，都更清楚。some 和 could 留下合理的范围，不宣称每个人都会改用公交。',
('Lower fares could encourage some commuters to switch from cars to buses.',),
'只有当你后面的支撑足够覆盖所有人时，才应该写更强的结论。限定词不是越多越好；它们应该精确匹配你的论证。'),
scene('第二刀：补出中间步骤',[line('For people on tight budgets, daily travel costs','机制'),line('can influence the choice between these modes.','决策因素'),line('A cheaper bus becomes attractive if its route is convenient.','成立条件')],
'接着解释为什么。对预算紧张的人，日常出行成本会影响方式选择。如果公交线路方便，更低的票价就可能改变比较结果。这里新加入了成本怎样影响决策，而不是用 important 再说一次观点。',
'你可以试着删掉这两句。如果删掉以后，观点到例子之间突然跳了一步，这两句就在承担解释工作。如果删除完全不影响读者理解，检查它们是不是只在重复。'),
scene('第三刀：给机制一个可见场景',[line('A city-centre worker with a direct bus route','具体场景'),line('could avoid parking charges by leaving the car at home.','机制落地'),line('说明性情境，不假装引用研究数据。','诚实支撑','zh')],
'我们用一名有直达公交的市中心上班族说明这条链。把车留在家里，他可以避免停车费用，也可能减少出行支出。这个场景解释了谁会换乘以及为什么，比 many people take buses 更有支撑价值。',
('A city-centre worker with a direct bus route could avoid parking charges by leaving the car at home.',),
'没有资料支持时，不要编某大学研究表明百分之八十。雅思不要求你写研究论文。例子要合理、相关，并解释机制。'),
scene('第四刀：回到原来的判断',[line('In those circumstances, cheaper fares may reduce','回扣'),line('peak-time car traffic, rather than only help existing bus users.','区分结果'),line('fare → decision → fewer cars：链条闭合','完成','zh')],
'最后回扣拥堵。在这些条件下，降价可能减少高峰汽车流量，而不只是给现有公交乘客省钱。我们明确区分乘客受益与汽车减少，论证才完成了题目要你做的工作。',
'回扣句并不是必需的固定句位。如果前面已经清楚把结果连回题目，就不用重复结尾。这里增加它，是因为这段最容易只讲省钱，忘记解释为什么与拥堵有关。'),
scene('反向测试：每一句新增了什么？',[line('主张：一部分司机可能换乘','句 1','zh'),line('机制：成本影响决策；线路必须可用','句 2-3','zh'),line('场景：直达线路 + 停车支出','句 4','zh'),line('结果：减少汽车，区别于补贴现有乘客','句 5','zh')],
'现在不给每句贴观点、解释、例子的模板标签，而是写出它新增了什么。第一句定义主张，接着补决策机制和条件，再给场景，最后连接结果。这样你才知道下一句为什么需要存在。',
'请回到你自己的初稿，按照同样的检查方式改写。下一题不再讲公交，而是博物馆低收入家庭的入场费用。只有换题也能写出具体机制，才说明你掌握了这节课。')
],
'将三句弱稿改为 80-110 词。给每一句写一条中文功能说明，不能只写「解释」或「例子」，必须说清新增了哪个信息。',
'可行成稿：Lower fares could encourage some commuters to switch from cars to buses. For people on tight budgets, daily travel costs can influence the choice between these modes. A cheaper bus becomes attractive if its route is convenient. A city-centre worker with a direct bus route could avoid parking charges by leaving the car at home. In those circumstances, cheaper fares may reduce peak-time car traffic, rather than only help existing bus users. 这是教学段落，不是已获官方分数的范文。',
'Should museums offer discounted tickets to low-income families? 独立写机制段，标记每句新增信息，再删除一句测试是否损失关键推理。',
['没有用近义句反复重说观点','关键因果箭头有解释','具体情境支撑了同一个主张','结论回到题目且没有过度泛化'],['S01','S02','S07','L01']),

lesson('05','衔接要连接信息，不只是连接词','修复因果跳跃、模糊指代与机械连接，让段落可以被自然跟随。','能写出基本完整的解释段。',[
scene('连接词多，也可能读不顺',[line('Firstly, buses are cheap.','句 1'),line('Moreover, this is important.','句 2'),line('Therefore, congestion will disappear.','句 3')],
'这段每句都有连接词，读者却不知道 this 具体指什么，也不知道便宜怎样让拥堵消失。therefore 只能标记已经成立的关系，不能创造缺失的推理。先修内容关系，再决定用不用连接词。',
'恰当的连接词当然有价值。我们反对的是把难词数量当成衔接质量。一个简单的 because 用对了，比漂亮但错置的 moreover 更能帮助读者。'),
scene('先补真实的逻辑桥',[line('Lower fares reduce the cost of a daily bus journey.','已有信息'),line('This saving may persuade budget-conscious drivers to switch.','桥'),line('Fewer cars could then ease congestion at busy times.','结果')],
'第一句提供价格下降带来的成本改变。第二句用 this saving 指向这个明确的节省，再解释谁可能换乘。第三句才把更少汽车连接到拥堵缓解。读者不需要替你补一整个因果过程。',
('This saving may persuade budget-conscious drivers to switch. Fewer cars could then ease congestion at busy times.',),
'这里的 saving 既是指代，也是对前一句信息的概括。你并没有不停换 buses 的同义词，而是在延续同一条信息。'),
scene('this 后面加一个准确的名词',[line('This is useful.','模糊'),line('This reduction in travel costs is useful for commuters.','更具体'),line('These passengers / this policy / that route','选择正确指向')],
'当 this 可能指前面多个信息时，加一个准确的名词可以减少歧义。this reduction in travel costs 让读者知道你正在讨论成本变化。它不是万能句式；如果指向本来就清楚，只用 this 也可能自然。',
'相反，this problem、this phenomenon 并不一定更精确。如果前文既有班次少又有线路远，this problem 仍然可能不清楚。先确定你要承接哪一个信息，再选择名词。'),
scene('保留主题词，不必每次换同义词',[line('commuters → these commuters → their journey','同一主体'),line('buses → the bus service → its reliability','同一对象'),line('不要为了变化，把 commuters 换成 tourists。','词义一致','zh')],
'关键词适当重复，能帮助读者保持对象。通勤者可以被 these commuters 承接，但不能为了避免重复突然变成 tourists。同义词如果改变范围，就会同时损害词汇准确性和论证。',
'请把自己段落中的主体圈出来，看它是否在没有解释的情况下从学生变成人们、再变成政府。对象变化可以合理，但需要清楚的关系，不能只是换词。'),
scene('乱序测试：你真的理解段内顺序吗？',[line('A. Fewer cars could ease rush-hour congestion.','结果'),line('B. A cheaper direct bus may attract some drivers.','选择'),line('C. Lower fares reduce the cost of commuting by bus.','起点')],
'请暂停，把这三句排序，并解释每个连接为什么成立。一个自然顺序是先票价成本，再换乘决策，再汽车减少带来的结果。如果从结果开头也可以，但你必须相应组织后面的解释。',
'练习的目标不是猜一个唯一顺序，而是能够说出读者先需要知道什么，后面的句子承接哪个信息。这种检查比背二十个高级连接词更接近独立写作的实际动作。'),
scene('删掉连接词，关系还在吗？',[line('信息关系成立 → 选择合适标记','先后顺序','zh'),line('关系不存在 → 先补解释或调整句序','修复','zh'),line('给自己的段落画出「旧信息 → 新信息」。','换题复测','zh')],
'最后，把你段落开头的连接词暂时遮住，看看关系是否仍然成立。这不是让你在考试里删除所有连接词，而是检验内容有没有承担衔接的工作。关系成立后，再放回恰当的提示。',
'换到图书馆延长开放时间，写三句连续推理。每句标出承接的旧信息与新增的信息。用清楚的指代和正确的因果，让读者跟随你的想法。')
],
'修改 Firstly, buses are cheap. Moreover, this is important. Therefore, congestion will disappear. 写 3-4 句有依据的因果推理，并标出每个代词的指向。',
'一个版本：Lower fares reduce the cost of commuting by bus. This saving may persuade some drivers to switch, provided the service is convenient. A reduction in car use could then ease congestion at busy times. 指代 this saving 承接成本下降；结果使用 could，且不再承诺拥堵消失。',
'图书馆晚间开放：access after work → working adults can use facilities → opportunity to study。写三句，解释衔接方式，不强制使用任何特定连接词。',
['没有缺失的因果步骤','代词有可识别的指向','同义改写没有改变对象范围','句序反映了读者理解所需的顺序'],['S01','S02','L01']),

lesson('06','词句升级：先准确，再丰富','从全文目的检查词义、搭配、范围与句法，用最少的改动恢复精确表达。','知道简单句、从句和基本时态。',[
scene('大词救不了不准确的意思',[line('Free buses will eliminate all traffic problems.','范围过强'),line('They bring many conveniences to citizens.','模糊表达'),line('Although it is cheap, but people do not use it.','句法问题')],
'所谓高级表达，首先要精确。eliminate all traffic problems 对证据要求极高。many conveniences 没有具体指出什么改变。第三句还重复使用让步连接结构。这里最值得做的是恢复准确的意思，不是给每个词找复杂同义词。',
'请暂停，分别判断这三句的问题属于范围、表达还是句法。一个句子可能涉及多个维度。我们按具体问题改，不给学生规定每段必须出现几个词伙。'),
scene('先校准主张的强度',[line('eliminate all traffic problems','过度保证'),line('may help ease congestion at peak times','有范围的结果'),line('only where services are reliable and convenient','适用条件')],
'把结果改成可能帮助缓解高峰拥堵，并保留服务可靠、方便的条件。这样词句与前面的机制相匹配。may 并不自动等于高分；如果你描述确定的数据，就不应随意使用可能。',
('Lower fares may help ease congestion at peak times, especially where bus services are reliable and convenient.',),
'你在 Task 2 中表达基于理由的政策判断，常需要控制范围。在 Task 1 中报告给定数据，则需要忠实陈述数据。两个任务不能机械沿用同一种语气。'),
scene('选词看它在句子里做什么',[line('reduce fares / ease congestion / improve reliability','具体搭配'),line('make a bus journey more affordable','明确改变'),line('government investment in public transport','对象清楚')],
'这三个动词对应不同对象：降低票价，缓解拥堵，提高可靠性。你理解了动作和对象，才比较容易在新题正确使用。只背中英文表格，考场上仍然可能搭配错。',
'词伙训练可以先给一个表达需求，比如降低出行负担，再独立写句子，最后检查搭配。不要在句子本来已经清楚时强塞一个新词；它必须帮助你表达具体意思。'),
scene('语法修复：一种关系选一种结构',[line('Although buses are cheap, some people still drive.','版本 A'),line('Buses are cheap, but some people still drive.','版本 B'),line('they / it：先确定复数车辆还是单一服务。','指代检查','zh')],
'although 和 but 都可以表达让步，但这组句子不能同时用来承担同一个连接。选择一个，句法就清楚了。注意 buses 是复数，后续代词通常用 they；如果前面是 the service，则可能用 it。',
('Although buses are cheap, some people still drive.',),
'真正的句式范围，是你能准确运用不同关系。不要把所有信息塞进一个超长句。如果一个复杂句反复出错，可以先拆开恢复清楚，再有目的地合并。'),
scene('从主干到有控制的复杂句',[line('Some commuters still drive.','主干'),line('The bus service is unreliable.','原因'),line('Some commuters still drive because the bus service is unreliable.','合并')],
'先确认两个完整主干，再用 because 表达真实原因。这是有目的的复杂化，不是为了增加长度。检查从句动词和主句动词都完整，关系与原意一致。',
'写作后，你可以逐句找主语和谓语，优先检查重复出现的错误。若同类错误在全文连续出现，就安排短练习加换题复测，而不是只把这一篇让工具改干净。'),
scene('编辑顺序要跟着你的错误走',[line('意思是否准确 → 范围是否合理','内容检查','zh'),line('搭配与词形 → 主干与连接 → 标点','表达检查','zh'),line('换题独立使用同一表达，才算练到。','迁移','zh')],
'这组例句可以按意思、范围、搭配、句法去修。你的文章若有大量句子无法理解，就先处理句法主干。修复次序应跟着诊断证据走，而不是给所有学生同一张高级词清单。',
'作业要求你写出修改理由，再用其中一个表达写一条新题句子。我们看的是准确表达能否留下来，不是你能不能从屏幕上复制一个看起来高级的版本。')
],
'修改视频中的三句问题句，并分别写修改理由。再改：The government should spend money to public transport. The number of bus users were increased. 不可在没有数据的情况下增加事实。',
'参考：Lower fares may help ease congestion. They make travel more affordable for commuters. Although buses are cheap, some people still drive. The government should spend money on public transport / invest in public transport. The number of bus users increased（数量自身增长）或 was increased（有人使之增加，须有相应语境）；number 作主语中心词时用单数。',
'新题延长图书馆开放：用 improve access、make ... more accessible、because 或 although 写两句。第二天遮住答案重写，不要求使用所有表达。',
['改写保留原意或明确解释了为何调整','主张强度与证据相称','词语搭配与对象适配','句法关系正确而不是仅仅更长'],['S01','S02','L01']),

lesson('07','Task 1：先选信息，再找句子','在模拟数据中识别全局变化、排名反转与组间比较，避免逐格翻译。','学过 Task 1 的 introduction / overview / details。',[
scene('九个数字，哪三个关系最重要？',[line('Norchester commuters, 2005 / 2015 / 2025','模拟数据'),line('Car: 55 → 48 → 35%','汽车'),line('Bus: 30 → 32 → 40%','公交'),line('Bicycle: 15 → 20 → 25%','自行车')],
'这组图表数据是为课程原创的模拟数据，城市也是虚构的。每年三项合计百分之百。先别找上升下降的同义词。请暂停，选出如果读者只记得三件事，最应该知道的三个关系。',
'一个合理选择是汽车占比下降，公交和自行车上升，以及公交到最后超过汽车。自行车始终最少也是有用特征。选择关系以后，你才知道 overview 要说什么。',chart=True),
scene('概述是全局关系，不是数据清单',[line('Overall, car use declined, while bus use and cycling rose.','变化'),line('Buses overtook cars to become the leading mode by 2025.','排名'),line('别先用九个数字填满 overview。','信息层级','zh')],
'这两句先概括变化，再报告排名反转。它们给读者一张理解后文的地图。概述通常不需要把所有数字重抄一遍；关键是捕捉整个图表的主要特征。',
('Overall, car use declined, while bus use and cycling rose. Buses overtook cars to become the leading mode by 2025.',),
'有的图没有明显趋势，就看主要差异、大小关系或阶段。overview 是信息选择的工作，不能把一条趋势模板强套到所有图型。',chart=True),
scene('按关系分组，而不是逐格翻译',[line('组 A：起点与中间年，汽车仍占第一','2005 / 2015','zh'),line('组 B：终点与整体变化，公交完成反超','2025 / 全期','zh'),line('另一合理分组：下降的汽车 / 上升的两项','可选结构','zh')],
'一种分组是先报告起点和中间年，说明汽车仍然领先；另一组报告最后一年和整个时期的变化，说明公交反超。也可以把下降的汽车单独成组，再比较上升的两项。',
'两种都可能合理。选择能让比较清楚的安排，而不是因为范文总是两段细节就硬凑两组。每个数字都应该在说明某个关系，不能只为了完成逐格翻译而出现。'),
scene('百分点与百分比，别混在一起',[line('Car: 55% → 35%','给定数据'),line('a fall of 20 percentage points','百分点差'),line('(35 − 55) / 55 ≈ −36.4%','相对变化')],
'汽车从百分之五十五下降到百分之三十五，相差二十个百分点。如果你说减少百分之二十，通常会被理解为相对下降，意义就不同。相对变化这里约为百分之三十六点四，但没有必要为了展示计算把它强加进报告。',
'Task 1 优先准确报告图中数据与重要比较。用 fell from fifty-five percent to thirty-five percent 就已经清楚。若使用差值，明确写 percentage points。'),
scene('数据没有提供的原因，不要补进去',[line('Bus use rose to 40% by 2025.','可报告'),line('This was because the government lowered fares.','图中没给'),line('描述变化与比较；不要猜政策与动机。','任务边界','zh')],
'图表只告诉我们比例变化，没有告诉我们政府降低了票价。Task 2 可以用合理解释支持判断，Task 1 则要忠实选择报告给定信息。不能因为我们前面讲过免费公交，就把那个原因塞进图表报告。',
'同样，最高不等于最好，上升不等于积极，汽车下降也不自动意味着空气改善。只写你能够从图中读取的关系。'),
scene('脱离示范，再写一份新报告',[line('New data: 2010 / 2020 / 2025','新模拟数据'),line('Car: 60 / 50 / 45; Bus: 25 / 30 / 35','数据'),line('Bicycle: 15 / 20 / 20; shares in percent','数据'),line('这里没有反超：不能复用旧 overview。','复测','zh')],
'换题后，汽车仍然占比最高，自行车后期持平，没有公交反超。请独立写两句 overview 和一段比较。如果你还写 buses overtook cars，就说明你复用了记忆，而没有重新读取数据。',
'完整示范报告在讲义中，练习后再看。你要检查的是信息选择、数字准确和分组关系，而不是自己的句子是不是与教师一模一样。')
],
'使用视频模拟数据写两句 overview，再按自己的分组写 150-190 词报告。圈出至少两处比较，核对每个数字。不要加入图中没有的原因。',
'参考报告见讲义原创示范。关键关系：汽车下降 20 个百分点；公交和自行车各增加 10 个百分点；2025 公交以 40% 超过汽车 35%；自行车始终最低。150-190 词是本练习建议范围，官方只规定至少 150 词。',
'新数据：2010/2020/2025；汽车 60/50/45，公交 25/30/35，自行车 15/20/20（百分比）。新概述应包含汽车仍最高、公交持续上升、自行车后段持平中的主要关系，不能写反超。',
['概述反映主要特征','数字、单位与时间准确','细节按关系组织且有比较','没有补充图表未提供的原因'],['S01','S02','L02']),

lesson('08','把方法带进一篇完整限时作文','用题目、立场、段落任务和核查证据完成原创全文；建立延迟复测与外部评分。','完成前 7 课练习，而不只是看完视频。',[
scene('先进行一次真正的独立作答',[line('Governments should make public transport free','题干'),line('for everyone to reduce traffic congestion.','范围与目的'),line('To what extent do you agree or disagree?','任务'),line('暂停，40 分钟，至少 250 词；保留原稿。','独立写作','zh')],
'到这里，我们先把所有示范收起来。请对这道原创模拟题进行四十分钟独立作答，至少二百五十词。它与前面练习同题，用于整合已练过的动作，不算未见题检验。提交后再看本节后半部分。',
'保留初稿，记录哪些段落卡住，以及有没有查看辅助材料。今天允许你比较同题改进，下一次必须用未见题。不要把这两种结果混成一个能力证明。'),
scene('全文计划，先保证判断一致',[line('立场：部分同意；优先可靠服务与定向支持','判断','zh'),line('段 A：降价在可用服务下能影响部分司机','理由 A','zh'),line('段 B：普遍免费未解决便利性且占用预算','理由 B','zh'),line('结论：认可有限作用，说明政策优先级','回应','zh')],
'示范采用部分同意：更便宜的出行可能帮助一部分司机换乘，但服务可靠性和定向支持应优先于对所有人免费。第一段主体说明降价何时有用，第二段说明为什么不赞成把普遍免费放在首位。',
'这四段安排服务这个答案，不是考试必须的结构。预算取舍是合理的论证情境，并不是我们声称知道某个真实政府的财政数据。你可以选择其他立场，只要能回答并支撑同一个问句。'),
scene('开头：直接回答，别写宏大背景',[line('I partly agree: cheaper travel can encourage some drivers','立场'),line('to leave their cars at home, but reliable services and','理由边界'),line('targeted support should take priority over free fares for everyone.','政策判断')],
'开头先简明引出免费公共交通，再直接回答。我们没有写科技日新月异，也没有说此问题在全世界引发激烈争论。那些背景如果不承担题目功能，就会占用时间。',
'这一句在讲义里有完整上下文。请比较你的开头：读者能不能判断你对 free for everyone 的态度，后面的段落能不能兑现开头承诺的理由。'),
scene('主体段：不要把支持与反对写成两篇文',[line('A：cost → choice → switch, if services are usable','支持有限作用'),line('B：poor service remains + budget trade-off','解释优先级'),line('同一个判断：部分有效，但并非普遍免费优先。','全文一致','zh')],
'第二主体段不能突然说免费完全没用，否则与前面冲突。示范说的是普遍免费还补贴了有支付能力的人，而且没有解决不可靠服务；预算用于替代票款，可能减少改善班次的空间。它补充了同一个政策判断。',
'比较自己的两段，把每段最后一句连起来读。它们共同支持你的立场，还是互相推翻？如果冲突，先修判断与任务，而不是先改 moreover。'),
scene('结尾：兑现答案，不新增第三条理由',[line('Free travel could help in some settings,','承认范围'),line('but it is insufficient on its own.','明确限制'),line('Prioritise reliability and support for those who need it.','政策判断')],
'结尾回收有限作用和优先安排，不突然提出新的环境理由。最后一句可以总结你的判断，但必须能够从正文推出来。如果正文没有讨论定向支持，结尾就不能把它当成已经证明的主方案。',
'全文示范是原创教学稿，没有官方分数标签。你要研究作者怎样选择、限定和展开，而不是背下来期待在另一道题上获得相同成绩。'),
scene('检查次序：先任务，再逻辑，再语言',[line('漏答、范围、立场是否一致？','第一遍','zh'),line('每段机制与支持是否相关？','第二遍','zh'),line('高频语法、词形、搭配、字数？','第三遍','zh'),line('用原句作为检查证据，不写「感觉不错」。','记录','zh')],
'建议在练习中先查任务和判断，再查推理，最后扫自己最常见的语言错误。用时可以试着安排五分钟计划、三十分钟成文、五分钟检查，再按你的速度调整。这是训练建议，不是评分规则。',
'把最大的一项问题写成下一次动作，例如先画出价格到换乘的中间机制。一次收到十几条反馈时，先修对文章影响最大的那项，再逐步处理其他问题。'),
scene('7.5 以上，用新题与外部评阅检验',[line('24 小时：博物馆免费题，独立限时','迁移','zh'),line('3 天：大学在线课程替代题，独立限时','稳定性','zh'),line('7 天：一套未见 Task 1 + Task 2，60 分钟','整合','zh'),line('完整题干、图表、原稿交给有经验的教师评阅。','外部证据','zh')],
'向七点五分以上训练，需要在完整未见题上稳定展示能力。明天换博物馆免费，三天后换大学在线课程，一周后做一套未见过的大小作文。不要在练习前读那道题的参考答案。',
'请让有经验的教师结合完整题干、原图和原稿评阅，按四项指标解释判断。自己核查与人工智能反馈都能帮助改写，但不是官方成绩。看完课程是不是有用，要看你在新题上的作品和反复表现。')
],
'40 分钟独立完成免费公共交通题。保存原稿，再读示范，填写「一项主要问题、原句证据、修复动作」。另写一版但注明辅助来源，不把第二版当成首次独立能力。',
'完整原创示范见讲义。没有唯一立场答案；判断合理性看是否准确回应普遍免费、是否与减少拥堵相关、是否解释关键机制与限制、是否前后一致。每项用文中句子佐证，不按词伙数量打勾算分。',
'24 小时后：Museums should offer free entry to all visitors. 40 分钟；3 天后在线课程替代题；7 天后从现有题库挑未见图表和未见 Task 2 完成 60 分钟套题，外部评阅。',
['全部关键任务得到相关回应','全文立场可识别且被支持','段内和段间推进可跟随','语言范围与准确性在全文中稳定','未见题和延迟复测仍能完成'],['S01','S02','S08','L01'])

curriculum=[]
stages=[
('核心桥接',[(x['title'],x['goal']) for x in lessons]),
('Task 2 专项深化',[
('观点题：程度和让步','用两道不同程度题解释立场边界'),('讨论题：公平呈现两方','不将讨论双方写成只论证个人立场'),('利弊与 outweigh','使用明确评价维度比较重要性'),('原因与解决方案','逐项匹配原因、行动主体和效果'),('双问与多问','保证每个问句有明确回答与合理篇幅'),('例子先行与条件论证','按写作目的选择解释、例子与反例'),('教育与科技：思路迁移','跨子话题复用机制而非成稿'),('Task 2 盲写工作坊','未见题独立成文，反馈后定向改写')]),
('Task 1 专项深化',[
('折线图：趋势与交叉','选择变化幅度与重要转折'),('柱图与表格：分组逻辑','确定比较轴，避免逐个报数'),('饼图：构成与比例','准确表达占比、差值和相对变化'),('混合图：建立关联','在不臆测原因的前提下组织双图'),('流程图：阶段与语态','区分自然过程和人工过程'),('地图：位置与变化','组织空间关系并准确报告改建'),('数字表达与句法精修','修复单位、时态、主谓与比较错配'),('Task 1 盲写工作坊','未见图独立写作，原图对照校验')]),
('高分稳定性与验证',[
('官方样卷锚点精读','从考官评语定位全文质量差异'),('语法系统性错误修复','对个人高频错误进行定向短练'),('精确改写而非同义替换','保留对象、程度和因果关系'),('词汇表达需求训练','在未见语境中正确检索搭配'),('段落删除与重排实验','检验论证中的必要信息和次序'),('60 分钟套题模考一','双任务独立完成并外部评阅'),('反馈到延迟复测','将反馈转成新题上的可检验动作'),('60 分钟套题模考二','比较两轮独立结果，确定后续训练')])]
for stage, rows in stages:
    for title,goal in rows:
        n=len(curriculum)+1
        curriculum.append({'id':f'{n:02}','stage':stage,'title':title,'goal':goal,'status':'produced' if n<=8 else 'planned'})

data={'title':'Simon 之后 · 写作进阶课','positioning':'从听懂方法，到独立写得出来','audience':'已学过 Simon 或同类基础写作课，写作约 5.5-6.5，向 7.5 分以上训练。','target':'7.5 分以上是训练目标；通过未见限时题和外部评阅验证。','date':'2026-10-01','lessons':lessons,'curriculum':curriculum,'examples':{'essay':{'prompt':ESSAY_PROMPT,'paragraphs':ESSAY},'report':{'prompt':REPORT_PROMPT,'paragraphs':REPORT,'data':{'years':[2005,2015,2025],'Car':[55,48,35],'Bus':[30,32,40],'Bicycle':[15,20,25]}}}}
if __name__=='__main__':
    (BASE/'lessons.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    (BASE/'lessons.js').write_text('window.COURSE = '+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
    print(f'{len(lessons)} lessons; {sum(len(x["scenes"]) for x in lessons)} scenes; {len(curriculum)} planned/produced lessons')
