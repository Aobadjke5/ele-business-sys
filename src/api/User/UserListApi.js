import request from "../request";

const UserListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/user/list").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { UserListApi }
