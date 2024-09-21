import axiosInstance from "./axiosInstance"

export type duration = "IMMEDIATELY" | "MIN_15" | "MIN_30" | "MIN_45" | "MIN_60"

export interface notification {
  id?: number
  isActive?: boolean
  duration?: duration
}

export const getNotification = async (): Promise<notification | null> => {
  try {
    const res = await axiosInstance.get(`/pose-notifications`)

    if (!res.data?.data) return null

    const { id, duration } = res.data.data
    return { id, duration }
  } catch (e) {
    throw e
  }
}

export const registerNotification = async (notification: notification): Promise<notification> => {
  try {
    const res = await axiosInstance.post(`/pose-notifications`, { ...notification })
    const { id, duration } = res.data.data
    return { id, duration }
  } catch (e) {
    throw e
  }
}

export const updateNotification = async (notification: notification): Promise<notification> => {
  try {
    const res = await axiosInstance.patch(`/pose-notifications/${notification.id}`, { ...notification })
    const { id, isActive, duration } = res.data.data
    return { id, isActive, duration }
  } catch (e) {
    throw e
  }
}
