import axiosInstance from "./axiosInstance"

interface ReportResData {
  data: {
    id: number
    uid: number
    email: string
    type: string
    title: string
    content: string
    createdAt: string
    modifiedAt: string
  }
}

interface ReportParam {
  email: string
  title: string
  content: string
}

export const requestSendReportAPI = async (param: ReportParam): Promise<ReportResData> => {
  try {
    const res = await axiosInstance.post(`/discussion`, { ...param, type: "QNA" })
    return res.data
  } catch (e) {
    throw e
  }
}
