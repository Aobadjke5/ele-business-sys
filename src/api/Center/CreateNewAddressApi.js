import request from "../request";

const CreateNewAddressApi = (address, peopleName, peopleTel) => {
  return new Promise((resolve, reject) => {
    request.post("/center/addAddress", {
      "addressDetail": address,
      "peopleName": peopleName,
      "peopleTel": peopleTel
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { CreateNewAddressApi }