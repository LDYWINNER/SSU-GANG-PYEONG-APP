import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Welcome, Register, Login } from "../screens/authScreens";

const NativeStack = createNativeStackNavigator();

const AuthStack = () => {
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
      <NativeStack.Screen
        name="Welcome"
        component={Welcome}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="Register"
        component={Register}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="Login"
        component={Login}
        options={{ presentation: "card", headerShown: false }}
      />
    </NativeStack.Navigator>
  );
};

export default AuthStack;
