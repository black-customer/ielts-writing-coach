#!/usr/bin/env python3
# push-via-api.py — github.com:443 被阻断时，改走 api.github.com 的 Git Data API 推送
# 用 gh CLI 鉴权；为暂存区每个文件建 blob → 一棵 tree → 一个 commit → 创建/更新 main
import subprocess, json, base64, os, sys, time

OWNER, REPO, BRANCH = "black-customer", "ielts-writing-coach", "main"
COMMIT_MSG = os.environ.get("COMMIT_MSG", "IELTS Writing Coach — 离线雅思写作训练工具")

_tmp_n = [0]
def gh(endpoint, method="GET", payload=None):
    cmd = ["gh", "api", "--method", method, endpoint]
    tmp = None
    if payload is not None:
        _tmp_n[0] += 1
        tmp = os.path.join(os.environ.get("TEMP", "."), f"_ghapi_{os.getpid()}_{_tmp_n[0]}.json")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        cmd += ["--input", tmp]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if tmp and os.path.exists(tmp): os.remove(tmp)
    if r.returncode != 0:
        raise RuntimeError(f"gh api {method} {endpoint}: {r.stderr[:400]}")
    return json.loads(r.stdout) if r.stdout.strip() else {}

def retry(fn, tries=4, wait=8):
    last = None
    for i in range(tries):
        try:
            return fn()
        except Exception as e:
            last = e
            if "422" in str(e) or "409" in str(e): break
            print(f"    retry {i+1}: {str(e)[:120]}")
            time.sleep(wait)
    raise last

files = [f for f in subprocess.run(["git", "-c", "core.quotepath=false", "ls-files"], capture_output=True, text=True, encoding="utf-8").stdout.split("\n") if f.strip()]
print(f"staged files: {len(files)}")

# blob 缓存（断点续传）
CACHE = "models/.blob-cache.json"
cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}

# 0) 空仓库引导：用 Contents API 先放一个文件，让仓库有首个 commit（否则 Git Data API 报 409）
parent = None
try:
    ref = gh(f"repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}")
    parent = ref["object"]["sha"]
    print("existing main at", parent[:10])
except Exception:
    print("empty repo — bootstrapping with .gitignore via Contents API ...")
    with open(".gitignore", "rb") as f:
        c = base64.b64encode(f.read()).decode("ascii")
    boot = retry(lambda: gh(f"repos/{OWNER}/{REPO}/contents/.gitignore", "PUT",
                            {"message": "bootstrap: add .gitignore", "content": c}))
    parent = boot["commit"]["sha"]
    print("bootstrapped at", parent[:10])

# 1) blobs
tree_entries = []
for i, path in enumerate(files, 1):
    p = path.replace(os.sep, "/")
    if p in cache:
        tree_entries.append({"path": p, "mode": "100644", "type": "blob", "sha": cache[p]})
        continue
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    def make(p=path, b=b64):
        return gh(f"repos/{OWNER}/{REPO}/git/blobs", "POST", {"content": b, "encoding": "base64"})
    blob = retry(make)
    cache[p] = blob["sha"]
    json.dump(cache, open(CACHE, "w", encoding="utf-8"))
    tree_entries.append({"path": p, "mode": "100644", "type": "blob", "sha": blob["sha"]})
    if i % 25 == 0: print(f"  blobs {i}/{len(files)}")

# 2) tree
tree = retry(lambda: gh(f"repos/{OWNER}/{REPO}/git/trees", "POST", {"tree": tree_entries}))
print("tree:", tree["sha"][:10])

# 3) commit（带父提交，保证历史线性）
payload = {"message": COMMIT_MSG, "tree": tree["sha"]}
if parent: payload["parents"] = [parent]
commit = retry(lambda: gh(f"repos/{OWNER}/{REPO}/git/commits", "POST", payload))
print("commit:", commit["sha"][:10])

# 4) ref：main 已存在则更新，否则创建
try:
    retry(lambda: gh(f"repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}"))
    retry(lambda: gh(f"repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}", "PATCH", {"sha": commit["sha"], "force": False}))
    print("ref updated")
except Exception:
    retry(lambda: gh(f"repos/{OWNER}/{REPO}/git/refs", "POST", {"ref": f"refs/heads/{BRANCH}", "sha": commit["sha"]}))
    print("ref created")

print("DONE — pushed via API")
