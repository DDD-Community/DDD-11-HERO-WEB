import { ModalProps } from "@/contexts/ModalsContext"
import ModalContainer from "@components/ModalContainer"
import { useState } from "react"

const NickNameModal = (props: ModalProps & { id: string }): React.ReactElement => {
  const { onClose, onSubmit } = props
  const [nickName, setNickName] = useState("")

  const onClickModifyNickNameButton = () => {
    if (nickName && nickName.length <= 200) {
      onSubmit?.(nickName)
    }
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="flex items-center">
          <div className="text-xl font-bold text-zinc-900">닉네임</div>
        </div>

        <div className="flex w-full flex-col gap-1 pb-6 pt-10">
          <input
            className={`w-full rounded-xl border border-gray-200 p-3 font-normal focus:outline-none focus:ring-2 ${
              nickName.length > 200
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "focus:border-blue-500 focus:ring-blue-200"
            }`}
            placeholder="닉네임을 입력해 주세요."
            onChange={(e) => setNickName(e.target.value)}
          />
          <div className="mt-1 h-6">
            {nickName.length > 200 && (
              <span className={`text-[14px] font-semibold text-red-500 `}>닉네임은 200자를 초과할 수 없어요.</span>
            )}
          </div>
        </div>

        {/* button */}
        <div className="pb-10">
          <button
            className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white disabled:bg-zinc-300"
            onClick={onClickModifyNickNameButton}
            disabled={!nickName}
          >
            변경하기
          </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default NickNameModal
