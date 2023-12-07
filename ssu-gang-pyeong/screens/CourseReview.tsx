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
import { TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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

const CourseReview: React.FC<NativeStackScreenProps<any, "CourseReview">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();
  const windowWidth = Dimensions.get("window").width;
  const route = useRoute<CourseReviewScreenRouteProp>();
  const { courseIndex, id } = route.params;
  const reviewList = [];

  const navigateToWriteReview = () => {
    navigate("MainStack", {
      screen: "WriteReview",
    });
  };

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
                <Box flexDirection="row">
                  <Text
                    mt="1"
                    mb="1"
                    style={{
                      color: theme.colors.gray650,
                    }}
                  >
                    {reviewItem.semester === "-1" ? "?" : reviewItem.semester}
                  </Text>
                  <Box width={6} />
                  <Text
                    mt="1"
                    mb="1"
                    style={{
                      color: theme.colors.gray650,
                    }}
                  >
                    {reviewItem.instructor === "-2"
                      ? "?"
                      : reviewItem.instructor}
                  </Text>
                </Box>
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
      <TouchableOpacity onPress={navigateToWriteReview}>
        <Box
          flexDirection="row"
          alignItems="center"
          position="absolute"
          right={windowWidth * 0.4}
          bottom={15}
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
