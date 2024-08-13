import { PoseDetector } from "@/components"

const MonitoringPage: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-[20px]">
      <div className="aspect-video w-[100%] min-w-[640px] max-w-[1280px]">
        <PoseDetector />
      </div>
    </div>
  )
}

export default MonitoringPage
