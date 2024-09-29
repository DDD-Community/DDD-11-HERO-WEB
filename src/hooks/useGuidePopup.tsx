import { useGuidePopupStore } from "@/store/GuidePopupStore"
import { useEffect } from "react"

export const useGuidePopup = (isClosedInitialGuidePopup: boolean = false) => {
  const { isPopupOpen, lastClosedDate, openPopup, closePopup, setLastClosedDate } = useGuidePopupStore()

  useEffect(() => {
    const checkPopupDate = () => {
      const currentDate = new Date().toDateString()
      if (!lastClosedDate || new Date(lastClosedDate) < new Date(currentDate)) {
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
