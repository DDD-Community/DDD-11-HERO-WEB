import type { pose } from "@/utils/detector"

export const drawPose = (poses: pose[], canvas: HTMLCanvasElement, isRight = true): void => {
  const ctx = canvas.getContext("2d")

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    poses.forEach((pose) => {
      const leftShoulder = pose.keypoints.find((kp) => kp.name === "left_shoulder")
      const rightShoulder = pose.keypoints.find((kp) => kp.name === "right_shoulder")
      const color = isRight ? "#00C670" : "#EF4444"
      // 왼쪽과 오른쪽 어깨 이어주는 선 그리기
      if (leftShoulder && rightShoulder && leftShoulder.confidence > 0.2 && rightShoulder.confidence > 0.2) {
        ctx.beginPath()
        ctx.moveTo(leftShoulder.x, leftShoulder.y)
        ctx.lineTo(rightShoulder.x, rightShoulder.y)
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()
      }

      pose.keypoints.forEach((keypoint) => {
        if (keypoint.confidence > 0.25) {
          ctx.beginPath()
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = "white"
          ctx.fill()
          ctx.strokeStyle = color // 초록색 테두리
          ctx.lineWidth = 2 // 테두리 두께
          ctx.stroke() // 테
        }
      })
    })
  }
}
