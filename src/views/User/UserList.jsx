import { useEffect, useMemo, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { UserListApi } from "../../api/User/UserListApi"
import style from "./User.module.scss"
import { Button, Empty, Input, Modal, Select, message } from "antd";
import UserTag from "../../components/UserTag/UserTag";
import { UserOutlined, EnvironmentOutlined } from "@ant-design/icons";
import UserPeopleInfo from "./component/UserPeopleInfo";
import { useSelector } from "react-redux";

export default function UserList() {
  const selectOptions = [
    { value: "all", label: "全部" },
    { value: "Admin", label: "管理员" },
    { value: "Supplier", label: "供货商" },
    { value: "Dealer", label: "经销商" },
    { value: "Warehouser", label: "第三方仓库" },
  ]

  const [list, setList] = useState([])
  const [searchText, setSearchText] = useState("")
  const [selectOption, setSselectOption] = useState("all")
  const [userList, setUserList] = useState([])
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if (userRole === "Admin") {
      UserListApi().then(res => {
        console.log(res);
        setList(res.data.userList)
        setUserList(res.data.userList)
      }).catch(err => {
        message.warning("网络错误，请稍后重试")
        console.log(err);
      })
    }

  }, [userRole])

  const handleClickButton = () => {
    setUserList(list.filter(item => {
      return item.companyName.toUpperCase().includes(searchText.toUpperCase())
    }))
  }

  const showList = useMemo(() => {
    if (selectOption === "all") {
      return userList
    } else {
      return userList.filter(item => {
        return item.role === selectOption
      })
    }
  }, [userList, selectOption])

  return (
    <div>
      <PageTitle title="用户列表" />
      <div className={style.searchBox}>
        <Input placeholder="请输入用户名称" className={style.searchInput} onChange={e => setSearchText(e.target.value)} value={searchText} allowClear size="large" onPressEnter={() => handleClickButton()} />
        <Button type="primary" className={style.searchButton} onClick={() => handleClickButton()} size="large">搜索</Button>
        <Select className={style.searchSelect} options={selectOptions} defaultValue={"all"} onChange={e => setSselectOption(e)} size="large"></Select>
      </div>
      <dic className={style.userList}>
        {showList.length === 0 ? <Empty style={{ marginTop: "100px" }} /> : showList.map(item => {
          return <UserListItem key={item.userID} {...item} />
        })}
      </dic>
    </div>
  )
}

function UserListItem(props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className={style.userListItem}>
      <img src={import.meta.env.VITE_API_BASE_URL + props.companyIcon} alt="companyIcon" />
      <div className={style.companyInfo}>
        <h3 className={style.companyName}>{props.companyName}</h3>
        <UserTag role={props.role} />
      </div>
      <div className={style.detailButton}>
        <Button type="link" onClick={() => setIsModalOpen(true)}>查看详细信息</Button>
        <Modal title={props.companyName} open={isModalOpen} onCancel={closeModal} onOk={closeModal} footer={[
          <Button key="button" type="primary" onClick={closeModal}>确定</Button>
        ]}>
          <div>
            <div className={style.rowInfoItem}>
              <UserOutlined />
              <div className={style.ItemContent}>
                <div className={style.label}>用&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;名：</div>
                <Input className={style.input} disabled value={props.userName} />
              </div>
            </div>
            {
              props.role !== "Admin" && (
                <>
                  <div className={style.rowInfoItem} style={{ height: "90px" }}>
                    <EnvironmentOutlined />
                    <div className={style.ItemContent}>
                      <div className={style.label} style={{ height: "90px", lineHeight: "90px" }}>公&nbsp;司&nbsp;地&nbsp;址&nbsp;：</div>
                      <Input.TextArea className={style.input} disabled value={props.companyAddress} style={{ height: "80px" }} />
                    </div>
                  </div>
                  <UserPeopleInfo peopleName={props.peopleName} peopleTel={props.peopleTel} peopleMail={props.peopleMail} />
                </>
              )
            }
          </div>
        </Modal>
      </div>
    </div>
  )
}
