# 蛋白质折叠构象采样与Ramachandran图分析平台

基于Vue 3 + FastAPI，支持二面角空间采样、Ramachandran图、LJ势能计算与Three.js 3D骨架渲染。

## 目标用户
计算生物学家、药物设计研究者、结构生物学方向学生

## 技术栈
- 前端: Vue 3 + TypeScript + Vite + Pinia + Element Plus + ECharts + Three.js
- 后端: Python FastAPI + NumPy（Python >= 3.9）
- 运行时: Node.js >= 18（建议 20 LTS）

## 核心功能
1. 蛋白质骨架二面角空间随机采样
2. Ramachandran图Canvas 2D渲染
3. Lennard-Jones势能函数计算
4. Three.js 3D蛋白骨架球棍模型
5. 构象聚类分析
6. JSON/CSV导出

---

## 本地开发（工程化启动流程）

启动顺序、依赖安装、端口冲突都已固化到统一脚本，**不需要记忆任何手工步骤**。

### 首次准备（只做一次）

脚本会在首次启动时自动安装依赖；如需手动安装：

```bash
# 前端（严格按锁文件安装，保证每个人版本一致）
cd frontend && npm ci

# 后端（创建虚拟环境并安装锁定版本）
cd ../backend
python3 -m venv .venv                     # Debian/Ubuntu 若报 ensurepip 缺失：sudo apt install python3-venv
.venv/bin/pip install -r requirements.lock
```

依赖版本锁定文件：

| 端 | 依赖清单（直接依赖，可手改） | 锁定文件（完整传递依赖，勿手改） |
|---|---|---|
| 前端 | `frontend/package.json` | `frontend/package-lock.json` |
| 后端 | `backend/requirements.txt` | `backend/requirements.lock` |

> 不要提交/拷贝 `node_modules` 或 `.venv`（尤其不能跨机器/跨系统拷贝，
> 里面的原生二进制与解释器软链会失效）。预检能识别这类损坏并提示重建。

### 日常启动

在仓库根目录：

```bash
npm run dev            # 或：node scripts/dev.js
```

脚本会依次：

1. **启动前预检**（在动任何服务之前）：
   - Node/Python 运行时版本
   - 前端 `node_modules` 是否存在、是否与 `package-lock.json` 一致、Vite 是否真的能跑
     （可识别"从别的机器拷来的 node_modules"导致的原生可选包缺失）
   - 后端 `.venv` 是否可用、已装包是否与 `requirements.lock` 逐项一致、关键模块能否 import
   - 发现问题会**明确指出缺哪一项 / 哪个包版本不一致，并给出修复命令**；可自动修复的直接安装
2. **检查端口占用**：默认前端 `3000`、后端 `8000`，被占用时自动顺延到下一个可用端口并提示，
   - 想手动指定：`FRONTEND_PORT=4000 BACKEND_PORT=9000 npm run dev`
3. **按序启动**：先起后端并轮询 `GET /api/health`，后端就绪后再起前端
4. 两端都就绪后打印可访问地址（前端 / API / Swagger 文档），`Ctrl+C` 一起停止

### 只看前端界面（不启动后端）

```bash
npm run dev:frontend   # 或：node scripts/dev.js --frontend
```

界面打开即加载**内置示例数据**（`frontend/src/data/sample-result.json`，
由固定随机种子按与后端相同的采样算法离线生成，1000 个构象），
Ramachandran 图、构象表、3D 骨架全部可浏览。连接真实后端后点"🎲 生成构象采样"即请求实时结果；
若后端不可达，界面也会自动降级到示例数据并给出提示，而不是空白或中途报错。

### 只做环境检查（CI 或新人自查）

```bash
npm run check          # 或：node scripts/dev.js --check
```

只预检、不启动、不改环境；全部通过退出码为 0，否则列出每个问题与修复方式。

### 前端构建

```bash
cd frontend && npm run build   # vue-tsc 类型检查 + vite build
```

### 端口与环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `FRONTEND_PORT` | `3000` | 前端 Vite 端口（占用时脚本自动顺延） |
| `BACKEND_PORT` | `8000` | 后端 uvicorn 端口（占用时脚本自动顺延） |
| `FRONTEND_HOST` | `localhost` | 前端监听地址（`0.0.0.0` 可局域网访问） |
| `BACKEND_HOST` | `127.0.0.1` | 后端监听地址 |

### 常见问题速查

| 现象 | 原因与处理 |
|---|---|
| 预检报 `.venv 已损坏或来自其他机器/平台` | `.venv` 被跨机器拷贝。删除后重跑 `npm run dev`，脚本会自动重建 |
| 预检报 `Cannot find module @rollup/rollup-linux-*` | `node_modules` 来自其他平台。`rm -rf frontend/node_modules && cd frontend && npm ci` |
| 预检报某包"需要 x，实际安装 y" | 锁文件更新后本地没同步：前端 `npm ci`，后端 `pip install -r requirements.lock` |
| `ensurepip is not available`（Debian/Ubuntu） | `sudo apt install python3-venv`；脚本也支持自动用 get-pip.py 引导 |
| 端口被占用 | 脚本会自动换端口；也可用 `FRONTEND_PORT` / `BACKEND_PORT` 指定 |
| 页面提示"无法连接后端" | 后端没起，界面已自动切换内置示例数据；需要真实数据请用 `npm run dev` 起完整环境 |
