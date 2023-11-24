import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "react-native";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";

const ToDo = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <SafeAreaWrapper>
      <View>
        <Text>ToDo</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default ToDo;
