import request from "../request";

const UpdataProductVisibilityApi = (productID, option) => {
  return new Promise((resolve, reject) => {
    request.post("/product/editVisibility", {
      "productID": productID,
      "option": option
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { UpdataProductVisibilityApi }