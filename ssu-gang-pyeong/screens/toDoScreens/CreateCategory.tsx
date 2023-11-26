import React, { useState } from "react";
import { SmoothButton, SafeAreaWrapper, NavigateBack } from "../../components";
import { ToDoStackParamList } from "../../navigation/types";
import axiosInstance, { BASE_URL } from "../../utils/config";
import { ICategory, ICategoryRequest, IColor, IIcon } from "../../types";
import { getColors, getIcons } from "../../utils/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, Text, Theme } from "../../theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity, TextInput } from "react-native";
import { useSWRConfig } from "swr";

import useSWRMutation from "swr/mutation";

const COLORS = getColors();
const ICONS = getIcons();

const DEFAULT_COLOR = COLORS[0];
const DEFAULT_ICON = ICONS[0];

const createCategoryRequest = async (
  url: string,
  { arg }: { arg: ICategoryRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in createCategoryRequest", error);
    throw error;
  }
};
const updateCategoryRequest = async (
  url: string,
  { arg }: { arg: ICategoryRequest }
) => {
  try {
    await axiosInstance.put(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in createCategoryRequest", error);
    throw error;
  }
};

const deleteCategoryRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id);
  } catch (error) {
    console.log("error in deleteCategoryRequest", error);
    throw error;
  }
};

type CreateCategoryRouteTypes = RouteProp<ToDoStackParamList, "CreateCategory">;

const CreateCategory = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation();

  const route = useRoute<CreateCategoryRouteTypes>();

  const isEditing = route.params.category ? true : false;

  const { trigger, isMutating } = useSWRMutation(
    "api/v1/todocategory/create",
    createCategoryRequest
  );

  const { trigger: updateTrigger } = useSWRMutation(
    "api/v1/todocategory/update",
    updateCategoryRequest
  );

  const { trigger: deleteTrigger } = useSWRMutation(
    "api/v1/todocategory/",
    deleteCategoryRequest
  );

  const { mutate } = useSWRConfig();

  console.log(`route.params`, JSON.stringify(route.params, null, 2));

  const [newCategory, setNewCategory] = useState<
    Omit<ICategory, "_id" | "user" | "isEditable">
  >({
    name: route.params.category?.name ?? "",
    color: route.params.category?.color ?? DEFAULT_COLOR,
    icon: route.params.category?.icon ?? DEFAULT_ICON,
  });

  const createNewCategory = async () => {
    try {
      if (isEditing) {
        const updatedCategoryItem = {
          ...route.params.category,
          ...newCategory,
        };
        await updateTrigger({
          ...updatedCategoryItem,
        });
      } else {
        await trigger({
          ...newCategory,
        });
      }
      await mutate(BASE_URL + "categories");
      navigation.goBack();
    } catch (error) {
      console.log("error in createNewCategory", error);
      throw error;
    }
  };

  const updateColor = (color: IColor) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        color,
      };
    });
  };
  const updateIcon = (icon: IIcon) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        icon,
      };
    });
  };

  const deleteCategory = async () => {
    try {
      if (isEditing && route.params.category?._id)
        await deleteTrigger({
          id: route.params.category?._id,
        });
      await mutate(BASE_URL + "categories");
      navigation.goBack();
    } catch (error) {
      console.log("error in deleteCategor", error);
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
            <TouchableOpacity onPress={deleteCategory}>
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
            value={newCategory.name}
            maxLength={36}
            placeholder="Create new category"
            placeholderTextColor={theme.colors.gray5}
            onChangeText={(text) => {
              setNewCategory((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
          />
        </Box>
        <Box height={24} />
        <Box bg="gray250" p="4" borderRadius="rounded-2xl">
          <Box
            bg="white"
            width={80}
            p="2"
            mb="4"
            borderRadius="rounded-2xl"
            alignItems="center"
          >
            <Text
              variant="textBase"
              fontWeight="600"
              color={newCategory.color.name as any}
            >
              Colors
            </Text>
          </Box>

          <Box flexDirection="row" justifyContent="space-evenly">
            {COLORS.map((_color) => {
              return (
                <TouchableOpacity
                  key={_color.id}
                  onPress={() => {
                    updateColor(_color);
                  }}
                >
                  <Box
                    style={{
                      backgroundColor: _color.code,
                    }}
                    width={24}
                    height={24}
                    borderRadius="rounded-2xl"
                  ></Box>
                </TouchableOpacity>
              );
            })}
          </Box>
        </Box>

        <Box height={24} />

        <Box bg="gray250" p="4" borderRadius="rounded-2xl">
          <Box
            bg="white"
            width={60}
            p="2"
            mb="4"
            borderRadius="rounded-2xl"
            alignItems="center"
          >
            <Text
              variant="textBase"
              fontWeight="600"
              color={newCategory.color.name as any}
            >
              {newCategory.icon.symbol}
            </Text>
          </Box>

          <Box flexDirection="row" justifyContent="space-evenly">
            {ICONS.map((icon) => {
              return (
                <TouchableOpacity
                  key={icon.id}
                  onPress={() => {
                    updateIcon(icon);
                  }}
                >
                  <Box width={24} height={24} borderRadius="rounded-2xl">
                    <Text>{icon.symbol}</Text>
                  </Box>
                </TouchableOpacity>
              );
            })}
          </Box>
        </Box>
        <Box position="absolute" bottom={4} left={0} right={0}>
          <SmoothButton
            label={isEditing ? "Edit category" : "Create new Category"}
            onPress={createNewCategory}
          />
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default CreateCategory;
