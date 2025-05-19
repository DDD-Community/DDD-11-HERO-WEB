import { ModalProps } from "@/contexts/ModalsContext"
import ModalContainer from "@components/ModalContainer"

const ToSignUpModal = (props: ModalProps): React.ReactElement => {
  const { onClose, onSubmit } = props

  return (
    <ModalContainer onClose={onClose} isMonitoring={true}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-12 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"자세공작소 계속 사용해보기"}</div>
        </div>

        <div className="mb-[72px] flex w-full flex-col gap-9">
          <div className="whitespace-pre-line text-center text-[15px] font-normal text-zinc-900">
            {"간단하게 회원가입 후 이용을 시작하세요!"}
          </div>
        </div>

        {/* buttons */}
        <div className="flex gap-4">
          <button
            className="w-[256px] rounded-[40px] bg-zinc-100 px-10 py-3 text-base font-semibold text-zinc-500"
            onClick={onClose}
          >
            아니요, 체험만 할게요
          </button>
          <button
            className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
            onClick={(e) => {
              e.preventDefault()
              onSubmit?.()
            }}
          >
            카카오톡으로 계속하기
          </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default ToSignUpModal
