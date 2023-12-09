import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import useSWR from "swr";
import useGlobalToggle from "../../store/useGlobalToggle";
import useUserGlobalStore from "../../store/useUserGlobal";
import { Box, Text } from "../../theme";
import { fetcher } from "../../utils/config";

const getCourseRequest = async (url: string, currentCourse: string) => {
  try {
    return await fetcher(url + "/" + currentCourse);
  } catch (error) {
    console.log("error in getCourseRequest", error);
    throw error;
  }
};

const EasyPick = () => {
  const { user } = useUserGlobalStore();
  const { toggleInfo } = useGlobalToggle();

  const { data: course, mutate } = useSWR(
    user &&
      toggleInfo &&
      `/api/v1/course/${user.classHistory[toggleInfo.currentTableView]}`,
    fetcher
  );

  useEffect(() => {
    user!.classHistory[toggleInfo!.currentTableView].forEach(
      (currentCourse) => {
        getCourseRequest("/api/v1/course", currentCourse).then((data) =>
          mutate(data, false)
        ); // Mutate SWR cache
      }
    );
  }, []);

  return (
    <Box flex={1}>
      <ScrollView>
        <Text>{toggleInfo?.currentTableView}</Text>
        <Text>{course && <Text>{JSON.stringify(course._id)}</Text>}</Text>
      </ScrollView>
    </Box>
  );
};

export default EasyPick;
