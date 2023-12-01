import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance, { fetcher } from "../utils/config";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaWrapper, SmoothButton, Input, Loader } from "../components";
import { Box, Text } from "../theme";
import { ICourse } from "../types";
import { FlatList, TouchableOpacity } from "react-native";
import { Rating } from "@kolking/react-native-rating";

interface ISearch {
  keyword: string;
}

const Search = () => {
  const instructors: string[] = [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISearch>({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmit = async (data: ISearch) => {
    try {
      const { keyword } = data;
    } catch (error) {}
  };

  const { data: allCourses, isLoading: isCourseLoading } = useSWR<ICourse[]>(
    "api/v1/course/all",
    fetcher
  );

  const toFindDuplicates = (arr: string[]) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

  if (isCourseLoading) {
    return <Loader />;
  } else {
    for (let index = 0; index < allCourses!.length; index++) {
      if (allCourses![index].instructor_names.includes(",")) {
        const duplicateElements = toFindDuplicates(
          allCourses![index].instructor
        );
        if (duplicateElements.length === 0) {
          instructors.push(allCourses![index].instructor_names);
        } else {
          const temp = allCourses![index].instructor;
          for (let i = 0; i < duplicateElements.length; i++) {
            const firstIndex = temp.indexOf(duplicateElements[i]);
            while (temp.lastIndexOf(duplicateElements[i]) !== firstIndex) {
              temp.splice(temp.lastIndexOf(duplicateElements[i]), 1);
            }
          }
          instructors.push(temp.join(","));
        }
      } else {
        instructors.push(allCourses![index].instructor_names);
      }
    }
  }

  return (
    <SafeAreaWrapper>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Search keyword"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Search keyword"
            error={errors.keyword}
          />
        )}
        name="keyword"
      />
      <Box mb="6" />
      <FlatList
        data={allCourses}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity>
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
                    <Text>{instructors[index]}</Text>
                  </Box>
                </Box>
                <Box>
                  <Text>
                    {item.avgGrade ? (
                      <Rating
                        rating={Number(item.avgGrade.toFixed(1))}
                        disabled
                      />
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
          );
        }}
      />
    </SafeAreaWrapper>
  );
};

export default Search;
