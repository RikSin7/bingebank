import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: localStorage.getItem("theme") === "dark", // Get initial theme from localStorage
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light"); // Save theme to localStorage
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
