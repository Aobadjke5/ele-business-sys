import request from "../request";

const CreateNewAdminApi = (adminImage, adminName, adminNickname) => {
  return new Promise((resolve, reject) => {
    request.post("/admin/addAdmin", {
      "adminImage": adminImage,
      "adminName": adminName,
      "adminNickname": adminNickname
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { CreateNewAdminApi }