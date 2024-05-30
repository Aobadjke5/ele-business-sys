import request from "../request";

const EditPersonalInfoApi = (companyName, companyIcon, companyAddress, peopleName, peopleTel, peopleMail) => {
  return new Promise((resolve, reject) => {
    request.post("/center/edit", {
      "companyName": companyName,
      "companyIcon": companyIcon,
      "companyAddress": companyAddress,
      "peopleName": peopleName,
      "peopleTel": peopleTel,
      "peopleMail": peopleMail
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export { EditPersonalInfoApi }