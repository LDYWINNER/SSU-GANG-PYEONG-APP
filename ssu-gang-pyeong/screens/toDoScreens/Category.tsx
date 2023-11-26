import React, { useEffect } from "react";
import { Loader, NavigateBack, SafeAreaWrapper } from "../../components";
import { Task, TaskActions } from "../../components/tasks";
import { ToDoStackParamList } from "../../navigation/types";
import axiosInstance, { fetcher } from "../../utils/config";
import { ICategory, ITask } from "../../types";
import { Box, Text } from "../../theme";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native";
import useSWR from "swr";

type CategoryScreenRouteProp = RouteProp<ToDoStackParamList, "Category">;

const Category = () => {
  const route = useRoute<CategoryScreenRouteProp>();

  const { id } = route.params;

  const { data: category, isLoading: isLoadingCategory } = useSWR<ICategory>(
    `/api/v1/todocategory/${id}`,
    fetcher
  );

  console.log(`category`, JSON.stringify(category, null, 2));

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`api/v1/todotask/tasks-by-categories/${id}`, fetcher, {
    refreshInterval: 1000,
  });

  if (isLoadingTasks || isLoadingCategory || !category || !tasks) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box flexDirection="row">
          <Text variant="textXl" fontWeight="700">
            {category.icon.symbol}
          </Text>
          <Text
            variant="textXl"
            fontWeight="700"
            ml="3"
            style={{
              color: category.color.code,
            }}
          >
            {category.name}
          </Text>
        </Box>
        <Box height={16} />
        <TaskActions categoryId={id} />
        <Box height={16} />

        <FlatList
          data={tasks}
          renderItem={({ item, index }) => {
            return <Task task={item} mutateTasks={mutateTasks} />;
          }}
          ItemSeparatorComponent={() => <Box height={14} />}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

export default Category;
