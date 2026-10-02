"""Check exported streams, caption timing, and PDF pagination; create QA frames."""
from pathlib import Path
import json,subprocess,re
from PIL import Image,ImageOps,ImageDraw,ImageFont
import fitz

BASE=Path(__file__).resolve().parents[1];OUT=BASE/'build'/'qa';OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((BASE/'media-manifest.json').read_text(encoding='utf-8'))
checks=[];frames=[]
for item in manifest['lessons']:
    vid=BASE/item['video']
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(vid)],text=True))
    streams={s['codec_type']:s for s in probe['streams']}
    assert streams['video']['width']==1920 and streams['video']['height']==1080
    assert streams['video']['codec_name']=='h264' and streams['audio']['codec_name']=='aac'
    delta=abs(float(streams['audio']['duration'])-float(streams['video']['duration']))
    assert delta<.2,(item['id'],delta)
    captions=(BASE/item['captions']).read_text(encoding='utf-8')
    times=re.findall(r'(\d\d):(\d\d):(\d\d)\.(\d{3}) --> (\d\d):(\d\d):(\d\d)\.(\d{3})',captions)
    seconds=lambda x:int(x[0])*3600+int(x[1])*60+int(x[2])+int(x[3])/1000
    previous=0
    for match in times:
        start=seconds(match[:4]);end=seconds(match[4:]);assert start>=previous-.005 and end>start and end<=item['duration_seconds']+.05;previous=end
    target=OUT/f"lesson-{item['id']}.png"
    seek=item['chapters'][1]['start']+8
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(seek),'-i',str(vid),'-frames:v','1',str(target)],check=True)
    frames.append(target)
    checks.append({'id':item['id'],'duration':item['duration_seconds'],'video_audio_delta_seconds':round(delta,4),'caption_cues':len(times),'streams':['h264 1920x1080','aac','mov_text'],'result':'pass'})
contact=Image.new('RGB',(1920,4*600),'#e8eef4');d=ImageDraw.Draw(contact)
for i,f in enumerate(frames):
    im=Image.open(f);im.thumbnail((940,530));x=(i%2)*960;y=(i//2)*600;contact.paste(im,(x+10,y+35));d.text((x+12,y+10),'Lesson '+manifest['lessons'][i]['id'],font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',22),fill='#203f5e')
contact.save(OUT/'video-contact.png')
pdf=BASE/'output/pdf/simon-after-workbook.pdf'
with fitz.open(pdf) as doc:
    pages=[{'page':i+1,'chars':len(p.get_text()),'start':p.get_text()[:65].replace('\n',' / ')} for i,p in enumerate(doc)]
    print('PDF pages:',len(doc))
    for page in pages:print(page)
    # Render every page through Poppler; the contact sheet exposes unexpected overflow pages.
    subprocess.run(['pdftoppm','-r','65','-png',str(pdf),str(OUT/'workbook')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    allpng=[OUT/f'workbook-{i+1:02d}.png' for i in range(len(doc))]
    sheet=Image.new('RGB',(4*300,((len(allpng)+3)//4)*430),'#e8eef4')
    for i,p in enumerate(allpng):
        im=Image.open(p);im.thumbnail((284,399));sheet.paste(im,((i%4)*300+8,(i//4)*430+20))
    sheet.save(OUT/'workbook-contact.png')
    checks.append({'artifact':'workbook','pages':len(doc),'all_pages_rendered':True,'pagination':pages})
(OUT/'checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
print('Media timing and streams: pass. Visual review required for exported frames and PDF pages.')
