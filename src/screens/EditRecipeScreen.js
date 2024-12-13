import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Animated,
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
  const [progress] = useState(new Animated.Value(0));
  const [showProgress, setShowProgress] = useState(false);

  const animateProgress = () => {
    setShowProgress(true);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setShowProgress(false);
    });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const cleanedData = {
          ...formData,
          ingredients: formData.ingredients.filter((item) => item.trim()),
          steps: formData.steps.filter((item) => item.trim()),
        };

        // Show progress bar first
        setShowProgress(true);
        progress.setValue(0);

        // Start progress animation
        Animated.timing(progress, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start(async () => {
          // After animation completes, update the recipe
          await dispatch(updateRecipe(cleanedData)).unwrap();

          // Show success message and navigate back
          if (showAlerts) {
            Alert.alert("Success", "Recipe updated successfully!");
          }
          setShowProgress(false);
          navigation.goBack();
        });
      } catch (err) {
        setShowProgress(false);
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
      {showProgress && (
        <StyledView className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <StyledView className="bg-white p-4 rounded-lg w-3/4">
            <StyledText className="text-center mb-2 text-gray-700 font-medium">
              Updating Recipe... {Math.round(progress.__getValue() * 100)}%
            </StyledText>
            <StyledView className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <Animated.View
                style={{
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  height: 8,
                  backgroundColor: "#3B82F6",
                }}
              />
            </StyledView>
          </StyledView>
        </StyledView>
      )}

      {/* Rest of your form content */}
      <StyledTouchable
        onPress={handleSubmit}
        className="bg-blue-500 py-3 rounded-lg items-center mb-8 mx-4"
      >
        <StyledText className="text-white font-bold text-lg">
          Update Recipe
        </StyledText>
      </StyledTouchable>
    </StyledSafeAreaView>
  );
};

export default EditRecipeScreen;
