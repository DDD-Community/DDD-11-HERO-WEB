import Modal from "@components/Modal"

interface CreateCrewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const InviteCrewModal = (props: CreateCrewModalProps): React.ReactElement => {
  const { isOpen, onClose, onSubmit } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-3 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"초대하기"}</div>
        </div>

        <div className="mb-12 flex w-full flex-col gap-9">
          <div className="text-center text-[15px] font-normal text-zinc-900">
            아래 초대 링크를 복사해 크루에 초대해 보세요.
          </div>
          <div className={"w-full rounded-xl border border-gray-200 p-3 font-normal"}>{"https://alignlab.site/"}</div>
        </div>

        {/* button */}
        <button
          className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
          onClick={onSubmit}
        >
          초대 링크 복사하기
        </button>
      </div>
    </Modal>
  )
}

export default InviteCrewModal
