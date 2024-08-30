const usePushNotification = (): any => {
  const requestNotificationPermission = async (): Promise<void> => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          console.log("Notification permission granted")
        } else {
          console.log("Notification permission denied")
        }
      } catch (error) {
        console.error("Notification permission request error:", error)
      }
    } else {
      console.error("This browser does not support notifications.")
    }
  }

  const showNotification = (body: string): void => {
    if (Notification.permission === "granted") {
      new Notification("자세 공작소", {
        body: body,
      })
    }
  }

  return { requestNotificationPermission, showNotification }
}

export default usePushNotification
