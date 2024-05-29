import request from "../request"

const ProductListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/product/list").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { ProductListApi }