import { group, groupsReq, sort } from "@/api"
import EmptyCrewImage from "@/assets/images/crew-empty.png"
import CrewItem from "@/components/Crew/CrewItem"
import { useGetGroups } from "@/hooks/useGroupMutation"
import { useModals } from "@/hooks/useModals"
import useMyGroup from "@/hooks/useMyGroup"
import CreateCrewIcon from "@assets/icons/crew-create-button-icon.svg?react"
import SortCrewIcon from "@assets/icons/crew-sort-icon.svg?react"
import { ReactElement, useCallback, useEffect, useRef, useState, useMemo } from "react"
import { modals } from "../Modal/Modals"
import MyCrewRankingContainer from "./MyCrew/MyCrewRankingContainer"
import { useNavigate, useSearchParams } from "react-router-dom"
import RoutePath from "@/constants/routes.json"
import SearchIcon from "@assets/icons/crew-search-icon.svg?react"

const SORT_LIST = [
  { sort: "userCount,desc", label: "크루원 많은 순" },
  { sort: "createdAt,desc", label: "최신 생성 크루 순" },
]

const CrewList = (): ReactElement => {
  const navigate = useNavigate()
  const { myGroupData, ranks, myRank, refetchAll, isLoading: isGroupLoading } = useMyGroup()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  // Dropdown 외부 클릭 감지 메모이제이션
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [keyword, setKeyword] = useState<string>("") // 검색 상태 추가
  const [searchParams, setSearchParams] = useSearchParams()

  const [params, setParams] = useState<groupsReq>({
    page: 0,
    size: 10000,
    sort: "userCount,desc",
    keyword: "",
  })

  const { data, isLoading, isError, refetch } = useGetGroups(params)
  const { openModal } = useModals()

  // 가입 혹은 그룹 생성 후 최상단으로 이동
  const scrollToTop = useCallback((): void => {
    const el = document.getElementById("main-content")
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  // openCreateModal 메모이제이션
  const openCreateModal = useCallback((): void => {
    if (myGroupData) {
      openModal(modals.ToWithdrawModal, {
        onSubmit: () => {
          navigate(RoutePath.MYCREW)
        },
      })
    } else {
      openModal(modals.createCrewModal, {
        onSubmit: () => {
          refetch()
          refetchAll()
          scrollToTop()
        },
      })
    }
  }, [myGroupData, navigate, openModal, refetch, refetchAll])

  // openJoinCrewModal 메모이제이션
  const openJoinCrewModal = useCallback(
    (id: number | undefined): void => {
      openModal(modals.joinCrewModal, {
        id,
        onSubmit: () => {
          refetch()
          refetchAll()
          scrollToTop()
        },
      })
    },
    [openModal]
  )

  // openInviteModal 메모이제이션
  const openInviteModal = useCallback((): void => {
    openModal(modals.inviteCrewModal, {
      id: Number(myGroupData?.id),
    })
  }, [myGroupData, openModal])

  // toggleDropdown 함수
  const toggleDropdown = (): void => {
    setIsDropdownOpen((prev) => !prev)
  }

  // createSortList 메모이제이션
  const createSortList = useMemo(() => {
    return SORT_LIST.map((s) => (
      <div
        key={`sort-list-${s.sort}`}
        className="cursor-pointer text-[13px] font-medium leading-[24px] text-zinc-400"
        onClick={() => {
          setParams((prev) => ({ ...prev, sort: s.sort as sort }))
          setIsDropdownOpen(false)
        }}
      >
        {s.label}
      </div>
    ))
  }, [])

  // createGroupList 메모이제이션
  const createGroupList = useCallback(
    (_groups: group[] | undefined, keyword: string): JSX.Element | null => {
      if (!_groups) return null

      if (_groups.length === 0) {
        return (
          <div className="flex flex-grow flex-col items-center justify-center">
            <img src={EmptyCrewImage} alt="empty crew" />
            <div className="text-center text-[14px] font-semibold leading-[22px]">
              {"만들어진 크루가 아직 없습니다."}
            </div>
          </div>
        )
      }

      return (
        <div className="flex flex-grow flex-col gap-[8px]">
          {_groups.map((g) => (
            <CrewItem
              key={`crew-item-${g.id}`}
              group={g}
              keyword={keyword}
              onClickDetail={() => openJoinCrewModal(g.id)}
            />
          ))}
        </div>
      )
    },
    [openJoinCrewModal]
  )

  const onSearchGroups = (): void => {
    setParams((params) => ({ ...params, keyword }))
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
  }, [])

  // URL에서 groupId 추출 후 모달 열기
  useEffect(() => {
    const groupId = searchParams.get("groupId")

    if (groupId) {
      openJoinCrewModal(Number(groupId))
      const removeGroupIdFromUrl = (): void => {
        searchParams.delete("groupId")
        setSearchParams(searchParams)
      }
      removeGroupIdFromUrl()
    }
  }, [openJoinCrewModal, searchParams, setSearchParams])

  return (
    <div className="flex h-full w-full flex-col">
      {myGroupData && Object.keys(myGroupData).length > 0 && !params.keyword && (
        <MyCrewRankingContainer
          isLoading={isGroupLoading}
          myGroupData={myGroupData}
          ranks={ranks}
          myRank={myRank}
          openCreateModal={openCreateModal}
          openInviteModal={openInviteModal}
          onSearchGroups={onSearchGroups}
          keyword={keyword}
          setKeyword={setKeyword}
        />
      )}

      {/* header */}
      <div className="mb-[24px] flex w-full items-center">
        <div className="flex-grow text-[22px] font-bold text-zinc-900">
          <span>전체크루</span>
          <span>{isLoading ? "" : `(${data?.totalCount})`}</span>
        </div>
        {(!myGroupData || (myGroupData && Object.keys(myGroupData).length === 0) || params.keyword) && (
          <div className="flex gap-3">
            {/* 크루 검색 */}
            <div className="box-border flex h-[44px] items-center gap-[27px] rounded-xl border border-gray-200 bg-white px-4 py-3 leading-5 outline-none">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearchGroups()
                }}
                className="w-[163px] text-[13px] font-medium outline-none "
                placeholder="크루명, 태그로 검색할 수 있어요."
              />
              <SearchIcon onClick={onSearchGroups} className="cursor-pointer" />
            </div>
            {/* 크루 만들기 */}
            <div
              className="flex w-[138px] cursor-pointer items-center justify-center gap-[10px] rounded-[33px] bg-zinc-800 p-[10px] text-sm font-semibold text-white"
              onClick={openCreateModal}
            >
              <CreateCrewIcon />
              <div>크루 만들기</div>
            </div>
          </div>
        )}
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
          {createSortList}
        </div>
      </div>

      {/* list */}
      {isError ? "데이터를 불러오는데 실패했습니다." : createGroupList(data?.data, params.keyword)}
    </div>
  )
}

export default CrewList
