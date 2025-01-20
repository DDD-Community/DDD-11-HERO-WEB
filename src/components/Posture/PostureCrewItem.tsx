import CrewMyCheerCountIcon from "@assets/icons/crew-cheer-my-count-icon.svg?react"
import CrewCheerIcon from "@assets/icons/crew-cheer-icon.svg?react"
import CrewCheerXIcon from "@assets/icons/crew-cheer-x-icon.svg?react"

interface PostureCrewItemProps {
  uid: number
  rank: number
  nickname: string
  score: number
  isMe?: boolean
  isMyCheerCount?: number
  cheerButtonDisabled?: boolean
  onClickCheer?: (uid: number) => void
}

export default function PostureCrewItem(props: PostureCrewItemProps) {
  const { uid, rank, nickname, score, isMe, isMyCheerCount, cheerButtonDisabled, onClickCheer } = props
  return (
    <li
      key={uid}
      className={`flex h-[60px] w-full items-center justify-between rounded-[10px] ${
        isMe ? "bg-[#DCEBFD]" : "bg-white"
      }`}
    >
      <div className="flex w-full items-center justify-between py-3 pl-2 pr-3">
        <div className="flex items-center gap-1">
          <span className={`w-6 text-center font-semibold ${rank <= 3 || isMe ? "text-[#1F76F8]" : "text-[#9D9DA2]"}`}>
            {rank}
          </span>
          <div className="flex w-[100px] flex-col text-[13px]">
            <span className="block max-w-full truncate font-semibold leading-[18px] text-zinc-900">{nickname}</span>
            <span className="text-normal leading-[18px] text-zinc-400">경고 {score}회</span>
          </div>
        </div>
        {isMe ? (
          <div className="flex items-center">
            <CrewMyCheerCountIcon />
            <CrewCheerXIcon />
            <span className="text-[15px] font-semibold text-zinc-700">
              {isMyCheerCount === undefined ? 0 : isMyCheerCount}
            </span>
          </div>
        ) : (
          <button
            onClick={() => onClickCheer?.(uid)}
            disabled={cheerButtonDisabled}
            className="transition-transform hover:enabled:scale-110"
          >
            <CrewCheerIcon fill={cheerButtonDisabled ? "#D4D4D8" : "#F87171"} />
          </button>
        )}
      </div>
    </li>
  )
}
