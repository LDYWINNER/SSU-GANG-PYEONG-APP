import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SmoothButton, Input } from "../../components";
import {
  AuthScreenNavigationType,
  AuthStackParamList,
} from "../../navigation/types";
import { loginUser, registerUser } from "../../utils/api";
import { Box, Text } from "../../theme";
import useUserGlobalStore from "../../store/useUserGlobal";

type EmailVerificationRouteProp = RouteProp<
  AuthStackParamList,
  "EmailVerification"
>;

// TODO: error Alert 까지

const EmailVerification = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"Login">>();

  const route = useRoute<EmailVerificationRouteProp>();
  const { isLogin, email, verificationCodeFromBack, username, school, major } =
    route.params;

  const { updateUser } = useUserGlobalStore();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSubmit = async (data: { verificationCode: string }) => {
    try {
      if (verificationCodeFromBack != data.verificationCode) {
        // console.log(verificationCodeFromBack, data.verificationCode);
        // console.log(
        //   typeof verificationCodeFromBack,
        //   typeof data.verificationCode
        // );

        throw new Error("Invalid verification code");
      }

      if (isLogin) {
        const lowerCaseEmail = email.toLowerCase();
        const _user = await loginUser({
          email: lowerCaseEmail,
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
      } else {
        // register user
        const _user = await registerUser({
          username: username ?? "",
          email,
          school: school ?? "",
          major: major ?? "",
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
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid verification code");
    }
  };

  return (
    <Box flex={1} px="5.5" justifyContent="center">
      <Text variant="textXl" fontWeight="700">
        Email Verification
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
            error={errors.verificationCode}
          />
        )}
        name="verificationCode"
      />
      <Box mb="6" />

      <SmoothButton label="Login" onPress={handleSubmit(onSubmit)} uppercase />
    </Box>
  );
};

export default EmailVerification;
