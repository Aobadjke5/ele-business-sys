import { Button, Tag, message } from "antd"
import style from "./OrderItem.module.scss"
import { TruckOutlined, InboxOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { CancelOrderApi } from "../../../api/Order/CancelOrderApi"
import { getFormatTime } from "../../../utils/TimestampUtils"
import { DeliverOrderApi } from "../../../api/Order/DeliverOrderApi"
import { ReceiveOrderApi } from "../../../api/Order/ReceiveOrderApi"
import { RefuseOrderApi } from "../../../api/Order/RefuseOrderApi"
import { RefuseReturnOrderApi } from "../../../api/Order/RefuseReturnOrderApi"
import { ReceiveReturnOrderApi } from "../../../api/Order/ReceiveReturnOrderApi"
import { useNavigate } from "react-router-dom"

export default function OrderItem(props) {
  if (props.status === "Waiting") {
    return (<WaitingItem {...props} role={props.role} />)
  } else if (props.status === "Cancelled") {
    return (<CancelledItem {...props} role={props.role} />)
  } else if (props.status === "Sending") {
    return (<SendingItem {...props} role={props.role} />)
  } else if (props.status === "Completed") {
    return (<CompletedItem {...props} role={props.role} />)
  } else if (props.status === "Returning") {
    return (<ReturningItem {...props} role={props.role} />)
  } else if (props.status === "Success") {
    return (<SuccessItem {...props} role={props.role} />)
  }
}

function WaitingItem(props) {
  const navigate = useNavigate()
  const [time, setTime] = useState()
  useEffect(() => {
    const formattedDate = getFormatTime(props.createTimestamp)
    setTime(formattedDate)
  }, [props.createTimestamp])

  const handleCancelOrder = () => {
    console.log("cancel order", props.orderID)
    CancelOrderApi(props.orderID).then(res => {
      if (res.code === 200) {
        message.success("操作成功")
        props.refresh()
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

  const handleSendingOrder = () => {
    console.log("sending order", props.orderID)
    DeliverOrderApi(props.orderID).then(res => {
      if (res.code === 200) {
        message.success("操作成功")
        props.refresh()
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

  return (
    <div className={style.orderItem}>
      <div className={style.leftImage}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
      </div>
      <div className={style.middleInfo}>
        <div className={style.productInfo}>
          <div className={style.productInfoItem}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.productTag}><Tag>{props.proDetailName}</Tag></div>
          </div>
          <div className={style.productInfoItem}>
            <div className={style.productPrice}>{props.productPrice}</div>
            <div className={style.productCnt}>{props.productCnt}</div>
            <div className={style.productTotalPrice}>{props.totalPrice}</div>
          </div>
        </div>

        <div className={style.ortherInfo}>
          <div className={style.sendingInfo}>
            <div className={style.addressItem}>
              <div><TruckOutlined /></div>
              <div className={style.label}>发货仓库：</div>
              <div className={style.contentValue}>{props.warehouseInfo.warehouseName}</div>
            </div>
            <div className={style.addressItem}>
              <div><InboxOutlined /></div>
              <div className={style.label}>收货地址：</div>
              <div className={style.contentValue}>{props.addressInfo.addressDetail}</div>
            </div>

            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单创建时间：</div>
              <div className={style.contentValue}>{time}</div>
            </div>
          </div>

          {
            props.role === "Supplier" ? (
              <div className={style.option2}>
                等待第三方仓库发货
              </div>
            ) : (
              <div className={style.option}>
                {props.role === "Dealer" && <Button type="link" onClick={() => handleCancelOrder()}>取消订单</Button>}
                {props.role === "Warehouser" && <Button onClick={() => handleSendingOrder()}>发货</Button>}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function CancelledItem(props) {
  const [time1, setTime1] = useState()
  const [time2, setTime2] = useState()
  useEffect(() => {
    const formattedDate1 = getFormatTime(props.createTimestamp)
    const formattedDate2 = getFormatTime(props.completionTimestamp)
    setTime1(formattedDate1)
    setTime2(formattedDate2)
  }, [props.createTimestamp, props.completionTimestamp])

  return (
    <div className={style.orderItem}>
      <div className={style.leftImage}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
      </div>
      <div className={style.middleInfo}>
        <div className={style.productInfo}>
          <div className={style.productInfoItem}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.productTag}><Tag>{props.proDetailName}</Tag></div>
          </div>
          <div className={style.productInfoItem}>
            <div className={style.productPrice}>{props.productPrice}</div>
            <div className={style.productCnt}>{props.productCnt}</div>
            <div className={style.productTotalPrice}>{props.totalPrice}</div>
          </div>
        </div>

        <div className={style.ortherInfo}>
          <div className={style.sendingInfo}>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单创建时间：</div>
              <div className={style.contentValue}>{time1}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单取消时间：</div>
              <div className={style.contentValue}>{time2}</div>
            </div>
          </div>

          {
            props.role === "Dealer" ? (
              <div className={style.option2}>
                已取消订单
              </div>
            ) : (
              <div className={style.option2}>
                买家已取消订单
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function SendingItem(props) {
  const navigate = useNavigate()
  const [time1, setTime1] = useState()
  const [time2, setTime2] = useState()
  useEffect(() => {
    const formattedDate1 = getFormatTime(props.createTimestamp)
    const formattedDate2 = getFormatTime(props.deliveryTimestamp)
    setTime1(formattedDate1)
    setTime2(formattedDate2)
  }, [props.createTimestamp, props.deliveryTimestamp])

  const handleReceiveOrder = () => {
    console.log("ReceiveOrder", props.orderID)
    ReceiveOrderApi(props.orderID).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("操作成功")
        props.refresh()
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
  const handleRefuseOrder = () => {
    console.log("RefuseOrder", props.orderID)
    RefuseOrderApi(props.orderID).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("操作成功")
        props.refresh()
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

  return (
    <div className={style.orderItem}>
      <div className={style.leftImage}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
      </div>
      <div className={style.middleInfo}>
        <div className={style.productInfo}>
          <div className={style.productInfoItem}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.productTag}><Tag>{props.proDetailName}</Tag></div>
          </div>
          <div className={style.productInfoItem}>
            <div className={style.productPrice}>{props.productPrice}</div>
            <div className={style.productCnt}>{props.productCnt}</div>
            <div className={style.productTotalPrice}>{props.totalPrice}</div>
          </div>
        </div>

        <div className={style.ortherInfo}>
          <div className={style.sendingInfo}>
            <div className={style.addressItem}>
              <div><TruckOutlined /></div>
              <div className={style.label}>发货仓库：</div>
              <div className={style.contentValue}>{props.warehouseInfo.warehouseName}</div>
            </div>
            <div className={style.addressItem}>
              <div><InboxOutlined /></div>
              <div className={style.label}>收货地址：</div>
              <div className={style.contentValue}>{props.addressInfo.addressDetail}</div>
            </div>

            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单创建时间：</div>
              <div className={style.contentValue}>{time1}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>仓库发货时间：</div>
              <div className={style.contentValue}>{time2}</div>
            </div>
          </div>
          {
            props.role === "Dealer" ? (
              <div className={style.option2}>
                <div><Button style={{ marginRight: "5px" }} onClick={() => handleRefuseOrder()}>退货</Button></div>
                <div><Button style={{ marginLeft: "5px" }} type="primary" onClick={() => handleReceiveOrder()}>确认收货</Button></div>
              </div>
            ) : (
              <div className={style.option2}>
                等待买家收货
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function CompletedItem(props) {
  const [time1, setTime1] = useState()
  const [time2, setTime2] = useState()
  const [time3, setTime3] = useState()
  useEffect(() => {
    const formattedDate1 = getFormatTime(props.createTimestamp)
    const formattedDate2 = getFormatTime(props.deliveryTimestamp)
    const formattedDate3 = getFormatTime(props.completionTimestamp)
    setTime1(formattedDate1)
    setTime2(formattedDate2)
    setTime3(formattedDate3)
  }, [props.createTimestamp, props.completionTimestamp, props.deliveryTimestamp])

  return (
    <div className={style.orderItem}>
      <div className={style.leftImage}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
      </div>
      <div className={style.middleInfo}>
        <div className={style.productInfo}>
          <div className={style.productInfoItem}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.productTag}><Tag>{props.proDetailName}</Tag></div>
          </div>
          <div className={style.productInfoItem}>
            <div className={style.productPrice}>{props.productPrice}</div>
            <div className={style.productCnt}>{props.productCnt}</div>
            <div className={style.productTotalPrice}>{props.totalPrice}</div>
          </div>
        </div>

        <div className={style.ortherInfo}>
          <div className={style.sendingInfo}>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单创建时间：</div>
              <div className={style.contentValue}>{time1}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>商品发货时间：</div>
              <div className={style.contentValue}>{time2}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单完成时间：</div>
              <div className={style.contentValue}>{time3}</div>
            </div>
          </div>

          <div className={style.option2}>
            当前订单已完成
          </div>
        </div>
      </div>
    </div>
  )
}

function ReturningItem(props) {
  const navigate = useNavigate()
  const [time1, setTime1] = useState()
  const [time3, setTime3] = useState()
  useEffect(() => {
    const formattedDate1 = getFormatTime(props.createTimestamp)
    const formattedDate3 = getFormatTime(props.completionTimestamp)
    setTime1(formattedDate1)
    setTime3(formattedDate3)
  }, [props.createTimestamp, props.completionTimestamp, props.deliveryTimestamp])

  const handleRefuseReturnOrder = () => {
    console.log("RefuseReturn", props.orderID)
    RefuseReturnOrderApi(props.orderID).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("操作成功")
        props.refresh()
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
  const handleReceiveReturnOrder = () => {
    console.log("ReceiveReturn", props.orderID)
    ReceiveReturnOrderApi(props.orderID).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success("操作成功")
        props.refresh()
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

  return (
    <div className={style.orderItem}>
      <div className={style.leftImage}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
      </div>
      <div className={style.middleInfo}>
        <div className={style.productInfo}>
          <div className={style.productInfoItem}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.productTag}><Tag>{props.proDetailName}</Tag></div>
          </div>
          <div className={style.productInfoItem}>
            <div className={style.productPrice}>{props.productPrice}</div>
            <div className={style.productCnt}>{props.productCnt}</div>
            <div className={style.productTotalPrice}>{props.totalPrice}</div>
          </div>
        </div>

        <div className={style.ortherInfo}>
          <div className={style.sendingInfo}>
            <div className={style.addressItem}>
              <div><TruckOutlined /></div>
              <div className={style.label}>存储仓库：</div>
              <div className={style.contentValue}>{props.warehouseInfo.warehouseName}</div>
            </div>
            <div className={style.addressItem}>
              <div><InboxOutlined /></div>
              <div className={style.label}>目的地址：</div>
              <div className={style.contentValue}>{props.addressInfo.addressDetail}</div>
            </div>

            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单创建时间：</div>
              <div className={style.contentValue}>{time1}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单退货时间：</div>
              <div className={style.contentValue}>{time3}</div>
            </div>
          </div>

          {
            props.role === "Warehouser" ? (
              <div className={style.option2}>
                <div><Button style={{ marginRight: "5px" }} onClick={() => handleRefuseReturnOrder()}>拒绝</Button></div>
                <div><Button style={{ marginLeft: "5px" }} type="primary" onClick={() => handleReceiveReturnOrder()}>确认退货</Button></div>
              </div>
            ) : (
              <div className={style.option2}>
                等待仓库确认退货
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function SuccessItem(props) {
  const [time1, setTime1] = useState()
  const [time2, setTime2] = useState()
  const [time3, setTime3] = useState()
  useEffect(() => {
    const formattedDate1 = getFormatTime(props.createTimestamp)
    const formattedDate2 = getFormatTime(props.deliveryTimestamp)
    const formattedDate3 = getFormatTime(props.completionTimestamp)
    setTime1(formattedDate1)
    setTime2(formattedDate2)
    setTime3(formattedDate3)
  }, [props.createTimestamp, props.completionTimestamp, props.deliveryTimestamp])

  return (
    <div className={style.orderItem}>
      <div className={style.leftImage}>
        <img src={import.meta.env.VITE_API_BASE_URL + props.productImage} alt="image" />
      </div>
      <div className={style.middleInfo}>
        <div className={style.productInfo}>
          <div className={style.productInfoItem}>
            <div className={style.productName}>{props.productName}</div>
            <div className={style.productTag}><Tag>{props.proDetailName}</Tag></div>
          </div>
          <div className={style.productInfoItem}>
            <div className={style.productPrice}>{props.productPrice}</div>
            <div className={style.productCnt}>{props.productCnt}</div>
            <div className={style.productTotalPrice}>{props.totalPrice}</div>
          </div>
        </div>

        <div className={style.ortherInfo}>
          <div className={style.sendingInfo}>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>订单创建时间：</div>
              <div className={style.contentValue}>{time1}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>商品发货时间：</div>
              <div className={style.contentValue}>{time2}</div>
            </div>
            <div className={style.addressItem}>
              <div><ClockCircleOutlined /></div>
              <div className={style.label}>退货完成时间：</div>
              <div className={style.contentValue}>{time3}</div>
            </div>
          </div>

          <div className={style.option2}>
            当前订单已成功退货
          </div>
        </div>
      </div>
    </div>
  )
}