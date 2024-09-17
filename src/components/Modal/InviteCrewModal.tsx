import { ModalProps } from "@/contexts/ModalsContext"
import ModalContainer from "@components/ModalContainer"
import { useState } from "react"
import RoutePath from "@/constants/routes.json"

const InviteCrewModal = (props: ModalProps & { id: string }): React.ReactElement => {
  const { onClose, id } = props
  const [isCopied, setIsCopied] = useState(false)

  // 현재 URL을 기반으로 초대 링크 생성
  const currentUrl = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }${RoutePath.CREW}?groupId=${id}`

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setIsCopied(true)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-3 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">{"초대하기"}</div>
        </div>

        <div className="mb-12 flex w-full flex-col gap-9">
          <div className="text-center text-[15px] font-normal text-zinc-900">
            아래 초대 링크를 복사해 크루에 초대해 보세요.
          </div>
          <div className={"w-full rounded-xl border border-gray-200 p-3 font-normal"}>{currentUrl}</div>
        </div>

        {/* button */}
        <button
          className="w-[256px] rounded-[40px] bg-[#1A75FF] px-10 py-3 text-base font-semibold text-white"
          onClick={handleCopy}
        >
          초대 링크 복사하기
        </button>
        {isCopied && <div className="mt-3 text-sm font-medium text-[#1A75FF]">초대 링크가 복사되었어요.</div>}
      </div>
    </ModalContainer>
  )
}

export default InviteCrewModal
