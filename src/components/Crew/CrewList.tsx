import { group, groupsReq } from "@/api"
import EmptyCrewImage from "@/assets/images/crew-empty.png"
import CrewItem from "@/components/Crew/CrewItem"
import { useGetGroups } from "@/hooks/useGroupMutation"
import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"
import SortCrewIcon from "@assets/icons/crew-sort-icon.svg?react"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useModals } from "@/hooks/useModals"
import MyCrewRankingContainer from "./MyCrewRankingContainer"
import { modals } from "../Modal/Modals"

const SORT_LIST = [
  { sort: "userCount,desc", label: "크루원 많은 순" },
  { sort: "createdAt,desc", label: "최신 생성 크루 순" },
]

const CrewList = (): ReactElement => {
  const [sort, setSort] = useState<number>(0)
  const [mode] = useState<"my" | "list">("my")
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const [params] = useState<groupsReq>({
    page: 0,
    size: 10,
    sort: "userCount,desc",
  })

  const { data, isLoading, isError } = useGetGroups(params)

  const { openModal } = useModals()

  const openCreateModal = (): void => {
    openModal(modals.createCrewModal, {
      onSubmit: () => {
        console.log("open")
      },
    })
  }

  const openJoinCrewModal = (): void => {
    openModal(modals.joinCrewModal, {
      onSubmit: () => {
        console.log("open")
      },
    })
  }

  const openInviteModal = (): void => {
    openModal(modals.inviteCrewModal, {
      onSubmit: () => {
        console.log("open")
      },
    })
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (): void => {
    setIsDropdownOpen((prev) => !prev)
  }

  const createSortList = (): JSX.Element[] => {
    return SORT_LIST.map((s, i) => (
      // eslint-disable-next-line max-len
      <div
        key={`sort-list-${s.sort}`}
        className="cursor-pointer text-[13px] font-medium leading-[24px] text-zinc-400"
        onClick={() => {
          setSort(i)
          setIsDropdownOpen(false)
        }}
      >
        {s.label}
      </div>
    ))
  }

  const createGroupList = (_groups: group[] | undefined): JSX.Element | null => {
    if (!_groups) return null

    if (_groups.length === 0) {
      return (
        <div className="flex flex-grow flex-col items-center justify-center">
          <img src={EmptyCrewImage} alt="empty crew" />
          <div className="text-center text-[14px] font-semibold leading-[22px]">{"만들어진 크루가 아직 없습니다."}</div>
        </div>
      )
    }
    return (
      <div className="flex flex-grow flex-col gap-[8px]">
        {_groups.map((g) => (
          <CrewItem key={`crew-item-${g.id}`} group={g} onClickDetail={openJoinCrewModal} />
        ))}
      </div>
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div className="flex h-full w-full flex-col">
      {mode === "my" && <MyCrewRankingContainer openCreateModal={openCreateModal} openInviteModal={openInviteModal} />}
      {/* header */}
      <div className="mb-[24px] flex w-full items-center">
        <div className="flex-grow text-[22px] font-bold text-zinc-900">전체크루(0)</div>
        {mode === "list" && (
          <div
            className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
            onClick={openCreateModal}
          >
            <CreateCrewIcon />
            <div>크루 만들기</div>
          </div>
        )}
      </div>

      {/* sort */}
      <div className="relative mb-[12px] text-sm font-medium text-zinc-500" ref={dropdownRef}>
        <div className="flex cursor-pointer items-center" onClick={toggleDropdown}>
          <SortCrewIcon />
          <div>{SORT_LIST[sort].label}</div>
        </div>

        {/* dropdown */}
        <div
          className={`absolute flex transform flex-col items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg transition-all duration-300 ${
            isDropdownOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          {createSortList()}
        </div>
      </div>

      {/* list */}
      {isLoading ? "로딩 중입니다..." : isError ? "데이터를 불러오는데 실패했습니다." : createGroupList(data?.data)}
    </div>
  )
}

export default CrewList
