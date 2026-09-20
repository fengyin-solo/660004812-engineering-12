#!/usr/bin/env python3
"""重新生成前端内置示例数据 frontend/src/data/sample-data.ts。

采样算法与 backend/app/main.py 完全一致，使用固定随机种子，保证数据可复现。
用法：backend/.venv/bin/python scripts/gen_sample_data.py
"""
import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "frontend" / "src" / "data" / "sample-data.ts"

SEED = 42
RESIDUES = 10
CONFORMATIONS = 500

REGIONS = [
    ("alpha-helix", (-100, -30), (-80, -10)),
    ("beta-sheet", (-180, -45), (60, 180)),
    ("left-helix", (20, 100), (-40, 80)),
    ("beta-sheet-2", (-180, -45), (-180, -60)),
]


def classify(phi: float, psi: float) -> str:
    for name, (p0, p1), (s0, s1) in REGIONS:
        if p0 <= phi <= p1 and s0 <= psi <= s1:
            return "beta-sheet" if name == "beta-sheet-2" else name
    return "disallowed"


def lj_energy(phi: float, psi: float, sigma: float = 3.4, epsilon: float = 0.5) -> float:
    r = math.sqrt(phi * phi + psi * psi) / 180.0 * 3.0 + 2.0
    r = max(r, 1.0)
    ratio = sigma / r
    return 4 * epsilon * (ratio ** 12 - ratio ** 6) + epsilon


def main() -> None:
    random.seed(SEED)
    confs = []
    for i in range(CONFORMATIONS):
        phi, psi = random.uniform(-180, 180), random.uniform(-180, 180)
        energy = lj_energy(phi, psi) + random.gauss(0, 0.05)
        confs.append({
            "id": i + 1, "phi": round(phi, 2), "psi": round(psi, 2),
            "energy": round(energy, 3), "region": classify(phi, psi),
        })

    energies = [c["energy"] for c in confs]
    e_min, e_max = min(energies), max(energies)
    for c in confs:
        t = (c["energy"] - e_min) / (e_max - e_min or 1)
        c["cluster"] = "low-energy" if t < 0.33 else ("mid-energy" if t < 0.67 else "high-energy")

    regions = [c["region"] for c in confs]
    result = {
        "params": {"residues": RESIDUES, "conformations": CONFORMATIONS},
        "conformations": confs,
        "energyRange": [e_min, e_max],
        "stats": {
            "alpha": regions.count("alpha-helix"),
            "beta": regions.count("beta-sheet"),
            "left": regions.count("left-helix"),
            "disallowed": regions.count("disallowed"),
        },
    }

    OUT.write_text(
        "// 内置示例数据：由 scripts/gen_sample_data.py 离线生成（与后端同一套采样算法，固定随机种子 42）。\n"
        "// 用途：后端未启动时，前端可加载本数据展示完整界面效果。请勿手改，重新生成请运行该脚本。\n"
        "import type { SamplingResult } from '@/types'\n\n"
        f"export const sampleResult: SamplingResult = {json.dumps(result, ensure_ascii=False, separators=(',', ':'))}\n"
    )
    print(f"✅ 已生成 {OUT.relative_to(ROOT)}（{CONFORMATIONS} 条构象，种子 {SEED}）")


if __name__ == "__main__":
    main()
