import { Button, Collapse, Empty, Input, message } from "antd";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useEffect, useState } from "react";
import { WaitingUserListApi } from "../../api/User/WaitingUserListApi"
import style from "./User.module.scss"
import UserTag from "../../components/UserTag/UserTag";
import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import UserPeopleInfo from "./component/UserPeopleInfo";
import { UserVerifyApi } from "../../api/User/UserVerifyApi";
import { useSelector } from "react-redux";

export default function UserCheck() {
  const [userList, setUserList] = useState([])
  const [items, setItems] = useState([])
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if(userRole === "Admin") {
      WaitingUserListApi().then(res => {
        console.log(res);
        setUserList(res.data.userList)
      }).catch(err => {
        message.warning("网络错误，请稍后重试")
        console.log(err)
      })
    }
    
  }, [userRole])

  const deleteUserItem = (userID) => {
    setUserList(userList.filter(item => item.userID !== userID))
  }

  useEffect(() => {
    setItems(userList.map(item => {
      return {
        key: item.userID,
        label: item.companyName,
        children: <UserCheckBox {...item} optionSuccess={(userID) => deleteUserItem(userID)}/>
      }
    }))
  }, [userList])

  return (
    <div>
      <PageTitle title="用户审核" />
      {userList.length === 0 ? <Empty style={{ marginTop: "100px" }} /> : <Collapse accordion items={items} size="large" />}
    </div>
  )
}

const UserCheckBox = (props) => {
  const handlePass = (userID) => {
    console.log("pass", userID)
    UserVerifyApi(userID, "pass").then(res => {
      console.log(res);
      if(res.code === 200) {
        message.success("操作成功")
        props.optionSuccess(userID)
      } else {
        message.error("操作失败")
      }
    }).catch(err => {
      message.warning("网络错误，请稍后重试")
      console.log(err)
    })
  }
  const handleForbidden = (userID) => {
    console.log("forbidden", userID)
    UserVerifyApi(userID, "forbidden").then(res => {
      if(res.code === 200) {
        message.success("操作成功")
        props.optionSuccess(userID)
      } else {
        message.error("操作失败")
      }
    }).catch(err => {
      message.warning("网络错误，请稍后重试")
      console.log(err)
    })
  }

  return (
    <div className={style.checkBox}>
      <div className={style.checkBox2}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.companyIcon} alt="company" />
        <div className={style.textInfo}>
          <div className={style.firstRow}>
            <div style={{ marginRight: "15px" }}>{props.companyName}</div>
            <UserTag role={props.role} />
          </div>
          <div className={style.secondRow}>
            <div className={style.info}>
              <div>
                <div className={style.rowInfoItem + " " + style.checkBoxItem}>
                  <UserOutlined />
                  <div className={style.ItemContent}>
                    <div className={style.label}>用&nbsp;户&nbsp;名：</div>
                    <Input className={style.input} disabled value={props.userName} />
                  </div>
                </div>
                <div className={style.rowInfoItem + " " + style.checkBoxItem} style={{ height: "90px" }}>
                  <EnvironmentOutlined />
                  <div className={style.ItemContent}>
                    <div className={style.label} style={{ height: "90px", lineHeight: "90px" }}>公司地址：</div>
                    <Input.TextArea className={style.input} disabled value={props.companyAddress} style={{ height: "80px", lineHeight: "20px" }} />
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: "30px" }}>
                <UserPeopleInfo peopleName={props.peopleName} peopleTel={props.peopleTel} peopleMail={props.peopleMail} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.bottomButton}>
        <Button size="large" onClick={() => handleForbidden(props.userID)}>打回申请</Button>
        <Button type="primary" size="large" onClick={() => handlePass(props.userID)}>通过注册</Button>
      </div>
    </div>
  )
}