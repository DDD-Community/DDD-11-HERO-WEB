import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTodayAnalysis, TodayAnalysisData } from "@/api/analysis"
import { poseType } from "@/api/pose"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

import TurtleNeckImage from "@/assets/images/tutle-neck.png"
import ShoulderTwistImage from "@/assets/images/shoulder-twist.png"
import ChinUpImage from "@/assets/images/chin-up.png"
import TailBoneSitImage from "@/assets/images/tail-bone-sit.png"

const AnalysisDashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  const { data, isLoading, isError } = useQuery<TodayAnalysisData>({
    queryKey: ["todayAnalysis"],
    queryFn: getTodayAnalysis,
  })

  const getPoseCount = (type: poseType) => {
    return data?.count.find((item: any) => item.type === type)?.count || 0
  }

  const totalCount = data?.count.reduce((acc, item) => acc + item.count, 0) || 0

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

      {!isLoading && !isError && data && (
        <div className="relative mb-8 overflow-hidden">
          <div className="flex">
            {/* 고정된 전체 틀어짐 횟수 카드 */}
            <div className="mr-4 w-1/4 flex-shrink-0 rounded-lg bg-black p-4 text-white">
              <p className="text-sm text-blue-400">전체 틀어짐 횟수</p>
              <p className="mt-2 text-3xl font-bold">{totalCount}회</p>
              <div className="mt-2 h-24 bg-gray-700">{/* 차트 이미지 삽입 */}</div>
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
                  <div key={index} className="w-1/3 flex-shrink-0 px-2">
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
          {/* 차트 섹션 */}
          <div className="rounded-lg p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="rounded-full bg-gray-800 px-4 py-2 text-sm text-white">7월 첫째주</button>
                <ChevronLeft size={20} />
                <ChevronRight size={20} />
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2" />
                {data?.date}
              </div>
            </div>
            <div className="h-64 bg-gray-100">{/* 실제 차트 컴포넌트 삽입 */}</div>
            <div className="mt-4 flex justify-center space-x-4">
              {["거북목", "어깨 틀어짐", "턱 괴기", "고개숙여 보기"].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`mr-2 h-3 w-3 rounded-full bg-${["red", "blue", "green", "purple"][index]}-500`}
                  ></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisDashboard
