import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 后端端口由启动脚本 scripts/dev.sh 通过 BACKEND_PORT 注入（默认 8000），
// 端口被占用自动顺延时代理目标会随之切换，无需手改本文件。
const backendPort = process.env.BACKEND_PORT || '8000'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: { port: 3000, proxy: { '/api': `http://localhost:${backendPort}` } }
})
