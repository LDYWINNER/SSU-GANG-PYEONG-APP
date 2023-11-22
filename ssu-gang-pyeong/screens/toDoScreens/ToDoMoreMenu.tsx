import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "react-native";

const ToDoMoreMenu = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ToDoMoreMenu</Text>
    </View>
  );
};

export default ToDoMoreMenu;
