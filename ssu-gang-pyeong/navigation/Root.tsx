import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import MainStack from "./MainStack";

const Nav = createNativeStackNavigator();

const Root = () => (
  <Nav.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Nav.Screen name="MainTabs" component={MainTabs} />
    <Nav.Screen name="MainStack" component={MainStack} />
  </Nav.Navigator>
);
export default Root;
