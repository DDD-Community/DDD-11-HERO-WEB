import { useGuidePopupStore } from "@/store/GuidePopupStore"
import { useEffect } from "react"

export const useGuidePopup = () => {
  const { isPopupOpen, lastClosedDate, openPopup, closePopup, setLastClosedDate } = useGuidePopupStore()

  useEffect(() => {
    const checkPopupDate = () => {
      const currentDate = new Date().toDateString()
      if (!lastClosedDate || new Date(lastClosedDate) < new Date(currentDate)) {
        openPopup()
      }
    }

    checkPopupDate()
  }, [lastClosedDate, openPopup])

  const handleClosePopup = () => {
    closePopup()
    setLastClosedDate(new Date().toDateString())
  }

  return { isPopupOpen, handleClosePopup, openPopup }
}
