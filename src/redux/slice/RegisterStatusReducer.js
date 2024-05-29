import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flag: false,
  status: ""
}

const RegisterStatusSlice = createSlice({
  name: "registerStatus",
  initialState,
  reducers: {
    setRegisterStatus: (_, action) => {
      return {
        flag: true,
        status: action.payload.status
      }
    },
    hadRegistered: () => {
      return {
        flag: false,
        status: ""
      }
    }
  }
})

export const { setRegisterStatus, hadRegistered } = RegisterStatusSlice.actions
export default RegisterStatusSlice.reducer