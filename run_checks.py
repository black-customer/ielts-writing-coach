#!/usr/bin/env python3
# run_checks.py — 内容质量门禁聚合入口：一条命令跑完全部体检
# 用法: python run_checks.py   （任何一项失败即退出码 1）
import subprocess, sys, time

CHECKS = [
    ("逻辑单元测试 (51项)", [sys.executable, "-c", "print('skip: run via node')"]) if False else ("逻辑单元测试 (51项)", ["node", "test-logic.js"]),
    ("范法语料测试 (9项)", ["node", "test-corpus.js"]),
    ("范文构建+验收 (56篇)", ["node", "build-model-essays.js"]),
    ("内容质量门禁 (schema+引用一致性)", ["node", "check-data.js"]),
]

results = []
t0 = time.time()
all_ok = True
for name, cmd in CHECKS:
    t = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    ok = (r.returncode == 0)
    results.append((name, ok, time.time() - t, (r.stdout or "") + (r.stderr or "")))
    if not ok:
        all_ok = False

print("=" * 56)
print("内容质量门禁 · 体检报告")
print("=" * 56)
for name, ok, dur, output in results:
    mark = "✅" if ok else "❌"
    print(f"{mark} {name}  ({dur:.1f}s)")
    if not ok:
        lines = [l for l in output.splitlines() if l.strip()]
        show = lines[-40:] if len(lines) > 40 else lines
        for l in show:
            print("    " + l)
print("-" * 56)
print(f"总耗时 {time.time()-t0:.1f}s · " + ("✅ 全部通过" if all_ok else "❌ 存在失败，禁止发布"))
sys.exit(0 if all_ok else 1)
