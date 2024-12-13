import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./slices/recipeSlice";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
  },
});
