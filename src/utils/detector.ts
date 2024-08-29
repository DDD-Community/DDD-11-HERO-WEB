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
  box?: box
  score?: number
  id?: number
  nose?: keypoint
  left_eye?: keypoint
  right_eye?: keypoint
  left_ear?: keypoint
  right_ear?: keypoint
  left_shoulder?: keypoint
  right_shoulder?: keypoint
  left_elbow?: keypoint
  right_elbow?: keypoint
  left_wrist?: keypoint
  right_wrist?: keypoint
  left_hip?: keypoint
  right_hip?: keypoint
  left_knee?: keypoint
  right_knee?: keypoint
  left_ankle?: keypoint
  right_ankle?: keypoint
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
    const confidence = point?.confidence

    if (!x || !y || !confidence) return null

    return { x, y, confidence }
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
export const detectTextNeck = (refer: pose[], comp: pose[], isSnapShotMode = true): boolean | null => {
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
  if (referDistance * 0.95 > compDistance && referEearsDistance < compEearsDistance) return true
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
export const detectSlope = (refer: pose[], comp: pose[], isSnapShotMode = true): boolean | null => {
  if (!comp) return null

  const referLeftSoulder = getXYfromPose(refer, "left_shoulder")
  const referRightSoulder = getXYfromPose(refer, "right_shoulder")
  const compLeftShoulder = getXYfromPose(comp, "left_shoulder")
  const compRightShoulder = getXYfromPose(comp, "right_shoulder")

  const SHOULDER_DIFF_THRESHOLD = 80

  if (!isSnapShotMode && compLeftShoulder && compRightShoulder) {
    const shoulderSlope = compLeftShoulder.y - compRightShoulder.y

    if (Math.abs(shoulderSlope) < SHOULDER_DIFF_THRESHOLD) {
      return false
    } else if (shoulderSlope > 0) {
      return true
    } else {
      return true
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
    return false
  } else if (referSlope < compSlope) {
    return true
  } else {
    return true
  }
}

/**
 * 손을 턱에 괴고 있는 자세를 감지하는 함수
 * @param poses 현재 포즈 데이터 배열
 * @returns 손을 턱에 대고 있으면 true, 아니면 false, 판단할 수 없으면 null
 */
export const detectHandOnChin = (poses: pose[]): boolean | null => {
  if (!poses || poses.length === 0) return null

  // 필요한 키포인트 추출
  const nose = getXYfromPose(poses, "nose")
  const leftEar = getXYfromPose(poses, "left_ear")
  const rightEar = getXYfromPose(poses, "right_ear")
  const leftWrist = getXYfromPose(poses, "left_wrist")
  const rightWrist = getXYfromPose(poses, "right_wrist")
  const leftShoulder = getXYfromPose(poses, "left_shoulder")
  const rightShoulder = getXYfromPose(poses, "right_shoulder")

  // 키포인트가 없으면 null 반환
  if (!nose || !leftEar || !rightEar || !leftWrist || !rightWrist || !leftShoulder || !rightShoulder) return null

  // 턱의 위치를 추정 (코와 귀 중간점의 중간점)
  const earMidpoint = getMidPoint(leftEar, rightEar)
  const estimatedChin = getMidPoint(nose, earMidpoint)

  // 어깨 너비 계산
  const shoulderWidth = getDistance(leftShoulder, rightShoulder)

  // 턱 부근을 판단하기 위한 거리를 어깨 너비의 비율로 설정
  // 이 비율은 실제 테스트를 통해 조정이 필요할 수 있습니다.
  const CHIN_PROXIMITY_RATIO = 0.5 // 어깨 너비의 25%
  const chinProximityThreshold = shoulderWidth * CHIN_PROXIMITY_RATIO

  // 손목과 추정된 턱 위치 사이의 거리 계산
  const leftWristToChinDistance = getDistance(leftWrist, estimatedChin)
  const rightWristToChinDistance = getDistance(rightWrist, estimatedChin)

  // 왼손이나 오른손 중 하나라도 턱 근처에 있으면 true 반환
  if (leftWristToChinDistance < chinProximityThreshold || rightWristToChinDistance < chinProximityThreshold) {
    return true
  }

  return false
}

/**
 * 두 개의 포즈 배열을 받아 비교하여 꼬리뼈 앉기 자세 판단
 * 귀 중간의 y좌표, 어깨 중간의 y좌표, 귀 사이의 거리, 어깨 사이의 거리를 사용해서 비교
 * @param refer 비교 기준이 되는 포즈 배열
 * @param comp 비교할 대상이 되는 포즈 배열
 * @returns 꼬리뼈 앉기로 판단되면 true, 판단되지 않으면 false, 비교할 수 없는 경우 null을 반환
 */
export const detectTailboneSit = (refer: pose[], comp: pose[]): boolean | null => {
  // 스냅샷(refer)과 현재 데이터(comp)가 없으면 null 반환
  if (!comp || !refer) null

  // 스냅샷(refer)에서 왼쪽 귀, 오른쪽 귀, 왼쪽 어깨, 오른쪽 어깨의 좌표를 가져옴
  const referLeftEar = getXYfromPose(refer, "left_ear")
  const referRightEar = getXYfromPose(refer, "right_ear")
  const referLeftShoulder = getXYfromPose(refer, "left_shoulder")
  const referRightShoulder = getXYfromPose(refer, "right_shoulder")

  // 비교할 현재 데이터(comp)에서 왼쪽 귀, 오른쪽 귀, 왼쪽 어깨, 오른쪽 어깨의 좌표를 가져옴
  const compLeftEar = getXYfromPose(comp, "left_ear")
  const compRightEar = getXYfromPose(comp, "right_ear")
  const compLeftShoulder = getXYfromPose(comp, "left_shoulder")
  const compRightShoulder = getXYfromPose(comp, "right_shoulder")

  // 필요한 좌표 데이터가 하나라도 없으면 null 반환
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

  // 현재(comp)와 스냅샷(refer) 데이터의 귀 중간 좌표를 계산
  const compEarMid = getMidPoint(compLeftEar, compRightEar)
  const referEarMid = getMidPoint(referLeftEar, referRightEar)

  // 현재(comp)와 스냅샷(refer) 데이터의 어깨 중간 좌표를 계산
  const compShoulderMid = getMidPoint(compLeftShoulder, compRightShoulder)
  const referShoulderMid = getMidPoint(referLeftShoulder, referRightShoulder)

  // 귀와 어깨 사이의 거리 계산
  const referShoulderDistance = getDistance(referLeftShoulder, referRightShoulder)
  const referEarsDistance = getDistance(referLeftEar, referRightEar)
  const compShoulderDistance = getDistance(compLeftShoulder, compRightShoulder)
  const compEearsDistance = getDistance(compLeftEar, compRightEar)

  // 조건 1: 현재(comp)의 귀 중간 y좌표가 스냅샷(refer)보다 아래에 있고,
  // 현재(comp)의 어깨 중간 y좌표도 스냅샷(refer)보다 아래에 있는지 확인
  const compY = compEarMid.y - referEarMid.y > 20 && compShoulderMid.y - referShoulderMid.y > 20

  // 조건 2: 현재(comp)의 귀 거리와 어깨 거리가 참조(refer)의 90%보다 짧은지 확인
  const compDistance = compEearsDistance < referEarsDistance * 0.9 && compShoulderDistance < referShoulderDistance * 0.9

  // 두 조건을 모두 만족하면 true 반환, 그렇지 않으면 false 반환
  return compY && compDistance
}
