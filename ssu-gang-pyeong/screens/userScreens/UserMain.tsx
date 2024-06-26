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
import { Alert } from "react-native";
import { quotes } from "../../assets/asset";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BottomSheet, {
  BottomSheetBackdrop,
  WINDOW_HEIGHT,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import useDarkMode from "../../store/useDarkMode";
import { AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../utils/config";
import useSWRMutation from "swr/mutation";

interface IQuote {
  content: string;
  author: string;
}

const userDeleteRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.post(url + "/" + arg.id);
  } catch (error) {
    console.log("error in userDeleteRequest", error);
    throw error;
  }
};

const UserMain: React.FC<NativeStackScreenProps<any, "UserMain">> = ({
  navigation: { navigate },
}) => {
  const openLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const { logout } = useUserGlobalStore();

  const theme = useTheme<Theme>();
  const { isDarkMode, updateDarkMode } = useDarkMode();

  const { user } = useUserGlobalStore();

  const { trigger: userDeleteTrigger } = useSWRMutation(
    `api/v1/auth/userDelete`,
    userDeleteRequest
  );

  const userDelete = async () => {
    try {
      const _userDeleteReq = {
        id: user!._id,
      };
      await userDeleteTrigger(_userDeleteReq);
    } catch (error) {
      console.log("error in userDelete", error);
      throw error;
    }
  };

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [270], []);
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
              color="textColor"
            >
              My Page
            </Text>
            <Box mr="10"></Box>
          </Box>
          <Box height={16} />

          <Text variant="textXl" fontWeight="600" mb="2" color="textColor">
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
                Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
                  { text: "아니오", onPress: () => {} },
                  { text: "네", onPress: () => logout() },
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

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "계정 삭제 요청",
                  "계정을 영구적으로 삭제하시겠습니까? 계정 삭제를 요청하게 되면 관련 개인 데이터를 비롯한 전체 계정 기록이 삭제됩니다. 계정 삭제는 요청 후 영업일 기준 최대 3일 내로 삭제되므로 계정 삭제를 철회하고 싶으시면 ssugangpyeong@gmail.com으로 관련 내용과 함께 문의해주시기 바랍니다.",
                  [
                    { text: "아니오", onPress: () => {} },
                    { text: "예", onPress: () => userDelete() },
                  ]
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
                <AntDesign name="deleteuser" size={24} color="black" />
                <Text variant="textBase" fontWeight="600" ml="3">
                  계정 삭제
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Divider />

          <Text
            variant="textXl"
            fontWeight="600"
            mb="2"
            mt="2"
            color="textColor"
          >
            커뮤니티
          </Text>
          <Box>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "이용 규칙",
                  "SSUGANGPYEONG established rules to operate the community where anyone can use without any discomfort. Violations may result in postings being deleted and use of the service permanently restricted.\n\n Below is an summary of key content for using the bulletin board feature. \n\n- Acts that infringe on the rights of others or cause discomfort. \n\n - Acts that violate law, such as criminal or illegal acts. \n\n  - Acts of writing posts including content related to profanity, demeaning, discrimination, hatred, suicide, and violence. \n\n  - Pornography, acts that cause sexual shame.",
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

          <Text
            variant="textXl"
            fontWeight="600"
            mb="2"
            color="textColor"
            mt="2"
          >
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
                <Text variant="textBase" fontWeight="600" ml="3">
                  다크모드: {isDarkMode?.mode}
                </Text>
              </Box>
            </Box>
          </TouchableOpacity>
          <Divider />

          <Text
            variant="textXl"
            fontWeight="600"
            mb="2"
            color="textColor"
            mt="2"
          >
            이용안내
          </Text>
          <Box>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "문의하기",
                  "ssugangpyeong@gmail.com 으로 문의사항을 보내주시면 신속한 처리 도와드리겠습니다.",
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
              onPress={() => openLink("https://forms.gle/popW3deHdLh6RfcR9")}
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

          <Box mt="5">
            <Text
              textAlign="center"
              fontWeight="600"
              fontSize={16}
              color="textColor"
            >
              {quote?.content}
            </Text>
            <Box height={8} />
            <Text
              textAlign="center"
              fontWeight="600"
              fontSize={16}
              color="textColor"
            >
              - {quote?.author === "" ? "?" : quote?.author} -
            </Text>
          </Box>
        </Box>
        <Box height={WINDOW_HEIGHT * 0.05} />
      </ScrollView>

      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.mainBgColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.textColor,
        }}
      >
        <Box flexDirection="row" justifyContent="flex-end" mr="5">
          <TouchableOpacity
            onPress={() => {
              updateDarkMode(isDarkMode);
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
            updateDarkMode({ mode: itemValue });
          }}
        >
          <Picker.Item
            label="시스템 기본값"
            value="system"
            color={theme.colors.textColor}
          />
          <Picker.Item
            label="켜짐"
            value="dark"
            color={theme.colors.textColor}
          />
          <Picker.Item
            label="꺼짐"
            value="light"
            color={theme.colors.textColor}
          />
        </Picker>
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default UserMain;
