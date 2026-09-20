#!/usr/bin/env python3
"""后端依赖体检：启动前对照 backend/requirements-lock.txt 逐项核对。

用法（在仓库根目录）：
    backend/.venv/bin/python scripts/check_env.py

依赖缺失或版本不一致时，逐条列出该补哪一项，并给出修复命令，退出码为 1。
"""
import re
import sys
from importlib import metadata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOCK_FILE = ROOT / "backend" / "requirements-lock.txt"
REQ_FILE = ROOT / "backend" / "requirements.txt"


def normalize(name: str) -> str:
    return re.sub(r"[-_.]+", "-", name).lower()


def parse_requirements(path: Path) -> list[tuple[str, str]]:
    reqs = []
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "==" not in line:
            print(f"⚠️  锁定文件中出现未固定版本的条目：{line}（应为 包名==版本）")
            sys.exit(1)
        name, version = line.split("==", 1)
        reqs.append((name.strip(), version.strip()))
    return reqs


def main() -> int:
    lock = LOCK_FILE if LOCK_FILE.exists() else REQ_FILE
    if not lock.exists():
        print(f"❌ 未找到依赖清单 {REQ_FILE}，仓库可能不完整。")
        return 1
    if lock == REQ_FILE:
        print("⚠️  未找到 requirements-lock.txt，退化为按 requirements.txt 核对（建议执行 scripts/setup.sh 生成锁定文件）。")

    expected = parse_requirements(lock)
    installed = {normalize(d.metadata["Name"]): d.version
                 for d in metadata.distributions() if d.metadata["Name"]}

    missing, mismatched = [], []
    for name, want in expected:
        got = installed.get(normalize(name))
        if got is None:
            missing.append((name, want))
        elif got != want:
            mismatched.append((name, want, got))

    if not missing and not mismatched:
        print(f"✅ 后端依赖核对通过：{len(expected)} 个包与 {lock.name} 完全一致。")
        return 0

    print(f"❌ 后端依赖体检未通过（对照 {lock.relative_to(ROOT)}）：\n")
    for name, want in missing:
        print(f"   缺失       {name}=={want}（未安装）")
    for name, want, got in mismatched:
        print(f"   版本不一致  {name}：期望 {want}，实际 {got}")
    print("\n🔧 修复方法（在仓库根目录执行）：")
    print(f"   backend/.venv/bin/pip install -r backend/{lock.name}")
    print("   如虚拟环境损坏，先重建：rm -rf backend/.venv && scripts/setup.sh")
    return 1


if __name__ == "__main__":
    sys.exit(main())
