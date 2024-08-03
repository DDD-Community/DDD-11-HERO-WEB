import React from "react"
import Camera from "./Camera"
import ControlPanel from "./ControlPanel"

interface CameraContianerProps {
  detectStart: (video: HTMLVideoElement) => void
  canvasRef: React.LegacyRef<HTMLCanvasElement> | undefined
  isModelLoaded: boolean
  onChangeMode: React.ChangeEventHandler<HTMLSelectElement>
  onChangeTranslation: React.ChangeEventHandler<HTMLInputElement>
}

export default function CameraContianer(props: CameraContianerProps) {
  const { detectStart, canvasRef, isModelLoaded, onChangeMode, onChangeTranslation } = props
  return (
    <div
      style={{
        display: "flex",
        padding: "20px",
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <Camera onStreamReady={detectStart} />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            border: "1px solid black",
          }}
        />
      </div>
      <div
        style={{
          paddingLeft: "20px",
          width: "150px",
        }}
      >
        {isModelLoaded && <ControlPanel onChangeMode={onChangeMode} onChangeTranslation={onChangeTranslation} />}
      </div>
    </div>
  )
}
