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
import { Table, Row, Rows } from "react-native-reanimated-table";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from "victory-native";

type CourseDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseDetail"
>;

const CourseDetail = () => {
  const theme = useTheme<Theme>();
  const route = useRoute<CourseDetailScreenRouteProp>();
  //preprocessing for table
  const tableResult = [];
  //preprocessing for course reviews
  const overallGradeStore = [0, 0, 0, 0, 0];
  const difficultyStore = [0, 0, 0];
  const generosityStore = [0, 0, 0];
  const hwQuantityStore = [0, 0, 0];
  const testQuantityStore = [0, 0, 0, 0, 0];
  const teamProjectPresenceStore = [0, 0];
  const quizPresenceStore = [0, 0];
  const attendanceStore = [0, 0, 0, 0, 0];

  const { id } = route.params;

  const { data: course, isLoading: isLoadingCourse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher
  );

  if (isLoadingCourse) {
    return <Loader />;
  } else {
    //preprocessing for table
    for (let i = 0; i < course!.semesters.length; i++) {
      const temp = [];
      if (course?.semesters[i] === "2023_spring") {
        temp.push(`2023 SPR (${course.instructor[i]})`);
      } else if (course?.semesters[i] === "2022_fall") {
        temp.push(`2022 FA (${course.instructor[i]})`);
      }

      temp.push(course?.day.split(", ")[i]);
      temp.push(course?.startTime.split(", ")[i]);
      temp.push(course?.endTime.split(", ")[i]);
      temp.push(course?.room.split(", ")[i]);
      tableResult.unshift(temp);
    }

    //preprocessing for reviews
    console.log(course?.reviews);
    for (let j = 0; j < course!.reviews.length; j++) {
      //overallGrade
      overallGradeStore[Number(course!.reviews[j].overallGrade) - 1]++;
      //difficulty
      switch (course!.reviews[j].difficulty) {
        case "difficult":
          difficultyStore[0]++;
          break;
        case "soso":
          difficultyStore[1]++;
          break;
        case "easy":
          difficultyStore[2]++;
          break;
      }
      console.log(difficultyStore);
      //generosity
      if (course!.reviews[j].generosity) {
        switch (course!.reviews[j].generosity) {
          case "generous":
            generosityStore[0]++;
            break;
          case "normal":
            generosityStore[1]++;
            break;
          case "meticulous":
            generosityStore[2]++;
            break;
        }
      }
      //hwQuantity
      switch (course!.reviews[j].homeworkQuantity) {
        case "many":
          hwQuantityStore[0]++;
          break;
        case "soso":
          hwQuantityStore[1]++;
          break;
        case "easy":
          hwQuantityStore[2]++;
          break;
      }
      //testQuantity
      switch (course!.reviews[j].testQuantity) {
        case "morethan4":
          testQuantityStore[0]++;
          break;
        case "three":
          testQuantityStore[1]++;
          break;
        case "two":
          testQuantityStore[2]++;
          break;
        case "one":
          testQuantityStore[3]++;
          break;
        case "none":
          testQuantityStore[4]++;
          break;
      }
      //test
      // switch (course!.reviews[j].testQuantity) {
      //   case "mid3final1":
      //     hwQuantityStore[0]++;
      //     break;
      //   case "mid2final1":
      //     hwQuantityStore[1]++;
      //     break;
      //   case "mid1final1":
      //     hwQuantityStore[2]++;
      //     break;
      //   case "only final":
      //     hwQuantityStore[2]++;
      //     break;
      //   case "only midterm":
      //     hwQuantityStore[2]++;
      //     break;
      //   case "none":
      //     hwQuantityStore[2]++;
      //     break;
      // }
      //teamProject
      if (course!.reviews[j].teamProjectPresence) {
        teamProjectPresenceStore[0]++;
      } else {
        teamProjectPresenceStore[1]++;
      }
      //quiz
      if (course!.reviews[j].quizPresence) {
        quizPresenceStore[0]++;
      } else {
        quizPresenceStore[1]++;
      }
      //attendance
      if (course!.reviews[j].attendance) {
        switch (course!.reviews[j].attendance) {
          case "calloutname":
            attendanceStore[0]++;
            break;
          case "rollpaper":
            attendanceStore[1]++;
            break;
          case "qrcode":
            attendanceStore[2]++;
            break;
          case "googleformone":
            attendanceStore[3]++;
            break;
          case "none":
            attendanceStore[4]++;
            break;
        }
      }
    }
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
          <Text variant="textBase">
            Sbc: {course?.sbc === "NaN" ? "X" : course?.sbc}
          </Text>
          <Box height={16} />

          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={["Semester", "Day", "Start", "End", "Location"]}
              style={{ height: 40, backgroundColor: "#f1f8ff" }}
              textStyle={{ margin: 6 }}
            />
            <Rows data={tableResult} textStyle={{ margin: 6 }} />
          </Table>
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

          <Box justifyContent="center">
            <Text>Difficulty</Text>
            <Box ml="1" mt="-6">
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ y: 45, x: 30 }}
                height={250}
                width={400}
              >
                <VictoryBar
                  horizontal
                  data={[
                    { x: "많음", y: difficultyStore[0] },
                    { x: "보통", y: difficultyStore[1] },
                    { x: "적음", y: difficultyStore[2] },
                  ]}
                  categories={{ x: ["적음", "보통", "많음"] }}
                  barWidth={20}
                  animate={{
                    duration: 2000,
                    onLoad: { duration: 1000 },
                  }}
                  style={{
                    data: { fill: theme.colors.sky200 },
                  }}
                  cornerRadius={{ top: 8 }}
                />
              </VictoryChart>
            </Box>
          </Box>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default CourseDetail;
