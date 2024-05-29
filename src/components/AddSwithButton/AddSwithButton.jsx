import { Switch } from "antd"
import style from "./AddSwithButton.module.scss"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { useState } from "react"

export default function AddSwithButton(props) {
  const [checked, setChecked] = useState(true)

  const handleChanged = (checked) => {
    setChecked(checked)
    props.onChange(checked)
  }

  return (
    <div className={style.switchOption} style={props.style}>
      <div className={style.label}>{props.title}</div>
      <div className={style.swich}>
        <Switch
          checked={checked}
          onChange={(checked) => handleChanged(checked)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </div>
    </div>
  )
}
