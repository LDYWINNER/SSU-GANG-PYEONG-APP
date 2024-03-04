import React from "react";
import { Box, Text, Theme } from "../theme";
import { SafeAreaWrapper } from "../components";
import { useTheme } from "@shopify/restyle";

const EmptyClassHistory = () => {
  const theme = useTheme<Theme>();

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Text>아직 수업 이력이 없습니다.</Text>
      </Box>
    </SafeAreaWrapper>
  );
};

export default EmptyClassHistory;
