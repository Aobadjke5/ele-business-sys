import request from "../request";

const RefuseReturnOrderApi = (orderID) => {
  return new Promise((resolve, reject) => {
    request.post("/order/refuseReturn", {
      "orderID": orderID
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { RefuseReturnOrderApi }