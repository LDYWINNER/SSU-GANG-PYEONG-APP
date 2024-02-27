import React from "react";
import { TouchableOpacity, useColorScheme, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useSWR from "swr";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider } from "../../components";
import useGlobalToggle from "../../store/useGlobalToggle";
import { Box, Text, Theme } from "../../theme";
import { ICourse, IGlobalToggle } from "../../types";
import axiosInstance, { fetcher } from "../../utils/config";
import { useTheme } from "@shopify/restyle";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  HomeStackParamList,
  MainStackNavigationType,
} from "../../navigation/types";
import useSWRMutation from "swr/mutation";
import useDarkMode from "../../store/useDarkMode";

type EasyPickScreenRouteProp = RouteProp<HomeStackParamList, "EasyPick">;

interface ITVAuthRequest {
  tableName: IGlobalToggle;
  courseId: string;
}

const deleteTVCourseRequest = async (
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

const EasyPick = () => {
  const navigation = useNavigation<MainStackNavigationType>();
  const route = useRoute<EasyPickScreenRouteProp>();
  const { togglePicker } = route.params;
  const { toggleInfo } = useGlobalToggle();

  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const navigateToCourseDetail = (courseId: string) => {
    navigation.navigate("MainStack", {
      screen: "CourseDetail",
      params: { id: courseId },
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await mutate();
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const { data: courses, mutate } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher);

  const { trigger: deleteTVCourse } = useSWRMutation(
    "api/v1/course/deleteTVCourse",
    deleteTVCourseRequest
  );

  return (
    <Box flex={1}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="text2Xl" fontWeight="700" mt="3" color="textColor">
          Table Name: {toggleInfo?.currentTableView}
        </Text>
        <TouchableOpacity onPress={() => togglePicker()}>
          <Box mr="2" mt="2">
            <Ionicons
              name={
                isDarkMode?.mode === "system"
                  ? systemIsDark
                    ? "add-circle-outline"
                    : "add-circle"
                  : isDarkMode?.mode === "dark"
                  ? "add-circle-outline"
                  : "add-circle"
              }
              color={theme.colors.textColor}
              size={35}
            />
          </Box>
        </TouchableOpacity>
      </Box>
      <Box height={12} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.sbuRed]} // For Android
            tintColor={theme.colors.sbuRed} // For iOS
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {courses!.takingCourses.map((courseItem, courseIndex) => (
          <Box key={courseItem._id}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="5"
            >
              <Box flexDirection="row" alignItems="center">
                <Text variant="textXl" fontWeight="600" color="textColor">
                  {courseIndex + 1}.{" "}
                </Text>
                <Text variant="textXl" fontWeight="600" color="textColor">
                  {courseItem.subj} {courseItem.crs}
                </Text>
                <Text
                  ml="2"
                  color="textColor"
                >{`(credits: ${courseItem.credits})`}</Text>
              </Box>
              <Box mr="4">
                <TouchableOpacity
                  onPress={() => {
                    deleteTVCourse({
                      tableName: toggleInfo as IGlobalToggle,
                      courseId: courseItem._id,
                    });
                  }}
                >
                  <FontAwesome5
                    name="trash"
                    size={24}
                    color={theme.colors.textColor}
                  />
                </TouchableOpacity>
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
                      <Text key={index} variant="textBase" color="textColor">
                        {prof}
                      </Text>
                    ))
                ) : (
                  <Text variant="textBase" color="textColor">
                    {courseItem.unique_instructor}
                  </Text>
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
            <Box mb="4">
              <Divider />
            </Box>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
};

export default EasyPick;
