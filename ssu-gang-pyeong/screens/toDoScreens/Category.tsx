import React, { useState, useCallback } from "react";
import { Loader, NavigateBack, SafeAreaWrapper } from "../../components";
import { Task, TaskActions } from "../../components/tasks";
import { ToDoStackParamList } from "../../navigation/types";
import { fetcher } from "../../utils/config";
import { ICategory, ITask } from "../../types";
import { Box, Text, Theme } from "../../theme";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlatList, RefreshControl } from "react-native";
import useSWR from "swr";
import { useTheme } from "@shopify/restyle";

type CategoryScreenRouteProp = RouteProp<ToDoStackParamList, "Category">;

const Category = () => {
  const theme = useTheme<Theme>();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  }, []);

  const route = useRoute<CategoryScreenRouteProp>();

  const { id } = route.params;

  const {
    data: category,
    isLoading: isLoadingCategory,
    mutate,
  } = useSWR<ICategory>(`/api/v1/todocategory/${id}`, fetcher);

  // console.log(`category`, JSON.stringify(category, null, 2));

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
      <Box height={16} />
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
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.sbuRed]} // For Android
              tintColor={theme.colors.sbuRed} // For iOS
            />
          }
        />
      </Box>
    </SafeAreaWrapper>
  );
};

export default Category;
