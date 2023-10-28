import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import colors from "../../colors";
import TopTabs from "../TopTabs";
import { Home } from "../../screens";

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
      <NativeStack.Screen name="TopTab" component={TopTabs} />
      <NativeStack.Screen name="Home" component={Home} />
    </NativeStack.Navigator>
  );
};

export default HomeStack;
