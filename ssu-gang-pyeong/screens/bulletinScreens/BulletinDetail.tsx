import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BulletinDetail: React.FC<
  NativeStackScreenProps<any, "BulletinDetail">
> = ({ navigation: { navigate } }) => (
  <TouchableOpacity
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Text>BulletinDetail</Text>
  </TouchableOpacity>
);

export default BulletinDetail;
