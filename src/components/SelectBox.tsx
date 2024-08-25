import { useState } from "react"

interface SelectBoxProps {
  value: string
  options: string[]
  onClick: (selectedValue: string) => void
}

export default function SelectBox(props: SelectBoxProps) {
  const { value, options, onClick } = props
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option: string) => {
    onClick(option)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <div
        className="flex h-[40px] w-full cursor-pointer items-center justify-between rounded-md border border-[#E5E8EB] bg-white px-3 py-2.5"
        onClick={toggleDropdown}
      >
        <span>{value}</span>
        <svg
          className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
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
              key={option}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
