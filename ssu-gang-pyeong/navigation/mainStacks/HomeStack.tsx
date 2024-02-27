import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTopTabs from "../HomeTopTabs";
import {
  AddCourse,
  CreateTable,
  EasyPick,
  ManualPick,
  Tables,
} from "../../screens/homeScreens";

const NativeStack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NativeStack.Screen name="HomeTopTabs" component={HomeTopTabs} />
      <NativeStack.Screen name="AddCourse" component={AddCourse} />
      <NativeStack.Screen name="EasyPick" component={EasyPick} />
      <NativeStack.Screen name="ManualPick" component={ManualPick} />
      <NativeStack.Screen name="CreateTable" component={CreateTable} />
      <NativeStack.Screen name="Tables" component={Tables} />
    </NativeStack.Navigator>
  );
};

export default HomeStack;
