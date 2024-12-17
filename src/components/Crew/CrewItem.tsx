import { group } from "@/api"
import PrivateCrewIcon from "@assets/icons/crew-private-icon.svg?react"
import CrewUserIcon from "@assets/icons/crew-user-icon.svg?react"
import { ReactElement, useCallback } from "react"

interface CrewItemProps {
  group: group
  keyword: string
  onClickDetail: () => void
}

// 키워드 강조 함수
const highlightKeyword = (text: string | undefined, keyword: string): React.ReactNode => {
  if (!text) return null
  if (!keyword) return text
  const parts = text.split(new RegExp(`(${keyword})`, "gi"))
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={index} className="text-[#1A75FF]">
        {part}
      </span>
    ) : (
      part
    )
  )
}

const CrewItem = (props: CrewItemProps): ReactElement => {
  const { group, keyword, onClickDetail } = props

  const createTags = useCallback(
    (tags: string[] | undefined): React.ReactElement[] | null => {
      if (!tags || tags.length === 0) return null
      return tags.map((tag) => <div key={`${group.id}-tag-${tag}`}>{highlightKeyword(`#${tag}`, keyword)}</div>)
    },
    [group.id, keyword]
  )

  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
      }}
      className="flex w-full items-center gap-[24px] bg-white px-[24px] py-[11px] text-[14px] font-semibold leading-[32px]"
    >
      <div className="flex flex-grow items-center gap-[24px]">
        {/* crew name */}
        <div className="flex items-center gap-[6px]">
          {group.isHidden && <PrivateCrewIcon />}
          <div>{highlightKeyword(group.name, keyword)}</div>
        </div>
        {/* crew user cnt */}
        <div className="flex items-center gap-[6px]">
          <CrewUserIcon />
          <div>{`${group.userCount}/${group.userCapacity}명`}</div>
        </div>
        {/* crew tags */}
        {keyword && <div className="flex gap-2.5 text-zinc-400">{createTags(group?.tagNames)}</div>}
      </div>
      {/* detail button */}
      <button
        className={`flex w-[114px] justify-center rounded-full py-[6px] text-sm font-semibold text-white ${
          group.hasJoined ? "bg-zinc-800" : group.userCapacity === group.userCount ? "bg-gray-200" : "bg-[#1A75FF]"
        }`}
        onClick={onClickDetail}
        disabled={group.hasJoined || group.userCapacity === group.userCount}
      >
        {group.hasJoined ? "나의 크루" : "크루 상세보기"}
      </button>
    </div>
  )
}

export default CrewItem
