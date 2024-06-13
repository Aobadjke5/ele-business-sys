import { useEffect, useState } from "react"
import PageTitle from "../../components/PageTitle/PageTitle"
import { MyProductListApi } from "../../api/ProductManage/MyProductListApi"
import style from "./ProductManageList.module.scss"
import { Button, Empty, Input, Switch, Tag, message } from "antd"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { UpdataProductVisibilityApi } from "../../api/ProductManage/UpdataProductVisibilityApi"
import WarehouseSelect from "../../components/WarehouseSelect/WarehouseSelect"
import MyUpload from "../../components/MyUpload/MyUpload"
import ProductDetailTable from "../../components/ProductDetailTable/ProductDetailTable"
import { EditProductApi } from "../../api/ProductManage/EditProductApi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function ProductManageList() {
  const navigate = useNavigate()
  const [editProductID, setEditProductID] = useState(-1)
  const [searchText, setSearchText] = useState("")
  const [productList, setProductList] = useState([])
  const [productList2, setProductList2] = useState([])
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if (userRole === "Supplier") {
      MyProductListApi().then(res => {
        console.log(res)
        setProductList(res.data.productList)
        setProductList2(res.data.productList)
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
    setProductList2(productList.filter(item => item.productName.toUpperCase().includes(searchText.toUpperCase())))
  }

  const updataProductList = (editID, newProduct) => {
    setProductList(productList.map(item => {
      if (item.productID === editID) {
        return newProduct
      }
      return item
    }))

    setProductList2(productList2.map(item => {
      if (item.productID === editID) {
        return newProduct
      }
      return item
    }))
  }

  return (
    <>
      <PageTitle title="我的商品" />
      <div className={style.inputBox}>
        <Input className={style.searchInput} size="large" placeholder="搜索我的商品" value={searchText} onChange={(event) => setSearchText(event.target.value)} onPressEnter={onSearch} allowClear />
        <Button className={style.btn} type="primary" size="large" onClick={onSearch}>搜索</Button>
      </div>
      <div className={style.con}>
        {
          productList2.length === 0 ? <Empty style={{ marginTop: "100px", }} /> :
            (productList2.map(item => {
              return <ProductManageCard edit={editProductID === item.productID} onEdit={(productID) => setEditProductID(productID)} updataProductList={(editID, newProduct) => updataProductList(editID, newProduct)}
                {...item} key={item.productID} />
            }))
        }
      </div>
    </>
  )
}

const ProductManageCard = (props) => {
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(props.status === "Yes")
  const [productDetails, setProductDetails] = useState([])
  useEffect(() => {
    setProductDetails(props.productDetails)
  }, [props.productDetails])
  useEffect(() => {
    setEdit(props.edit)
  }, [props.edit])

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
    UpdataProductVisibilityApi(props.productID, option).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("操作成功")
        handleEditProduct(props.productID, res.data.product)
      } else {
        message.error("操作失败")
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

  const handleOnClickEdit = () => {
    props.onEdit(props.productID)
  }
  const handleCancelEdit = () => {
    props.onEdit(-1)
  }

  const handleEditProduct = (editID, newProduct) => {
    props.updataProductList(editID, newProduct)
    props.onEdit(-1)
  }

  return (
    <div style={{ boxShadow: "0 2px 10px", marginTop: "20px" }}>
      <div className={style.proCard}>
        <div className={style.productInfo}>
          <div className={style.Leftiamge}>
            <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
          </div>
          <div className={style.rightInfo}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.typeTags}>
              {
                productDetails.map(item => <Tag key={item.proDetailID}>{item.productName}</Tag>)
              }
            </div>
          </div>
        </div>
        <div className={style.option}>
          <div className={style.item}><Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={checked} onChange={(checked) => handleOnChecked(checked)}
          /></div>
          <div className={style.item}>
            {
              edit ? <Button type="link" onClick={() => handleCancelEdit()}>取消编辑</Button> : <Button type="link" onClick={() => handleOnClickEdit()}>编辑</Button>
            }

          </div>
        </div>
      </div>
      {
        edit && <ProductManageCardEdit {...props} submitEdit={(editID, newProduct) => handleEditProduct(editID, newProduct)} cancelEdit={() => handleCancelEdit()} />
      }
    </div>
  )
}

const ProductManageCardEdit = (props) => {
  const navigate = useNavigate()
  const [productID] = useState(props.productID)
  const [warehouseID, setWarehouseID] = useState(props.warehouseInfo.warehouseID)
  const [warehouseName, setWarehouseName] = useState(props.warehouseInfo.warehouseName)
  const [productName, setProductName] = useState(props.productName)
  const [productImage, setProductImage] = useState(props.productImage)
  const [productDetails, setProductDetails] = useState(props.productDetails)

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

  const submitEditProduct = () => {
    if (productDetails.length === 0) {
      message.warning("请创建商品类别")
      return
    }

    let needImage = false
    productDetails.forEach(item => {
      if (item.productImage === "") {
        needImage = true
      }
    })
    if (needImage) {
      message.warning("请上传商品图片")
      return
    }

    EditProductApi(productID, productName, productImage, warehouseID, productDetails).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("修改成功")
        props.submitEdit(productID, res.data.product)
      } else {
        message.error("修改失败")
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

  const handleCancelEdit = () => {
    props.cancelEdit()
  }

  return (
    <div className={style.productEdit}>
      <hr />
      <div className={style.baseInfo}>
        <div className={style.imgInfo}>
          <MyUpload type="product" imageURL={productImage} getNewImageURL={(newImage) => setProductImage(newImage)} />
        </div>
        <div className={style.textInfo}>
          <div className={style.editName}>
            <div>商品名称：</div>
            <div><Input value={productName} onChange={(e) => { setProductName(e.target.value) }} /></div>
          </div>
          <div className={style.editName}>
            <div>存储仓库：</div>
            <div><WarehouseSelect warehouseName={warehouseName} warehouseID={warehouseID} handleChangeWarehouse={(newWarehouseID, newWarehouseName) => handleChangeWarehouse(newWarehouseID, newWarehouseName)} /></div>
          </div>
        </div>
      </div>
      <ProductDetailTable productDetails={productDetails} getNewProductDetails={(newProductDetals) => handleGetNewProductDetails(newProductDetals)} />
      <div className={style.buttonBox}>
        <Button onClick={() => handleCancelEdit()}>取消</Button>
        <Button type="primary" onClick={() => submitEditProduct()}>确认修改</Button>
      </div>
    </div>
  )
}
