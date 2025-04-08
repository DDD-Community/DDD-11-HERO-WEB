import { LineChart } from "echarts/charts"
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { SVGRenderer } from "echarts/renderers"
import * as echarts from "echarts/core"
import ReactEChartsCore from "echarts-for-react/lib/core"

echarts.use([LineChart, TooltipComponent, GridComponent, LegendComponent, SVGRenderer])

const poseTypeLabels: any = {
  TURTLE_NECK: "거북목",
  SHOULDER_TWIST: "어깨 틀어짐",
  CHIN_UTP: "턱 괴기",
  TAILBONE_SIT: "꼬리뼈로 앉기",
}

const PoseAnalysisChart = ({ data }: { data: any[] }) => {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: Object.values(poseTypeLabels),
      top: 20,
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "5%",
      top: "25%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: {
        formatter: "{value}",
      },
    },
    series: Object.keys(poseTypeLabels).map((poseType) => ({
      name: poseTypeLabels[poseType],
      type: "line",
      data: data.map((item) => {
        const poseCount = item.count.find((c: any) => c.type === poseType)
        return poseCount ? poseCount.count : 0
      }),
    })),
  }

  return (
    <ReactEChartsCore
      echarts={echarts}
      opts={{ renderer: "svg" }}
      option={options}
      lazyUpdate={true}
      style={{ height: "100%", width: "100%" }}
    />
  )
}

export default PoseAnalysisChart
