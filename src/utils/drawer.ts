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

      // 특정 부위에만 원 그리기 (양쪽 손목 추가)
      const targetParts = [
        "left_ear",
        "right_ear",
        "left_shoulder",
        "right_shoulder",
        "nose",
        "left_wrist",
        "right_wrist",
      ]
      pose.keypoints.forEach((keypoint) => {
        if (keypoint.confidence > 0.25 && targetParts.includes(keypoint.name)) {
          ctx.beginPath()
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = "white"
          ctx.fill()
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })
    })
  }
}
