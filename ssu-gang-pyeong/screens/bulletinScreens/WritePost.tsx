import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Divider,
  Loader,
  NavigateBack,
  SafeAreaWrapper,
} from "../../components";
import { Box, Text, Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BulletinStackParamList } from "../../navigation/types";
import { Dimensions, TextInput, TouchableOpacity } from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type WritePostScreenRouteProp = RouteProp<BulletinStackParamList, "WritePost">;

const WritePost: React.FC<NativeStackScreenProps<any, "WritePost">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();

  const route = useRoute<WritePostScreenRouteProp>();
  // const { id } = route.params;

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2" mb="-6"></Box>
    </SafeAreaWrapper>
  );
};

export default WritePost;
