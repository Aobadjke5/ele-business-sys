import request from "../request";

const ChangePasswordApi = (oldPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    request.post("/auth/changePw", {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

export { ChangePasswordApi }