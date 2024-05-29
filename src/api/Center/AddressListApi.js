import request from "../request";

const AddressListApi = () => {
  return new Promise((resolve, reject) => {
    request.post("/center/addressList").then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { AddressListApi }