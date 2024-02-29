import React, { useCallback, useState, useRef, useMemo } from "react";
import {
  Divider,
  Loader,
  NavigateBack,
  SafeAreaWrapper,
} from "../../components";
import { useTheme } from "@shopify/restyle";
import { Box, Text, Theme } from "../../theme";
import { TouchableOpacity, Dimensions } from "react-native";
import TimeTable, { EventGroup } from "@mikezzb/react-native-timetable";
import SelectCourses from "./SelectCourses";
import EasyPick from "./EasyPick";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import useGlobalToggle from "../../store/useGlobalToggle";
import axiosInstance, { fetcher } from "../../utils/config";
import useSWR from "swr";
import { ICourse, IGlobalToggle } from "../../types";
import { formatCourses } from "../../utils/helpers";
import useSWRMutation from "swr/mutation";

interface ITVAuthRequest {
  tableName: IGlobalToggle;
}

const deleteAllTVCourseRequest = async (
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

const AddCourse = () => {
  const theme = useTheme<Theme>();
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

  const { trigger: deleteAllTVCourse } = useSWRMutation(
    "api/v1/course/deleteAllTVCourse",
    deleteAllTVCourseRequest
  );

  return (
    <SafeAreaWrapper>
      <Box mx="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text
            ml="13"
            variant="textXl"
            fontWeight="600"
            mr="6"
            color="textColor"
          >
            수업추가
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteAllTVCourse({
                tableName: toggleInfo as IGlobalToggle,
              });
            }}
          >
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
                초기화
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
              disableTicker
              eventGroups={
                courses?.takingCourses.length === 0
                  ? []
                  : (formatCourses(
                      courses!.takingCourses
                    ) as unknown as EventGroup[])
              }
              configs={{
                startHour: 8,
                endHour: 20,
              }}
              theme={{
                primary: theme.colors.mainBgColor,
                accent: theme.colors.stYellow,
                background: theme.colors.mainBgColor,
                text: theme.colors.textColor,
              }}
            />
          )}
        </Box>

        <Box
          height={windowHeight * 0.5}
          style={{ marginTop: windowHeight * 0.04 }}
        >
          <Divider />
          <Box height={6} />
          <EasyPick togglePicker={togglePicker} />
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
        backgroundStyle={{
          backgroundColor: theme.colors.mainBgColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.textColor,
        }}
      >
        <SelectCourses
          togglePicker={togglePicker}
          courses={courses?.takingCourses}
        />
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default AddCourse;
