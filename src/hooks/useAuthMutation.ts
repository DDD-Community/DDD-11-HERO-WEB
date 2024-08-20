import { authUser, getIsSignUp, getOauthUser, oauth, oauthUser, signIn, signUp } from "@/api"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

export const useOauth = (): UseMutationResult<string, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (code: string) => {
      return oauth(code)
    },
    onSuccess: (data) => {
      console.log(data)
    },
  })
}

export const useGetOauthUser = (): UseMutationResult<oauthUser, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (accessToken: string) => getOauthUser(accessToken),
    onSuccess: (data) => {
      console.log("Oauth user data:", data)
    },
    onError: (error) => {
      console.error("Error fetching oauth user:", error)
    },
  })
}

export const useSignIn = (): UseMutationResult<authUser, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (_accessToken: string) => signIn(_accessToken),
    onSuccess: (data) => {
      console.log("User signed in:", data)
    },
    onError: (error) => {
      console.error("Error signing in:", error)
    },
  })
}

export const useSignUp = (): UseMutationResult<authUser, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (_accessToken: string) => signUp(_accessToken),
    onSuccess: (data) => {
      console.log("User signed up:", data)
    },
    onError: (error) => {
      console.error("Error signing up:", error)
    },
  })
}

export const useGetIsSignUp = (): UseMutationResult<boolean, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (accessToken: string) => getIsSignUp(accessToken),
    onSuccess: (data) => {
      console.log("User signup status:", data)
    },
    onError: (error) => {
      console.error("Error checking signup status:", error)
    },
  })
}
