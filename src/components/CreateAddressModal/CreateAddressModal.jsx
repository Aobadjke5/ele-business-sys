import { Input, Modal, message } from "antd"
import style from "./CreateAddressModal.module.scss"
import { useState } from "react"
import { CreateNewAddressApi } from "../../api/Center/CreateNewAddressApi"

export default function CreateAddressModal(props) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [inputAddress, setInputAddress] = useState("")
  const [inputPeopleName, setInputPeopleName] = useState("")
  const [inputPeopleTel, setInputPeopleTel] = useState("")

  const handleOnOK = () => {
    if(inputAddress === "") {
      message.error("请输入详细收货地址")
      return
    }
    if(inputPeopleName === "") {
      message.error("请输入收货联系人姓名")
      return
    }
    if(inputPeopleTel === "") {
      message.error("请输入收货联系人电话")
      return
    }

    setConfirmLoading(true)
    CreateNewAddressApi(inputAddress, inputPeopleName, inputPeopleTel).then(res => {
      console.log(res)
      setConfirmLoading(false)
      if(res.code === 200) {
        message.success("新建地址成功")
        let newAddress = res.data.newAddress
        console.log(newAddress)
        props.setNewAddress(newAddress)
      } else {
        message.error("创建地址失败")
        return
      }


      setInputAddress("")
      setInputPeopleName("")
      setInputPeopleTel("")
      props.onOk()
    }).catch(err => {
      setConfirmLoading(false)
      console.log(err)
      message.error("网络错误，请稍后重试")
      return
    })
  }

  return (
    <Modal title="创建新地址" maskClosable={false} confirmLoading={confirmLoading}
      open={props.open} onOk={handleOnOK} onCancel={props.onCancel}>
        <div className={style.addressForm}>
          <div className={style.addressItem}>
            <div className={style.label}>详细收货地址：</div>
            <Input.TextArea className={style.textarea} placeholder="请输入详细收货地址" value={inputAddress} onChange={(e) => {setInputAddress(e.target.value)}}/>
          </div>
          <div className={style.addressItem}>
            <div className={style.label}>收货联系人姓名：</div>
            <Input className={style.input} placeholder="请输入收货联系人姓名" value={inputPeopleName} onChange={(e) => {setInputPeopleName(e.target.value)}}/>
          </div>
          <div className={style.addressItem}>
            <div className={style.label}>收货联系人电话：</div>
            <Input className={style.input} placeholder="请输入收货联系人电话" value={inputPeopleTel} onChange={(e) => {setInputPeopleTel(e.target.value)}}/>
          </div>
        </div>
    </Modal>
  )
}
