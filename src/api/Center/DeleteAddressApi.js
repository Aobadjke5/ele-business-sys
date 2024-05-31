import request from "../request";

const DeleteAddressApi = (addressID) => {
  return new Promise((resolve, reject) => {
    request.post("/center/delAddress", {
      addressID: addressID
    }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

export { DeleteAddressApi }