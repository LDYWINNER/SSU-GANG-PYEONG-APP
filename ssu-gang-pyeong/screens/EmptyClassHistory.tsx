import React from "react";
import { Box, Text, Theme } from "../theme";
import { SafeAreaWrapper } from "../components";
import { useTheme } from "@shopify/restyle";

const EmptyClassHistory = () => {
  const theme = useTheme<Theme>();

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Text color="textColor" variant="textLg" fontWeight="600" mb="5">
          등록된 Timetable이 없습니다 :(
        </Text>
        <Text color="textColor" variant="textLg" fontWeight="600">
          위에 ... 버튼을 눌러서 Timetable을 추가해보세요!
        </Text>
      </Box>
    </SafeAreaWrapper>
  );
};

export default EmptyClassHistory;
