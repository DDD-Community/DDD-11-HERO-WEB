import { keypoint } from "@/utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SnapshotState {
  snapshot: keypoint[] | null
  setSnapshot: (snapshot: keypoint[] | null) => void
}

export const useSnapshotStore = create(
  persist<SnapshotState>(
    (set) => ({
      snapshot: null,
      setSnapshot: (snapshot: keypoint[] | null) => set({ snapshot }),
    }),
    { name: "snapshotStorage" }
  )
)
