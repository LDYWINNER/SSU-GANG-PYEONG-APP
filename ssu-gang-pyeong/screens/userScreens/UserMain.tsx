import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { Box, Text, Theme } from "../../theme";
import { Divider, NavigateBack, SafeAreaWrapper } from "../../components";
import {
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useTheme } from "@shopify/restyle";

const UserMain = () => {
  const openLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const { logout } = useUserGlobalStore();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const theme = useTheme<Theme>();

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

            <TouchableOpacity onPress={logout}>
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
          <Divider />

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
          <Divider />

          <Text variant="textXl" fontWeight="600" mb="2">
            앱 설정
          </Text>
          <Box>
            <Box
              bg="gray200"
              borderRadius="rounded-2xl"
              mb="3"
              p="3"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                <MaterialCommunityIcons
                  name="theme-light-dark"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="600" ml="3">
                  다크모드
                </Text>
              </Box>
              <Box mr="3">
                <Switch
                  trackColor={{ false: "#767577", true: "#767577" }}
                  thumbColor={isEnabled ? theme.colors.iconBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </Box>
            </Box>
          </Box>
          <Divider />

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
            <TouchableOpacity
              onPress={() => openLink("https://forms.gle/C1KPvABMzFSGCUVM6")}
            >
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
