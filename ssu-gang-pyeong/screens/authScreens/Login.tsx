import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SmoothButton, Input, SafeAreaWrapper } from "../../components";
import { AuthScreenNavigationType } from "../../navigation/types";
import { loginUser } from "../../utils/api";
import { Box, Text } from "../../theme";
import useUserGlobalStore from "../../store/useUserGlobal";
import { IUser } from "../../types";

const LoginScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"Login">>();
  const navigateToSignInScreen = () => {
    navigation.navigate("Register");
  };

  const { updateUser } = useUserGlobalStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<IUser, "username" | "school" | "major">>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    data: Omit<IUser, "username" | "school" | "major">
  ) => {
    try {
      const { email } = data;
      const lowerCaseEmail = email.toLowerCase();
      const _user = await loginUser({
        email: lowerCaseEmail,
      });
      updateUser({
        username: _user.username,
        email: _user.email,
        school: _user.school,
        major: _user.major,
        courseReviewNum: _user.courseReviewNum,
        adminAccount: _user.adminAccount,
        classHistory: _user.classHistory,
      });
    } catch (error) {}
  };

  return (
    <SafeAreaWrapper>
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
        <Pressable onPress={navigateToSignInScreen}>
          <Text color="primary" textAlign="right">
            Register?
          </Text>
        </Pressable>
        <Box mb="5.5" />

        <SmoothButton
          label="Login"
          onPress={handleSubmit(onSubmit)}
          uppercase
        />
      </Box>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;
