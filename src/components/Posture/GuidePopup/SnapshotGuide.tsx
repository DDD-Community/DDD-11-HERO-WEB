import CloseCrewPanelIcon from "@assets/images/posture-snapshot-guide.png"

export default function SnapshotGuide() {
  return (
    <>
      <div className="mb-8 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-zinc-300"></div>
        <div className="h-2 w-2 rounded-full bg-align_blue-500"></div>
      </div>
      <div className="mb-6">
        <div className="text-center text-title font-bold">바른 자세를 취해주세요</div>
      </div>
      {/* content */}
      <div className="mb-6 flex items-center gap-8">
        <div className="flex h-[254px] w-[284px] flex-col items-center justify-end rounded-[17px] bg-[#EFEFF0]">
          <img src={CloseCrewPanelIcon} alt="스냅샷 가이드" />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 justify-center rounded-full bg-align_blue-300 text-center font-semibold text-white">
              1
            </span>
            <span className="font-title font-semibold text-zinc-800">머리와 목을 일직선으로 곧게 펴기</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 justify-center rounded-full bg-align_blue-300 text-center font-semibold text-white">
              2
            </span>
            <span className="font-title font-semibold text-zinc-800">양쪽 어깨 일직선 유지하기</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 justify-center rounded-full bg-align_blue-300 text-center font-semibold text-white">
              3
            </span>
            <span className="font-title font-semibold text-zinc-800">팔은 책상 위에 수평으로 두기</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 justify-center rounded-full bg-align_blue-300 text-center font-semibold text-white">
              4
            </span>
            <span className="font-title font-semibold text-zinc-800">등과 허리는 등받이에 지지하기</span>
          </div>
        </div>
      </div>
    </>
  )
}
