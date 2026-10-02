"""Build printable course notes, workbook and readable transcript sources."""
from pathlib import Path
import json,html,re

BASE=Path(__file__).resolve().parents[1]
data=json.loads((BASE/'lessons.json').read_text(encoding='utf-8'))
sources=json.loads((BASE/'research/sources.json').read_text(encoding='utf-8'))
e=html.escape
def p(text,cls=''):return f'<p class="{cls}">{e(text)}</p>'
def section(title,body,cls='',ident=''):return f'<section class="page {cls}" id="{ident}"><h2>{e(title)}</h2>{body}</section>'
def blanks(n=7):return '<div class="writing-lines">'+''.join('<div></div>' for _ in range(n))+'</div>'
def ul(rows):return '<ul>'+''.join(f'<li>{e(x)}</li>' for x in rows)+'</ul>'
pages=[]
pages.append('''<section class="page cover"><h1>Simon 之后<br>写作进阶训练</h1><p class="lead">从听懂方法，到独立写得出来。</p><p>适合已看过 Simon 或同类基础写作课、目前约 5.5-6.5 分，希望向 7.5 分以上训练的学术类考生。</p><div class="cover-flow"><p>独立尝试</p><p>示范修改</p><p>定向改写</p><p>换题复测</p></div><p>首批 8 课 · 原创教学模拟题 · 练习与参考讲评</p><p class="small">7.5 分以上是训练目标。课程完成记录、自查和 AI 参考反馈均不等于官方成绩。通过完整未见题、独立限时和外部评阅验证学习效果。</p><p class="edition">写作研习室 · 2026-10-01</p></section>''')
pages.append(section('怎样使用这套训练',p('你已经知道写作方法，但可能还没有在新题上稳定执行。本手册要求你先留下自己的答案，再看示范。写得卡、不完整、词句简单，都能提供诊断证据。')+'<h3>每课的使用顺序</h3>'+ul(['先做本课独立任务，保留初稿与用时。','看视频，辨认作者每次修改为什么必要。','只改一个主要问题；用原句与改句说明新增信息。','24 小时后换题，不查答案独立作答。','3 天与 7 天再次换题，检查同一动作是否稳定。'])+'<h3>进入下一阶段的依据</h3>'+p('能否在至少两道未见题上独立完成目标动作。仍做不到时，缩小任务再练；不要用看完视频代替练会。最后需要完整套题和有经验教师的外部评阅。')+'<h3>首次基线与末次验证</h3>'+p('课程前后各做一套不同且未见过的大小作文，60 分钟，保留完整题干和原图。请教师按四项标准评阅，尽量隐藏前后顺序。记录标准判断和原句证据；单次变好还需延迟复测。')+'<h3>完成记录</h3>'+p('播放器把练习保存在本机浏览器；可导出 JSON。播放器不自动打分。材料中的范文是原创示范稿，未获得官方分数。')))
for i in [0,16]:
    subset=data['curriculum'][i:i+16]
    table='<table class="curriculum"><thead><tr><th>课</th><th>课程 / 训练结果</th><th>状态</th></tr></thead><tbody>'
    for x in subset:table+=f'<tr><td>{x["id"]}</td><td><strong>{e(x["title"])}</strong><br><span class="small">{e(x["goal"])}</span></td><td>{"已制作" if x["status"]=="produced" else "待制作"}</td></tr>'
    table+='</tbody></table>'
    pages.append(section(f'32 课路径 · {i+1}-{i+16}',p('首批 8 课组成进阶核心训练。其余 24 课是后续教学设计，尚未制作视频；这里不将规划列为已完成成果。','small')+table))
for l in data['lessons']:
    body=p(l['goal'],'lead')+p('前置能力：'+l['prerequisite'],'small')+'<h3>今天只解决这件事</h3>'+p(l['exercise'])+'<h3>初稿：先不看答案</h3>'+blanks(9)+'<div class="meta-fields">用时：________　使用辅助：________</div><h3>最主要的障碍</h3>'+blanks(2)
    pages.append(section(f'{l["id"]} · {l["title"]}',body,ident='lesson-'+l['id']))
    body='<h3>讲解地图</h3>'+ul([s['title'] for s in l['scenes']])+'<h3>改写后的核查证据</h3>'+ul(l['rubric'])+'<table><tr><th>初稿原句</th><th>改写与修改理由</th></tr><tr><td class="empty"></td><td></td></tr></table><h3>下一题，独立再做</h3>'+p(l['transfer'])+'<div class="meta-fields">24 小时：________　3 天：________　7 天：________</div>'+p('复测时不读本课参考稿。若需要辅助，请记录；辅助成功与独立成功分别统计。','small')
    pages.append(section(f'{l["id"]} · 复盘与迁移',body))

ex=data['examples']
essay_words=len(re.findall(r"\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b",' '.join(ex['essay']['paragraphs'])))
report_words=len(re.findall(r"\b[A-Za-z0-9]+(?:['’-][A-Za-z]+)*\b",' '.join(ex['report']['paragraphs'])))
body=p('原创教学模拟题。不是官方真题；下方稿件未获得官方评分。','small')+p(ex['essay']['prompt'],'english')+p(f'本稿约 {essay_words} 个英文词；字数算法与考试系统可能略有差异。','small')
body+=''.join(p(x,'english') for x in ex['essay']['paragraphs'])
pages.append(section('完整示范 · Task 2',body,ident='essay'))
body=p('读示范前先完成独立任务。相同题目的改写用于整合；真正的迁移另用未见题。')+'<table><thead><tr><th>段落</th><th>它在回答什么</th><th>核查方法</th></tr></thead><tbody><tr><td>开头</td><td>部分同意；服务可靠与定向支持优先。</td><td>标出直接回答 free for everyone 的部分。</td></tr><tr><td>主体 A</td><td>降价为何能影响部分司机，以及适用条件。</td><td>画出 cost → choice → switching → fewer cars。</td></tr><tr><td>主体 B</td><td>普遍免费为何无法解决全部障碍。</td><td>检查便利性和预算取舍与政策判断的关系。</td></tr><tr><td>结尾</td><td>重申有限作用与优先级。</td><td>是否出现正文未讨论的新理由。</td></tr></tbody></table><h3>另一种立场也可能合理</h3>'+p('你可以较强地支持免费，但必须处理公交是否可用、资金安排是否合理等关键推理。没有唯一政策答案；文章质量来自你如何回答、组织、支撑和表达。')+'<h3>不能从本稿推出的规则</h3>'+ul(['不是所有作文都必须采用四段。','不是每段必须拥有固定的句数或固定词伙数量。','一个例子不因带 For example 就自动有效。','一篇教师改稿的质量不等于学生在新题上的能力。'])+'<h3>延迟复测任务</h3>'+p('Museums should offer free entry to all visitors. To what extent do you agree or disagree? 不读参考稿，40 分钟写至少 250 词。先记录回答地图，写完核查立场与两段理由是否一致。')
pages.append(section('示范稿的决策说明',body))
body=p('原创教学模拟题 / 模拟城市 / 模拟数据。不能据此推断现实城市的交通变化。','small')+p(ex['report']['prompt'],'english')+'<table><tr><th>Mode (%)</th><th>2005</th><th>2015</th><th>2025</th></tr>'
for key in ['Car','Bus','Bicycle']:body+='<tr><td>'+key+'</td>'+''.join(f'<td>{v}</td>' for v in ex['report']['data'][key])+'</tr>'
body+='</table>'+p(f'本稿约 {report_words} 词（含年份与数字）；未获得官方评分。','small')+''.join(p(x,'english') for x in ex['report']['paragraphs'])
pages.append(section('完整示范 · Task 1',body,ident='report'))
for start in [0,2,4,6]:
    body=p('请先完成初稿与改写，再核对以下参考。答案不是唯一版本，最终看题目覆盖与句子证据。','small')
    for l in data['lessons'][start:start+2]:body+=f'<h3>{l["id"]} · {e(l["title"])}</h3>'+p(l['answer'])+'<h4>复测时要留意</h4>'+ul(l['rubric'])
    pages.append(section('参考讲评 · '+f'{start+1:02}-{start+2:02}',body))
body='<h3>这套课程怎样借鉴现有材料</h3>'+p('以官方标准校准目标；参考 Simon 的清晰段落与读图方法、IELTS Advantage 的解释支撑练习、IELTS Liz 的段落导航及 British Council 的关系辨认活动。新增重点是保留初稿、显式解释修改决策、独立改写与换题复测。')+'<h3>避免把经验法当评分规则</h3>'+ul(['四段与固定句数只是可选脚手架。','支撑可以是具体解释、场景、对比或条件；不能机械凑例子。','连接词需要恰当使用，数量与复杂度不是衔接质量。','词汇准确、适切与灵活性不由固定配额决定。','小样本 AI 校准结果不构成新作文或真实考试的成绩保证。'])+'<h3>研究边界</h3>'+p('2026-10-01 已盘点本地材料并生成 21 个原视频的 ASR 草稿。自动转录不是人工校对；部分扫描 PDF 无文字层。网络资源存在重定向、付费访问或正文读取失败，来源状态单独记录。首轮调研不能声称已学完全网全部课程。')
pages.append(section('研究与审校口径',body))
body=''
for s in sources['sources'][:10]:
    body+=f'<div class="source"><strong>{e(s["id"]+" · "+s["title"])}</strong>'+p(s['status'],'small')+f'<a href="{e(s["url"])}">{e(s["url"])}</a></div>'
pages.append(section('来源与访问状态',body))
css='''@page{size:A4;margin:16mm 18mm}*{box-sizing:border-box}body{margin:0;background:#f3f5f7;color:#202936;font:10.5pt/1.65 'Microsoft YaHei','Segoe UI',sans-serif}.page{background:#fff;max-width:794px;min-height:1050px;padding:48px 60px;margin:24px auto;break-after:page;position:relative}.page:last-child{break-after:auto}h1{font-size:39pt;line-height:1.35;letter-spacing:-.025em;color:#203f5e;margin:50px 0 35px}h2{font-size:20pt;line-height:1.4;color:#203f5e;margin:0 0 23px;font-weight:600}h3{font-size:12pt;margin:25px 0 9px}h4{font-size:10.5pt;margin:12px 0 6px}p{margin:0 0 12px}.lead{font-size:15pt;line-height:1.55}.small{font-size:9pt;color:#546477}.english{font:12pt/1.65 Georgia,'Times New Roman',serif;margin-bottom:18px}.cover{padding-top:80px}.cover>p{max-width:48ch}.cover-flow{margin:50px 0;display:flex;flex-wrap:wrap;gap:12px}.cover-flow p{color:#294d73;border:1px solid #dce2e8;padding:12px 18px}.edition{margin-top:60px;color:#546477}.writing-lines div{height:36px;border-bottom:1px solid #dce2e8}.meta-fields{font-size:9pt;color:#546477;margin:15px 0 20px}.empty{height:125px;width:42%}table{width:100%;border-collapse:collapse;margin:14px 0;font-size:9.5pt}th,td{padding:8px 9px;text-align:left;vertical-align:top;border-bottom:1px solid #dce2e8}th{background:#e8eef4;color:#234363}tr{break-inside:avoid}ul{padding-left:20px;margin:10px 0 18px}li{margin:5px 0}.source{margin:10px 0;break-inside:avoid}.source p{margin:2px 0}.source a{font-size:8pt;overflow-wrap:anywhere;color:#294d73}a{color:#294d73}h2,h3,h4{break-after:avoid}header.browser-only{max-width:794px;margin:20px auto;padding:0 20px;display:flex;justify-content:space-between}@media print{body{background:#fff}.page{max-width:none;min-height:0;padding:0;margin:0;box-shadow:none}.browser-only{display:none!important}.page.cover{min-height:235mm}.source{margin:7px 0}.source a{font-size:7.5pt}}'''
css+=' .curriculum{font-size:9pt;line-height:1.45}.curriculum td,.curriculum th{padding:5px 8px}.curriculum .small{font-size:8pt}.curriculum td:first-child{width:28px}.curriculum td:last-child{width:55px;white-space:nowrap}'
doc='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Simon 之后 · 训练手册</title><style>'+css+'</style></head><body><header class="browser-only"><a href="index.html">返回课程播放器</a><a href="output/pdf/simon-after-workbook.pdf" download>下载 PDF</a></header>'+''.join(pages)+'</body></html>'
(BASE/'handbook.html').write_text(doc,encoding='utf-8')
notes=BASE/'notes';notes.mkdir(exist_ok=True)
for l in data['lessons']:
    text=f'# {l["id"]} · {l["title"]}\n\n目标：{l["goal"]}\n\n前置：{l["prerequisite"]}\n\n## 独立任务\n\n{l["exercise"]}\n\n'
    for i,s in enumerate(l['scenes']):
        text+=f'## 场景 {i+1}：{s["title"]}\n\n板书：\n\n'+''.join(f'- {row["tag"]}：{row["text"]}\n' for row in s['lines'])+'\n讲解：\n\n'+''.join(n['text']+'\n\n' for n in s['narration'])
    text+='## 自查证据\n\n'+''.join('- '+r+'\n' for r in l['rubric'])+f'\n## 参考讲评\n\n{l["answer"]}\n\n## 换题复测\n\n{l["transfer"]}\n\n来源：'+', '.join(l['sources'])+'（状态见 research/sources.json）。\n'
    (notes/f'lesson-{l["id"]}.md').write_text(text,encoding='utf-8')
curr='# Simon 之后：32 课教学路径\n\n用户定位：已学过基础课，独立写作约 5.5，向 7.5 分以上训练。首批 8 课已制作；其余 24 课待制作。\n\n每课使用「先尝试—看决策—定向改写—换题复测」。进度不等于成绩；未见限时题与外部评阅验证效果。\n\n'
for stage in dict.fromkeys(x['stage'] for x in data['curriculum']):
    curr+='## '+stage+'\n\n'
    for x in data['curriculum']:
        if x['stage']==stage:curr+=f'- {x["id"]} {x["title"]}（'+('已制作' if x['status']=='produced' else '待制作')+f'）：{x["goal"]}\n'
    curr+='\n'
(BASE/'课程总纲.md').write_text(curr,encoding='utf-8')
print(f'Handbook: {len(pages)} designed pages; essay {essay_words} words; report {report_words} words')
