import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as WebBrowser from "expo-web-browser";
import { Box, Text, Theme } from "../../theme";
import { Divider, NavigateBack, SafeAreaWrapper } from "../../components";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useTheme } from "@shopify/restyle";
import { Alert, useColorScheme } from "react-native";
import { quotes } from "../../assets/asset";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import useDarkMode from "../../store/useDarkMode";

interface IQuote {
  content: string;
  author: string;
}

const UserMain: React.FC<NativeStackScreenProps<any, "UserMain">> = ({
  navigation: { navigate },
}) => {
  const openLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const { logout } = useUserGlobalStore();

  const theme = useTheme<Theme>();

  const systemIsDark = useColorScheme() === "dark";
  const { isDarkMode, updateDarkMode } = useDarkMode();

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [picker, setPicker] = useState(true);
  const [pickerContents, setPickerContents] = useState("");
  const pickerRef = useRef<Picker<string>>(null);
  const togglePicker = (index: string) => {
    if (picker) {
      handleSnapPress();
      setPicker(false);
      setPickerContents(index);
    } else {
      handleClosePress();
      setPicker(true);
      setPickerContents(index);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setPicker(true);
    }
  }, []);
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  const navigateToMyAccount = () => {
    navigate("MainStack", {
      screen: "MyAccount",
    });
  };

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
            <TouchableOpacity onPress={navigateToMyAccount}>
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

            <TouchableOpacity
              onPress={() =>
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "Yes", onPress: () => logout() },
                  { text: "No", onPress: () => {} },
                ])
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
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "이용 규칙",
                  "SSUGANGPYEONG established rules to operate the community where anyone can use without any discomfort. Violations may result in postings being deleted and use of the service permanently restricted.\n\n Below is an summary of key content for using the bulletin board feature. \n\n  - In the case of posting illegaly filmed material, etc. \n\n- Acts that infringe on the rights of others or cause discomfort. \n\n - Acts that violate law, such as criminal or illegal acts. \n\n  - Acts of writing posts including content related to profanity, demeaning, discrimination, hatred, suicide, and violence. \n\n  - Pornography, acts that cause sexual shame.",
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
          <TouchableOpacity onPress={() => togglePicker("darkMode")}>
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
                <Text
                  variant="textBase"
                  fontWeight="600"
                  ml="3"
                  color="mainBgColor"
                >
                  다크모드: {isDarkMode?.mode}
                </Text>
              </Box>
            </Box>
          </TouchableOpacity>
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
            <Text textAlign="center" fontWeight="600" fontSize={16}>
              - {quote?.author === "" ? "?" : quote?.author} -
            </Text>
          </Box>
        </Box>
      </ScrollView>
      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        // backgroundStyle={{
        //   backgroundColor: isDark ? colors.DARKER_GREY : "white",
        // }}
      >
        <Box flexDirection="row" justifyContent="flex-end" mr="5">
          <TouchableOpacity
            onPress={() => {
              if (isDarkMode?.mode === "system") {
                if (systemIsDark) {
                  updateDarkMode({ mode: "dark" });
                } else {
                  updateDarkMode({ mode: "light" });
                }
              } else {
                updateDarkMode(isDarkMode);
              }

              handleClosePress();
            }}
          >
            <Text
              variant="textLg"
              fontWeight="600"
              style={{ color: theme.colors.sbuRed }}
            >
              확인
            </Text>
          </TouchableOpacity>
        </Box>
        <Picker
          ref={pickerRef}
          selectedValue={isDarkMode?.mode}
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue === "system") {
              if (systemIsDark) {
                updateDarkMode({ mode: "dark" });
              } else {
                updateDarkMode({ mode: "light" });
              }
            } else {
              updateDarkMode({ mode: itemValue });
            }
          }}
        >
          <Picker.Item label="시스템 기본값" value="system" />
          <Picker.Item label="켜짐" value="dark" />
          <Picker.Item label="꺼짐" value="light" />
        </Picker>
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default UserMain;
