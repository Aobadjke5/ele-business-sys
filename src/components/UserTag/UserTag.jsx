import { Tag } from "antd";
import style from "./UserTag.module.scss"

export default function UserTag(props) {
  if(props.role === "Admin") {
    return <Tag color="#f50" className={style.userTag}>管理员</Tag>
  } else if(props.role === "Dealer") {
    return <Tag color="#2db7f5" className={style.userTag}>经销商</Tag>
  } else if(props.role === "Supplier") {
    return <Tag color="#108ee9" className={style.userTag}>供货商</Tag>
  } else if(props.role === "Warehouser") {
    return <Tag color="#87d068" className={style.userTag}>第三方仓库</Tag>
  }
}
