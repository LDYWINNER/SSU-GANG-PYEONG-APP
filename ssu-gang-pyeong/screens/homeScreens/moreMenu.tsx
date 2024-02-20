import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationType } from "../../navigation/types";
import { Box, Text, Theme } from "../../theme";
import useDarkMode from "../../store/useDarkMode";
import { useTheme } from "@shopify/restyle";

const MoreMenu = () => {
  const { isDarkMode } = useDarkMode();
  const theme = useTheme<Theme>();

  const navigation = useNavigation<HomeScreenNavigationType>();

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateTable", {});
  };

  const navigateToCategories = () => {
    navigation.navigate("Tables");
  };

  return (
    <Box pt="3" px="3">
      <TouchableOpacity onPress={navigateToCreateCategory}>
        <Box flexDirection="row" alignItems="center" pb="3" mb="3">
          <Ionicons
            name={
              isDarkMode?.mode === "dark" ? "add-circle-outline" : "add-circle"
            }
            color={theme.colors.textColor}
            size={35}
          />
          <Text color="textColor" ml="2" fontWeight="500" variant="textBase">
            Table 등록
          </Text>
        </Box>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToCategories}>
        <Box flexDirection="row" alignItems="center">
          <Ionicons
            name={
              isDarkMode?.mode === "dark"
                ? "file-tray-full-outline"
                : "file-tray-full"
            }
            color={theme.colors.textColor}
            size={35}
          />
          <Text color="textColor" ml="2" fontWeight="500" variant="textBase">
            Table 관리
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default MoreMenu;

// 나중에 구현해야할 부분
// 1. 이미지로 저장
// 2. URL 공유
// 3. 카카오톡으로 공유
