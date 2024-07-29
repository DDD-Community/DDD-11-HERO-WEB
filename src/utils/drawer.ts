import type { pose } from "@/utils/detector"
import { getSymmetricPointFromY, getTranslatedPoint, getScaledPoint } from "./calculator";
import { guideLinePoints } from "./guideLine";

export const drawPose = (poses: pose[], canvas: HTMLCanvasElement, dx : number = 0, dy : number = 0, scale : number = 1, canInitCallback : (canInit : boolean) => void, isInit : boolean) : void => {

  const ctx = canvas.getContext("2d")

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const guideLine = new Path2D()
    const origin = {x : canvas.width / 2, y : canvas.height}

    // canavs 좌표계 기준으로 가이드 라인 정렬 (가이드 라인의 기준은 (canvas.width / 2, canvas.height))
    let _guideLinePoints = guideLinePoints.map(point => getSymmetricPointFromY(point,canvas.height / 2.))
    if(dx!==0 || dy!==0) _guideLinePoints = _guideLinePoints.map(point => getTranslatedPoint(point,dx,dy))
    if(scale!==1) _guideLinePoints = _guideLinePoints.map(point=>getScaledPoint(point, origin.x, origin.y, scale))
    guideLine.moveTo(_guideLinePoints[0].x, _guideLinePoints[0].y)
    for (let i = 1; i < _guideLinePoints.length; i++) {
      guideLine.lineTo(_guideLinePoints[i].x, _guideLinePoints[i].y)
    }
    guideLine.closePath()
    ctx.strokeStyle = 'blue'
    ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.stroke(guideLine)
    ctx.fill(guideLine)
    
    poses.forEach((pose) => {
      const leftShoulder = pose.keypoints.find((kp) => kp.name === "left_shoulder")
      const rightShoulder = pose.keypoints.find((kp) => kp.name === "right_shoulder")
      const leftEar = pose.keypoints.find((kp) => kp.name === "left_ear")
      const rightEar = pose.keypoints.find((kp) => kp.name === "right_ear")

      // 
      if(leftShoulder && rightShoulder && leftEar && rightEar){
        if(!isInit){
          if(
            ctx.isPointInPath(guideLine,leftShoulder?.x, leftShoulder?.y) &&
            ctx.isPointInPath(guideLine,rightShoulder?.x, rightShoulder?.y) &&
            ctx.isPointInPath(guideLine,leftEar?.x, leftEar?.y) &&
            ctx.isPointInPath(guideLine,rightEar?.x, rightEar?.y)
          ) canInitCallback(true)
          else canInitCallback(false)
        }
      }

      // 왼쪽과 오른쪽 어깨 이어주는 선 그리기
      if (leftShoulder && rightShoulder && leftShoulder.confidence > 0.2 && rightShoulder.confidence > 0.2) {
        ctx.beginPath()
        ctx.moveTo(leftShoulder.x, leftShoulder.y)
        ctx.lineTo(rightShoulder.x, rightShoulder.y)
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      pose.keypoints.forEach((keypoint) => {
        if (keypoint.confidence > 0.25) {
          ctx.beginPath()
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = "red"
          ctx.fill()
        }
      })
    })
  }
}