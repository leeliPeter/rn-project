import React, { useState } from "react";
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
import { createRecipe } from "../store/slices/recipeSlice";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const CreateRecipeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const showAlerts = useSelector((state) => state.theme.showAlerts);

  const [formData, setFormData] = useState({
    _id: `recipe${Date.now()}`,
    name: "",
    description: "",
    difficulty: "Easy",
    ingredients: [""],
    steps: [""],
  });

  const [formError, setFormError] = useState(null);

  const addField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const updateField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const validateForm = () => {
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Recipe name is required");
      return false;
    }

    if (!formData.description.trim()) {
      setFormError("Recipe description is required");
      return false;
    }

    const validIngredients = formData.ingredients.filter((i) => i.trim());
    if (validIngredients.length === 0) {
      setFormError("At least one ingredient is required");
      return false;
    }

    const validSteps = formData.steps.filter((s) => s.trim());
    if (validSteps.length === 0) {
      setFormError("At least one step is required");
      return false;
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(formData.difficulty)) {
      setFormError("Invalid difficulty level");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const cleanedData = {
          ...formData,
          ingredients: formData.ingredients.filter((item) => item.trim()),
          steps: formData.steps.filter((item) => item.trim()),
        };
        await dispatch(createRecipe(cleanedData)).unwrap();
        if (showAlerts) {
          Alert.alert("Success", "Recipe created successfully!");
        }
        navigation.goBack();
      } catch (err) {
        console.error("Create Recipe Error:", err);
        if (showAlerts) {
          Alert.alert("Error", "Failed to create recipe. Please try again.");
        }
      }
    }
  };

  return (
    <StyledSafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <StyledText
          className={`text-2xl font-josefin-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Create Recipe
        </StyledText>
        <StyledTouchable onPress={() => navigation.goBack()}>
          <Ionicons
            name="close"
            size={24}
            color={isDarkMode ? "#9CA3AF" : "#4B5563"}
          />
        </StyledTouchable>
      </StyledView>

      <StyledScrollView className="flex-1 px-4">
        {formError && (
          <StyledView className="bg-red-100 p-4 rounded-lg mb-4">
            <StyledText className="text-red-600 font-josefin-medium">
              {formError}
            </StyledText>
          </StyledView>
        )}

        <StyledInput
          className={`px-4 py-2 rounded-lg border border-gray-300 mb-4 font-josefin ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
          }`}
          placeholder="Recipe Name"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <StyledInput
          className={`px-4 py-2 rounded-lg border border-gray-300 mb-4 font-josefin ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
          }`}
          placeholder="Description"
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
        />

        <StyledView className="mb-4">
          <StyledText
            className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Difficulty
          </StyledText>
          <StyledView className="flex-row justify-around">
            {["Easy", "Medium", "Hard"].map((level) => (
              <StyledTouchable
                key={level}
                onPress={() => setFormData({ ...formData, difficulty: level })}
                className={`px-4 py-2 rounded-lg ${
                  formData.difficulty === level
                    ? "bg-blue-500"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}
              >
                <StyledText
                  className={`font-josefin-medium ${
                    formData.difficulty === level
                      ? "text-white"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {level}
                </StyledText>
              </StyledTouchable>
            ))}
          </StyledView>
        </StyledView>

        <StyledView className="mb-4">
          <StyledText
            className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Ingredients
          </StyledText>
          {formData.ingredients.map((ingredient, index) => (
            <StyledView key={index} className="flex-row items-center mb-2">
              <StyledInput
                className={`flex-1 px-4 py-2 rounded-lg border border-gray-300 font-josefin ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700"
                }`}
                placeholder={`Ingredient ${index + 1}`}
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={ingredient}
                onChangeText={(text) => updateField("ingredients", index, text)}
              />
              {index > 0 && (
                <StyledTouchable
                  onPress={() => {
                    const newIngredients = formData.ingredients.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className="ml-2 p-2"
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </StyledTouchable>
              )}
            </StyledView>
          ))}
          <StyledTouchable
            onPress={() => addField("ingredients")}
            className={`py-2 rounded-lg items-center mt-2 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <StyledText
              className={isDarkMode ? "text-gray-300" : "text-gray-700"}
            >
              Add Ingredient
            </StyledText>
          </StyledTouchable>
        </StyledView>

        <StyledView className="mb-4">
          <StyledText
            className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Steps
          </StyledText>
          {formData.steps.map((step, index) => (
            <StyledView key={index} className="flex-row items-center mb-2">
              <StyledInput
                className={`flex-1 px-4 py-2 rounded-lg border border-gray-300 font-josefin ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700"
                }`}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={step}
                onChangeText={(text) => updateField("steps", index, text)}
                multiline
              />
              {index > 0 && (
                <StyledTouchable
                  onPress={() => {
                    const newSteps = formData.steps.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, steps: newSteps });
                  }}
                  className="ml-2 p-2"
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </StyledTouchable>
              )}
            </StyledView>
          ))}
          <StyledTouchable
            onPress={() => addField("steps")}
            className={`py-2 rounded-lg items-center mt-2 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <StyledText
              className={isDarkMode ? "text-gray-300" : "text-gray-700"}
            >
              Add Step
            </StyledText>
          </StyledTouchable>
        </StyledView>

        <StyledTouchable
          onPress={handleSubmit}
          className="bg-blue-500 py-3 rounded-lg items-center mb-8"
        >
          <StyledText className="text-white font-bold text-lg">
            Create Recipe
          </StyledText>
        </StyledTouchable>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default CreateRecipeScreen;
