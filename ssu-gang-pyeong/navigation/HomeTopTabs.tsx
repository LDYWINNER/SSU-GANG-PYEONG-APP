import React, { useRef, useState, useCallback, useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ListView, MoreMenu, TableView } from "../screens/homeScreens/index";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import useUserGlobalStore from "../store/useUserGlobal";
import { Loader, SafeAreaWrapper } from "../components";
import { Box, Text, Theme } from "../theme";
import useDarkMode from "../store/useDarkMode";
import { useTheme } from "@shopify/restyle";

const Tab = createMaterialTopTabNavigator();

const HomeTopTabs: React.FC<NativeStackScreenProps<any, "HomeTopTabs">> = ({
  navigation: { navigate },
}) => {
  const { user } = useUserGlobalStore();

  const { isDarkMode } = useDarkMode();
  const theme = useTheme<Theme>();
  const systemIsDark = useColorScheme() === "dark";

  const [tableView, setTableView] = useState(true);
  const toggleView = () => setTableView((current) => !current);

  // bottom sheet
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

  if (!user) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        pr="2"
        backgroundColor="mainBgColor"
      >
        <Text
          fontWeight="600"
          fontSize={30}
          ml="2"
          color="textColor"
        >{`@${user.username}`}</Text>
        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity
            onPress={() =>
              navigate("HomeStack", {
                screen: "AddCourse",
              })
            }
          >
            <Ionicons
              name={
                isDarkMode?.mode === "system"
                  ? systemIsDark
                    ? "add-circle-outline"
                    : "add-circle"
                  : isDarkMode?.mode === "dark"
                  ? "add-circle-outline"
                  : "add-circle"
              }
              color={theme.colors.textColor}
              size={35}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleMoreMenu()}>
            <Ionicons
              name={
                isDarkMode?.mode === "system"
                  ? systemIsDark
                    ? "ellipsis-horizontal-circle-outline"
                    : "ellipsis-horizontal-circle-sharp"
                  : isDarkMode?.mode === "dark"
                  ? "ellipsis-horizontal-circle-outline"
                  : "ellipsis-horizontal-circle-sharp"
              }
              color={theme.colors.textColor}
              size={35}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView()} disabled={tableView}>
            <Ionicons
              name={!tableView ? "grid-outline" : "grid"}
              color={theme.colors.textColor}
              size={30}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView()} disabled={!tableView}>
            <Ionicons
              name={tableView ? "menu-outline" : "menu"}
              color={theme.colors.textColor}
              size={45}
            />
          </TouchableOpacity>
        </Box>
      </Box>

      <>
        <Tab.Navigator
          sceneContainerStyle={{
            backgroundColor: theme.colors.mainBgColor,
          }}
          initialLayout={{
            width: Dimensions.get("window").width,
          }}
          screenOptions={{
            tabBarStyle: {
              backgroundColor: theme.colors.mainBgColor,
            },
            tabBarIndicatorStyle: {
              backgroundColor: theme.colors.sbuRed,
            },
            tabBarActiveTintColor: theme.colors.sbuRed,
            tabBarInactiveTintColor:
              isDarkMode?.mode === "system"
                ? systemIsDark
                  ? theme.colors.stDarkGrey
                  : theme.colors.stLightGrey
                : isDarkMode?.mode === "dark"
                ? theme.colors.stDarkGrey
                : theme.colors.stLightGrey,
            swipeEnabled: true,
          }}
        >
          {Object.keys(user?.classHistory).map((classHistoryKey) => (
            <Tab.Screen
              key={classHistoryKey}
              name={classHistoryKey}
              component={tableView ? TableView : (ListView as any)}
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
            backgroundColor: theme.colors.mainBgColor,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.textColor,
          }}
        >
          <MoreMenu />
        </BottomSheet>
      </>
    </SafeAreaWrapper>
  );
};

export default HomeTopTabs;
