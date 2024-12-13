import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  SafeAreaView,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, toggleAlerts } from "../store/slices/themeSlice";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const showAlerts = useSelector((state) => state.theme.showAlerts);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const renderSettingItem = (
    icon,
    title,
    description,
    value,
    onValueChange,
    type = "switch"
  ) => {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    return (
      <StyledView
        className={`flex-row items-center justify-between p-4 mb-2 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <StyledView className="flex-row items-center flex-1">
          <Ionicons
            name={icon}
            size={24}
            color={isDarkMode ? "#9CA3AF" : "#4B5563"}
            className="mr-4"
          />
          <StyledView className="flex-1 ml-3">
            <StyledText
              className={`text-lg font-josefin-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {title}
            </StyledText>
            <StyledText
              className={`text-sm font-josefin ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {description}
            </StyledText>
          </StyledView>
        </StyledView>
        {type === "switch" && (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
                { scale: scaleAnim },
              ],
            }}
          >
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{
                false: isDarkMode ? "#374151" : "#D1D5DB",
                true: "#3B82F6",
              }}
              thumbColor={value ? "#FFFFFF" : "#FFFFFF"}
            />
          </Animated.View>
        )}
      </StyledView>
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear App Data",
      "Are you sure you want to clear all app data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // Add clear data logic here
            Alert.alert("Success", "App data has been cleared.");
          },
        },
      ]
    );
  };

  const handleToggle = (toggle) => {
    // Parallel animation when toggling settings
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
      toggle();
    });
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
          Settings
        </StyledText>
        <StyledTouchable onPress={() => navigation.goBack()}>
          <Ionicons
            name="close"
            size={24}
            color={isDarkMode ? "#9CA3AF" : "#4B5563"}
          />
        </StyledTouchable>
      </StyledView>

      <StyledScrollView className="flex-1">
        <StyledView className="p-4">
          <StyledText
            className={`font-josefin-medium mb-2 ml-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Appearance
          </StyledText>
          {renderSettingItem(
            "moon-outline",
            "Dark Mode",
            "Switch between light and dark theme",
            isDarkMode,
            () => dispatch(toggleDarkMode())
          )}

          <StyledText
            className={`font-josefin-medium mb-2 mt-6 ml-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Notifications
          </StyledText>
          {renderSettingItem(
            "notifications-outline",
            "Alerts",
            "Show alerts after creating or deleting recipes",
            showAlerts,
            () => dispatch(toggleAlerts())
          )}

          <StyledText
            className={`font-josefin-medium mb-2 mt-6 ml-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Data Management
          </StyledText>
          <StyledTouchable
            onPress={handleClearData}
            className={`p-4 rounded-lg mb-2 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <StyledView className="flex-row items-center">
              <Ionicons name="trash-outline" size={24} color="#DC2626" />
              <StyledView className="ml-3">
                <StyledText className="text-red-600 font-josefin-bold text-lg">
                  Clear App Data
                </StyledText>
                <StyledText
                  className={`font-josefin text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Delete all saved recipes and settings
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledTouchable>

          <StyledView className="mt-8">
            <StyledText
              className={`text-center font-josefin ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Version 1.0.0
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default SettingsScreen;
