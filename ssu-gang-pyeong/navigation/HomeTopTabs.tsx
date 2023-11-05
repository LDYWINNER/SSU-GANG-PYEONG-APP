import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CourseDetail } from "../screens";
import styled from "styled-components/native";
import { TouchableOpacity, View } from "react-native";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BigRow = styled(Row)`
  justify-content: space-between;
  margin-top: 70px;
`;

const Title = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 30px;
  margin-left: 10px;
`;

const semesters = ["2023-fall", "2023-spring", "2022-fall"];

const Tab = createMaterialTopTabNavigator();

function HomeTopTabs() {
  const isDark = useColorScheme() === "dark";
  const color = isDark ? "white" : colors.BLACK_COLOR;
  const [tableView, setTableView] = useState(true);
  const toggleView = () => setTableView((current) => !current);
  return (
    <>
      <BigRow>
        <Title>@USERNAME</Title>
        <Row>
          <TouchableOpacity>
            <Ionicons
              name={isDark ? "add-circle-outline" : "add-circle"}
              color={color}
              size={35}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name={
                isDark
                  ? "ellipsis-horizontal-circle-outline"
                  : "ellipsis-horizontal-circle"
              }
              color={color}
              size={35}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView()}>
            <Ionicons
              name={tableView ? "grid" : "grid-outline"}
              color={color}
              size={30}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView()}>
            <Ionicons
              name={!tableView ? "menu" : "menu-outline"}
              color={color}
              size={45}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
        </Row>
      </BigRow>
      <Tab.Navigator>
        {semesters.map((semester) => (
          <Tab.Screen key={semester} name={semester} component={CourseDetail} />
        ))}
      </Tab.Navigator>
    </>
  );
}

export default HomeTopTabs;
