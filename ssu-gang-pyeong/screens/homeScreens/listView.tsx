import * as React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useGlobalToggle from "../../store/useGlobalToggle";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useEffect } from "react";
import { ICourse } from "../../types";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { Loader } from "../../components";
import { useIsFocused } from "@react-navigation/native";
import { Box, Text } from "../../theme";
import { TouchableOpacity } from "react-native";
import { Rating } from "@kolking/react-native-rating";

const ListView: React.FC<NativeStackScreenProps<any, "ListView">> = ({
  navigation,
}) => {
  const { user } = useUserGlobalStore();
  const { toggleInfo, updateToggleInfo } = useGlobalToggle();
  const isFocused = useIsFocused();

  const {
    data: courses,
    isLoading: isLoadingCourses,
    mutate,
  } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher);

  const navigateToCourseDetail = (courseId: string) => {
    navigation.navigate("MainStack", {
      screen: "CourseDetail",
      params: { id: courseId },
    });
  };

  useEffect(() => {
    if (isFocused) {
      updateToggleInfo({
        currentTableView: Object.keys(user!.classHistory)[
          navigation.getState().index
        ],
      });
      // console.log("Current tab:", currentRoute.name);
      mutate();
    }
  }, [isFocused, navigation]);

  if (isLoadingCourses) {
    return <Loader />;
  }
  if (courses?.takingCourses.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text variant="text2Xl" color="textColor">
          No enrolled course yet :(
        </Text>
      </Box>
    );
  }
  return (
    <Box>
      {courses!.takingCourses.map((item, index) => (
        <TouchableOpacity
          key={item._id}
          onPress={() => navigateToCourseDetail(item._id)}
        >
          <Box
            borderRadius="rounded-xl"
            bg={
              item.avgGrade === null
                ? "lightGray"
                : item.avgGrade <= 1
                ? "red200"
                : item.avgGrade <= 2
                ? "amber200"
                : item.avgGrade <= 3
                ? "orange200"
                : item.avgGrade <= 4
                ? "blu200"
                : "green200"
            }
            px="4"
            py="6"
            m="3"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box>
              <Text variant="text2Xl" mb="1">
                {item.subj} {item.crs}
              </Text>
              <Box>
                {courses?.takingCourses[index].unique_instructor.includes(
                  ","
                ) ? (
                  courses?.takingCourses[index].unique_instructor
                    .split(", ")
                    .map((prof, index) => <Text key={index}>{prof}</Text>)
                ) : (
                  <Text>{courses?.takingCourses[index].unique_instructor}</Text>
                )}
              </Box>
            </Box>
            <Box justifyContent="center" alignItems="flex-end">
              <Text mb="1">
                {item.avgGrade ? (
                  <Rating rating={Number(item.avgGrade.toFixed(1))} disabled />
                ) : (
                  <Rating rating={0} disabled />
                )}
              </Text>
              <Text>
                {item.avgGrade ? "(" + item.avgGrade.toFixed(1) + ")" : ""}
              </Text>
            </Box>
          </Box>
        </TouchableOpacity>
      ))}
    </Box>
  );
};

export default ListView;
