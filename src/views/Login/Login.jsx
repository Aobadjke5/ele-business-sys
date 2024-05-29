import { useNavigate } from "react-router-dom"
import style from "./Login.module.scss"
import { useState } from "react"
import { LoginApi } from "../../api/Auth/LoginApi"
import { message } from "antd"
import { MD5 } from "../../utils/EncipherUtils"
import { setToken } from "../../utils/JwtUtils"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const handleLogin = () => {
    if(username === "") {
      getMessage("warning", "请输入您的用户名")
      return
    }
    if(password === "") {
      getMessage("warning", "请输入您的密码")
      return
    }

    LoginApi(username, MD5(password)).then(res => {
      if(res.code === 400) {
        getMessage("error", "用户名或密码错误")
        setPassword("")
      } else {
        getMessage("success", "登录成功!")
        let token = res.data.token
        setToken(token)
        navigate("/")
      }
    }).catch(err => {
      getMessage("warning", "错误! 请稍后重试!")
      console.log(err)
    })
  }

  const getMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content
    })
  }

  return (
    <div className={style.background}>
      {contextHolder}
      <div className={style.con}>
        <h1>登录</h1>
        <div className={style.input}>
          <h3>用户名：</h3>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className={style.input}>
          <h3>密码：</h3>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button onClick={() => handleLogin()}>登录</button>
        <p>没有账号，前往<span onClick={() => navigate("/register")}>注册</span></p>
      </div>
    </div>
  )
}
