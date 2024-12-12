import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";

// Create styled components
const StyledView = styled(View);
const StyledText = styled(Text);

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const baseUrl = Platform.select({
        android: "http://10.0.2.2:8000",
        ios: "http://localhost:8000",
      });

      console.log("Fetching from:", `${baseUrl}/api/recipes`);

      const response = await fetch(`${baseUrl}/api/recipes`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let json;
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        setError(`Parse error: ${parseError.message}`);
        return;
      }

      if (json.success) {
        console.log("Recipes fetched:", json.data.length);
        setRecipes(json.data);
      } else {
        console.error("API Error:", json);
        setError("Failed to fetch recipes: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipe = ({ item }) => (
    <StyledView className="bg-white mx-4 my-2 p-4 rounded-xl shadow-lg">
      <StyledText className="text-xl font-bold text-gray-800 mb-2">
        {item.name}
      </StyledText>
      <StyledText className="text-gray-600 text-base mb-3">
        {item.description}
      </StyledText>
      <StyledView className="flex-row items-center">
        <StyledText className="text-sm font-medium text-gray-700">
          Difficulty:
        </StyledText>
        <StyledText
          className={`ml-1 text-sm font-bold ${
            item.difficulty === "Easy"
              ? "text-green-600"
              : item.difficulty === "Medium"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {item.difficulty}
        </StyledText>
      </StyledView>
    </StyledView>
  );

  if (loading) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" className="text-blue-500" />
      </StyledView>
    );
  }

  if (error) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-gray-50 p-4">
        <StyledText className="text-red-500 text-lg text-center">
          {error}
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-gray-50 pt-12">
      <StyledView className="border-b border-gray-200 pb-2 mb-2">
        <StyledText className="text-2xl font-bold text-center text-gray-800">
          Recipes
        </StyledText>
      </StyledView>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item._id}
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      />
    </StyledView>
  );
};

export default App;
