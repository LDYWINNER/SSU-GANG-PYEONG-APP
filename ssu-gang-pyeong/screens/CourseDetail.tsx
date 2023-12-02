import React from "react";
import useSWR from "swr";
import { RouteProp, useRoute } from "@react-navigation/native";
import axiosInstance, { fetcher } from "../utils/config";
import { Box, Text } from "../theme";
import { ICourse } from "../types";
import { MainStackParamList } from "../navigation/types";

type CourseDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseDetail"
>;

const CourseDetail = () => {
  const route = useRoute<CourseDetailScreenRouteProp>();

  const { id } = route.params;

  const { data: coures, isLoading: isLoadingCouse } = useSWR<ICourse>(
    `/api/v1/course/${id}`,
    fetcher
  );

  return (
    <Box>
      <Text>CourseDetail</Text>
    </Box>
  );
};

export default CourseDetail;
