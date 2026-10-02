"""Offline ASR of user's local videos; outputs stay private in ignored build/."""
from pathlib import Path
import json, time
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT/'course'/'build'/'source-transcripts'
OUT.mkdir(parents=True,exist_ok=True)
cache=Path.home()/'.cache/huggingface/hub/models--Systran--faster-whisper-base.en/snapshots'
snapshots=list(cache.glob('*'))
if not snapshots:
    raise SystemExit('No cached ASR model. No model download attempted.')
model=WhisperModel(str(snapshots[0]),device='cpu',compute_type='int8',cpu_threads=6,local_files_only=True)
videos=list((ROOT/'simon writting 9+12讲 写作'/'Simon videos Task').rglob('*.mp4'))
# Core teaching first, then the remaining source lectures.
videos.sort(key=lambda p:(0 if p.name.lower() in ['lesson 01.mp4','lesson 03.mp4'] else 1,str(p)))
for p in videos:
    ident=('t1' if 'Task 1' in p.parent.name else 't2')+'-'+p.stem.lower().replace(' ','-')
    target=OUT/(ident+'.json')
    if target.exists():
        continue
    started=time.time()
    segments,info=model.transcribe(str(p),language='en',beam_size=3,vad_filter=True)
    rows=[{'start':round(s.start,2),'end':round(s.end,2),'text':s.text.strip()} for s in segments]
    result={'source':p.relative_to(ROOT).as_posix(),'method':'faster-whisper base.en CPU int8, local cached model','status':'automatic draft; names, examples and claims require human verification','segments':rows}
    target.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/(ident+'.txt')).write_text('\n'.join(f"[{r['start']:.1f}-{r['end']:.1f}] {r['text']}" for r in rows),encoding='utf-8')
    print(f'{ident}: {len(rows)} segments, {time.time()-started:.0f}s processing',flush=True)
print('All available source videos transcribed to draft text.',flush=True)
