import React from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Welcome: React.FC<NativeStackScreenProps<any, "Welcome">> = ({
  navigation: { navigate },
}) => {
  const isDark = useColorScheme() === "dark";
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => navigate("AuthStack", { screen: "Register" })}>
        Welcome
      </Text>
    </View>
  );
};

export default Welcome;
