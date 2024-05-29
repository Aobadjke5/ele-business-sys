import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  "userName": "",
  "role": "",
  "status": "",
  "companyName": "",
  "companyIcon": "",
  "companyAddress": "",
  "peopleName": "",
  "peopleTel": "",
  "peopleMail": "",
  "defaultAddress": {}
}

const UserInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (_, action) => {
      return {...initialState, ...action.payload}
    },
    setDefaultAddress: (state, action) => {
      return {...state, "defaultAddress": action.payload}
    }
  }
})

export const { setUserInfo, setDefaultAddress } = UserInfoSlice.actions
export default UserInfoSlice.reducer