import { Input } from "antd";
import style from "../User.module.scss"
import { ContactsOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";


export default function UserPeopleInfo(props) {
  return (
    <div>
      <div className={style.rowInfoItem}>
        <ContactsOutlined />
        <div className={style.ItemContent}>
          <div className={style.label}>联系人姓名：</div>
          <Input className={style.input} disabled value={props.peopleName} />
        </div>
      </div>
      <div className={style.rowInfoItem}>
        <PhoneOutlined />
        <div className={style.ItemContent}>
          <div className={style.label}>联系人电话：</div>
          <Input className={style.input} disabled value={props.peopleTel} />
        </div>
      </div>
      <div className={style.rowInfoItem}>
        <MailOutlined />
        <div className={style.ItemContent}>
          <div className={style.label}>联系人邮箱：</div>
          <Input className={style.input} disabled value={props.peopleMail} />
        </div>
      </div>
    </div>
  )
}
