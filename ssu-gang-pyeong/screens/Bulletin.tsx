import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";

const Bulletin: React.FC<NativeStackScreenProps<any, "Bulletin">> = ({
  navigation: { navigate },
}) => (
  <TouchableOpacity
    onPress={() => navigate("Stack", { screen: "CourseDetail" })}
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Text>Bulletin</Text>
  </TouchableOpacity>
);

export default Bulletin;
