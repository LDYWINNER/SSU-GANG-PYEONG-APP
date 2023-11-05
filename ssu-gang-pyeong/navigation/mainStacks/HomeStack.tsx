import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import colors from "../../colors";
import HomeTopTabs from "../HomeTopTabs";
import { ListView } from "../../screens/homeScreens/homeIndex";

const NativeStack = createNativeStackNavigator();

const HomeStack = () => {
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
      <NativeStack.Screen name="HomeTopTabs" component={HomeTopTabs} />
      <NativeStack.Screen name="ListView" component={ListView} />
    </NativeStack.Navigator>
  );
};

export default HomeStack;
