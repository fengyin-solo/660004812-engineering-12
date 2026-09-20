#!/usr/bin/env bash
# 本地开发一键启动：依赖体检 → 端口检查 → 启动前后端 → 就绪后打印访问地址。
#
# 用法：scripts/dev.sh
#
# 端口规则：后端默认 8000、前端默认 3000；被占用时自动顺延到下一个可用端口
# （最多向后探测 20 个），前端代理会跟随实际后端端口，无需手改配置。
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$PWD
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

fail() {  # fail <问题> <修复命令>
  echo
  echo "❌ $1"
  echo "🔧 修复：$2"
  exit 1
}

echo "==> [1/4] 检查运行环境"
command -v node    >/dev/null || fail "未找到 node，请先安装 Node.js >= 18" "https://nodejs.org/"
command -v npm     >/dev/null || fail "未找到 npm，请先安装 Node.js >= 18" "https://nodejs.org/"
command -v python3 >/dev/null || fail "未找到 python3，请先安装 Python >= 3.10" "https://www.python.org/"
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 18 ] || fail "Node.js 版本过低（当前 $(node -v)，要求 >= 18）" "升级 Node.js 后重试"
[ -x backend/.venv/bin/python ] || fail "后端虚拟环境不存在或未建完（backend/.venv）" "scripts/setup.sh"

echo "==> [2/4] 核对依赖与锁定版本"
backend/.venv/bin/python scripts/check_env.py || exit 1

cd frontend
[ -d node_modules ] || fail "前端依赖未安装（frontend/node_modules 不存在）" "cd frontend && npm ci"
npm ls --depth=0 >/dev/null 2>&1 || fail "前端依赖与 package.json 锁定版本不一致" "cd frontend && npm ci"
node -e "require('rollup')" 2>/dev/null || fail "前端依赖损坏（node_modules 可能是在其他系统/架构上安装的）" "cd frontend && rm -rf node_modules && npm ci"
cd "$ROOT"
echo "✅ 前端依赖核对通过（package-lock.json）"

echo "==> [3/4] 检查端口占用"
find_free_port() {  # 从 $1 开始向后找第一个空闲端口，最多探测 20 个
  python3 - "$1" <<'PY'
import socket, sys
base = int(sys.argv[1])
for_port = None
for p in range(base, base + 20):
    s = socket.socket()
    try:
        s.bind(("127.0.0.1", p))
        for_port = p
        break
    except OSError:
        continue
    finally:
        s.close()
if for_port is None:
    sys.exit(f"没有可用端口（{base}~{base + 19} 均被占用）")
print(for_port)
PY
}
BACKEND_PORT=$(find_free_port 8000) || fail "后端无可用端口（8000~8019 均被占用）" "释放端口后重试"
FRONTEND_PORT=$(find_free_port 3000) || fail "前端无可用端口（3000~3019 均被占用）" "释放端口后重试"
[ "$BACKEND_PORT" = "8000" ] || echo "⚠️  端口 8000 被占用，后端改用 $BACKEND_PORT"
[ "$FRONTEND_PORT" = "3000" ] || echo "⚠️  端口 3000 被占用，前端改用 $FRONTEND_PORT"

echo "==> [4/4] 启动服务"
BACKEND_PORT=$BACKEND_PORT  # 供 frontend/vite.config.ts 的代理目标使用
export BACKEND_PORT
backend/.venv/bin/python -m uvicorn app.main:app --app-dir backend --port "$BACKEND_PORT" \
  > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
frontend/node_modules/.bin/vite --port "$FRONTEND_PORT" --strictPort \
  > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

cleanup() {
  echo
  echo "==> 正在停止服务…"
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait_for_url() {  # wait_for_url <url> <服务名>
  for _ in $(seq 60); do
    if python3 -c "import urllib.request,sys;sys.exit(0 if urllib.request.urlopen('$1',timeout=2).status==200 else 1)" 2>/dev/null; then
      return 0
    fi
    kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null || break
    sleep 1
  done
  echo "❌ $2 启动超时或已退出，最近日志："
  tail -n 15 "$LOG_DIR/backend.log" "$LOG_DIR/frontend.log" 2>/dev/null
  exit 1
}

wait_for_url "http://localhost:$BACKEND_PORT/api/health" "后端"
wait_for_url "http://localhost:$FRONTEND_PORT/" "前端"

echo
echo "=================================================="
echo " ✅ 前后端均已就绪"
echo "   前端界面:  http://localhost:$FRONTEND_PORT"
echo "   后端 API:  http://localhost:$BACKEND_PORT/api/health"
echo "   接口文档:  http://localhost:$BACKEND_PORT/docs"
echo "   日志:      logs/backend.log / logs/frontend.log"
echo "   按 Ctrl+C 停止全部服务"
echo "=================================================="

wait
