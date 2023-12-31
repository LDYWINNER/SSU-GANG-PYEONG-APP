import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import colors from "../../colors";
import { Ionicons } from "@expo/vector-icons";

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
  const isDark = useColorScheme() === "dark";
  const color = isDark ? "white" : colors.BLACK_COLOR;
  return (
    <Wrapper>
      <TouchableOpacity>
        <Row>
          <Ionicons
            name={isDark ? "image-outline" : "image"}
            color={color}
            size={35}
          />
          <Title color={color}>이미지로 저장</Title>
        </Row>
      </TouchableOpacity>
      <TouchableOpacity>
        <Row>
          <Ionicons
            name={isDark ? "share-social-outline" : "share-social"}
            color={color}
            size={35}
          />
          <Title color={color}>URL 공유</Title>
        </Row>
      </TouchableOpacity>
      <TouchableOpacity>
        <Row>
          <Ionicons
            name={isDark ? "image-outline" : "image"}
            color={color}
            size={35}
          />
          <Title color={color}>카카오톡으로 공유</Title>
        </Row>
      </TouchableOpacity>
      <TouchableOpacity>
        <Row>
          <Ionicons
            name={isDark ? "trash-outline" : "trash"}
            color={color}
            size={35}
          />
          <Title color={color}>초기화</Title>
        </Row>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default MoreMenu;
