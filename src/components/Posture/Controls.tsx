import PostureCheckIcon from "@assets/icons/good-posture-check-button-icon.svg?react"
import GuideIcon from "@assets/icons/posture-guide-button-icon.svg?react"
import { Button } from "../common/Button"

const Controls: React.FC<{
  getInitSnap: () => void
  handleShowPopup: () => void
}> = ({ getInitSnap, handleShowPopup }) => {
  return (
    <div className="absolute bottom-0 flex w-full items-center justify-center gap-[16px] p-[50px] text-white">
      <Button variant="solid_white" onClick={handleShowPopup}>
        <GuideIcon />
        가이드 다시보기
      </Button>
      <Button onClick={getInitSnap}>
        <PostureCheckIcon />
        스냅샷 촬영하기
      </Button>
    </div>
  )
}

export default Controls
