import { createSlice } from "@reduxjs/toolkit";

export const notifySlice = createSlice({
    name: "notification",
    initialState: {},
    reducers: {
        sEmmitNotification: (state, data): any => {
            return data.payload;
        }
    }
})

export const { sEmmitNotification } = notifySlice.actions;

export const userInfoSlices = createSlice({
    name: "user info",
    initialState: {},
    reducers: {
        sSetUser: (state, data) => data,
        sUpdateUser: (state, data) => ({ ...state, ...data }),
        sClearUser: () => { }
    }
})
export const { sSetUser, sUpdateUser, sClearUser } = userInfoSlices.actions;