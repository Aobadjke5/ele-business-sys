import request from "../request"

const MyWarehouseListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/warehouse/manageList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { MyWarehouseListApi }