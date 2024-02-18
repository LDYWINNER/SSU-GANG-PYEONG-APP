import React from "react";
import { Box, Text, Theme } from "../../theme";
import { NavigateBack, SafeAreaWrapper } from "../../components";

const MyAccount = () => (
  <SafeAreaWrapper>
    <Box flex={1} mx="4">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <NavigateBack />
        <Text
          variant="text2Xl"
          fontWeight="700"
          textDecorationLine="underline"
          textDecorationColor="iconBlue"
          textDecorationStyle="double"
        >
          My Account
        </Text>
        <Box mr="10"></Box>
      </Box>
      <Box height={16} />

      <Box></Box>
    </Box>
  </SafeAreaWrapper>
);

export default MyAccount;
