import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { CourseDetail, CourseReview, WriteReview, MyAccount } from "../screens";

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
      <NativeStack.Screen
        name="CourseDetail"
        component={CourseDetail}
        options={{ presentation: "modal" }}
      />
      <NativeStack.Screen
        name="CourseReview"
        component={CourseReview}
        options={{ presentation: "card" }}
      />
      <NativeStack.Screen
        name="WriteReview"
        component={WriteReview}
        options={{ presentation: "card" }}
      />
      <NativeStack.Screen
        name="MyAccount"
        component={MyAccount}
        options={{ presentation: "card" }}
      />
    </NativeStack.Navigator>
  );
};

export default Stack;
