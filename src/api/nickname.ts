import axiosInstance from "./axiosInstance"

export interface NickNameModificationResData {
  data: {
    id: 0
    nickname: "string"
  }
}

export const modifyNickName = async (uid: number, newNickName: string): Promise<NickNameModificationResData> => {
  try {
    const res = await axiosInstance.put(`/users/${uid}/nickname`, {
      nickname: newNickName,
    })
    return res.data
  } catch (e) {
    throw e
  }
}
