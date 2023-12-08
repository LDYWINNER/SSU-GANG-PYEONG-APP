import React from "react";
import { NavigateBack, SafeAreaWrapper } from "../../components";
import { useTheme } from "@shopify/restyle";
import { Box, Text, Theme } from "../../theme";
import { ScrollView } from "react-native-gesture-handler";
import { Alert, TouchableOpacity, Dimensions } from "react-native";
import TimeTable from "@mikezzb/react-native-timetable";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../colors";
import { useColorScheme } from "react-native";
import Search from "../Search";
import SelectCourses from "./SelectCourses";
import EasyPick from "./EasyPick";

const Tab = createMaterialTopTabNavigator();

const AddCourse = () => {
  const theme = useTheme<Theme>();
  const isDark = useColorScheme() === "dark";
  const windowHeight = Dimensions.get("window").height;

  return (
    <SafeAreaWrapper>
      <Box mx="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text ml="13" variant="textXl" fontWeight="600" mr="10">
            수업추가
          </Text>
          <TouchableOpacity>
            <Box
              style={{
                backgroundColor: theme.colors.sbuRed,
              }}
              p="2"
              px="3"
              borderRadius="rounded-4xl"
            >
              <Text
                variant="textBase"
                fontWeight="600"
                style={{ color: "white" }}
              >
                완료
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
        <Box height={16} />

        <Box height={windowHeight * 0.3}>
          <TimeTable
            eventGroups={[]}
            // events={events}
            eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
          />
        </Box>

        <Box height={windowHeight * 0.5}>
          <Tab.Navigator
            initialRouteName="학교 수업 추가"
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
            <Tab.Screen
              key={"학교 수업 추가"}
              name={"학교 수업 추가"}
              component={EasyPick}
            />
            <Tab.Screen
              key={"직접 추가"}
              name={"직접 추가"}
              component={SelectCourses}
            />
          </Tab.Navigator>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default AddCourse;
