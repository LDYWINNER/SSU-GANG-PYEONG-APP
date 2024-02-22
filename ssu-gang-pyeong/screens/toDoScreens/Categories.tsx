import React from "react";
import { fetcher } from "../../utils/config";
import { ICategory } from "../../types";
import { Box, Text } from "../../theme";
import { Loader, NavigateBack, SafeAreaWrapper } from "../../components";
import { Category, CreateNewList } from "../../components/categories";
import { FlatList } from "react-native";
import useSWR from "swr";

const Categories = () => {
  const { data, isLoading } = useSWR<ICategory[]>(
    "api/v1/todocategory/",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const renderItem = ({ item }: { item: ICategory }) => (
    <Category category={item} />
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} px="4">
        <Box height={16} />
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Text variant="textXl" fontWeight="700" mt="5" mb="2" color="textColor">
          Categories
        </Text>
        <Text color="textColor" mb="3" fontWeight="600">
          Press longer to edit categories
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
        <Box height={25} />
      </Box>
    </SafeAreaWrapper>
  );
};

export default Categories;
