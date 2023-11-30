import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Search } from "../../screens";

const NativeStack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NativeStack.Screen name="Search" component={Search} />
    </NativeStack.Navigator>
  );
};

export default SearchStack;
