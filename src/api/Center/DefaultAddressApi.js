import request from "../request";

const DefaultAddressApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/center/defaultAddress").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { DefaultAddressApi }
