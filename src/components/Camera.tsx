import React, { useRef, useEffect } from "react"

type WebcamProps = {
  onStreamReady: (video: HTMLVideoElement) => void
}

const Camera: React.FC<WebcamProps> = ({ onStreamReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const startVideo = (): void => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          frameRate: {
            ideal: 5,
          },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          // 'loadedmetadata' 이벤트가 발생하면 비디오 재생
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
              onStreamReady(videoRef.current)
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
  }, [])

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "640px",
          height: "480px",
        }}
      />
    </div>
  )
}

export default Camera
