import React from "react";
import { Box, Text } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../SafeAreaWrapper";
import { AuthScreenNavigationType } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Image } from "react-native";
import { SmoothButton } from "../../components";

const Welcome = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>();
  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={[
          "#ffffff",
          "#f9d5d5",
          "#ffb3b3",
          "#fcb5b5",
          "#f7cbcb",
          "#ffffff",
        ]}
        style={{ flex: 1 }}
      >
        <Box flex={1} justifyContent="center">
          <Box alignItems="center" mb="3.5">
            <Animated.View entering={ZoomIn.duration(2000)}>
              <Image
                source={require("../../assets/images/logo-transparent.png")}
              />
            </Animated.View>
          </Box>
          <Text textAlign="center" variant="textXl" fontWeight="700">
            Do you want to be smarter at school?
          </Text>
          <Box my="3.5" mx="10">
            <SmoothButton
              label="Start your journey"
              onPress={() => navigation.navigate("Register")}
            />
          </Box>
          <Text
            textAlign="center"
            variant="textXs"
            fontWeight="700"
            color="gray5"
            onPress={() => navigation.navigate("Login")}
          >
            Already registered?
          </Text>
        </Box>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default Welcome;
