import Modal from "@components/Modal"
import CheckedIcon from "@assets/icons/crew-checked-icon.svg?react"
import UnCheckedIcon from "@assets/icons/crew-unckecked-icon.svg?react"
import { useState } from "react"

interface CreateCrewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const CreateCrewModal = (props: CreateCrewModalProps): React.ReactElement => {
  const { isOpen, onClose, onSubmit } = props

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const [joinCode, setJoinCode] = useState<string>("")

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"크루 만들기"}</div>
        </div>

        <div className="mb-6 flex w-full flex-col gap-5 text-[15px]">
          {/* crew owner */}
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-[#1A75FF]">크루명</div>
            <div className="flex gap-4">
              <input
                type="text"
                className={`w-full rounded-xl border border-gray-200 px-3 py-2 outline-none`}
                value={name}
                onChange={onChangeName}
                placeholder="크루명을 입력해주세요."
              />
              <button className="h-[44px] w-[116px] rounded-[33px] bg-[#1A75FF] px-[22px] py-1.5 text-sm font-semibold text-white">
                중복체크
              </button>
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
          className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
          onClick={onSubmit}
        >
          크루 만들기
        </button>
      </div>
    </Modal>
  )
}

export default CreateCrewModal
