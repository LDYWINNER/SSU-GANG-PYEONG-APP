import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Welcome,
  Register,
  Login,
  EmailVerification,
} from "../screens/authScreens";
import useDarkMode from "../store/useDarkMode";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import { useColorScheme } from "react-native";

const NativeStack = createNativeStackNavigator();

const AuthStack = () => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor:
            isDarkMode?.mode === "system"
              ? systemIsDark
                ? theme.colors.stBlack
                : "white"
              : isDarkMode?.mode === "dark"
              ? theme.colors.stBlack
              : "white",
        },
        headerTitleStyle: {
          color:
            isDarkMode?.mode === "system"
              ? systemIsDark
                ? "white"
                : theme.colors.stBlack
              : isDarkMode?.mode === "dark"
              ? "white"
              : theme.colors.stBlack,
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
      <NativeStack.Screen
        name="EmailVerification"
        component={EmailVerification}
        options={{ presentation: "card", headerShown: false }}
      />
    </NativeStack.Navigator>
  );
};

export default AuthStack;
