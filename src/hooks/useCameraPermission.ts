import { useState, useEffect } from "react"

// 커스텀 훅: 카메라 권한을 확인하고 상태를 관리
export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false)

  // 카메라 권한 확인 함수
  const checkCameraPermission = async () => {
    try {
      // 먼저 navigator.permissions.query()를 시도합니다.
      if ("permissions" in navigator && "query" in navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        })

        // 권한 상태 설정
        if (permissionStatus.state === "granted") {
          setHasPermission(true)
          setIsPermissionDenied(false)
          return
        } else if (permissionStatus.state === "denied") {
          setHasPermission(false)
          setIsPermissionDenied(true)
          return
        }

        // 권한 변경 감지 (크롬에서 작동)
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setHasPermission(true)
            setIsPermissionDenied(false)
          } else if (permissionStatus.state === "denied") {
            setHasPermission(false)
            setIsPermissionDenied(true)
          }
        }
      }

      // navigator.permissions.query()가 지원되지 않거나 "prompt" 상태인 경우
      // 실제 카메라 접근을 시도합니다.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop()) // 스트림 정리
      setHasPermission(true)
      setIsPermissionDenied(false)
    } catch (error) {
      console.error("Camera access error:", error)
      setHasPermission(false)
      setIsPermissionDenied(true)
    }
  }

  useEffect(() => {
    checkCameraPermission()
  }, [])

  return { hasPermission, isPermissionDenied, checkCameraPermission }
}
