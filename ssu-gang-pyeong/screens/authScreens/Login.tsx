import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { SmoothButton, Input } from "../../components";
import { AuthScreenNavigationType } from "../../navigation/types";
import { Box, Text } from "../../theme";
import { IUser } from "../../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import axiosInstance from "../../utils/config";

const LoginScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"Login">>();

  const navigateToSignInScreen = () => {
    navigation.navigate("Register");
  };

  const navigateToEmailVerificationScreen = async () => {
    // send email to the user
    const response = await axiosInstance.post("api/v1/auth/loginEmail", {
      email: watch("email"),
    });
    // console.log(response.data);

    navigation.navigate("EmailVerification", {
      email: watch("email"),
      verificationCodeFromBack: response.data.authNum || "",
    });
  };

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<Omit<IUser, "username" | "school" | "major">>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <Box flex={1} px="5.5" justifyContent="center">
      <Text variant="textXl" fontWeight="700">
        Welcome Back
      </Text>
      <Box mb="6" />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            error={errors.email}
          />
        )}
        name="email"
      />
      <Box mb="6" />

      <Box mt="5.5" />
      <TouchableOpacity onPress={navigateToSignInScreen}>
        <Text color="primary" textAlign="right" variant="textBase">
          Register?
        </Text>
      </TouchableOpacity>
      <Box mb="5.5" />

      <SmoothButton
        label="Next"
        onPress={() => navigateToEmailVerificationScreen()}
        uppercase
      />
    </Box>
  );
};

export default LoginScreen;
