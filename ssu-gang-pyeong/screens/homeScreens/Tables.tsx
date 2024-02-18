import React from "react";
import { Box, Text } from "../../theme";
import { NavigateBack, SafeAreaWrapper } from "../../components";
import { Table, CreateNewTable } from "../../components/tables";
import useUserGlobalStore from "../../store/useUserGlobal";

const Tables = () => {
  const { user } = useUserGlobalStore();

  return (
    <SafeAreaWrapper>
      <Box flex={1} px="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="700">
            Tables
          </Text>
          <Box mr="10" />
        </Box>
        <Box height={16} />

        {Object.keys(user!.classHistory).map((key, index) => (
          <Box key={index}>
            <Table table={{ name: key }} />
            <Box height={14} />
          </Box>
        ))}
        <Box height={4} />
        <CreateNewTable />
      </Box>
    </SafeAreaWrapper>
  );
};

export default Tables;
