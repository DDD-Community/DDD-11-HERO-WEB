import Modal from "@components/Modal"

interface CreateCrewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const WithdrawCrewModal = (props: CreateCrewModalProps): React.ReactElement => {
  const { isOpen, onClose, onSubmit } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-12 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"탈퇴하기"}</div>
        </div>

        <div className="mb-[72px] flex w-full flex-col gap-9">
          <div className="text-center text-[15px] font-normal text-zinc-900">정말 크루를 탈퇴하시겠어요?</div>
        </div>

        {/* buttons */}
        <div className="flex gap-4">
          <button
            className="w-[256px] rounded-[40px] bg-zinc-100 px-10 py-3 text-base font-semibold text-zinc-500"
            onClick={onSubmit}
          >
            네, 탈퇴할게요
          </button>
          <button
            className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default WithdrawCrewModal
