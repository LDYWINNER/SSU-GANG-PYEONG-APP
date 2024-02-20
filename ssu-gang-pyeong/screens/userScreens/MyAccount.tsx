import React, { useState } from "react";
import { Box, Text, Theme } from "../../theme";
import { NavigateBack, SafeAreaWrapper, SmoothButton } from "../../components";
import { TextInput } from "react-native";
import axiosInstance from "../../utils/config";
import { IUpdateUserNameRequest } from "../../types";
import { useTheme } from "@shopify/restyle";
import useSWRMutation from "swr/mutation";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useNavigation } from "@react-navigation/native";

const updateUsernameRequest = async (
  url: string,
  { arg }: { arg: IUpdateUserNameRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in updateUsernameRequest", error);
    throw error;
  }
};

const MyAccount = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation();

  const { user, updateUser } = useUserGlobalStore();

  const [newUserName, setNewUserName] = useState(user!.username);

  const { trigger: updateTrigger } = useSWRMutation(
    "api/v1/auth/updateUser",
    updateUsernameRequest
  );

  const updateUserName = async () => {
    try {
      await updateTrigger({ user: user!._id, username: newUserName });

      updateUser({
        ...user!,
        username: newUserName,
      });

      navigation.goBack();
    } catch (error) {
      console.log("error in updateUserName", error);
      throw error;
    }
  };

  return (
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
            color="textColor"
          >
            My Account
          </Text>
          <Box mr="10"></Box>
        </Box>
        <Box height={16} />

        <Box bg="gray250" borderRadius="rounded-2xl">
          <TextInput
            style={{
              fontSize: 20,
              lineHeight: 26,
              padding: 16,
            }}
            value={newUserName}
            maxLength={36}
            placeholder="Create new table"
            placeholderTextColor={theme.colors.gray5}
            onChangeText={(text) => {
              setNewUserName(text);
            }}
          />
        </Box>
        <Box height={24} />

        <Box position="absolute" bottom={4} left={0} right={0}>
          <SmoothButton label={"Done"} onPress={updateUserName} />
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default MyAccount;
