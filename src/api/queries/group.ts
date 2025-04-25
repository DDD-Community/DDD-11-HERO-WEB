import {
  getGroups,
  getGroup,
  joinGroup,
  createGroup,
  modifyGroup,
  getGroupScores,
  getMyGroup,
  withdrawMyGroup,
  checkGroupName,
  group,
  groupsReq,
  groupsRes,
  groupJoinReq,
  groupJoinRes,
  GroupUserRankData,
  MyGroupData
} from '../group';
import { useMutation, useQuery, QueryOptions, MutationOptions, queryKeys } from './index';
import { useInvalidateQueries } from './index';

/**
 * 그룹 목록을 가져오는 쿼리 훅
 */
export const useGroupsQuery = (params: groupsReq, options?: QueryOptions<groupsRes>) => {
  return useQuery({
    queryKey: queryKeys.group.list(params),
    queryFn: () => getGroups(params),
    ...options,
  });
};

/**
 * 특정 그룹 정보를 가져오는 쿼리 훅
 */
export const useGroupQuery = (groupId: number | undefined, options?: QueryOptions<group>) => {
  return useQuery({
    queryKey: [...queryKeys.group.all, groupId],
    queryFn: () => getGroup(groupId),
    enabled: !!groupId, // groupId가 유효할 때만 쿼리 실행
    ...options,
  });
};

/**
 * 내 그룹 정보를 가져오는 쿼리 훅
 */
export const useMyGroupQuery = (options?: QueryOptions<{ data: MyGroupData } | null>) => {
  return useQuery({
    queryKey: queryKeys.group.myGroup,
    queryFn: getMyGroup,
    retry: false, // 그룹이 없으면 재시도하지 않음
    ...options,
  });
};

/**
 * 그룹 점수 정보를 가져오는 쿼리 훅
 */
export const useGroupScoresQuery = (
  groupId: string | number | undefined,
  options?: QueryOptions<{ data: GroupUserRankData }>
) => {
  return useQuery({
    queryKey: queryKeys.group.scores(Number(groupId)),
    queryFn: () => getGroupScores(groupId!),
    enabled: !!groupId, // groupId가 유효할 때만 쿼리 실행
    ...options,
  });
};

/**
 * 그룹에 참여하는 mutation 훅
 */
export const useJoinGroupMutation = (options?: MutationOptions<groupJoinRes, groupJoinReq>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (data: groupJoinReq) => joinGroup(data),
    onSuccess: (data, variables, context) => {
      // 그룹 참여 후 관련 쿼리 무효화
      invalidateQueries.invalidateGroup();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * 그룹 이름 중복 체크 mutation 훅
 */
export const useCheckGroupNameMutation = (options?: MutationOptions<boolean, string>) => {
  return useMutation({
    mutationFn: (name: string) => checkGroupName(name),
    ...options,
  });
};

/**
 * 그룹 생성 mutation 훅
 */
export const useCreateGroupMutation = (options?: MutationOptions<group, group>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (data: group) => createGroup(data),
    onSuccess: (data, variables, context) => {
      // 그룹 생성 후 관련 쿼리 무효화
      invalidateQueries.invalidateGroup();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * 그룹 수정 mutation 훅
 */
export const useModifyGroupMutation = (options?: MutationOptions<group, group>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (data: group) => modifyGroup(data),
    onSuccess: (data, variables, context) => {
      // 그룹 수정 후 관련 쿼리 무효화
      invalidateQueries.invalidateGroup();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * 그룹 탈퇴 mutation 훅
 */
export const useWithdrawGroupMutation = (options?: MutationOptions<any, string | number | undefined>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (groupId: string | number | undefined) => withdrawMyGroup(groupId),
    onSuccess: (data, variables, context) => {
      // 그룹 탈퇴 후 관련 쿼리 무효화
      invalidateQueries.invalidateGroup();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * 내 그룹과 점수 정보를 포함하는 통합 훅
 */
export const useMyGroupWithScores = () => {
  const { 
    data: myGroupData, 
    isLoading: isMyGroupLoading,
    error: myGroupError,
    refetch: refetchMyGroup 
  } = useMyGroupQuery();
  
  const groupId = myGroupData?.data?.id;
  
  const { 
    data: scoresData, 
    isLoading: isScoresLoading,
    error: scoresError,
    refetch: refetchScores
  } = useGroupScoresQuery(groupId, {
    enabled: !!groupId,
  });
  
  // 그룹 탈퇴 mutation
  const withdrawMutation = useWithdrawGroupMutation();
  
  const withdrawFromGroup = async () => {
    if (groupId) {
      try {
        await withdrawMutation.mutateAsync(groupId);
        return { success: true };
      } catch (error) {
        console.error("Error during group withdrawal:", error);
        return { success: false, error };
      }
    }
    return { success: false, error: new Error("No group data available") };
  };
  
  return {
    myGroupData: myGroupData?.data,
    ranks: scoresData?.data.ranks ?? [],
    avgScore: scoresData?.data.avgScore,
    isLoading: isMyGroupLoading || isScoresLoading,
    error: myGroupError || scoresError,
    withdrawFromGroup,
    refetch: () => {
      refetchMyGroup();
      if (groupId) refetchScores();
    }
  };
}; 