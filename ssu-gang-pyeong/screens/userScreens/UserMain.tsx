import React from "react";
import { Box, Text } from "../../theme";
import { Divider, NavigateBack, SafeAreaWrapper } from "../../components";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const UserMain = () => {
  return (
    <SafeAreaWrapper>
      <ScrollView>
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
              mb="6"
            >
              My Page
            </Text>
            <Box mr="10"></Box>
          </Box>
          <Box height={16} />

          <Text variant="textXl" fontWeight="600" mb="2">
            계정
          </Text>
          <Box>
            <TouchableOpacity>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <FontAwesome5 name="user-edit" size={24} color="black" />
                <Text variant="textBase" fontWeight="600" ml="2">
                  Username 변경
                </Text>
              </Box>
            </TouchableOpacity>

            <TouchableOpacity>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialIcons name="logout" size={24} color="black" />
                <Text variant="textBase" fontWeight="600" ml="3">
                  로그아웃
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Text variant="textXl" fontWeight="600" mb="2">
            커뮤니티
          </Text>
          <Box>
            <TouchableOpacity>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="robot-angry"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="600" ml="3">
                  이용 규칙
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Text variant="textXl" fontWeight="600" mb="2">
            앱 설정
          </Text>
          <Box>
            <TouchableOpacity>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="600" ml="3">
                  다크모드
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Text variant="textXl" fontWeight="600" mb="2">
            이용안내
          </Text>
          <Box>
            <TouchableOpacity>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="robot-confused"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="600" ml="3">
                  문의하기
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialIcons name="feedback" size={24} color="black" />
                <Text variant="textBase" fontWeight="600" ml="3">
                  피드백 남기기
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default UserMain;
