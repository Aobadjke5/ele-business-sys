import request from "../request";

const SendingOrderListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/order/sendingList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  });
}

export { SendingOrderListApi }
