import React, { useState, useCallback } from "react";
import { fetcher } from "../../utils/config";
import { ICategory } from "../../types";
import { Box, Text, Theme } from "../../theme";
import { Loader, NavigateBack, SafeAreaWrapper } from "../../components";
import { Category, CreateNewList } from "../../components/categories";
import { FlatList, RefreshControl } from "react-native";
import useSWR from "swr";
import { useTheme } from "@shopify/restyle";

const Categories = () => {
  const theme = useTheme<Theme>();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  }, []);

  const { data, isLoading, mutate } = useSWR<ICategory[]>(
    "api/v1/todocategory/",
    fetcher
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.sbuRed]} // For Android
              tintColor={theme.colors.sbuRed} // For iOS
            />
          }
        />
        <Box height={4} />
        <CreateNewList />
        <Box height={25} />
      </Box>
    </SafeAreaWrapper>
  );
};

export default Categories;
