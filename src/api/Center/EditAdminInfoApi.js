import request from "../request";

const EditAdminInfoApi = (companyName, companyIcon) => {
  return new Promise((resolve, reject) => {
    request.post("/center/adminEdit", {
      "companyName": companyName,
      "companyIcon": companyIcon,
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { EditAdminInfoApi }