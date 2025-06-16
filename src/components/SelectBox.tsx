import { useState } from "react"
import DownArrowIcon from "@assets/icons/crew-side-nav-down-arrow.svg?react"

interface SelectBoxOption {
  label: string
  value: any
}

interface SelectBoxProps {
  value: string | undefined
  options: SelectBoxOption[]
  isDisabled?: boolean
  onClick: (selectedOption: SelectBoxOption) => void
}

export default function SelectBox(props: SelectBoxProps): React.ReactElement {
  const { value, options, isDisabled, onClick } = props
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = (): void => {
    if (isDisabled) return
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: SelectBoxOption): void => {
    onClick(option)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <div
        className={`flex h-[40px] w-full items-center justify-between rounded-md border border-[#E5E8EB] bg-white px-3 py-2.5 text-body3 ${
          isDisabled ? "" : "cursor-pointer"
        }`}
        onClick={toggleDropdown}
      >
        <span className={isDisabled ? "text-[#D4D4D8]" : ""}>{value}</span>
        <DownArrowIcon />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full flex-col rounded-md bg-white py-1 shadow-card">
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-3 py-2 text-body3 hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
