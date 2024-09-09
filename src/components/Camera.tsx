import React, { useRef, useEffect } from "react"
import { useCameraPermission } from "@/hooks/useCameraPermission" // 커스텀 훅을 가져옵니다.

interface CameraProps {
  detectStart: (video: HTMLVideoElement) => void
  canvasRef: React.LegacyRef<HTMLCanvasElement> | undefined
}

export default function Camera(props: CameraProps): React.ReactElement {
  const { detectStart, canvasRef } = props
  const videoRef = useRef<HTMLVideoElement>(null)

  // 비디오를 시작하는 함수
  const startVideo = (): void => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          frameRate: {
            ideal: 60,
          },
          width: 1280,
          height: 720,
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          // 'loadedmetadata' 이벤트가 발생하면 비디오 재생
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
              detectStart(videoRef.current)
            }
          }
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err)
      })
  }

  // 비디오를 중지하는 함수
  const stopVideo = (): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => {
        track.stop() // 모든 트랙 중지
      })

      videoRef.current.srcObject = null // 비디오 스트림 초기화
    }
  }

  // 커스텀 훅을 사용해 권한 상태 확인
  const { hasPermission, isPermissionDenied } = useCameraPermission()

  useEffect(() => {
    if (hasPermission) {
      startVideo()
    } else if (isPermissionDenied) {
      stopVideo()
    }

    return () => {
      stopVideo() // 컴포넌트가 언마운트될 때 비디오 중지
    }
  }, [hasPermission, isPermissionDenied])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div className="rounded-3xl bg-[#787870]/20" style={{ position: "relative", width: "100%", height: "100%" }}>
        <video
          className="rounded-3xl"
          ref={videoRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            transform: "scaleX(-1)", // 비디오를 좌우 반전시키는 CSS 속성 추가
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        width="1280"
        height="720"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: "scaleX(-1)", // 캔버스도 좌우 반전시켜 비디오와 일치시킴
        }}
      />
    </div>
  )
}
