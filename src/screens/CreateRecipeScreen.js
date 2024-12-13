import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Animated,
  Platform,
} from "react-native";
import ProgressBar from "@react-native-community/progress-bar-android";
import ProgressView from "@react-native-community/progress-view";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { createRecipe } from "../store/slices/recipeSlice";
import { fadeIn } from "../utils/animations";

const Progress = Platform.select({
  ios: ProgressView,
  android: ProgressBar,
});

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

  const fadeAnims = useRef(
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  const [createProgress, setCreateProgress] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Stagger animation for form fields
    Animated.stagger(
      100,
      fadeAnims.map((anim) =>
        Animated.sequence([
          fadeIn(anim),
          Animated.spring(anim, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

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
        setIsCreating(true);
        setCreateProgress(0);
        const startTime = Date.now();

        const interval = setInterval(() => {
          setCreateProgress((prev) => {
            const elapsedTime = Date.now() - startTime;
            const targetProgress = Math.min(elapsedTime / 2000, 0.95);
            return targetProgress;
          });
        }, 16);

        const cleanedData = {
          ...formData,
          ingredients: formData.ingredients.filter((item) => item.trim()),
          steps: formData.steps.filter((item) => item.trim()),
        };

        await dispatch(createRecipe(cleanedData)).unwrap();
        setCreateProgress(1);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (showAlerts) {
          Alert.alert("Success", "Recipe created successfully!");
        }
        navigation.goBack();
      } catch (err) {
        console.error("Create Recipe Error:", err);
        if (showAlerts) {
          Alert.alert("Error", "Failed to create recipe. Please try again.");
        }
      } finally {
        setIsCreating(false);
        setCreateProgress(0);
      }
    }
  };

  return (
    <StyledSafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {isCreating && (
        <StyledView
          className="absolute top-0 left-0 right-0 z-50"
          style={{ elevation: 1 }}
        >
          <StyledView className="flex-row justify-between px-4 py-1">
            <StyledText
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Creating Recipe
            </StyledText>
            <StyledText
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {Math.round(createProgress * 100)}%
            </StyledText>
          </StyledView>
          <Progress
            progress={createProgress}
            width={null}
            color="#3B82F6"
            style={{ height: 3 }}
            {...(Platform.OS === "ios" ? { progressTintColor: "#3B82F6" } : {})}
          />
        </StyledView>
      )}

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

        <Animated.View style={{ opacity: fadeAnims[0] }}>
          <StyledInput
            className={`px-4 py-2 rounded-lg border border-gray-300 mb-4 font-josefin ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
            placeholder="Recipe Name"
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnims[1] }}>
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
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnims[2] }}>
          <StyledView className="mb-4">
            <StyledText
              className={`mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Difficulty
            </StyledText>
            <StyledView className="flex-row justify-around">
              {["Easy", "Medium", "Hard"].map((level) => (
                <StyledTouchable
                  key={level}
                  onPress={() =>
                    setFormData({ ...formData, difficulty: level })
                  }
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
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnims[3] }}>
          <StyledView className="mb-4">
            <StyledText
              className={`mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
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
                  onChangeText={(text) =>
                    updateField("ingredients", index, text)
                  }
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
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnims[4] }}>
          <StyledView className="mb-4">
            <StyledText
              className={`mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
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
        </Animated.View>

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
