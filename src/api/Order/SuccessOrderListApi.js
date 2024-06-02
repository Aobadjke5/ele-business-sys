import request from "../request";

const SuccessOrderListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/order/successList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { SuccessOrderListApi }