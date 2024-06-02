import request from "../request";

const CompletedOrderListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/order/completedList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { CompletedOrderListApi }