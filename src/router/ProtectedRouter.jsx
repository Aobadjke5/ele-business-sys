import { useEffect, useState } from "react"
import { PersonalInfoApi } from "../api/Center/PersonalInfoApi"
import { message } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { hadRegistered, setRegisterStatus } from "../redux/slice/RegisterStatusReducer"
import { getDataBaseInfo } from "../redux/slice/RegisterReducers"
import { setDefaultAddress, setUserInfo } from "../redux/slice/UserInfoReducer"
import { DefaultAddressApi } from "../api/Center/DefaultAddressApi"

export default function ProtectedRouter(props) {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [flag, setFlag] = useState(false)
  const [personalInfo, setPersonalInfo] = useState()
  const [status, setStatus] = useState()

  useEffect(() => {
    PersonalInfoApi().then(res => {
      setFlag(true)
      if (res.code === 200) {
        console.log(res.data)
        setPersonalInfo(res.data)
        setStatus(res.data.status)
      }
      else {
        message.warning("请重新登录!")
        navigate("/login")
      }
    }).catch(err => {
      if (err.code && err.code === 40004) {
        message.warning("请先登录!")
        navigate("/login")
        return
      }

      setFlag(false)
      console.log(err)
      message.error("连接错误，请重试!")
    })
  }, [navigate])

  useEffect(() => {
    if (status === "Waiting") {
      dispatch(setRegisterStatus({ status: "Waiting" }))
      navigate("/register")
    }
    else if (status === "None") {
      dispatch(setRegisterStatus({ status: "None" }))
      let { userName, status, ...registerParams } = personalInfo
      dispatch(getDataBaseInfo(registerParams))
      navigate("/register")
    } else {
      dispatch(hadRegistered())
    }
  }, [status, personalInfo])

  useEffect(() => {
    if (status === "Verified") {
      dispatch(setUserInfo(personalInfo))

      if (personalInfo.role === "Dealer") {
        DefaultAddressApi().then(res => {
          dispatch(setDefaultAddress(res.data.newAddress))
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }, [status, personalInfo])


  const AdminAllow = ["/", "/user", "/center", "logout"]
  const DealerAllow = ["/", "/product", "/order", "/center", "logout"]
  const SupplierAllow = ["/", "/productManage", "/order", "/center", "logout"]
  const WarehouserAllow = ["/", "/warehouseManage", "/order", "/center", "logout"]
  const specialAllow = {
    "/center/address": "Dealer"
  }
  useEffect(() => {
    const role = personalInfo && personalInfo.role

    if(specialAllow[pathname] && role && role !== specialAllow[pathname]) {
      message.error("无权限访问!")
      navigate("/")
      return
    }

    const frontPath = "/" + pathname.split("/")[1]
    if (role === "Admin") {
      if(!AdminAllow.includes(frontPath)) {
        message.error("无权限访问!")
        navigate("/")
      }
    } else if (role === "Dealer") {
      if(!DealerAllow.includes(frontPath)) {
        message.error("无权限访问!")
        navigate("/")
      }
    } else if (role === "Supplier") {
      if(!SupplierAllow.includes(frontPath)) {
        message.error("无权限访问!")
        navigate("/")
      }
    } else if (role === "Warehouser") {
      if(!WarehouserAllow.includes(frontPath)) {
        message.error("无权限访问!")
        navigate("/")
      }
    }
  }, [personalInfo, pathname])

  return (
    <>
      {flag && <>{props.children}</>}
    </>
  )
}
