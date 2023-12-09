import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useSWR from "swr";
import colors from "../../colors";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "../../components";
import useGlobalToggle from "../../store/useGlobalToggle";
import { Box, Text, Theme } from "../../theme";
import { ICourse } from "../../types";
import { fetcher } from "../../utils/config";
import { useTheme } from "@shopify/restyle";
import { useNavigation } from "@react-navigation/native";
import { MainStackNavigationType } from "../../navigation/types";

const EasyPick = () => {
  const navigation = useNavigation<MainStackNavigationType>();
  const { toggleInfo } = useGlobalToggle();
  const theme = useTheme<Theme>();
  const isDark = useColorScheme() === "dark";
  const color = isDark ? "white" : colors.BLACK_COLOR;

  const navigateToCourseDetail = (courseId: string) => {
    navigation.navigate("MainStack", {
      screen: "CourseDetail",
      params: { id: courseId },
    });
  };

  const { data: courses, isLoading: isLoadingCourses } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher);

  if (isLoadingCourses) {
    return <Loader />;
  }
  return (
    <Box flex={1}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="text2Xl" fontWeight="700" mt="3">
          Table Name: {toggleInfo?.currentTableView}
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Box mr="2" mt="2">
            <Ionicons
              name={isDark ? "add-circle-outline" : "add-circle"}
              color={color}
              size={35}
            />
          </Box>
        </TouchableOpacity>
      </Box>
      <Box height={12} />
      <ScrollView>
        {courses!.takingCourses.map((courseItem, courseIndex) => (
          <Box key={courseItem._id}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box flexDirection="row">
                <Text variant="textXl" fontWeight="600">
                  {courseIndex + 1}.{" "}
                </Text>
                <Text variant="textXl" fontWeight="600">
                  {courseItem.subj} {courseItem.crs}
                </Text>
              </Box>
              <Box mr="6">
                <Text>credits: {courseItem.credits}</Text>
              </Box>
            </Box>
            <Box
              ml="5"
              mb="4"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box>
                {courseItem.unique_instructor.includes(",") ? (
                  courseItem.unique_instructor
                    .split(", ")
                    .map((prof, index) => (
                      <Text key={index} variant="textBase">
                        {prof}
                      </Text>
                    ))
                ) : (
                  <Text variant="textBase">{courseItem.unique_instructor}</Text>
                )}
              </Box>
              <Box alignSelf="flex-end">
                <TouchableOpacity
                  onPress={() => navigateToCourseDetail(courseItem._id)}
                >
                  <Text
                    variant="textBase"
                    fontWeight="600"
                    style={{
                      color: theme.colors.blu700,
                    }}
                  >
                    수업 정보 보러가기 →
                  </Text>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
};

export default EasyPick;
