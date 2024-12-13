import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { fadeIn, slideIn, scaleUp } from "../utils/animations";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const RecipeDetailScreen = ({ navigation, route }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const recipe = route.params?.recipe;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Composed animation: sequence of fade and slide
    Animated.sequence([
      fadeIn(fadeAnim),
      Animated.parallel([slideIn(slideAnim), scaleUp(scaleAnim)]),
    ]).start();
  }, []);

  if (!recipe) {
    navigation.goBack();
    return null;
  }

  return (
    <StyledSafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }}
      >
        <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <StyledText
            className={`text-2xl font-josefin-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Recipe Details
          </StyledText>
          <StyledView className="flex-row items-center">
            <StyledTouchable
              onPress={() => navigation.navigate("EditRecipe", { recipe })}
              className="mr-4"
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "#4B5563"}
              />
            </StyledTouchable>
            <StyledTouchable onPress={() => navigation.goBack()}>
              <Ionicons
                name="close"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "#4B5563"}
              />
            </StyledTouchable>
          </StyledView>
        </StyledView>

        <StyledScrollView className="flex-1 px-4">
          <StyledView
            className={`p-4 rounded-xl mb-4 mt-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <StyledText
              className={`text-2xl font-josefin-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {recipe.name}
            </StyledText>
            <StyledText
              className={`text-base mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {recipe.description}
            </StyledText>
            <StyledView className="flex-row items-center">
              <StyledText
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Difficulty:{" "}
              </StyledText>
              <StyledView
                className={`rounded-full px-3 py-1 ${
                  recipe.difficulty === "Easy"
                    ? "bg-green-600"
                    : recipe.difficulty === "Medium"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                <StyledText className="text-white font-bold">
                  {recipe.difficulty}
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>

          <StyledView
            className={`p-4 rounded-xl mb-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <StyledText
              className={`text-xl font-josefin-bold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Ingredients
            </StyledText>
            {recipe.ingredients.map((ingredient, index) => (
              <StyledView
                key={index}
                className="flex-row items-center mb-2 pl-4"
              >
                <StyledText
                  className={`text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  • {ingredient}
                </StyledText>
              </StyledView>
            ))}
          </StyledView>

          <StyledView
            className={`p-4 rounded-xl mb-8 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <StyledText
              className={`text-xl font-josefin-bold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Steps
            </StyledText>
            {recipe.steps.map((step, index) => (
              <StyledView key={index} className="mb-4">
                <StyledText
                  className={`font-josefin-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Step {index + 1}
                </StyledText>
                <StyledText
                  className={`text-base pl-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {step}
                </StyledText>
              </StyledView>
            ))}
          </StyledView>
        </StyledScrollView>
      </Animated.View>
    </StyledSafeAreaView>
  );
};

export default RecipeDetailScreen;
