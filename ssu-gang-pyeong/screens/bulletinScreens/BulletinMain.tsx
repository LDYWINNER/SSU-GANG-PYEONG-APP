import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BulletinMain: React.FC<NativeStackScreenProps<any, "BulletinMain">> = ({
  navigation: { navigate },
}) => (
  <TouchableOpacity
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Text>BulletinMain</Text>
  </TouchableOpacity>
);

export default BulletinMain;
