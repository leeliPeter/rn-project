import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateRecipe } from "../store/slices/recipeSlice";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const EditRecipeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const showAlerts = useSelector((state) => state.theme.showAlerts);
  const recipe = route.params?.recipe;

  const [formData, setFormData] = useState({
    _id: recipe?._id || "",
    name: recipe?.name || "",
    description: recipe?.description || "",
    difficulty: recipe?.difficulty || "Easy",
    ingredients: recipe?.ingredients || [""],
    steps: recipe?.steps || [""],
  });

  const [formError, setFormError] = useState(null);

  // Rest of the component is identical to CreateRecipeScreen
  // Just change the submit button text to "Update Recipe"
  // and the header title to "Edit Recipe"

  // ... (copy all the functions and JSX from CreateRecipeScreen)
  // Change handleSubmit to use updateRecipe instead of createRecipe

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const cleanedData = {
          ...formData,
          ingredients: formData.ingredients.filter((item) => item.trim()),
          steps: formData.steps.filter((item) => item.trim()),
        };
        await dispatch(updateRecipe(cleanedData)).unwrap();
        if (showAlerts) {
          Alert.alert("Success", "Recipe updated successfully!");
        }
        navigation.goBack();
      } catch (err) {
        console.error("Update Recipe Error:", err);
        if (showAlerts) {
          Alert.alert("Error", "Failed to update recipe. Please try again.");
        }
      }
    }
  };

  // ... (rest of the code from CreateRecipeScreen)
};

export default EditRecipeScreen;
