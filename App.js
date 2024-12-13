import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./src/store";
import {
  fetchRecipes,
  searchRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  setSelectedRecipe,
  setSearchQuery,
} from "./src/store/slices/recipeSlice";

const StyledView = styled(View);
const StyledText = styled(Text, {
  props: {
    className: "font-josefin",
  },
});
const StyledInput = styled(TextInput, {
  props: {
    className: "font-josefin",
  },
});
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImageBackground = styled(ImageBackground);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

const RecipeFormModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    _id: initialData?._id || `recipe${Date.now()}`,
    name: initialData?.name || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "Easy",
    ingredients: initialData?.ingredients || [""],
    steps: initialData?.steps || [""],
  });

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id,
        name: initialData.name,
        description: initialData.description,
        difficulty: initialData.difficulty,
        ingredients: initialData.ingredients,
        steps: initialData.steps,
      });
    }
    // Clear error when modal opens/closes
    setFormError(null);
  }, [initialData, visible]);

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
    // Reset error
    setFormError(null);

    // Check required fields based on schema
    if (!formData.name.trim()) {
      setFormError("Recipe name is required");
      return false;
    }

    if (!formData.description.trim()) {
      setFormError("Recipe description is required");
      return false;
    }

    // Check if there's at least one non-empty ingredient
    const validIngredients = formData.ingredients.filter((i) => i.trim());
    if (validIngredients.length === 0) {
      setFormError("At least one ingredient is required");
      return false;
    }

    // Check if there's at least one non-empty step
    const validSteps = formData.steps.filter((s) => s.trim());
    if (validSteps.length === 0) {
      setFormError("At least one step is required");
      return false;
    }

    // Check if difficulty is valid
    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(formData.difficulty)) {
      setFormError("Invalid difficulty level");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Filter out empty ingredients and steps
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter((item) => item.trim()),
        steps: formData.steps.filter((item) => item.trim()),
      };
      onSubmit(cleanedData);
      setFormData({
        _id: `recipe${Date.now()}`,
        name: "",
        description: "",
        difficulty: "Easy",
        ingredients: [""],
        steps: [""],
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <StyledSafeAreaView className="flex-1 bg-gray-50">
        <StyledScrollView className="flex-1 px-4">
          <StyledView className="flex-row justify-between items-center mb-6">
            <StyledText className="text-2xl font-josefin-bold text-gray-800">
              {initialData ? "Edit Recipe" : "Create Recipe"}
            </StyledText>
            <StyledTouchable onPress={onClose}>
              <StyledText className="text-blue-500 text-lg font-josefin-medium">
                Cancel
              </StyledText>
            </StyledTouchable>
          </StyledView>

          {/* Display form error if any */}
          {formError && (
            <StyledView className="bg-red-100 p-4 rounded-lg mb-4">
              <StyledText className="text-red-600 font-josefin-medium">
                {formError}
              </StyledText>
            </StyledView>
          )}

          <StyledInput
            className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 mb-4 font-josefin"
            placeholder="Recipe Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <StyledInput
            className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 mb-4 font-josefin"
            placeholder="Description"
            multiline
            numberOfLines={3}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />

          <StyledView className="mb-4">
            <StyledText className="text-gray-700 mb-2">Difficulty</StyledText>
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
                      : "bg-gray-200"
                  }`}
                >
                  <StyledText
                    className={`font-josefin-medium ${
                      formData.difficulty === level
                        ? "text-white"
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
            <StyledText className="text-gray-700 mb-2">Ingredients</StyledText>
            {formData.ingredients.map((ingredient, index) => (
              <StyledView key={index} className="flex-row items-center mb-2">
                <StyledInput
                  className="flex-1 bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-josefin"
                  placeholder={`Ingredient ${index + 1}`}
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
                    <FontAwesome name="trash" size={20} color="red" />
                  </StyledTouchable>
                )}
              </StyledView>
            ))}
            <StyledTouchable
              onPress={() => addField("ingredients")}
              className="bg-gray-200 py-2 rounded-lg items-center mt-2"
            >
              <StyledText className="text-gray-700">Add Ingredient</StyledText>
            </StyledTouchable>
          </StyledView>

          <StyledView className="mb-4">
            <StyledText className="text-gray-700 mb-2">Steps</StyledText>
            {formData.steps.map((step, index) => (
              <StyledView key={index} className="flex-row items-center mb-2">
                <StyledInput
                  className="flex-1 bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-josefin"
                  placeholder={`Step ${index + 1}`}
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
                    <FontAwesome name="trash" size={20} color="red" />
                  </StyledTouchable>
                )}
              </StyledView>
            ))}
            <StyledTouchable
              onPress={() => addField("steps")}
              className="bg-gray-200 py-2 rounded-lg items-center mt-2"
            >
              <StyledText className="text-gray-700">Add Step</StyledText>
            </StyledTouchable>
          </StyledView>

          <StyledTouchable
            onPress={handleSubmit}
            className="bg-blue-500 py-3 rounded-lg items-center mb-8"
          >
            <StyledText className="text-white font-bold text-lg">
              {initialData ? "Update Recipe" : "Create Recipe"}
            </StyledText>
          </StyledTouchable>
        </StyledScrollView>
      </StyledSafeAreaView>
    </Modal>
  );
};

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  recipeName,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <StyledView className="flex-1 bg-black/50">
      <StyledView className="flex-1 justify-center items-center">
        <StyledView className="bg-white rounded-xl p-6 mx-4 w-[90%] max-w-sm">
          <StyledText className="text-xl font-bold text-gray-800 mb-4">
            Delete Recipe
          </StyledText>
          <StyledText className="text-gray-600 mb-6">
            Are you sure you want to delete "{recipeName}"? This action cannot
            be undone.
          </StyledText>
          <StyledView className="flex-row justify-end space-x-4">
            <StyledTouchable
              onPress={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              <StyledText className="text-gray-700 font-medium">
                Cancel
              </StyledText>
            </StyledTouchable>
            <StyledTouchable
              onPress={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-500"
            >
              <StyledText className="text-white font-medium">Delete</StyledText>
            </StyledTouchable>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  </Modal>
);

const RecipeDetailModal = ({ visible, onClose, recipe, loading, onEdit }) => {
  const [modalError, setModalError] = useState(null);

  if (!recipe) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <StyledSafeAreaView className="flex-1 font-josefin bg-gray-50">
        <StyledScrollView className="flex-1 px-4">
          {loading ? (
            <ActivityIndicator size="large" color="#4B5563" />
          ) : (
            <>
              <StyledView className="flex-row justify-between items-center mb-6">
                <StyledText className="text-2xl font-josefin-bold text-gray-800">
                  Recipe Details
                </StyledText>
                <StyledView className="flex-row items-center">
                  <StyledTouchable
                    onPress={() => onEdit(recipe)}
                    className="mr-4"
                  >
                    <FontAwesome name="edit" size={24} color="#3B82F6" />
                  </StyledTouchable>
                  <StyledTouchable onPress={onClose}>
                    <StyledText className="text-blue-500 text-lg font-josefin-medium">
                      Close
                    </StyledText>
                  </StyledTouchable>
                </StyledView>
              </StyledView>

              {modalError && (
                <StyledView className="bg-red-100 p-4 rounded-lg mb-4">
                  <StyledText className="text-red-600 font-josefin-medium">
                    {modalError}
                  </StyledText>
                </StyledView>
              )}

              <StyledView className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <StyledText className="text-2xl font-josefin-bold text-gray-800 mb-2">
                  {recipe.name}
                </StyledText>
                <StyledText className="font-josefin text-gray-600 text-base mb-4">
                  {recipe.description}
                </StyledText>
                <StyledView className="flex-row items-center mb-4">
                  <StyledText className="text-sm font-josefin-medium text-gray-700">
                    Difficulty:{" "}
                  </StyledText>
                  <StyledText
                    className={`text-sm font-josefin-bold ${
                      recipe.difficulty === "Easy"
                        ? "text-green-600"
                        : recipe.difficulty === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {recipe.difficulty}
                  </StyledText>
                </StyledView>
              </StyledView>

              <StyledView className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <StyledText className="text-xl font-josefin-bold text-gray-800 mb-3">
                  Ingredients
                </StyledText>
                {recipe.ingredients.map((ingredient, index) => (
                  <StyledView
                    key={index}
                    className="flex-row items-center mb-2 pl-4"
                  >
                    <StyledText className="font-josefin text-gray-600 text-base">
                      • {ingredient}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>

              <StyledView className="bg-white rounded-xl p-4 mb-8 shadow-sm">
                <StyledText className="text-xl font-josefin-bold text-gray-800 mb-3">
                  Steps
                </StyledText>
                {recipe.steps.map((step, index) => (
                  <StyledView key={index} className="mb-4">
                    <StyledText className="text-gray-800 font-josefin-bold mb-1">
                      Step {index + 1}
                    </StyledText>
                    <StyledText className="font-josefin text-gray-600 text-base pl-4">
                      {step}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>
            </>
          )}
        </StyledScrollView>
      </StyledSafeAreaView>
    </Modal>
  );
};

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const App = () => {
  const dispatch = useDispatch();
  const {
    items: recipes,
    loading,
    error,
    searchQuery,
    selectedRecipe,
  } = useSelector((state) => state.recipes);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_500Medium,
    JosefinSans_600SemiBold,
    JosefinSans_700Bold,
  });

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const baseUrl = Platform.select({
    android: "http://10.0.2.2:8000",
    ios: "http://localhost:8000",
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      dispatch(fetchRecipes());
      return;
    }
    dispatch(searchRecipes(searchQuery));
  };

  const handleCreateRecipe = async (recipeData) => {
    try {
      await dispatch(createRecipe(recipeData)).unwrap();
      setIsCreateModalVisible(false);
      Alert.alert("Success", "Recipe created successfully!", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } catch (err) {
      console.error("Create Recipe Error:", err);
      Alert.alert("Error", "Failed to create recipe. Please try again.");
    }
  };

  const handleUpdateRecipe = async (recipeData) => {
    try {
      await dispatch(updateRecipe(recipeData)).unwrap();
      setIsEditModalVisible(false);
      setRecipeToEdit(null);
    } catch (err) {
      console.error("Update Recipe Error:", err);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await dispatch(deleteRecipe(recipeId)).unwrap();
      setDeleteModalVisible(false);
      setRecipeToDelete(null);
      Alert.alert("Success", "Recipe deleted successfully!", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } catch (err) {
      console.error("Delete Recipe Error:", err);
      Alert.alert("Error", "Failed to delete recipe. Please try again.");
    }
  };

  const handleRecipeSelect = (recipe) => {
    dispatch(setSelectedRecipe(recipe));
    setIsDetailModalVisible(true);
  };

  const renderHeader = () => (
    <StyledView className="border-b border-gray-200 pb-0">
      <StyledView className="flex-row justify-between items-center px-4 mb-4">
        <StyledTouchable
          onPress={() => {
            dispatch(setSearchQuery("")); // Clear search query
            dispatch(fetchRecipes()); // Reset to show all recipes
          }}
        >
          <StyledImage
            source={require("./assets/logo.png")}
            className="w-28 h-12"
            resizeMode="contain"
          />
        </StyledTouchable>
        <StyledTouchable
          onPress={() => setIsCreateModalVisible(true)}
          className="bg-black px-2 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="add" size={16} color="white" />
          <StyledText className="text-white font-josefin-medium ml-2">
            add recipe
          </StyledText>
        </StyledTouchable>
      </StyledView>
      <StyledView className="flex-row px-4 mb-2">
        <StyledInput
          className="flex-1 bg-white px-4 py-2 rounded-l-lg border border-gray-300 text-gray-700"
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <StyledTouchable
          className="bg-blue-500 px-4 rounded-r-lg justify-center"
          onPress={handleSearch}
        >
          <StyledText className="text-white font-josefin-medium">
            {loading ? "..." : "Search"}
          </StyledText>
        </StyledTouchable>
      </StyledView>
    </StyledView>
  );

  const renderRecipe = ({ item }) => (
    <StyledTouchable
      onPress={() => handleRecipeSelect(item)}
      className="bg-white mx-4 my-2 p-4 rounded-xl shadow-lg"
    >
      <StyledView className="flex-row justify-between items-start">
        <StyledView className="flex-1">
          <StyledText className="text-xl font-josefin-bold text-gray-800 mb-2">
            {item.name}
          </StyledText>
          <StyledText className="font-josefin text-gray-600 text-base mb-3">
            {item.description}
          </StyledText>
          <StyledView className="flex-row items-center">
            <StyledText className="text-sm font-medium text-gray-700">
              Difficulty:
            </StyledText>
            <StyledView
              className={`ml-1 rounded-full ${
                item.difficulty === "Easy"
                  ? "bg-green-600"
                  : item.difficulty === "Medium"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              <StyledText className="text-sm font-bold text-white py-1 px-3">
                {item.difficulty}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledTouchable
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent's onPress
            setRecipeToDelete(item);
            setDeleteModalVisible(true);
          }}
          className="p-2"
        >
          <FontAwesome name="trash" size={24} color="gray" />
        </StyledTouchable>
      </StyledView>
    </StyledTouchable>
  );

  if (!fontsLoaded) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4B5563" />
      </StyledView>
    );
  }

  if (loading) {
    return (
      <StyledImageBackground
        source={require("./assets/background.jpg")}
        className="flex-1"
      >
        <StyledView className="flex-1 bg-gray-50/90 pt-12">
          <StyledView className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" className="text-blue-500" />
          </StyledView>
        </StyledView>
      </StyledImageBackground>
    );
  }

  if (error) {
    return (
      <StyledImageBackground
        source={require("./assets/background.jpg")}
        className="flex-1"
      >
        <StyledView className="flex-1 bg-gray-50/90 pt-12">
          <StyledView className="flex-1 justify-center items-center p-4">
            <StyledText className="text-red-500 text-lg text-center">
              {error}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledImageBackground>
    );
  }

  return (
    <StyledImageBackground
      source={require("./assets/background.jpg")}
      className="flex-1"
    >
      <StyledView className="flex-1 bg-gray-50/70 pt-12">
        {renderHeader()}
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item._id}
          className="flex-1"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <StyledView className="flex-1 justify-center items-center p-4">
              <StyledText className="text-gray-500 text-lg text-center">
                {loading ? "Loading..." : "No recipes found"}
              </StyledText>
            </StyledView>
          )}
        />
        <RecipeFormModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSubmit={handleCreateRecipe}
        />
        <RecipeFormModal
          visible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setRecipeToEdit(null);
          }}
          onSubmit={handleUpdateRecipe}
          initialData={recipeToEdit}
        />
        <DeleteConfirmationModal
          visible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setRecipeToDelete(null);
          }}
          onConfirm={() => handleDeleteRecipe(recipeToDelete?._id)}
          recipeName={recipeToDelete?.name}
        />
        <RecipeDetailModal
          visible={isDetailModalVisible}
          onClose={() => {
            setIsDetailModalVisible(false);
            dispatch(setSelectedRecipe(null));
          }}
          recipe={selectedRecipe}
          loading={detailLoading}
          onEdit={(recipe) => {
            setRecipeToEdit(recipe);
            setIsEditModalVisible(true);
            setIsDetailModalVisible(false);
          }}
        />
      </StyledView>
    </StyledImageBackground>
  );
};

export default AppWrapper;
