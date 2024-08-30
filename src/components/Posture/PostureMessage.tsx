const PostureMessage: React.FC<{
  isSnapSaved: boolean
  isShoulderTwist: boolean | null
  isTextNeck: boolean | null
  isHandOnChin: boolean | null
  isTailboneSit: boolean | null
}> = ({ isSnapSaved, isShoulderTwist, isTextNeck, isHandOnChin, isTailboneSit }) => {
  const getIsRight = (
    _isShoulderTwist: boolean | null,
    _isTextNeck: boolean | null,
    _isTailboneSit: boolean | null,
    _isHandOnChin: boolean | null
  ): boolean => {
    return !_isShoulderTwist && !_isTextNeck && !_isTailboneSit && !_isHandOnChin
  }

  return (
    <div className="absolute top-0 flex w-full items-center justify-center rounded-t-lg bg-[#1A1B1D] bg-opacity-75 p-[20px] text-white">
      {!isSnapSaved
        ? "바른 자세를 취한 후, 하단의 버튼을 눌러주세요."
        : getIsRight(isShoulderTwist, isTextNeck, isHandOnChin, isTailboneSit)
        ? "올바른 자세입니다."
        : "올바르지 않은 자세입니다."}
    </div>
  )
}

export default PostureMessage
