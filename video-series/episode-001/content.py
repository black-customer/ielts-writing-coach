"""Original public teaching demonstration. The essay is derived from visible edits.

These are authored instructional remarks, not a transcript of private reasoning.
Run this file to export the ordered production script and its review materials.
"""
from pathlib import Path
import json, re

BASE = Path(__file__).resolve().parent
EVENTS = []

def say(phase, label, text, *, notes=None, focus=None, pause=1.3):
    item = dict(phase=phase, label=label, text=text, lang="zh-CN", pause=pause)
    if notes is not None: item["notes"] = notes
    if focus is not None: item["focus"] = focus
    EVENTS.append(item)

def write(phase, label, english, paragraph, *, pause=1.5):
    EVENTS.append(dict(phase=phase, label=label, text=english, lang="en-GB",
                       append=english, paragraph=paragraph, pause=pause))

def change(label, old, new, text):
    EVENTS.append(dict(phase="检查修改", label=label, text=text, lang="zh-CN",
                       replace={"old":old,"new":new}, pause=2.0))

QUESTION = "Some people believe that nowadays we have too many choices. To what extent do you agree or disagree with this statement?"

say("审题", "题目第一次出现", "欢迎来到代米手把手教你写雅思写作高分文章。今天抽到剑桥雅思十三，第二套，大作文。我们从空白稿开始，边说边写，最后再检查。画面上的计时记录这次教学演示的播放进度。这是人工智能创作的模拟写作示范，不是一次真实考试的录像。先把题目读完整，现在不打开范文，也不在右边提前放成稿。", notes=[])
EVENTS.append(dict(phase="审题", label="读题", text=QUESTION, lang="en-GB", pause=3.0))
say("审题", "抓住争议", "题目很短。有人认为，如今我们的选择太多了。问题是，你在多大程度上同意或者不同意。我先在题干里标出太多，以及多大程度。这两个地方决定文章要回答的事。我们的任务是评价选择多到什么程度会成为问题。题目没有要求列出所有现代生活的变化，正文也不需要把每个领域都覆盖一遍。先把讨论对象固定住。", notes=["问题：选择多到成为负担了吗？"], focus="too many choices")
say("审题", "区分多与过多", "这里先写一条很短的笔记：多，不自动等于过多。手机型号多，大学专业多，工作机会多，都可以叫选择多。但这些情境的价值并不一样。写这篇文章时，不能只证明现在的选项增加了，就认为已经回答了题目。我需要用具体场景说明，增加的选项是在帮助人，还是在增加没有必要的负担。全文围绕这个判断写。", notes=["问题：选择多到成为负担了吗？", "多 ≠ 过多；要评价实际影响"], focus="too many choices")
say("审题", "明确回答方式", "这是同意程度题。今天采用部分同意：一些日常消费确实让人面对过量而相似的选项；但教育和职业上的选择仍然有价值。部分同意不是开头说一句看情况，后面把好处坏处各放几条。我会明确写出在哪一类事情上同意，在哪一类事情上不同意。这个范围先放到左边，随后开头、正文和结尾都要保持一致。", notes=["立场：部分同意", "日常消费：相似选项可能过多", "教育／职业：更多有效选择仍有价值"])
say("审题", "限制题目范围", "题目用了我们，但我不会写成世界上每个人都有无限选择。有些人的收入、地区和家庭条件会限制他们能做的决定。今天的正文用常见的消费场景，以及教育和工作场景来说明观点。涉及没有条件使用某个选项的人，放在第二个主体段里作一个限定。这样讨论有范围，也不会把生活条件完全不同的人都说成同一种情况。", notes=["立场：部分同意", "消费：相似选项增加决策负担", "教育／职业：有效选择扩大机会", "限定：可选项不等于人人能获得"])
say("审题", "不扩成另一道题", "我先把容易跑出去的话题放在旁边：互联网的发展，广告的影响，社会竞争，都可能与选择有关。但这道题没有问选择为什么增加，也没有让我们提出一套治理方案。正文可以提到网上购物，可它服务的是消费选择是否过多。后面写到一句新话时，我会检查它有没有继续回答这个问题。现在只留下能直接支撑立场的两段材料。")

say("构思", "第一段的具体场景", "先准备消费这一段。场景用买一台笔记本电脑。页面上列着许多型号、配置、价格和用户评价。一个普通买家可能花很久比较，最后仍不确定相邻型号的区别。这足够具体，不需要虚构某项研究，也不需要给一个没有来源的百分比。笔记写成：相似型号，反复比较，耗费时间，仍然担心选错。正文按这个顺序把影响写出来。", notes=["部分同意", "主体1｜消费", "相似型号 → 反复比较 → 耗时／不满意"])
say("构思", "给消费段收住范围", "消费段的例子用笔记本电脑就够了。手机、洗发水、旅游套餐暂时不往里面加。这里要证明的不是商品种类很多，而是一些差异很小的选项未必增加实际价值。段尾可以说，筛选过的短名单可能更实用。这个句子会回到过多这个判断，而不会把所有商品选择都否定掉。左边先记下短名单，等写到段尾再把它变成英语。", notes=["部分同意", "主体1｜相似型号 → 比较负担", "例子：购买笔记本电脑", "段尾：筛选后的短名单更实用"])
say("构思", "第二段换一个领域", "第二个主体段换到教育和工作。这里，增加的选项可能是真正不同的人生路径。一个正在工作、又要照顾孩子的人，如果可以兼职上课或者选择远程课程，就不必只在全日制学习和完全不学习之间选。这个例子用来说明有意义的选择扩大机会。现在把人物和限制条件写下来，后面直接用这个场景展开，不再找第三个大论点。", notes=["部分同意", "主体1｜消费：相似选项可能过多", "主体2｜教育／职业：更多路径扩大机会", "例子：有工作的家长选择兼职／远程学习"])
say("构思", "把反驳放在段内", "第二段还需要一句限定。课程很多，并不意味着每个人都付得起学费，或者都能挤出学习时间。这句限定不会取消第二段的观点。它只会把比较对象说清楚：只要这些不同路径确实可用，多几个有意义的选项就有价值。最后可以直接说明，选项总数多，并不足以说明它们过多。笔记只保留这句话的意思，不提前写一整段英语。", notes=["主体1｜相似商品：比较负担", "主体2｜不同学习路径：扩大机会", "限定：费用／时间影响可及性", "判断：有意义的不同选项，不因数量多就过多"])
say("构思", "确定文章骨架", "现在有四段：开头给立场；第一段写消费中过量而相似的选项；第二段写教育和职业中有意义的选择；结尾重申这个范围。今天用四段，是因为这两个主体段已经能支撑我们的回答，不是所有题目都必须只有四段。左边的笔记到这里已经够用了。接下来开始正文，不再花时间把每个句子都写成提纲。", notes=["开头｜部分同意＋适用范围", "主体1｜相似消费选项可能过多", "主体2｜有意义的路径仍有价值", "结尾｜重申同一判断"])
say("构思", "开始落笔", "开头只做两件事：把争议说出来，把我的立场说出来。这里不写社会飞速发展这种通用背景，也不写本文将讨论两个方面。我会保留选择这个核心词，它没有必要每次都换成很少使用的同义词。第一句先写现代生活提供很多选择，并且有人认为这个数量已经过量。第二句随后限定我的同意范围。右边从现在开始出现正文。")

write("落笔·开头", "引出争议", "Modern life offers an enormous range of choices,", 0)
say("落笔·开头", "接完首句", "第一句现在只是现代生活提供很多选择。逗号后面接这个题目的争议：有人认为我们有的选项超过了需要。这里用一些人来转述题干，不把这个判断直接说成已被证实的事实。句子写完以后，下一句就亮出立场。开头不需要把购物例子和家长上课的例子都塞进去，那些材料留给主体段。", focus="an enormous range of choices")
write("落笔·开头", "完成题目改述", "and some people argue that we have more options than we need.", 0)
say("落笔·开头", "写清同意程度", "立场句写，我同意过度的选择可能让日常购买变得更困难，但教育和就业上的更多自由仍然有益。这里的可能，和日常购买，给了前半句明确的范围。后半句则让读者知道我不会把所有领域的更多选择都当成负担。现在把这句话落到正文里。后面两段分别兑现这句话的两个部分。", focus="more options than we need")
write("落笔·开头", "立场的前半句", "I agree that excessive choice can make everyday purchases more difficult,", 0)
say("落笔·开头", "保留直接表达", "这里先用更困难这个直接表达。它能传达立场，等正文已经说明了具体困难，检查时再决定是否需要换得更精确。写作过程中，我不要求每个短语一落笔就是唯一最佳版本。现在这半句的语法完整，方向也与提纲一致，就继续写另一半。这样不会为了一个形容词，让整篇文章的推进停下来。")
write("落笔·开头", "完成立场句", "but greater freedom in education and employment remains beneficial.", 0)
say("落笔·开头", "开头快速核对", "开头现在两句。第一句介绍过量选择这个争议，第二句给出消费与教育就业的区分。看看有没有自己加出一个新任务：没有承诺解决现代社会所有的问题，也没有承诺讨论每一种选择。现在从开头换行，进入消费段。先写这段要证明的判断，再补解释和例子。左边保留提纲，右边的段落会按写作顺序增加。")

say("落笔·主体1", "写消费段的判断", "第一主体段的中心是相似选项过多会造成决策负担。主题句先用日常消费作范围，再说这些选项可能带来的影响。我不把主题句写成选择有很多坏处，那个范围太大，也不告诉读者这一段会具体讲什么。这里直接把更窄的判断写出来：在日常消费中，许多相似的选项可能让决定变得没有必要地费力。", notes=["主体1｜消费", "判断：相似选项 → 不必要的决策负担", "解释 → 笔记本例子 → 回到判断"])
write("落笔·主体1", "主体段主题句", "In everyday consumption, a large number of similar options can make decisions unnecessarily demanding.", 1)
say("落笔·主体1", "写买家实际面对的材料", "接下来写买家在做什么。一个买家可能需要比较许多产品，而这些产品只有很小的差异。这里的许多只是表达数量，不是调查数据。先把这件事说清楚，下一句才能接出时间和注意力的代价。不要在主题句后马上跳到压力很大或者生活质量下降。段落先给读者一个可理解的活动，再说明这个活动造成的具体影响。")
write("落笔·主体1", "产品比较", "A shopper may have to compare dozens of products that differ only slightly,", 1)
say("落笔·主体1", "补充相似之处", "现在句子停在差别很小。接一个限定：即使其中几个产品已经满足这个人的需要，他仍然在比较。这样写出来，相似选项的负担就不是只有一个空泛的标签。后面的例子会落到笔记本电脑上。这里先用普遍场景说明关系，不增加另一种产品，也不写买家一定会作出错误决定这种过强的结论。")
write("落笔·主体1", "完成解释句", "even when several would meet their needs equally well.", 1)
say("落笔·主体1", "说明直接代价", "下一句直接写代价：这个过程消耗时间和注意力，却不保证买得更好。句子的指代对象很近，就是前一句比较许多相似商品这个过程。我先写这个过程，不再重复一遍许多商品、许多价格、许多选项。没有必要每句开头都加一个首先、其次或者此外。读者能看见前一句的活动与这一句的影响是连在一起的。")
write("落笔·主体1", "具体影响", "This process uses time and attention without necessarily leading to a better purchase.", 1)
say("落笔·主体1", "进入具体例子", "例子用刚才提纲里的笔记本电脑，不临时换到一个自己不熟悉的行业。画面里的这一句会说，买笔记本电脑的人可能花几个小时阅读评价、比较规格。这个时间是一个假设场景的描述，没有冒充统计结论，也没有声称每个消费者都这么做。这里保留可能，再把阅读评价和比较规格写出来，让例子有动作，而不只剩下一个产品名称。")
write("落笔·主体1", "例子的场景与动作", "For example, someone buying a laptop may spend hours reading reviews and comparing specifications,", 1)
say("落笔·主体1", "让例子有结果", "这一句还没有结束。我们已经看到买家花时间比较，接下来写结果：他仍不确定多花的钱是否换来有用的改进。这样例子具体到一个普通购买决定。后面不用追加一份调查、一个品牌或一串处理器型号。那些细节不会自动加强这段论证。现在把不确定的对象写清楚，是额外费用对应的实用改进，而不是所有生活决定。")
write("落笔·主体1", "例子中的结果", "yet remain unsure whether the extra cost brings a useful improvement.", 1)
say("落笔·主体1", "补充购买后的负担", "消费段还可以补一句买完以后发生的事：没有选择的那些型号，仍可能让人觉得自己选得不好。这里不用断言选择越多就一定越不满意。用可能就够了。句子中的未被选择的型号，会接住笔记本例子，也把大量相似选项的影响进一步写具体。写完这句，段落就可以收束，不再开一个广告或者攀比的新分支。")
write("落笔·主体1", "购买后的疑虑", "The alternatives left behind can also make the buyer less satisfied with an otherwise adequate decision.", 1)
say("落笔·主体1", "消费段落收束", "最后一句回到是否过多：在这样的情况下，一个筛选过的短名单可能比不断扩张的目录更有用。这里写在这样的情况下，就保持了我们只评价相似消费选项的范围。短名单不是要求政府禁止其他商品，也不是说人们应该永远没有选择。它是对这个具体场景的比较判断。现在写完这句，第一主体段就完成了，随后换行。")
write("落笔·主体1", "回到过多的判断", "In such cases, a carefully selected shortlist may be more useful than an ever-expanding catalogue.", 1)
say("落笔·主体1", "检查段落有没有偏离", "停下来扫一下这一段。相似商品，比较负担，笔记本例子，买后疑虑，短名单。每句都在回答为什么这类选择可能过多。段落没有变成网购的优缺点，也没有只列三四个心理健康标签。这里先不做逐词润色，文章还有一半没有写。下一段要补上我不同意的范围：有意义的不同路径。这个部分写完整，开头的部分同意才得到支撑。")

say("落笔·主体2", "明确转向", "第二主体段先用然而，告诉读者判断的方向发生了变化。它评价的是教育和就业选择，正好对应开头的后半句。这一段并不是宣布消费段完全错误。两个段落的适用范围不同：前面是许多相似产品，这里是确实不同的学习和工作路径。主题句先写更多选择可能把机会提供给原本被排除的人，随后用具体人物来说明。", notes=["主体2｜教育／职业", "判断：不同路径 → 扩大机会", "例子：有工作的家长", "限定：费用和时间"])
write("落笔·主体2", "主体2主题句", "However, a wider range of educational and employment options can open opportunities to people who would otherwise be excluded.", 2)
say("落笔·主体2", "选用提纲里的人物", "接着写一个有工作、又要照顾孩子的家长。这个人物已经在左边的提纲里，不需要写姓名、城市和学校名称。先交代全日制大学课程可能不适合他，再写兼职课程或者远程学习带来可行的路径。例子里有这个人的限制条件，所以机会的扩大就能被看见。两种上课形式已经够用，后面不再把在线教育的所有好处都列一遍。")
write("落笔·主体2", "例子的限制条件", "A working parent, for instance, may be unable to attend a full-time university course", 2)
say("落笔·主体2", "接上可行的路径", "句子前半写无法参加全日制课程，后半接但是可以通过兼职或者远程学习取得资格。这里的转折发生在同一个人的条件下。它说明这些选项有实际差别，而不是为了让列表看起来更长。资格这个词可以覆盖具体文凭或职业资质，不需要虚构一门课程。先把完整句子落下，再继续写课程范围如何帮助不同兴趣和需求的人。")
write("落笔·主体2", "例子中的机会", "but could gain a qualification through part-time or distance learning.", 2)
say("落笔·主体2", "从形式扩展到内容", "上一句说的是上课形式。这一句再说课程内容：专业课程让人能够选择符合个人兴趣和就业需要的训练。它仍然支持同一个判断，有意义的差异能够扩大机会。这里没有另开一个教育提高国民素质的大话题。句子的范围保持在个人能选择什么训练上，读者就能把它与有工作的家长的例子接起来。正文继续，不增加额外标题。")
write("落笔·主体2", "课程的实际差异", "Similarly, specialised courses allow people to pursue training that matches their interests and employment needs.", 2)
say("落笔·主体2", "说明为何这些选项有价值", "下一句把这一段的比较说出来：这些差异很重要，因为一个标准路径不能适合每个人。这里的这些差异，指上课形式和课程内容。句子不需要再完整复述兼职、远程、兴趣和就业需要。写一个标准路径不能适合所有人，既能回应例子，也能继续说明第二段为什么不把更多选择叫作过多。到这里，这一段已经有判断、例子和解释。")
write("落笔·主体2", "回到主体判断", "These differences matter because a single standard route cannot suit everyone.", 2)
say("落笔·主体2", "兑现审题时的限定", "现在补上审题阶段记下的限定：费用和可用时间会限制实际获得的机会。选项存在，不等于每个人都能使用。今天不会用这一点另写第三个主体段，它只需要一条准确的限定句。这样第二段不会把课程目录变长就等同于所有人的自由扩大。句子写完后，再回到判断，而不是停在一个与立场冲突的地方。")
write("落笔·主体2", "范围限定", "Admittedly, costs and available time can limit access to these opportunities.", 2)
say("落笔·主体2", "完成段落的回应", "最后一句接，然而，当人们确实拥有几个有意义的选项时，选项的总数本身并不是缺点。这里的人们确实拥有，回应上一句费用和时间可能造成的限制；有意义的选项，回应整段的不同学习路径。段尾直接落在数量是否构成问题上，和题目的太多保持联系。写完以后，第二个主体段也可以结束，不追加一串新领域。")
write("落笔·主体2", "主体2的最后判断", "Nevertheless, when people genuinely have several meaningful options, the number of choices is not itself a disadvantage.", 2)
say("落笔·主体2", "核对两段的分工", "目前正文两段已经形成明确分工。第一段说明相似的消费选项可能增加负担；第二段说明有意义的教育和工作路径可以扩大机会。第二段承认费用和时间的限制，但没有把更多有效选择的价值否定掉。现在我们不缺一个第三个论点，也不缺一个很宏大的总结。结尾只需把这个范围再表达一次，和开头保持同一个立场。")

say("落笔·结尾", "结尾只重申判断", "结尾准备两句短话。第一句说，我因此认为，问题更在于相似选项的重复，而不在于选择本身。第二句分别点回两个领域：减少日常购物中没有必要的比较可能有帮助，而在影响更深远的领域保留不同路径仍然有价值。这里没有提出全民培训消费者的新政策，也不引入精神疾病这种正文没讲过的后果。结尾保持在已经论证过的内容里。", notes=["结尾｜重申部分同意", "相似消费选项可能过量", "有意义的人生路径仍然值得保留"])
write("落笔·结尾", "总结判断", "I therefore believe that the problem is excessive duplication rather than choice itself.", 3)
say("落笔·结尾", "保留两个适用范围", "现在补第二句。前半写减少日常购物中没有必要的比较，后半写在更重要的领域保留多种路径。更重要的领域，在正文里已经具体写成教育和就业，所以这里可以用一个简短的概括。为了让结尾易读，我会用有帮助和有价值这种直接词语。写完以后就进入检查阶段，这时候才把整篇稿作为一个完整作品来核对。")
write("落笔·结尾", "完成正文", "Reducing unnecessary comparisons in routine shopping could help, while preserving diverse paths in more consequential areas remains valuable.", 3)

say("检查修改", "先看题目与立场", "先检查任务回应。题目问是否选择太多，以及同意到什么程度。开头回答部分同意，而且指出消费和教育就业的区分。第一主体段支持同意的范围，第二主体段支持不同意的范围，结尾也没有把判断改成完全同意。这四个地方是一致的。现在不因为结尾读起来顺，就临时把立场改得更绝对。接下来分别检查两个主体段是否把论点写清楚。", notes=["检查1｜题目与立场一致", "检查2｜每段支持是否具体", "检查3｜搭配／语法／指代", "检查4｜词数与结尾"])
say("检查修改", "检查消费段的证据", "消费段里，主题句是决策负担，解释是比较大量相似产品，例子是买笔记本电脑，影响是耗费注意力以及买后的疑虑。最后一句说筛选后的短名单可能更实用。这些句子没有依靠一个伪造的研究结论。例子是为了说明一个合理的情境，并不是证明世界上每个人都会如此。段落中的可能和在这样的情况下，保留了必要的范围。这里先通过。")
say("检查修改", "检查第二段的证据", "教育和就业段里，主题句是更多路径可以扩大机会。例子里有工作和家庭照顾的限制，也有兼职和远程学习这两个实际选项。接着说课程内容可以匹配个人需要，然后限定费用与时间。段尾回到有意义的选项不会只因数量多就成为缺点。这里有一个用词可以再收紧：排除这个表达稍显笼统，最好点明这些人是被排除在学习或职业进步之外。")
change("收紧机会的范围", "can open opportunities to people who would otherwise be excluded.", "can give people access to opportunities they would otherwise miss.", "现在把第二段主题句的后半改成，让人获得本来可能错过的机会。新版本仍然支持这段的判断，但不需要暗示有人主动把他们排除在外。你可以在画面里看到原短语和替换短语，正文也在这里发生变化。修改记录不会移到前面，原来写下的版本仍保存在过程文件里。这是这一次检查时做的表达调整。")
say("检查修改", "回看开头的措辞", "回到开头立场句。我们当时用了让购买更困难。正文现在已经把困难写得具体了，主要是比较占用时间和注意力。所以这里可以把更困难换成增加日常购买的决策负担。它更贴合第一主体段，而且没有改变观点。这一步不是把简单词全部换成长词，只是把开头的概括与正文实际论证的内容对齐。现在修改这个短语。")
change("让开头与正文更贴合", "can make everyday purchases more difficult", "can make everyday purchasing unnecessarily burdensome", "这一处替换完成。开头说日常购买可能带来不必要的负担，第一段详细解释这个负担，第二段给出仍有价值的其他选择。读者现在更容易理解我们的区分。检查时做这样的修改就够了，不需要为了显得高级，把全文每次出现的选择都换一个词。准确的核心词重复出现，也可以帮助读者跟住同一个话题。")
say("检查修改", "检查代词与名词", "接着看指代。第一段的这个过程，指前一句比较商品；未被选择的选项，仍在笔记本购买场景里。第二段的这些差异，指学习形式和课程内容；这些机会，指前面能够获得的学习机会。几个指代都有近处的对象。再看名词，教育、就业、学习在这里用作一般概念，没有随意加复数。相似选项和有意义的选项也没有在段落之间混成同一种东西。")
say("检查修改", "检查句子边界", "再检查句子是否完整。开头的转折有两部分，主体段里举例句也有主句。买家那句虽然较长，但逗号后有转折关系，仍然在描述同一个人。现在把第一段里这个过程消耗时间和注意力那句，再读一次。它是一句完整的解释，不需要另外加一个重复的因此。今天没有为了展示语法种类，硬插一个与内容没有关系的复杂结构。")
EVENTS.append(dict(phase="检查修改", label="朗读核对解释句", text="This process uses time and attention without necessarily leading to a better purchase.", lang="en-GB", pause=2.0))
say("检查修改", "检查限制与程度", "全文几个程度词也要核对。可能造成负担，不等于必然造成负担；几个有意义的选项，不等于越多越好；费用和时间可能限制获得机会，也不等于所有学习路径都不可用。这些限定共同形成部分同意的回答。现在不把可能删掉来制造所谓强立场。立场的清晰程度取决于适用范围是否明确，不是句子里所有措辞都要变得绝对。")
say("检查修改", "检查结尾有没有加新内容", "结尾里的相似选项重复，来自第一段许多商品只有小差异；多种人生路径，来自第二段学习和就业的选项。两个概括都有正文支持。结尾没有突然出现一个政府应该做什么的政策，也没有说选择一定会导致严重疾病。这里可以保持现状。最后看词数，正文已经超过二百五十词。这个数字只说明满足最低篇幅要求，不会自动给文章带来高分。")
say("检查修改", "全文形成", "这一遍检查结束。现在右边才是本集的最终稿。文章用一个有范围的判断回答题目，用两个具体场景展开，没有靠题外的大背景填字数。今天的过程文件会保留笔记出现的顺序、每一次输入以及两处替换。你可以把最终稿单独拿去评阅，也可以沿时间轴回看它怎样逐步形成。视频里的评分目标是训练方向，不是官方考官已经给出的分数。", notes=["完成｜部分同意", "消费：相似选项可能过多", "教育／职业：有效路径仍有价值", "2处可见修改；成稿可独立评阅"])
say("检查修改", "结束与独立练习", "这一集到这里结束。配套练习是关掉视频，用十分钟独立写一个主体段，说明一种真正有意义的选择怎样改善生活。先不要照着刚才的句子写，可以换成一个你熟悉的场景。写完检查是否有清楚的判断、具体人物或情境，以及可理解的影响。练习文件里有核对问题，成稿和旁白也都保留下来。下次再用另一道题继续练习。", pause=2.0)

def export():
    paragraphs=["", "", "", ""]
    notes=[]
    states=[]
    revisions=[]
    for i, event in enumerate(EVENTS):
        event["id"]=i+1
        if "notes" in event: notes=event["notes"][:]
        before=paragraphs[:]
        if "append" in event:
            p=event["paragraph"]
            paragraphs[p]=(paragraphs[p]+" "+event["append"]).strip()
        if "replace" in event:
            old,new=event["replace"]["old"],event["replace"]["new"]
            count=sum(p.count(old) for p in paragraphs)
            assert count==1, (old,count)
            paragraphs=[p.replace(old,new) for p in paragraphs]
            revisions.append(dict(event=i+1,old=old,new=new))
        states.append(dict(event=i+1,before=before,after=paragraphs[:],notes=notes[:]))
    essay="\n\n".join(paragraphs)
    words=len(re.findall(r"\b[\w]+(?:[-'][\w]+)*\b",essay))
    data=dict(series="代米手把手教你写雅思写作高分文章",episode=1,
              title="选择太多了吗？｜部分同意的完整写作示范",
              question=QUESTION,source="Cambridge IELTS 13 Academic · Test 2 · Writing Task 2 · printed page 52",
              source_verification="Local original book extraction, page marker 53; extracted text lines 1815–1822",
              random_draw=dict(pool="Cambridge 10–13 Academic Task 2",size=16,index_zero_based=13,method="Node crypto.randomInt"),
              disclosure="AI创作的教学模拟；旁白为供学习的简短写作说明，非真实考生或AI内部思维的实录。",
              target_minutes=[25,35],events=EVENTS,states=states,final_paragraphs=paragraphs,word_count=words,revisions=revisions)
    (BASE/"episode.json").write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    script=["# 第001集｜选择太多了吗？", "", data["disclosure"], "", "题目来源："+data["source"], "", "## 按制作顺序的旁白与动作", ""]
    for e in EVENTS:
        script += [f"### {e['id']:02} · {e['phase']} · {e['label']}", "", e["text"], ""]
        if "append" in e: script += [f"画面动作：向第{e['paragraph']+1}段逐步输入本段英文。", ""]
        if "notes" in e: script += ["画面笔记："+" / ".join(e["notes"]), ""]
        if "replace" in e: script += ["可见修改："+e["replace"]["old"]+" → "+e["replace"]["new"], ""]
    script += ["## 由上述动作形成的最终稿", "", f"词数：{words}（计数器对连字符词的处理可能略有不同）", "",essay]
    (BASE/"逐字稿与画面动作.md").write_text("\n".join(script),encoding="utf-8")
    (BASE/"最终文章.md").write_text("# 选择太多了吗？\n\n"+QUESTION+"\n\n"+f"原创教学示范｜{words}词｜非官方评分范文\n\n"+essay+"\n",encoding="utf-8")
    print(json.dumps(dict(events=len(EVENTS),essay_words=words,zh_characters=sum(len(e['text']) for e in EVENTS if e['lang']=='zh-CN'),english_words=sum(len(e['text'].split()) for e in EVENTS if e['lang']=='en-GB')),ensure_ascii=False))

if __name__=="__main__": export()
