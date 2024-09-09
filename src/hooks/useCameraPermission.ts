import { useState, useEffect } from "react"

// 커스텀 훅: 카메라 권한을 확인하고 상태를 관리
export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false)

  // 카메라 권한 확인 함수
  const checkCameraPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "camera" as PermissionName,
      })

      // 권한 상태 설정
      if (permissionStatus.state === "granted") {
        setHasPermission(true)
        setIsPermissionDenied(false)
      } else if (permissionStatus.state === "denied") {
        setHasPermission(false)
        setIsPermissionDenied(true)
      }

      // 권한 변경 감지
      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          setHasPermission(true)
          setIsPermissionDenied(false)
        } else if (permissionStatus.state === "denied") {
          setHasPermission(false)
          setIsPermissionDenied(true)
        }
      }
    } catch (error) {
      console.error("Permission API error:", error)
      setHasPermission(false)
      setIsPermissionDenied(true)
    }
  }

  useEffect(() => {
    checkCameraPermission() // 컴포넌트 마운트 시 권한 확인
  }, [])

  return { hasPermission, isPermissionDenied }
}
