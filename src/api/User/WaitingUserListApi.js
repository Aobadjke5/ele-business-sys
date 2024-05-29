import request from "../request";

const WaitingUserListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/user/waitingList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { WaitingUserListApi }
