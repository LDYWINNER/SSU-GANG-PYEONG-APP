import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "react-native";

const ToDo = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ToDo</Text>
    </View>
  );
};

export default ToDo;
