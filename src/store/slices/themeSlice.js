import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: false,
    showAlerts: true,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    toggleAlerts: (state) => {
      state.showAlerts = !state.showAlerts;
    },
  },
});

export const { toggleDarkMode, toggleAlerts } = themeSlice.actions;
export default themeSlice.reducer;
