import React from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { RouteProp, useRoute } from "@react-navigation/native";
import axiosInstance, { fetcher } from "../utils/config";
import { Box, Text, Theme } from "../theme";
import { useTheme } from "@shopify/restyle";
import { ICourse } from "../types";
import { SafeAreaWrapper, NavigateBack, Loader, Divider } from "../components";
import { MainStackParamList } from "../navigation/types";
import { Rating } from "@kolking/react-native-rating";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

type CourseReviewScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseReview"
>;

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

const CourseReview = () => {
  const theme = useTheme<Theme>();
  const route = useRoute<CourseReviewScreenRouteProp>();
  const { courseIndex, id } = route.params;
  const reviewList = [];

  const { trigger } = useSWRMutation(
    "/api/v1/course/review",
    likeReviewRequest
  );

  const { data: course, isLoading: isLoadingCourse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher,
    {
      refreshInterval: 100,
    }
  );

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
            <Text variant="textXl" fontWeight="600" mr="10">
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
                      style={{
                        backgroundColor: theme.colors.gray300,
                      }}
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
                <Text
                  mt="1"
                  mb="1"
                  style={{
                    color: theme.colors.gray650,
                  }}
                >
                  {reviewItem.semester === "-1" ? "?" : reviewItem.semester}
                </Text>
                <Text>{reviewItem.overallEvaluation}</Text>
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
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CourseReview;
