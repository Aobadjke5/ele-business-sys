import axios from "axios"
import { getToken, isTokenAvailable } from "../utils/JwtUtils";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  timeout: 5000,
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent

  if(config.url !== "/auth/login" && config.url !== "/auth/register") {
    if(!isTokenAvailable()) {
      return Promise.reject({"message": "token is not available", "code": 40004})
    }
    config.headers.Authorization = "Bearer " + getToken("token")
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default request
