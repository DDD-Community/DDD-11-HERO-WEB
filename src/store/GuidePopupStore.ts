import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface PopupStore {
  isPopupOpen: boolean
  lastClosedDate: string | null
  openPopup: () => void
  closePopup: () => void
  setLastClosedDate: (date: string) => void
}

// Zustand store 생성
export const useGuidePopupStore = create(
  persist<PopupStore>(
    (set: any) => ({
      isPopupOpen: false,
      lastClosedDate: null,
      openPopup: () => set({ isPopupOpen: true }),
      closePopup: () => set({ isPopupOpen: false }),
      setLastClosedDate: (date) => set({ lastClosedDate: date }),
    }),
    {
      name: "popup-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
