import axiosInstance from "./axiosInstance"

interface MyCheerUpInfoResData {
  data: {
    countCheeredUp: number
    cheeredUpUids: number[]
  }
}

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

interface SendCrewCheerParam {
  uids: number[]
}

export const requestSendCrewCheer = async (param: SendCrewCheerParam): Promise<ReportResData> => {
  try {
    const res = await axiosInstance.post(`/cheer-up`, param)
    return res.data
  } catch (e) {
    throw e
  }
}

export const getMyCheerUpInfo = async (date: string): Promise<MyCheerUpInfoResData> => {
  try {
    const res = await axiosInstance.get(`/cheer-up/me?cheeredAt=${date}`)
    return res.data
  } catch (e) {
    throw e
  }
}
