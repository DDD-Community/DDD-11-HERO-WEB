import { create } from "zustand"
import { MyGroupData } from "@/api"

interface MyGroupStore {
  myGroupData: MyGroupData | null
  setMyGroupData: (data: MyGroupData | null) => void
}

export const useMyGroupStore = create<MyGroupStore>((set) => ({
  myGroupData: null,
  setMyGroupData: (data) => set({ myGroupData: data }),
}))
