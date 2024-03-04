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
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
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
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const togglePicker = () => {
    handleSnapPress();
  };
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
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher);

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

  if (!courses) {
    return <Loader />;
  }
  return (
    <BottomSheetModalProvider>
      {isLoadingCourses ? (
        <Loader />
      ) : (
        <TimeTable
          eventGroups={
            courses?.takingCourses.length === 0 &&
            user?.personalSchedule.length === 0
              ? []
              : (
                  formatCourses(
                    courses!.takingCourses
                  ) as unknown as EventGroup[]
                ).concat(user?.personalSchedule || [])
          }
          // eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
          eventOnPress={(event) => {
            // console.log(user?.personalSchedule[0].sections[""]);
            // console.log(event);
            if (event.groupIndex < courses!.takingCourses.length) {
              togglePicker();
              setCourseIndex(event.groupIndex);
              // console.log(courses?.takingCourses[courseIndex as number]);
              // console.log(courseIndex);
            }
          }}
          // configs={{
          //   startHour: 6,
          //   endHour: 20,
          // }}
          // eventColors={["#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E"]}
          theme={{
            primary: theme.colors.mainBgColor,
            accent: theme.colors.stYellow,
            background: theme.colors.mainBgColor,
            text: theme.colors.textColor,
          }}
        />
      )}

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.mainBgColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.textColor,
        }}
      >
        <Box mx="3" my="2">
          <Box mb="5">
            <Text variant="textXl" fontWeight="600" mb="2" color="textColor">
              {courses?.takingCourses[courseIndex as number]?.subj}{" "}
              {courses?.takingCourses[courseIndex as number]?.crs} -{" "}
              {courses?.takingCourses[courseIndex as number]?.instructor.at(-1)}
            </Text>

            <Text color="textColor">
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

            <Text color="textColor">
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
              color={theme.colors.textColor}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("HomeStack", {
                  screen: "AddCourse",
                });
              }}
            >
              <Box ml="2">
                <Text variant="textXl" color="textColor">
                  수업 정보 수정
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Box flexDirection="row" mb="4">
            <Ionicons name="search" size={24} color={theme.colors.textColor} />
            <TouchableOpacity
              onPress={() =>
                navigateToCourseDetail(
                  courses?.takingCourses[courseIndex as number]._id as string
                )
              }
            >
              <Box ml="2">
                <Text variant="textXl" color="textColor">
                  수업 정보 자세히 보기
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Box flexDirection="row">
            <FontAwesome5
              name="trash"
              size={24}
              color={theme.colors.textColor}
            />
            <TouchableOpacity
              onPress={() => {
                deleteTVCourse({
                  tableName: toggleInfo as IGlobalToggle,
                  courseId: courses?.takingCourses[courseIndex as number]
                    ._id as string,
                });
                mutate();
                //close bottom sheet
                handleClosePress();
              }}
            >
              <Box ml="3">
                <Text variant="textXl" color="textColor">
                  수업 삭제하기
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default TableView;
