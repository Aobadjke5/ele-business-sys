import request from "../request";

const ReturningOrderListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/order/returningList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { ReturningOrderListApi }