import { notification } from "@/api/notification"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotificationState {
  notification: notification | null
  setNotification: (notification: notification | null) => void
}

export const useNotificationStore = create(
  persist<NotificationState>(
    (set) => ({
      notification: null,
      setNotification: (notification: notification | null) => set({ notification }),
    }),
    { name: "notificationStorage" }
  )
)
