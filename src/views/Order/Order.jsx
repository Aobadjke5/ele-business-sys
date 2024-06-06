import { Button, Empty, Tabs, message } from "antd"
import PageTitle from "../../components/PageTitle/PageTitle"
import style from "./Order.module.scss"
import { useEffect, useState } from "react"
import { WaitingOrderListApi } from "../../api/Order/WaitingOrderListApi"
import { CancelledOrderListApi } from "../../api/Order/CancelledOrderListApi"
import { useSelector } from "react-redux"
import OrderItem from "./Components/OrderItem"
import { SendingOrderListApi } from "../../api/Order/SendingOrderListApi"
import { CompletedOrderListApi } from "../../api/Order/CompletedOrderListApi"
import { ReturningOrderListApi } from "../../api/Order/ReturningOrderListApi"
import { SuccessOrderListApi } from "../../api/Order/SuccessOrderListApi"
import { ReloadOutlined } from "@ant-design/icons"

export default function Order() {
  const [tabIndex, setTabIndex] = useState('0')
  const [reloadFlag, setReloadFlag] = useState(false)
  const refreshButton = <Button onClick={() => setReloadFlag(true)} style={{marginRight: "55px"}} icon={<ReloadOutlined />}>刷新列表</Button>

  const handleOnTabClick = (key) => {
    if(key !== tabIndex) {
      setTabIndex(key)
    }
  }

  useEffect(() => {
    if(reloadFlag) {
      setReloadFlag(false)
    }
  }, [reloadFlag])

  return (
    <>
      <PageTitle title="我的订单" noLine/>
      <Tabs type="card" tabBarExtraContent={refreshButton} destroyInactiveTabPane={true} onTabClick={handleOnTabClick}>
        <Tabs.TabPane tab="待发货" key={0}>
          <OrderBox status="Waiting" tabIndex={tabIndex} reloadFlag={reloadFlag} keyLable={'0'}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="配送中" key={1}>
          <OrderBox status="Sending" tabIndex={tabIndex} reloadFlag={reloadFlag} keyLable={'1'}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已完成" key={2}>
          <OrderBox status="Completed" tabIndex={tabIndex} reloadFlag={reloadFlag} keyLable={'2'}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已取消" key={3}>
          <OrderBox status="Cancelled" tabIndex={tabIndex} reloadFlag={reloadFlag} keyLable={'3'}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="退货中" key={4}>
          <OrderBox status="Returning" tabIndex={tabIndex} reloadFlag={reloadFlag} keyLable={'4'}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已退货" key={5}>
          <OrderBox status="Success" tabIndex={tabIndex} reloadFlag={reloadFlag} keyLable={'5'}/>
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

function OrderBox(props) {
  const [showList, setShowList] = useState()
  const userRole = useSelector(state => state.userInfo.role)

  useEffect(() => {
    if(props.reloadFlag && props.tabIndex === props.keyLable) {
      const getShowList = async (status) => {
        const ret = await getOrderList(status)
        setShowList(ret)
      }

      if(userRole === "Dealer" || userRole === "Supplier" || userRole === "Warehouser") {
        getShowList(props.status)
      }
    }
  }, [props.reloadFlag, props.tabIndex])
  
  useEffect(() => {
    const getShowList = async (status) => {
      const ret = await getOrderList(status)
      setShowList(ret)
    }

    if(userRole === "Dealer" || userRole === "Supplier" || userRole === "Warehouser") {
      if(showList === undefined) {
        getShowList(props.status)
      }
    }
  }, [userRole])

  const refresh = async () => {
    let ret = await getOrderList(props.status)
    setShowList(ret)
  }

  return (
    <div className={style.orderBox}>
      {(showList && showList.length > 0) ? 
        showList.map(item => <OrderItem key={item.orderID} {...item} role={userRole} status={props.status} refresh={() => refresh()}/>) : 
        <Empty style={{marginTop: "75px"}}/>
      }
    </div>
  )
}

const getOrderList = async (status) => {
  let ret = []
  if(status === "Waiting") {
    try {
      let res = await WaitingOrderListApi()
      console.log(res)
      ret = res.data.orderList
    } catch (error) {
      console.log(error)
      message.error("网络错误，请稍后重试")
      ret = []
    }
  }
  else if(status === "Cancelled") {
    try {
      let res = await CancelledOrderListApi()
      console.log(res)
      ret = res.data.orderList
    } catch (error) {
      console.log(error)
      message.error("网络错误，请稍后重试")
      ret = []
    }
  }
  else if(status === "Sending") {
    try {
      let res = await SendingOrderListApi()
      console.log(res)
      ret = res.data.orderList
    } catch (error) {
      console.log(error)
      message.error("网络错误，请稍后重试")
      ret = []
    }
  }
  else if(status === "Completed") {
    try {
      let res = await CompletedOrderListApi()
      console.log(res)
      ret = res.data.orderList
    } catch (error) {
      console.log(error)
      message.error("网络错误，请稍后重试")
      ret = []
    }
  }
  else if(status === "Returning") {
    try {
      let res = await ReturningOrderListApi()
      console.log(res)
      ret = res.data.orderList
    } catch (error) {
      console.log(error)
      message.error("网络错误，请稍后重试")
      ret = []
    }
  } else if(status === "Success") {
    try {
      let res = await SuccessOrderListApi()
      console.log(res)
      ret = res.data.orderList
    } catch (error) {
      console.log(error)
      message.error("网络错误，请稍后重试")
      ret = []
    }
  }

  console.log(ret)
  return ret
}
