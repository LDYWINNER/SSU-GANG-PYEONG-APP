import React, { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import axiosInstance, { fetcher } from "../utils/config";
import { Box, Text, Theme } from "../theme";
import { useTheme } from "@shopify/restyle";
import { ICourse } from "../types";
import { SafeAreaWrapper, NavigateBack, Loader, Divider } from "../components";
import { MainStackParamList } from "../navigation/types";
import { Rating } from "@kolking/react-native-rating";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import {
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useDarkMode from "../store/useDarkMode";

type CourseReviewScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseReview"
>;

const reportCourseReviewRequest = async (
  url: string,
  { arg }: { arg: { reviewId: string } }
) => {
  try {
    await axiosInstance.post(url + "/" + arg.reviewId);
  } catch (error) {
    console.log("error in reportCourseReviewRequest", error);
    throw error;
  }
};

const likeReviewRequest = async (
  url: string,
  { arg }: { arg: { reviewId: string } }
) => {
  try {
    await axiosInstance.patch(url + "/" + arg.reviewId);
  } catch (error) {
    console.log("error in likeReviewRequest", error);
    throw error;
  }
};

const CourseReview: React.FC<NativeStackScreenProps<any, "CourseReview">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const route = useRoute<CourseReviewScreenRouteProp>();
  const { courseIndex, id } = route.params;
  const reviewList = [];

  const isFocused = useIsFocused();

  const navigateToWriteReview = () => {
    navigate("MainStack", {
      screen: "WriteReview",
    });
  };

  const { trigger } = useSWRMutation(
    "/api/v1/course/review",
    likeReviewRequest
  );

  const {
    data: course,
    isLoading: isLoadingCourse,
    mutate,
  } = useSWR<ICourse>(`/api/v1/course/${id}`, fetcher);

  const { trigger: reportCourseReviewTrigger } = useSWRMutation(
    `api/v1/course/report`,
    reportCourseReviewRequest
  );

  const reportCourseReview = async (reviewId: string) => {
    try {
      const _reportCourseReviewReq = {
        reviewId,
      };
      await reportCourseReviewTrigger(_reportCourseReviewReq);
    } catch (error) {
      console.log("error in reportCourseReview", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isFocused) {
      mutate();
    }
  }, [isFocused]);

  if (isLoadingCourse) {
    return <Loader />;
  } else {
    for (let i = 0; i < courseIndex.length; i++) {
      reviewList.push(course!.reviews[courseIndex[i]]);
    }
  }

  return (
    <SafeAreaWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box flex={1} mx="4">
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

          {reviewList.map((reviewItem) => {
            return (
              <Box key={reviewItem._id}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Rating
                    size={22}
                    rating={Number(reviewItem.overallGrade)}
                    disabled
                  />
                  <Box flexDirection="row" alignItems="center">
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "신고",
                          "해당 수강평이 부적절하다고 판단하시나요? 수강평을 신고하면 24시간 내에 검토되며, 부적절하다고 판단되면 해당 수강평은 해당 기간내에 삭제될 것입니다. 해당 작성자에 대해서도 조취를 취하게 됩니다.",
                          [
                            { text: "취소", onPress: () => {} },
                            {
                              text: "확인",
                              onPress: () => reportCourseReview(reviewItem._id),
                            },
                          ]
                        );
                      }}
                    >
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        borderRadius="rounded-xl"
                        backgroundColor="gray300"
                        p="1.5"
                        mr="2"
                      >
                        <Octicons
                          name="report"
                          size={20}
                          color={theme.colors.sbuRed}
                        />
                        <Box width={6} />
                        <Text
                          variant="textBase"
                          fontWeight="600"
                          style={{
                            color: theme.colors.sbuRed,
                          }}
                        >
                          신고
                        </Text>
                      </Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        trigger({
                          reviewId: reviewItem._id,
                        })
                      }
                    >
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        borderRadius="rounded-xl"
                        backgroundColor="gray300"
                        p="1"
                      >
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
                          {reviewItem.likes.length}
                        </Text>
                        <Box width={6} />
                        <Text
                          variant="textBase"
                          fontWeight="600"
                          style={{
                            color: theme.colors.sbuRed,
                          }}
                        >
                          추천
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>

                <Box flexDirection="row">
                  <Text
                    mt="1"
                    mb="1"
                    color={
                      isDarkMode?.mode === "system"
                        ? systemIsDark
                          ? "gray300"
                          : "gray650"
                        : isDarkMode?.mode === "dark"
                        ? "gray300"
                        : "gray650"
                    }
                  >
                    {reviewItem.semester === "-1" ? "?" : reviewItem.semester}
                  </Text>
                  <Box width={6} />
                  <Text
                    mt="1"
                    mb="1"
                    color={
                      isDarkMode?.mode === "system"
                        ? systemIsDark
                          ? "gray300"
                          : "gray650"
                        : isDarkMode?.mode === "dark"
                        ? "gray300"
                        : "gray650"
                    }
                  >
                    {reviewItem.instructor === "-2"
                      ? "?"
                      : reviewItem.instructor}
                  </Text>
                </Box>
                <Text color="textColor">{reviewItem.overallEvaluation}</Text>
                {reviewList.length >= 2 && (
                  <>
                    <Box height={16} />
                    <Divider />
                    <Box height={16} />
                  </>
                )}
              </Box>
            );
          })}
        </Box>
        <Box height={windowHeight * 0.1} />
      </ScrollView>

      <TouchableOpacity onPress={navigateToWriteReview}>
        <Box
          flexDirection="row"
          alignItems="center"
          position="absolute"
          right={windowWidth * 0.4}
          bottom={windowHeight * 0.04}
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
    </SafeAreaWrapper>
  );
};

export default CourseReview;
