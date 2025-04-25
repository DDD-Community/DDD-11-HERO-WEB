import { authUser, getIsSignUp, getOauthUser, oauth, oauthUser, signIn, signUp } from '../auth';
import { useMutation, MutationOptions, queryKeys } from './index';
import { useInvalidateQueries } from './index';
import { setAccessToken } from '../axiosInstance';

/**
 * OAuth 토큰을 가져오는 mutation 훅
 */
export const useOauthMutation = (options?: MutationOptions<string, string>) => {
  return useMutation({
    mutationFn: (code: string) => oauth(code),
    ...options,
  });
};

/**
 * OAuth 사용자 정보를 가져오는 mutation 훅
 */
export const useGetOauthUserMutation = (options?: MutationOptions<oauthUser, string>) => {
  return useMutation({
    mutationFn: (accessToken: string) => getOauthUser(accessToken),
    ...options,
  });
};

/**
 * 회원가입 여부 확인 mutation 훅
 */
export const useGetIsSignUpMutation = (options?: MutationOptions<boolean, string>) => {
  return useMutation({
    mutationFn: (accessToken: string) => getIsSignUp(accessToken),
    ...options,
  });
};

/**
 * 로그인 mutation 훅
 */
export const useSignInMutation = (options?: MutationOptions<authUser, string>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (accessToken: string) => signIn(accessToken),
    onSuccess: (data, variables, context) => {
      // 로그인 성공 시 토큰 저장 및 관련 쿼리 무효화
      setAccessToken(data.accessToken);
      invalidateQueries.invalidateAuth();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * 회원가입 mutation 훅
 */
export const useSignUpMutation = (options?: MutationOptions<authUser, string>) => {
  const invalidateQueries = useInvalidateQueries();
  
  return useMutation({
    mutationFn: (accessToken: string) => signUp(accessToken),
    onSuccess: (data, variables, context) => {
      // 회원가입 성공 시 토큰 저장 및 관련 쿼리 무효화
      setAccessToken(data.accessToken);
      invalidateQueries.invalidateAuth();
      
      // 사용자 정의 onSuccess 핸들러 호출
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}; 