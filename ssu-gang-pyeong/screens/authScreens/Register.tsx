import React, { useCallback, useMemo, useRef, useState } from "react";
import { SmoothButton, Input } from "../../components";
import { TouchableOpacity } from "react-native";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
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
  const isDark = useColorScheme() === "dark";

  const navigation = useNavigation<AuthScreenNavigationType<"Register">>();
  const navigateToLoginScreen = () => {
    navigation.navigate("Login");
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
              {watch("school")}
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
              {watch("major")}
            </Text>
            <Text textAlign="right" mr="3">
              <Ionicons name={"caret-down"} color={"white"} size={35} />
            </Text>
          </Box>
        </TouchableOpacity>
        <Box mb="5.5" />
        <TouchableOpacity onPress={navigateToLoginScreen}>
          <Text color="primary" textAlign="right">
            Log in?
          </Text>
        </TouchableOpacity>
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
                setValue("school", watch("school"));
                handleClosePress();
              } else {
                setValue("major", watch("major"));
                handleClosePress();
              }
            }}
          >
            <Text>확인</Text>
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
              >
                <Picker.Item label="SBU" value="SBU" />
                <Picker.Item label="FIT" value="FIT" />
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
              >
                <Picker.Item label="AMS" value="AMS" />
                <Picker.Item label="BM" value="BM" />
                <Picker.Item label="CS" value="CS" />
                <Picker.Item label="ECE" value="ECE" />
                <Picker.Item label="MEC" value="MEC" />
                <Picker.Item label="TSM" value="TSM" />
              </Picker>
            )}
          />
        )}
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default SignUpScreen;
