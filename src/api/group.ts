import qs from "qs"
import axiosInstance from "./axiosInstance"

export type sort = "userCount,desc" | "createdAt,desc"

export interface sortRes {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface group {
  id: number
  name: string
  description: string
  ownerUid: number
  isHidden: boolean
  joinCode: string
  userCount: number
  userCapacity: number
  ranks: groupUserRank[]
}

export interface groupUserRank {
  groupUserId: number
  name: string
  rank: number
  score: number
}

export interface groupsReq {
  page: number
  size: number
  sort: sort
}

export interface groupsRes {
  data: group[]
  page: number
  size: number
  totalPage: number
  totalCount: number
  sort: sortRes
}

export interface groupJoinReq {
  groupId: number
  joinCode: string
}

export interface groupJoinRes {
  groupId: number
  uid: number
  groupUserId: number
}

export const getGroups = async (groupsReq: groupsReq): Promise<groupsRes> => {
  try {
    const res = await axiosInstance.get(`/groups?${qs.stringify(groupsReq)}`)
    return res.data
  } catch (e) {
    throw e
  }
}

export const joinGroup = async (groupJoinReq: groupJoinReq): Promise<groupJoinRes> => {
  try {
    // eslint-disable-next-line max-len
    const res = await axiosInstance.post(`groups/${groupJoinReq.groupId}/join`, { joinCode: groupJoinReq.joinCode })
    return res.data
  } catch (e) {
    throw e
  }
}
