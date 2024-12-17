import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"
import SearchIcon from "@assets/icons/crew-search-icon.svg?react"

interface MyCrewHeaderProps {
  openCreateModal?: () => void
  onSearchGroups?: () => void
  isDisplayedCreationButton?: boolean
  isDisplayedSearch?: boolean
  keyword?: string
  setKeyword?: React.Dispatch<React.SetStateAction<string>>
}

export default function MyCrewHeader(props: MyCrewHeaderProps) {
  const {
    openCreateModal,
    isDisplayedCreationButton = false,
    isDisplayedSearch = false,
    onSearchGroups,
    keyword,
    setKeyword,
  } = props

  const setKeywordHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (setKeyword) setKeyword(e.target.value)
  }

  const onSearchGroupsHandler = (): void => {
    if (onSearchGroups) onSearchGroups()
  }

  return (
    <div className="mb-6 flex w-full items-baseline">
      <div className="flex-grow text-[22px] font-bold text-zinc-900">나의 크루</div>
      <div className="flex gap-3">
        {/* 크루 검색 */}
        {isDisplayedSearch && (
          <div className="box-border flex h-[44px] items-center gap-[27px] rounded-xl border border-gray-200 bg-white px-4 py-3 leading-5 outline-none">
            <input
              value={keyword}
              onChange={setKeywordHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchGroupsHandler()
              }}
              className="w-[163px] text-[13px] font-medium outline-none "
              placeholder="크루명, 태그로 검색할 수 있어요."
            />
            <SearchIcon onClick={onSearchGroups} className="cursor-pointer" />
          </div>
        )}
        {isDisplayedCreationButton && (
          <div
            className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
            onClick={openCreateModal}
          >
            <CreateCrewIcon />
            <div>크루 만들기</div>
          </div>
        )}
      </div>
    </div>
  )
}
