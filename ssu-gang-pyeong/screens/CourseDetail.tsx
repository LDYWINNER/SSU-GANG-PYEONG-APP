import React from "react";
import useSWR from "swr";
import { RouteProp, useRoute } from "@react-navigation/native";
import { fetcher } from "../utils/config";
import { Box, Text, Theme } from "../theme";
import { useTheme } from "@shopify/restyle";
import { ICourse } from "../types";
import { MainStackParamList } from "../navigation/types";
import { Divider, Loader, NavigateBack, SafeAreaWrapper } from "../components";
import { Rating } from "@kolking/react-native-rating";
import { Table, Row, Rows } from "react-native-reanimated-table";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from "victory-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity, Dimensions, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import useDarkMode from "../store/useDarkMode";

type CourseDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseDetail"
>;

const CourseDetail: React.FC<NativeStackScreenProps<any, "CourseDetail">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const route = useRoute<CourseDetailScreenRouteProp>();
  //preprocessing for table
  const tableResult = [];
  //preprocessing for course reviews
  const overallGradeStore = [0, 0, 0, 0, 0];
  const difficultyStore = [0, 0, 0];
  const generosityStore = [0, 0, 0];
  const hwQuantityStore = [0, 0, 0];
  const testQuantityStore = [0, 0, 0, 0, 0];
  const testTypeStore = [0, 0, 0, 0, 0, 0];
  const teamProjectPresenceStore = [0, 0];
  const quizPresenceStore = [0, 0];
  const attendanceStore = [0, 0, 0, 0, 0];
  //storing for overallEvaluations
  const overallEvaluations: number[] = [];

  const { id } = route.params;

  const { data: course, isLoading: isLoadingCourse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher,
    {
      refreshInterval: 2000,
    }
  );

  const navigateToCourseReview = (overallEvaluations: number[]) => {
    navigate("MainStack", {
      screen: "CourseReview",
      params: { courseIndex: overallEvaluations, id },
    });
  };

  const navigateToWriteReview = () => {
    navigate("MainStack", {
      screen: "WriteReview",
      params: { id },
    });
  };

  const navigateToCourseBulletin = () => {
    navigate("MainStack", {
      screen: "CourseBulletin",
      params: {
        courseSubj: course!.subj,
        courseNumber: course!.crs,
      },
    });
  };

  const openLink = async (index: string) => {
    let baseUrl = "";
    if (index === "degree") {
      baseUrl = "https://it.stonybrook.edu/services/degree-works";
    } else if (index === "classie") {
      baseUrl = `https://classie-evals.stonybrook.edu/?SearchKeyword=${course?.subj}${course?.crs}&SearchTerm=ALL`;
    } else {
      switch (course?.subj) {
        case "AMS":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/ams/";
          break;
        case "ACC":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/bus/";
          break;
        case "BUS":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/bus/";
          break;
        case "CSE":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/cse/";
          break;
        case "ESE":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/ese/";
          break;
        case "EST":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/tsm/";
          break;
        case "EMP":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/tsm/";
          break;
        case "MEC":
          baseUrl =
            "https://www.stonybrook.edu/sb/bulletin/current/academicprograms/mec/";
          break;
      }
    }

    // await Linking.openURL(baseUrl);
    await WebBrowser.openBrowserAsync(baseUrl);
  };

  if (isLoadingCourse) {
    return <Loader />;
  } else {
    // console.log(course);
    //preprocessing for table
    for (let i = 0; i < course!.semesters.length; i++) {
      const temp = [];
      if (course?.semesters[i] === "2022_fall") {
        temp.push(`2022 FA (${course.instructor[i]})`);
      } else if (course?.semesters[i] === "2023_spring") {
        temp.push(`2023 SPR (${course.instructor[i]})`);
      } else if (course?.semesters[i] === "2023_fall") {
        temp.push(`2023 FA (${course.instructor[i]})`);
      } else if (course?.semesters[i] === "2024_spring") {
        temp.push(`2024 SPR (${course.instructor[i]})`);
      }

      temp.push(course?.day.split(", ")[i]);
      temp.push(course?.startTime.split(", ")[i]);
      temp.push(course?.endTime.split(", ")[i]);
      temp.push(course?.room.split(", ")[i]);
      tableResult.unshift(temp);
    }

    //preprocessing for reviews
    for (let j = 0; j < course!.reviews.length; j++) {
      //storing overallEvaluations
      if (course!.reviews[j].overallEvaluation !== "") {
        overallEvaluations.push(j);
      }

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
        case "few":
          hwQuantityStore[2]++;
          break;
      }
      //testQuantity
      switch (course!.reviews[j].testQuantity) {
        case "4":
        case "morethan4":
          testQuantityStore[0]++;
          break;
        case "3":
        case "three":
          testQuantityStore[1]++;
          break;
        case "2":
        case "two":
          testQuantityStore[2]++;
          break;
        case "1":
        case "one":
          testQuantityStore[3]++;
          break;
        case "0":
        case "none":
          testQuantityStore[4]++;
          break;
      }
      //new test type
      switch (course!.reviews[j].testType) {
        case "mid3final1":
          testTypeStore[0]++;
          break;
        case "mid2final1":
          testTypeStore[1]++;
          break;
        case "mid1final1":
          testTypeStore[2]++;
          break;
        case "only final":
          testTypeStore[3]++;
          break;
        case "only midterm":
          testTypeStore[4]++;
          break;
        case "none":
          testTypeStore[5]++;
          break;
      }
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <NavigateBack />
            <Text variant="textXl" fontWeight="600" mr="10" color="textColor">
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
            <Text variant="textBase" color="textColor">
              Course Title: {course?.courseTitle}
            </Text>
            <Text variant="textBase" color="textColor">
              Instructor:{" "}
              {course?.unique_instructor.includes(",")
                ? course?.unique_instructor.split(", ").join(" & ")
                : course?.unique_instructor}
            </Text>
            <Text variant="textBase" color="textColor">
              Credits: {course?.credits}
            </Text>
            <Text variant="textBase" color="textColor">
              Sbc: {course?.sbc === "NaN" ? "X" : course?.sbc}
            </Text>
            <Box height={16} />

            <Table
              borderStyle={{
                borderWidth: 2,
                borderColor: theme.colors.iconBlue,
              }}
            >
              <Row
                data={["Semester", "Day", "Start", "End", "Location"]}
                style={{
                  height: 40,
                  backgroundColor: theme.colors.textColor,
                }}
                textStyle={{ margin: 6, color: theme.colors.mainBgColor }}
              />
              <Rows
                data={tableResult}
                textStyle={{ margin: 6, color: theme.colors.textColor }}
              />
            </Table>
            <Box height={16} />

            <TouchableOpacity onPress={() => navigateToCourseBulletin()}>
              <Box
                bg="iconBlue"
                p="3"
                borderRadius="rounded-2xl"
                flexDirection="row"
                alignItems="center"
              >
                <Image
                  source={require("../assets/images/woolfie.png")}
                  style={{ width: 36, height: 24 }}
                />
                <Text
                  variant="textBase"
                  fontWeight="600"
                  ml="2"
                  color="textColor"
                >
                  Go to Course Bulletin Board
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box height={16} />

          <Box
            borderRadius="rounded-xl"
            borderWidth={1}
            borderColor={"gray550"}
            p={"3"}
          >
            <Box flexDirection="row" alignItems="center">
              <Text variant="text3Xl" color="textColor">
                {course?.avgGrade ? course?.avgGrade.toFixed(2) : 0}
              </Text>
              <Box width={8} />
              {course?.avgGrade ? (
                <Rating rating={Number(course.avgGrade.toFixed(2))} disabled />
              ) : (
                <Rating rating={0} disabled />
              )}
              <Box width={8} />
              <Text color="textColor">
                {course?.avgGrade
                  ? "(" + course?.reviews.length + "개)"
                  : "(0개)"}
              </Text>
            </Box>
            {overallGradeStore.toString() !== "0,0,0,0,0" ? (
              <Box ml="1" mt="-6">
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={{ y: 45, x: 20 }}
                  height={250}
                  width={400}
                >
                  <VictoryAxis
                    crossAxis
                    style={{
                      ticks: { stroke: "grey", size: 5 },
                      tickLabels: {
                        fontSize: 15,
                        padding: 5,
                        fill: theme.colors.textColor,
                      },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      ticks: { stroke: "grey", size: 5 },
                      tickLabels: {
                        fontSize: 15,
                        padding: 5,
                        fill: theme.colors.textColor,
                      },
                    }}
                  />
                  <VictoryBar
                    horizontal
                    data={[
                      { x: "5", y: overallGradeStore[4] },
                      { x: "4", y: overallGradeStore[3] },
                      { x: "3", y: overallGradeStore[2] },
                      { x: "2", y: overallGradeStore[1] },
                      { x: "1", y: overallGradeStore[0] },
                    ]}
                    categories={{ x: ["5", "4", "3", "2", "1"] }}
                    barWidth={20}
                    animate={{
                      duration: 2000,
                      onLoad: { duration: 1000 },
                    }}
                    style={{
                      data: { fill: theme.colors.ratingYellow },
                    }}
                    cornerRadius={{ top: 8 }}
                  />
                </VictoryChart>
              </Box>
            ) : (
              <Box height={"4%"} />
            )}

            <Box>
              <Text variant="textLg" color="textColor">
                수업 내용 난이도
              </Text>
              {difficultyStore.toString() !== "0,0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 30 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                점수 너그러운 정도
              </Text>
              {generosityStore.toString() !== "0,0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 30 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "너그러움", y: generosityStore[0] },
                        { x: "보통", y: generosityStore[1] },
                        { x: "까다로움", y: generosityStore[2] },
                      ]}
                      categories={{ x: ["까다로움", "보통", "너그러움"] }}
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                과제량
              </Text>
              {hwQuantityStore.toString() !== "0,0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 30 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "많음", y: hwQuantityStore[0] },
                        { x: "보통", y: hwQuantityStore[1] },
                        { x: "적음", y: hwQuantityStore[2] },
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                시험 수
              </Text>
              {testQuantityStore.toString() !== "0,0,0,0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 20 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "4+", y: testQuantityStore[0] },
                        { x: "3", y: testQuantityStore[1] },
                        { x: "2", y: testQuantityStore[2] },
                        { x: "1", y: testQuantityStore[3] },
                        { x: "없음", y: testQuantityStore[4] },
                      ]}
                      categories={{ x: ["없음", "1", "2", "3", "4+"] }}
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                시험 종류
              </Text>
              {testTypeStore.toString() !== "0,0,0,0,0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 20 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "mid3final1", y: testTypeStore[0] },
                        { x: "mid2final1", y: testTypeStore[1] },
                        { x: "mid1final1", y: testTypeStore[2] },
                        { x: "only final", y: testTypeStore[3] },
                        { x: "only midterm", y: testTypeStore[4] },
                        { x: "none", y: testTypeStore[5] },
                      ]}
                      categories={{
                        x: [
                          "none",
                          "only midterm",
                          "only final",
                          "mid1final1",
                          "mid2final1",
                          "mid3final1",
                        ],
                      }}
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                팀플 유무
              </Text>
              {teamProjectPresenceStore.toString() !== "0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 50 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "있음", y: teamProjectPresenceStore[0] },
                        { x: "없음", y: teamProjectPresenceStore[1] },
                      ]}
                      categories={{ x: ["없음", "있음"] }}
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                퀴즈 유무
              </Text>
              {quizPresenceStore.toString() !== "0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 50 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "있음", y: quizPresenceStore[0] },
                        { x: "없음", y: quizPresenceStore[1] },
                      ]}
                      categories={{ x: ["없음", "있음"] }}
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
              ) : (
                <Text ml="2" mt="1" mb="4" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg" color="textColor">
                출석
              </Text>
              {attendanceStore.toString() !== "0,0,0,0,0" ? (
                <Box ml="1" mt="-6">
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ y: 45, x: 30 }}
                    height={250}
                    width={400}
                  >
                    <VictoryAxis
                      crossAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: {
                          fontSize: 15,
                          padding: 5,
                          fill: theme.colors.textColor,
                        },
                      }}
                    />
                    <VictoryBar
                      horizontal
                      data={[
                        { x: "호명", y: attendanceStore[0] },
                        { x: "수기", y: attendanceStore[1] },
                        { x: "QR코드", y: attendanceStore[2] },
                        { x: "구글폼", y: attendanceStore[3] },
                        { x: "없음", y: attendanceStore[4] },
                      ]}
                      categories={{
                        x: ["없음", "구글폼", "QR코드", "수기", "호명"],
                      }}
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
              ) : (
                <Text ml="2" mt="1" color="textColor">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>
            <Box height={30} />
            <Divider />
            <Box height={10} />

            <Box>
              {overallEvaluations.length === 0 && (
                <Text color="textColor">
                  작성된 자세한 수강평이 아직 없습니다 :(
                </Text>
              )}
              {overallEvaluations.length >= 1 && (
                <>
                  <Box mb="2">
                    <Text variant="textLg" color="textColor">
                      더 자세한 수강평
                    </Text>
                  </Box>
                  <Box>
                    <Box flexDirection="row" alignItems="center">
                      <Rating
                        size={22}
                        rating={Number(
                          course!.reviews[overallEvaluations[0]].overallGrade
                        )}
                        disabled
                      />
                      <Box width={10} />
                      <FontAwesome5
                        name="thumbs-up"
                        size={20}
                        color={theme.colors.sbuRed}
                      />
                      <Box width={4} />
                      <Text
                        variant="textLg"
                        style={{
                          color: theme.colors.sbuRed,
                        }}
                      >
                        {course!.reviews[overallEvaluations[0]].likes.length}
                      </Text>
                    </Box>
                    <Box flexDirection="row">
                      <Text
                        mt="1"
                        mb="1"
                        color={
                          isDarkMode?.mode === "dark" ? "gray300" : "gray650"
                        }
                      >
                        {course!.reviews[overallEvaluations[0]].semester ===
                        "-1"
                          ? "?"
                          : course!.reviews[overallEvaluations[0]].semester}
                      </Text>
                      <Box width={6} />
                      <Text
                        mt="1"
                        mb="1"
                        color={
                          isDarkMode?.mode === "dark" ? "gray300" : "gray650"
                        }
                      >
                        {course!.reviews[overallEvaluations[0]].instructor ===
                        "-2"
                          ? "?"
                          : course!.reviews[overallEvaluations[0]].instructor}
                      </Text>
                    </Box>
                    <Text color="textColor">
                      {course!.reviews[overallEvaluations[0]].overallEvaluation}
                    </Text>
                  </Box>
                </>
              )}
              {overallEvaluations.length >= 2 && (
                <>
                  <Box height={15} />
                  <Divider />
                  <Box height={10} />
                  <Box>
                    <Box flexDirection="row" alignItems="center">
                      <Rating
                        size={22}
                        rating={Number(
                          course!.reviews[overallEvaluations[1]].overallGrade
                        )}
                        disabled
                      />
                      <Box width={10} />
                      <FontAwesome5
                        name="thumbs-up"
                        size={20}
                        color={theme.colors.sbuRed}
                      />
                      <Box width={4} />
                      <Text
                        variant="textLg"
                        style={{
                          color: theme.colors.sbuRed,
                        }}
                      >
                        {course!.reviews[overallEvaluations[1]].likes.length}
                      </Text>
                    </Box>
                    <Box flexDirection="row">
                      <Text
                        mt="1"
                        mb="1"
                        color={
                          isDarkMode?.mode === "dark" ? "gray300" : "gray650"
                        }
                      >
                        {course!.reviews[overallEvaluations[0]].semester ===
                        "-1"
                          ? "?"
                          : course!.reviews[overallEvaluations[0]].semester}
                      </Text>
                      <Box width={6} />
                      <Text
                        mt="1"
                        mb="1"
                        color={
                          isDarkMode?.mode === "dark" ? "gray300" : "gray650"
                        }
                      >
                        {course!.reviews[overallEvaluations[0]].instructor ===
                        "-2"
                          ? "?"
                          : course!.reviews[overallEvaluations[0]].instructor}
                      </Text>
                    </Box>
                    <Text color="textColor">
                      {course!.reviews[overallEvaluations[1]].overallEvaluation}
                    </Text>
                  </Box>
                  <Box height={16} />
                  <TouchableOpacity
                    onPress={() => navigateToCourseReview(overallEvaluations)}
                  >
                    <Box
                      style={{
                        backgroundColor: theme.colors.gray300,
                      }}
                      width="auto"
                      height={36}
                      borderRadius="rounded-xl"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontWeight="600">강의평 더 보기</Text>
                    </Box>
                  </TouchableOpacity>
                </>
              )}
            </Box>
          </Box>
          <Box height={16} />

          <Box
            borderRadius="rounded-xl"
            borderWidth={1}
            borderColor={"gray550"}
            p={"3"}
            mb="10"
          >
            <TouchableOpacity onPress={() => openLink("classie")}>
              <Box
                bg="iconBlue"
                p="3"
                borderRadius="rounded-2xl"
                flexDirection="row"
                alignItems="center"
              >
                <Image
                  source={require("../assets/images/woolfie.png")}
                  style={{ width: 36, height: 24 }}
                />
                <Text
                  variant="textBase"
                  fontWeight="600"
                  ml="2"
                  color="textColor"
                >
                  Go to Classie Eval
                </Text>
              </Box>
            </TouchableOpacity>
            <Box height={24} />

            <TouchableOpacity onPress={() => openLink("bulletin")}>
              <Box
                bg="sbuRed"
                p="3"
                borderRadius="rounded-2xl"
                flexDirection="row"
                alignItems="center"
              >
                <Image
                  source={require("../assets/images/woolfie.png")}
                  style={{ width: 36, height: 24 }}
                />
                <Text
                  variant="textBase"
                  fontWeight="600"
                  ml="2"
                  color="textColor"
                >
                  Go to {course?.subj.toUpperCase()} Bulletin
                </Text>
              </Box>
            </TouchableOpacity>
            <Box height={24} />

            <TouchableOpacity onPress={() => openLink("degree")}>
              <Box
                bg="iconBlue"
                p="3"
                borderRadius="rounded-2xl"
                flexDirection="row"
                alignItems="center"
              >
                <Image
                  source={require("../assets/images/woolfie.png")}
                  style={{ width: 36, height: 24 }}
                />
                <Text
                  variant="textBase"
                  fontWeight="600"
                  ml="2"
                  color="textColor"
                >
                  Go to Degree Works
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
        <TouchableOpacity onPress={navigateToWriteReview}>
          <Box
            flexDirection="row"
            alignItems="center"
            position="absolute"
            right={windowWidth * 0.005}
            bottom={windowHeight * 0.88}
            style={{ backgroundColor: theme.colors.sbuRed }}
            p="2"
            borderRadius="rounded-2xl"
          >
            <MaterialCommunityIcons
              name="pencil-plus-outline"
              size={24}
              color={theme.colors.white}
            />
            <Box width={6} />
            <Text
              fontWeight="700"
              style={{
                color: theme.colors.white,
              }}
            >
              평가하기
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </SafeAreaWrapper>
  );
};

export default CourseDetail;
