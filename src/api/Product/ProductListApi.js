import request from "../request"

const ProductListApi = (page, pageSize, keyWord="") => {
  return new Promise((resolve, reject) => {
    request.post("/product/list", {
      "page": page,
      "pageSize": pageSize,
      "keyWord": keyWord
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { ProductListApi }