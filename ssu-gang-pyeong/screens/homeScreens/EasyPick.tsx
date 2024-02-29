import React from "react";
import { TouchableOpacity, useColorScheme, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useSWR from "swr";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider } from "../../components";
import useGlobalToggle from "../../store/useGlobalToggle";
import { Box, Text, Theme } from "../../theme";
import { ICourse, IGlobalToggle, IPSDeleteRequest } from "../../types";
import axiosInstance, { fetcher } from "../../utils/config";
import { useTheme } from "@shopify/restyle";
import { useNavigation } from "@react-navigation/native";
import {
  HomeScreenNavigationType,
  MainStackNavigationType,
} from "../../navigation/types";
import useSWRMutation from "swr/mutation";
import useDarkMode from "../../store/useDarkMode";
import useUserGlobalStore from "../../store/useUserGlobal";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";

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

const deletePSRequest = async (
  url: string,
  { arg }: { arg: IPSDeleteRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in deletePSRequest", error);
    throw error;
  }
};

const EasyPick = ({ togglePicker }: { togglePicker?: () => void }) => {
  const navigation = useNavigation<MainStackNavigationType>();
  const homeScreenNavigation = useNavigation<HomeScreenNavigationType>();

  const { toggleInfo } = useGlobalToggle();

  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const { user, updateUser } = useUserGlobalStore();

  const navigateToCourseDetail = (courseId: string) => {
    navigation.navigate("MainStack", {
      screen: "CourseDetail",
      params: { id: courseId },
    });
  };

  const navigateToPersonalSchedule = () => {
    homeScreenNavigation.navigate("PersonalSchedule", {});
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

  const { trigger: deleteTrigger } = useSWRMutation(
    "api/v1/ps/delete",
    deletePSRequest
  );

  const deletePS = async (index: string) => {
    try {
      const updatedPersonalSchedule = user!.personalSchedule.filter(
        (course) => course.courseId !== index
      );
      await deleteTrigger({
        courseId: index,
      });
      // console.log("updatedPersonalSchedule", updatedPersonalSchedule);
      updateUser({ ...user!, personalSchedule: updatedPersonalSchedule });
    } catch (error) {
      console.log("error in deleteTable", error);
      throw error;
    }
  };

  return (
    <Box flex={1}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mt="2"
      >
        <Text variant="text2Xl" fontWeight="700" color="textColor">
          Table Name: {toggleInfo?.currentTableView}
        </Text>

        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={navigateToPersonalSchedule}>
            <Box
              style={{
                backgroundColor: theme.colors.sbuRed,
              }}
              p="2"
              px="3"
              mr="3"
              borderRadius="rounded-4xl"
            >
              <Text
                variant="textBase"
                fontWeight="600"
                style={{ color: "white" }}
              >
                직접 추가
              </Text>
            </Box>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => togglePicker!()}>
            <Box mr="2">
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
      </Box>
      <Box height={12} />
      {courses?.takingCourses.length === 0 &&
      user?.personalSchedule.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="textColor" fontWeight="600" fontSize={20}>
            No registered courses yet :(
          </Text>
        </Box>
      ) : (
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
          {user?.personalSchedule.length !== 0 &&
            user?.personalSchedule
              .filter((item) => item.table === toggleInfo?.currentTableView)
              .map((courseItem, courseIndex) => (
                <Box key={courseIndex}>
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb="5"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Text variant="textXl" fontWeight="600" color="textColor">
                        {courses!.takingCourses.length + courseIndex + 1}.{" "}
                      </Text>
                      <Text variant="textXl" fontWeight="600" color="textColor">
                        {courseItem.courseId}
                      </Text>
                    </Box>
                    <Box mr="4" flexDirection="row" alignItems="center">
                      <TouchableOpacity onPress={() => {}}>
                        <MaterialCommunityIcons
                          name={
                            isDarkMode?.mode === "system"
                              ? systemIsDark
                                ? "pencil-circle-outline"
                                : "pencil-circle"
                              : isDarkMode?.mode === "dark"
                              ? "pencil-circle-outline"
                              : "pencil-circle"
                          }
                          size={36}
                          color={theme.colors.textColor}
                        />
                      </TouchableOpacity>
                      <Box width={12} />
                      <TouchableOpacity
                        onPress={() => deletePS(courseItem.courseId)}
                      >
                        <FontAwesome5
                          name="trash"
                          size={24}
                          color={theme.colors.textColor}
                        />
                      </TouchableOpacity>
                    </Box>
                  </Box>
                  <Box mb="4">
                    <Divider />
                  </Box>
                </Box>
              ))}
          <Box height={WINDOW_HEIGHT * 0.08} />
        </ScrollView>
      )}
    </Box>
  );
};

export default EasyPick;
