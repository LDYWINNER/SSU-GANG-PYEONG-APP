import React, { useState } from "react";
import { SmoothButton, SafeAreaWrapper, NavigateBack } from "../../components";
import { HomeStackParamList } from "../../navigation/types";
import axiosInstance, { BASE_URL } from "../../utils/config";
import { ITable, ITableRequest, IUpdateTableRequest } from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, Text, Theme } from "../../theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity, TextInput } from "react-native";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import useUserGlobalStore from "../../store/useUserGlobal";

const createTableRequest = async (
  url: string,
  { arg }: { arg: ITableRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in createTableRequest", error);
    throw error;
  }
};

const updateTableRequest = async (
  url: string,
  { arg }: { arg: IUpdateTableRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in updateTableRequest", error);
    throw error;
  }
};

const deleteTableRequest = async (
  url: string,
  { arg }: { arg: ITableRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in deleteTableRequest", error);
    throw error;
  }
};

const updateClassHistoryKey = (
  currentClassHistory: any,
  oldKeyName: string,
  newKeyName: string
) => {
  const updatedClassHistory: { [key: string]: any } = {};
  Object.keys(currentClassHistory).forEach((key) => {
    if (key === oldKeyName) {
      updatedClassHistory[newKeyName] = currentClassHistory[key];
    } else {
      updatedClassHistory[key] = currentClassHistory[key];
    }
  });

  return updatedClassHistory;
};

type CreateTableRouteTypes = RouteProp<HomeStackParamList, "CreateTable">;

const CreateTable = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation();

  const route = useRoute<CreateTableRouteTypes>();

  const isEditing = route.params.table?.name ? true : false;

  const { trigger } = useSWRMutation("api/v1/table/create", createTableRequest);

  const { trigger: updateTrigger } = useSWRMutation(
    "api/v1/table/update",
    updateTableRequest
  );

  const { trigger: deleteTrigger } = useSWRMutation(
    "api/v1/table/delete",
    deleteTableRequest
  );

  const { mutate } = useSWRConfig();

  const { user, updateUser } = useUserGlobalStore();

  // console.log(`route.params`, JSON.stringify(route.params, null, 2));

  const [newTable, setNewTable] = useState<ITable>({
    name: route.params.table?.name ?? "",
  });

  const createNewTable = async () => {
    try {
      if (isEditing) {
        const updatedTableItem = {
          oldName: route.params.table!.name,
          ...newTable,
        };
        await updateTrigger({
          ...updatedTableItem,
        });

        const updatedClassHistory = updateClassHistoryKey(
          user!.classHistory,
          updatedTableItem.oldName,
          updatedTableItem.name
        );

        updateUser({
          ...user!,
          classHistory: updatedClassHistory,
        });
      } else {
        await trigger({
          ...newTable,
        });
        updateUser({
          ...user!,
          classHistory: {
            ...user!.classHistory,
            [newTable.name]: [],
          },
        });
      }
      navigation.goBack();
    } catch (error) {
      console.log("error in createNewTable", error);
      throw error;
    }
  };

  const deleteTable = async () => {
    try {
      await deleteTrigger({
        ...newTable,
      });

      delete user!.classHistory[newTable.name];
      updateUser(user);
      navigation.goBack();
    } catch (error) {
      console.log("error in deleteTable", error);
      throw error;
    }
  };

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box height={16} />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          {isEditing && (
            <TouchableOpacity onPress={deleteTable}>
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color={theme.colors.rose500}
              />
            </TouchableOpacity>
          )}
        </Box>
        <Box height={16} />
        <Box bg="gray250" borderRadius="rounded-2xl">
          <TextInput
            style={{
              fontSize: 20,
              lineHeight: 26,
              padding: 16,
            }}
            value={newTable.name}
            maxLength={36}
            placeholder="Create new table"
            placeholderTextColor={theme.colors.gray5}
            onChangeText={(text) => {
              setNewTable((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
          />
        </Box>
        <Box height={24} />

        <Box position="absolute" bottom={4} left={0} right={0}>
          <SmoothButton
            label={isEditing ? "Edit table name" : "Done"}
            onPress={createNewTable}
          />
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default CreateTable;
