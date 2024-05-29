import request from "../request";

const EditWarehouseApi = (warehouseID, warehouseName, warehouseAddress, warehouseImage, currentCapacity, totalCapacity) => {
  return new Promise((resolve, reject) => {
    request.post("/warehouse/edit", {
      "warehouseID": warehouseID,
      "warehouseName": warehouseName,
      "warehouseAddress": warehouseAddress,
      "warehouseImage": warehouseImage,
      "currentCapacity": currentCapacity,
      "totalCapacity": totalCapacity
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { EditWarehouseApi }
