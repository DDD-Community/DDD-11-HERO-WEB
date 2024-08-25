import { ChevronLeft, ChevronRight, Calendar } from "lucide-react" // 아이콘을 위해 lucide-react 사용

const AnalysisDashboard = () => {
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

      {/* 상단 카드 섹션 */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-black p-4 text-white">
          <p className="text-sm text-blue-400">전체 틀어짐 횟수</p>
          <p className="mt-2 text-3xl font-bold">15회</p>
          {/* 차트 이미지 위치 */}
          <div className="mt-2 h-24 bg-gray-700">{/* 차트 이미지 삽입 */}</div>
        </div>
        {["거북목", "어깨 틀어짐", "턱 괴기"].map((title, index) => (
          <div key={index} className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold">5회</p>
            {/* 이미지 위치 */}
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
            2024년 7월 1일 ~ 2024년 7월 7일
          </div>
        </div>
        {/* 차트 영역 */}
        <div className="h-64 bg-gray-100">{/* 실제 차트 컴포넌트 삽입 */}</div>
        {/* 범례 */}
        <div className="mt-4 flex justify-center space-x-4">
          {["거북목", "어깨 틀어짐", "턱 괴기", "고개숙여 보기"].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`mr-2 h-3 w-3 rounded-full bg-${["red", "blue", "green", "purple"][index]}-500`}></div>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalysisDashboard
