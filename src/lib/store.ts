import { configureStore } from "@reduxjs/toolkit"
import { notifySlice, userInfoSlices } from "./slice"

export default configureStore({
    reducer: {
        notify: notifySlice.reducer,
        user: userInfoSlices.reducer
    }
  })