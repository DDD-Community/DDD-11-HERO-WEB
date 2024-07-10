const usePushNotification = (): any => {
  const requestNotificationPermission = async (): Promise<void> => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted");
        } else {
          console.log("Notification permission denied");
        }
      } catch (error) {
        console.error("Notification permission request error:", error);
      }
    } else {
      console.error("This browser does not support notifications.");
    }
  };

  const showNotification = (): void => {
    if (Notification.permission === "granted") {
      new Notification("Hello!", {
        body: "거북목 상태입니다. 자세를 바르게 하세요.",
      });
    }
  };

  return { requestNotificationPermission, showNotification };
};

export default usePushNotification;
