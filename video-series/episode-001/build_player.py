"""Export a file:// compatible study player without remote assets or fetch calls."""
from pathlib import Path
import json, html
BASE=Path(__file__).resolve().parent
data=json.loads((BASE/'episode.json').read_text(encoding='utf-8'))
timing=json.loads((BASE/'build/timing.json').read_text(encoding='utf-8'))
def esc(text):return html.escape(text,quote=True)
seconds=timing['duration_seconds']
duration=f'{int(seconds//60)}:{int(seconds%60):02}'
chapters=''.join(f'<button type="button" data-seek="{c["start"]}"><span>{int(c["start"]//60):02}:{int(c["start"]%60):02}</span>{esc(c["phase"])}</button>' for c in timing['chapters'])
transcript=''.join(f'<section class="transcript-event" data-start="{t["start"]}"><button type="button" data-seek="{t["start"]}">{int(t["start"]//60):02}:{int(t["start"]%60):02} · {esc(e["label"])}</button><p lang="{e["lang"]}">{esc(e["text"])}</p></section>' for e,t in zip(data['events'],timing['timeline']))
page='''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>代米手把手教你写雅思写作高分文章 · 第001集</title>
<style>
:root{--navy:#173b56;--ink:#202d3a;--muted:#617382;--teal:#007d7c;--fog:#edf2f5;--line:#c7d5de}
*{box-sizing:border-box}body{margin:0;background:var(--fog);color:var(--ink);font:16px/1.7 'Microsoft YaHei',sans-serif}
header{background:var(--navy);color:white;padding:24px max(24px,calc((100vw - 1360px)/2));}header p{margin:0;font-size:15px;opacity:.8}h1{font-size:clamp(22px,3vw,32px);margin:8px 0 0}
main{max-width:1410px;padding:26px;margin:auto}.intro{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:18px}.intro h2{margin:0;font-size:25px}.intro p{margin:3px 0;color:var(--muted)}.length{font-family:Consolas,monospace;font-size:30px;color:var(--teal)}
video{width:100%;display:block;background:var(--navy);aspect-ratio:16/9;border-radius:6px}.chapters{display:flex;gap:8px;flex-wrap:wrap;padding:18px 0}.chapters button,.transcript-event button{border:1px solid var(--line);background:white;color:var(--navy);font:inherit;cursor:pointer;padding:8px 12px;border-radius:4px}.chapters button span{font-family:Consolas,monospace;margin-right:10px;color:var(--muted)}button:hover{border-color:var(--teal)}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid var(--teal);outline-offset:3px}.active{box-shadow:inset 0 -3px var(--teal)}
.status{margin:0 0 22px;border-left:4px solid var(--teal);padding:8px 14px;background:white}.study{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{background:white;padding:24px;border-radius:5px}.card h3{margin-top:0;font-size:19px}.question{font:21px/1.6 Georgia,serif}.muted{color:var(--muted);font-size:14px}a{color:var(--teal)}details{margin-top:20px;background:white;padding:18px 24px}summary{cursor:pointer;font-weight:bold}.transcript-event{border-top:1px solid var(--line);padding:14px 0}.transcript-event button{border:0;padding:0;font-size:14px;color:var(--teal)}.transcript-event p{margin:8px 0 0}.transcript-event [lang=en-GB]{font-family:Georgia,serif;font-size:19px}footer{color:var(--muted);padding:24px 0;font-size:13px}
@media(max-width:700px){main{padding:15px}.study{grid-template-columns:1fr}.intro{align-items:flex-start}.length{font-size:25px}.card{padding:18px}header{padding:20px}.chapters button{font-size:14px}}
</style></head><body>
<header><p>第001集 · AI连续写作教学示范</p><h1>代米手把手教你写雅思写作高分文章</h1></header>
<main><div class="intro"><div><h2>选择太多了吗？</h2><p>剑桥雅思13 · Test 2 · Task 2 · 部分同意</p></div><div class="length">DURATION</div></div>
<video id="video" controls preload="metadata" poster="media/poster.png"><source src="media/episode-001.mp4" type="video/mp4"><track kind="subtitles" src="media/episode-001.vtt" srclang="zh" label="中文／英文旁白">你的浏览器不支持视频。<a href="media/episode-001.mp4">打开MP4</a></video>
<nav class="chapters" aria-label="视频阶段">CHAPTERS</nav><p id="status" class="status" aria-live="polite">从空白稿开始，按顺序跟写。</p>
<div class="study"><section class="card"><h3>今天的题目</h3><p class="question" lang="en">QUESTION</p><p class="muted">出处：Cambridge IELTS 13 Academic，印刷页52。题干已与本地原书文本核对。</p></section>
<section class="card"><h3>看完立即独立写</h3><p>关掉视频，用10分钟、80–110词说明一种有意义的选择如何改善生活。换一个你熟悉的场景，先独立写。</p><p>核对：明确判断 → 具体情境 → 不同选项 → 实际影响 → 回应题目。</p><p><a href="教学审校与练习.md">完整练习与审校</a> · <a href="media/episode-001.mp4" download>下载视频</a> · <a href="media/episode-001.srt" download>下载字幕</a></p></section></div>
<details><summary>跟随逐字稿（点击时间可跳转）</summary>TRANSCRIPT</details>
<details><summary>写完后查看最终文章</summary><p class="muted">273词 · 原创教学示范 · 未经官方考官评分</p>ESSAY<p><a href="最终文章.md">保存文章源文件</a></p></details>
<footer>AI创作的教学模拟，旁白为供学习的简短写作说明。目标7.5–9分，具体得分须独立评阅。计时是演示进度。本地播放，无账户登录，无学习数据上传。</footer></main>
<script>
const v=document.getElementById('video'),status=document.getElementById('status');
const phases=PHASES;
document.querySelectorAll('[data-seek]').forEach(b=>b.addEventListener('click',()=>{v.currentTime=Number(b.dataset.seek);v.play().catch(()=>{});}));
v.addEventListener('timeupdate',()=>{const i=Math.max(0,phases.findLastIndex(p=>p.start<=v.currentTime));status.textContent=phases[i].phase+' · 正文随演示逐步形成';document.querySelectorAll('.chapters button').forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-current',n===i?'step':'false');});});
</script></body></html>'''
page=page.replace('DURATION',duration).replace('CHAPTERS',chapters).replace('QUESTION',esc(data['question'])).replace('TRANSCRIPT',transcript).replace('ESSAY',''.join('<p class="question" lang="en">'+esc(p)+'</p>' for p in data['final_paragraphs'])).replace('PHASES',json.dumps(timing['chapters'],ensure_ascii=False))
(BASE/'index.html').write_text(page,encoding='utf-8')
print('Local player exported.')
