import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Login from "@/components/Login"
import { useOauth, useSignUp, useSignIn, useGetIsSignUp } from "@/hooks/useAuthMutation"
import RoutePath from "@/constants/routes.json"
import { useAuthStore } from "@/store/AuthStore"
import { useSnapshotStore } from "@/store/SnapshotStore"
import { useGetRecentSnapshot } from "@/hooks/useSnapshotMutation"

const AuthPage: React.FC = () => {
  const navigate = useNavigate()

  const oauthMutation = useOauth()
  const getIsSignUpMutation = useGetIsSignUp()
  const signUpMutation = useSignUp()
  const signInMutation = useSignIn()
  const getRecentSnapMutation = useGetRecentSnapshot()

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const setUser = useAuthStore((state) => state.setUser)
  const setSnap = useSnapshotStore((state) => state.setSnapshot)

  useEffect(() => {
    const authenticate = async (): Promise<void> => {
      try {
        const code = new URL(window.location.href).searchParams.get("code")

        if (!code) {
          navigate(RoutePath.HOME)
          return
        }

        const _accessToken = await oauthMutation.mutateAsync(code)

        console.log("_accessToken: ", _accessToken)

        const isUserSignedUp = await getIsSignUpMutation.mutateAsync(_accessToken)

        if (!isUserSignedUp) {
          await signUpMutation.mutateAsync(_accessToken)
        }

        const { uid, nickname, accessToken } = await signInMutation.mutateAsync(_accessToken)

        // AuthStore에 사용자 정보와 토큰 저장
        setUser({ uid, nickname }, accessToken)

        // 최근 스냅샷을 가져오기
        const userSnap = await getRecentSnapMutation.mutateAsync()

        // 스냅샷이 있으면 store에 저장
        if (userSnap.id !== -1) {
          setSnap(userSnap.points.map((p) => ({ name: p.position.toLocaleLowerCase(), x: p.x, y: p.y, confidence: 1 })))
        }

        setIsLoading(false)
        navigate(RoutePath.MONITORING)
      } catch (error) {
        console.error("Error during authentication process:", error)
        setIsLoading(false)
        setIsError(true)
      }
    }

    authenticate()
  }, [])

  return (
    <div>
      <Login />
      {isLoading ? (
        "Processing..."
      ) : (
        <>
          {isError && <div>An error occurred</div>}
          {signInMutation.isSuccess && <div>Login successful!</div>}
        </>
      )}
    </div>
  )
}

export default AuthPage
