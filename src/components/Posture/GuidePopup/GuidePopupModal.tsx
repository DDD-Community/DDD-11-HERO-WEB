import { ReactElement, useState } from "react"
import ServiceIntroduction from "./ServiceIntroduction"
import SnapshotGuide from "./SnapshotGuide"
import { Button } from "@/components/common/Button"

const GuidePopupModal = ({ onClose }: { onClose: () => void }): ReactElement => {
  const [step, setStep] = useState(0)
  const onClickNext = () => {
    setStep(1)
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-3xl backdrop-blur-lg">
      {/* blur 처리 */}
      <div className="pointer-events-auto relative flex h-[510px] w-[800px] flex-col items-center rounded-lg bg-white p-8 shadow-card">
        {step === 0 && (
          <>
            <ServiceIntroduction />
            <div className="w-[354px]">
              <Button onClick={onClickNext} fullWidth>
                다음
              </Button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <SnapshotGuide />
            <div className="w-[354px]">
              <Button onClick={onClose} fullWidth>
                모니터링 시작하기
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GuidePopupModal
