import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Platform } from "react-native";

const baseUrl = Platform.select({
  android: "http://10.0.2.2:8000",
  ios: "http://localhost:8000",
});

// Async thunks
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes`);
      const data = await response.json();
      if (!data.success)
        throw new Error(data.error || "Failed to fetch recipes");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchRecipes = createAsyncThunk(
  "recipes/searchRecipes",
  async (query, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes/search/${query}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Search failed");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });
      const data = await response.json();
      if (!data.success)
        throw new Error(data.error || "Failed to create recipe");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes/${recipeData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });
      const data = await response.json();
      if (!data.success)
        throw new Error(data.error || "Failed to update recipe");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success)
        throw new Error(data.error || "Failed to delete recipe");
      return recipeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    items: [],
    selectedRecipe: null,
    loading: false,
    error: null,
    searchQuery: "",
  },
  reducers: {
    setSelectedRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Recipes
      .addCase(searchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Recipe
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Recipe
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (recipe) => recipe._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Recipe
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (recipe) => recipe._id !== action.payload
        );
      });
  },
});

export const { setSelectedRecipe, clearError, setSearchQuery } =
  recipeSlice.actions;
export default recipeSlice.reducer;
