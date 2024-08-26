import { pose } from "@/utils"
import axiosInstance from "./axiosInstance"

export type poseType = "GOOD" | "TURTLE_NECK" | "SHOULDER_TWIST" | "CHIN_UTP" | "TAILBONE_SIT"

export interface poseReq {
  snapshot: pose
  type: poseType
  imageUrl?: string
}

export interface poseRes {
  id: number
  uid: number
  type: poseType
  createdAt: string
}
export const sendPose = async (poseReq: poseReq): Promise<poseRes> => {
  try {
    const res = await axiosInstance.post(`/pose-snapshots`, { ...poseReq })
    const { id, uid, type, createdAt } = res.data.data
    return { id, uid, type, createdAt }
  } catch (e) {
    throw e
  }
}
