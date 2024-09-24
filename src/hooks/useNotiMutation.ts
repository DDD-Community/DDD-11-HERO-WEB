import { getNotification, registerNotification, notification } from "@/api/notification"
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query"

export const useGetNoti = (): UseQueryResult<{ data: notification }, Error> => {
  return useQuery<{ data: notification }, Error>({
    queryKey: ["notification"],
    queryFn: getNotification,
  })
}

export const useModifyNoti = (): UseMutationResult<notification, unknown, notification, unknown> => {
  return useMutation({
    mutationFn: (notification: notification) => {
      return registerNotification(notification)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

// export const usePatchNoti = (): UseMutationResult<notification, unknown, notification, unknown> => {
//   return useMutation({
//     mutationFn: (notification: notification) => {
//       return updateNotification(notification)
//     },
//     onSuccess: (data) => {
//       console.log(data)
//     },
//   })
// }
