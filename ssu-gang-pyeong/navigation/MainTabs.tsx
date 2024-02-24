import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeStack,
  BulletinStack,
  SearchStack,
  ToDoStack,
} from "./mainStacks/index";
import { Ionicons } from "@expo/vector-icons";
import SchoolInfo from "../screens/SchoolInfo";
import { Feather } from "@expo/vector-icons";
import useDarkMode from "../store/useDarkMode";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        tabBarStyle: {
          backgroundColor:
            isDarkMode?.mode === "dark" ? theme.colors.stBlack : "white",
        },
        tabBarActiveTintColor: theme.colors.sbuRed,
        tabBarInactiveTintColor:
          isDarkMode?.mode === "dark"
            ? theme.colors.stDarkGrey
            : theme.colors.stLightGrey,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="BulletinStack"
        component={BulletinStack}
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
        name="SearchStack"
        component={SearchStack}
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
        name="HomeStack"
        component={HomeStack}
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
        name="ToDoStack"
        component={ToDoStack}
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
        name="SchoolInfo"
        component={SchoolInfo}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Feather name="more-vertical" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
