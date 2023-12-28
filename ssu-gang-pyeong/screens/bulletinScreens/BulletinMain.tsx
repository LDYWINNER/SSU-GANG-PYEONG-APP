import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaWrapper } from "../../components";
import { Box, Text } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const BulletinMain: React.FC<NativeStackScreenProps<any, "BulletinMain">> = ({
  navigation: { navigate },
}) => {
  return (
    <SafeAreaWrapper>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mx="4"
        mt="4"
      >
        <Text variant="text2Xl" fontWeight="600">
          게시판
        </Text>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box mr="3">
            <TouchableOpacity>
              <Ionicons name="md-search" size={30} color="black" />
            </TouchableOpacity>
          </Box>
          <Box>
            <TouchableOpacity>
              <FontAwesome name="user-circle" size={30} color="black" />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinMain;
