import { getNotification } from "@/api"
import { useNotificationStore } from "@/store/NotificationStore"
import { useEffect, useState } from "react"

export default function useNotification() {
  const { notification, setNotification } = useNotificationStore()
  const [isLoading, setIsLoading] = useState(true)

  // Fetch group data
  // const { data, isLoading, error } = useQuery<{ data: notification }, Error>({
  //   queryKey: ["notification"],
  //   queryFn: getNotification,
  //   staleTime: 60 * 1000,
  // })

  // useEffect(() => {
  //   if (data) {
  //     setNotification(data.data)
  //   }
  // }, [data])

  useEffect(() => {
    if (!notification) {
      getNotification()
        .then(({ data }) => {
          setNotification(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.log("useNotification Error: ", error)
          setIsLoading(false)
        })
    }
  }, [notification])

  return {
    notification,
    setNotification,
    isLoading,
    // error,
  }
}
