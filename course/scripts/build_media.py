"""Render original bilingual lessons as narrated 1080p MP4s and timed captions."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin
import asyncio, json, subprocess, wave, re, hashlib, time
import edge_tts

BASE=Path(__file__).resolve().parents[1]
BUILD=BASE/'build'
MEDIA=BASE/'media'
for p in [BUILD/'audio',BUILD/'frames',MEDIA]: p.mkdir(parents=True,exist_ok=True)
DATA=json.loads((BASE/'lessons.json').read_text(encoding='utf-8'))
FONTS=Path('C:/Windows/Fonts')
NAVY='#203F5E'; INK='#202936'; MUTED='#546477'; FOG='#F3F5F7'; BLUE='#294D73'; PAPER='#FFFFFF'

def font(size,lang='zh',bold=False):
    name=('georgiab.ttf' if bold else 'georgia.ttf') if lang=='en' else ('msyhbd.ttc' if bold else 'msyh.ttc')
    return ImageFont.truetype(str(FONTS/name),size)

def wrap(text,f,maxwidth,d):
    tokens=text.split(' ') if text.isascii() or sum(ord(c)>255 for c in text)<3 else list(text)
    sep=' ' if tokens!=list(text) else ''
    lines=[]; row=''
    for tok in tokens:
        candidate=row+sep+tok if row else tok
        if d.textlength(candidate,font=f)>maxwidth and row:
            lines.append(row); row=tok
        else: row=candidate
    if row: lines.append(row)
    return lines

def board(lesson,scene,idx,spoken='',lang='zh-CN',subtitle=True):
    im=Image.new('RGB',(1920,1080),FOG); d=ImageDraw.Draw(im)
    d.rectangle((0,0,1920,126),fill=NAVY)
    d.text((72,35),'Simon 之后 · 写作进阶课',font=font(35,bold=True),fill=PAPER)
    d.text((1410,43),f'第 {lesson["id"]} 课 · {idx+1}/{len(lesson["scenes"])}',font=font(26),fill='#E8EEF4')
    d.text((72,155),scene['title'],font=font(55,bold=True),fill=INK)
    d.rectangle((72,244,1848,872),fill=PAPER)
    available=966 if scene.get('chart') else 1644
    # Measure the board before painting: shrink the text only if its real content needs it.
    size=43
    while True:
        total=0
        for row in scene['lines']:
            n=len(wrap(row['text'],font(size,row['lang']),available,d))
            total+=32+n*(size+16)+25
        if total<=560 or size<=30: break
        size-=1
    if total>570: raise ValueError(f'Board overflows: {lesson["id"]}/{idx}')
    y=276
    for row in scene['lines']:
        d.text((112,y),row['tag'],font=font(23),fill=MUTED); y+=34
        selected=lang=='en-GB' and row['text'].lower() in spoken.lower()
        display=row['text'].replace('：',': ') if row['lang']=='en' else row['text']
        for t in wrap(display,font(size,row['lang']),available,d):
            d.text((112,y),t,font=font(size,row['lang']),fill=BLUE if selected else INK);y+=size+16
        y+=25
    if scene.get('chart'):
        chart(d)
    # The subtitle strip stays clear for the timed captions burned in by FFmpeg.
    d.rectangle((72,994,1848,997),fill='#DCE2E8')
    d.rectangle((72,994,72+int(1776*(idx+1)/len(lesson['scenes'])),997),fill=BLUE)
    d.text((72,1014),lesson['title'],font=font(26),fill=MUTED)
    d.text((1515,1014),'写作研习室 / 2026',font=font(25),fill=MUTED)
    meta=PngImagePlugin.PngInfo();meta.add_text('Description','Original teaching board rendered from course/lessons.json; author-created simulated examples, no external image source.')
    return im,meta

def chart(d):
    x0,y0,w,h=1180,735,565,350
    for value in [0,20,40,60]:
        yy=y0-int(h*value/60)
        d.line((x0,yy,x0+w,yy),fill='#DCE2E8',width=2)
        d.text((x0-65,yy-15),str(value)+'%',font=font(21),fill=MUTED)
    for i,year in enumerate([2005,2015,2025]):
        xx=x0+i*w/2
        d.text((xx-34,y0+25),str(year),font=font(22),fill=MUTED)
    colors=['#294D73','#267054','#85602B']
    for k,(name,values) in enumerate([('Car',[55,48,35]),('Bus',[30,32,40]),('Bicycle',[15,20,25])]):
        pts=[(x0+i*w/2,y0-h*v/60) for i,v in enumerate(values)]
        d.line(pts,fill=colors[k],width=6)
        for xx,yy in pts:d.ellipse((xx-7,yy-7,xx+7,yy+7),fill=colors[k])
        d.text((x0+k*190,290),name,font=font(24,'en',True),fill=colors[k])
    d.text((x0,804),'原创模拟数据 · 每年合计 100%',font=font(22),fill=MUTED)

SEM=asyncio.Semaphore(4)
async def voice(text,lang):
    name='en-GB-SoniaNeural' if lang=='en-GB' else 'zh-CN-XiaoxiaoNeural'
    key=hashlib.sha256((name+'|-5%|'+text).encode()).hexdigest()[:20]
    path=BUILD/'audio'/(key+'.mp3')
    if not path.exists():
        async with SEM:
            for attempt in range(3):
                try:
                    await asyncio.wait_for(edge_tts.Communicate(text,name,rate='-5%').save(str(path)),timeout=55)
                    break
                except Exception:
                    if path.exists():path.unlink()
                    if attempt==2:raise
                    await asyncio.sleep(2+attempt*3)
    return path

def probe(p):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)],text=True))

def stamp(sec,vtt=False):
    ms=round(sec*1000);hh,ms=divmod(ms,3600000);mm,ms=divmod(ms,60000);ss,ms=divmod(ms,1000)
    return f'{hh:02}:{mm:02}:{ss:02}{"." if vtt else ","}{ms:03}'

def split_caption(text,lang):
    limit=75 if lang=='en-GB' else 38
    if lang=='en-GB':
        tokens=text.split();chunks=[];buf=''
        for t in tokens:
            if len(buf+' '+t)>limit and buf:chunks.append(buf);buf=t
            else:buf=(buf+' '+t).strip()
        if buf:chunks.append(buf)
        return chunks
    parts=re.findall(r'[^。！？；]+[。！？；]?',text);chunks=[]
    for p in parts:
        while len(p)>limit:
            cut=max(p.rfind('，',0,limit),p.rfind('：',0,limit))
            cut=cut+1 if cut>12 else limit
            chunks.append(p[:cut]);p=p[cut:]
        if p:chunks.append(p)
    return chunks

async def main():
    entries=[]
    for lesson in DATA['lessons']:
        output=MEDIA/f"lesson-{lesson['id']}.mp4"
        content_hash=hashlib.sha256(json.dumps(lesson,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
        if output.exists() and (BUILD/f"timing-{lesson['id']}.json").exists():
            cached=json.loads((BUILD/f"timing-{lesson['id']}.json").read_text(encoding='utf-8'))
            if cached.get('renderer_version')==2 and cached.get('content_sha256')==content_hash:
                entries.append(cached);continue
        print(f"Generating voices {lesson['id']}: {lesson['title']}",flush=True)
        flat=[(sidx,n) for sidx,s in enumerate(lesson['scenes']) for n in s['narration']]
        voiced=await asyncio.gather(*(voice(n['text'],n['lang']) for _,n in flat))
        wavpath=BUILD/f"lesson-{lesson['id']}.wav"
        framefile=BUILD/f"frames-{lesson['id']}.txt"
        frame_rows=[];cues=[];chapters=[];seconds=0
        with wave.open(str(wavpath),'wb') as wav:
            wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(32000)
            for i,((sidx,n),audio) in enumerate(zip(flat,voiced)):
                if not chapters or chapters[-1]['scene']!=sidx:
                    chapters.append({'scene':sidx,'title':lesson['scenes'][sidx]['title'],'start':round(seconds,3)})
                pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(audio),'-f','s16le','-ac','1','-ar','32000','pipe:1'])
                duration=len(pcm)/(32000*2)
                chunks=split_caption(n['text'],n['lang']);chars=sum(len(x) for x in chunks)
                pos=seconds
                for part in chunks:
                    dt=duration*len(part)/chars;cues.append({'start':pos,'end':pos+dt,'text':part});pos+=dt
                pause=0.65
                wav.writeframes(pcm);wav.writeframes(b'\0'*int(32000*2*pause))
                im,meta=board(lesson,lesson['scenes'][sidx],sidx,n['text'],n['lang'])
                frame=BUILD/'frames'/f"{lesson['id']}-{i:03}.png";im.save(frame,pnginfo=meta)
                frame_rows.extend([f"file '{frame.as_posix()}'",f'duration {duration+pause:.6f}'])
                seconds+=duration+pause
        frame_rows.append(f"file '{frame.as_posix()}'")
        framefile.write_text('\n'.join(frame_rows),encoding='utf-8')
        srt='\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(cues))+'\n'
        vtt='WEBVTT\n\n'+'\n\n'.join(f"{stamp(c['start'],True)} --> {stamp(c['end'],True)}\n{c['text']}" for c in cues)+'\n'
        (MEDIA/f"lesson-{lesson['id']}.srt").write_text(srt,encoding='utf-8')
        (MEDIA/f"lesson-{lesson['id']}.vtt").write_text(vtt,encoding='utf-8')
        # Burn in the same timed subtitles and embed a switchable subtitle track.
        relative=f"media/lesson-{lesson['id']}.srt"
        style='FontName=Microsoft YaHei,FontSize=15,PrimaryColour=&H00362920,OutlineColour=&H00F7F5F3,BorderStyle=3,Outline=1,Shadow=0,MarginV=37,Alignment=2'
        filt=f"fps=24,subtitles='{relative}':force_style='{style}'"
        print(f"Encoding {lesson['id']}: {seconds/60:.1f} min",flush=True)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(framefile),'-i',str(wavpath),'-i',relative,'-map','0:v','-map','1:a','-map','2:s','-vf',filt,'-t',str(seconds),'-c:v','libx264','-preset','veryfast','-tune','stillimage','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-c:s','mov_text','-metadata:s:s:0','language=zho','-movflags','+faststart',str(output)],cwd=BASE,check=True)
        im,meta=board(lesson,lesson['scenes'][0],0,subtitle=False)
        im.save(MEDIA/f"lesson-{lesson['id']}-poster.png",pnginfo=meta)
        meta=probe(output)
        item={'id':lesson['id'],'title':lesson['title'],'duration_seconds':float(meta['format']['duration']),'bytes':output.stat().st_size,'video':f"media/lesson-{lesson['id']}.mp4",'captions':f"media/lesson-{lesson['id']}.vtt",'poster':f"media/lesson-{lesson['id']}-poster.png",'voices':['zh-CN-XiaoxiaoNeural','en-GB-SoniaNeural'],'voice_type':'synthetic neural narration','renderer_version':2,'chapters':chapters,'sha256':hashlib.sha256(output.read_bytes()).hexdigest()}
        item['content_sha256']=content_hash
        (BUILD/f"timing-{lesson['id']}.json").write_text(json.dumps(item,ensure_ascii=False,indent=2),encoding='utf-8')
        entries.append(item)
        print(f"Finished {lesson['id']} ({item['bytes']/1024/1024:.1f} MB)",flush=True)
    manifest={'generated_on':'2026-10-01','resolution':[1920,1080],'fps':24,'lessons':entries,'total_seconds':sum(x['duration_seconds'] for x in entries),'status':'encoded; automated and visual QA tracked separately'}
    (BASE/'media-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (BASE/'media-manifest.js').write_text('window.COURSE_MEDIA = '+json.dumps(manifest,ensure_ascii=False)+';',encoding='utf-8')
    print(f"Total: {manifest['total_seconds']/60:.1f} minutes",flush=True)

if __name__=='__main__':asyncio.run(main())
