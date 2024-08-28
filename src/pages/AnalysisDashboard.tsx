import { getTodayAnalysis, TodayAnalysisData } from "@/api/analysis"
import { poseType } from "@/api/pose"
import { useQuery } from "@tanstack/react-query"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"

const AnalysisDashboard = () => {
  const { data, isLoading, isError } = useQuery<TodayAnalysisData>({
    queryKey: ["todayAnalysis"],
    queryFn: getTodayAnalysis,
  })

  const getPoseCount = (type: poseType) => {
    return data?.count.find((item: any) => item.type === type)?.count || 0
  }

  const totalCount = useMemo(() => {
    return data?.count.reduce((acc, item) => acc + item.count, 0) || 0
  }, [data])

  return (
    <div className="h-full w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">오늘의 자세 분석</h1>
        <div className="flex space-x-2">
          <button className="rounded-full bg-gray-200 p-2">
            <ChevronLeft size={20} />
          </button>
          <button className="rounded-full bg-blue-500 p-2 text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isLoading && <div>로딩 중입니다...</div>}
      {isError && <div>데이터를 불러오는 것에 실패했습니다</div>}

      {/* 상단 카드 섹션 */}
      {!isLoading && !isError && data && (
        <>
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-black p-4 text-white">
              <p className="text-sm text-blue-400">전체 틀어짐 횟수</p>
              <p className="mt-2 text-3xl font-bold">{totalCount}회</p>
              <div className="mt-2 h-24 bg-gray-700">{/* 차트 이미지 삽입 */}</div>
            </div>
            {[
              { title: "거북목", type: "TURTLE_NECK" as poseType },
              { title: "어깨 틀어짐", type: "SHOULDER_TWIST" as poseType },
              { title: "턱 괴기", type: "CHIN_UTP" as poseType },
            ].map(({ title, type }, index) => (
              <div key={index} className="rounded-lg bg-gray-100 p-4">
                <p className="text-sm text-gray-600">{title}</p>
                <p className="mt-2 text-3xl font-bold">{getPoseCount(type)}회</p>
                <div className="mt-2 h-24 bg-gray-300">{/* 이미지 삽입 */}</div>
              </div>
            ))}
          </div>

          {/* 차트 섹션 */}
          <div className="rounded-lg bg-white p-6 shadow">
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
        </>
      )}
    </div>
  )
}

export default AnalysisDashboard
