import { poseType } from "@/api/pose"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { usePoseAnalysis } from "@/hooks/useDashBoard"

import TotalCountChartIcon from "@/assets/icons/dash-board-total-count.svg?react"
import ChinUpImage from "@/assets/images/chin-up.png"
import ShoulderTwistImage from "@/assets/images/shoulder-twist.png"
import TailBoneSitImage from "@/assets/images/tail-bone-sit.png"
import TurtleNeckImage from "@/assets/images/tutle-neck.png"
import PoseAnalysisChart from "@/components/Dashboard/Chart"

const AnalysisDashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  const { todayAnalysis, totalAnalysis, isLoading, isError } = usePoseAnalysis()

  console.log("totalAnalysis: ", totalAnalysis)

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
        <h1 className="text-2xl font-bold">오늘의 자세 분석</h1>
        <div className="flex space-x-2">
          <button
            className={`rounded-full p-2 ${
              currentIndex === 0 ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white"
            }`}
            onClick={() => moveCarousel("left")}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`rounded-full p-2 ${
              currentIndex === carouselItems.length - 3 ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white"
            }`}
            onClick={() => moveCarousel("right")}
            disabled={currentIndex === carouselItems.length - 3}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isLoading && <div>로딩 중입니다...</div>}
      {isError && <div>데이터를 불러오는 것에 실패했습니다</div>}

      {!isLoading && !isError && todayAnalysis && (
        <div className="relative mb-8 overflow-hidden">
          <div className="flex">
            {/* 고정된 전체 틀어짐 횟수 카드 */}
            <div className="relative mr-3 flex w-60 flex-col items-center rounded-lg bg-black text-white">
              <p className="mt-8 text-sm text-[#5A9CFF]">전체 틀어짐 횟수</p>
              <div className="mt-2 flex items-center">
                <span className="text-4xl font-bold">{totalCount}</span>
                <span className="ml-1 text-sm">회</span>
              </div>
              <div className="absolute bottom-[25px] flex h-24 justify-center">
                <TotalCountChartIcon />
              </div>
            </div>

            {/* 캐러셀 컨테이너 */}
            <div className="relative flex w-3/4 overflow-hidden">
              {/* 왼쪽 그라디언트 */}
              {currentIndex > 0 && (
                <div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent" />
              )}

              {/* 캐러셀 아이템 */}
              <div
                ref={carouselRef}
                className="flex transition-transform duration-300 ease-in-out"
                style={{ width: `${(carouselItems.length / 3) * 100}%` }}
              >
                {carouselItems.map(({ title, type, image }, index) => (
                  <div key={index} className="mr-3 w-1/5 flex-shrink-0">
                    <div className="relative overflow-hidden rounded-lg bg-gray-100">
                      <img src={image} alt={title} className="h-full w-full" />
                      <div className="absolute inset-0 flex flex-col items-center pt-8 text-black">
                        <p className="text-lg font-semibold">{title}</p>
                        <div className="flex items-center gap-1">
                          <div className="mb-2 pt-2 text-4xl font-bold">{getPoseCount(type)}</div>
                          <div className="text-lg">회</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 오른쪽 그라디언트 */}
              {currentIndex < 1 && (
                <div className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent" />
              )}
            </div>
          </div>
          <div className="mb-12 mt-8">
            <hr />
          </div>
          {/* 차트 섹션 */}
          <div className="rounded-lg shadow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChevronLeft size={20} />
                <span className="rounded-full bg-zinc-800 px-4 py-2 text-white">7월 첫째주 추이</span>
                <ChevronRight size={20} />
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2" />
                {"2024-09-09"}
              </div>
            </div>
            <div className="h-[340px] rounded-[10px] border-[1px] border-solid border-gray-200 bg-white">
              {totalAnalysis && <PoseAnalysisChart data={totalAnalysis} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisDashboard
