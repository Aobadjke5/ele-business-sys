import { useDispatch, useSelector } from "react-redux"
import PageTitle from "../../components/PageTitle/PageTitle"
import UserTag from "../../components/UserTag/UserTag"
import style from "./UserInfo.module.scss"
import { useEffect, useState } from "react"
import { PersonalInfoApi } from "../../api/Center/PersonalInfoApi"
import { Button, Input, message } from "antd"
import { UserOutlined, EnvironmentOutlined } from "@ant-design/icons"
import MyUpload from "../../components/MyUpload/MyUpload"
import { setUserInfo } from "../../redux/slice/UserInfoReducer"
import { EditPersonalInfoApi } from "../../api/Center/EditPersonalInfoApi"
import { EditAdminInfoApi } from "../../api/Center/EditAdminInfoApi"
import { useNavigate } from "react-router-dom"

export default function UserInfo() {
  return (
    <>
      <PageTitle title="账户信息" />
      <UserInfoCard />
    </>
  )
}

const UserInfoCard = () => {
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const userRole = useSelector(state => state.userInfo.role)
  const [companyImage, setCompanyImage] = useState()
  const [companyName, setCompanyName] = useState()
  const [companyAddress, setCompanyAddress] = useState()
  const [userName, setUserName] = useState()
  const [peopleName, setPeopleName] = useState()
  const [peopleTel, setPeopleTel] = useState()
  const [peopleMail, setPeopleMail] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    PersonalInfoApi().then(res => {
      console.log(res.data)
      setCompanyImage(res.data.companyIcon)
      setCompanyName(res.data.companyName)
      setUserName(res.data.userName)
      setCompanyAddress(res.data.companyAddress)
      setPeopleName(res.data.peopleName)
      setPeopleTel(res.data.peopleTel)
      setPeopleMail(res.data.peopleMail)
      dispatch(setUserInfo(res.data))
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }, [])

  const handleOnSaveClick = () => {
    EditPersonalInfoApi(companyName, companyImage, companyAddress, peopleName, peopleTel, peopleMail).then(res => {
      if (res.code === 200) {
        message.success("修改成功")
        setCompanyImage(res.data.companyIcon)
        setCompanyName(res.data.companyName)
        setUserName(res.data.userName)
        setCompanyAddress(res.data.companyAddress)
        setPeopleName(res.data.peopleName)
        setPeopleTel(res.data.peopleTel)
        setPeopleMail(res.data.peopleMail)
        dispatch(setUserInfo(res.data))
        setEdit(false)
      } else {
        message.error("修改失败")
      }
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }

  const handleOnSaveAdminClick = () => {
    EditAdminInfoApi(companyName, companyImage).then(res => {
      console.log(res)
      if(res.code === 200) {
        message.success("修改成功")
        setCompanyImage(res.data.companyIcon)
        setCompanyName(res.data.companyName)
        dispatch(setUserInfo(res.data))
        setEdit(false)
      } else {
        message.error("修改失败")
      }
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }

  if (userRole === "Admin") {
    return (
      <div className={style.userInfoCard}>
        <div className={style.baseInfo}>
          <div className={style.leftImage}>
            {edit ? <MyUpload type="company" getNewImageURL={(newImage) => setCompanyImage(newImage)} imageURL={companyImage} className={style.img} /> : (
              <img src={import.meta.env.VITE_API_BASE_URL + companyImage} alt="companyImage" />
            )}
          </div>
          <div className={style.rightInfo}>
            <div className={style.companyName}>
              {edit ? <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /> : companyName}
              <div className={style.tag}>
                <UserTag role={userRole} />
              </div>
            </div>
            <div className={style.userName}>
              <UserOutlined />
              <div className={style.userNameBox}>
                <div style={{ fontWeight: 700, lineHeight: "34px" }}>userName: </div>
                <div style={{ marginLeft: "20px" }}><Input value={userName} disabled={true} /></div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.optionButton}>
          {
            edit ? (
              <div>
                <Button onClick={() => setEdit(false)}>取消</Button>
                <Button type="primary" className={style.submitButton} onClick={() => handleOnSaveAdminClick()}>保存</Button>
              </div>
            ) : <Button type="primary" onClick={() => setEdit(true)}>编辑</Button>
          }
        </div>
      </div>
    )
  }
  else {
    return (
      <div className={style.userInfoCard}>
        <div className={style.baseInfo}>
          <div className={style.leftImage}>
            {edit ? <MyUpload type="company" getNewImageURL={(newImage) => setCompanyImage(newImage)} imageURL={companyImage} className={style.img} /> : (
              <img src={import.meta.env.VITE_API_BASE_URL + companyImage} alt="companyImage" />
            )}
          </div>
          <div className={style.rightInfo}>
            <div className={style.companyName}>
              {edit ? <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /> : companyName}
              <div className={style.tag}>
                <UserTag role={userRole} />
              </div>
            </div>
            <div className={style.userName}>
              <UserOutlined />
              <div className={style.userNameBox}>
                <div style={{ fontWeight: 700, lineHeight: "34px" }}>userName: </div>
                <div style={{ marginLeft: "20px" }}><Input value={userName} disabled={true} /></div>
              </div>
            </div>
            <div className={style.companyAddress}>
              <EnvironmentOutlined />
              <div className={style.companyAddressBox}>
                <div style={{ fontWeight: 700, lineHeight: "34px" }}>公司地址: </div>
                <div style={{ marginLeft: "20px" }}>
                  <Input value={companyAddress} disabled={!edit} onChange={(e) => setCompanyAddress(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.peopleInfo}>
          <div className={style.peopleInfoItem}>
            <div>公司联系人姓名：</div>
            <div className={style.inputBox}><Input value={peopleName} disabled={!edit} onChange={(e) => setPeopleName(e.target.value)} /></div>
          </div>
          <div className={style.peopleInfoItem}>
            <div>公司联系人电话：</div>
            <div className={style.inputBox}><Input value={peopleTel} disabled={!edit} onChange={(e) => setPeopleTel(e.target.value)} /></div>
          </div>
          <div className={style.peopleInfoItem}>
            <div>公司联系人邮件：</div>
            <div className={style.inputBox}><Input value={peopleMail} disabled={!edit} onChange={(e) => setPeopleMail(e.target.value)} /></div>
          </div>
        </div>

        <div className={style.optionButton}>
          {
            edit ? (
              <div>
                <Button onClick={() => setEdit(false)}>取消</Button>
                <Button type="primary" className={style.submitButton} onClick={() => handleOnSaveClick()}>保存</Button>
              </div>
            ) : <Button type="primary" onClick={() => setEdit(true)}>编辑</Button>
          }
        </div>
      </div>
    )
  }
}
