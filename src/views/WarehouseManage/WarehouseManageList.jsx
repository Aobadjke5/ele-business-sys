import { Button, Empty, Input, InputNumber, Progress, Slider, Switch, message } from "antd"
import PageTitle from "../../components/PageTitle/PageTitle"
import style from "./WarehouseManageList.module.scss"
import { useEffect, useMemo, useState } from "react"
import { MyWarehouseListApi } from "../../api/Warehouse/MyWarehouseListApi"
import { CheckOutlined, CloseOutlined, EnvironmentOutlined } from "@ant-design/icons"
import { UpdataWarehouseVisibilityApi } from "../../api/Warehouse/UpdataWarehouseVisibilityApi"
import MyUpload from "../../components/MyUpload/MyUpload"
import { EditWarehouseApi } from "../../api/Warehouse/EditWarehouseApi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function WarehouseManageList() {
  const navigate = useNavigate()
  const [editWarehouseID, setEditWarehouseID] = useState(-1)
  const [searchText, setSearchText] = useState("")
  const [warehouseList, setWarehouseList] = useState([])
  const [warehouseList2, setWarehouseList2] = useState([])
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if (userRole === "Warehouser") {
      MyWarehouseListApi().then(res => {
        console.log(res)
        setWarehouseList(res.data.warehouseList)
        setWarehouseList2(res.data.warehouseList)
      }).catch(err => {
        if(err.code === 40004) {
          navigate("/login")
          return
        }
        console.log(err)
        message.error("网络错误，请稍后重试")
      })
    }

  }, [userRole])

  const onSearch = () => {
    console.log("Search:", searchText)
    setWarehouseList2(warehouseList.filter(item => item.warehouseName.toUpperCase().includes(searchText.toUpperCase())))
  }

  const updataWarehouseList = (editID, newWarehouse) => {
    setWarehouseList(warehouseList2.map(item => {
      if (item.warehouseID === editID) {
        return newWarehouse
      }
      return item
    }))

    setWarehouseList2(warehouseList2.map(item => {
      if (item.warehouseID === editID) {
        return newWarehouse
      }
      return item
    }))
  }

  return (
    <>
      <PageTitle title="我的仓库" />
      <div className={style.inputBox}>
        <Input className={style.searchInput} size="large" placeholder="搜索我的仓库" value={searchText} onChange={(event) => setSearchText(event.target.value)} onPressEnter={onSearch} allowClear />
        <Button className={style.btn} type="primary" size="large" onClick={onSearch}>搜索</Button>
      </div>
      <div className={style.con}>
        {
          warehouseList2.length === 0 ? <Empty style={{ marginTop: "100px" }} /> : (
            warehouseList2.map(item => {
              return <WarehouseManageCard key={item.warehouseID} {...item} edit={editWarehouseID === item.warehouseID} onEdit={(productID) => setEditWarehouseID(productID)} updataWarehouseList={(editID, newWarehouse) => updataWarehouseList(editID, newWarehouse)} />
            })
          )
        }
      </div>
    </>
  )
}

const WarehouseManageCard = (props) => {
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(props.status === "Yes")
  useEffect(() => {
    setEdit(props.edit)
  }, [props.edit])

  const progressPercent = useMemo(() => {
    return (props.currentCapacity / props.totalCapacity * 100).toFixed(1)
  }, [props.currentCapacity, props.totalCapacity])

  const handleCancelEdit = () => {
    props.onEdit(-1)
  }
  const handleClickEdit = () => {
    props.onEdit(props.warehouseID)
  }

  const handleOnChecked = (checked) => {
    if (loading) {
      message.warning("操作频繁，请稍后重试")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
    setChecked(checked)

    let option = checked ? "show" : "hidden"
    UpdataWarehouseVisibilityApi(props.warehouseID, option).then(res => {
      if (res.code === 200) {
        message.success("操作成功")
        handleEditWarehouse(props.warehouseID, res.data.warehouse)
      } else {
        message.error("操作失败")
      }
      console.log(res)
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }

  const handleEditWarehouse = (editID, newWarehouse) => {
    props.updataWarehouseList(editID, newWarehouse)
    props.onEdit(-1)
  }

  return (
    <>
      <div className={style.warehouseCard}>
        <div className={style.warehouseCard2}>
          <div>
            <div className={style.warehouseInfo}>
              <div className={style.leftImage}>
                <img src={import.meta.env.VITE_API_BASE_URL + props.warehouseImage} alt="image" />
              </div>
              <div className={style.rightInfo}>
                <div className={style.warehouseName}>{props.warehouseName}</div>
                <div className={style.warehouseAddress}><EnvironmentOutlined /><span style={{ marginLeft: "5px" }}>{props.warehouseAddress}</span></div>
                <div className={style.warehouseProgress}>
                  <Progress size={[300, 20]} percent={progressPercent} />
                </div>
              </div>
            </div>
          </div>

          <div className={style.option}>
            <div className={style.item}>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={checked} onChange={(checked) => handleOnChecked(checked)}
              />
            </div>
            <div className={style.item}>
              {
                edit ? (
                  <Button type="link" onClick={() => handleCancelEdit()}>取消编辑</Button>
                ) : (
                  <Button type="link" onClick={() => handleClickEdit()}>编辑</Button>
                )
              }
            </div>
          </div>
        </div>

        {edit && <WarehouseManageCardEdit {...props} cancelEdit={() => handleCancelEdit()} submitEdit={(editID, newWarehouse) => handleEditWarehouse(editID, newWarehouse)} />}
      </div>
    </>

  )
}

const WarehouseManageCardEdit = (props) => {
  const navigate = useNavigate()
  const [warehouseID] = useState(props.warehouseID)
  const [warehouseImage, setWarehouseImage] = useState(props.warehouseImage)
  const [warehouseName, setWarehouseName] = useState(props.warehouseName)
  const [warehouseAddress, setWarrehouseAddress] = useState(props.warehouseAddress)
  const [currentCapacity, setCurrentCapacity] = useState(props.currentCapacity)
  const [totalCapacity, setTotalCapacity] = useState(props.totalCapacity)

  const handleCancelEdit = () => {
    props.cancelEdit()
  }
  const submitEditWarehouse = () => {
    if (warehouseName === "") {
      message.warning("请输入仓库名称")
      return
    }
    if (warehouseAddress === "") {
      message.warning("请输入仓库地址")
      return
    }

    EditWarehouseApi(warehouseID, warehouseName, warehouseAddress, warehouseImage, currentCapacity, totalCapacity).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("编辑成功")
        props.submitEdit(warehouseID, res.data.warehouse)
      } else {
        message.error("编辑失败")
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

  return (
    <div className={style.warehouseEditBox}>
      <hr />
      <div className={style.baseInfo}>
        <div className={style.imgInfo}>
          <MyUpload type="warehouse" imageURL={warehouseImage} getNewImageURL={(newImage) => setWarehouseImage(newImage)} />
        </div>
        <div className={style.textInfo}>
          <div className={style.warehouseName}>
            <div>仓库名称：</div>
            <div><Input value={warehouseName} onChange={(e) => { setWarehouseName(e.target.value) }} /></div>
          </div>
          <div className={style.warehouseName}>
            <div>仓库地址：</div>
            <div><Input value={warehouseAddress} onChange={(e) => { setWarrehouseAddress(e.target.value) }} /></div>
          </div>
        </div>
      </div>
      <div className={style.warehouseSlider}>
        <div className={style.label1}>仓库总容量：</div>
        <div className={style.numberInput}><InputNumber min={10} value={totalCapacity} onChange={(value) => setTotalCapacity(value)} /></div>
        <div className={style.slider}><Slider min={0} max={totalCapacity} value={currentCapacity} onChange={(value) => setCurrentCapacity(value)} /></div>
        <div className={style.label2}>剩余空间：{totalCapacity - currentCapacity}</div>
      </div>
      <div className={style.buttonBox}>
        <Button onClick={() => handleCancelEdit()}>取消</Button>
        <Button type="primary" onClick={() => submitEditWarehouse()}>确认修改</Button>
      </div>
    </div>
  )
}
