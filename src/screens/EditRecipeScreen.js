import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateRecipe } from "../store/slices/recipeSlice";
import ProgressBar from "@react-native-community/progress-bar-android";
import ProgressView from "@react-native-community/progress-view";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const Progress = Platform.select({
  ios: ProgressView,
  android: ProgressBar,
});

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
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsUpdating(true);
        setUpdateProgress(0);
        const startTime = Date.now();

        const interval = setInterval(() => {
          setUpdateProgress((prev) => {
            if (prev >= 0.95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 0.05;
          });
        }, 100);

        const cleanedData = {
          ...formData,
          ingredients: formData.ingredients.filter((item) => item.trim()),
          steps: formData.steps.filter((item) => item.trim()),
        };

        await dispatch(updateRecipe(cleanedData)).unwrap();

        // Ensure at least 2 seconds have passed
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 2000) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 - elapsedTime)
          );
        }

        setUpdateProgress(1);

        // Show "Update Recipe" progress for 2 more seconds after completion
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (showAlerts) {
          Alert.alert("Success", "Recipe updated successfully!");
        }

        setIsUpdating(false);
        setUpdateProgress(0);
        navigation.goBack();
      } catch (err) {
        setIsUpdating(false);
        setUpdateProgress(0);
        console.error("Update Recipe Error:", err);
        if (showAlerts) {
          Alert.alert("Error", "Failed to update recipe. Please try again.");
        }
      }
    }
  };

  return (
    <StyledSafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {isUpdating && (
        <StyledView className="absolute top-0 left-0 right-0 z-50">
          <StyledView className="flex-row justify-between px-4 py-1">
            <StyledText
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Update Recipe
            </StyledText>
            <StyledText
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {Math.round(updateProgress * 100)}%
            </StyledText>
          </StyledView>
          <Progress
            progress={updateProgress}
            width={null}
            color="#3B82F6"
            style={{ height: 3 }}
            {...(Platform.OS === "ios" ? { progressTintColor: "#3B82F6" } : {})}
          />
        </StyledView>
      )}

      {/* ... rest of your component ... */}
    </StyledSafeAreaView>
  );
};

export default EditRecipeScreen;
