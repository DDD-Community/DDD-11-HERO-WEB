import { notification } from "@/api/notification"
import { create } from "zustand"

interface NotificationState {
  notification: notification | null
  setNotification: (notification: notification | null) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,
  setNotification: (notification: notification | null) => set({ notification }),
}))
