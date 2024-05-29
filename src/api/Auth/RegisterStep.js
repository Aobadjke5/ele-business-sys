import request from "../request";

const RegisterStep1 = (role, companyName, companyAddress) => {
  return new Promise((resolve, reject) => {
    request.post("/register/step1", {
      "role": role,
      "companyName": companyName,
      "companyAddress": companyAddress
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

const RegisterStep2 = (companyIcon) => {
  return new Promise((resolve, reject) => {
    request.post("/register/step2", {
      "companyIcon": companyIcon
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

const RegisterStep3 = (peopleName, peopleTel, peopleMail) => {
  return new Promise((resolve, reject) => {
    request.post("/register/step3", {
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

export { RegisterStep1, RegisterStep2, RegisterStep3 }