import WindowIcon from "@assets/icons/download-window-icon.svg?react"
import MacIcon from "@assets/icons/download-mac-icon.svg?react"
const DownloadPage: React.FC = () => {
  return (
    <div className="flex h-[704px] flex-col items-center justify-center gap-10 bg-gradient-to-b from-white via-[#BFD9FE] to-[#8BBAFE]">
      {/* left */}
      <div className="text-center text-5xl font-bold leading-[70px] text-zinc-900">
        끈김없이 더 바른 자세 유지를 위한
        <br />
        PC용 앱을 다운받아보세요
      </div>
      <div className="flex gap-6">
        <div className="flex w-[200px] cursor-pointer items-center items-center justify-center gap-2 rounded-full bg-white py-4 text-base font-semibold leading-[24px] text-zinc-900">
          <WindowIcon />
          <div>Window OS</div>
        </div>
        <div className="flex w-[200px] cursor-pointer items-center items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-zinc-900">
          <MacIcon />
          <div>Mac OS</div>
        </div>
      </div>
    </div>
  )
}

export default DownloadPage
