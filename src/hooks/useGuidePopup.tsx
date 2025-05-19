import { useGuidePopupStore } from "@/store/GuidePopupStore"
import { useSnapShotStore } from "@/store/SnapshotStore"
import { useEffect } from "react"

export const useGuidePopup = (isClosedInitialGuidePopup = false) => {
  const { isPopupOpen, lastClosedDate, openPopup, closePopup, setLastClosedDate } = useGuidePopupStore()

  const { isInitialSnapShotExist } = useSnapShotStore()
  useEffect(() => {
    const checkPopupDate = () => {
      const currentDate = new Date().toDateString()
      // if (isInitialSnapShotExist) {
      //   // 마지막 닫은 날짜만 갱신

      // }else{
      //   // 팝업 열기
      // }
      if (isInitialSnapShotExist && (!lastClosedDate || new Date(lastClosedDate) < new Date(currentDate))) {
        openPopup()
      }
    }
    if (!isClosedInitialGuidePopup) {
      checkPopupDate()
    }
  }, [lastClosedDate, openPopup, isClosedInitialGuidePopup])

  const handleClosePopup = () => {
    closePopup()
    setLastClosedDate(new Date().toDateString())
  }

  return { isPopupOpen, handleClosePopup, openPopup }
}
