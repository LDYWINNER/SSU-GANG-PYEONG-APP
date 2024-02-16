import React from "react";
import { fetcher } from "../../utils/config";
import { ICategory } from "../../types";
import { Box, Text } from "../../theme";
import { Loader, SafeAreaWrapper } from "../../components";
import { Category, CreateNewList } from "../../components/categories";
import { FlatList } from "react-native";
import useSWR from "swr";

const Tables = () => {
  const { data, isLoading, error } = useSWR<ICategory[]>(
    "api/v1/todocategory/",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  const renderItem = ({ item }: { item: ICategory }) => (
    <Category category={item} />
  );

  return (
    <SafeAreaWrapper>
      <Box flex={1} px="4">
        <Text variant="textXl" fontWeight="700" mb="10">
          Categories
        </Text>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Box height={14} />}
          keyExtractor={(item) => item._id}
        />
        <Box height={4} />
        <CreateNewList />
      </Box>
    </SafeAreaWrapper>
  );
};

export default Tables;
