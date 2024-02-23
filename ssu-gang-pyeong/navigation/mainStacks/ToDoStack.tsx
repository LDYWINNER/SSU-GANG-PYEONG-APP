import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ToDo,
  CreateCategory,
  Categories,
  Category,
  CompletedToDo,
  MoreMenu,
  EditTask,
} from "../../screens/toDoScreens";

const NativeStack = createNativeStackNavigator();

const ToDoStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NativeStack.Screen
        name="ToDo"
        component={ToDo}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="CreateCategory"
        component={CreateCategory}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="Categories"
        component={Categories}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="Category"
        component={Category}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="CompletedToDo"
        component={CompletedToDo}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="MoreMenu"
        component={MoreMenu}
        options={{ presentation: "card", headerShown: false }}
      />
      <NativeStack.Screen
        name="EditTask"
        component={EditTask}
        options={{ presentation: "card", headerShown: false }}
      />
    </NativeStack.Navigator>
  );
};

export default ToDoStack;
