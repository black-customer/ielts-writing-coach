"""Signal-level check only, not a listening or pronunciation audit."""
from pathlib import Path
import subprocess,json,re
BASE=Path(__file__).resolve().parents[1]
rows=[]
for p in sorted((BASE/'media').glob('*.mp4')):
    result=subprocess.run(['ffmpeg','-hide_banner','-i',str(p),'-af','volumedetect','-vn','-sn','-f','null','-'],capture_output=True,text=True,check=True)
    mean=re.search(r'mean_volume: ([\-\d.]+) dB',result.stderr);peak=re.search(r'max_volume: ([\-\d.]+) dB',result.stderr)
    assert mean and peak
    m=float(mean.group(1));x=float(peak.group(1));assert -35<m<-5 and -12<x<=0
    rows.append({'video':p.name,'mean_dbfs':m,'peak_dbfs':x,'signal':'pass'})
(BASE/'build/qa/audio-checks.json').write_text(json.dumps({'scope':'signal levels; not full listening audit','videos':rows},indent=2),encoding='utf-8')
print(json.dumps(rows,indent=2))
