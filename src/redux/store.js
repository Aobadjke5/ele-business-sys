import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./slice/RegisterReducers";
import registerStatusReducer from "./slice/RegisterStatusReducer";
import userInfoReducer from "./slice/UserInfoReducer";

const store = configureStore({
  reducer: {
    register: registerReducer,
    registerStatus: registerStatusReducer,
    userInfo: userInfoReducer
  }
})

export default store
