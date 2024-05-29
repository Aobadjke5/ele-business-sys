import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "Dealer",
  companyName: "",
  companyAddress: "",
  companyIcon: "",
  peopleName: "",
  peopleTel: "",
  peopleMail: ""
}

const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    getStep1Info: (state, action) => {
      return {
        ...state,
        role: action.payload.role,
        companyName: action.payload.companyName,
        companyAddress: action.payload.companyAddress,
      }
    },
    getStep2Info: (state, action) => {
      return {
        ...state,
        companyIcon: action.payload.companyIcon,
      }
    },
    getStep3Info: (state, action) => {
      return {
        ...state,
        peopleName: action.payload.peopleName,
        peopleTel: action.payload.peopleTel,
        peopleMail: action.payload.peopleMail,
      }
    },
    clear: () => {
      return initialState
    },
    getDataBaseInfo: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    }
  },
})

export const { getStep1Info, getStep2Info, getStep3Info, clear, getDataBaseInfo } = RegisterSlice.actions
export default RegisterSlice.reducer