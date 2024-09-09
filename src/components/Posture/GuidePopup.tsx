import GuideImage from "@assets/images/posture-guide-2x.png"
import { ReactElement } from "react"

const GuidePopup = ({ onClose }: { onClose: () => void }): ReactElement => {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-3xl backdrop-blur-lg">
      {/* blur 처리 */}
      <div className="pointer-events-auto relative w-[600px] rounded-lg bg-white p-8 shadow-lg">
        {/* 이미지로 대체된 가이드 부분 */}
        <div className="mb-8 flex justify-center">
          <img
            src={GuideImage} // 이미지 경로를 실제 경로로 수정하세요
            alt="바른자세 가이드"
            className="h-auto w-full" // 이미지 사이즈 조정
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button className="rounded-full bg-blue-500 px-4 py-2 text-white" onClick={onClose}>
            모니터링 시작하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuidePopup
