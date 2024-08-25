import { keypoint } from "@/utils"
import { create } from "zustand"

interface SnapshotState {
  snapshot: keypoint[] | null
  setSnapshot: (snapshot: keypoint[]) => void
}

export const useSnapshotStore = create<SnapshotState>((set) => ({
  snapshot: null,
  setSnapshot: (snapshot: keypoint[]) => set({ snapshot }),
}))
