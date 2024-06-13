import { Button, Input, InputNumber, Slider, message } from "antd";
import PageTitle from "../../components/PageTitle/PageTitle";
import style from "./WarehouseManage.module.scss";
import AddSwithButton from "../../components/AddSwithButton/AddSwithButton";
import { useState } from "react";
import MyUpload from "../../components/MyUpload/MyUpload";
import { CreateNewWarehouseApi } from "../../api/Warehouse/CreateNewWarehouseApi";
import { useNavigate } from "react-router-dom";

export default function WarehouseManageAdd() {
  const navigate = useNavigate()
  const [warehouseName, setWarehouseName] = useState("")
  const [warehouseAddress, setWarehouseAddress] = useState("")
  const [warehouseImage, setWarehouseImage] = useState("")
  const [currentCapacity, setCurrentCapacity] = useState(0)
  const [totalCapacity, setTotalCapacity] = useState(100)
  const [checked, setChecked] = useState(true)

  const handleOnCreateNewWarehouse = () => {
    if(warehouseImage === "") {
      message.error("请上传仓库图片")
      return
    }
    if(warehouseName === "") {
      message.error("请输入仓库名称")
      return
    }
    if(warehouseAddress === "") {
      message.error("请输入仓库地址")
      return
    }

    let status = checked ? "Yes" : "No"

    CreateNewWarehouseApi(warehouseName, warehouseAddress, warehouseImage, status, currentCapacity, totalCapacity).then(res => {
      if(res.code === 200) {
        message.success("创建成功")
        navigate("/warehouseManage/list")
      } else {
        message.error("创建失败")
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

  return (
    <div>
      <PageTitle title="新增仓库" />
      <div className={style.firstRow}>
        <MyUpload type="warehouse" className={style.upload} imageURL={warehouseImage} getNewImageURL={(newImage) => setWarehouseImage(newImage)}/>
        <div className={style.Row1Right}>
          <div className={style.formItem} style={{ height: '30%' }}>
            <div className={style.formItemLabel}>仓库名称</div>
            <div><Input value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} placeholder="请输入仓库名称"/></div>
          </div>
          <div className={style.formItem} style={{ height: '70%' }}>
            <div className={style.formItemLabel}>仓库地址</div>
            <div><Input.TextArea className={style.textarea} value={warehouseAddress} onChange={(e) => setWarehouseAddress(e.target.value)} placeholder="请输入仓库详细地址"/></div>
          </div>
        </div>
      </div>
      <div className={style.secondRow}>
        <div className={style.formItem2}>
          <div className={style.formItemLabel2}>仓库总容量</div>
          <div className={style.formItemInput2}><InputNumber min={10} value={totalCapacity} onChange={(value) => setTotalCapacity(value)}/></div>
        </div>
        <div className={style.formItemSlider}><Slider min={0} max={totalCapacity} value={currentCapacity} onChange={(value) => setCurrentCapacity(value)}/></div>
        <div className={style.formItemSliderLabel}>空余空间：{totalCapacity-currentCapacity}</div>
      </div>
      <AddSwithButton title="是否开放当前仓库" style={{width: '85%', marginTop: '20px'}} onChange={(checked) => setChecked(checked)}/>
      <div className={style.footer}>
        <Button type="primary" style={{ height: '35px', width: '100px' }} onClick={() => handleOnCreateNewWarehouse()}>保存</Button>
      </div>
    </div>
  )
}
