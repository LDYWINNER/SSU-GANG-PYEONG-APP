import React, { useCallback, useState, useRef, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import TimeTable, { EventGroup } from "@mikezzb/react-native-timetable";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useGlobalToggle from "../../store/useGlobalToggle";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useEffect } from "react";
import { ICourse, IGlobalToggle } from "../../types";
import useSWR from "swr";
import axiosInstance, { fetcher } from "../../utils/config";
import { formatCourses } from "../../utils/helpers";
import { Divider, Loader } from "../../components";
import { useIsFocused } from "@react-navigation/native";
import { Box, Text, Theme } from "../../theme";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import useSWRMutation from "swr/mutation";

interface ITVAuthRequest {
  tableName: IGlobalToggle;
  courseId: string;
}

const deleteTVCourseRequest = async (
  url: string,
  { arg }: { arg: ITVAuthRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in patchTVCourseRequest", error);
    throw error;
  }
};

const TableView: React.FC<NativeStackScreenProps<any, "TableView">> = ({
  navigation,
}) => {
  const theme = useTheme<Theme>();
  const { user } = useUserGlobalStore();
  const { toggleInfo, updateToggleInfo } = useGlobalToggle();
  const isFocused = useIsFocused();
  const [courseIndex, setCourseIndex] = useState<number>();

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["45%"], []);
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

  const navigateToCourseDetail = (courseId: string) => {
    navigation.navigate("MainStack", {
      screen: "CourseDetail",
      params: { id: courseId },
    });
  };

  const { trigger: deleteTVCourse } = useSWRMutation(
    "api/v1/course/deleteTVCourse",
    deleteTVCourseRequest
  );

  const {
    data: courses,
    isLoading: isLoadingCourses,
    mutate,
  } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (isFocused) {
      updateToggleInfo({
        currentTableView: Object.keys(user!.classHistory)[
          navigation.getState().index
        ],
      });
      // console.log("Current tab:", currentRoute.name);
      mutate();
    }
  }, [isFocused, navigation]);

  return (
    <Box>
      {isLoadingCourses ? (
        <Loader />
      ) : (
        <TimeTable
          eventGroups={
            courses?.takingCourses.length === 0
              ? []
              : (formatCourses(
                  courses!.takingCourses
                ) as unknown as EventGroup[])
          }
          // eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
          eventOnPress={(event) => {
            togglePicker();
            setCourseIndex(event.groupIndex);
            // console.log(courses?.takingCourses[courseIndex as number]);
            // console.log(courseIndex);
          }}
          disableTicker
          configs={{
            startHour: 8,
            endHour: 20,
          }}
        />
      )}
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
        <Box mx="3" my="2">
          <Box mb="5">
            <Text variant="textXl" fontWeight="600" mb="2">
              {courses?.takingCourses[courseIndex as number]?.subj}{" "}
              {courses?.takingCourses[courseIndex as number]?.crs} -{" "}
              {courses?.takingCourses[courseIndex as number]?.instructor.at(-1)}
            </Text>

            <Text>
              {courses?.takingCourses[courseIndex as number]?.day
                .split(", ")
                .at(-1)}
              {": "}
              {courses?.takingCourses[courseIndex as number]?.startTime
                .split(", ")
                .at(-1)}{" "}
              ~{" "}
              {courses?.takingCourses[courseIndex as number]?.endTime
                .split(", ")
                .at(-1)}
            </Text>

            <Text>
              Location:{" "}
              {courses?.takingCourses[courseIndex as number]?.room
                .split(", ")
                .at(-1)}
            </Text>
          </Box>
          <Divider />

          <Box flexDirection="row" mb="4" mt="6">
            <MaterialCommunityIcons
              name="pencil-plus-outline"
              size={24}
              color="black"
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("HomeStack", {
                  screen: "AddCourse",
                });
              }}
            >
              <Box ml="2">
                <Text variant="textXl">수업 정보 수정</Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Box flexDirection="row" mb="4">
            <Ionicons name="search" size={24} color="black" />
            <TouchableOpacity
              onPress={() =>
                navigateToCourseDetail(
                  courses?.takingCourses[courseIndex as number]._id as string
                )
              }
            >
              <Box ml="2">
                <Text variant="textXl">수업 정보 자세히 보기</Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Box flexDirection="row">
            <FontAwesome5 name="trash" size={24} color="black" />
            <TouchableOpacity
              onPress={() => {
                deleteTVCourse({
                  tableName: toggleInfo as IGlobalToggle,
                  courseId: courses?.takingCourses[courseIndex as number]
                    ._id as string,
                });
                //close bottom sheet
                handleClosePress();
                setPicker(true);
              }}
            >
              <Box ml="3">
                <Text variant="textXl">수업 삭제하기</Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      </BottomSheet>
    </Box>
  );
};

export default TableView;
