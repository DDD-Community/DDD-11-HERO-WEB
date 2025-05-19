import { keypoint } from "@/utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ExperiencingState {
  isExperiencing: boolean
  experiencingTime: number
  experiencingSnapshot: keypoint[] | null
  setIsExperiencing: (isExperiencing: boolean) => void
  setExperiencingTime: (t: number) => void
  setExperiencingSnapShot: (snapshot: keypoint[] | null) => void
}

export const useExperiencingStore = create(
  persist<ExperiencingState>(
    (set) => {
      return {
        isExperiencing: false,
        experiencingTime: 300,
        experiencingSnapshot: null,
        setIsExperiencing: (isExperiencing: boolean) => set({ isExperiencing: isExperiencing }),
        setExperiencingTime: (experiencingTime: number) =>
          set({ experiencingTime: experiencingTime < 0 ? 0 : experiencingTime }),
        setExperiencingSnapShot: (experiencingSnapshot: keypoint[] | null) => set({ experiencingSnapshot }),
      }
    },
    { name: "experiencingStorage" }
  )
)
