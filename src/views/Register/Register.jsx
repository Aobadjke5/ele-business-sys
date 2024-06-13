import { Button, Steps, message } from "antd"
import { useEffect, useState } from "react"
import style from "./register.module.scss"
import { useNavigate } from "react-router-dom"
import { verifyPassword, verifyUsername } from "../../utils/RegisterUtils"
import { RegisterApi } from "../../api/Auth/RegisterApi"
import { MD5 } from "../../utils/EncipherUtils"
import { setToken } from "../../utils/JwtUtils"
import { RegisterStep1, RegisterStep2, RegisterStep3 } from "../../api/Auth/RegisterStep"
import MyUpload from "../../components/MyUpload/MyUpload"
import store from "../../redux/store"
import { useDispatch } from "react-redux"
import { clear, getStep1Info, getStep2Info, getStep3Info } from "../../redux/slice/RegisterReducers"
import { hadRegistered } from "../../redux/slice/RegisterStatusReducer"

export default function Register() {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const stepItems = [{ title: "账号注册" }, { title: "公司认证" }, { title: "图标上传" }, { title: "联系人信息" }, { title: "等待审核" }]
  const stepComponent = [ <Step1 key={0} next={() => {setCurrent(1)}}/>,
                          <Step2 key={1} next={() => {setCurrent(2)}}/>, 
                          <Step3 key={2} pre={() => {setCurrent(1)}} next={() => {setCurrent(3)}}/>, 
                          <Step4 key={3} pre={() => {setCurrent(2)}} next={() => {setCurrent(4)}}/>,
                          <Step5 key={4}/>]

  const state = store.getState()
  useEffect(() => {
    if(state.registerStatus.flag) {
      if(state.registerStatus.status === "Waiting") {
        setCurrent(4)
      }
      if(state.registerStatus.status === "None") {
        setCurrent(1)
      }
      dispatch(hadRegistered())
    }
  }, [state, dispatch])

  return (
    <div className={style.background}>
      <div className={style.con}>
        <div>
          <Steps current={current} items={stepItems} direction="vertical" />
        </div>
        <div className={style.right}>{stepComponent[current]}</div>
      </div>
    </div>
  )
}

function Step1(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const handleOnclickNextButton = () => {
    if(username === "") {
      message.warning("请输入您的用户名")
      return
    }
    if(password === "") {
      message.warning("请输入您的密码")
      return
    }
    if(password !== password2) {
      message.warning("两次密码输入不一致")
      return
    }

    let UsernameVerify = verifyUsername(username)
    if(!UsernameVerify.status) {
      message.warning(UsernameVerify.message)
      return
    }
    let PasswordVerify = verifyPassword(password)
    if(!PasswordVerify.status) {
      message.warning(PasswordVerify.message)
      return
    }

    RegisterApi(username, MD5(password)).then(res => {
      if(res.code === 200) {
        message.success("注册成功")
        let token = res.data.token
        setToken(token)
        dispatch(clear)
        props.next()
      } else {
        message.error("当前用户名已存在，请更换用户名")
        setUsername("")
        setPassword("")
        setPassword2("")
      }
    }).catch(err => {
      message.error("服务器忙，请稍后重试")
      console.log(err)
    })
  }

  return (
    <>
      <h1>注册</h1>
      <div className={style.input}>
        <h3>用户名：</h3>
        <input type="text" placeholder="请输入您的用户名" value={username} onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div className={style.input}>
        <h3>设置密码：</h3>
        <input type="password" placeholder="请输入您的密码" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className={style.input}>
        <h3>确认密码：</h3>
        <input type="password" placeholder="请再次确认您的密码" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
      </div>
      <div className={style.btn}>
        <Button type="default" onClick={() => {navigate("/login")}}>取消</Button>
        <Button type="primary" onClick={() => handleOnclickNextButton()}>下一步</Button>
      </div>
    </>
  )
}

function Step2(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const switchSelect = (index) => {
    if(current !== index) setCurrent(index)
  }

  const state = store.getState()
  useEffect(() => {
    console.log(state)
    if(state.register.role === "Dealer") {
      setCurrent(0)
    } else if(state.register.role === "Supplier") {
      setCurrent(1)
    } else {
      setCurrent(2)
    }
    
    setCompanyName(state.register.companyName)
    setCompanyAddress(state.register.companyAddress)
  }, [state])

  const handleOnclickNextButton = () => {
    if(companyName === "") {
      message.warning("请输入公司名称")
      return
    }
    if(companyAddress === "") {
      message.warning("请输入公司地址")
      return
    }

    let role = current === 0 ? "Dealer" : current === 1 ? "Supplier" : "Warehouser"
    RegisterStep1(role, companyName, companyAddress).then(res => {
      if(res.code === 200) {
        message.success("公司信息提交成功")
        dispatch(getStep1Info({
          role: role,
          companyName: companyName,
          companyAddress: companyAddress
        }))
        props.next()
      } else {
        message.error("公司信息提交失败")
      }
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      message.error("服务器忙，请稍后重试")
      console.log(err)
    })
  }

  return (
    <>
      <div className={style.roleSelect}>
        <div className={style.selectFirst + " " + (current === 0 ? style.activeSelect : "")} onClick={() => {switchSelect(0)}}>经销商</div>
        <div className={style.selectSecond + " " + (current === 1 ? style.activeSelect : "")} onClick={() => {switchSelect(1)}}>供应商</div>
        <div className={style.selectThird + " " + (current === 2 ? style.activeSelect : "")} onClick={() => {switchSelect(2)}}>第三方仓库</div>
      </div>
      <div className={style.input}>
        <h3>公司名称：</h3>
        <input placeholder="请输入公司名称" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
      </div>
      <div className={style.input}>
        <h3>地址：</h3>
        <textarea placeholder="请输入公司地址" type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)}/>
      </div>
      <Button className={style.btn1} type="primary" onClick={() => handleOnclickNextButton()}>下一步</Button>
    </>
  )
}

function Step3(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [companyImage, setCompanyImage] = useState("")

  const state = store.getState()
  useEffect(() => {
    console.log(state)
    setCompanyImage(state.register.companyIcon)
  }, [state])
  useEffect(() => {
    console.log(companyImage, "$$$$")
  }, [companyImage])

  const handleOnclickNextButton = () => {
    if(companyImage === "") {
      message.warning("请上传公司图标")
      return
    }

    RegisterStep2(companyImage).then(res => {
      if(res.code === 200) {
        message.success("公司图标上传成功")
        dispatch(getStep2Info({companyIcon: companyImage}))
        props.next()
      } else {
        message.error("公司图标上传失败")
      }
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      message.error("服务器忙，请稍后重试")
      console.log(err)
    })
  }

  return (
    <>
      <h1>图标上传</h1>
      <MyUpload type="company" className={style.upload} imageURL={companyImage} getNewImageURL={(newImage) => setCompanyImage(newImage)}/>
      <div className={style.btn}>
        <Button type="default" onClick={() => {props.pre()}}>上一步</Button>
        <Button type="primary" onClick={() => handleOnclickNextButton()}>下一步</Button>
      </div>
    </>
  )
}

function Step4(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [peopleName, setPeopleName] = useState("")
  const [peopleTel, setPeopleTel] = useState("")
  const [peopleMail, setPeopleMail] = useState("")

  const state = store.getState()
  useEffect(() => {
    setPeopleName(state.register.peopleName)
    setPeopleTel(state.register.peopleTel)
    setPeopleMail(state.register.peopleMail)
  }, [state])

  const handleOnclickNextButton = () => {
    if(peopleName === "") {
      message.warning("请输入联系人姓名")
      return
    }
    if(peopleTel === "") {
      message.warning("请输入联系人电话")
      return
    }
    if(peopleMail === "") {
      message.warning("请输入联系人邮箱")
      return
    }

    RegisterStep3(peopleName, peopleTel, peopleMail).then(res => {
      if(res.code === 200) {
        message.success("公司联系人信息上传成功")
        dispatch(getStep3Info({
          peopleName: peopleName,
          peopleTel: peopleTel,
          peopleMail: peopleMail
        }))
        props.next()
      } else {
        message.error("公司联系人信息上传失败")
      }
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      message.error("服务器忙，请稍后重试")
      console.log(err)
    })
  }

  return (
    <>
      <h1>联系人信息</h1>
      <div className={style.input}>
        <h3>联系人姓名：</h3>
        <input placeholder="请输入联系人姓名" type="text" value={peopleName} onChange={(e) => setPeopleName(e.target.value)}/>
      </div>
      <div className={style.input}>
        <h3>联系人电话：</h3>
        <input placeholder="请输入联系人电话" type="text" value={peopleTel} onChange={(e) => setPeopleTel(e.target.value)}/>
      </div>
      <div className={style.input}>
        <h3>联系人邮箱：</h3>
        <input placeholder="请输入联系人邮箱" type="text" value={peopleMail} onChange={(e) => setPeopleMail(e.target.value)}/>
      </div>
      <div className={style.btn}>
        <Button type="default" onClick={() => {props.pre()}}>上一步</Button>
        <Button type="primary" onClick={() => handleOnclickNextButton()}>提交</Button>
      </div>
    </>
  )
}

function Step5() {
  return (
    <>
      <h1>等待审核</h1>
    </>
  )
}
