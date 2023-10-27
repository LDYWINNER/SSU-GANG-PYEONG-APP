import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseDetail } from "../screens";

const NativeStack = createNativeStackNavigator();

const Stack = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen name="CourseDetail" component={CourseDetail} />
    </NativeStack.Navigator>
  );
};

export default Stack;
