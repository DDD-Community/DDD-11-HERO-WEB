export interface point {
  x: number;
  y: number;
}
/**
 * 두 점을 잇는 직선과 주어진 점 사이의 거리를 계산
 *
 * @param l1 {point} - 직선을 정의하는 첫 번째 점
 * @param l2 {point} - 직선을 정의하는 두 번째 점
 * @param to {point}- 거리 계산의 대상이 되는 점
 * @returns 두 점 (l1, l2)을 잇는 직선과 주어진 점 (to) 사이의 거리
 *
 * @example
 * const point1 = { x: 0, y: 0 };
 * const point2 = { x: 4, y: 4 };
 * const point3 = { x: 2, y: 2 };
 * const distance = getDistanceFromLine(point1, point2, point3);
 * console.log(distance); // 출력: 0
 */
export const getDistanceFromLine = (
  l1: point,
  l2: point,
  to: point
): number => {
  const a = l2.y - l1.y;
  const b = l1.x - l2.x;
  const c = l2.x * l1.y - l1.x * l2.y;

  // 세 번째 점 C와 직선 사이의 거리를 구합니다.
  const distance =
    Math.abs(a * to.x + b * to.y + c) / Math.sqrt(a ** 2 + b ** 2);

  return distance;
};

/**
 * 3점 이상의 좌표들을 입력받아 다각형의 면적을 계산
 *
 * @param points {point[]} - 다각형을 구성하는 꼭짓점들의 배열
 * @returns 다각형의 면적을 반환하며, 꼭짓점이 3개 이하일 경우 null을 반환합니다.
 *
 * @example
 * const vertices = [
 *   { x: 0, y: 0 },
 *   { x: 4, y: 0 },
 *   { x: 4, y: 3 },
 * ];
 * const area = getAreaFromVertices(vertices);
 * console.log(area); // 출력: 6
 */
export const getAreaFromPoints = (points: point[]): number | null => {
  const n = points.length;

  if (n <= 2) return null;

  let area = 0;

  for (let i = 0; i < n; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
};

/**
 * 두 점을 잇는 직선의 기울기를 구하는 함수
 * @param {point} p1
 * @param {point} p2
 * @returns 두 점을 잇는 직선의 기울기를 반환합니다. 만약 두 점이 수직선을 형성할 경우 Infinity를 반환
 *
 * @example
 * const p1 = { x: 1, y: 2 };
 * const p2 = { x: 3, y: 4 };
 * const slope = getSlopeFromPoints(p1, p2);
 * console.log(slope); // 출력: 1
 *
 * const p1 = { x: 2, y: 1 };
 * const p2 = { x: 2, y: 3 };
 * const verticalSlope = getSlopeFromPoints(p1, p2);
 * console.log(verticalSlope); // 출력: Infinity
 */
export const getSlopeFromPoints = (p1: point, p2: point): number => {
  if (p1.x === p2.x) {
    // 수직선의 경우, 기울기를 무한대로 설정
    return Infinity;
  }

  return (p2.y - p1.y) / (p2.x - p1.x);
};

/**
 * 두 점 사이의 유클리드 거리를 계산
 *
 * @param {point} p1
 * @param {point} p2
 * @returns 두 점 사이의 거리
 *
 * @example
 * const point1 = { x: 1, y: 2 };
 * const point2 = { x: 4, y: 6 };
 * const distance = getDistance(point1, point2);
 * console.log(distance); // 출력: 5
 */
export const getDistance = (p1: point, p2: point): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

/**
 * 두 점의 중간 지점을 계산
 *
 * @param {point} p1
 * @param {point} p2
 * @returns {point} 두 점의 중간 지점
 *
 * @example
 * const point1 = { x: 1, y: 2 };
 * const point2 = { x: 3, y: 6 };
 * const midPoint = getMidPoint(point1, point2);
 * console.log(distance); // 출력: {x : 2, y : 4}
 */
export const getMidPoint = (p1: point, p2: point): point => {
  const x = (p1.x + p2.x) * 0.5;
  const y = (p1.y + p2.y) * 0.5;

  return { x, y };
};

/**
 * x=axisX를 기준으로 point를 대칭 이동 시킴
 *
 * @param {point} point
 * @param {number} axisX
 *
 */
export const getSymmetricPointFromX = (point : point, axisX : number) => {
  return {
    x: axisX + (axisX - point.x),
    y: point.y
  };
}

/**
 * y=axisY를 기준으로 point를 대칭 이동 시킴
 *
 * @param {point} point
 * @param {number} axisY
 *
 */
export const getSymmetricPointFromY = (point : point, axisY : number) => {
  return {
    x: point.x,
    y: axisY + (axisY -point.y)
  };
}

/**
 * dx, dy 만큼 point를 이동 시킴
 *
 * @param {point} point
 * @param {number} dx
 * @param {number} dy
 *
 */
export const getTranslatedPoint = (point : point, dx : number, dy : number) => {
  return {
    x: point.x + dx,
    y: point.y + dy
  }
}

/**
 * cx, cy를 기준으로 scaleFactor 만큼 point의 스케일을 변경
 *
 * @param {point} point
 * @param {number} cx
 * @param {number} cy
 * @param {number} scaleFactor
 *
 */
export const getScaledPoint = (point : point, cx : number, cy : number, scaleFactor : number) => {
  const x = point.x
  const y = point.y

  // 기준점으로부터의 상대적인 거리 계산
  const dx = x - cx
  const dy = y - cy

  // 스케일 팩터를 적용한 새로운 거리 계산
  const scaledX = cx + dx * scaleFactor
  const scaledY = cy + dy * scaleFactor

  return { x: scaledX, y: scaledY }
}