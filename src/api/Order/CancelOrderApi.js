import request from "../request";

const CancelOrderApi = (orderID) => {
  const nowTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    request.post("/order/cancel", {
      "orderID": orderID,
      "cancelTime": nowTime
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { CancelOrderApi }