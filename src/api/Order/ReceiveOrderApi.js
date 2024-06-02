import request from "../request";

const ReceiveOrderApi = (orderID) => {
  const nowTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    request.post("/order/receive", {
      "orderID": orderID,
      "completionTime": nowTime
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { ReceiveOrderApi }