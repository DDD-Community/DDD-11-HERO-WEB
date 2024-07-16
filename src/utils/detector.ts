import { getSlopeFromPoints, getDistanceFromLine, getMidPoint, getDistance } from "@/utils/calculator"
import type { point } from "@/utils/calculator"

export interface keypoint {
  y: number
  x: number
  name: string
  confidence: number
}

// 바운딩 박스의 타입 정의
export interface box {
  yMin: number
  xMin: number
  yMax: number
  xMax: number
  width: number
  height: number
}

// 포즈 객체의 타입 정의
export interface pose {
  keypoints: keypoint[]
  box: box
  score: number
  id: number
  nose: keypoint
  left_eye: keypoint
  right_eye: keypoint
  left_ear: keypoint
  right_ear: keypoint
  left_shoulder: keypoint
  right_shoulder: keypoint
  left_elbow: keypoint
  right_elbow: keypoint
  left_wrist: keypoint
  right_wrist: keypoint
  left_hip: keypoint
  right_hip: keypoint
  left_knee: keypoint
  right_knee: keypoint
  left_ankle: keypoint
  right_ankle: keypoint
}

/**
 * movenet detect 결과값으로 부터 point 객체 추출
 * @param poses {pose[]} movenet 결과값
 * @param name {string} keypoint중 추출하고자 하는 key name
 * @returns {point} {x,y}
 */
export const getXYfromPose = (poses: pose[], name: string): point | null => {
  try {
    const pose = poses[0]
    const point = pose.keypoints.find((k) => k.name === name)
    const x = point?.x
    const y = point?.y

    if (!x || !y) return null

    return { x, y }
  } catch (error) {
    return null
  }
}

/**
 * 두 개의 포즈 배열을 받아 비교하여 Text Neck(텍스트 목) 증후군 여부를 검출
 * 두 귀의 거리, 귀의 중간지점과 어깨를 이은 직선과의 거리를 이용해 비교
 * @param refer 비교 기준이 되는 포즈 배열
 * @param comp 비교할 대상이 되는 포즈 배열
 * @param isSnapShotMode 스냅샷 촬영후, 해당 기준으로 자세를 측정할 지 아니면 자동으로 측정할 지
 * @returns 거북목 상태라고 판단되면 true, 판단되지 않으면 false, 비교할 수 없는 경우 null을 반환
 */
export const detectTextNeck = (refer: pose[], comp: pose[], isSnapShotMode: boolean = true): boolean | null => {
  if (!comp) return null

  const referLeftEar = getXYfromPose(refer, "left_ear")
  const referRightEar = getXYfromPose(refer, "right_ear")
  const referLeftShoulder = getXYfromPose(refer, "left_shoulder")
  const referRightShoulder = getXYfromPose(refer, "right_shoulder")
  const compLeftEar = getXYfromPose(comp, "left_ear")
  const compRightEar = getXYfromPose(comp, "right_ear")
  const compLeftShoulder = getXYfromPose(comp, "left_shoulder")
  const compRightShoulder = getXYfromPose(comp, "right_shoulder")
  const compNose = getXYfromPose(comp, "nose")

  if (
    !referLeftEar ||
    !referRightEar ||
    !referLeftShoulder ||
    !referRightShoulder ||
    !compLeftEar ||
    !compRightEar ||
    !compLeftShoulder ||
    !compRightShoulder ||
    !compNose
  )
    return null

  if (!isSnapShotMode) {
    // 귀의 중점 계산
    const earMidpoint = getMidPoint(compLeftEar, compRightEar)

    // 어깨의 중점 계산
    const shoulderMidpoint = getMidPoint(compLeftShoulder, compRightShoulder)

    // // 귀의 중점과 어깨의 중점 사이의 거리 계산
    // const earToShoulderDistance = getDistance(earMidpoint, shoulderMidpoint)

    // // 코와 어깨 중점 사이의 거리 계산
    // const noseToShoulderDistance = getDistance(compNose, shoulderMidpoint)

    // 거북목 판단 기준:
    // 1. 귀의 중점이 어깨의 중점보다 앞쪽에 있는지 (x 좌표 비교)
    // 2. 코가 귀의 중점보다 어깨 쪽에 가까운지 (거리 비교)

    console.log(earMidpoint.x, " / ", shoulderMidpoint.x)
    const isEarForwardOfShoulder = earMidpoint.x > shoulderMidpoint.x
    // const isNoseCloserToShoulder = noseToShoulderDistance < earToShoulderDistance
    // 두 조건이 모두 참이면 거북목으로 판단
    return isEarForwardOfShoulder
  }

  const referDistance = getDistanceFromLine(
    referLeftShoulder,
    referRightShoulder,
    getMidPoint(referLeftEar, referRightEar)
  )
  const referEearsDistance = getDistance(referLeftEar, referRightEar)
  const compDistance = getDistanceFromLine(compLeftShoulder, compRightShoulder, getMidPoint(compLeftEar, compRightEar))
  const compEearsDistance = getDistance(compLeftEar, compRightEar)
  if (referDistance * 0.98 > compDistance && referEearsDistance < compEearsDistance) return true
  else return false
}

/**
 * 두 개의 포즈 배열을 받아 비교하여 어깨 기울기 상태를 string 혹은 null로 반환
 * 어깨 기울기는 각 포즈 배열에서 왼쪽 어깨와 오른쪽 어깨의 좌표를 이용하여 계산
 * @param refer 비교 기준이 되는 포즈 배열
 * @param comp 비교할 대상이 되는 포즈 배열
 * @param isSnapShotMode 스냅샷 촬영후, 해당 기준으로 자세를 측정할 지 아니면 자동으로 측정할 지
 * @returns 기울기가 왼쪽으로 치우쳤으면 "left", 오른쪽으로 치우쳤으면 "right"를 반환하며,
 * 기울기를 계산할 수 없는 경우 null을 반환
 */
export const detectSlope = (refer: pose[], comp: pose[], isSnapShotMode: boolean = true): string | null => {
  if (!comp) return null

  const referLeftSoulder = getXYfromPose(refer, "left_shoulder")
  const referRightSoulder = getXYfromPose(refer, "right_shoulder")
  const compLeftShoulder = getXYfromPose(comp, "left_shoulder")
  const compRightShoulder = getXYfromPose(comp, "right_shoulder")

  if (!isSnapShotMode && compLeftShoulder && compRightShoulder) {
    const SHOULDER_DIFF_THRESHOLD = 40
    const shoulderSlope = compLeftShoulder.y - compRightShoulder.y

    if (Math.abs(shoulderSlope) < SHOULDER_DIFF_THRESHOLD) {
      return "적절한 자세입니다"
    } else if (shoulderSlope > 0) {
      return "오른쪽 어깨가 올라갔습니다"
    } else {
      return "왼쪽 어깨가 올라갔습니다"
    }
  }

  if (!referLeftSoulder || !referRightSoulder || !compLeftShoulder || !compRightShoulder) return null

  const referSlope = getSlopeFromPoints(referLeftSoulder, referRightSoulder)
  const compSlope = getSlopeFromPoints(compLeftShoulder, compRightShoulder)

  if (referSlope === Infinity || compSlope === Infinity) return null

  // referSlope를 기준으로 10% 오차 미만이면, 정상 자세인 것으로 간주
  const tenPercentOfReferSlope = Math.abs(referSlope) * 0.9
  const slopeDifference = Math.abs(referSlope - compSlope)

  if (slopeDifference <= tenPercentOfReferSlope) {
    return "올바른 자세입니다"
  } else if (referSlope < compSlope) {
    return "왼쪽으로 치우쳐져 있습니다"
  } else {
    return "오른쪽으로 치우쳐져 있습니다"
  }
}
