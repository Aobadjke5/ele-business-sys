import request from "../request";

const RefuseOrderApi = (orderID) => {
  const nowTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    request.post("/order/refuse", {
      "orderID": orderID,
      "completionTime": nowTime
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { RefuseOrderApi }