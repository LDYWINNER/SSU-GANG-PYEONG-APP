import React, { useState } from "react";
import axiosInstance, { BASE_URL, fetcher } from "../../utils/config";
import { ICategory, ITaskRequest } from "../../types";
import { format, isEqual, parseISO } from "date-fns";
import { FlatList, TouchableOpacity, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Loader } from "../../components";
import { Box, Text } from "../../theme";

type TaskActionsProps = {
  categoryId: string;
};

export const today = new Date();

export const todaysISODate = new Date();
todaysISODate.setHours(-5, 0, 0, 0);

const createTaskRequest = async (
  url: string,
  { arg }: { arg: ITaskRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in createTaskRequest", error);
    throw error;
  }
};

const TaskActions = ({ categoryId }: TaskActionsProps) => {
  const [newTask, setNewTask] = useState<ITaskRequest>({
    categoryId: categoryId,
    date: todaysISODate.toISOString(),
    isCompleted: false,
    name: "",
  });

  const { data, trigger } = useSWRMutation(
    "api/v1/todotask/create",
    createTaskRequest
  );

  const [isSelectingCategory, setIsSelectingCategory] =
    useState<boolean>(false);
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "api/v1/todocategory/",
    fetcher
  );

  const { mutate } = useSWRConfig();

  if (isLoading || !categories) {
    return <Loader />;
  }

  const selectedCategory = categories?.find(
    (_category) => _category._id === newTask.categoryId
  );

  // console.log(`selectedCategory`, JSON.stringify(selectedCategory, null, 2));

  const onCreateTask = async () => {
    try {
      if (newTask.name.length.toString().trim().length > 0) {
        /**
         * mutation
         */
        await trigger({
          ...newTask,
        });
        setNewTask({
          categoryId: newTask.categoryId,
          isCompleted: false,
          date: todaysISODate.toISOString(),
          name: "",
        });
        await mutate("api/v1/todotask/");
      }
    } catch (error) {
      console.log("error in onCreateTask", error);
      throw error;
    }
  };

  return (
    <Box>
      <Box
        bg="lightGray"
        px="4"
        py="3.5"
        borderRadius="rounded-5xl"
        flexDirection="row"
        position="relative"
      >
        <TextInput
          placeholder="Create a new task"
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 16,
            width: "50%",
          }}
          maxLength={36}
          textAlignVertical="center"
          value={newTask.name}
          onChangeText={(text) => {
            setNewTask((prev) => {
              return {
                ...prev,
                name: text,
              };
            });
          }}
          onSubmitEditing={onCreateTask}
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
                {isEqual(todaysISODate, parseISO(newTask.date))
                  ? "Today"
                  : `${new Date(newTask.date).getMonth() + 1}/${
                      new Date(newTask.date).getDate() + 1
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
              <Box
                width={12}
                height={12}
                borderRadius="rounded"
                borderWidth={2}
                mr="1"
                style={{
                  borderColor: selectedCategory?.color.code,
                }}
              ></Box>
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
                    setNewTask((prev) => {
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
                    borderTopStartRadius={index === 0 ? "rounded-3xl" : "none"}
                    borderTopEndRadius={index === 0 ? "rounded-3xl" : "none"}
                    borderBottomStartRadius={
                      categories?.length - 1 === index ? "rounded-2xl" : "none"
                    }
                    borderBottomEndRadius={
                      categories?.length - 1 === index ? "rounded-2xl" : "none"
                    }
                  >
                    <Box flexDirection="row">
                      <Text>{item.icon.symbol}</Text>
                      <Text
                        ml="2"
                        fontWeight={
                          newTask.categoryId === item._id ? "700" : "400"
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
            minDate={format(today, "Y-MM-dd")}
            onDayPress={(day) => {
              // console.log("here day");
              // console.log(new Date(day.dateString).toISOString());

              setIsSelectingDate(false);
              const selectedDate = new Date(day.dateString).toISOString();
              setNewTask((prev) => {
                return {
                  ...prev,
                  date: selectedDate,
                };
              });
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TaskActions;
