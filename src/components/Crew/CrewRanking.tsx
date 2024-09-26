import Crew1stCrownIcon from "@assets/icons/crew-1st-crown.svg?react"

const RankPillar = ({ rank, name, score, height }: any) => {
  const rankStyleMap: { gap: number | string; bgColor: string; fontSize: string; fontWeight: string }[] = [
    {
      gap: 24,
      bgColor: "#8BBAFE",
      fontSize: "32px",
      fontWeight: "600",
    },
    {
      gap: 24,
      bgColor: "#DCEBFD",
      fontSize: "22px",
      fontWeight: "500",
    },
    {
      gap: 16,
      bgColor: "#DCEBFD",
      fontSize: "22px",
      fontWeight: "500",
    },
  ]

  const style = rankStyleMap[rank - 1]

  return (
    <div className="flex flex-col items-center text-zinc-800">
      <div
        className={`flex w-[180px] flex-col items-center rounded-[12px] py-6`}
        style={{
          backgroundColor: style.bgColor,
          gap: style.gap,
          height,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          {rank === 1 && (
            <div className="">
              <Crew1stCrownIcon className="h-6 w-6" />
            </div>
          )}
          <div
            className={`font-medium`}
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
            }}
          >
            {rank}등
          </div>
        </div>
        <div className="text-[20px] font-semibold">{name}</div>
        <div className="text-[15px] font-normal ">자세 경고 {score}회</div>
      </div>
    </div>
  )
}

const RankCard = ({ rank, name, score, isMe }: any) => (
  <div
    className={`flex items-center justify-between py-1 pl-3 pr-4 ${isMe ? "rounded-full bg-[#DCEBFD]" : ""} h-[40px]`}
  >
    <div className="flex items-center gap-4">
      <div className="flex h-8 w-8 items-center justify-center font-normal text-zinc-900">{rank}</div>
      <span className={isMe ? "font-medium text-[#1A75FF]" : ""}>{isMe ? "나" : name}</span>
    </div>
    <span className="text-[13px] font-normal text-zinc-400">자세경고 {score}회</span>
  </div>
)

const CrewRanking = ({ rankings, myRank }: { rankings: any[]; myRank: any }) => {
  const topThree = rankings.slice(0, 3)

  return (
    <div className="flex h-full gap-12">
      {/* 1, 2, 3등 랭킹 */}
      <div className="flex h-full flex-1 items-end gap-3">
        {topThree[0] && <RankPillar rank={1} name={topThree[0].name} score={topThree[0].score} height="220px" />}
        {topThree[1] && <RankPillar rank={2} name={topThree[1].name} score={topThree[1].score} height="180px" />}
        {topThree[2] && <RankPillar rank={3} name={topThree[2].name} score={topThree[2].score} height="158px" />}
      </div>

      {/* 전체 랭킹 목록 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-full flex-col overflow-hidden bg-white">
          <div className="flex-shrink-0">
            <RankCard rank={myRank.rank} name={myRank.name} score={myRank.score} isMe={true} />
          </div>
          <div className="scrollbar-hide flex-grow overflow-y-auto">
            {rankings.map((rank, index) => (
              <RankCard key={index} rank={rank.rank} name={rank.name} score={rank.score} isMe={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrewRanking
