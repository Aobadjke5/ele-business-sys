import style from "./PageTitle.module.scss";
import { Divider } from "antd";

export default function PageTitle(props) {
  return (
    <div className={style.pageHeader}>
      <div className={style.pageToper}></div>
      <div className={style.pageTitle}>{props.title}</div>
      <Divider />
    </div>
  )
}
