import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRecipes,
  searchRecipes,
  deleteRecipe,
  setSearchQuery,
} from "../store/slices/recipeSlice";
import ProgressBar from "@react-native-community/progress-bar-android";
import ProgressView from "@react-native-community/progress-view";
import { fadeIn, slideIn } from "../utils/animations";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledImageBackground = styled(ImageBackground);

const Progress = Platform.select({
  ios: ProgressView,
  android: ProgressBar,
});

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    items: recipes,
    loading,
    error,
    searchQuery,
  } = useSelector((state) => state.recipes);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const showAlerts = useSelector((state) => state.theme.showAlerts);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoadingProgress(0);
      const startTime = Date.now();

      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const elapsedTime = Date.now() - startTime;
          const targetProgress = Math.min(elapsedTime / 2000, 0.95);
          return targetProgress;
        });
      }, 16);

      try {
        await dispatch(fetchRecipes());
        setLoadingProgress(1);
      } catch (error) {
        console.error("Loading error:", error);
      } finally {
        clearInterval(interval);
        setTimeout(() => setLoadingProgress(0), 500);
      }
    };

    loadRecipes();
  }, [dispatch]);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      setSearchProgress((prev) => {
        const elapsedTime = Date.now() - startTime;
        const targetProgress = Math.min(elapsedTime / 2000, 0.95);
        return targetProgress;
      });
    }, 16);

    try {
      if (!searchQuery.trim()) {
        await dispatch(fetchRecipes());
      } else {
        await dispatch(searchRecipes(searchQuery));
      }

      setSearchProgress(1);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      clearInterval(interval);
      setIsSearching(false);
      setSearchProgress(0);
    }
  };

  const handleDeleteRecipe = async (recipeId, recipeName) => {
    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to delete "${recipeName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteRecipe(recipeId)).unwrap();
              if (showAlerts) {
                Alert.alert("Success", "Recipe deleted successfully!");
              }
            } catch (err) {
              console.error("Delete Recipe Error:", err);
              if (showAlerts) {
                Alert.alert(
                  "Error",
                  "Failed to delete recipe. Please try again."
                );
              }
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <StyledView className="border-b border-gray-200 pb-0">
      {isSearching && (
        <StyledView className="absolute top-0 left-0 right-0 z-50">
          <StyledView className="flex-row justify-between px-4 py-1">
            <StyledText
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Searching Recipes
            </StyledText>
            <StyledText
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {Math.round(searchProgress * 100)}%
            </StyledText>
          </StyledView>
          <Progress
            progress={searchProgress}
            width={null}
            color="#3B82F6"
            style={{ height: 3 }}
            {...(Platform.OS === "ios" ? { progressTintColor: "#3B82F6" } : {})}
          />
        </StyledView>
      )}

      <StyledView className="flex-row justify-between items-center px-4 mb-4">
        <StyledTouchable
          onPress={() => {
            dispatch(setSearchQuery(""));
            dispatch(fetchRecipes());
          }}
        >
          <StyledImage
            source={require("../../assets/logo.png")}
            className="w-28 h-12"
            resizeMode="contain"
          />
        </StyledTouchable>
        <StyledTouchable
          onPress={() => navigation.navigate("CreateRecipe")}
          className="bg-black px-2 py-2 rounded-lg flex-row items-center"
        >
          <Ionicons name="add" size={16} color="white" />
          <StyledText className="text-white font-josefin-medium ml-2">
            add recipe
          </StyledText>
        </StyledTouchable>
        <StyledTouchable
          onPress={() => navigation.navigate("Settings")}
          className="ml-2 p-2"
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={isDarkMode ? "#9CA3AF" : "#4B5563"}
          />
        </StyledTouchable>
      </StyledView>
      <StyledView className="flex-row px-4 mb-2">
        <StyledInput
          className={`flex-1 px-4 py-2 rounded-l-lg border border-gray-300 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
          }`}
          placeholder="Search recipes..."
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
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
            {isSearching ? "..." : "Search"}
          </StyledText>
        </StyledTouchable>
      </StyledView>
    </StyledView>
  );

  const renderRecipe = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
      // Stagger animation for list items
      Animated.stagger(100 * index, [
        fadeIn(fadeAnim),
        slideIn(slideAnim),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <StyledTouchable
          onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
          className={`mx-4 my-2 p-4 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <StyledView className="flex-row justify-between items-start">
            <StyledView className="flex-1">
              <StyledText
                className={`text-xl font-josefin-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {item.name}
              </StyledText>
              <StyledText
                className={`font-josefin mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {item.description}
              </StyledText>
              <StyledView className="flex-row items-center">
                <StyledText
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
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
                e.stopPropagation();
                handleDeleteRecipe(item._id, item.name);
              }}
              className="p-2"
            >
              <FontAwesome
                name="trash"
                size={24}
                color={isDarkMode ? "#9CA3AF" : "gray"}
              />
            </StyledTouchable>
          </StyledView>
        </StyledTouchable>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <StyledImageBackground
        source={require("../../assets/background.jpg")}
        className="flex-1"
      >
        <StyledView
          className={`flex-1 ${
            isDarkMode ? "bg-gray-900/90" : "bg-gray-50/70"
          } pt-12`}
        >
          <StyledView className="flex-1 justify-center items-center p-4">
            <StyledText
              className={`text-lg mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading Recipes... {Math.round(loadingProgress * 100)}%
            </StyledText>
            <Progress
              progress={loadingProgress}
              width={200}
              color="#3B82F6"
              style={{ height: 10 }}
              {...(Platform.OS === "ios"
                ? { progressTintColor: "#3B82F6" }
                : {})}
            />
          </StyledView>
        </StyledView>
      </StyledImageBackground>
    );
  }

  if (error) {
    return (
      <StyledImageBackground
        source={require("../../assets/background.jpg")}
        className="flex-1"
      >
        <StyledView
          className={`flex-1 ${
            isDarkMode ? "bg-gray-900/90" : "bg-gray-50/70"
          } pt-12`}
        >
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
      source={require("../../assets/background.jpg")}
      className="flex-1"
    >
      <StyledView
        className={`flex-1 ${
          isDarkMode ? "bg-gray-900/90" : "bg-gray-50/70"
        } pt-12`}
      >
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
              <StyledText
                className={`text-lg text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {loading ? "Loading..." : "No recipes found"}
              </StyledText>
            </StyledView>
          )}
        />
      </StyledView>
    </StyledImageBackground>
  );
};

export default HomeScreen;
