import axiosInstance from "./axiosInstance"

export type position =
  | "NOSE"
  | "LEFT_EYE"
  | "RIGHT_EYE"
  | "LEFT_EAR"
  | "RIGHT_EAR"
  | "LEFT_SHOULDER"
  | "RIGHT_SHOULDER"
  | "LEFT_ELBOW"
  | "RIGHT_ELBOW"
  | "LEFT_WRIST"
  | "RIGHT_WRIST"
  | "LEFT_HIP"
  | "RIGHT_HIP"
  | "LEFT_KNEE"
  | "RIGHT_KNEE"
  | "LEFT_ANKLE"
  | "RIGHT_ANKLE"

export interface point {
  position: position
  x: number
  y: number
}

export interface snapshot {
  id?: number
  points: point[]
}

export interface createSnapshotRes {
  id: string
}

export const createSnapshot = async (snapshot: snapshot): Promise<createSnapshotRes> => {
  try {
    const res = await axiosInstance.post(`/pose-layouts`, { points : snapshot.points })
    const { id } = res.data.data

    return { id }
  } catch (e) {
    throw e
  }
}

export const getSnapshots = async (id: string): Promise<snapshot> => {
  try {
    const res = await axiosInstance.get(`/pose-layouts/${id}`)
    return res.data.data
  } catch (e) {
    throw e
  }
}

export const getRecentSnapshot = async (): Promise<snapshot> => {
  try {
    const res = await axiosInstance.get(`/pose-layouts/recent`)
    return res.data.data
  } catch (e) {
    throw e
  }
}
