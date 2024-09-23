import { ReactElement, useState } from "react"
import ServiceIntroduction from "./ServiceIntroduction"
import SnapshotGuide from "./SnapshotGuide"

const GuidePopupModal = ({ onClose }: { onClose: () => void }): ReactElement => {
  const [step, setStep] = useState(0)
  const onClickNext = () => {
    setStep(1)
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-3xl backdrop-blur-lg">
      {/* blur 처리 */}
      <div className="pointer-events-auto relative flex h-[504px] w-[800px] flex-col items-center rounded-lg bg-white p-8 shadow-lg">
        {step === 0 && (
          <>
            <ServiceIntroduction />
            <button
              className="h-[50px] w-[354px] rounded-full bg-[#1A75FF] px-[39px] py-3 text-white"
              onClick={onClickNext}
            >
              다음
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <SnapshotGuide />
            <button className="w-[354px] rounded-full bg-[#1A75FF] px-4 py-3 text-white" onClick={onClose}>
              모니터링 시작하기
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default GuidePopupModal
