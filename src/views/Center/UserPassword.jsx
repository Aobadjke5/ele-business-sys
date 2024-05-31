import { Button, Input, message } from "antd"
import style from "./UserPassword.module.scss"
import PageTitle from "../../components/PageTitle/PageTitle"
import { useState } from "react"
import { verifyPassword } from "../../utils/RegisterUtils"
import { ChangePasswordApi } from "../../api/Auth/ChangePasswordApi"
import { MD5 } from "../../utils/EncipherUtils"

export default function UserPassword() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleOnClick = () => {
    if(oldPassword === "") {
      message.warning("请输入您的旧密码")
      return
    }
    if(newPassword === "") {
      message.warning("请输入您的新密码")
      return
    }
    if(newPassword !== confirmPassword) {
      message.warning("两次密码输入不一致")
      return
    }

    let PasswordVerify = verifyPassword(newPassword)
    if(!PasswordVerify.status) {
      message.warning(PasswordVerify.message)
      return
    }

    ChangePasswordApi(MD5(oldPassword), MD5(newPassword)).then((res) => {
      console.log(res)
      if(res.code === 200) {
        message.success("修改成功")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
      else if(res.code === 40002) {
        message.warning("旧密码错误")
        return
      }
      else {
        message.error("修改失败")
        return
      }
    }).catch((err) => {
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }

  return (
    <>
      <PageTitle title="修改密码" />
      <div className={style.formBox}>
        <div className={style.item}>
          <div className={style.lable}>原密码：</div>
          <div className={style.input}><Input placeholder="请输入原密码" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password"/></div>
        </div>
        <div className={style.item}>
          <div className={style.lable}>新密码：</div>
          <div className={style.input}><Input placeholder="请输入新密码" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password"/></div>
        </div>
        <div className={style.item}>
          <div className={style.lable}>确认新密码：</div>
          <div className={style.input}><Input placeholder="请确认新密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password"/></div>
        </div>
        <div className={style.item}>
          <Button type="primary" className={style.button} onClick={() => handleOnClick()}>确认修改</Button>
        </div>
      </div>
    </>
  )
}
