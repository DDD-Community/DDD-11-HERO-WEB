import CloseCrewPanelIcon from "@assets/images/posture-snapshot-guide.png"
import { ReactElement } from "react"
import ModalContainer from "../ModalContainer"

const GoodPostureGuidePopupModal = ({ onClose }: { onClose: () => void }): ReactElement => {
  return (
    <ModalContainer onClose={onClose} isMonitoring={true}>
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/25">
        {/* blur 처리 */}
        <div className="flex h-[472px] w-[800px] flex-col items-center rounded-lg bg-white pt-10 shadow-card">
          <div className="pb-6">
            <div className="text-[30px] font-bold text-[#1E2535]">바른 자세 가이드</div>
          </div>
          {/* content */}
          <div className="flex items-center gap-8 pb-6">
            <div className="flex h-[254px] w-[284px] flex-col items-center justify-end rounded-[17px] bg-[#EFEFF0]">
              <img src={CloseCrewPanelIcon} alt="스냅샷 가이드" />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 justify-center rounded-full bg-[#5A9CFF] text-center font-semibold text-white">
                  1
                </span>
                <span className="font-[20px] font-semibold text-zinc-800">머리와 목을 일직선으로 곧게 펴기</span>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 justify-center rounded-full bg-[#5A9CFF] text-center font-semibold text-white">
                  2
                </span>
                <span className="font-[20px] font-semibold text-zinc-800">양쪽 어깨 일직선 유지하기</span>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 justify-center rounded-full bg-[#5A9CFF] text-center font-semibold text-white">
                  3
                </span>
                <span className="font-[20px] font-semibold text-zinc-800">팔은 책상 위에 수평으로 두기</span>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 justify-center rounded-full bg-[#5A9CFF] text-center font-semibold text-white">
                  4
                </span>
                <span className="font-[20px] font-semibold text-zinc-800">등과 허리는 등받이에 지지하기</span>
              </div>
            </div>
          </div>
          <button className="w-[354px] rounded-full bg-[#1A75FF] py-3 text-white" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default GoodPostureGuidePopupModal
