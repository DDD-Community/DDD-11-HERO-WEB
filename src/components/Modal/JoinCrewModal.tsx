import ModalContainer from "@components/ModalContainer"
import CrewJoinUserIcon from "@assets/icons/crew-join-user-icon.svg?react"
import PrivateCrewIcon from "@assets/icons/crew-private-icon.svg?react"
import { useState } from "react"
import { ModalProps } from "@/contexts/ModalsContext"

const JoinCrewModal = (props: ModalProps): React.ReactElement => {
  const { onClose, onSubmit } = props

  const [joinCode, setJoinCode] = useState<string>("")
  const [isCodeError, setIsCodeError] = useState<boolean>(false)

  const onChangeJoinCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isCodeError) setIsCodeError(false)
    if (e.target.value.length <= 4) setJoinCode(e.target.value)
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="flex w-full flex-col items-center">
        {/* header */}
        <div className="mb-[40px] flex w-full items-center gap-[16px]">
          <div className="flex items-center gap-1.5">
            <PrivateCrewIcon />
            <div className="text-xl font-bold text-zinc-900">{"주인공 다 모여랏"}</div>
          </div>

          <div className="flex items-center gap-1">
            <CrewJoinUserIcon />
            <div className="text-sm font-medium">7/30명</div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[20px]">
          {/* crew owner */}
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold">크루장</div>
            <div className="rounded-xl border border-gray-200 bg-zinc-100 p-[12px] text-[15px] font-normal text-zinc-900">
              주인공
            </div>
          </div>

          {/* crew description */}
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold">크루소개</div>
            <div className="h-[80px] overflow-scroll rounded-xl border border-gray-200 bg-zinc-100 p-[12px] text-[15px] font-normal text-zinc-900">
              주인공
            </div>
          </div>

          {/* crew rank */}
          <div className="mb-6 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-semibold">오늘 바른자세 랭킹</div>
              <div className="text-[14px] font-medium text-[#1A75FF]">크루에 가입하면 볼 수 있어요</div>
            </div>
            <div className="flex gap-[7px]">
              <div className="flex h-[108px] w-[106px] flex-col items-center justify-center  rounded-xl border border-gray-200 p-3">
                <div className="mb-2 text-sm font-semibold text-zinc-700">1등</div>
                <div className="mb-1 text-lg font-semibold text-zinc-700">?</div>
                <div className="text-base text-zinc-500">29일</div>
              </div>
            </div>
          </div>
        </div>

        {/* private crew */}
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

        {/* button */}
        <button
          className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
          onClick={onSubmit}
        >
          크루 가입하기
        </button>
      </div>
    </ModalContainer>
  )
}

export default JoinCrewModal
