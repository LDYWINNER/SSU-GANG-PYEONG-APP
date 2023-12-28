import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
import { BulletinStackParamList } from "../../navigation/types";

type BulletinDetailScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinDetail"
>;

const BulletinDetail: React.FC<
  NativeStackScreenProps<any, "BulletinDetail">
> = ({ navigation: { navigate } }) => {
  const route = useRoute<BulletinDetailScreenRouteProp>();
  const { name } = route.params;

  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

export default BulletinDetail;
