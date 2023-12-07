import React from "react";
import { SafeAreaWrapper } from "../../components";
import { useTheme } from "@shopify/restyle";
import { Box, Text, Theme } from "../../theme";

const AddCourse = () => {
  const theme = useTheme<Theme>();
  return (
    <SafeAreaWrapper>
      <Box>
        <Text>hello</Text>
      </Box>
    </SafeAreaWrapper>
  );
};

export default AddCourse;
