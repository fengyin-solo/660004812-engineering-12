#!/usr/bin/env python3
"""后端依赖检查器：对照 requirements.lock 检查虚拟环境中实际安装的包。

由 scripts/dev.js 在启动阶段调用，也可单独运行：
    backend/.venv/bin/python scripts/check_backend_deps.py backend/requirements.lock

输出单行 JSON：
    {"ok": bool, "missing": [...], "mismatch": [...], "import_failed": [...]}
- missing   : 锁文件中要求、但环境里未安装的发行包
- mismatch  : 已安装但版本与锁文件不一致（列出 required / installed）
- import_failed: 声明的顶层模块无法 import（常见于损坏/跨机器拷贝的 venv）
"""
import json
import re
import sys
from pathlib import Path

# 发行包名 -> 需要能够 import 的顶层模块（仅列出本项目直接依赖）
IMPORT_TARGETS = {
    "fastapi": "fastapi",
    "uvicorn": "uvicorn",
    "numpy": "numpy",
}

_REQ_LINE = re.compile(r"^\s*([A-Za-z0-9_.\-]+)\s*==\s*([A-Za-z0-9_.\-+!]+)")


def parse_lock(path: Path):
    pinned = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        m = _REQ_LINE.match(line)
        if m:
            pinned[m.group(1).lower().replace("_", "-")] = m.group(2)
    return pinned


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: check_backend_deps.py <requirements.lock>", file=sys.stderr)
        return 2
    lock_path = Path(sys.argv[1])
    if not lock_path.is_file():
        print(json.dumps({"fatal": f"lock file not found: {lock_path}"}))
        return 2

    result = {"missing": [], "mismatch": [], "import_failed": []}

    try:
        from importlib import metadata
    except ImportError:  # pragma: no cover - py<3.8
        result["fatal"] = "importlib.metadata unavailable; use Python 3.9+"
        print(json.dumps(result))
        return 2

    pinned = parse_lock(lock_path)
    for name, required in sorted(pinned.items()):
        try:
            installed = metadata.version(name)
        except metadata.PackageNotFoundError:
            result["missing"].append({"name": name, "required": required})
            continue
        if installed != required:
            result["mismatch"].append(
                {"name": name, "required": required, "installed": installed}
            )

    # 实际 import 一遍直接依赖：跨机器拷贝/损坏的 venv 里发行包元数据可能在，模块却加载不了
    for dist_name, module in IMPORT_TARGETS.items():
        try:
            __import__(module)
        except Exception as exc:  # noqa: BLE001 - 任何导入失败都要暴露
            result["import_failed"].append(
                {"name": dist_name, "module": module, "error": f"{type(exc).__name__}: {exc}"}
            )

    result["ok"] = not (result["missing"] or result["mismatch"] or result["import_failed"])
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
