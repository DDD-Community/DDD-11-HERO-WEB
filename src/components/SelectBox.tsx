import { useState } from "react"

interface SelectBoxOption {
  label: string
  value: any
}

interface SelectBoxProps {
  value: string | undefined
  options: SelectBoxOption[]
  isDisabled: boolean
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
        className={`flex h-[40px] w-full items-center justify-between rounded-md border border-[#E5E8EB] bg-white px-3 py-2.5 ${
          isDisabled ? "" : "cursor-pointer"
        }`}
        onClick={toggleDropdown}
      >
        <span className={isDisabled ? "text-[#D4D4D8]" : ""}>{value}</span>
        <svg
          className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""} ${
            isDisabled ? "text-[#D4D4D8]" : ""
          }`}
          fill={isDisabled ? "#D4D4D8" : ""}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full flex-col rounded-md bg-white py-1 shadow-[0px_2px_16px_0px_rgba(0,0,0,0.13)]">
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
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
