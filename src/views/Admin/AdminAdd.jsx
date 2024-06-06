import style from './AdminAdd.module.scss'
import MyUpload from '../../components/MyUpload/MyUpload'
import PageTitle from '../../components/PageTitle/PageTitle'
import { useState } from 'react'
import { Button, Input, message } from 'antd'
import { CreateNewAdminApi } from '../../api/Auth/CreateNewAdminApi'
import { useNavigate } from 'react-router-dom'

export default function AdminAdd() {
  const navigate = useNavigate()
  const [adminImage, setAdminImage] = useState('')
  const [adminName, setAdminName] = useState('')
  const [username, setUsername] = useState('')

  const handleOnSubmitForm = () => {
    if(adminImage === "") {
      message.warning("请上传管理员头像")
      return
    }
    if(username === "") {
      message.warning("请输入管理员用户名")
      return
    }
    if(adminName === "") {
      message.warning("请输入管理员名称")
      return
    }
    
    CreateNewAdminApi(adminImage, username, adminName).then(res => {
      console.log(res)
      if(res.code === 200) {
        message.success("新增管理员成功")
        navigate("/user/list")
      } else {
        message.warning("操作失败，当前用户名已存在")
        setUsername("")
      }
    }).catch(err => {
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }

  return (
    <>
      <PageTitle title="新增管理员" />
      <div className={style.formBox}>
        <div className={style.formInput}>
          <div>
            <MyUpload type="company" imageURL={adminImage} getNewImageURL={(newImage) => setAdminImage(newImage)}/>
          </div>
          <div className={style.input}>
            <div className={style.inputItem}>
              <div className={style.label}>用户名</div>
              <Input className={style.option} placeholder="请输入管理员用户名" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className={style.inputItem}>
              <div className={style.label}>名称</div>
              <Input className={style.option} placeholder="请输入管理员名称" value={adminName} onChange={(e) => setAdminName(e.target.value)}/>
            </div>
          </div>
        </div>
        <div className={style.formButton}>
          <Button type='primary' onClick={() => handleOnSubmitForm()}>添加管理员</Button>
        </div>
      </div>
    </>
  )
}
