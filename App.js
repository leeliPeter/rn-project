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
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
// Create styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

// Add this new component for the create recipe form
const RecipeFormModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    _id: initialData?._id || `recipe${Date.now()}`,
    name: initialData?.name || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "Easy",
    ingredients: initialData?.ingredients || [""],
    steps: initialData?.steps || [""],
  });

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
  }, [initialData]);

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
    if (!formData.name.trim()) {
      setError("Recipe name is required");
      return false;
    }
    if (!formData.ingredients.some((i) => i.trim())) {
      setError("At least one ingredient is required");
      return false;
    }
    if (!formData.steps.some((s) => s.trim())) {
      setError("At least one step is required");
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
            <StyledText className="text-2xl font-bold text-gray-800">
              {initialData ? "Edit Recipe" : "Create Recipe"}
            </StyledText>
            <StyledTouchable onPress={onClose}>
              <StyledText className="text-blue-500 text-lg">Cancel</StyledText>
            </StyledTouchable>
          </StyledView>

          <StyledInput
            className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 mb-4"
            placeholder="Recipe Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <StyledInput
            className="bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700 mb-4"
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
                    className={
                      formData.difficulty === level
                        ? "text-white"
                        : "text-gray-700"
                    }
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
                  className="flex-1 bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
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
                  className="flex-1 bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
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

// Add a confirmation dialog component
const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  recipeName,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <StyledSafeAreaView className="flex-1 bg-black/50">
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
    </StyledSafeAreaView>
  </Modal>
);

// Add this new component for recipe details
const RecipeDetailModal = ({ visible, onClose, recipe, loading, onEdit }) => {
  const [modalError, setModalError] = useState(null);

  if (!recipe) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <StyledSafeAreaView className="flex-1 bg-gray-50">
        <StyledScrollView className="flex-1 px-4">
          {loading ? (
            <ActivityIndicator size="large" color="#4B5563" />
          ) : (
            <>
              <StyledView className="flex-row justify-between items-center mb-6">
                <StyledText className="text-2xl font-bold text-gray-800">
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
                    <StyledText className="text-blue-500 text-lg">
                      Close
                    </StyledText>
                  </StyledTouchable>
                </StyledView>
              </StyledView>

              {modalError && (
                <StyledView className="bg-red-100 p-4 rounded-lg mb-4">
                  <StyledText className="text-red-600">{modalError}</StyledText>
                </StyledView>
              )}

              <StyledView className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <StyledText className="text-2xl font-bold text-gray-800 mb-2">
                  {recipe.name}
                </StyledText>
                <StyledText className="text-gray-600 text-base mb-4">
                  {recipe.description}
                </StyledText>
                <StyledView className="flex-row items-center mb-4">
                  <StyledText className="text-sm font-medium text-gray-700">
                    Difficulty:{" "}
                  </StyledText>
                  <StyledText
                    className={`text-sm font-bold ${
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
                <StyledText className="text-xl font-bold text-gray-800 mb-3">
                  Ingredients
                </StyledText>
                {recipe.ingredients.map((ingredient, index) => (
                  <StyledView
                    key={index}
                    className="flex-row items-center mb-2 pl-4"
                  >
                    <StyledText className="text-gray-600 text-base">
                      • {ingredient}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>

              <StyledView className="bg-white rounded-xl p-4 mb-8 shadow-sm">
                <StyledText className="text-xl font-bold text-gray-800 mb-3">
                  Steps
                </StyledText>
                {recipe.steps.map((step, index) => (
                  <StyledView key={index} className="mb-4">
                    <StyledText className="text-gray-800 font-bold mb-1">
                      Step {index + 1}
                    </StyledText>
                    <StyledText className="text-gray-600 text-base pl-4">
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

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const baseUrl = Platform.select({
    android: "http://10.0.2.2:8000",
    ios: "http://localhost:8000",
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRecipes();
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/api/recipes/search/${searchQuery}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setRecipes(json.data);
      } else {
        setError("Search failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("Search error: " + err.message);
    } finally {
      setSearching(false);
    }
  };

  // Add the search bar UI below the header
  const renderHeader = () => (
    <StyledView className="border-b border-gray-200 pb-2">
      <StyledView className="flex-row justify-between items-center px-4 mb-4">
        <StyledText className="text-2xl font-bold text-gray-800">
          Recipes
        </StyledText>
        <StyledTouchable
          onPress={() => setIsCreateModalVisible(true)}
          className="bg-black px-2 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="add" size={16} color="white" />
          <StyledText className="text-white font-medium ml-2">
            add recipe
          </StyledText>
        </StyledTouchable>
      </StyledView>
      <StyledView className="flex-row px-4 mb-2">
        <StyledInput
          className="flex-1 bg-white px-4 py-2 rounded-l-lg border border-gray-300 text-gray-700"
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <StyledTouchable
          className="bg-blue-500 px-4 rounded-r-lg justify-center"
          onPress={handleSearch}
        >
          <StyledText className="text-white font-medium">
            {searching ? "..." : "Search"}
          </StyledText>
        </StyledTouchable>
      </StyledView>
    </StyledView>
  );

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

  const handleCreateRecipe = async (recipeData) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const json = await response.json();
      if (json.success) {
        fetchRecipes(); // Refresh the recipe list
        setIsCreateModalVisible(false);
      } else {
        setError("Failed to create recipe: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Create Recipe Error:", err);
      setError("Failed to create recipe: " + err.message);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      if (json.success) {
        fetchRecipes(); // Refresh the list
      } else {
        setError("Failed to delete recipe: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete Recipe Error:", err);
      setError("Failed to delete recipe: " + err.message);
    } finally {
      setDeleteModalVisible(false);
      setRecipeToDelete(null);
    }
  };

  const handleUpdateRecipe = async (recipeData) => {
    try {
      // Log the request details for debugging
      console.log("Updating recipe with ID:", recipeData._id);
      console.log("Update data:", recipeData);

      const response = await fetch(`${baseUrl}/api/recipes/${recipeData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Add Accept header
        },
        body: JSON.stringify({
          name: recipeData.name,
          description: recipeData.description,
          difficulty: recipeData.difficulty,
          ingredients: recipeData.ingredients,
          steps: recipeData.steps,
        }), // Don't send _id in the body
      });

      // Log the response for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let json;
      try {
        json = JSON.parse(responseText);
      } catch (err) {
        console.error("Failed to parse response:", err);
        throw new Error("Invalid response format");
      }

      if (json.success) {
        await fetchRecipes(); // Refresh the recipe list
        setIsEditModalVisible(false);
        setRecipeToEdit(null);
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch (err) {
      console.error("Update Recipe Error:", err);
      setError("Failed to update recipe: " + err.message);
    }
  };

  // Add function to fetch single recipe
  const fetchRecipeDetails = async (recipeId) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setSelectedRecipe(json.data);
        setIsDetailModalVisible(true);
      } else {
        setError(
          "Failed to fetch recipe details: " + (json.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Fetch Recipe Details Error:", err);
      setError("Failed to fetch recipe details: " + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Update the renderRecipe function to remove the edit button and duplicate trash button
  const renderRecipe = ({ item }) => (
    <StyledTouchable
      onPress={() => fetchRecipeDetails(item._id)}
      className="bg-white mx-4 my-2 p-4 rounded-xl shadow-lg"
    >
      <StyledView className="flex-row justify-between items-start">
        <StyledView className="flex-1">
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

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 bg-gray-50">
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-blue-500" />
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  if (error) {
    return (
      <StyledSafeAreaView className="flex-1 bg-gray-50">
        <StyledView className="flex-1 justify-center items-center p-4">
          <StyledText className="text-red-500 text-lg text-center">
            {error}
          </StyledText>
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-50">
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
          setSelectedRecipe(null);
        }}
        recipe={selectedRecipe}
        loading={detailLoading}
        onEdit={(recipe) => {
          setRecipeToEdit(recipe);
          setIsEditModalVisible(true);
          setIsDetailModalVisible(false);
        }}
      />
    </StyledSafeAreaView>
  );
};

export default App;
