import ModalContainer from "@components/ModalContainer"
import CheckedIcon from "@assets/icons/crew-checked-icon.svg?react"
import UnCheckedIcon from "@assets/icons/crew-unckecked-icon.svg?react"
import { useState } from "react"
import { ModalProps } from "@/contexts/ModalsContext"
import { useCheckGroupName, useCreateGroup } from "@/hooks/useGroupMutation"
import { group } from "@/api"

type TPossible = "POSSIBLE" | "IMPOSSIBLE" | "NONCHECKED"

const CreateCrewModal = (props: ModalProps): React.ReactElement => {
  const { onClose, onSubmit } = props

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const [joinCode, setJoinCode] = useState<string>("")
  const [isPossible, setIsPossible] = useState<TPossible | null>(null)

  const checkGroupNameMutation = useCheckGroupName()
  const createGroupMutation = useCreateGroup()

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
    setIsPossible(null)
  }

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (e.target.value.length <= 300) setDescription(e.target.value)
  }

  // Enter 키 입력을 막는 함수
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault() // Enter 키 입력 방지
    }
  }

  const onChangeJoinCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    // 숫자만 남기고 업데이트
    if (/^\d*$/.test(value)) {
      if (value.length <= 4) setJoinCode(value)
    }
  }

  const onCheckIsHidden = (): void => {
    setIsHidden(!isHidden)
    setJoinCode("")
  }

  const onCheckGroupName = async (): Promise<void> => {
    const _isPossible = await checkGroupNameMutation.mutateAsync(name)
    setIsPossible(_isPossible ? "POSSIBLE" : "IMPOSSIBLE")
  }

  const getNameCheckedMsg = (_isPossible: TPossible | null): string => {
    if (_isPossible === "POSSIBLE") return "사용가능한 크루명입니다."
    if (_isPossible === "IMPOSSIBLE") return "이미 사용중인 크루명이에요. 다른 크루명을 사용해주세요."
    if (_isPossible === "NONCHECKED") return "중복체크를 해주세요."
    return ""
  }

  const canCreate = (): string | boolean => {
    return name && description && ((isHidden && joinCode.length === 4) || !isHidden)
  }

  const handleSubmit = (): void => {
    if (isPossible === null) {
      setIsPossible("NONCHECKED")
      return
    }
    if (isPossible === "NONCHECKED") return

    let newGroup: group = { name, description }
    if (isHidden) newGroup = { ...newGroup, joinCode, isHidden }
    createGroupMutation.mutate(newGroup, {
      onSuccess: (): void => {
        if (onSubmit && typeof onSubmit === "function") onSubmit()
      },
    })
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"크루 만들기"}</div>
        </div>

        <div className="mb-6 flex w-full flex-col text-[15px]">
          {/* crew owner */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="font-semibold text-[#1A75FF]">크루명</div>
            <div className="mb-1 flex gap-4">
              <input
                type="text"
                className={`w-full rounded-xl border border-gray-200 px-3 py-2 outline-none ${
                  isPossible === "IMPOSSIBLE" || isPossible === "NONCHECKED" ? "border-red-500" : "border-gray-200"
                }`}
                value={name}
                onChange={onChangeName}
                placeholder="크루명을 입력해주세요."
              />
              <button
                className={`h-[44px] w-[116px] rounded-[33px] px-[22px] py-1.5 text-sm font-semibold text-white ${
                  name.length === 0 || isPossible === "POSSIBLE" ? "bg-gray-200" : "bg-[#1A75FF]"
                }`}
                onClick={onCheckGroupName}
                disabled={name.length === 0 || isPossible === "POSSIBLE"}
              >
                중복체크
              </button>
            </div>
            <div
              className={`h-[24px] text-sm font-semibold ${
                isPossible === "POSSIBLE" ? "text-[#1A75FF]" : "text-red-500"
              }`}
            >
              {getNameCheckedMsg(isPossible)}
            </div>
          </div>

          {/* crew description */}
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold text-[#1A75FF]">크루 소개</div>
            <div>
              <textarea
                className={`h-[140px] w-full resize-none rounded-xl border border-gray-200 p-3 outline-none`}
                value={description}
                onChange={onChangeDescription}
                onKeyDown={handleKeyPress}
                placeholder="크루 소개를 작성해주세요."
              />
              <div className="text-end text-[13px] text-zinc-400">{`${description.length}/300`}</div>
            </div>
          </div>

          {/* crew private */}
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold text-[#1A75FF]">공개여부 설정</div>
            <div className="flex gap-4">
              <div className="flex flex-none cursor-pointer items-center gap-2" onClick={onCheckIsHidden}>
                {isHidden ? <CheckedIcon /> : <UnCheckedIcon />}
                <div className="text-[15px] font-normal text-zinc-900">비공개 크루</div>
              </div>
              <input
                type="text"
                className={`w-full rounded-xl border border-gray-200 px-3 py-2 outline-none ${
                  !isHidden ? "bg-zinc-100" : ""
                }`}
                value={joinCode}
                onChange={onChangeJoinCode}
                placeholder="비밀번호를 입력해주세요. (4자리 숫자)"
                disabled={!isHidden}
              />
            </div>
          </div>
        </div>

        {/* button */}
        <button
          className={`w-[256px] rounded-[40px] px-10 py-3 text-base font-semibold text-white ${
            canCreate() ? "bg-[#1A75FF]" : "bg-gray-200"
          }`}
          onClick={handleSubmit}
          disabled={!canCreate()}
        >
          크루 만들기
        </button>
      </div>
    </ModalContainer>
  )
}

export default CreateCrewModal
