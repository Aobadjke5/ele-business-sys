import request from "../request";

const UserListApi = (page, pageSize, keyWord) => {
  return new Promise((resolve, reject) => {
    request.post("/user/list", {
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

export { UserListApi }
