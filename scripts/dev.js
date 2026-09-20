#!/usr/bin/env node
/**
 * 蛋白质折叠分析平台 —— 统一本地开发启动脚本
 *
 * 作用：把"准备与启动"从口口相传变成确定性流程
 *   1. 预检运行环境（node/python 版本、前端依赖与锁文件、后端 venv 与锁定依赖）
 *      缺什么、版本哪一项不一致，在启动前明确报出并给出修复命令；可自动修复的直接修复
 *   2. 启动前检查端口占用，被占用则顺延到下一个可用端口，并说明如何手动指定
 *   3. 先启动后端并轮询健康检查，就绪后再启动前端
 *   4. 两端都就绪后打印可访问地址；Ctrl+C 一起退出
 *
 * 用法：
 *   node scripts/dev.js            # 启动前后端（默认）
 *   node scripts/dev.js --check    # 只做环境预检，不启动服务
 *   node scripts/dev.js --frontend # 只启动前端（内置示例数据，无需后端）
 *
 * 可配置环境变量：
 *   FRONTEND_PORT（默认 3000）、BACKEND_PORT（默认 8000）、
 *   FRONTEND_HOST（默认 localhost）、BACKEND_HOST（默认 127.0.0.1）
 */
'use strict'

const { spawn, spawnSync } = require('child_process')
const net = require('net')
const fs = require('fs')
const path = require('path')
const http = require('http')

const ROOT = path.resolve(__dirname, '..')
const FRONTEND_DIR = path.join(ROOT, 'frontend')
const BACKEND_DIR = path.join(ROOT, 'backend')
const VENV_PY = path.join(BACKEND_DIR, process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python')
const BACKEND_LOCK = path.join(BACKEND_DIR, 'requirements.lock')

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const FRONTEND_ONLY = args.includes('--frontend')

const FRONTEND_HOST = process.env.FRONTEND_HOST || 'localhost'
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1'
let frontendPort = Number(process.env.FRONTEND_PORT || 3000)
let backendPort = Number(process.env.BACKEND_PORT || 8000)

// ---------- 终端输出 ----------
const useColor = process.stdout.isTTY
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : String(s))
const red = s => c('31', s)
const green = s => c('32', s)
const yellow = s => c('33', s)
const cyan = s => c('36', s)
const bold = s => c('1', s)
const log = (tag, msg) => console.log(`${cyan(`[${tag}]`)} ${msg}`)
const warn = msg => console.log(`${yellow('⚠ 警告:')} ${msg}`)
const err = msg => console.error(`${red('✗ 错误:')} ${msg}`)

// ---------- 工具函数 ----------
function run(cmd, cmdArgs, opts = {}) {
  const res = spawnSync(cmd, cmdArgs, { encoding: 'utf8', cwd: opts.cwd || ROOT, env: process.env, ...opts })
  return { status: res.status, stdout: res.stdout || '', stderr: res.stderr || '', error: res.error }
}

function runLive(cmd, cmdArgs, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { cwd: opts.cwd || ROOT, env: process.env, stdio: 'inherit', shell: opts.shell || false })
    child.on('error', reject)
    child.on('exit', code => resolve(code ?? 0))
  })
}

function portFreeOn(port, bindAddr) {
  return new Promise(resolve => {
    const server = net.createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => server.close(() => resolve(true)))
    server.listen(port, bindAddr)
  })
}

// localhost 在部分机器只解析为 IPv6 ::1，所以同时探 127.0.0.1 和 ::1；任一被占用就算占用
async function isPortFree(port, host) {
  if (host === '0.0.0.0' || host === '::') return portFreeOn(port, host)
  const [v4, v6] = await Promise.all([portFreeOn(port, '127.0.0.1'), portFreeOn(port, '::1').catch(() => true)])
  return v4 && v6
}

async function findFreePort(preferred, host, label) {
  if (await isPortFree(preferred, host)) return preferred
  warn(`${label}端口 ${preferred} 已被占用，正在自动寻找可用端口……`)
  for (let p = preferred + 1; p <= preferred + 20; p++) {
    if (await isPortFree(p, host)) {
      log('端口', `改用端口 ${bold(p)}（如想手动指定：设置环境变量 ${label === '前端' ? 'FRONTEND_PORT' : 'BACKEND_PORT'}=端口号）`)
      return p
    }
  }
  err(`${preferred}~${preferred + 20} 全部被占用，请释放端口或用环境变量指定其他端口`)
  process.exit(1)
}

function httpGet(url, timeoutMs = 1500) {
  return new Promise(resolve => {
    const req = http.get(url, res => { res.resume(); resolve(res.statusCode === 200) })
    req.on('error', () => resolve(false))
    req.setTimeout(timeoutMs, () => { req.destroy(); resolve(false) })
  })
}

const problems = [] // { item, detail, fix, auto?: fn }

// ---------- 预检 1：运行时版本 ----------
function checkNode() {
  const major = Number(process.versions.node.split('.')[0])
  if (major < 18) {
    problems.push({
      item: 'Node.js 版本',
      detail: `当前 ${process.versions.node}，本项目需要 Node.js >= 18（建议 20 LTS）`,
      fix: '从 https://nodejs.org 安装 Node.js 20 LTS，或用 nvm 切换：nvm install 20 && nvm use 20',
    })
  }
}

function findPython() {
  const candidates = process.platform === 'win32' ? ['python', 'py -3'] : ['python3', 'python']
  for (const cmd of candidates) {
    const [bin, ...extra] = cmd.split(' ')
    const r = run(bin, [...extra, '--version'])
    if (r.status === 0 && /Python 3\./.test(r.stdout + r.stderr)) {
      const ver = (r.stdout + r.stderr).match(/Python (3\.\d+)/)
      return { bin, extra, version: ver ? ver[1] : '3.x' }
    }
  }
  return null
}

// ---------- 预检 2：前端依赖 ----------
function checkFrontend() {
  if (!fs.existsSync(path.join(FRONTEND_DIR, 'package-lock.json'))) {
    problems.push({
      item: '前端锁文件 package-lock.json',
      detail: '前端缺少 package-lock.json（依赖版本未锁定，或这是旧克隆）',
      fix: '在 frontend/ 目录执行：npm install',
    })
    return
  }
  if (!fs.existsSync(path.join(FRONTEND_DIR, 'node_modules'))) {
    problems.push({
      item: '前端依赖 node_modules',
      detail: '前端依赖尚未安装',
      fix: '在 frontend/ 目录执行：npm ci（严格按 package-lock.json 安装锁定版本）',
      auto: async () => {
        log('前端', 'node_modules 缺失，执行 npm ci 自动安装 …')
        const r = await runLive('npm', ['ci'], { cwd: FRONTEND_DIR })
        return r === 0
      },
    })
    return
  }
  // npm ls：node_modules 与 package-lock.json / package.json 不一致时退出码非 0
  const ls = run('npm', ['ls', '--depth=0', '--json'], { cwd: FRONTEND_DIR })
  if (ls.status !== 0) {
    let report = ''
    try {
      const tree = JSON.parse(ls.stdout)
      const bad = []
      for (const [name, info] of Object.entries(tree.dependencies || {})) {
        if (info.problems && info.problems.length) bad.push(`${name}: ${info.problems.join('; ')}`)
        if (info.missing) bad.push(`${name}: 未安装`)
      }
      report = bad.slice(0, 8).join('\n  ')
    } catch { /* npm 有时把错误写进文本输出，忽略解析失败 */ }
    problems.push({
      item: '前端依赖版本一致性',
      detail: `已安装依赖与 package-lock.json 不一致：\n  ${report || ls.stderr.split('\n').slice(0, 6).join('\n  ')}`,
      fix: '在 frontend/ 目录执行：npm ci（按锁文件重装，保证版本一致）',
      auto: reinstallFrontend,
    })
    return
  }
  // npm ls 查不出"跨平台/损坏的 node_modules"（如 rollup 的平台原生可选包缺失），
  // 实际加载一次工具链，确保不是从别的机器拷贝来的 node_modules
  const smoke = run(process.execPath, ['node_modules/vite/bin/vite.js', '--version'], { cwd: FRONTEND_DIR })
  if (smoke.status !== 0) {
    problems.push({
      item: '前端工具链可运行性',
      detail: '依赖元数据看似完整，但 Vite 无法启动，通常是 node_modules 来自其他平台/架构：\n  ' +
        (smoke.stderr || smoke.stdout).split('\n').slice(0, 6).join('\n  '),
      fix: '在 frontend/ 目录执行：rm -rf node_modules && npm ci',
      auto: reinstallFrontend,
    })
  }
}

async function reinstallFrontend() {
  log('前端', '按 package-lock.json 执行 npm ci 重装依赖 …')
  fs.rmSync(path.join(FRONTEND_DIR, 'node_modules'), { recursive: true, force: true })
  const r = await runLive('npm', ['ci'], { cwd: FRONTEND_DIR })
  return r === 0
}

// ---------- 预检 3：后端 venv + 锁定依赖 ----------
async function checkBackend(python) {
  const venvPythonOk = fs.existsSync(VENV_PY) && run(VENV_PY, ['--version']).status === 0
  if (!venvPythonOk) {
    if (!python) {
      problems.push({
        item: 'Python 3',
        detail: '未找到可用的 python3（后端需要 Python >= 3.9）',
        fix: '安装 Python 3.9+（Debian/Ubuntu 还需 python3-venv 包）；如只想看前端界面：node scripts/dev.js --frontend',
      })
      return
    }
    problems.push({
      item: '后端虚拟环境 .venv',
      detail: fs.existsSync(path.join(BACKEND_DIR, '.venv'))
        ? '.venv 已损坏或来自其他机器/平台（解释器无法运行）——这正是拷贝 venv 目录的典型问题'
        : 'backend/.venv 尚未创建',
      fix: '删除后重建（脚本可自动完成）：python3 -m venv .venv && .venv/bin/pip install -r requirements.lock',
      auto: async () => {
        log('后端', `重建虚拟环境（Python ${python.version}）…`)
        fs.rmSync(path.join(BACKEND_DIR, '.venv'), { recursive: true, force: true })
        let r = run(python.bin, [...python.extra, '-m', 'venv', '.venv'], { cwd: BACKEND_DIR })
        if (r.status !== 0) {
          // Debian/Ubuntu 精简版 Python 不带 ensurepip：先建无 pip 的 venv，再用 get-pip.py 引导
          log('后端', 'venv 自带 pip 不可用（缺少 ensurepip），改用 --without-pip + get-pip.py 引导 …')
          r = run(python.bin, [...python.extra, '-m', 'venv', '--without-pip', '.venv'], { cwd: BACKEND_DIR })
          if (r.status !== 0) { err(r.stderr); return false }
          const getPip = path.join(require('os').tmpdir(), 'get-pip.py')
          const dl = run('curl', ['-sS', 'https://bootstrap.pypa.io/get-pip.py', '-o', getPip])
          if (dl.status !== 0) { err('下载 get-pip.py 失败，请检查网络或安装 python3-venv 包'); return false }
          r = run(VENV_PY, [getPip, '--quiet'], { cwd: BACKEND_DIR })
          if (r.status !== 0) { err(r.stderr); return false }
        }
        log('后端', '安装锁定依赖 requirements.lock …')
        const pip = await new Promise(res => {
          const ch = spawn(VENV_PY, ['-m', 'pip', 'install', '-r', BACKEND_LOCK], { cwd: BACKEND_DIR, stdio: 'inherit' })
          ch.on('exit', code => res(code === 0))
        })
        return pip
      },
    })
    return
  }

  const checker = path.join(ROOT, 'scripts', 'check_backend_deps.py')
  const r = run(VENV_PY, [checker, BACKEND_LOCK], { cwd: BACKEND_DIR })
  let report = null
  try { report = JSON.parse(r.stdout.trim().split('\n').pop()) } catch { /* ignore */ }
  if (!report || report.fatal || !report.ok) {
    const lines = []
    if (report) {
      for (const m of report.missing || []) lines.push(`${m.name}==${m.required} 未安装`)
      for (const m of report.mismatch || []) lines.push(`${m.name} 需要 ${m.required}，实际安装 ${m.installed}`)
      for (const m of report.import_failed || []) lines.push(`${m.module} 无法导入：${m.error}`)
    }
    problems.push({
      item: '后端依赖版本一致性',
      detail: lines.join('\n  ') || r.stderr || '依赖检查失败',
      fix: '执行：backend/.venv/bin/pip install -r backend/requirements.lock',
      auto: async () => {
        log('后端', '按 requirements.lock 同步依赖 …')
        return await new Promise(res => {
          const ch = spawn(VENV_PY, ['-m', 'pip', 'install', '-r', BACKEND_LOCK], { cwd: BACKEND_DIR, stdio: 'inherit' })
          ch.on('exit', code => res(code === 0))
        })
      },
    })
  }
}

// ---------- 主流程 ----------
async function preflight({ includeBackend }) {
  console.log(bold('\n== 环境预检 =='))
  checkNode()
  const python = findPython()
  if (python) log('Python', `检测到 ${python.version}`)
  log('Node.js', process.version)
  checkFrontend()
  if (includeBackend) await checkBackend(python)
  else if (!python) {
    warn('未检测到 Python 3；--frontend 模式不需要后端，继续（将使用内置示例数据）')
  }

  if (!problems.length) {
    console.log(green('✓ 环境检查全部通过\n'))
    return true
  }

  console.log('')
  console.log(bold(red(`发现 ${problems.length} 个需要处理的问题：`)))
  for (const p of problems) {
    console.log(`\n${bold('• ' + p.item)}`)
    console.log(`  ${p.detail.split('\n').join('\n  ')}`)
    console.log(`  ${yellow('修复方式：')}${p.fix}`)
  }

  if (CHECK_ONLY) {
    console.log(red('\n预检未通过（--check 模式不做自动修复）。按上面的"修复方式"处理后重跑。'))
    process.exit(1)
  }

  const autoFixable = problems.filter(p => p.auto)
  if (!autoFixable.length) {
    console.log(red('\n以上问题无法自动修复，请按"修复方式"手动处理后重新启动。'))
    process.exit(1)
  }

  console.log(bold(`\n将自动修复 ${autoFixable.length} 项（安装/同步依赖）…`))
  for (const p of autoFixable) {
    const ok = await p.auto()
    if (!ok) {
      err(`${p.item} 自动修复失败，请按上面的"修复方式"手动处理`)
      process.exit(1)
    }
  }
  console.log(green('✓ 自动修复完成\n'))
  return true
}

function prefixOutput(child, tag, colorFn) {
  const fmt = buf => buf.toString().split('\n').filter(Boolean).map(l => `${colorFn(`[${tag}]`)} ${l}`).join('\n')
  child.stdout.on('data', d => { const s = fmt(d); if (s) console.log(s) })
  child.stderr.on('data', d => { const s = fmt(d); if (s) console.error(s) })
}

function killTree(child) {
  if (!child || child.exitCode !== null) return
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    try { process.kill(-child.pid, 'SIGTERM') } catch { try { child.kill('SIGTERM') } catch { /* noop */ } }
  }
}

async function waitForBackend(port, host, child) {
  // 0.0.0.0 表示监听所有网卡，探活用回环地址；IPv6 监听地址加括号
  const probeHost = host === '0.0.0.0' ? '127.0.0.1' : host === '::' ? '[::1]' : host
  const url = `http://${probeHost}:${port}/api/health`
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) return false
    if (await httpGet(url)) return true
    await new Promise(r => setTimeout(r, 1000))
  }
  return false
}

// 就绪探测地址要与服务实际监听地址一致。localhost 在不同机器可能解析为 127.0.0.1 或 ::1
// （Node 默认优先 IPv4，而 Vite 在部分机器只绑定 IPv6），因此 localhost 时两个地址都探
async function waitForFrontend(port, host, child) {
  const hosts = host === 'localhost' || host === '127.0.0.1' || host === '::1'
    ? ['127.0.0.1', '[::1]']
    : [host]
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) return false
    for (const h of hosts) {
      if (await httpGet(`http://${h}:${port}/`, 2000)) return true
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  return false
}

async function main() {
  await preflight({ includeBackend: !FRONTEND_ONLY })
  if (CHECK_ONLY) { console.log(green('✓ 预检通过')); return }

  console.log(bold('== 启动开发服务 =='))
  frontendPort = await findFreePort(frontendPort, FRONTEND_HOST, '前端')
  if (!FRONTEND_ONLY) backendPort = await findFreePort(backendPort, BACKEND_HOST, '后端')

  const children = []
  let backendChild = null
  let frontendChild = null
  let shuttingDown = false

  const shutdown = () => {
    if (shuttingDown) return
    shuttingDown = true
    console.log(yellow('\n正在停止所有服务 …'))
    children.forEach(killTree)
    setTimeout(() => process.exit(0), 800)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  // 1) 先启动后端
  if (!FRONTEND_ONLY) {
    log('后端', `uvicorn app.main:app  (${BACKEND_HOST}:${backendPort})`)
    backendChild = spawn(VENV_PY, ['-m', 'uvicorn', 'app.main:app', '--host', BACKEND_HOST, '--port', String(backendPort)], {
      cwd: BACKEND_DIR,
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      detached: process.platform !== 'win32',
    })
    children.push(backendChild)
    prefixOutput(backendChild, '后端', s => cyan(s))
    backendChild.on('exit', code => {
      if (!shuttingDown && (frontendChild === null || frontendChild.exitCode !== null)) {
        err(`后端进程意外退出（code=${code}）`)
        shutdown()
      }
    })

    log('后端', '等待健康检查 /api/health 通过 …')
    const ready = await waitForBackend(backendPort, BACKEND_HOST, backendChild)
    if (!ready) {
      err('后端在 60 秒内未就绪，请查看上方 [后端] 日志（常见原因：端口冲突、依赖缺失）')
      shutdown()
      return
    }
    const beAddr = `http://${BACKEND_HOST === '0.0.0.0' ? '127.0.0.1' : BACKEND_HOST}:${backendPort}`
    console.log(green(`✓ 后端已就绪: ${beAddr}  (接口文档 ${beAddr}/docs)`))
  }

  // 2) 再启动前端（把实际后端地址传给 Vite）
  const beProxyHost = BACKEND_HOST === '0.0.0.0' ? '127.0.0.1' : BACKEND_HOST
  const backendUrl = `http://${beProxyHost}:${backendPort}`
  log('前端', `vite (${FRONTEND_HOST}:${frontendPort})，/api 代理 -> ${FRONTEND_ONLY ? '未启动（将使用内置示例数据）' : backendUrl}`)
  frontendChild = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'dev', '--', '--host', FRONTEND_HOST, '--port', String(frontendPort)],
    {
      cwd: FRONTEND_DIR,
      env: { ...process.env, FRONTEND_PORT: String(frontendPort), BACKEND_URL: backendUrl },
      detached: process.platform !== 'win32',
    }
  )
  children.push(frontendChild)
  prefixOutput(frontendChild, '前端', s => green(s))
  frontendChild.on('exit', code => {
    if (!shuttingDown && code !== 0 && code !== null) {
      err(`前端进程意外退出（code=${code}）`)
      shutdown()
    }
  })

  // Vite 通常 1~3 秒就绪；做一次 HTTP 探活（探测地址须与监听主机一致）
  const feReady = await waitForFrontend(frontendPort, FRONTEND_HOST, frontendChild)
  if (!feReady) {
    err('前端在 60 秒内未就绪，请查看上方 [前端] 日志')
    shutdown()
    return
  }

  const feAddr = `http://${FRONTEND_HOST === '0.0.0.0' ? 'localhost' : FRONTEND_HOST}:${frontendPort}`
  console.log('')
  console.log(bold(green('════════════════════════════════════════════════')))
  console.log(bold(green('  ✓ 全部就绪，访问地址：')))
  console.log(`  ${bold('前端界面')}  ${cyan(feAddr)}`)
  if (FRONTEND_ONLY) {
    console.log(`  ${bold('后端')}      ${yellow('未启动 —— 界面以内置示例数据演示（1000 个构象）')}`)
  } else {
    const beShow = `http://${BACKEND_HOST === '0.0.0.0' ? '127.0.0.1' : BACKEND_HOST}:${backendPort}`
    console.log(`  ${bold('后端 API')}  ${cyan(beShow)}`)
    console.log(`  ${bold('接口文档')}   ${cyan(`${beShow}/docs`)}`)
  }
  console.log(bold(green('════════════════════════════════════════════════')))
  console.log(yellow('按 Ctrl+C 停止所有服务'))
}

main().catch(e => { err(e.stack || String(e)); process.exit(1) })
