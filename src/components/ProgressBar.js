import React from "react";
import { View, Animated, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

const ProgressBar = ({ progress }) => {
  return (
    <StyledView className="absolute inset-0 flex items-center justify-center bg-black/50">
      <StyledView className="bg-white p-4 rounded-lg w-3/4">
        <StyledText className="text-center mb-2 text-gray-700 font-medium">
          {Math.round(progress.__getValue() * 100)}%
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
  );
};

export default ProgressBar;
