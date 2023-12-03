import React from "react";
import useSWR from "swr";
import { RouteProp, useRoute } from "@react-navigation/native";
import axiosInstance, { fetcher } from "../utils/config";
import { Box, Text, Theme } from "../theme";
import { useTheme } from "@shopify/restyle";
import { ICourse } from "../types";
import { MainStackParamList } from "../navigation/types";
import { Loader, NavigateBack, SafeAreaWrapper } from "../components";
import { Rating } from "@kolking/react-native-rating";

type CourseDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseDetail"
>;

const CourseDetail = () => {
  const theme = useTheme<Theme>();
  const route = useRoute<CourseDetailScreenRouteProp>();

  const { id } = route.params;

  const { data: course, isLoading: isLoadingCourse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher
  );

  if (isLoadingCourse) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="600" mr="10">
            {course?.subj} {course?.crs}
          </Text>
          <Box></Box>
        </Box>
        <Box height={16} />

        <Box
          borderRadius="rounded-xl"
          borderWidth={1}
          borderColor={"gray550"}
          p={"3"}
        >
          <Text variant="textBase">Course Title: {course?.courseTitle}</Text>
          <Text variant="textBase">
            Instructor:{" "}
            {course?.unique_instructor.includes(",")
              ? course?.unique_instructor.split(", ").join(" & ")
              : course?.unique_instructor}
          </Text>
          <Text variant="textBase">Credits: {course?.credits}</Text>
          <Text variant="textBase">Sbc: {course?.sbc}</Text>
          <Text variant="textBase">
            Semester: {course?.semesters.join(", ")}
          </Text>
          <Text variant="textBase">Day: {course?.courseTitle}</Text>
          <Text variant="textBase">Time: {course?.courseTitle}</Text>
        </Box>
        <Box height={16} />

        <Box
          borderRadius="rounded-xl"
          borderWidth={1}
          borderColor={"gray550"}
          p={"3"}
        >
          <Box flexDirection="row" alignItems="center">
            <Text variant="text3Xl">
              {course?.avgGrade ? course?.avgGrade.toFixed(2) : 0}
            </Text>
            <Box width={8} />
            {course?.avgGrade ? (
              <Rating rating={Number(course.avgGrade.toFixed(2))} disabled />
            ) : (
              <Rating rating={0} disabled />
            )}
            <Box width={8} />
            <Text>
              {course?.avgGrade
                ? "(" + course?.reviews.length + "개)"
                : "(0개)"}
            </Text>
          </Box>

          <Box></Box>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default CourseDetail;
