import CrewRanking from "@/components/Crew/CrewRanking"
import MyCrewHeader from "@/components/Crew/MyCrew/MyCrewHeader"
import { useModals } from "@/hooks/useModals"
import useMyGroup from "@/hooks/useMyGroup"
import FlagIcon from "@assets/icons/crew-my-crew-header-flag.svg?react"
import CrewLeader from "@assets/icons/crew-my-crew-leader-icon.svg?react"
import SendInvitationIcon from "@assets/icons/crew-send-invitation.svg?react"
import CrewUserIcon from "@assets/icons/crew-user-icon.svg?react"
import NoRanksImage from "@/assets/images/mycrew-no-ranks.png"
import dayjs from "dayjs"
import { modals } from "@/components/Modal/Modals"
import { useNavigate } from "react-router-dom"
import { useCallback, useEffect } from "react"

export default function MyCrew() {
  const { myGroupData, ranks, myRank, withdrawFromGroup, isLoading } = useMyGroup()
  const { openModal } = useModals()
  const naviagte = useNavigate()

  const openCreateModal = (): void => {
    openModal(modals.withdrawCrewModal, {
      onSubmit: () => {
        if (myGroupData) {
          withdrawFromGroup()
            .then(() => {
              naviagte("/crew")
            })
            .catch(() => {
              alert(
                "존재하지 않는 크루이거나 이미 탈퇴된 상태 입니다. 다시 시도해주시거나, 고객센터에 문의해주시기 바랍니다."
              )
            })
        } else {
          alert(
            "존재하지 않는 크루이거나 이미 탈퇴된 상태 입니다. 다시 시도해주시거나, 고객센터에 문의해주시기 바랍니다."
          )
        }
      },
    })
  }

  useEffect(() => {
    if (!myGroupData && !isLoading) {
      naviagte("/crew")
    }
  }, [myGroupData, isLoading])

  const openInviteModal = useCallback((): void => {
    openModal(modals.inviteCrewModal, {
      id: Number(myGroupData?.id),
      onSubmit: () => {
        console.log("open")
      },
    })
  }, [myGroupData, openModal])

  return (
    <>
      <MyCrewHeader openCreateModal={() => {}} />
      {/* {!isLoading && ()} */}

      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <FlagIcon />
            <div className="text-xl font-bold text-zinc-800">{myGroupData?.name}</div>
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <CrewUserIcon />
            <span className="text-sm font-semibold text-zinc-500">
              {myGroupData?.userCount}/{myGroupData?.userCapacity}명
            </span>
          </div>
          <button className="rounded-full border-[1px] border-solid border-gray-200 bg-white" onClick={openInviteModal}>
            <div className="flex items-center gap-1 px-2 py-1">
              <SendInvitationIcon />
              <span className="text-sm font-medium text-zinc-400">초대하기</span>
            </div>
          </button>
        </div>
        <button
          className="rounded-full border-[1px] border-solid border-gray-200 bg-zinc-100"
          onClick={openCreateModal}
        >
          <div className="px-3 py-1">
            <span className="text-[15px] font-medium text-zinc-400">탈퇴하기</span>
          </div>
        </button>
      </div>

      {/* 크루 소개 */}
      <div className="mt-4 flex min-h-[220px] gap-4">
        <div className="flex w-[180px] flex-col items-center justify-between rounded-[10px] bg-zinc-800 px-[13px] pt-6">
          <div className="flex flex-col items-center">
            <span className="text-bold text-[13px] text-[#5A9CFF]">크루장</span>
            <span className="pt-6 text-lg font-bold text-zinc-50">{myGroupData?.ownerNickname}</span>
          </div>
          <CrewLeader />
        </div>
        <div className="flex flex-1 flex-col items-center gap-6 rounded-[10px] border-[1px] border-solid border-gray-200 bg-white px-[70px] py-6">
          <span className="font-[13px] font-bold text-[#1A75FF]">크루 소개</span>
          <p className="overflow-wrap-break-word w-full">{myGroupData?.description}</p>
        </div>
      </div>

      {/*  랭킹 헤더  */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-semibold text-zinc-700">바른자세 랭킹</span>
          <div className="flex gap-2 text-[13px] font-normal text-zinc-400">
            <span>최근 1시간</span>
            <span>|</span>
            <span>{dayjs().format("YYYY.MM.DD HH:mm")} 기준</span>
          </div>
        </div>
      </div>

      {/* 헤더 */}
      <div className="mt-6 h-[280px] w-full rounded-[12px] border-[1px] border-solid border-gray-200 bg-white px-8 py-[30px]">
        {/*  랭킹 표시  */}
        <div className="h-[220px]">
          {ranks.length > 0 && myRank ? (
            <CrewRanking rankings={ranks} myRank={myRank} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex w-fit flex-col items-center gap-2">
                <img src={NoRanksImage} />
                <div>표시할 랭킹이 없습니다.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="height-[68px] mt-3 flex justify-center rounded-[12px] border-[1px] border-solid border-gray-200 bg-white py-6 font-medium">
        나는 우리 크루 평균보다 틀어짐이&nbsp; <span className="font-bold text-[#1A75FF]">6회 더</span>
        &nbsp;감지되었어요.
      </div>
    </>
  )
}
