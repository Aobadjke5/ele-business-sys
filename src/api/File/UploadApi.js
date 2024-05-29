import request from "../request";

const fileUploadApi = (file, type="") => {
  return new Promise((resolve, reject) => {
    request.post("/upload", {
      file: file,
      type: type
    },{ headers: { 'Content-Type': 'multipart/form-data' }}).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
}

export { fileUploadApi };
