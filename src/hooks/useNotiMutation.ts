import { getNotification, modifyNotification, notification, patchNotification } from "@/api/notification"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

export const useGetNoti = (): UseMutationResult<notification | null, unknown, void, unknown> => {
  return useMutation({
    mutationFn: () => {
      return getNotification()
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

export const useModifyNoti = (): UseMutationResult<notification, unknown, notification, unknown> => {
  return useMutation({
    mutationFn: (notification: notification) => {
      return modifyNotification(notification)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

export const usePatchNoti = (): UseMutationResult<notification, unknown, notification, unknown> => {
  return useMutation({
    mutationFn: (notification: notification) => {
      return patchNotification(notification)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
