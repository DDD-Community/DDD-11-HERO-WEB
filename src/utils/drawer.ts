import type { pose } from "@/utils/detector"

export const drawPose = (poses: pose[], canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.confidence > 0.1) {
          ctx.beginPath()
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = "red"
          ctx.fill()
        }
      })
    })
  }
}
