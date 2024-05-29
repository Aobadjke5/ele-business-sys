import request from "../request"

const MyProductListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/product/manageList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { MyProductListApi }