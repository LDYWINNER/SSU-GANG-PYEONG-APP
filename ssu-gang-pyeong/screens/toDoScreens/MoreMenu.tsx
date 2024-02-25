import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ToDoScreenNavigationType } from "../../navigation/types";
import { Box, Text, Theme } from "../../theme";
import useDarkMode from "../../store/useDarkMode";
import { useTheme } from "@shopify/restyle";

const MoreMenu = () => {
  const navigation = useNavigation<ToDoScreenNavigationType>();

  const { isDarkMode } = useDarkMode();
  const theme = useTheme<Theme>();
  const systemIsDark = useColorScheme() === "dark";

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {});
  };

  const navigateToCategories = () => {
    navigation.navigate("Categories");
  };

  const navigateToCompletedToDo = () => {
    navigation.navigate("CompletedToDo");
  };

  return (
    <Box pt="3" px="3">
      <TouchableOpacity onPress={navigateToCreateCategory}>
        <Box flexDirection="row" alignItems="center" mb="3">
          <Ionicons
            name={
              isDarkMode?.mode === "system"
                ? systemIsDark
                  ? "add-circle-outline"
                  : "add-circle"
                : isDarkMode?.mode === "dark"
                ? "add-circle-outline"
                : "add-circle"
            }
            color={theme.colors.textColor}
            size={35}
          />
          <Text ml="2" fontWeight="500" variant="textBase" color="textColor">
            Category 등록
          </Text>
        </Box>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToCategories}>
        <Box flexDirection="row" alignItems="center" mb="3">
          <Ionicons
            name={
              isDarkMode?.mode === "system"
                ? systemIsDark
                  ? "file-tray-full-outline"
                  : "file-tray-full"
                : isDarkMode?.mode === "dark"
                ? "file-tray-full-outline"
                : "file-tray-full"
            }
            color={theme.colors.textColor}
            size={35}
          />
          <Text ml="2" fontWeight="500" variant="textBase" color="textColor">
            Category 관리
          </Text>
        </Box>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToCompletedToDo}>
        <Box flexDirection="row" alignItems="center">
          <Ionicons
            name={
              isDarkMode?.mode === "system"
                ? systemIsDark
                  ? "checkbox-outline"
                  : "checkbox"
                : isDarkMode?.mode === "dark"
                ? "checkbox-outline"
                : "checkbox"
            }
            color={theme.colors.textColor}
            size={35}
          />
          <Text ml="2" fontWeight="500" variant="textBase" color="textColor">
            완료한 Todo 관리
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default MoreMenu;
