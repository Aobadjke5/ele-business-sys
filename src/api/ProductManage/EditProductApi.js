import request from "../request";

const EditProductApi = (productID, productName, productImage, warehouseID, productDetails) => {
  return new Promise((resolve, reject) => {
    request.post("/product/edit", {
      "productID": productID,
      "productName": productName,
      "productImage": productImage,
      "warehouseID": warehouseID,
      "productDetails": productDetails
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { EditProductApi }