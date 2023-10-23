import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const NativeStack = createNativeStackNavigator();

const Stack = () => {
  return <NativeStack.Navigator></NativeStack.Navigator>;
};

export default Stack;
