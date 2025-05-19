import { useExperiencingStore } from "@/store/ExperiencingStore"
import { useMemo } from "react"

const ExperiencingTimer = (): React.ReactElement => {
  const { experiencingTime } = useExperiencingStore()

  const displayTime = useMemo((): string => {
    const minutes = Math.floor(experiencingTime / 60)
    const secs = experiencingTime % 60
    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(secs).padStart(2, "0")
    return `${formattedMinutes} : ${formattedSeconds}`
  }, [experiencingTime])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="font-base font-semibold text-gray-50	">남은 체험 시간</div>
      <div className="flex w-[140px] items-center justify-center rounded-xl bg-zinc-800 px-8 py-3 text-xl font-semibold text-orange-400">
        {displayTime}
      </div>
    </div>
  )
}

export default ExperiencingTimer
