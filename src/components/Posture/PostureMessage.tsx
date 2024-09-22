const PostureMessage: React.FC<{
  isSnapSaved: boolean
  isShoulderTwist: boolean | null
  isTextNeck: boolean | null
  isHandOnChin: boolean | null
  isTailboneSit: boolean | null
  hasPermission: boolean
}> = ({ isSnapSaved, isShoulderTwist, isTextNeck, isHandOnChin, isTailboneSit, hasPermission }) => {
  const getIsRight = (
    _isShoulderTwist: boolean | null,
    _isTextNeck: boolean | null,
    _isTailboneSit: boolean | null,
    _isHandOnChin: boolean | null
  ): boolean => {
    return !_isShoulderTwist && !_isTextNeck && !_isTailboneSit && !_isHandOnChin
  }

  const getMessage = (
    _isShoulderTwist: boolean | null,
    _isTextNeck: boolean | null,
    _isTailboneSit: boolean | null,
    _isHandOnChin: boolean | null
  ): string => {
    const values: string[] = []
    if (_isShoulderTwist) values.push("어깨 틀어짐")
    if (_isTextNeck) values.push("거북목")
    if (_isTailboneSit) values.push("꼬리뼈로 앉기")
    if (_isHandOnChin) values.push("턱 괴기")
    return `${values.join(", ")} 감지! 자세를 바르게 앉아주세요.`
  }

  return (
    <div
      className={`absolute top-0 flex w-full items-center justify-center rounded-t-3xl bg-[#1A1B1D] bg-opacity-75 py-[27px] text-lg font-medium ${
        !hasPermission ? "text-orange-400" : "text-white"
      }`}
    >
      {!hasPermission
        ? "브라우저의 카메라 권한을 허용해주세요."
        : !isSnapSaved
        ? "바른 자세를 취한 후, 하단의 버튼을 눌러주세요."
        : getIsRight(isShoulderTwist, isTextNeck, isTailboneSit, isHandOnChin)
        ? "올바른 자세입니다."
        : getMessage(isShoulderTwist, isTextNeck, isTailboneSit, isHandOnChin)}
    </div>
  )
}

export default PostureMessage
