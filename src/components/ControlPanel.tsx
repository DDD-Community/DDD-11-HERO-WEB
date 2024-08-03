import React from "react"

interface ControlPanelProps {
  onChangeTranslation: React.ChangeEventHandler<HTMLInputElement>
}

export default function ControlPanel(props: ControlPanelProps) {
  const { onChangeTranslation } = props
  return (
    <div style={{display : 'none'}}>
      <div>
        <div>좌우 이동</div>
        <input id="horizontal" type="range" min={-100} max={100} onChange={onChangeTranslation}></input>
        <div>상하 이동</div>
        <input id="vertical" type="range" min={-100} max={100} onChange={onChangeTranslation}></input>
        <div>크기 변경</div>
        <input id="scale" type="range" min={0} max={100} onChange={onChangeTranslation}></input>
      </div>
    </div>
  )
}
