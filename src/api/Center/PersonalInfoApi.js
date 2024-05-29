import request from "../request";

const PersonalInfoApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/center/personInfo").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { PersonalInfoApi }
