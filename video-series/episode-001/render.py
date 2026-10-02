"""Produce an incremental, bilingual writing demonstration with auditable timing.

Requires installed Pillow, edge-tts and FFmpeg. Network TTS sends only this
episode's original narration to the speech service, never unrelated project data.
"""
from pathlib import Path
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont
import asyncio, hashlib, json, re, subprocess, wave, argparse, html
import edge_tts

BASE=Path(__file__).resolve().parent
BUILD=BASE/'build'; MEDIA=BASE/'media'
for p in [BUILD/'audio',BUILD/'frames',MEDIA]:p.mkdir(parents=True,exist_ok=True)
DATA=json.loads((BASE/'episode.json').read_text(encoding='utf-8'))
INK='#202D3A'; MUTED='#617382'; NAVY='#173B56'; TEAL='#007D7C'; PAPER='#FFFFFF'; FOG='#EDF2F5'; BLUE='#245AE3'; ORANGE='#AD510F'
RATE='-8%'; VERSION=1; SEM=asyncio.Semaphore(4)

def run(args):return subprocess.run(args,check=True,cwd=BASE)
def probe(path):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(path)],text=True))

@lru_cache(maxsize=30)
def font(size,lang='zh',bold=False):
    face=('georgiab.ttf' if bold else 'georgia.ttf') if lang=='en' else ('msyhbd.ttc' if bold else 'msyh.ttc')
    return ImageFont.truetype('C:/Windows/Fonts/'+face,size)

def wrap(text,f,width,d):
    zh=any(ord(c)>255 for c in text)
    tokens=list(text) if zh else text.split()
    sep='' if zh else ' '
    lines=[]; row=''
    for token in tokens:
        trial=row+sep+token if row else token
        if d.textlength(trial,font=f)>width and row:
            lines.append(row);row=token
        else:row=trial
    if row:lines.append(row)
    return lines

def paint(event,paragraphs,notes,revision=None,full=False):
    im=Image.new('RGB',(1920,1080),FOG);d=ImageDraw.Draw(im)
    d.rectangle((0,0,1920,94),fill=NAVY)
    d.text((54,24),'代米手把手教你写雅思写作高分文章',font=font(34,bold=True),fill=PAPER)
    d.text((1530,34),'第 001 集 · 连续写作',font=font(24),fill='#D5E7ED')
    d.text((54,121),'选择太多了吗？',font=font(32,bold=True),fill=INK)
    d.text((54,166),'剑桥雅思13 · Test 2 · Task 2',font=font(22),fill=MUTED)
    d.text((1510,121),'演示进度',font=font(22),fill=MUTED)
    d.rectangle((54,214,488,911),fill=PAPER)
    d.rectangle((54,214,59,911),fill=TEAL)
    d.text((82,239),'题目',font=font(23,bold=True),fill=TEAL)
    y=281
    for line in wrap(DATA['question'],font(24,'en'),374,d):
        d.text((82,y),line,font=font(24,'en'),fill=INK);y+=37
    y+=26
    d.line((82,y,455,y),fill='#DAE3E9',width=2);y+=25
    d.text((82,y),'当前笔记',font=font(23,bold=True),fill=TEAL);y+=47
    if not notes:d.text((82,y),'先读题，笔记还未形成。',font=font(23),fill=MUTED)
    for note in notes:
        lines=wrap(note,font(23),352,d)
        d.ellipse((82,y+12,88,y+18),fill=TEAL)
        for line in lines:
            assert y<875,('Notes overflow',event['id'])
            d.text((103,y),line,font=font(23),fill=INK);y+=35
        y+=15
    d.rectangle((528,214,1866,911),fill=PAPER)
    d.text((564,239),event['phase'],font=font(23,bold=True),fill=TEAL)
    words=len(re.findall(r"\b[\w]+(?:[-'][\w]+)*\b",' '.join(paragraphs)))
    d.text((1550,242),f'{words:03} 词',font=font(22),fill=MUTED)
    d.line((564,283,1828,283),fill='#DAE3E9',width=2)
    if not any(paragraphs):
        d.text((586,335),'从这里开始写。',font=font(29),fill='#8B9DAA')
        d.line((586,391,586,428),fill=BLUE,width=3)
    else:
        f=font(27 if full else 32,'en')
        lineheight=39 if full else 47
        rows=[]
        review_target={
            '先看题目与立场':0,'检查消费段的证据':1,'检查第二段的证据':2,
            '收紧机会的范围':2,'回看开头的措辞':0,'让开头与正文更贴合':0,
            '检查句子边界':1,'朗读核对解释句':1,'检查限制与程度':2,
            '检查结尾有没有加新内容':3,
        }.get(event['label'])
        if review_target is not None:
            d.text((1725,243),f'第{review_target+1}段',font=font(20),fill=MUTED)
        for pidx,p in enumerate(paragraphs):
            if review_target is not None and pidx!=review_target:continue
            if not p:continue
            for n,line in enumerate(wrap(p,f,1195,d)):
                rows.append((pidx,line,n==0))
            rows.append((pidx,'',False))
        if rows and not rows[-1][1]:rows.pop()
        capacity=14 if full else (10 if revision else 12)
        visible=rows[-capacity:]
        offset=len(rows)-len(visible)
        if offset:d.text((1770,299),'↑',font=font(22),fill=MUTED)
        y=321
        for pidx,line,first in visible:
            if first:d.text((562,y+6),str(pidx+1),font=font(20),fill='#9DB1BD')
            d.text((600,y),line,font=f,fill=INK)
            y+=lineheight
        if visible:
            lastline=visible[-1][1]
            x=600+d.textlength(lastline,font=f)+5
            if x<1800:d.line((x,y-lineheight+5,x,y-7),fill=BLUE,width=3)
        if revision:
            d.rectangle((558,810,1837,893),fill='#FFF4E8')
            d.text((578,822),'本次可见修改',font=font(19,bold=True),fill=ORANGE)
            old=revision['old'];new=revision['new']
            d.text((765,820),old,font=font(21,'en'),fill=MUTED)
            d.line((765,836,765+d.textlength(old,font=font(21,'en')),836),fill=MUTED,width=1)
            d.text((765,855),'→',font=font(23),fill=ORANGE)
            d.text((798,857),new,font=font(21,'en'),fill=ORANGE)
    # Captions are rendered below the writing canvas, never over the manuscript.
    d.rectangle((0,932,1920,1050),fill='#F9FBFC')
    d.line((54,932,1866,932),fill='#C7D5DE',width=2)
    d.text((54,1055),'AI教学模拟 · 目标7.5–9分 · 非官方评分',font=font(17),fill=MUTED)
    d.text((1565,1055),event['label'],font=font(17),fill=MUTED)
    return im

async def speak(event):
    voice='en-GB-SoniaNeural' if event['lang']=='en-GB' else 'zh-CN-XiaoxiaoNeural'
    key=hashlib.sha256((voice+'|'+RATE+'|word|'+event['text']).encode()).hexdigest()[:24]
    mp3=BUILD/'audio'/f'{key}.mp3'; meta=mp3.with_suffix('.json')
    if mp3.exists() and meta.exists():return mp3,json.loads(meta.read_text(encoding='utf-8'))
    async with SEM:
        for attempt in range(3):
            try:
                cues=[]
                async def collect():
                    with mp3.open('wb') as dest:
                        async for part in edge_tts.Communicate(event['text'],voice,rate=RATE,boundary='WordBoundary').stream():
                            if part['type']=='audio':dest.write(part['data'])
                            elif part['type']=='WordBoundary':
                                cues.append(dict(start=part['offset']/1e7,duration=part['duration']/1e7,text=part['text']))
                await asyncio.wait_for(collect(),timeout=55)
                assert mp3.stat().st_size>1000
                result=dict(voice=voice,boundaries=cues,rate=RATE)
                meta.write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
                print(f"voice {event['id']:02}/{len(DATA['events'])}",flush=True)
                return mp3,result
            except Exception as err:
                if mp3.exists():mp3.unlink()
                if attempt==2:raise
                print(f"retry voice {event['id']}: {type(err).__name__}",flush=True)
                await asyncio.sleep(2+attempt*3)

def stamp(seconds,kind='srt'):
    ms=round(seconds*1000)
    h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
    return f'{h:02}:{m:02}:{s:02}{"," if kind=="srt" else "."}{ms:03}'

def ass_stamp(seconds):
    cs=round(seconds*100);h,cs=divmod(cs,360000);m,cs=divmod(cs,6000);s,cs=divmod(cs,100)
    return f'{h}:{m:02}:{s:02}.{cs:02}'

def caption_chunks(event,meta,duration):
    text=event['text'];zh=event['lang']=='zh-CN'
    # Use service word offsets to align caption groups, retaining exact source text.
    boundaries=meta['boundaries'];limit=42 if zh else 78
    spans=[];startchar=0;buf='';group_start=0.0;last_end=0.0
    for boundary in boundaries:
        found=text.find(boundary['text'],startchar)
        if found<0:continue
        end=found+len(boundary['text'])
        addition=text[startchar:end]
        if buf and len(buf+addition)>limit:
            spans.append(dict(start=group_start,end=boundary['start'],text=buf))
            buf='';group_start=boundary['start']
        if not buf:group_start=boundary['start']
        buf+=addition;startchar=end
        last_end=boundary['start']+boundary['duration']
        if buf.rstrip().endswith(('。','！','？','；')) or (not zh and buf.rstrip().endswith(('.', '?', '!'))):
            spans.append(dict(start=group_start,end=last_end+0.10,text=buf))
            buf=''
    buf+=text[startchar:]
    if buf.strip():spans.append(dict(start=group_start,end=duration,text=buf))
    if not spans:spans=[dict(start=0,end=duration,text=text)]
    for n,c in enumerate(spans):
        c['end']=min(duration,c['end'],spans[n+1]['start'] if n+1<len(spans) else duration)
        if c['end']<=c['start']:c['end']=min(duration,c['start']+0.15)
        c['text']=c['text'].strip()
        c['lang']=event['lang']
    return spans

async def prepare():
    voices=await asyncio.gather(*(speak(e) for e in DATA['events']))
    timings=[];t=0
    wavpath=BUILD/'episode.wav'
    with wave.open(str(wavpath),'wb') as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(32000)
        for e,(audio,meta) in zip(DATA['events'],voices):
            pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(audio),'-f','s16le','-ac','1','-ar','32000','pipe:1'])
            duration=len(pcm)/64000
            timings.append(dict(event=e['id'],start=t,speech_seconds=duration,end=t+duration+e['pause'],metadata=meta))
            out.writeframes(pcm);out.writeframes(b'\0'*round(e['pause']*64000))
            t+=duration+e['pause']
    print(f'Actual duration: {t/60:.2f} minutes',flush=True)
    if not 25*60<=t<=35*60:
        raise ValueError(f'Actual voice duration {t/60:.2f} outside requested 25–35 minutes; revise narration or natural speech rate, do not pad silence.')
    captions=[];frame_rows=[];snapshots=[];chapters=[];frameidx=0
    for e,state,timing in zip(DATA['events'],DATA['states'],timings):
        start=timing['start'];speech=timing['speech_seconds'];total=timing['end']-start
        if not chapters or chapters[-1]['phase']!=e['phase']:
            chapters.append(dict(phase=e['phase'],start=start))
        for c in caption_chunks(e,timing['metadata'],speech):
            captions.append(dict(start=start+c['start'],end=start+c['end'],text=c['text'],lang=c['lang']))
        steps=[]
        if 'append' in e:
            words=list(re.finditer(r'\S+',e['append']))
            bounds=timing['metadata']['boundaries']
            # The manuscript progresses at the spoken word boundaries, with a tiny
            # 0.1 s input lead. No later sentence appears ahead of its own event.
            steps=[(0,state['before'],None)]
            lasttime=0
            for n,w in enumerate(words):
                when=max(0.10,(bounds[n]['start']-0.1) if n<len(bounds) else speech*(n+1)/len(words))
                when=max(lasttime+0.04,when)
                when=min(when,speech-0.04)
                p=state['before'][:];idx=e['paragraph']
                p[idx]=(p[idx]+' '+e['append'][:w.end()]).strip()
                steps.append((when,p,None));lasttime=when
        elif 'replace' in e:
            steps=[(0,state['before'],None),(speech*0.28,state['before'],e['replace']),
                   (speech*0.55,state['after'],e['replace'])]
        else:steps=[(0,state['after'],None)]
        for j,(when,p,revision) in enumerate(steps):
            end=steps[j+1][0] if j+1<len(steps) else total
            duration=end-when
            assert duration>0, (e['id'],when,end)
            im=paint(e,p,state['notes'],revision)
            path=BUILD/'frames'/f'{frameidx:05}.png';frameidx+=1
            im.save(path,optimize=False)
            frame_rows += [f"file '{path.as_posix()}'",f'duration {duration:.6f}']
            if j==len(steps)-1:snapshots.append(dict(event=e['id'],at=start+when,path=str(path),paragraphs=p))
    frame_rows.append(f"file '{path.as_posix()}'")
    (BUILD/'frames.txt').write_text('\n'.join(frame_rows),encoding='utf-8')
    (MEDIA/'episode-001.srt').write_text('\n\n'.join(f"{n+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for n,c in enumerate(captions))+'\n',encoding='utf-8')
    (MEDIA/'episode-001.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f"{stamp(c['start'],'vtt')} --> {stamp(c['end'],'vtt')}\n{c['text']}" for c in captions)+'\n',encoding='utf-8')
    ass=['[Script Info]','ScriptType: v4.00+','PlayResX: 1920','PlayResY: 1080','WrapStyle: 0','ScaledBorderAndShadow: yes','',
         '[V4+ Styles]','Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
         'Style: zh,Microsoft YaHei,34,&H003A2D20,&H003A2D20,&H00FCFBF9,&H00FCFBF9,0,0,0,0,100,100,0,0,1,0,0,2,100,100,46,1',
         'Style: en,Georgia,33,&H003A2D20,&H003A2D20,&H00FCFBF9,&H00FCFBF9,0,0,0,0,100,100,0,0,1,0,0,2,100,100,46,1','',
         '[Events]','Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
    for c in captions:
        style='en' if c['lang']=='en-GB' else 'zh'
        text=c['text'].replace('{','').replace('}','').replace('\n',r'\N')
        ass.append(f"Dialogue: 0,{ass_stamp(c['start'])},{ass_stamp(c['end'])},{style},,0,0,0,,{text}")
    (BUILD/'captions.ass').write_text('\n'.join(ass),encoding='utf-8')
    paint(DATA['events'][0],['']*4,[]).save(MEDIA/'poster.png')
    manifest=dict(renderer_version=VERSION,generated_on='2026-10-01',title=DATA['title'],duration_seconds=t,
                  resolution=[1920,1080],fps=12,essay_words=DATA['word_count'],voice_rate=RATE,
                  voices=['zh-CN-XiaoxiaoNeural','en-GB-SoniaNeural'],voice_type='synthetic neural',
                  timeline=timings,chapters=chapters,snapshots=snapshots,caption_cues=len(captions),frames=frameidx,
                  video='media/episode-001.mp4',captions='media/episode-001.vtt',disclosure=DATA['disclosure'])
    (BUILD/'timing.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Prepared {frameidx} writing frames, {len(captions)} captions.',flush=True)
    return manifest

def encode(manifest,preview=False):
    output=MEDIA/('preview-45s.mp4' if preview else 'episode-001.mp4')
    seconds=45 if preview else manifest['duration_seconds']
    # Clock is generated from presentation time; it is not the speed of a real exam.
    filt="fps=12,subtitles=build/captions.ass,drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='%{pts\\:hms}':x=1660:y=118:fontsize=29:fontcolor=0x173B56"
    print('Encoding '+output.name,flush=True)
    run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','concat','-safe','0','-i',str(BUILD/'frames.txt'),
         '-i',str(BUILD/'episode.wav'),'-i','media/episode-001.srt','-map','0:v','-map','1:a','-map','2:s',
         '-vf',filt,'-t',str(seconds),'-c:v','libx264','-preset','veryfast','-tune','stillimage','-crf','24',
         '-pix_fmt','yuv420p','-c:a','aac','-b:a','112k','-c:s','mov_text','-metadata:s:s:0','language=zho',
         '-movflags','+faststart','-progress',str(BUILD/'encode-progress.txt'),str(output)])
    manifest['encoded_file']=str(output)
    manifest['bytes']=output.stat().st_size
    if not preview:
        public={k:v for k,v in manifest.items() if k not in ('timeline','snapshots')}
        public['chapters']=[dict(title=c['phase'],start=c['start']) for c in manifest['chapters']]
        (BASE/'media-manifest.json').write_text(json.dumps(public,ensure_ascii=False,indent=2),encoding='utf-8')
    return output

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--prepare-only',action='store_true');parser.add_argument('--encode-only',action='store_true');parser.add_argument('--preview',action='store_true')
    args=parser.parse_args()
    manifest=json.loads((BUILD/'timing.json').read_text(encoding='utf-8')) if args.encode_only else asyncio.run(prepare())
    if not args.prepare_only:encode(manifest,args.preview)
