"""Inventory local study inputs without reading configuration or secrets."""
from pathlib import Path
import json, subprocess, hashlib
import fitz

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'course' / 'research'
OUT.mkdir(parents=True, exist_ok=True)
roots = [ROOT / 'simon writting 9+12讲 写作', ROOT / '[真题]10-16', ROOT / 'knowledge', ROOT / 'extracted', ROOT / 'calibration' / 'transcripts']
files = list(ROOT.glob('*.pdf'))
for base in roots:
    files += list(base.rglob('*')) if base.exists() else []
items = []
for p in sorted(set(files)):
    if not p.is_file() or p.suffix.lower() not in {'.pdf','.docx','.xls','.xlsx','.mp4','.txt','.md'}:
        continue
    row = {'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'kind':p.suffix[1:]}
    if p.suffix == '.mp4':
        meta = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height','-of','json',str(p)],text=True))
        row.update(duration_seconds=float(meta['format']['duration']),streams=meta['streams'],review_status='ASR pending; not treated as fully reviewed')
    else:
        row['sha256'] = hashlib.sha256(p.read_bytes()).hexdigest()
        if p.suffix == '.pdf':
            try:
                with fitz.open(p) as doc:
                    row.update(pages=len(doc),text_chars=sum(len(page.get_text()) for page in doc))
                row['review_status'] = 'text available' if row['text_chars'] > 100 else 'scan/low text: requires visual/OCR review'
            except Exception as e:
                row['review_status'] = type(e).__name__
        elif p.suffix in {'.txt','.md'}:
            row['text_chars'] = len(p.read_text(encoding='utf-8',errors='replace'))
            row['review_status'] = 'empty extraction' if row['text_chars'] == 0 else 'text available; inventory is not proof of full review'
    items.append(row)
summary={'date':'2026-10-01','files':len(items),'videos':sum(i['kind']=='mp4' for i in items),'video_hours':round(sum(i.get('duration_seconds',0) for i in items)/3600,2),'pdfs':sum(i['kind']=='pdf' for i in items),'empty_extractions':[i['path'] for i in items if i.get('review_status')=='empty extraction'],'scan_pdfs':[i['path'] for i in items if i.get('text_chars',101)<100 and i['kind']=='pdf']}
(OUT/'local-materials.json').write_text(json.dumps({'summary':summary,'items':items},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
