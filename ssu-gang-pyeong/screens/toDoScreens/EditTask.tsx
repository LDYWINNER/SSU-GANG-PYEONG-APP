import { Box, Text, Theme } from "../../theme";
import React, { useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { isEqual, parseISO } from "date-fns";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axiosInstance, { fetcher } from "../../utils/config";
import { ICategory, ITask } from "../../types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Calendar } from "react-native-calendars";
import { ToDoStackParamList } from "../../navigation/types";
import {
  NavigateBack,
  Loader,
  SafeAreaWrapper,
  SmoothButton,
} from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { todaysISODate } from "../../components/tasks/TaskActions";

type EditTaskRouteType = RouteProp<ToDoStackParamList, "EditTask">;

const updateTaskRequest = async (url: string, { arg }: { arg: ITask }) => {
  try {
    await axiosInstance.put(url + "/" + arg._id, {
      ...arg,
    });
  } catch (error) {}
};

const EditTask = () => {
  const theme = useTheme<Theme>();

  const route = useRoute<EditTaskRouteType>();

  const navigation = useNavigation();

  const { trigger } = useSWRMutation("api/v1/todotask/edit", updateTaskRequest);

  const [isSelectingCategory, setIsSelectingCategory] =
    useState<boolean>(false);
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);

  const { task, date } = route.params;

  const [updatedTask, setUpdatedTask] = useState<ITask>(task);

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "api/v1/todocategory/",
    fetcher
  );

  const updateTask = async () => {
    try {
      if (updatedTask.categoryId === "") {
        Alert.alert("Please select a category");
      }

      if (updatedTask.name.length.toString().trim().length > 0) {
        await trigger({ ...updatedTask });
        navigation.goBack();
      }
    } catch (error) {
      console.log("error in updateTask", error);
      throw error;
    }
  };

  const selectedCategory = categories?.find(
    (_category) => _category._id === updatedTask.categoryId
  );

  if (isLoading || !categories) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box width={40} mb="5">
          <NavigateBack />
        </Box>
        <Box
          bg="lightGray"
          px="4"
          py="3.5"
          borderRadius="rounded-5xl"
          flexDirection="row"
          justifyContent="space-between"
          position="relative"
        >
          <TextInput
            placeholder="Create a new task"
            style={{
              paddingVertical: 8,
              paddingHorizontal: 8,
              fontSize: 16,
            }}
            maxLength={36}
            textAlignVertical="center"
            value={updatedTask.name}
            onChangeText={(text) => {
              setUpdatedTask((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
          />
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity
              onPress={() => {
                setIsSelectingDate((prev) => !prev);
                // console.log("start");
                // console.log(parseISO(newTask.date));
                // console.log(new Date(today.setHours(0)));
                // console.log(todaysISODate);
                // console.log(isEqual(parseISO(newTask.date), todaysISODate));
              }}
            >
              <Box
                flexDirection="row"
                alignContent="center"
                bg="white"
                p="2"
                borderRadius="rounded-xl"
              >
                <Text>
                  {isEqual(todaysISODate, parseISO(updatedTask.date))
                    ? "Today"
                    : `${new Date(updatedTask.date).getMonth() + 1}/${
                        new Date(updatedTask.date).getDate() + 1
                      }`}
                </Text>
              </Box>
            </TouchableOpacity>
            <Box width={12} />
            <TouchableOpacity
              onPress={() => {
                setIsSelectingCategory((prev) => !prev);
              }}
            >
              <Box
                bg="white"
                flexDirection="row"
                alignItems="center"
                p="2"
                borderRadius="rounded-xl"
              >
                <Box>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={selectedCategory?.color.code}
                  />
                </Box>
                <Text
                  style={{
                    color: selectedCategory?.color.code,
                  }}
                >
                  {selectedCategory?.name}
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
        {isSelectingCategory && (
          <Box alignItems="flex-end" my="4" justifyContent="flex-end">
            <FlatList
              data={categories}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setUpdatedTask((prev) => {
                        return {
                          ...prev,
                          categoryId: item._id,
                        };
                      });
                      setIsSelectingCategory(false);
                    }}
                  >
                    <Box
                      bg="gray250"
                      p="2"
                      borderTopStartRadius={
                        index === 0 ? "rounded-3xl" : "none"
                      }
                      borderTopEndRadius={index === 0 ? "rounded-3xl" : "none"}
                      borderBottomStartRadius={
                        categories?.length - 1 === index
                          ? "rounded-2xl"
                          : "none"
                      }
                      borderBottomEndRadius={
                        categories?.length - 1 === index
                          ? "rounded-2xl"
                          : "none"
                      }
                    >
                      <Box flexDirection="row">
                        <Text>{item.icon.symbol}</Text>
                        <Text
                          ml="2"
                          fontWeight={
                            updatedTask.categoryId === item._id ? "700" : "400"
                          }
                        >
                          {item.name}
                        </Text>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                );
              }}
            />
          </Box>
        )}
        {isSelectingDate && (
          <Box>
            <Calendar
              theme={{
                calendarBackground: theme.colors.mainBgColor,
                dayTextColor: theme.colors.textColor,
                textDisabledColor: "#444",
                monthTextColor: "#888",
              }}
              onDayPress={(day) => {
                setIsSelectingDate(false);
                const selectedDate = new Date(day.dateString).toISOString();
                setUpdatedTask((prev) => {
                  return {
                    ...prev,
                    date: selectedDate,
                  };
                });
              }}
            />
          </Box>
        )}

        <Box position="absolute" bottom={16} left={0} right={0}>
          <SmoothButton label={"Edit task"} onPress={updateTask} />
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default EditTask;
