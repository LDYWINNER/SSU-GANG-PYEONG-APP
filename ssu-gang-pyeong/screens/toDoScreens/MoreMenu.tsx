import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import colors from "../../colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ToDoScreenNavigationType } from "../../navigation/types";

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  padding-top: 10px;
  padding-left: 15px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom: 5px solid black;
  margin-bottom: 10px;
`;

const Title = styled.Text<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: 500;
  font-size: 16px;
  margin-left: 10px;
`;

const MoreMenu = () => {
  const navigation = useNavigation<ToDoScreenNavigationType>();
  const isDark = useColorScheme() === "dark";
  const color = isDark ? "white" : colors.BLACK_COLOR;

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {});
  };

  const navigateToCategories = () => {
    navigation.navigate("Categories");
  };

  const navigateToCompletedToDo = () => {
    navigation.navigate("CompletedToDo");
  };

  return (
    <Wrapper>
      <TouchableOpacity onPress={navigateToCreateCategory}>
        <Row>
          <Ionicons
            name={isDark ? "add-circle-outline" : "add-circle"}
            color={color}
            size={35}
          />
          <Title color={color}>Category 등록</Title>
        </Row>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToCategories}>
        <Row>
          <Ionicons
            name={isDark ? "file-tray-full-outline" : "file-tray-full"}
            color={color}
            size={35}
          />
          <Title color={color}>Category 관리</Title>
        </Row>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToCompletedToDo}>
        <Row>
          <Ionicons
            name={isDark ? "checkbox-outline" : "checkbox"}
            color={color}
            size={35}
          />
          <Title color={color}>완료한 Todo 관리</Title>
        </Row>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default MoreMenu;
