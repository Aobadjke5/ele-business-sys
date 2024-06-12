import { useEffect, useMemo, useRef, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { UserListApi } from "../../api/User/UserListApi"
import style from "./User.module.scss"
import { Button, Empty, Input, Modal, Select, message } from "antd";
import UserTag from "../../components/UserTag/UserTag";
import { UserOutlined, EnvironmentOutlined, LoadingOutlined } from "@ant-design/icons";
import UserPeopleInfo from "./component/UserPeopleInfo";
import { useSelector } from "react-redux";

export default function UserList() {
  const PAGE_SIZE = 10
  const selectOptions = [
    { value: "all", label: "全部" },
    { value: "Admin", label: "管理员" },
    { value: "Supplier", label: "供货商" },
    { value: "Dealer", label: "经销商" },
    { value: "Warehouser", label: "第三方仓库" },
  ]

  const [moreList, setMoreList] = useState(true)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [keywords, setKeywords] = useState("")
  const [searchText, setSearchText] = useState("")
  const [selectOption, setSselectOption] = useState("all")
  const [userList, setUserList] = useState([])
  const userRole = useSelector(state => state.userInfo.role)
  const scrollBoxRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      console.log(1)
      if (!scrollBoxRef.current) return;
      if (loading) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollBoxRef.current
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (moreList) {
          setLoading(true)
          UserListApi(page + 1, PAGE_SIZE, keywords).then(res => {
            console.log(res);
            if (res.data.userList.length === 0) {
              setMoreList(false)
              setLoading(false)
              message.success("没有更多数据了")
              return
            }
            console.log(userList.concat(res.data.userList))
            setUserList(userList.concat(res.data.userList))
            setLoading(false)
          }).catch(err => {
            message.warning("网络错误，请稍后重试")
            console.log(err);
          })
          setPage(page + 1)
        }
      }
    };

    console.log(1)
    scrollBoxRef.current.addEventListener('scroll', handleScroll)
    let oldRef = scrollBoxRef.current

    return () => {
      console.log(2)
      oldRef.removeEventListener('scroll', handleScroll)
    }
  }, [scrollBoxRef, page, keywords, userList, moreList, loading])

  useEffect(() => {
    if (userRole === "Admin") {
      setLoading(true)
      UserListApi(1, PAGE_SIZE, "").then(res => {
        setLoading(false)
        console.log(res);
        if (res.data.userList.length === 0) {
          setMoreList(false)
          return
        }
        setUserList(res.data.userList)
      }).catch(err => {
        message.warning("网络错误，请稍后重试")
        console.log(err);
      })
    }

  }, [userRole])

  const handleClickButton = () => {
    setKeywords(searchText)
    setPage(1)
    setMoreList(true)

    setLoading(true)
    UserListApi(1, PAGE_SIZE, searchText).then(res => {
      setLoading(false)
      console.log(res);
      if (res.data.userList.length === 0) {
        setMoreList(false)
        return
      }
      setUserList(res.data.userList)
    }).catch(err => {
      message.warning("网络错误，请稍后重试")
      console.log(err);
    })
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
    <div ref={scrollBoxRef} style={{ height: '100%', overflow: 'auto' }}>
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
      <div>
        {loading && <div className={style.loadingBox}><LoadingOutlined />加载中...</div>}
      </div>
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
