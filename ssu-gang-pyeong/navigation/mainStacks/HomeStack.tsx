import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTopTabs from "../HomeTopTabs";
import { MoreMenu } from "../../screens/homeScreens";

const NativeStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NativeStack.Screen name="HomeTopTabs" component={HomeTopTabs} />
      <NativeStack.Screen
        name="MoreMenu"
        component={MoreMenu}
        options={{ presentation: "modal" }}
      />
    </NativeStack.Navigator>
  );
};

export default HomeStack;
