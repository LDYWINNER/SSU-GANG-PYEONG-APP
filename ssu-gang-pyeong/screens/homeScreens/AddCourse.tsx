import React, { useCallback, useState, useRef, useMemo } from "react";
import { Loader, NavigateBack, SafeAreaWrapper } from "../../components";
import { useTheme } from "@shopify/restyle";
import { Box, Text, Theme } from "../../theme";
import { Alert, TouchableOpacity, Dimensions } from "react-native";
import TimeTable from "@mikezzb/react-native-timetable";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../colors";
import { useColorScheme } from "react-native";
import SelectCourses from "./SelectCourses";
import EasyPick from "./EasyPick";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import useGlobalToggle from "../../store/useGlobalToggle";
import { fetcher } from "../../utils/config";
import useSWR from "swr";
import { ICourse } from "../../types";
import { formatCourses } from "../../utils/helpers";

const Tab = createMaterialTopTabNavigator();

const AddCourse = () => {
  const theme = useTheme<Theme>();
  const isDark = useColorScheme() === "dark";
  const windowHeight = Dimensions.get("window").height;

  const { toggleInfo } = useGlobalToggle();

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [picker, setPicker] = useState(true);
  const pickerRef = useRef<Picker<string>>(null);
  const togglePicker = () => {
    if (picker) {
      handleSnapPress();
      setPicker(false);
    } else {
      handleClosePress();
      setPicker(true);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setPicker(true);
      // mutate();
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

  const { data: courses, isLoading: isLoadingCourses } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher, {
    refreshInterval: 1000,
  });

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
          {isLoadingCourses ? (
            <Loader />
          ) : (
            <TimeTable
              eventGroups={formatCourses(courses!.takingCourses)}
              eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
            />
          )}
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
              initialParams={{ togglePicker }}
            />
            <Tab.Screen
              key={"직접 추가"}
              name={"직접 추가"}
              component={SelectCourses}
            />
          </Tab.Navigator>
        </Box>
      </Box>
      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        // backgroundStyle={{
        //   backgroundColor: isDark ? colors.DARKER_GREY : "white",
        // }}
      >
        <SelectCourses togglePicker={togglePicker} />
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default AddCourse;
