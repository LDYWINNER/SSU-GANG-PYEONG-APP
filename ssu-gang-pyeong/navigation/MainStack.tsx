import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  CourseDetail,
  CourseReview,
  CourseBulletin,
  WriteReview,
  WritePost,
} from "../screens";
import { UserMain, MyAccount } from "../screens/userScreens";
import useDarkMode from "../store/useDarkMode";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import { useColorScheme } from "react-native";

const NativeStack = createNativeStackNavigator();

const MainStack = () => {
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
        name="CourseDetail"
        component={CourseDetail}
        options={{ presentation: "modal", headerShown: false }}
      />
      <NativeStack.Screen
        name="CourseBulletin"
        component={CourseBulletin}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="CourseReview"
        component={CourseReview}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="WritePost"
        component={WritePost}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="WriteReview"
        component={WriteReview}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="UserMain"
        component={UserMain}
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
      <NativeStack.Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default MainStack;
