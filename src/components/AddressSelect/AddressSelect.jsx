import style from './AddressSelect.module.scss'
import { Button, Popover, message } from "antd"
import { useEffect, useState } from 'react'
import { AddressListApi } from '../../api/Center/AddressListApi'
import { UserOutlined, PhoneOutlined } from '@ant-design/icons'
import CreateAddressModal from '../CreateAddressModal/CreateAddressModal'

export default function AddressSelect(props) {
  const [buttonName, setButtonName] = useState("")
  const [selectedAddressID, setSelectedAddressID] = useState(-1)

  const onChange = (addressID, addressName) => {
    setButtonName(addressName)
    setSelectedAddressID(addressID)
    console.log("newID:", addressID)
    props.getAddressID(addressID)
  }

  return (
    <div>
      <Popover content={<AddressList 
        selectChange={(addressID, addressName) => onChange(addressID, addressName)}
        selectedAddressID={selectedAddressID}
      />} trigger="click">
        <Button className={style.button}>{buttonName === "" ? "地址选择" : buttonName}</Button>
      </Popover>
    </div>
  )
}

function AddressList(props) {
  const [addressList, setAddressList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  useEffect(() => {
    AddressListApi().then(res => {
      console.log(res)
      setAddressList(res.data.addressList)
    }).catch(err => {
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }, [])

  const onClickChange = (addressID, addressName) => {
    props.selectChange(addressID, addressName)
  }
  const closeModal = () => {
    setModalOpen(false)
  }
  const setNewAddress = (newAddress) => {
    setAddressList(addressList => [...addressList, newAddress])
    onClickChange(newAddress.addressID, newAddress.addressDetail)
  }

  return (
    <div className={style.popoverBox}>
      <div className={style.content}>
        {
          addressList.map(item => 
            <AddressBox 
              className={item.addressID === props.selectedAddressID ? style.selectedBox : ""}
              key={item.addressID} {...item} onClick={()=>onClickChange(item.addressID, item.addressDetail)}/>
          )
        }
      </div>
      <div className={style.addButtonBox}>
        <Button className={style.addButton} onClick={() => setModalOpen(true)}>新建收货地址</Button>
      </div>
      <CreateAddressModal open={modalOpen} onOk={closeModal} onCancel={closeModal} setNewAddress={(newAddress) => setNewAddress(newAddress)}/>
    </div>
  )
}

function AddressBox(props) {
  return (
    <div onClick={props.onClick} className={props.className + " " + style.addressItem}>
      <h1>{props.addressDetail}</h1>
      <div className={style.textContent}>
        <div className={style.peopleInfo}>
          <UserOutlined />
          <div className={style.label}>联系人姓名：</div>
          <div>{props.peopleName}</div>
        </div>
        <div className={style.peopleInfo}>
          <PhoneOutlined />
          <div className={style.label}>联系人电话：</div>
          <div>{props.peopleTel}</div>
        </div>
      </div>
    </div>
  )
}
