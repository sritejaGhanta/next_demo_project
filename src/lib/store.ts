import { configureStore } from "@reduxjs/toolkit"
import { notifySlice, userInfoSlices } from "./slice"

// export const makeStore = () => {
//     return configureStore({
//         reducer: {
//             notify: notifySlice.reducer,
//             user: userInfoSlices.reducer
//         }
//     })
// }

export default configureStore({
    reducer: {
        notify: notifySlice.reducer,
        user: userInfoSlices.reducer
    }
  })