import React from "react";
import { ToDoScreenNavigationType } from "../../navigation/types";
import axiosInstance from "../../utils/config";
import { ITask } from "../../types";
import { AnimatedBox, Box, Text, Theme } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, useColorScheme } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import useSWRMutation from "swr/mutation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import useDarkMode from "../../store/useDarkMode";

type TaskProps = {
  task: ITask;
  date?: string;
  mutateTasks?: () => Promise<ITask[] | undefined>;
  updateTaskStatus?: () => Promise<ITask[] | undefined>;
};

interface ITaskStatusRequest {
  id: string;
  isCompleted: boolean;
}

const toggleTaskStatusRequest = async (
  url: string,
  { arg }: { arg: ITaskStatusRequest }
) => {
  try {
    await axiosInstance.put(url + "/" + arg.id, {
      ...arg,
    });
  } catch (error) {
    console.log("error in toggleTaskStatusRequest", error);
    throw error;
  }
};

const deleteTaskRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id);
  } catch (error) {}
};

const Task = ({ task, mutateTasks, updateTaskStatus, date }: TaskProps) => {
  const offset = useSharedValue(1);
  const checkmarkIconSize = useSharedValue(0.8);

  const navigation = useNavigation<ToDoScreenNavigationType>();

  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const { trigger, isMutating: isUpdating } = useSWRMutation(
    "api/v1/todotask/update",
    toggleTaskStatusRequest
  );

  const { trigger: triggerDelete } = useSWRMutation(
    "api/v1/todotask/",
    deleteTaskRequest
  );

  const toggleTaskStatus = async () => {
    try {
      const _updatedTask = {
        id: task._id,
        isCompleted: !task.isCompleted,
      };
      await trigger(_updatedTask);

      if (!_updatedTask.isCompleted) {
        offset.value = 1;
        checkmarkIconSize.value = 0;
      } else {
        offset.value = 1.1;
        checkmarkIconSize.value = 1;
      }
      if (mutateTasks) {
        await mutateTasks();
      }
      if (updateTaskStatus) {
        await updateTaskStatus();
      }
    } catch (error) {
      console.log("error in toggleTaskStatus", error);
      throw error;
    }
  };

  const deleteTask = async () => {
    try {
      await triggerDelete({
        id: task._id,
      });
      if (updateTaskStatus) {
        await updateTaskStatus();
      }
    } catch (error) {
      console.log("error in deleteTask", error);
      throw error;
    }
  };

  const navigateToEditTask = () => {
    navigation.navigate("EditTask", {
      task,
      date,
    });
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(offset.value) }],
    };
  });

  const checkMarkIconStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(checkmarkIconSize.value) }],
      opacity: task.isCompleted ? offset.value : 0,
    };
  });

  return (
    <AnimatedBox>
      <Box
        p="4"
        bg="lightGray"
        borderRadius="rounded-5xl"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box flexDirection="row" alignItems="center" flex={1}>
          <TouchableOpacity onPress={toggleTaskStatus}>
            <AnimatedBox
              style={[animatedStyles]}
              flexDirection="row"
              alignItems="center"
            >
              <Box
                height={26}
                width={26}
                bg={task.isCompleted ? "iconBlue" : "gray300"}
                borderRadius="rounded-xl"
                alignItems="center"
                justifyContent="center"
              >
                {task.isCompleted && (
                  <AnimatedBox style={[checkMarkIconStyles]}>
                    <Ionicons name="ios-checkmark" size={20} color="white" />
                  </AnimatedBox>
                )}
              </Box>
            </AnimatedBox>
          </TouchableOpacity>

          <Text
            ml="3"
            variant="textLg"
            style={{
              color: task.categoryColor,
            }}
          >
            {task.categoryName}:
          </Text>
          <Text
            variant="textBase"
            style={{
              flexShrink: 1,
            }}
            ml="2"
          >
            {task.name}
          </Text>
        </Box>

        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={navigateToEditTask}>
            <Box mr="3">
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
                color={theme.colors.stBlack}
              />
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteTask}>
            <FontAwesome5 name="trash" size={26} color={theme.colors.stBlack} />
          </TouchableOpacity>
        </Box>
      </Box>
    </AnimatedBox>
  );
};

export default Task;
