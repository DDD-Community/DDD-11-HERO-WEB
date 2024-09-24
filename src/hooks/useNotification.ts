import { getNotification, notification } from "@/api/notification"
import { useNotificationStore } from "@/store/NotificationStore"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export default function useNotification() {
  const { notification, setNotification } = useNotificationStore()

  // Fetch group data
  const { data, isLoading, error } = useQuery<{ data: notification }, Error>({
    queryKey: ["notification"],
    queryFn: getNotification,
    staleTime: 60 * 1000,
    retry: false,
    enabled: !notification,
  })

  useEffect(() => {
    if (data) {
      setNotification(data.data)
    }
  }, [data])

  return {
    notification,
    setNotification,
    isLoading,
    error,
  }
}
