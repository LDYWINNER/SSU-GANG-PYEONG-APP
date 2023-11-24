import React, { useCallback, useMemo, useRef, useState } from "react";
import { SmoothButton, Input } from "../../components";
import { Pressable, TouchableOpacity } from "react-native";
import SafeAreaWrapper from "../SafeAreaWrapper";
import { AuthScreenNavigationType } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { Box, Text } from "../../theme";
import { registerUser } from "../../utils/api";
import { IUser } from "../../types";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "react-native";
import colors from "../../colors";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = () => {
  //temp
  const [school, setSchool] = useState("SBU");
  const [major, setMajor] = useState("AMS");

  const isDark = useColorScheme() === "dark";

  const navigation = useNavigation<AuthScreenNavigationType<"Register">>();
  const navigateToLoginScreen = () => {
    navigation.navigate("Login");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: {
      username: "",
      email: "",
      school: "",
      major: "",
    },
  });

  const onSubmit = async (data: IUser) => {
    try {
      const { username, email, school, major } = data;
      // register user
      await registerUser({
        username,
        email,
        school,
        major,
      });
      navigateToLoginScreen();
    } catch (error) {}
  };

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
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
    <SafeAreaWrapper>
      <Box flex={1} px="5.5" mt={"13"}>
        <Text variant="textXl" fontWeight="700" mb="6">
          Welcome to SSU GANG PYEONG!
        </Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              error={errors.username}
            />
          )}
          name="username"
        />
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
        <Box mt="5.5" />
        <TouchableOpacity onPress={() => togglePicker("school")}>
          <Text>School</Text>
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
              {school}
            </Text>
            <Text textAlign="right" mr="3">
              <Ionicons name={"caret-down"} color={"white"} size={35} />
            </Text>
          </Box>
        </TouchableOpacity>
        <Box mb="5.5" />
        <TouchableOpacity onPress={() => togglePicker("major")}>
          <Text>Major</Text>
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
              {major}
            </Text>
            <Text textAlign="right" mr="3">
              <Ionicons name={"caret-down"} color={"white"} size={35} />
            </Text>
          </Box>
        </TouchableOpacity>
        <Box mb="5.5" />
        <Pressable onPress={navigateToLoginScreen}>
          <Text color="primary" textAlign="right">
            Log in?
          </Text>
        </Pressable>
        <Box mb="5.5" />

        <SmoothButton
          label="Register"
          onPress={handleSubmit(onSubmit)}
          uppercase
        />
      </Box>

      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: isDark ? colors.DARKER_GREY : "white",
        }}
      >
        <Box>
          <TouchableOpacity
            onPress={() => {
              if (pickerContents === "school") {
                setSchool(school);
                handleClosePress();
              } else {
                setMajor(major);
                handleClosePress();
              }
            }}
          >
            <Text>확인</Text>
          </TouchableOpacity>
        </Box>
        {pickerContents === "school" ? (
          <Picker
            ref={pickerRef}
            selectedValue={school}
            onValueChange={(itemValue, itemIndex) => setSchool(itemValue)}
          >
            <Picker.Item label="SBU" value="SBU" />
            <Picker.Item label="FIT" value="FIT" />
          </Picker>
        ) : (
          <Picker
            ref={pickerRef}
            selectedValue={major}
            onValueChange={(itemValue, itemIndex) => setMajor(itemValue)}
          >
            <Picker.Item label="AMS" value="AMS" />
            <Picker.Item label="BM" value="BM" />
            <Picker.Item label="CS" value="CS" />
            <Picker.Item label="ECE" value="ECE" />
            <Picker.Item label="MEC" value="MEC" />
            <Picker.Item label="TSM" value="TSM" />
          </Picker>
        )}
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default SignUpScreen;
