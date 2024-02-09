import React, { useEffect, useState } from "react";
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
import { Alert } from "react-native";
import { quotes } from "../../assets/asset";

interface IQuote {
  content: string;
  author: string;
}

const UserMain = () => {
  const openLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const { logout } = useUserGlobalStore();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const theme = useTheme<Theme>();

  const [quote, setQuote] = useState<IQuote>();
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

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
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "문의하기",
                  "sunytime-auth@naver.com 으로 문의사항을 보내주시면 신속한 처리 도와드리겠습니다.",
                  [{ text: "OK", onPress: () => {} }]
                )
              }
            >
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

          <Box mt="10">
            <Text textAlign="center" fontWeight="600" fontSize={16}>
              {quote?.content}
            </Text>
            <Box height={8} />
            <Text textAlign="center" fontWeight="600" fontSize={14}>
              - {quote?.author} -
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default UserMain;
