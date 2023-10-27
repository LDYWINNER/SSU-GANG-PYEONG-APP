import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseDetail } from "../screens";
import { useColorScheme } from "react-native";
import colors from "../colors";

const NativeStack = createNativeStackNavigator();

const Stack = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: isDark ? colors.BLACK_COLOR : "white",
        },
        headerTitleStyle: {
          color: isDark ? "white" : colors.BLACK_COLOR,
        },
      }}
    >
      <NativeStack.Screen name="CourseDetail" component={CourseDetail} />
    </NativeStack.Navigator>
  );
};

export default Stack;
