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

export interface GroupUserRankData {
  groupId: number
  ranks: groupUserRank[]
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

export interface MyGroupData {
  id: string
  name: string
  description: string
  userCount: number
  userCapacity: number
  ownerNickname: string
}

export const getGroups = async (groupsReq: groupsReq): Promise<groupsRes> => {
  try {
    const res = await axiosInstance.get(`/groups?${qs.stringify(groupsReq)}`)
    return res.data
  } catch (e) {
    throw e
  }
}

export const getGroup = async (id: number | undefined): Promise<group> => {
  try {
    const res = await axiosInstance.get(`/groups/${id}`)
    return res.data.data
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

export const checkGroupName = async (name: string): Promise<boolean> => {
  try {
    // eslint-disable-next-line max-len
    const res = await axiosInstance.post(`groups/check`, { name })
    const errorMessage = res.data?.errorMessage
    return errorMessage ? false : true
  } catch (e) {
    throw e
  }
}

export const getGroupScores = async (groupdId: string | number): Promise<{ data: GroupUserRankData }> => {
  try {
    const res = await axiosInstance.get(`/group-scores?groupId=${groupdId}`)
    return res.data
  } catch (e) {
    throw e
  }
}

export const getMyGroup = async (): Promise<{ data: MyGroupData }> => {
  try {
    const res = await axiosInstance.get(`/groups/my-group`)
    return res.data
  } catch (e) {
    throw e
  }
}

export const withdrawMyGroup = async (id: string | number | undefined): Promise<any> => {
  if (!id) {
    throw new Error("잘못된 크루 id 입니다.")
  }
  try {
    const res = await axiosInstance.delete(`/groups/${id}/withdraw`)
    console.log("res: ", res)
    return res
  } catch (e) {
    throw e
  }
}
