import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Conformation, SamplingResult, ProteinParams } from '@/types'
import { sampleData } from '@/data/sample'

export const useProteinStore = defineStore('protein', () => {
  const loading = ref(false)
  const result = ref<SamplingResult | null>(null)
  const selectedConformation = ref<Conformation | null>(null)
  const selectedCluster = ref('all')
  // demo = 当前展示的是内置示例数据（后端未启动或请求失败）
  const demo = ref(false)
  const errorMessage = ref('')

  function applyResult(data: SamplingResult, isDemo: boolean) {
    result.value = data
    selectedConformation.value = null
    selectedCluster.value = 'all'
    demo.value = isDemo
  }

  /** 直接加载内置示例数据，无需后端 */
  function loadSampleData() {
    errorMessage.value = ''
    applyResult(sampleData, true)
  }

  async function runSampling(params: ProteinParams) {
    loading.value = true
    errorMessage.value = ''
    try {
      const { data } = await axios.post<SamplingResult>('/api/sample', params, { timeout: 5000 })
      applyResult(data, false)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        errorMessage.value = `后端请求失败：${err.response.status} ${err.response.statusText}`
      } else {
        // 后端没起 / 网络不通 / 超时：降级到内置示例数据，界面仍可完整查看
        errorMessage.value = '无法连接后端（http://localhost:8000），已为你载入内置示例数据。启动后端后可获得真实采样结果。'
        applyResult(sampleData, true)
      }
    } finally {
      loading.value = false
    }
  }

  function dismissError() { errorMessage.value = '' }
  function selectConformation(conf: Conformation) { selectedConformation.value = conf }
  function filterByCluster(cluster: string) { selectedCluster.value = cluster }

  return { loading, result, selectedConformation, selectedCluster, demo, errorMessage,
           runSampling, loadSampleData, dismissError, selectConformation, filterByCluster }
})
