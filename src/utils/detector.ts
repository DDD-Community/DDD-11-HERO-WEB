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
 * @returns 거북목 상태라고 판단되면 true, 판단되지 않으면 false, 비교할 수 없는 경우 null을 반환
 */
export const detectTextNeck = (refer: pose[], comp: pose[]): boolean | null => {
  if (!refer || !comp) return null

  const referLeftEar = getXYfromPose(refer, "left_ear")
  const referRightEar = getXYfromPose(refer, "right_ear")
  const referLeftShoulder = getXYfromPose(refer, "left_shoulder")
  const referRightShoulder = getXYfromPose(refer, "right_shoulder")
  const compLeftEar = getXYfromPose(comp, "left_ear")
  const compRightEar = getXYfromPose(comp, "right_ear")
  const compLeftShoulder = getXYfromPose(comp, "left_shoulder")
  const compRightShoulder = getXYfromPose(comp, "right_shoulder")

  if (
    !referLeftEar ||
    !referRightEar ||
    !referLeftShoulder ||
    !referRightShoulder ||
    !compLeftEar ||
    !compRightEar ||
    !compLeftShoulder ||
    !compRightShoulder
  )
    return null

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
 * @returns 기울기가 왼쪽으로 치우쳤으면 "left", 오른쪽으로 치우쳤으면 "right"를 반환하며,
 * 기울기를 계산할 수 없는 경우 null을 반환
 */
export const detectSlope = (refer: pose[], comp: pose[]): string | null => {
  if (!refer || !comp) return null

  const referLeftSoulder = getXYfromPose(refer, "left_shoulder")
  const referRightSoulder = getXYfromPose(refer, "right_shoulder")
  const compLeftSoulder = getXYfromPose(comp, "left_shoulder")
  const compRightSoulder = getXYfromPose(comp, "right_shoulder")

  if (!referLeftSoulder || !referRightSoulder || !compLeftSoulder || !compRightSoulder) return null

  const referSlope = getSlopeFromPoints(referLeftSoulder, referRightSoulder)
  const compSlope = getSlopeFromPoints(compLeftSoulder, compRightSoulder)

  if (referSlope === Infinity || compSlope === Infinity) return null

  if (referSlope < compSlope) return "left"
  else return "right"
}
