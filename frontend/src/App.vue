<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🧬 蛋白质折叠构象采样与分析平台</h1>
      <p class="subtitle">Ramachandran图 · LJ势能计算 · 3D骨架可视化</p>
    </header>
    <main class="app-main">
      <el-alert
        v-if="store.errorMessage"
        :title="store.errorMessage"
        type="warning"
        show-icon
        :closable="true"
        @close="store.dismissError()"
        style="margin-bottom:16px"
      />
      <el-alert
        v-if="store.result && store.demo && !store.errorMessage"
        title="演示模式：当前展示内置示例数据（1000 个构象），后端未连接。可正常浏览图表、表格与 3D 骨架。"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom:16px"
      />
      <ControlPanel @sample="handleSample" />
      <div class="main-grid" v-if="store.result">
        <div class="plot-area"><RamachandranPlot /></div>
        <div class="viewer-area"><ProteinViewer3D /></div>
      </div>
      <ConformationTable v-if="store.result" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ControlPanel from "./components/ControlPanel.vue"
import RamachandranPlot from "./components/RamachandranPlot.vue"
import ProteinViewer3D from "./components/ProteinViewer3D.vue"
import ConformationTable from "./components/ConformationTable.vue"
import { useProteinStore } from "./store/protein"
import type { ProteinParams } from "./types"

const store = useProteinStore()
function handleSample(params: ProteinParams) { store.runSampling(params) }

// 打开页面即可看到完整界面（内置示例数据），无需先启动后端
onMounted(() => {
  if (!store.result) store.loadSampleData()
})
</script>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#f0f2f5}
.app-container{min-height:100vh}
.app-header{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:24px 40px}
.app-header h1{font-size:1.8rem}
.subtitle{opacity:.85;margin-top:4px;font-size:.9rem}
.app-main{padding:20px 40px}
.main-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
</style>
