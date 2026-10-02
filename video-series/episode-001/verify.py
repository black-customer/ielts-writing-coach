"""Verify the actual media and the ordered visible writing record; export QA frames."""
from pathlib import Path
import json, subprocess, re, wave, math, array
BASE=Path(__file__).resolve().parent
data=json.loads((BASE/'episode.json').read_text(encoding='utf-8'))
timing=json.loads((BASE/'build/timing.json').read_text(encoding='utf-8'))
video=BASE/'media/episode-001.mp4'; qa=BASE/'build/qa';qa.mkdir(exist_ok=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(video)],text=True))
streams={s['codec_type']:s for s in probe['streams']}
assert streams['video']['codec_name']=='h264'
assert streams['audio']['codec_name']=='aac'
assert streams['subtitle']['codec_name']=='mov_text'
assert (streams['video']['width'],streams['video']['height'])==(1920,1080)
duration=float(probe['format']['duration'])
assert 1500<=duration<=2100
assert abs(duration-timing['duration_seconds'])<0.3
assert abs(float(streams['audio']['duration'])-float(streams['video']['duration']))<0.3
previous=['']*4
for e,state in zip(data['events'],data['states']):
    assert state['before']==previous
    p=previous[:]
    if 'append' in e:
        i=e['paragraph'];p[i]=(p[i]+' '+e['append']).strip()
    if 'replace' in e:p=[s.replace(e['replace']['old'],e['replace']['new']) for s in p]
    assert p==state['after']
    previous=p
assert previous==data['final_paragraphs']
assert len(re.findall(r"\b[\w]+(?:[-'][\w]+)*\b",' '.join(previous)))==data['word_count']>=250
for t in timing['timeline']:
    assert t['speech_seconds']>0.2
    assert 0<=t['start']<t['end']<=duration+0.3
    assert t['end']-t['start']-t['speech_seconds']<=3.01
for shot,e,state in zip(timing['snapshots'],data['events'],data['states']):
    assert shot['paragraphs']==state['after']
    assert Path(shot['path']).exists()
caption=(BASE/'media/episode-001.srt').read_text(encoding='utf-8')
lines=re.findall(r'(\d\d):(\d\d):(\d\d),(\d{3}) --> (\d\d):(\d\d):(\d\d),(\d{3})',caption)
last=0
for row in lines:
    values=list(map(int,row));start=values[0]*3600+values[1]*60+values[2]+values[3]/1000;end=values[4]*3600+values[5]*60+values[6]+values[7]/1000
    assert start>=last-0.005 and end>start and end<=duration+0.01
    last=end
# Check each event contains audible signal and no long inserted silent padding.
with wave.open(str(BASE/'build/episode.wav'),'rb') as wav:
    rate=wav.getframerate()
    rms=[]
    for t in timing['timeline']:
        wav.setpos(round(t['start']*rate));samples=array.array('h',wav.readframes(round(t['speech_seconds']*rate)))
        level=math.sqrt(sum(x*x for x in samples)/len(samples))
        assert level>100,(t['event'],level)
        rms.append(round(level,2))
samples=[('read',15),('outline',timing['timeline'][8]['start']+7),('typing',timing['timeline'][32]['start']+2),
         ('second-paragraph',timing['timeline'][47]['start']+2),('revision',timing['timeline'][60]['start']+timing['timeline'][60]['speech_seconds']*0.7),('final',duration-12)]
for name,at in samples:
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(at),'-i',str(video),'-frames:v','1',str(qa/f'{name}.png')],check=True)
report=dict(result='pass',duration_seconds=duration,video_audio_delta_seconds=abs(float(streams['audio']['duration'])-float(streams['video']['duration'])),
            codecs=[streams[k]['codec_name'] for k in ('video','audio','subtitle')],events=len(data['events']),caption_cues=len(lines),essay_words=data['word_count'],
            ordered_edits='verified',no_future_text_in_event_snapshots='verified',audible_signal_per_event='verified',
            visual_samples=[dict(name=n,seconds=t) for n,t in samples],limitations=['Visual samples must be inspected separately.','No full human listening review or official band score.'])
(BASE/'quality-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
