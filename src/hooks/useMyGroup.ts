import { useMyGroupWithScores } from "@/api/queries"
import { useAuthStore } from "@/store"
import { useMyGroupStore } from "@/store/MyGroup"
import { useEffect } from "react"

/**
 * 내 그룹과 점수 정보를 가져오는 훅
 */
export default function useMyGroup() {
  const myName = useAuthStore((state) => state.user?.nickname)
  const { myGroupData, setMyGroupData } = useMyGroupStore()
  
  // 새로운 쿼리 훅 사용
  const { 
    myGroupData: fetchedGroupData,
    ranks,
    avgScore,
    isLoading,
    error,
    withdrawFromGroup,
    refetch: refetchAll
  } = useMyGroupWithScores();
  
  // 그룹 데이터가 변경되면 store 업데이트
  useEffect(() => {
    if (fetchedGroupData) {
      setMyGroupData(fetchedGroupData)
    }
  }, [fetchedGroupData, setMyGroupData])
  
  // 자신의 랭킹 정보 찾기
  const myRank = ranks.find((item) => item.name === myName)

  return {
    myGroupData: myGroupData ?? fetchedGroupData,
    ranks,
    avgScore,
    myRank,
    isLoading,
    error,
    withdrawFromGroup,
    refetchAll,
  }
}
