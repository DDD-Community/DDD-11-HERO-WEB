import { group, groupsReq, sort } from "@/api"
import EmptyCrewImage from "@/assets/images/crew-empty.png"
import CrewItem from "@/components/Crew/CrewItem"
import { useGetGroups } from "@/hooks/useGroupMutation"
import { useModals } from "@/hooks/useModals"
import useMyGroup from "@/hooks/useMyGroup"
import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"
import SortCrewIcon from "@assets/icons/crew-sort-icon.svg?react"
import { ReactElement, useEffect, useRef, useState } from "react"
import { modals } from "../Modal/Modals"
import MyCrewRankingContainer from "./MyCrew/MyCrewRankingContainer"

const SORT_LIST = [
  { sort: "userCount,desc", label: "크루원 많은 순" },
  { sort: "createdAt,desc", label: "최신 생성 크루 순" },
]

const CrewList = (): ReactElement => {
  const { myGroupData, ranks, myRank } = useMyGroup()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  console.log("myGroupData: ", myGroupData)
  const [params, setParams] = useState<groupsReq>({
    page: 0,
    size: 10000,
    sort: "userCount,desc",
  })

  const { data, isLoading, isError, refetch } = useGetGroups(params)

  const { openModal } = useModals()

  const openCreateModal = (): void => {
    openModal(modals.createCrewModal, {
      onSubmit: () => {
        refetch()
      },
    })
  }

  const openJoinCrewModal = (id: number): void => {
    openModal(modals.joinCrewModal, {
      id,
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
    return SORT_LIST.map((s) => (
      // eslint-disable-next-line max-len
      <div
        key={`sort-list-${s.sort}`}
        className="cursor-pointer text-[13px] font-medium leading-[24px] text-zinc-400"
        onClick={() => {
          setParams({ ...params, sort: s.sort as sort })
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
          <CrewItem key={`crew-item-${g.id}`} group={g} onClickDetail={() => openJoinCrewModal(g.id)} />
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
      {myGroupData && Object.keys(myGroupData).length > 0 && (
        <MyCrewRankingContainer
          myGroupData={myGroupData}
          ranks={ranks}
          myRank={myRank}
          openCreateModal={openCreateModal}
          openInviteModal={openInviteModal}
        />
      )}
      {/* header */}
      <div className="mb-[24px] flex w-full items-center">
        <div className="flex-grow text-[22px] font-bold text-zinc-900">
          <span>전체크루</span>
          <span>{isLoading ? "" : `(${data?.totalCount})`}</span>
        </div>
        {!myGroupData ||
          (myGroupData && Object.keys(myGroupData).length === 0 && (
            <div
              className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
              onClick={openCreateModal}
            >
              <CreateCrewIcon />
              <div>크루 만들기</div>
            </div>
          ))}
      </div>

      {/* sort */}
      <div className="relative mb-[12px] text-sm font-medium text-zinc-500" ref={dropdownRef}>
        <div className="flex cursor-pointer items-center" onClick={toggleDropdown}>
          <SortCrewIcon />
          <div>{SORT_LIST.find((s) => s.sort === params.sort)?.label}</div>
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
