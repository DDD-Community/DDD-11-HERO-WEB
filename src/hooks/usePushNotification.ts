import { useState, useEffect, useRef } from "react"
import PushIcon from "@assets/icons/favicon.svg"

interface UsePushNotificationResult {
  hasPermission: boolean
  isPermissionDenied: boolean
  requestNotificationPermission: () => Promise<void>
  showNotification: (body: string) => void
}

// 커스텀 훅: 알림 권한을 확인하고 권한 변경을 감지
const usePushNotification = (): UsePushNotificationResult => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isPermissionDenied, setIsPermissionDenied] = useState(false)

  // 최신 상태 추적용 useRef
  const hasPermissionRef = useRef(hasPermission)

  useEffect(() => {
    // 최신 hasPermission 값을 항상 유지
    hasPermissionRef.current = hasPermission
  }, [hasPermission])

  // 권한 변경을 처리하는 함수
  const handlePermissionChange = (permission: NotificationPermission): void => {
    if (permission === "granted") {
      setHasPermission(true)
      setIsPermissionDenied(false)
    } else if (permission === "denied") {
      setHasPermission(false)
      setIsPermissionDenied(true)
    } else {
      setHasPermission(false)
      setIsPermissionDenied(false) // 'default' 상태
    }
  }

  // 알림 권한 요청 함수
  const requestNotificationPermission = async (): Promise<void> => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        handlePermissionChange(permission) // 권한 상태에 따라 상태 업데이트
      } catch (error) {
        console.error("Notification permission request error:", error)
      }
    } else {
      console.error("This browser does not support notifications.")
    }
  }

  // 알림 표시 함수
  const showNotification = (body: string): void => {
    if (hasPermissionRef.current) {
      new Notification("자세공작소", {
        body: body,
        icon: PushIcon as string,
      })
    }
  }

  useEffect(() => {
    // 컴포넌트가 마운트될 때 권한 상태 확인
    if ("Notification" in window) {
      handlePermissionChange(Notification.permission)

      const checkPermission = () => {
        handlePermissionChange(Notification.permission)
      }

      if ("permissions" in navigator && "query" in navigator.permissions) {
        // Chrome and other browsers that support Permissions API
        navigator.permissions
          .query({ name: "notifications" as PermissionName })
          .then((permissionStatus) => {
            checkPermission()
            permissionStatus.onchange = checkPermission
          })
          .catch((error) => {
            console.error("Permission API error:", error)
            // Fallback to interval checking for Safari
            const checkPermissionInterval = setInterval(checkPermission, 1000)
            return () => clearInterval(checkPermissionInterval)
          })
      } else {
        // Safari and other browsers that don't support Permissions API
        const checkPermissionInterval = setInterval(checkPermission, 1000)
        return () => clearInterval(checkPermissionInterval)
      }
    }
  }, [])

  return { hasPermission, isPermissionDenied, requestNotificationPermission, showNotification }
}

export default usePushNotification
