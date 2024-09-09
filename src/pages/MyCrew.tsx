import CrewRanking from "@/components/Crew/CrewRanking"
import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"
import FlagIcon from "@assets/icons/crew-my-crew-header-flag.svg?react"
import SendInvitationIcon from "@assets/icons/crew-send-invitation.svg?react"
import CrewUserIcon from "@assets/icons/crew-user-icon.svg?react"

export default function MyCrew() {
  return (
    <div className="mb-12">
      <div className="mb-[24px] flex w-full items-center">
        <div className="flex-grow text-[22px] font-bold text-zinc-900">나의 크루</div>
        <div
          className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
          // onClick={openCreateModal}
        >
          <CreateCrewIcon />
          <div>크루 만들기</div>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <FlagIcon />
            <div className="text-xl font-bold text-zinc-800">주인공 다 모여랏</div>
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <CrewUserIcon />
            <span className="text-sm font-semibold text-zinc-500">7/30명</span>
          </div>
          <button className="rounded-full border-[1px] border-solid border-gray-200 bg-white">
            <div className="flex items-center gap-1 px-2 py-1">
              <SendInvitationIcon />
              <span className="text-sm font-medium text-zinc-400">초대하기</span>
            </div>
          </button>
        </div>
        <button className="rounded-full border-[1px] border-solid border-gray-200 bg-zinc-100">
          <div className="px-3 py-1">
            <span className="text-[15px] font-medium text-zinc-400">탈퇴하기</span>
          </div>
        </button>
      </div>

      {/* 크루 소개 */}
      <div className="mt-4 flex min-h-[220px] gap-4">
        <div className="flex w-[180px] flex-col items-center rounded-[10px] bg-zinc-800 pt-6">
          <span className="text-bold text-[13px] text-[#5A9CFF]">크루장</span>
          <span className="pt-6 text-lg font-bold text-zinc-50">꼬북이</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-6 rounded-[10px] border-[1px] border-solid border-gray-200 bg-white px-[70px] py-6">
          <span className="font-[13px] font-bold text-[#1A75FF]">크루 소개</span>
          <p className="overflow-wrap-break-word w-full">
            안녕하세요. 자세공작소의 크루 주인공 다 모여랏 입니다. 저희 크루는 PM, 디자이너, 개발자로 이루어져 있습니다.
            최대 300자 입니다.안녕하세요. 자세공작소의 크루 주인공 다 모여랏 입니다. 저희 크루는 PM, 디자이너, 개발자로
            이루어져 있습니다. 최대 300자 입니다.안녕하세요. 자세공작소의 크루 주인공 다 모여랏 입니다. 저희 크루는 PM,
            디자이너, 개발자로 이루어져 있습니다. 최대 300자 입니다.안녕하세요. 자세공작소의 크루 주인공 다 모여랏
            입니다. 저희 크루는 PM, 디자이너, 개발자로 이루어져 있습니다.
          </p>
        </div>
      </div>

      {/*  랭킹 헤더  */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-zinc-700">바른자세 랭킹</span>
          <div className="flex gap-2 text-[13px] font-normal text-zinc-400">
            <span>최근 1시간</span>
            <span>|</span>
            <span>2024.08.20 21:00 기준</span>
          </div>
        </div>
      </div>

      {/* 헤더 */}
      <div className="mt-6 h-[280px] w-full rounded-[12px] border-[1px] border-solid border-gray-200 bg-white px-8 py-[30px]">
        {/*  랭킹 표시  */}
        <div className="h-[220px]">
          <CrewRanking
            rankings={[
              { rank: 1, name: "뚝딱이", score: 1 },
              { rank: 2, name: "뚝딱이2", score: 5 },
              { rank: 3, name: "뚝딱이3", score: 10 },
              { rank: 4, name: "뚝딱이4", score: 11 },
              { rank: 5, name: "뚝딱이4", score: 11 },
              { rank: 6, name: "뚝딱이4", score: 16 },
              { rank: 7, name: "뚝딱이4", score: 17 },
              { rank: 8, name: "뚝딱이4", score: 22 },
              { rank: 9, name: "뚝딱이4", score: 26 },
              { rank: 10, name: "뚝딱이4", score: 32 },
              { rank: 11, name: "뚝딱이4", score: 40 },
              // ... more rankings
            ]}
            myRank={{ rank: 12, name: "나", score: 50 }}
          />
        </div>
      </div>

      {/* footer */}
      <div className="height-[68px] mt-3 flex justify-center rounded-[12px] border-[1px] border-solid border-gray-200 bg-white py-6 font-medium">
        나는 우리 크루 평균보다 틀어짐이&nbsp; <span className="font-bold text-[#1A75FF]">6회 더</span>
        &nbsp;감지되었어요.
      </div>
    </div>
  )
}
