import React, { useRef, useState, useCallback, useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CourseDetail } from "../screens";
import styled from "styled-components/native";
import { Dimensions, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListView, MoreMenu } from "../screens/homeScreens/index";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BigRow = styled(Row)<{ bgColor: string }>`
  justify-content: space-between;
  background-color: ${(props) => props.bgColor};
  padding-top: 70px;
`;

const Title = styled.Text<{ color: string }>`
  color: ${(props) => props.color};
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
  const bgColor = isDark ? colors.BLACK_COLOR : "white";
  const [tableView, setTableView] = useState(true);
  const toggleView = () => setTableView((current) => !current);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
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
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <>
      <BigRow bgColor={bgColor}>
        <Title color={color}>@USERNAME</Title>
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
          <Tab.Navigator
            initialRouteName="2023-fall"
            sceneContainerStyle={{
              backgroundColor: isDark ? colors.BLACK_COLOR : "white",
            }}
            initialLayout={{
              width: Dimensions.get("window").width,
            }}
            screenOptions={{
              tabBarStyle: {
                backgroundColor: isDark ? colors.BLACK_COLOR : "white",
              },
              tabBarIndicatorStyle: {
                backgroundColor: colors.SBU_RED,
              },
              tabBarActiveTintColor: colors.SBU_RED,
              tabBarInactiveTintColor: isDark
                ? colors.DARK_GREY
                : colors.LIGHT_GREY,
              swipeEnabled: true,
            }}
          >
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
            backdropComponent={renderBackdrop}
            backgroundStyle={{
              backgroundColor: isDark ? colors.BLACK_COLOR : "white",
            }}
          >
            <MoreMenu />
          </BottomSheet>
        </>
      ) : (
        <>
          <ListView />
          <BottomSheet
            index={-1}
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableContentPanningGesture={false}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChange}
            backgroundStyle={{
              backgroundColor: isDark ? colors.BLACK_COLOR : "white",
            }}
          >
            <MoreMenu />
          </BottomSheet>
        </>
      )}
    </>
  );
};

export default HomeTopTabs;
