import React from "react";
import useSWR from "swr";
import { RouteProp, useRoute } from "@react-navigation/native";
import { fetcher } from "../utils/config";
import { Box, Text, Theme } from "../theme";
import { useTheme } from "@shopify/restyle";
import { ICourse } from "../types";
import { SafeAreaWrapper, NavigateBack, Loader, Divider } from "../components";
import { MainStackParamList } from "../navigation/types";
import { Rating } from "@kolking/react-native-rating";
import { FontAwesome5 } from "@expo/vector-icons";

type CourseReviewScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseReview"
>;

const CourseReview = () => {
  const theme = useTheme<Theme>();
  const route = useRoute<CourseReviewScreenRouteProp>();
  const { courseIndex, id } = route.params;
  const reviewList = [];

  const { data: course, isLoading: isLoadingCourse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher
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
              <Box flexDirection="row" alignItems="center">
                <Rating
                  size={22}
                  rating={Number(reviewItem.overallGrade)}
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
                  {reviewItem.likes.length}
                </Text>
              </Box>
              <Text
                mt="1"
                mb="1"
                style={{
                  color: theme.colors.gray650,
                }}
              >
                {reviewItem.semester}
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
    </SafeAreaWrapper>
  );
};

export default CourseReview;
