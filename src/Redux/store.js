import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Reducers/counterReducer";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
