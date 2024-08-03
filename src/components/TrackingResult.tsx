interface TrackingResultProps {
  isTextNeck: boolean | null
  slope: null | string
}

export default function TrackingResult(props: TrackingResultProps) {
  const { isTextNeck, slope } = props
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div>
        거북목 상태:&nbsp;
        {isTextNeck === null ? (
          "상태를 확인할 수 없습니다."
        ) : isTextNeck ? (
          <span className="font-extrabold text-red-500">거북목 상태 입니다</span>
        ) : (
          "정상적인 자세 입니다"
        )}
      </div>
      <div>
        어깨 기울기: {slope === null && <span>상태를 확인할 수 없습니다.</span>}
        {slope && <span className={`${!slope.includes("올바른") ? "font-extrabold text-red-500" : ""}`}>{slope}</span>}
      </div>
    </div>
  )
}
