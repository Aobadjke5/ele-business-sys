import request from "../request";

const EditAddressApi = (addressID, addressDetail, peopleName, peopleTel) => {
  return new Promise((resolve, reject) => {
    request.post("/center/editAddress", {
      "addressID": addressID,
      "addressDetail": addressDetail,
      "peopleName": peopleName,
      "peopleTel": peopleTel
    }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

export { EditAddressApi }