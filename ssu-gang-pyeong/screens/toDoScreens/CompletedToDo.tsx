import React from "react";
import { Loader, NavigateBack, SafeAreaWrapper } from "../../components";
import { Task } from "../../components/tasks";
import { fetcher } from "../../utils/config";
import { ITask } from "../../types";
import { Box, Text } from "../../theme";
import { FlatList } from "react-native";
import useSWR from "swr";

const CompletedToDo = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`api/v1/todotask/completed`, fetcher, {
    refreshInterval: 1000,
  });

  if (isLoadingTasks || !tasks) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box height={16} />
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box flexDirection="row">
          <Text variant="textXl" fontWeight="700" ml="3" color="textColor">
            Completed
          </Text>
        </Box>
        <Box height={16} />

        <FlatList
          data={tasks}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return <Task task={item} mutateTasks={mutateTasks} />;
          }}
          ItemSeparatorComponent={() => <Box height={14} />}
          keyExtractor={(item) => item._id}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

export default CompletedToDo;
