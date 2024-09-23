import { keypoint } from "@/utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SnapshotState {
  isSnapShotSaved: boolean
  snapshot: keypoint[] | null
  setSnapShot: (snapshot: keypoint[] | null) => void
  resetSnapShot: () => void
}

export const useSnapshotStore = create(
  persist<SnapshotState>(
    (set) => ({
      isSnapShotSaved: false,
      snapshot: null,
      setSnapShot: (snapshot: keypoint[] | null) => set({ snapshot, isSnapShotSaved: true }),
      resetSnapShot: () => set({ snapshot: null, isSnapShotSaved: false }),
    }),
    { name: "snapshotStorage" }
  )
)
