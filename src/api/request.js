import axios from "axios"
import CryptoJS from 'crypto-js'
import { getToken, isTokenAvailable } from "../utils/JwtUtils";
import { MD5, base64ToUtf8 } from "../utils/EncipherUtils";

const responsekeyString = import.meta.env.VITE_AES_RESPONSE_KEY
const responseivString = import.meta.env.VITE_AES_RESPONSE_IV


const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  timeout: 5000,
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent

  if (config.url !== "/auth/login" && config.url !== "/auth/register") {
    if (!isTokenAvailable()) {
      return Promise.reject({ "message": "token is not available", "code": 40004 })
    }
    config.headers.Authorization = "Bearer " + getToken("token")
  }

  let nowTime = new Date().getTime().toString()
  config.headers['XY-time'] = nowTime

  let dataMD5 = MD5(JSON.stringify(config.data ? config.data : "") + nowTime)
  config.headers['XY-sign'] = dataMD5

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  // 对加密响应值解密
  const encryptedBase64String = response.data;
  if (encryptedBase64String === "") {
    throw new Error("Server Error")
  }

  try {
    const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedBase64String);

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedBytes
    });
    const decryptedBytes = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(responsekeyString), {
      iv: CryptoJS.enc.Utf8.parse(responseivString),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const jsonString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    console.log(jsonString)
    const jsonData = JSON.parse(base64ToUtf8(jsonString));

    response.data = jsonData;

    return response;
  } catch (error) {
    // 处理解密错误  
    console.error('Decryption error:', error);
    throw error;
  }
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default request
