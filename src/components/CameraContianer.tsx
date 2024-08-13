import React from "react"
import Camera from "./Camera"

interface CameraContianerProps {
  detectStart: (video: HTMLVideoElement) => void
  canvasRef: React.LegacyRef<HTMLCanvasElement> | undefined
  isModelLoaded: boolean
}

export default function CameraContianer(props: CameraContianerProps): React.ReactElement {
  const { detectStart, canvasRef } = props
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Camera onStreamReady={detectStart} />
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
        }}
      />
    </div>
  )
}
