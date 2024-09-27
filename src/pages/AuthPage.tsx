import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOauth, useSignUp, useSignIn, useGetIsSignUp } from "@/hooks/useAuthMutation"
import RoutePath from "@/constants/routes.json"
import { useAuthStore } from "@/store/AuthStore"
import { useSnapShotStore } from "@/store/SnapshotStore"
import { getRecentSnapshot } from "@/api"
import Lottie from "react-lottie"
import LoginLottie from "@assets/animation/login-lottie.json"
// import { useGetNoti } from "@/hooks/useNotiMutation"
// import { useNotificationStore } from "@/store/NotificationStore"

const AuthPage: React.FC = () => {
  const navigate = useNavigate()

  const oauthMutation = useOauth()
  const getIsSignUpMutation = useGetIsSignUp()
  const signUpMutation = useSignUp()
  const signInMutation = useSignIn()
  // const getNotiMutation = useGetNoti()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const setUser = useAuthStore((state) => state.setUser)
  const { setSnapShot } = useSnapShotStore()
  // const setNoti = useNotificationStore((state) => state.setNotification)

  useEffect(() => {
    const authenticate = async (): Promise<void> => {
      try {
        const code = new URL(window.location.href).searchParams.get("code")

        if (!code) {
          navigate(RoutePath.HOME)
          return
        }

        const _accessToken = await oauthMutation.mutateAsync(code)

        const isUserSignedUp = await getIsSignUpMutation.mutateAsync(_accessToken)

        if (!isUserSignedUp) {
          await signUpMutation.mutateAsync(_accessToken)
        }

        const { uid, nickname, accessToken } = await signInMutation.mutateAsync(_accessToken)

        // AuthStore에 사용자 정보와 토큰 저장
        setUser({ uid, nickname }, accessToken)

        // 최근 스냅샷을 가져오기
        const userSnap = await getRecentSnapshot()

        // 스냅샷이 있으면 store에 저장
        if (userSnap.id !== -1 && userSnap.points.length !== 0) {
          setSnapShot(
            userSnap.points.map((p) => ({ name: p.position.toLocaleLowerCase(), x: p.x, y: p.y, confidence: 1 }))
          )
        }

        // const notification = await getNotiMutation.mutateAsync()
        // // notification 설정 없으면 기본값(틀어진 즉시)로 설정
        // if (!notification) {
        //   setNoti({ isActive: false, duration: "IMMEDIATELY" })
        // } else {
        //   setNoti({ isActive: true, ...notification })
        // }

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
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-1">
      {isLoading ? (
        <>
          <Lottie
            options={{
              // loop: false,
              autoplay: true,
              animationData: LoginLottie,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={250}
            width={250}
          />
          <div>로그인 중입니다.</div>
        </>
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
