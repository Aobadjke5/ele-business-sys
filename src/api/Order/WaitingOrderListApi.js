import request from "../request"

const WaitingOrderListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/order/waitingList").then((res) => {
      resolve(res.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export { WaitingOrderListApi }