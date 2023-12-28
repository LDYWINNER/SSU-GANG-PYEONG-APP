import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BulletinPost: React.FC<NativeStackScreenProps<any, "BulletinPost">> = ({
  navigation: { navigate },
}) => (
  <TouchableOpacity
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Text>BulletinPost</Text>
  </TouchableOpacity>
);

export default BulletinPost;
