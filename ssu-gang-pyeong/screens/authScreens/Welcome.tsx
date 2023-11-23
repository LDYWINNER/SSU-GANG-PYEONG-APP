import React from "react";
import { Box, Text } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../SafeAreaWrapper";
import { AuthScreenNavigationType } from "../../navigation/types";

const Welcome = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>();
  return (
    <SafeAreaWrapper>
      <Box>
        <Text onPress={() => navigation.navigate("Register")}>Welcome</Text>
      </Box>
    </SafeAreaWrapper>
  );
};

export default Welcome;
