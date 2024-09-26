import { requestSendReportAPI } from "@/api"
import { ModalProps } from "@/contexts/ModalsContext"
import ModalContainer from "@components/ModalContainer"
import { useState } from "react"

const ReportModal = (props: ModalProps): React.ReactElement => {
  const { onClose, onSubmit } = props

  const [title, setTitle] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [description, setDescription] = useState<string>("")

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value)
  }

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (e.target.value.length <= 500) setDescription(e.target.value)
  }

  const isValidForm = (): boolean => {
    return Boolean(title.trim() && email.trim() && description.trim()) && isValidEmail
  }

  const handleSubmit = (): void => {
    if (!isValidForm()) {
      return
    }

    requestSendReportAPI({
      title,
      email,
      content: description,
    }).then(() => {
      if (onSubmit && typeof onSubmit === "function") onSubmit()
    })
  }

  const onChangeEmail = (event: any) => {
    setEmail(event.target.value.trim())

    const emailRegex = /^[\w-\.]+@([\w-]+)\.?([\w-]+)\.+[\w-]{2,4}$/
    const validEmail = emailRegex.test(event.target.value)
    setIsValidEmail(validEmail)
  }

  return (
    <ModalContainer onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="text-xl font-bold text-zinc-900">의견 보내기</div>
        </div>

        <div className="mb-6 flex w-full flex-col text-[15px]">
          {/* crew owner */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="font-semibold text-[#1A75FF]">제목</div>
            <div className="mb-1 flex gap-4">
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 border-gray-200 px-3 py-2 outline-none"
                value={title}
                onChange={onChangeName}
                placeholder="의견 제목을 입력해주세요."
              />
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-1">
            <div className="font-semibold text-[#1A75FF]">이메일</div>
            <div className="mb-1 flex gap-4">
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 border-gray-200 px-3 py-2 outline-none"
                value={email}
                onChange={onChangeEmail}
                placeholder="이메일을 입력해주세요."
              />
            </div>
            {email && !isValidEmail && (
              <div className="h-[24px] text-sm text-orange-400">올바른 이메일을 입력해주세요.</div>
            )}
          </div>

          {/* crew description */}
          <div className="flex flex-col gap-1">
            <div className="text-[15px] font-semibold text-[#1A75FF]">상세 내용</div>
            <div>
              <textarea
                className={`h-[140px] w-full resize-none rounded-xl border border-gray-200 p-3 outline-none`}
                value={description}
                onChange={onChangeDescription}
                placeholder="상세 내용을 작성해주세요."
              />
              <div className="text-end text-[13px] text-zinc-400">{`${description.length}/500`}</div>
            </div>
          </div>
        </div>

        {/* button */}
        <button
          className={`w-[256px] rounded-[40px] px-10 py-3 text-base font-semibold text-white ${
            isValidForm() ? "bg-[#1A75FF]" : "bg-gray-200"
          }`}
          onClick={handleSubmit}
          disabled={!isValidForm()}
        >
          의견 보내기
        </button>
      </div>
    </ModalContainer>
  )
}

export default ReportModal
