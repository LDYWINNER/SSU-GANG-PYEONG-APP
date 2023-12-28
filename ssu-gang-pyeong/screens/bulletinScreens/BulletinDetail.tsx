import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { BulletinStackParamList } from "../../navigation/types";
import { NavigateBack, SafeAreaWrapper } from "../../components";
import { Box, Text } from "../../theme";
import { Ionicons } from "@expo/vector-icons";

type BulletinDetailScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinDetail"
>;

const BulletinDetail: React.FC<
  NativeStackScreenProps<any, "BulletinDetail">
> = ({ navigation: { navigate } }) => {
  const route = useRoute<BulletinDetailScreenRouteProp>();
  const { name } = route.params;

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="600" mr="2">
            {name === "Free"
              ? "자유 게시판"
              : name === "courseRegister"
              ? "수강신청 게시판"
              : name === "Secret"
              ? "비밀 게시판"
              : name === "Freshmen"
              ? "새내기 게시판"
              : name === "Promotion"
              ? "홍보 게시판"
              : name === "Club"
              ? "동아리 게시판"
              : "본교 게시판"}
          </Text>
          <Box>
            <TouchableOpacity onPress={() => navigate("BulletinSearch")}>
              <Ionicons name="md-search" size={30} color="black" />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinDetail;
