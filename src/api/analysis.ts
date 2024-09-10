import axiosInstance from "./axiosInstance"
import { poseType } from "./pose"

export interface TodayAnalysisData {
  date: string
  count: {
    type: poseType
    count: number
  }[]
}

export interface TotalAnalysisData {
  data: TodayAnalysisData[]
  page: number
  size: number
  totalPage: number
  totalCount: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
}

export const getTodayPoseAnalysis = async (): Promise<TodayAnalysisData> => {
  try {
    const res = await axiosInstance.get("/pose-counts/daily")
    return res.data.data
  } catch (e) {
    throw e
  }
}

export const getTotalPoseAnalysis = async (): Promise<TodayAnalysisData[]> => {
  try {
    const res = await axiosInstance.get("/pose-counts?sort=date,asc")
    return res.data.data
  } catch (e) {
    throw e
  }
}
