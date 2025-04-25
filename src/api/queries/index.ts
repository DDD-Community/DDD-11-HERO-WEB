import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// 기본 쿼리 훅 타입
export type QueryOptions<TData, TError = AxiosError> = Omit<
  UseQueryOptions<TData, TError, TData>,
  'queryKey' | 'queryFn'
>;

// 기본 뮤테이션 훅 타입
export type MutationOptions<TData, TVariables, TError = AxiosError> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;

// 전역 쿼리 키 관리
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  pose: {
    all: ['pose'] as const,
    today: ['pose', 'today'] as const,
    history: (params?: Record<string, any>) => ['pose', 'history', ...(params ? [params] : [])] as const,
  },
  notification: {
    all: ['notification'] as const,
    settings: ['notification', 'settings'] as const,
  },
  group: {
    all: ['group'] as const,
    myGroup: ['group', 'my'] as const,
    scores: (groupId?: number) => ['group', 'scores', groupId] as const,
    list: (params?: Record<string, any>) => ['group', 'list', ...(params ? [params] : [])] as const,
  },
  snapshot: {
    all: ['snapshot'] as const,
    recent: ['snapshot', 'recent'] as const,
    list: (params?: Record<string, any>) => ['snapshot', 'list', ...(params ? [params] : [])] as const,
  },
  analysis: {
    today: ['analysis', 'today'] as const,
    total: (params?: Record<string, any>) => ['analysis', 'total', ...(params ? [params] : [])] as const,
  },
};

// useQueryClient 훅 간편 접근 함수
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAuth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
    invalidatePose: () => queryClient.invalidateQueries({ queryKey: queryKeys.pose.all }),
    invalidateNotification: () => queryClient.invalidateQueries({ queryKey: queryKeys.notification.all }),
    invalidateGroup: () => queryClient.invalidateQueries({ queryKey: queryKeys.group.all }),
    invalidateSnapshot: () => queryClient.invalidateQueries({ queryKey: queryKeys.snapshot.all }),
    invalidateAnalysis: () => queryClient.invalidateQueries({ queryKey: queryKeys.analysis.today }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
};

export { useQuery, useMutation, useQueryClient };

// 모든 커스텀 쿼리 훅 재출
export * from './pose';
export * from './notification';
export * from './snapshot';
export * from './analysis';
export * from './group';
export * from './auth'; 