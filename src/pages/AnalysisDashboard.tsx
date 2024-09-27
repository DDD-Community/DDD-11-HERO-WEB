import { poseType } from "@/api/pose"
import { usePoseAnalysis } from "@/hooks/useDashBoard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import TotalCountChartIcon from "@/assets/icons/dash-board-total-count.svg?react"
import ChinUpImage from "@/assets/images/chin-up.png"
import ShoulderTwistImage from "@/assets/images/shoulder-twist.png"
import TailBoneSitImage from "@/assets/images/tail-bone-sit.png"
import TurtleNeckImage from "@/assets/images/tutle-neck.png"
import PoseAnalysisChart from "@/components/Dashboard/Chart"
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker"
import CalendarToolTip from "@assets/icons/dashboard-calendar-tooltip.svg?react"

const START_FROM = new Date()
START_FROM.setMonth(START_FROM.getMonth() - 1)

const AnalysisDashboard = () => {
  const carouselRef = useRef(null)
  const datePickerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  })
  const [isLargeViewport, setIsLargeViewport] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { todayAnalysis, totalAnalysis, isLoading, isError } = usePoseAnalysis(dateRange)

  useEffect(() => {
    const checkViewportSize = () => {
      setIsLargeViewport(window.innerWidth >= 1560)
    }

    checkViewportSize() // 초기 체크
    window.addEventListener("resize", checkViewportSize)

    return () => window.removeEventListener("resize", checkViewportSize)
  }, [])

  const getPoseCount = (type: poseType) => {
    return todayAnalysis?.count.find((item: any) => item.type === type)?.count || 0
  }

  const totalCount = todayAnalysis?.count.reduce((acc, item) => acc + item.count, 0) || 0

  const carouselItems = [
    { title: "거북목", type: "TURTLE_NECK" as poseType, image: TurtleNeckImage },
    { title: "어깨 틀어짐", type: "SHOULDER_TWIST" as poseType, image: ShoulderTwistImage },
    { title: "턱 괴기", type: "CHIN_UTP" as poseType, image: ChinUpImage },
    { title: "꼬리뼈로 앉기", type: "TAILBONE_SIT" as poseType, image: TailBoneSitImage },
  ]

  const moveCarousel = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction === "right" && currentIndex < carouselItems.length - 3) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = (carouselRef.current as HTMLElement).offsetWidth / 3
      ;(carouselRef.current as HTMLElement).style.transform = `translateX(-${currentIndex * itemWidth}px)`
    }
  }, [currentIndex])

  return (
    <div className="h-full w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-[22px] font-bold text-zinc-900">오늘의 자세 분석</div>
        <div className="flex space-x-2">
          <button
            className={`rounded-full p-2 ${
              isLargeViewport || currentIndex === 0 ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white"
            }`}
            onClick={() => moveCarousel("left")}
            disabled={isLargeViewport || currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`rounded-full p-2 ${
              isLargeViewport || currentIndex === carouselItems.length - 3
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => moveCarousel("right")}
            disabled={isLargeViewport || currentIndex === carouselItems.length - 3}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isLoading && <div>로딩 중입니다...</div>}
      {isError && <div>데이터를 불러오는 것에 실패했습니다</div>}

      {!isLoading && !isError && todayAnalysis && (
        <div className="mb-8">
          <div className="flex">
            {/* 고정된 전체 틀어짐 횟수 카드 */}
            <div className="relative">
              <div className="mr-[15px] flex h-[266px] w-[230px] flex-col items-center rounded-lg bg-zinc-800 text-white">
                <span className="mt-8 text-[15px] text-[#5A9CFF]">전체 자세 경고 횟수</span>
                <div className="flex items-center gap-1">
                  <span className="text-[40px] font-medium">{totalCount}</span>
                  <span className="text-[15px] font-semibold">회</span>
                </div>
                <div className="absolute bottom-[25px] flex h-24 justify-center">
                  <TotalCountChartIcon />
                </div>
              </div>
            </div>

            {/* 캐러셀 컨테이너 */}
            <div className="relative flex w-3/4 overflow-hidden">
              {/* 왼쪽 그라디언트 */}
              {!isLargeViewport && currentIndex > 0 && (
                <div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent" />
              )}

              {/* 캐러셀 아이템 */}
              <div
                ref={carouselRef}
                className="flex transition-transform duration-300 ease-in-out"
                // style={{ width: `${(carouselItems.length / 3) * 100}%` }}
              >
                {carouselItems.map(({ title, type, image }, index) => (
                  <div key={index} className="mr-3 h-[266px] w-[210px]">
                    <div className="relative overflow-hidden rounded-lg bg-gray-100">
                      <img src={image} alt={title} className="h-full w-full" />
                      <div className="absolute inset-0 flex flex-col items-center pt-8 text-black">
                        <span className="text-[15px] font-semibold">{title}</span>
                        <div className="flex items-center gap-1">
                          <div className="text-[40px] font-medium">{getPoseCount(type)}</div>
                          <div className="text-[15px] font-semibold">회</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 오른쪽 그라디언트 */}
              {!isLargeViewport && currentIndex < 1 && (
                <div className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent" />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mb-12 mt-8">
        <hr />
      </div>
      {/* 차트 섹션 */}
      <div className="flex items-center justify-between pb-6">
        <span className="text-[22px] font-bold text-zinc-900">기간별 자세 추이</span>
        <div
          className="relative text-sm text-gray-600"
          ref={datePickerRef}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && (
            <div
              className="absolute z-10"
              style={{
                top: 36,
                right: 0,
              }}
            >
              <CalendarToolTip />
            </div>
          )}
          <Datepicker
            inputClassName="w-[270px] py-2 rounded-full bg-zinc-800 text-white px-[24px]"
            startFrom={START_FROM}
            maxDate={new Date()}
            value={dateRange}
            onChange={(value) => setDateRange(value)}
          />
        </div>
      </div>
      <div className="h-[340px] rounded-[10px] border-[1px] border-solid border-gray-200 bg-white">
        {totalAnalysis && <PoseAnalysisChart data={totalAnalysis} />}
      </div>
    </div>
  )
}

export default AnalysisDashboard
