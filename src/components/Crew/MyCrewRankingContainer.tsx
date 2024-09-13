import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"
import SendInvitationIcon from "@assets/icons/crew-send-invitation.svg?react"
import CrewUserIcon from "@assets/icons/crew-user-icon.svg?react"
import { Link } from "react-router-dom"
import CrewRanking from "./CrewRanking"

import RoutePath from "@/constants/routes.json"

interface MyCrewRankingContainerProps {
  openCreateModal: () => void
  openInviteModal: () => void
}

export default function MyCrewRankingContainer(props: MyCrewRankingContainerProps) {
  const { openCreateModal, openInviteModal } = props
  return (
    <div className="mb-12">
      <div className="mb-[24px] flex w-full items-center">
        <div className="flex-grow text-[22px] font-bold text-zinc-900">나의 크루</div>
        <div
          className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
          onClick={openCreateModal}
        >
          <CreateCrewIcon />
          <div>크루 만들기</div>
        </div>
      </div>
      <div className="h-[382px] w-full rounded-[12px] bg-white px-8 pt-9">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">주인공 다 모여랏</div>
            <div className="flex items-center gap-1">
              <CrewUserIcon />
              <span className="text-sm font-medium text-zinc-500">7/30명</span>
            </div>
            <button
              className="rounded-full border-[1px] border-solid border-gray-200 bg-white"
              onClick={openInviteModal}
            >
              <div className="flex items-center gap-1 px-2 py-1">
                <SendInvitationIcon />
                <span className="text-sm font-medium text-zinc-400">초대하기</span>
              </div>
            </button>
          </div>
          <Link to={RoutePath.MYCREW}>
            <div className="text-sm font-medium text-[#1A75FF]">상세보기 {">"}</div>
          </Link>
        </div>
        {/*  랭킹 헤더  */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-[#1A75FF]">바른자세 랭킹</span>
            <div className="flex gap-2 text-[13px] font-normal text-zinc-400">
              <span>최근 1시간</span>
              <span>|</span>
              <span>2024.08.20 21:00 기준</span>
            </div>
          </div>
        </div>

        {/*  랭킹 표시  */}
        <div className="mt-4 h-[220px]">
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
    </div>
  )
}
