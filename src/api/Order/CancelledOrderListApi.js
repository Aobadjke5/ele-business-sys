import request from "../request";

const CancelledOrderListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/order/cancelledList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { CancelledOrderListApi }