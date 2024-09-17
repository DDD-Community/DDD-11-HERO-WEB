import { ModalProps } from "@/contexts/ModalsContext"
import ModalContainer from "@components/ModalContainer"

const ToWithdrawModal = (props: ModalProps): React.ReactElement => {
  const { onClose, onSubmit } = props

  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-12 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"크루 만들기 불가"}</div>
        </div>

        <div className="mb-[72px] flex w-full flex-col gap-9">
          <div className="whitespace-pre-line text-center text-[15px] font-normal text-zinc-900">
            {"이미 속한 크루가 있어 크루를 만들 수 없어요.\n 탈퇴 후, 크루를 만들어주세요."}
          </div>
        </div>

        {/* buttons */}
        <div className="flex gap-4">
          <button
            className="w-[256px] rounded-[40px] bg-zinc-100 px-10 py-3 text-base font-semibold text-zinc-500"
            onClick={onSubmit}
          >
            탈퇴하러 가기
          </button>
          <button
            className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default ToWithdrawModal
