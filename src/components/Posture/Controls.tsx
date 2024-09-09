import PostureCheckIcon from "@assets/icons/good-posture-check-button-icon.svg?react"
import GuideIcon from "@assets/icons/posture-guide-button-icon.svg?react"

const Controls: React.FC<{
  isSnapSaved: boolean
  hasPermission: boolean
  getInitSnap: () => void
  clearSnap: () => void
  handleShowPopup: () => void
}> = ({ isSnapSaved, getInitSnap, clearSnap, handleShowPopup, hasPermission }) => {
  return !hasPermission ? null : (
    <div className="absolute bottom-0 flex w-full items-center justify-center gap-[16px] p-[50px] text-white">
      {!isSnapSaved ? (
        <>
          <button
            className="flex w-[260px] items-center justify-center rounded rounded-full bg-white bg-opacity-80 px-10 py-3 font-semibold leading-[32px] text-zinc-900"
            onClick={handleShowPopup}
          >
            <div className="flex flex-row items-center gap-2">
              <GuideIcon />
              <span>가이드 다시 볼게요!</span>
            </div>
          </button>
          <button
            className="flex w-[260px] items-center justify-center rounded rounded-full bg-[#1A75FF] bg-opacity-80 px-10 py-3 font-semibold leading-[32px] text-white"
            onClick={getInitSnap}
          >
            <div className="flex flex-row items-center gap-2">
              <PostureCheckIcon />
              바른자세를 취했어요!
            </div>
          </button>
        </>
      ) : (
        <button
          className="flex w-[260px] items-center justify-center rounded rounded-full bg-[#1A75FF] bg-opacity-80 p-[20px] text-white"
          onClick={clearSnap}
        >
          <div className="flex flex-row items-center gap-2">
            <PostureCheckIcon />
            스냅샷 다시찍기
          </div>
        </button>
      )}
    </div>
  )
}

export default Controls
