import Crew1stCrownIcon from "@assets/icons/crew-1st-crown.svg?react"

const RankPillar = ({ rank, name, score, height }: any) => {
  const rankStyleMap: { gap: string; bgColor: string; fontSize: string }[] = [
    {
      gap: "6",
      bgColor: "#8BBAFE",
      fontSize: "32px",
    },
    {
      gap: "6",
      bgColor: "#DCEBFD",
      fontSize: "22px",
    },
    {
      gap: "4",
      bgColor: "#DCEBFD",
      fontSize: "22px",
    },
  ]

  const style = rankStyleMap[rank - 1]

  return (
    <div className="flex flex-col items-center text-zinc-800" style={{ height }}>
      <div
        className={`flex w-[180px] flex-grow flex-col items-center justify-end py-6 gap-${style.gap} rounded-[12px]`}
        style={{
          minHeight: "100px",
          backgroundColor: style.bgColor,
        }}
      >
        <div className="flex flex-col items-center">
          {rank === 1 && <Crew1stCrownIcon className="mb-2 h-6 w-6" />}
          <div className={`font-medium text-[${rankStyleMap[rank - 1].fontSize}]`}>{rank}등</div>
        </div>
        <div className="text-xl font-semibold">{name}</div>
        <div className="text-[15px] font-normal ">틀어짐 {score}회</div>
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
        <RankPillar rank={1} name={topThree[0].name} score={topThree[0].score} height="100%" />
        <RankPillar rank={2} name={topThree[1].name} score={topThree[1].score} height="82%" />
        <RankPillar rank={3} name={topThree[2].name} score={topThree[2].score} height="72%" />
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
