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
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type CourseDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseDetail"
>;

const CourseDetail: React.FC<NativeStackScreenProps<any, "CourseDetail">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();
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
  const teamProjectPresenceStore = [0, 0];
  const quizPresenceStore = [0, 0];
  const attendanceStore = [0, 0, 0, 0, 0];
  //storing for overallEvaluations
  const overallEvaluations: number[] = [];

  const { id } = route.params;

  const { data: course, isLoading: isLoadingCourse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher
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
    });
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
          testQuantityStore[0]++;
          break;
        case "3":
          testQuantityStore[1]++;
          break;
        case "2":
          testQuantityStore[2]++;
          break;
        case "1":
          testQuantityStore[3]++;
          break;
        case "0":
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
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <Box ml="1" mt="-6">
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ y: 45, x: 20 }}
                height={250}
                width={400}
              >
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

            <Box>
              <Text variant="textLg">수업 내용 난이도</Text>
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

            <Box>
              <Text variant="textLg">점수 너그러운 정도</Text>

              {generosityStore === [0, 0, 0] ? (
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
                <Text ml="2" mt="1" mb="4">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>

            <Box>
              <Text variant="textLg">과제량</Text>
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
            </Box>

            <Box>
              <Text variant="textLg">시험 수</Text>
              <Box ml="1" mt="-6">
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={{ y: 45, x: 20 }}
                  height={250}
                  width={400}
                >
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
            </Box>

            <Box>
              <Text variant="textLg">팀플 유무</Text>
              <Box ml="1" mt="-6">
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={{ y: 45, x: 50 }}
                  height={250}
                  width={400}
                >
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
            </Box>

            <Box>
              <Text variant="textLg">퀴즈 유무</Text>
              <Box ml="1" mt="-6">
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={{ y: 45, x: 50 }}
                  height={250}
                  width={400}
                >
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
            </Box>

            <Box>
              <Text variant="textLg">출석</Text>

              {attendanceStore === [0, 0, 0, 0, 0] ? (
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
                        { x: "너그러움", y: attendanceStore[0] },
                        { x: "보통", y: attendanceStore[1] },
                        { x: "까다로움", y: attendanceStore[2] },
                        { x: "보통", y: attendanceStore[1] },
                        { x: "까다로움", y: attendanceStore[2] },
                      ]}
                      categories={{
                        x: ["까다로움", "보통", "너그러움", "보통", "너그러움"],
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
                <Text ml="2" mt="1">
                  아직 관련 데이터가 없습니다 :(
                </Text>
              )}
            </Box>
            <Box height={30} />
            <Divider />
            <Box height={10} />

            <Box>
              {overallEvaluations.length === 0 && (
                <Text>작성된 자세한 수강평이 아직 없습니다 :(</Text>
              )}
              {overallEvaluations.length >= 1 && (
                <>
                  <Box mb="2">
                    <Text variant="textLg">더 자세한 수강평</Text>
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
                        style={{
                          color: theme.colors.gray650,
                        }}
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
                        style={{
                          color: theme.colors.gray650,
                        }}
                      >
                        {course!.reviews[overallEvaluations[0]].instructor ===
                        "-2"
                          ? "?"
                          : course!.reviews[overallEvaluations[0]].instructor}
                      </Text>
                    </Box>
                    <Text>
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
                        style={{
                          color: theme.colors.gray650,
                        }}
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
                        style={{
                          color: theme.colors.gray650,
                        }}
                      >
                        {course!.reviews[overallEvaluations[0]].instructor ===
                        "-2"
                          ? "?"
                          : course!.reviews[overallEvaluations[0]].instructor}
                      </Text>
                    </Box>
                    <Text>
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
                      <Text>강의평 더 보기</Text>
                    </Box>
                  </TouchableOpacity>
                </>
              )}
            </Box>
          </Box>
        </ScrollView>
        <TouchableOpacity onPress={navigateToWriteReview}>
          <Box
            flexDirection="row"
            alignItems="center"
            position="absolute"
            right={windowWidth * 0.005}
            bottom={windowHeight * 0.855}
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
