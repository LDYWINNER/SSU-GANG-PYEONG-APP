import React, { useCallback, useMemo, useRef, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Dimensions,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { MainStackParamList } from "../navigation/types";
import { Divider, Loader, NavigateBack, SafeAreaWrapper } from "../components";
import { Box, Text, Theme } from "../theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { fetcher } from "../utils/config";
import { IBulletinPost } from "../types";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import moment from "moment";
import useSWRMutation from "swr/mutation";
import { Controller, useForm } from "react-hook-form";
import BottomSheet, {
  BottomSheetBackdrop,
  WINDOW_HEIGHT,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useFocusEffect } from "@react-navigation/native";
import useDarkMode from "../store/useDarkMode";
import useUserGlobalStore from "../store/useUserGlobal";

interface ISearch {
  crsNum: string;
}

type CourseBulletinScreenRouteProp = RouteProp<
  MainStackParamList,
  "CourseBulletin"
>;

const CourseBulletin: React.FC<
  NativeStackScreenProps<any, "CourseBulletin">
> = ({ navigation: { navigate } }) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const { user } = useUserGlobalStore();

  const navigateToBulletinPost = (postId: string) => {
    navigate("BulletinStack", {
      screen: "BulletinPost",
      params: { id: postId },
    });
  };

  const navigateToWritePost = (name: string) => {
    navigate("MainStack", {
      screen: "WritePost",
      params: { board: name, courseInfo: searchSubj + watch("crsNum") },
    });
  };

  const route = useRoute<CourseBulletinScreenRouteProp>();
  const { courseSubj, courseNumber } = route.params || {
    courseSubj: null,
    courseNumber: null,
  };

  const [searchSubj, setSearchSubj] = useState<string>(
    courseSubj ? courseSubj : "AMS"
  );

  const { control, handleSubmit, watch, setValue } = useForm<ISearch>({
    defaultValues: {
      crsNum: courseNumber ? courseNumber : "",
    },
  });

  const onSubmit = async (data: ISearch) => {
    try {
      await trigger();
    } catch (error) {
      console.log("error in submitting search course", error);
      throw error;
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await trigger();
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const {
    data: posts,
    trigger,
    isMutating,
  } = useSWRMutation<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(
    courseSubj
      ? `api/v1/bulletin?board=course&search=${courseSubj}${courseNumber}`
      : `api/v1/bulletin?board=course&search=${searchSubj}${watch("crsNum")}`,
    fetcher
  );

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
      trigger();
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

  useFocusEffect(
    useCallback(() => {
      trigger();
    }, [])
  );

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2" mb="-6">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="600" mr="2" color="textColor">
            수업별 게시판
          </Text>
          <Box mr="6" />
        </Box>

        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => togglePicker("searchSubj")}>
            <Box flexDirection="row" alignItems="center" p="4">
              <Ionicons
                name="chevron-down"
                size={24}
                color={theme.colors.textColor}
              />
              <Text variant="text2Xl" marginLeft={"2"} color="textColor">
                {searchSubj === "SHCourse" ? "교양/Writing" : searchSubj}
              </Text>
            </Box>
          </TouchableOpacity>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box
                bg="gray250"
                borderRadius="rounded-2xl"
                flexDirection="row"
                alignItems="center"
                px="4"
                flex={1}
                mr="4"
              >
                <Ionicons name="search" size={24} color={theme.colors.gray5} />
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Course Number (ex: 101)"
                  style={{
                    fontSize: 20,
                    lineHeight: 26,
                    padding: 16,
                  }}
                  value={value}
                  maxLength={36}
                  placeholderTextColor={theme.colors.gray5}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </Box>
            )}
            name="crsNum"
          />
        </Box>

        {posts && (
          <Box mt="3" ml="3">
            <Text variant="textLg" fontWeight="600" color="textColor">
              {posts?.bulletinTotalPosts} posts
            </Text>
          </Box>
        )}

        {isMutating ? (
          <Loader />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.sbuRed]} // For Android
                tintColor={theme.colors.sbuRed} // For iOS
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {posts?.bulletinAllPosts.map((post) => (
              <Box key={post._id}>
                <TouchableOpacity
                  onPress={() => navigateToBulletinPost(post._id)}
                >
                  <Box my="5" mx="4">
                    <Text variant="textBase" fontWeight="600" color="textColor">
                      {post.title}
                    </Text>
                    <Text
                      variant="textSm"
                      fontWeight="500"
                      color="textColor"
                      mt="2"
                      mb="1"
                    >
                      {post.content.substring(0, 43)}
                      {post.content.length > 43 && "..."}
                    </Text>

                    <Box flexDirection="row" alignItems="center" mt="1">
                      <Text>
                        <FontAwesome5
                          name="thumbs-up"
                          size={16}
                          color={theme.colors.sbuRed}
                        />
                        <Box width={1} />
                        <Text
                          style={{
                            color: theme.colors.sbuRed,
                          }}
                        >
                          {post.likes.length}
                        </Text>
                        <Box width={4} />
                        <Ionicons
                          name="chatbubble-outline"
                          size={16}
                          color={theme.colors.blu600}
                        />
                        <Box width={2} />
                        <Text
                          style={{
                            color: theme.colors.blu600,
                          }}
                        >
                          {post.comments.length}
                        </Text>
                      </Text>
                      <Text
                        color={
                          isDarkMode?.mode === "system"
                            ? systemIsDark
                              ? "gray300"
                              : "gray650"
                            : isDarkMode?.mode === "dark"
                            ? "gray300"
                            : "gray650"
                        }
                      >
                        {" "}
                        |{" "}
                      </Text>
                      <Text
                        color={
                          isDarkMode?.mode === "system"
                            ? systemIsDark
                              ? "gray300"
                              : "gray650"
                            : isDarkMode?.mode === "dark"
                            ? "gray300"
                            : "gray650"
                        }
                      >
                        {moment(post.createdAt).format("MMMM Do, h:mm a")}
                      </Text>
                      <Text
                        color={
                          isDarkMode?.mode === "system"
                            ? systemIsDark
                              ? "gray300"
                              : "gray650"
                            : isDarkMode?.mode === "dark"
                            ? "gray300"
                            : "gray650"
                        }
                      >
                        {" "}
                        |{" "}
                      </Text>
                      <Text
                        color={
                          isDarkMode?.mode === "system"
                            ? systemIsDark
                              ? "gray300"
                              : "gray650"
                            : isDarkMode?.mode === "dark"
                            ? "gray300"
                            : "gray650"
                        }
                      >
                        {post.anonymity ? "익명" : post.createdByUsername}
                      </Text>
                    </Box>
                  </Box>
                </TouchableOpacity>
                <Divider />
              </Box>
            ))}
          </ScrollView>
        )}

        {!user!.blocked ? (
          <TouchableOpacity onPress={() => navigateToWritePost("course")}>
            <Box
              flexDirection="row"
              alignItems="center"
              position="absolute"
              right={windowWidth * 0.38}
              bottom={windowHeight * -0.09 + 130}
              style={{ backgroundColor: theme.colors.sbuRed }}
              p="2"
              borderRadius="rounded-2xl"
            >
              <MaterialCommunityIcons
                name="pencil-plus-outline"
                size={24}
                color={theme.colors.white}
              />
              <Box width={6} />
              <Text
                fontWeight="700"
                style={{
                  color: theme.colors.white,
                }}
              >
                글 쓰기
              </Text>
            </Box>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled>
            <Box
              flexDirection="row"
              alignItems="center"
              position="absolute"
              right={windowWidth * 0.38}
              bottom={windowHeight * -0.09 + 130}
              style={{ backgroundColor: theme.colors.gray400 }}
              p="2"
              borderRadius="rounded-2xl"
            >
              <MaterialCommunityIcons
                name="pencil-plus-outline"
                size={24}
                color={theme.colors.white}
              />
              <Box width={6} />
              <Text
                fontWeight="700"
                style={{
                  color: theme.colors.white,
                }}
              >
                글 쓰기
              </Text>
            </Box>
          </TouchableOpacity>
        )}
      </Box>

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
        <Box flexDirection="row" justifyContent="space-between" mr="5" ml="4">
          <TouchableOpacity
            onPress={() => {
              setSearchSubj("ALL");
              setValue("crsNum", "");
              handleClosePress();
            }}
          >
            <Text
              variant="textLg"
              fontWeight="600"
              style={{ color: theme.colors.sbuRed }}
            >
              초기화
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSearchSubj(searchSubj);
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
          selectedValue={searchSubj}
          onValueChange={(itemValue, itemIndex) => setSearchSubj(itemValue)}
        >
          <Picker.Item label="AMS" value="AMS" color={theme.colors.textColor} />
          <Picker.Item
            label="ACC/BUS"
            value="ACC/BUS"
            color={theme.colors.textColor}
          />
          <Picker.Item label="CSE" value="CSE" color={theme.colors.textColor} />
          <Picker.Item label="ESE" value="ESE" color={theme.colors.textColor} />
          <Picker.Item
            label="EST/EMP"
            value="EST/EMP"
            color={theme.colors.textColor}
          />
          <Picker.Item label="MEC" value="MEC" color={theme.colors.textColor} />
          <Picker.Item
            label="교양/Writing"
            value="SHCourse"
            color={theme.colors.textColor}
          />
        </Picker>
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default CourseBulletin;
