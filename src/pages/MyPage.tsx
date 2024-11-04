import { modifyNickName } from "@/api/nickname"
import { modals } from "@/components/Modal/Modals"
import { useModals } from "@/hooks/useModals"
import { useAuthStore } from "@/store"

export default function MyPage() {
  const userInfo = useAuthStore((state) => state.user)

  const { openModal } = useModals()

  const onClickModifyNickName = () => {
    openModal(modals.nickNameModal, {
      onSubmit: (newNickName) => {
        if (userInfo && newNickName) {
          modifyNickName(userInfo.uid, newNickName)
        }
      },
    })
  }

  return (
    <div className="bg-gray-50 pl-[110px] pt-12">
      <h1 className="text-[22px] font-bold text-zinc-900">마이 페이지</h1>
      <div className="flex flex-col gap-4 pt-11">
        <div className="flex h-[56px] max-w-[998px] items-center justify-between rounded-xl border border-gray-200 bg-white pl-6">
          <div className="flex items-center gap-6">
            <div className="text-sm">닉네임</div>
            <div>{userInfo?.nickname}</div>
          </div>
          <div className="pr-[27px]">
            <button
              className="rounded-full bg-[#1A75FF] px-[22px] py-[6px] text-[13px] font-semibold text-white"
              onClick={onClickModifyNickName}
            >
              변경하기
            </button>
          </div>
        </div>
        <div className="flex h-[56px] max-w-[998px] items-center gap-6 rounded-xl border border-gray-200 bg-white pl-6">
          <div className="text-sm">로그인 수단</div>
          <div>카카오 계정</div>
        </div>
      </div>
    </div>
  )
}
