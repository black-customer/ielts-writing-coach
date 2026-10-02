#!/usr/bin/env python3
"""Publish committed source with GitHub Git Data API when Git transport is unavailable."""
import base64, hashlib, io, json, os, re, subprocess, sys, tarfile, tempfile, time
from pathlib import Path

REPOSITORY = 'repos/black-customer/ielts-writing-coach'
BRANCH = 'main'
CACHE = Path('models/.blob-cache.json')

def gh(endpoint, method='GET', payload=None):
    command = ['gh','api','--method',method,endpoint]
    temporary = None
    try:
        if payload is not None:
            with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',suffix='.json',delete=False) as task_file:
                json.dump(payload,task_file,ensure_ascii=False);temporary=task_file.name
            command.extend(['--input',temporary])
        result=subprocess.run(command,capture_output=True,text=True,encoding='utf-8',timeout=45)
        if result.returncode:raise RuntimeError(f'GitHub {method} {endpoint}: {result.stderr[:400]}')
        return json.loads(result.stdout) if result.stdout.strip() else {}
    finally:
        if temporary:Path(temporary).unlink(missing_ok=True)

def retry(operation):
    for attempt in range(3):
        try:return operation()
        except (RuntimeError,subprocess.TimeoutExpired) as error:
            if attempt==2 or any(code in str(error) for code in ['409','422','401','403']):raise
            print(f'Retrying request {attempt+1}/2',flush=True);time.sleep(2)

def publish(dry_run=False):
    if subprocess.check_output(['git','status','--porcelain']).strip():raise RuntimeError('Commit intended project changes before publishing.')
    local_commit=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()
    parent=gh(f'{REPOSITORY}/git/ref/heads/{BRANCH}')['object']['sha']
    remote_tree=gh(f'{REPOSITORY}/git/trees/{parent}?recursive=1')
    if remote_tree.get('truncated'):raise RuntimeError('Remote tree is truncated; refusing incomplete comparison.')
    remote={item['path']:item['sha'] for item in remote_tree['tree'] if item['type']=='blob'}
    entries=[]
    committed={}
    for row in subprocess.check_output(['git','ls-tree','-rz','HEAD']).decode('utf-8').split('\0'):
        if row:
            metadata,path=row.split('\t',1);committed[path]=metadata.split()[2]
    with tarfile.open(fileobj=io.BytesIO(subprocess.check_output(['git','-c','core.autocrlf=false','-c','core.eol=lf','archive','--format=tar','HEAD']))) as tree:
        for item in tree.getmembers():
            if not item.isfile():continue
            content=tree.extractfile(item).read();sha=hashlib.sha1(f'blob {len(content)}\0'.encode()+content).hexdigest()
            if committed.get(item.name)!=sha:raise RuntimeError(f'Archive differs from committed blob: {item.name}')
            # A detected credential is reported by filename only, never by value.
            if re.search(rb'(?<![A-Za-z0-9_/-])(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{25,})',content):raise RuntimeError(f'Potential credential in committed file: {item.name}')
            if remote.get(item.name)!=sha:entries.append((item.name,content,sha))
    print(f'Local commit: {local_commit}\nRemote parent: {parent}\nChanged/new files: {len(entries)}',flush=True)
    if dry_run:print(json.dumps([entry[0] for entry in entries],ensure_ascii=False,indent=2));return
    if not entries:print('Committed source already matches remote.');return
    cache=json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {};changes=[]
    for number,(path,content,expected_sha) in enumerate(entries,1):
        if cache.get(path,{}).get('sha')==expected_sha:sha=expected_sha
        else:
            blob=retry(lambda:gh(f'{REPOSITORY}/git/blobs','POST',{'content':base64.b64encode(content).decode(),'encoding':'base64'}));sha=blob['sha']
            if sha!=expected_sha:raise RuntimeError(f'Blob verification failed: {path}')
            cache[path]={'sha':sha,'size':len(content)};CACHE.write_text(json.dumps(cache),encoding='utf-8')
        changes.append({'path':path,'mode':'100644','type':'blob','sha':sha})
        if number%20==0 or number==len(entries):print(f'Uploaded/verified {number}/{len(entries)} files',flush=True)
    tree=retry(lambda:gh(f'{REPOSITORY}/git/trees','POST',{'base_tree':remote_tree['sha'],'tree':changes}))
    message=os.environ.get('COMMIT_MSG','feat: improve desktop writing experience (v1.4.0)')
    commit=gh(f'{REPOSITORY}/git/commits','POST',{'message':message+f'\n\nVerified local source: {local_commit}','tree':tree['sha'],'parents':[parent]})
    if gh(f'{REPOSITORY}/git/ref/heads/{BRANCH}')['object']['sha']!=parent:raise RuntimeError('Remote main changed during upload. Nothing published; review before retrying.')
    gh(f'{REPOSITORY}/git/refs/heads/{BRANCH}','PATCH',{'sha':commit['sha'],'force':False})
    print(f'Published: {commit["sha"]}\nhttps://github.com/black-customer/ielts-writing-coach/commit/{commit["sha"]}',flush=True)

if __name__=='__main__':publish('--dry-run' in sys.argv)
