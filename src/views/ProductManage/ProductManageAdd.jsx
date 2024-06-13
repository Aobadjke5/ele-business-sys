import style from "./ProductManage.module.scss";
import { Button, Input, message } from "antd";
import WarehouseSelect from "../../components/WarehouseSelect/WarehouseSelect";
import ProductDetailTable from "../../components/ProductDetailTable/ProductDetailTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import AddSwithButton from "../../components/AddSwithButton/AddSwithButton";
import { useState } from "react";
import MyUpload from "../../components/MyUpload/MyUpload";
import { CreateNewProductApi } from "../../api/ProductManage/CreateNewProductApi";
import { useNavigate } from "react-router-dom";

export default function ProductManageAdd() {
  const defaltProDetail = {
    "productName": "defalt",
    "productImage": "",
    "productCnt": 0,
    "productPrice": 9.9
  }
  const navigate = useNavigate()

  const [productDetails, setProductDetails] = useState([defaltProDetail])
  const [productImage, setProductImage] = useState("")
  const [productName, setProductName] = useState("")
  const [warehouseID, setWarehouseID] = useState(-1)
  const [warehouseName, setWarehouseName] = useState("")
  const [productStatus, setProductStatus] = useState("Yes")

  const handleGetNewProductDetails = (newProductDetals) => {
    let productDetails = newProductDetals.map(item => {
      return {
        "productName": item.ProductName,
        "productImage": item.ProductImage,
        "productCnt": item.ProductCnt,
        "productPrice": item.ProductPrice
      }
    })
    console.log(productDetails)
    setProductDetails(productDetails)
  }

  const handleChangeWarehouse = (newWarehouseID, newWarehouseName) => {
    setWarehouseID(newWarehouseID)
    setWarehouseName(newWarehouseName)
  }

  const handleSwitchChanged = (checked) => {
    setProductStatus(checked ? "Yes" : "No")
  }

  const handleSubmitCreateNewProduct = () => {
    if(productImage === "") {
      message.warning("请上传商品展示图片")
      return
    }
    if(productName === "") {
      message.warning("请输入商品名称")
      return
    }
    if(warehouseID === -1) {
      message.warning("请选择存储仓库")
      return
    }
    if(productDetails.length === 0) {
      message.warning("请创建商品类别")
      return
    }

    let needImage = false
    productDetails.forEach(item => {
      if (item.productImage === "") {
        needImage = true
      }
    })
    if(needImage) {
      message.warning("请上传商品图片")
      return 
    }

    CreateNewProductApi(productName, productImage, warehouseID, productStatus, productDetails).then(res => {
      console.log(res)
      if(res.code === 200) {
        message.success("创建成功")
        navigate("/productManage/list")
      }
      else {
        message.error("创建失败")
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
    <div>
      <PageTitle title="新增商品" />
      <div className={style.productManageAddForm}>
        <div className={style.Row1}>
          <MyUpload className={style.upload} type="product" imageURL={productImage} getNewImageURL={(newImage) => setProductImage(newImage)}/>
          <div className={style.Row1Right}>
            <div className={style.formItem}>
              <div className={style.formItemLabel}>商品名称</div>
              <Input placeholder="请输入商品名称" className={style.formItemBtn} value={productName} onChange={(e) => setProductName(e.target.value)}/>
            </div>
            <div className={style.formItem}>
              <div className={style.formItemLabel}>存储仓库</div>
              <WarehouseSelect warehouseName={warehouseName} warehouseID={warehouseID} handleChangeWarehouse={(newWarehouseID, newWarehouseName) => handleChangeWarehouse(newWarehouseID, newWarehouseName)} className={style.formItemBtn} />
            </div>
          </div>
        </div>
      </div>
      <ProductDetailTable productDetails={productDetails} getNewProductDetails={(newProductDetals) => handleGetNewProductDetails(newProductDetals)}/>
      <AddSwithButton title={"是否直接上架商城"} onChange={(checked) => handleSwitchChanged(checked)}/>
      <div className={style.footer}>
        <Button type="primary" style={{ height: '35px', width: '100px' }} onClick={() => handleSubmitCreateNewProduct()}>保存</Button>
      </div>
    </div>
  )
}
