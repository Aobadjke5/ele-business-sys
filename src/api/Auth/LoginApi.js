import request from "../request";

const LoginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    request.post("/auth/login", {
      username: username,
      password: password
    }, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      console.log(res)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { LoginApi }
