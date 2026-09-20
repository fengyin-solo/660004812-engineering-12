import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 端口与后端地址可用环境变量覆盖：
//   FRONTEND_PORT  前端开发服务器端口（默认 3000）
//   BACKEND_URL    后端服务地址（默认 http://localhost:8000）
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const frontendPort = Number(env.FRONTEND_PORT ?? 3000)
  const backendUrl = env.BACKEND_URL ?? 'http://localhost:8000'
  return {
    plugins: [vue()],
    resolve: { alias: { '@': resolve(__dirname, 'src') } },
    server: {
      port: frontendPort,
      // 端口被占用时直接退出（strictPort），由统一启动脚本预先选好可用端口并提示
      strictPort: true,
      proxy: { '/api': backendUrl }
    }
  }
})
