import style from './WarehouseSelect.module.scss'
import { Button, Input, Popover, Progress, Select, message } from "antd"
import { SearchOutlined, IdcardOutlined, TagOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { WarehouseListApi } from '../../api/Warehouse/WarehouseListApi'
import { useNavigate } from 'react-router-dom'

export default function WarehouseSelect(props) {
  const [buttonName, setButtonName] = useState(props.warehouseName)
  const [selectedWarehouseID, setSelectedWarehouseID] = useState(props.warehouseID)

  const onChange = (warehouseID, warehouseName) => {
    setButtonName(warehouseName)
    setSelectedWarehouseID(warehouseID)
    props.handleChangeWarehouse(warehouseID, warehouseName)
    console.log("newID:", warehouseID)
  }

  return (
    <div>
      <Popover content={<WarehouseList 
        selectChange={(warehouseID, warehouseName) => onChange(warehouseID, warehouseName)}
        selectedWarehouseID={selectedWarehouseID}
      />} trigger="click">
        <Button className={style.button}>{buttonName === "" ? "仓库选择" : buttonName}</Button>
      </Popover>
    </div>
  )
}

function WarehouseList(props) {
  const navigate = useNavigate()
  const [warehouseList, setWarehouseList] = useState([])
  const [searchText, setSearchText] = useState("")
  const [selectValue, setSelectValue] = useState("1")
  const selectOptions = [
    {value: "1", label: "仓库名称"},
    {value: "2", label: "公司名称"},
    {value: "3", label: "仓库地址"},
  ]

  useEffect(() => {
    WarehouseListApi().then(res => {
      console.log(res)
      setWarehouseList(res.data.warehouseList)
    }).catch(err => {
      if(err.code === 40004) {
        navigate("/login")
        return
      }
      console.log(err)
      message.error("网络错误，请稍后重试")
    })
  }, [])

  const showWarehouseList = useMemo(() => {
    if(selectValue === "1") {
      return warehouseList.filter(item => item.warehouseName.toUpperCase().includes(searchText.toUpperCase()))
    }
    if(selectValue === "2") {
      return warehouseList.filter(item => item.companyInfo.companyName.toUpperCase().includes(searchText.toUpperCase()))
    }
    if(selectValue === "3") {
      return warehouseList.filter(item => item.warehouseAddress.toUpperCase().includes(searchText.toUpperCase()))
    }
    return warehouseList
  }, [warehouseList, selectValue, searchText])

  const onClickChange = (warehouseID, warehouseName) => {
    props.selectChange(warehouseID, warehouseName)
  }

  return (
    <div className={style.popoverBox}>
      <div className={style.header}>
        <Input className={style.searchInput} value={searchText} onChange={(e) => setSearchText(e.target.value)} addonBefore={<SearchOutlined />}/>
        <Select className={style.searchSelect} options={selectOptions} defaultValue="1" onChange={(value) => setSelectValue(value)}/>
      </div>
      <div className={style.content}>
        {
          showWarehouseList.map(item => 
            <WarehouseBox 
              className={item.warehouseID === props.selectedWarehouseID ? style.selectedBox : ""}
              key={item.warehouseID} {...item} onClick={()=>onClickChange(item.warehouseID, item.warehouseName)}/>
          )
        }
      </div>
    </div>
  )
}

function WarehouseBox(props) {
  const [progressPercent, setProgressPercent] = useState()
  useEffect(() => {
    let value = props.currentCapacity / props.totalCapacity
    value = (value * 100).toFixed(1)
    setProgressPercent(value)
  }, [props.currentCapacity, props.totalCapacity])

  const handleChangeWarehouse = () => {
    if(progressPercent === "100.0") {
      message.error("该仓库已满，无法选择当前仓库")
      return
    }
    props.onClick()
  }

  return (
    <div className={style.warehouseBox + " " + props.className} onClick={() => handleChangeWarehouse()}>
      <div className={style.warehouseImg}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.warehouseImage} alt='img' />
      </div>
      <div className={style.warehouseInfo}>
        <div className={style.title}>{props.warehouseName}</div>
        <div className={style.content}>
          <div className={style.icon}><IdcardOutlined /></div>
          <div className={style.word}>{props.companyInfo.companyName}</div>
        </div>
        <div className={style.content}>
          <div className={style.icon}><TagOutlined /></div>
          <div className={style.word}>{props.warehouseAddress}</div>
        </div>
      </div>
      <div className={style.progress}>
        <Progress type="dashboard" percent={progressPercent} size={80}/>
      </div>
    </div>
  )
}
