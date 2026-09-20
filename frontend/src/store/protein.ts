import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Conformation, SamplingResult, ProteinParams } from '@/types'
import { sampleResult } from '@/data/sample-data'

export const useProteinStore = defineStore('protein', () => {
  const loading = ref(false)
  const result = ref<SamplingResult | null>(null)
  const selectedConformation = ref<Conformation | null>(null)
  const selectedCluster = ref('all')
  // 后端不可用时自动回退到内置示例数据，界面置为“示例模式”
  const isSampleData = ref(false)

  function applyResult(data: SamplingResult, sample: boolean) {
    result.value = data
    isSampleData.value = sample
    selectedConformation.value = null
    selectedCluster.value = 'all'
  }

  async function runSampling(params: ProteinParams) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/sample', params)
      applyResult(data, false)
    } catch {
      // 后端未启动或不可达：不阻断界面，改用内置示例数据
      applyResult(sampleResult, true)
    } finally { loading.value = false }
  }

  function loadSampleData() { applyResult(sampleResult, true) }

  function selectConformation(conf: Conformation) { selectedConformation.value = conf }
  function filterByCluster(cluster: string) { selectedCluster.value = cluster }

  return { loading, result, selectedConformation, selectedCluster, isSampleData, runSampling, loadSampleData, selectConformation, filterByCluster }
})
