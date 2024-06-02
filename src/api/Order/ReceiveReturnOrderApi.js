import request from "../request";

const ReceiveReturnOrderApi = (orderID) => {
  const nowTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    request.post("/order/receiveReturn", {
      "orderID": orderID,
      "completionTime": nowTime
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { ReceiveReturnOrderApi }