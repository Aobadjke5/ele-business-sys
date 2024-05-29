import request from "../request";

const CreateNewWarehouseApi = (warehouseName, warehouseAddress, warehouseImage, status, currentCapacity, totalCapacity) => {
  return new Promise((resolve, reject) => {
    request.post("/warehouse/create", {
      "warehouseName": warehouseName,
      "warehouseAddress": warehouseAddress,
      "warehouseImage": warehouseImage,
      "status": status,
      "currentCapacity": currentCapacity,
      "totalCapacity": totalCapacity
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { CreateNewWarehouseApi }
