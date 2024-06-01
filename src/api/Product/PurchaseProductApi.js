import request from "../request";

const PurchaseProductApi = (proDetailID, productCnt, totalPrice, addressID) => {
  const nowTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    request.post("/product/purchase", {
      "proDetailID": proDetailID,
      "productCnt": productCnt,
      "totalPrice": totalPrice,
      "createTime": nowTime,
      "addressID": addressID
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { PurchaseProductApi }