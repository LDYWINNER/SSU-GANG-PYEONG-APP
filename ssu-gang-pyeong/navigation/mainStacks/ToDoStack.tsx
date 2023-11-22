import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ToDo } from "../../screens/toDoScreens";

const NativeStack = createNativeStackNavigator();

const ToDoStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NativeStack.Screen name="ToDo" component={ToDo} />
    </NativeStack.Navigator>
  );
};

export default ToDoStack;
