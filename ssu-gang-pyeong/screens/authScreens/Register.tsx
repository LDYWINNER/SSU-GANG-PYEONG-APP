import React, { useCallback, useMemo, useRef, useState } from "react";
import { SmoothButton, Input } from "../../components";
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { AuthScreenNavigationType } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { Box, Text, Theme } from "../../theme";
import { IUser } from "../../types";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import axiosInstance from "../../utils/config";

const SignUpScreen = () => {
  const theme = useTheme<Theme>();

  const navigation = useNavigation<AuthScreenNavigationType<"Register">>();
  const navigateToLoginScreen = () => {
    navigation.navigate("Login");
  };

  const navigateToEmailVerificationScreen = async () => {
    // send email to the user
    try {
      const response = await axiosInstance.post("api/v1/auth/registerEmail", {
        email: watch("email"),
        username: watch("username"),
        school: watch("school"),
        major: watch("major"),
      });

      navigation.navigate("EmailVerification", {
        isLogin: false,
        email: watch("email"),
        username: watch("username"),
        school: watch("school"),
        major: watch("major"),
        verificationCodeFromBack: response.data.authNum || "",
      });

      // console.log(response.data);
    } catch (error: any) {
      // console.log(error.response.data);
      return Alert.alert("Error", error.response.data.message);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IUser>({
    defaultValues: {
      username: "",
      email: "",
      school: "SBU",
      major: "AMS",
    },
  });

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [270], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [picker, setPicker] = useState(true);
  const [pickerContents, setPickerContents] = useState("");
  const pickerRef = useRef<Picker<string>>(null);
  const togglePicker = (index: string) => {
    if (picker) {
      handleSnapPress();
      setPicker(false);
      setPickerContents(index);
    } else {
      handleClosePress();
      setPicker(true);
      setPickerContents(index);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setPicker(true);
    }
  }, []);
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Box flex={1} px="5.5" justifyContent="center">
          <Text variant="textXl" fontWeight="700" mb="6">
            Welcome to SSU GANG PYEONG!
          </Text>

          <Controller
            control={control}
            rules={{
              required: "Username is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username}
              />
            )}
            name="username"
          />
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
          <Box mt="5.5" />
          <TouchableOpacity onPress={() => togglePicker("school")}>
            <Text>SCHOOL</Text>
            <Box mb="2" />
            <Box
              bg="gray500"
              py="2"
              borderRadius="rounded-xl"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box width={35} />
              <Text
                variant="textSm"
                fontWeight="700"
                textAlign="center"
                color="white"
              >
                {watch("school")}
              </Text>
              <Text textAlign="right" mr="3">
                <Ionicons name={"caret-down"} color={"white"} size={35} />
              </Text>
            </Box>
          </TouchableOpacity>
          <Box mb="5.5" />
          <TouchableOpacity onPress={() => togglePicker("major")}>
            <Text>MAJOR</Text>
            <Box mb="2" />
            <Box
              bg="gray500"
              py="2"
              borderRadius="rounded-xl"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box width={35} />
              <Text
                variant="textSm"
                fontWeight="700"
                textAlign="center"
                color="white"
              >
                {watch("major")}
              </Text>
              <Text textAlign="right" mr="3">
                <Ionicons name={"caret-down"} color={"white"} size={35} />
              </Text>
            </Box>
          </TouchableOpacity>
          <Box mb="5.5" />
          <TouchableOpacity onPress={navigateToLoginScreen}>
            <Text color="primary" textAlign="right" variant="textBase">
              Log in?
            </Text>
          </TouchableOpacity>
          <Box mb="5.5" />

          <SmoothButton
            label="Register"
            onPress={handleSubmit(navigateToEmailVerificationScreen)}
            uppercase
          />
        </Box>
      </TouchableWithoutFeedback>

      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.stDarkerGrey,
        }}
      >
        <Box flexDirection="row" justifyContent="flex-end" mr="5">
          <TouchableOpacity
            onPress={() => {
              if (pickerContents === "school") {
                setValue("school", watch("school"));
                handleClosePress();
              } else {
                setValue("major", watch("major"));
                handleClosePress();
              }
            }}
          >
            <Text
              variant="textLg"
              fontWeight="600"
              style={{ color: theme.colors.iconBlue }}
            >
              확인
            </Text>
          </TouchableOpacity>
        </Box>
        {pickerContents === "school" ? (
          <Controller
            name="school"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Picker
                ref={pickerRef}
                selectedValue={value}
                onValueChange={onChange}
                style={{ color: theme.colors.iconBlue }}
              >
                <Picker.Item
                  label="SBU"
                  value="SBU"
                  color={theme.colors.iconBlue}
                />
                {/* <Picker.Item
                  label="FIT"
                  value="FIT"
                  color={theme.colors.iconBlue}
                /> */}
              </Picker>
            )}
          />
        ) : (
          <Controller
            name="major"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Picker
                ref={pickerRef}
                selectedValue={value}
                onValueChange={onChange}
                style={{ color: theme.colors.iconBlue }}
              >
                <Picker.Item
                  label="AMS"
                  value="AMS"
                  color={theme.colors.iconBlue}
                />
                <Picker.Item
                  label="BM"
                  value="BM"
                  color={theme.colors.iconBlue}
                />
                <Picker.Item
                  label="CS"
                  value="CS"
                  color={theme.colors.iconBlue}
                />
                <Picker.Item
                  label="ECE"
                  value="ECE"
                  color={theme.colors.iconBlue}
                />
                <Picker.Item
                  label="MEC"
                  value="MEC"
                  color={theme.colors.iconBlue}
                />
                <Picker.Item
                  label="TSM"
                  value="TSM"
                  color={theme.colors.iconBlue}
                />
              </Picker>
            )}
          />
        )}
      </BottomSheet>
    </>
  );
};

export default SignUpScreen;
