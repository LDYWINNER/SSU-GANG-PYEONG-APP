import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { SmoothButton, Input } from "../../components";
import { AuthScreenNavigationType } from "../../navigation/types";
import { Box, Text } from "../../theme";
import { IUser } from "../../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import axiosInstance from "../../utils/config";
import { loginUser } from "../../utils/api";
import useUserGlobalStore from "../../store/useUserGlobal";

const LoginScreen = () => {
  const { updateUser } = useUserGlobalStore();

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

    // for admin user
    if (response.data.loginSkip) {
      const _user = await loginUser({
        email: watch("email").toLowerCase(),
      });
      updateUser({
        _id: _user._id,
        username: _user.username,
        email: _user.email,
        school: _user.school,
        major: _user.major,
        courseReviewNum: _user.courseReviewNum,
        adminAccount: _user.adminAccount,
        classHistory: _user.classHistory,
        personalSchedule: _user.personalSchedule,
      });
    }

    navigation.navigate("EmailVerification", {
      isLogin: true,
      email: watch("email"),
      verificationCodeFromBack: response.data.authNum || "",
    });
  };

  const {
    control,
    watch,
    handleSubmit,
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
          required: "Email is required",
          pattern: {
            value: /@stonybrook\.edu$/,
            message: "Email must end with @stonybrook.edu",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
        onPress={handleSubmit(navigateToEmailVerificationScreen)}
        uppercase
      />
    </Box>
  );
};

export default LoginScreen;
