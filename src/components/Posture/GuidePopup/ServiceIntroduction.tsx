export default function ServiceIntroduction() {
  return (
    <>
      <div className="mb-8 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-[#1A75FF]"></div>
        <div className="h-2 w-2 rounded-full bg-zinc-300"></div>
      </div>
      <div className="mb-6">
        <div className="mb-3 text-center text-[30px] font-bold leading-10 text-[#1E2535]">
          자세공작소는 실시간 모니터링으로 <br />
          바른 자세 유지를 돕는 서비스입니다
        </div>
        <span className="text-[14px] font-normal text-zinc-500">
          더 세밀한 모니터링을 위해, 최초 1회 자세 기준점 설정이 필요합니다.
        </span>
      </div>
      {/* content */}
      <div className="mb-8 flex gap-4">
        <div className="flex w-80 flex-col items-center rounded-[17px] bg-[#EFEFF0] px-10 py-6">
          <div className="mb-4 h-[24px] w-[24px] rounded-full bg-[#5A9CFF] text-center text-[15px] font-semibold text-white">
            1
          </div>
          <span className="mb-2 text-[20px] font-semibold text-[#1E2535]">바른 자세 취하기</span>
          <div className="text-center font-normal leading-6 text-zinc-500">
            가이드에 따라 <br />
            바른 자세를 취해 주세요.
          </div>
        </div>
        <div className="flex w-80 flex-col items-center rounded-[17px] bg-[#EFEFF0] px-10 py-6">
          <div className="mb-4 h-[24px] w-[24px] rounded-full bg-[#5A9CFF] text-center text-[15px] font-semibold text-white">
            2
          </div>
          <span className="mb-2 text-[20px] font-semibold text-[#1E2535]">스냅샷 촬영하기</span>
          <div className="text-center font-normal leading-6 text-zinc-500">
            기준점 설정을 위해 <br />
            촬영을 진행해 주세요.
          </div>
        </div>
      </div>
    </>
  )
}
