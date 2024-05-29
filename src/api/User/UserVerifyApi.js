import request from "../request";

const UserVerifyApi = (userID, option) => {
  return new Promise((resolve, reject) => {
    request.post("/user/verify", {
      "userID": userID,
      "option": option
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { UserVerifyApi }