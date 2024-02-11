import { Box, Theme } from "../theme";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";

const NavigateBack = () => {
  const navigation = useNavigation();
  const theme = useTheme<Theme>();
  const navigateBack = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity onPress={navigateBack}>
      <Box bg="gray100" p="2" borderRadius="rounded-7xl">
        <Ionicons name="chevron-back" size={24} color={theme.colors.gray9} />
      </Box>
    </TouchableOpacity>
  );
};

export default NavigateBack;
