import { getNotification } from "@/api"
import { useExperiencingStore } from "@/store/ExperiencingStore"
import { useNotificationStore } from "@/store/NotificationStore"
import { useEffect, useState } from "react"

export default function useNotification() {
  const { notification, setNotification } = useNotificationStore()
  const { isExperiencing } = useExperiencingStore()
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
    if (isExperiencing) {
      setIsLoading(false)
      return
    }
    if (!notification) {
      getNotification()
        .then(({ data }) => {
          console.log("data: ", data)
          setNotification(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.log("useNotification Error: ", error)
          setIsLoading(false)
        })
    }
  }, [notification, isExperiencing])

  return {
    notification,
    setNotification,
    isLoading,
    // error,
  }
}
