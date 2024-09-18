import ModalContainer from "@components/ModalContainer"
import CrewJoinUserIcon from "@assets/icons/crew-join-user-icon.svg?react"
import PrivateCrewIcon from "@assets/icons/crew-private-icon.svg?react"
import { ReactNode, useState } from "react"
import { ModalProps } from "@/contexts/ModalsContext"
import { useGetGroup, useJoinGroup } from "@/hooks/useGroupMutation"
import { groupJoinReq } from "@/api"
import useMyGroup from "@/hooks/useMyGroup"
import { AxiosError } from "axios"

const JoinCrewModal = (props: ModalProps): React.ReactElement => {
  const { onClose, onSubmit, id } = props
  const { myGroupData } = useMyGroup()
  const [joinCode, setJoinCode] = useState<string>("")
  const [isCodeError, setIsCodeError] = useState<boolean>(false)

  const { data, isLoading, isError } = useGetGroup(id)
  const joinGroupMutation = useJoinGroup()

  const onChangeJoinCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isCodeError) setIsCodeError(false)

    const { value } = e.target
    // 숫자만 남기고 업데이트
    if (/^\d*$/.test(value)) {
      if (value.length <= 4) setJoinCode(value)
    }
  }

  const handleSubmit = (): void => {
    if (!data?.id) return
    let groupJoinReq: groupJoinReq = { groupId: data.id }
    if (data?.isHidden) groupJoinReq = { ...groupJoinReq, joinCode }
    joinGroupMutation.mutate(groupJoinReq, {
      onSuccess: (): void => {
        if (onSubmit && typeof onSubmit === "function") onSubmit()
      },
      onError: (e): void => {
        const { response } = e as AxiosError
        const data = response?.data as { errorCode: string; reason: string }
        if (data.errorCode === "IMPOSSIBLE_TO_JOIN_GROUP_ERROR") setIsCodeError(true)
      },
    })
  }

  const createRank = (): ReactNode => {
    if (!data?.ranks) return
    if (data.ranks.length === 0) return
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="text-[15px] font-semibold">오늘 바른자세 랭킹</div>
          <div className="text-[14px] font-medium text-[#1A75FF]">크루에 가입하면 볼 수 있어요</div>
        </div>
        <div className="flex gap-[7px]">
          <div className="flex gap-[7px]">
            {data?.ranks.map((r, i) => (
              <div
                key={`join-modal-rank-${i}`}
                className="flex h-[108px] w-[106px] flex-col items-center justify-center  rounded-xl border border-gray-200 p-3"
              >
                <div className="mb-2 text-sm font-semibold text-zinc-700">{`${r.rank}등`}</div>
                <div className="mb-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-zinc-700">{`${r.name}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ModalContainer onClose={onClose}>
      {isLoading ? (
        "로딩 중입니다."
      ) : isError ? (
        "데이터를 불러오지 못했습니다."
      ) : (
        <div className="flex w-full flex-col items-center">
          {/* header */}
          <div className="mb-[40px] flex w-full items-center gap-[16px]">
            <div className="flex items-center gap-1.5">
              {data?.isHidden && <PrivateCrewIcon />}
              <div className="text-xl font-bold text-zinc-900">{data?.name}</div>
            </div>

            <div className="flex items-center gap-1">
              <CrewJoinUserIcon />
              <div className="text-sm font-medium">{`${data?.userCount}/${data?.userCapacity}명`}</div>
            </div>
          </div>
          {!data?.isHidden ? (
            <div className="mb-6 flex w-full flex-col gap-[20px]">
              {/* crew owner */}
              <div className="flex flex-col gap-1">
                <div className="text-[15px] font-semibold">크루장</div>
                <div className="rounded-xl border border-gray-200 bg-zinc-100 p-[12px] text-[15px] font-normal text-zinc-900">
                  {data?.ownerName}
                </div>
              </div>

              {/* crew description */}
              <div className="flex flex-col gap-1">
                <div className="text-[15px] font-semibold">크루소개</div>
                <div className="h-[80px] overflow-scroll rounded-xl border border-gray-200 bg-zinc-100 p-[12px] text-[15px] font-normal text-zinc-900">
                  {data?.description}
                </div>
              </div>

              {/* crew rank */}
              {createRank()}
            </div>
          ) : (
            // private crew
            <div className="mb-6 flex w-full flex-col gap-1">
              <div className="text-[15px] font-semibold">비공개 크루입니다. 비밀번호를 입력해주세요. (숫자 4자리)</div>
              <input
                type="password"
                className={`w-full rounded-xl border border-gray-200 p-3 text-[15px] outline-none ${
                  isCodeError ? "border-red-500" : "border-gray-200"
                }`}
                value={joinCode}
                onChange={onChangeJoinCode}
              />
              <div className={`text-sm font-semibold text-red-500 ${isCodeError ? "opacity-100" : "opacity-0"}`}>
                비밀번호가 틀렸습니다.
              </div>
            </div>
          )}

          {/* button */}
          <button
            className={`w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white ${
              myGroupData ? "bg-zinc-300" : "bg-[#1A75FF]"
            }`}
            onClick={handleSubmit}
            disabled={!!myGroupData}
          >
            크루 가입하기
          </button>
          {myGroupData && (
            <div className="mt-3 text-sm font-medium text-red-500 ">1개의 크루에만 가입할 수 있어요.</div>
          )}
        </div>
      )}
    </ModalContainer>
  )
}

export default JoinCrewModal
