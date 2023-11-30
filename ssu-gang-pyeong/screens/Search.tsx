import React from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance, { fetcher } from "../utils/config";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaWrapper, SmoothButton, Input, Loader } from "../components";
import { Box, Text } from "../theme";
import { ICourse } from "../types";
import { FlatList, TouchableOpacity } from "react-native";

interface ISearch {
  keyword: string;
}

const Search = () => {
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

  if (isCourseLoading) {
    return <Loader />;
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
              <Box borderRadius="rounded-xl" bg="lightGray" px="4" py="6" m="3">
                <Text>
                  {item.subj} {item.crs}
                </Text>
              </Box>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaWrapper>
  );
};

export default Search;
