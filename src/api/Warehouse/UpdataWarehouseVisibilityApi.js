import request from "../request";

const UpdataWarehouseVisibilityApi = (warehouseID, optioin) => {
  return new Promise((resolve, reject) => {
    request.post("/warehouse/editVisibility", {
      "warehouseID": warehouseID,
      "option": optioin
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { UpdataWarehouseVisibilityApi }