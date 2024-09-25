import SendInvitationIcon from "@assets/icons/crew-send-invitation.svg?react"
import CrewUserIcon from "@assets/icons/crew-user-icon.svg?react"
import { Link } from "react-router-dom"
import CrewRanking from "../CrewRanking"

import RoutePath from "@/constants/routes.json"
import MyCrewHeader from "./MyCrewHeader"
import { groupUserRank, MyGroupData } from "@/api"
import dayjs from "dayjs"
import NoRanksImage from "@/assets/images/mycrew-no-ranks.png"

interface MyCrewRankingContainerProps {
  myGroupData: MyGroupData
  ranks: groupUserRank[]
  myRank: groupUserRank | undefined
  openCreateModal: () => void
  openInviteModal: () => void
}

export default function MyCrewRankingContainer(props: MyCrewRankingContainerProps) {
  const { myGroupData, ranks, myRank, openCreateModal, openInviteModal } = props
  return (
    <div className="mb-12">
      <MyCrewHeader openCreateModal={openCreateModal} />
      <div className="h-[382px] w-full rounded-[12px] bg-white px-8 pt-9">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">{myGroupData.name}</div>
            <div className="flex items-center gap-1">
              <CrewUserIcon />
              <span className="text-sm font-medium text-zinc-500">
                {myGroupData.userCount}/{myGroupData.userCapacity}명
              </span>
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
              <span>{dayjs().format("YYYY.MM.DD HH:mm")} 기준</span>
            </div>
          </div>
        </div>

        {/*  랭킹 표시  */}
        <div className="mt-4">
          {ranks.length > 0 && myRank ? (
            <CrewRanking rankings={ranks} myRank={myRank} />
          ) : (
            <div className="flex justify-center">
              <div className="flex w-fit flex-col items-center gap-2">
                <img src={NoRanksImage} />
                <div>표시할 랭킹이 없습니다.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
