import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Bulletin, Search, Home, Todo, Notification } from "../screens/index";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: isDark ? colors.BLACK_COLOR : "white",
      }}
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? colors.BLACK_COLOR : "white",
        },
        tabBarActiveTintColor: colors.SBU_RED,
        tabBarInactiveTintColor: isDark ? colors.DARK_GREY : colors.LIGHT_GREY,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Bulletin"
        component={Bulletin}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? "reader" : "reader-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="To Do"
        component={Todo}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? "library" : "library-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
