#!/usr/bin/env bash
# 首次安装 / 环境修复：按锁定文件安装前后端全部依赖。
# 用法：scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> [1/3] 准备 Python 虚拟环境 backend/.venv"
if [ ! -x backend/.venv/bin/python ]; then
  rm -rf backend/.venv
  if python3 -c "import ensurepip" 2>/dev/null; then
    python3 -m venv backend/.venv
  else
    # 部分 Debian/Ubuntu 未装 python3-venv（无 ensurepip），改用 get-pip 引导
    echo "    当前 Python 无 ensurepip，使用 --without-pip + get-pip 方式建环境"
    python3 -m venv --without-pip backend/.venv
    curl -sSL https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py
    backend/.venv/bin/python /tmp/get-pip.py --quiet
  fi
else
  echo "    已存在，跳过创建"
fi

echo "==> [2/3] 安装后端依赖（backend/requirements-lock.txt）"
LOCK=backend/requirements-lock.txt
[ -f "$LOCK" ] || LOCK=backend/requirements.txt
backend/.venv/bin/pip install --quiet -r "$LOCK"

echo "==> [3/3] 安装前端依赖（frontend/package-lock.json，npm ci）"
cd frontend
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
else
  echo "    ⚠️  未找到 package-lock.json，退化为 npm install（建议提交锁定文件）"
  npm install --no-audit --no-fund
fi
cd ..

echo
backend/.venv/bin/python scripts/check_env.py
echo
echo "✅ 安装完成。启动开发环境：scripts/dev.sh"
