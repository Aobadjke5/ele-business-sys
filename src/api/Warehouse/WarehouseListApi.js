import request from "../request";

const WarehouseListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/warehouse/list").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { WarehouseListApi }