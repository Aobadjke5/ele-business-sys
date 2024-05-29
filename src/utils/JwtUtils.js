const isTokenAvailable = () => {
  return sessionStorage.getItem("token") !== null;
}

const setToken = (token) => {
  sessionStorage.setItem("token", token);
}

const getToken = () => {
  return sessionStorage.getItem("token");
}

const removeToken = () => {
  sessionStorage.removeItem("token");
}

export { isTokenAvailable, setToken, getToken, removeToken }
