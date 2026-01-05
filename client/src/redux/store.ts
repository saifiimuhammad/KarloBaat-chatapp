import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
import api from "./api/api";

// Configure Redux store
const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
