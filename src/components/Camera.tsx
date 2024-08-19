import React, { useRef, useEffect } from "react"

interface CameraProps {
  detectStart: (video: HTMLVideoElement) => void
  canvasRef: React.LegacyRef<HTMLCanvasElement> | undefined
}

export default function Camera(props: CameraProps): React.ReactElement {
  const { detectStart, canvasRef } = props
  const videoRef = useRef<HTMLVideoElement>(null)

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

  useEffect(() => {
    startVideo()
  })

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <video
          className="rounded-lg"
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
