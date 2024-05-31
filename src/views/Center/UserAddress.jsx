import { useEffect, useState } from "react"
import PageTitle from "../../components/PageTitle/PageTitle"
import { AddressListApi } from "../../api/Center/AddressListApi"
import { useDispatch, useSelector } from "react-redux"
import { setDefaultAddress } from "../../redux/slice/UserInfoReducer"
import style from "./UserAddress.module.scss"
import { Button, message } from "antd"
import { UserOutlined, PhoneOutlined } from "@ant-design/icons"
import CreateAddressModal from "../../components/CreateAddressModal/CreateAddressModal"
import EditAddressModal from "../../components/EditAddressModal/EditAddressModal"
import { DeleteAddressApi } from "../../api/Center/DeleteAddressApi"

export default function UserAddress() {
  const [addressList, setAddressList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if (userRole === 'Dealer') {
      AddressListApi().then(res => {
        console.log(res)
        setAddressList(res.data.addressList)
        if (res.data.addressList.length > 0) {
          dispatch(setDefaultAddress(res.data.addressList[0]))
        }
      }).catch(err => {
        console.log(err)
      })
    }

  }, [userRole])

  const closeModal = () => {
    setModalOpen(false)
  }
  const setNewAddress = (newAddress) => {
    setAddressList(addressList => [...addressList, newAddress])
  }

  const handleDeleteAddress = (addressID) => {
    let NewAddressList = addressList.filter(item => item.addressID !== addressID)
    setAddressList(NewAddressList)
    if (NewAddressList > 0) {
      dispatch(setDefaultAddress(NewAddressList[0]))
    }
  }
  const handleEditAddress = (addressID, newAddress) => {
    let NewAddressList = addressList.map(item => {
      if (item.addressID === addressID) {
        return newAddress
      } else {
        return item
      }
    })
    setAddressList(NewAddressList)
    dispatch(setDefaultAddress(NewAddressList[0]))
  }

  return (
    <>
      <PageTitle title="收货地址" />
      <div className={style.content}>
        {
          addressList.length === 0 ? (
            <div style={{color: "gray", fontWeight: "700"}}>
              暂无收货地址，请添加新地址
            </div>
          ) : (addressList.map(item =>
            <AddressBox key={item.addressID} {...item} deleteAddress={(addressID) => handleDeleteAddress(addressID)} editAddress={(addressID, newAddress) => handleEditAddress(addressID, newAddress)}/>
          ))
        }
      </div>
      <div className={style.addButtonBox}>
        <Button className={style.addButton} onClick={() => setModalOpen(true)}>增添新地址</Button>
      </div>

      <CreateAddressModal open={modalOpen} onOk={closeModal} onCancel={closeModal} setNewAddress={(newAddress) => setNewAddress(newAddress)}/>
    </>
  )
}

function AddressBox(props) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDeleteAddress = () => {
    DeleteAddressApi(props.addressID).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("删除成功")
        props.deleteAddress(props.addressID)
      } else {
        message.error("删除失败")
      }
    }).catch(err => {
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }
  const handleEditAddress = () => {
    console.log(props)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  const setNewAddress = (newAddress) => {
    console.log(newAddress)
    console.log(props.addressID)
    props.editAddress(props.addressID, newAddress)
  }

  return (
    <div className={style.addressBox}>
      <div className={style.addressItem}>
        <div>
          <h1>{props.addressDetail}</h1>
        </div>
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
      <div className={style.EditButton}>
        <Button style={{marginBottom: "5px"}} onClick={() => handleEditAddress()}>编辑</Button>
        <Button style={{marginTop: "5px", color: "red"}} type="link" onClick={() => handleDeleteAddress()}>删除</Button>
      </div>

      <EditAddressModal  open={modalOpen} onOk={closeModal} onCancel={closeModal}
       setNewAddress={(newAddress) => setNewAddress(newAddress)}
       addressID={props.addressID} addressDetail={props.addressDetail} peopleName={props.peopleName} peopleTel={props.peopleTel}/>
    </div>
  )
}
