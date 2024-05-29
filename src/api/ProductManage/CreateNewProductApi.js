import request from "../request";

const CreateNewProductApi = (productName, productImage, warehouseID, productStatus, productDetails) => {
  return new Promise((resolve, reject) => {
    request.post("/product/create", {
      "productName": productName,
      "productImage": productImage,
      "warehouseID": warehouseID,
      "status": productStatus,
      "productDetails": productDetails
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { CreateNewProductApi }
