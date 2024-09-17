import { getGroupScores, getMyGroup, groupUserRank, MyGroupData, withdrawMyGroup } from "@/api"
import { useAuthStore } from "@/store"
import { useMyGroupStore } from "@/store/MyGroup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo } from "react"

export default function useMyGroup() {
  const queryClient = useQueryClient()
  const myName = useAuthStore((state) => state.user.nickname)
  const { myGroupData, setMyGroupData } = useMyGroupStore()

  // Fetch group data
  const { data, isLoading, error } = useQuery<{ data: MyGroupData } | null, Error>({
    queryKey: ["myGroup"],
    queryFn: getMyGroup,
    staleTime: 60 * 1000,
    retry: false,
  })

  // Fetch group scores
  const myGroupScoresQuery = useQuery<{ data: { ranks: groupUserRank[] } }, Error>({
    queryKey: ["groupScores", myGroupData?.id],
    queryFn: () => getGroupScores(myGroupData!.id),
    enabled: !!myGroupData?.id,
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  })

  useEffect(() => {
    if (data) {
      setMyGroupData(data.data)
    }
  }, [data, setMyGroupData])

  const myRank = useMemo(() => {
    return myGroupScoresQuery.data?.data.ranks.find((item) => item.name === myName)
  }, [myGroupScoresQuery.data, myName])

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["myGroup"] })
    queryClient.invalidateQueries({ queryKey: ["groupScores"] })
  }

  const withdrawMutation = useMutation({
    mutationFn: withdrawMyGroup,
    onSuccess: (res) => {
      if (res.status === 204) {
        setMyGroupData(null)
        queryClient.setQueryData(["myGroup"], null)
        queryClient.removeQueries({ queryKey: ["groupScores"] })
      }
    },
  })

  const withdrawFromGroup = useCallback(async () => {
    if (myGroupData) {
      try {
        await withdrawMutation.mutateAsync(myGroupData.id)
        return { success: true }
      } catch (error) {
        console.error("Error during group withdrawal:", error)
        return { success: false, error }
      }
    }
    return { success: false, error: new Error("No group data available") }
  }, [myGroupData, withdrawMutation])

  return {
    myGroupData: myGroupData ?? data?.data,
    ranks: myGroupScoresQuery.data?.data.ranks ?? [],
    myRank,
    isLoading: isLoading || myGroupScoresQuery.isLoading,
    error: error || myGroupScoresQuery.error,
    withdrawFromGroup,
    refetchAll,
  }
}
