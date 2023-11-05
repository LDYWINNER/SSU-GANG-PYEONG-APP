import React, { useRef, useState, useCallback, useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CourseDetail } from "../screens";
import styled from "styled-components/native";
import { Button, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListView } from "../screens/homeScreens/index";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

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

const HomeTopTabs: React.FC<NativeStackScreenProps<any, "HomeTopTabs">> = ({
  navigation: { navigate },
}) => {
  const isDark = useColorScheme() === "dark";
  const color = isDark ? "white" : colors.BLACK_COLOR;
  const [tableView, setTableView] = useState(true);
  const toggleView = () => setTableView((current) => !current);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [moreMenu, setmoreMenu] = useState(true);
  const toggleMoreMenu = () => {
    if (moreMenu) {
      handleSnapPress();
      setmoreMenu(false);
    } else {
      handleClosePress();
      setmoreMenu(true);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setmoreMenu(true);
    }
  }, []);
  return (
    <>
      <BigRow>
        <Title>@USERNAME</Title>
        <Row>
          <TouchableOpacity
            onPress={() => navigate("MainStack", { screen: "WriteReview" })}
          >
            <Ionicons
              name={isDark ? "add-circle-outline" : "add-circle"}
              color={color}
              size={35}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleMoreMenu()}>
            <Ionicons
              name={
                isDark
                  ? "ellipsis-horizontal-circle-outline"
                  : "ellipsis-horizontal-circle-sharp"
              }
              color={color}
              size={35}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView()} disabled={tableView}>
            <Ionicons
              name={!tableView ? "grid-outline" : "grid"}
              color={color}
              size={30}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView()} disabled={!tableView}>
            <Ionicons
              name={tableView ? "menu-outline" : "menu"}
              color={color}
              size={45}
            />
          </TouchableOpacity>
        </Row>
      </BigRow>
      {tableView ? (
        <>
          <Tab.Navigator>
            {semesters.map((semester) => (
              <Tab.Screen
                key={semester}
                name={semester}
                component={CourseDetail}
              />
            ))}
          </Tab.Navigator>

          <BottomSheet
            index={-1}
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableContentPanningGesture={false}
            onChange={handleSheetChange}
          >
            <BottomSheetView>
              <Text>Awesome 🔥</Text>
            </BottomSheetView>
          </BottomSheet>
        </>
      ) : (
        <>
          <ListView />
        </>
      )}
    </>
  );
};

export default HomeTopTabs;
