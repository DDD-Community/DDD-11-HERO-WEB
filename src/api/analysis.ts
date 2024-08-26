import axiosInstance from "./axiosInstance"
import { poseType } from "./pose"

export interface TodayAnalysisData {
  date: string
  count: {
    type: poseType
    count: number
  }[]
}

export const getTodayAnalysis = async (): Promise<TodayAnalysisData> => {
  try {
    const res = await axiosInstance.get("/pose-counts/daily")
    return res.data.data
  } catch (e) {
    throw e
  }
}
