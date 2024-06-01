import { useEffect, useMemo, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { ProductListApi } from "../../api/Product/ProductListApi";
import { Button, Col, Input, InputNumber, Modal, Row, message } from "antd";
import style from "./Product.module.scss"
import AddressSelect from "../../components/AddressSelect/AddressSelect";
import { PurchaseProductApi } from "../../api/Product/PurchaseProductApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Product() {
  const [productList, setProductList] = useState([])
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if (userRole === "Dealer") {
      ProductListApi().then(res => {
        console.log(res)
        setProductList(res.data.productList)
      }).catch(err => {
        console.log(err)
        message.error("网络错误，请稍后重试")
      })
    }
    
  }, [userRole])

  const handleSearch = (value) => {
    console.log("Search", value)
  }

  return (
    <>
      <PageTitle title="商品列表" />
      <div className={style.searchInput}>
        <Input.Search placeholder="请输入您要搜索的商品" allowClear enterButton="搜索" size="large" onSearch={(value) => handleSearch(value)}/>
      </div>
      <Row>
        {productList.map(item => {
          return <ProductCard key={item.productID} {...item} />
        })}
      </Row>
    </>
  )
}

const ProductCard = (props) => {
  const [open, setOpen] = useState(false)
  const [productPrice, setProductPrice] = useState()
  useEffect(() => {
    let price = props.productDetails.map(item => item.productPrice)
    setProductPrice(Math.min(...price))
  }, [props.productDetails])

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <>
      <Col sm={{ span: 11, offset: 1 }} md={{ span: 7, offset: 1 }} lg={{ span: 5, offset: 1 }}>
        <div className={style.productCard} onClick={() => setOpen(true)}>
          <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
          <div className={style.productName}>{props.productName}</div>
          <div className={style.productPrice}>{productPrice}</div>

          <div className={style.txtx}>点击查看详情</div>
        </div>
      </Col>
      <Modal open={open} footer={null} width={780}
        onCancel={closeModal} onOk={closeModal}
        title={props.productName}>
        <ProductDetails productImage={props.productImage} productDetails={props.productDetails}
          companyInfo={props.companyInfo} warehouseInfo={props.warehouseInfo} productName={props.productName} />
      </Modal>
    </>
  )
}

const ProductDetails = (props) => {
  const navigate = useNavigate()
  const [productImage, setProductImage] = useState()
  const [productDetails, setProductDetails] = useState([])
  const [companyInfo, setCompanyInfo] = useState()
  const [warehouseInfo, setWarehouseInfo] = useState()
  const [selectProDetailID, setSelectProDetailID] = useState()
  const [productDetail, setProductDetail] = useState()
  const [purchaseNum, setPurchaseNum] = useState(1)
  const [addressID, setAddressID] = useState(-1)
  const [addressName, setAddressName] = useState("")
  useEffect(() => {
    if (!selectProDetailID) { setProductImage(import.meta.env.VITE_API_BASE_URL + props.productImage) }
  }, [props.productImage, selectProDetailID])
  useEffect(() => {
    setProductDetails(props.productDetails)
    setCompanyInfo(props.companyInfo)
    setWarehouseInfo(props.warehouseInfo)
  }, [props])

  const defaultAddress = useSelector(state => state.userInfo.defaultAddress)
  useEffect(() => {
    if (defaultAddress) {
      if(defaultAddress.addressID) {
        setAddressID(defaultAddress.addressID)
      }
      if(defaultAddress.addressDetail) {
        setAddressName(defaultAddress.addressDetail)
      }
    }
  }, [defaultAddress])

  const totalPrice = useMemo(() => {
    if(!productDetail || !purchaseNum) return 0
    return (purchaseNum * productDetail.productPrice).toFixed(2)
  }, [purchaseNum, productDetail])

  const handleSelectItem = (proDetailID, index) => {
    setSelectProDetailID(proDetailID)
    setProductDetail(productDetails[index])
    setProductImage(import.meta.env.VITE_API_BASE_URL + productDetails[index].productImage)
  }

  const handleOnChangeAddress = (addressID, addressName) => {
    setAddressID(addressID)
    setAddressName(addressName)
  }

  const purchase = () => {
    if(!addressID) {
      message.error("请选择收货地址")
      return
    }
    if(purchaseNum <= 0) {
      message.error("请输入购买商品数量")
      return
    }
    if(purchaseNum > productDetail.productCnt) {
      message.error("商品库存不足")
      return
    }

    PurchaseProductApi(selectProDetailID, purchaseNum, totalPrice, addressID).then(res => {
      console.log(res)
      if(res.code === 200) {
        message.success("购买成功")
        navigate("/order")
      } else {
        message.error("购买失败")
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
    <div className={style.detailBox}>
      <div className={style.image}>
        <img src={productImage} alt="image" />
        {selectProDetailID && <div className={style.purchaseInfo}>
          <div className={style.price}><span className={style.sign}>￥</span>{productDetail.productPrice}</div>
          <div className={style.cnt}>库存剩余: {productDetail.productCnt}件</div>
        </div>}
      </div>
      <div className={style.detail}>
        <div className={style.detailType}>
          <div className={style.label}>商品种类:</div>
          <div className={style.tags}>
            {productDetails && productDetails.map((item, index) => {
              return (
                <div key={item.proDetailID}
                  className={style.tag + " " + (selectProDetailID === item.proDetailID ? style.activeTag : "")}
                  onClick={() => handleSelectItem(item.proDetailID, index)}>
                  {item.productName}
                </div>
              )
            })}
          </div>
        </div>
        <div className={style.detailType}>
          <div className={style.label}>供应商信息:</div>
          <div className={style.value}>{companyInfo && companyInfo.companyName}</div>
        </div>
        <div className={style.detailType}>
          <div className={style.label}>仓库信息:</div>
          <div className={style.value}>{warehouseInfo && warehouseInfo.warehouseName}</div>
        </div>

        {selectProDetailID && <div className={style.purchaseBox}>
          <h3>{props.productName} - {productDetail.productName}</h3>
          <div className={style.purchaseNum}>
            <div className={style.label}>购买数量：</div>
            <InputNumber value={purchaseNum} min={1} max={productDetail.productCnt} onChange={setPurchaseNum} />
          </div>
          <div className={style.purchaseAddress}>
            <div className={style.label}>配送地址：</div>
            <AddressSelect addressID={addressID} addressName={addressName} handleOnChangeAddress={(id, name) => handleOnChangeAddress(id, name)}/>
          </div>
          <div className={style.purchasePrice}>
            <div className={style.foront}>
              <div className={style.label}>总价格：</div>
              <div className={style.price}>￥<span>{totalPrice}</span></div>
            </div>
            <div className={style.back}>
              <Button type="primary" onClick={() => purchase()}>立即购买</Button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}
