import { keypoint } from "@/utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SnapShotState {
  isSnapShotSaved: boolean
  snapshot: keypoint[] | null
  setSnapShot: (snapshot: keypoint[] | null) => void
  resetSnapShot: () => void
}

export const useSnapShotStore = create(
  persist<SnapShotState>(
    (set) => ({
      isSnapShotSaved: false,
      snapshot: null,
      setSnapShot: (snapshot: keypoint[] | null) => set({ snapshot, isSnapShotSaved: true }),
      resetSnapShot: () => set({ snapshot: null, isSnapShotSaved: false }),
    }),
    { name: "snapshotStorage" }
  )
)
