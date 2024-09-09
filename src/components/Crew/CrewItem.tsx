import { group } from "@/api"
import PrivateCrewIcon from "@assets/icons/crew-private-icon.svg?react"
import CrewUserIcon from "@assets/icons/crew-user-icon.svg?react"
import { ReactElement } from "react"

interface CrewItemProps {
  group: group
  onClickDetail: () => void
}

const CrewItem = (props: CrewItemProps): ReactElement => {
  const { group, onClickDetail } = props

  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
      }}
      className="flex w-full items-center gap-[24px] bg-white px-[24px] py-[11px] text-[14px] font-semibold leading-[32px]"
    >
      {/* crew name */}
      <div className="flex items-center gap-[6px]">
        {group.isHidden && <PrivateCrewIcon />}
        <div>{group.name}</div>
      </div>
      {/* crew user cnt */}
      <div className="flex flex-grow items-center gap-[6px]">
        <CrewUserIcon />
        <div>{`${group.userCount}/${group.userCapacity}명`}</div>
      </div>
      {/* detail button */}
      <button
        className="flex w-[114px] cursor-pointer justify-center rounded-full bg-[#1A75FF] py-[6px] text-sm font-semibold text-white"
        onClick={onClickDetail}
      >
        크루 상세보기
      </button>
    </div>
  )
}

export default CrewItem
