import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import useSWR from "swr";
import { Loader } from "../../components";
import useGlobalToggle from "../../store/useGlobalToggle";
import { Box, Text } from "../../theme";
import { ICourse } from "../../types";
import { fetcher } from "../../utils/config";

const EasyPick = () => {
  const { toggleInfo } = useGlobalToggle();

  const { data: courses, isLoading: isLoadingCourses } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher);

  if (isLoadingCourses) {
    return <Loader />;
  }
  return (
    <Box flex={1}>
      <ScrollView>
        <Text>{toggleInfo?.currentTableView}</Text>
        {courses!.takingCourses.map((courseItem) => (
          <Text key={courseItem._id}>{courseItem.crs}</Text>
        ))}
      </ScrollView>
    </Box>
  );
};

export default EasyPick;
