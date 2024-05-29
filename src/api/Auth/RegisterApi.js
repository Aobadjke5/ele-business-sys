import request from "../request"

const RegisterApi = (username, password) => {
  return new Promise((resolve, reject) => {
    request.post("/auth/register", {
      "username": username,
      "password": password
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { RegisterApi }