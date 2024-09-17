import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"

interface MyCrewHeaderProps {
  openCreateModal: () => void
}

export default function MyCrewHeader(props: MyCrewHeaderProps) {
  const { openCreateModal } = props
  return (
    <div className="mb-[24px] flex w-full items-center">
      <div className="flex-grow text-[22px] font-bold text-zinc-900">나의 크루</div>
      <div
        className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
        onClick={openCreateModal}
      >
        <CreateCrewIcon />
        <div>크루 만들기</div>
      </div>
    </div>
  )
}
