import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./movieSlice";
import darkReducer from "./darkModeSlice";
const store = configureStore({
  reducer: {
    bingebank: movieReducer,
    darkMode: darkReducer,
  },
});

export default store;
