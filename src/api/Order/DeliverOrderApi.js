import request from "../request";

const DeliverOrderApi = (orderID) => {
  const nowTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    request.post("/order/deliver", {
      "orderID": orderID,
      "deliverTime": nowTime
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { DeliverOrderApi }