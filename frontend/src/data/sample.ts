import type { SamplingResult } from '@/types'
import sampleResult from './sample-result.json'

/**
 * 内置示例数据：后端未启动时也能打开完整界面查看效果。
 * 由固定随机种子按与后端相同的采样算法离线生成，见 sample-result.json。
 */
export const sampleData: SamplingResult = sampleResult as unknown as SamplingResult
