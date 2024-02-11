import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigateBack, SafeAreaWrapper } from "../../components";
import { Box, Text, Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BulletinStackParamList } from "../../navigation/types";
import { Alert, TextInput, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import useSWRMutation from "swr/mutation";
import { Controller, useForm } from "react-hook-form";
import axiosInstance, { fetcher } from "../../utils/config";
import { IBulletinPost, IBulletinPostRequest } from "../../types";
import useSWR from "swr";

type WritePostScreenRouteProp = RouteProp<BulletinStackParamList, "WritePost">;

interface IPost {
  title: string;
  content: string;
}

const addBulletinPostRequest = async (
  url: string,
  { arg }: { arg: IBulletinPostRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in addBulletinPostRequest", error);
    throw error;
  }
};

const WritePost: React.FC<NativeStackScreenProps<any, "WritePost">> = ({
  navigation: { goBack },
}) => {
  const theme = useTheme<Theme>();

  const [isSelected, setSelection] = useState(true);

  const route = useRoute<WritePostScreenRouteProp>();
  const { board, courseInfo } = route.params;

  const { control, watch } = useForm<IPost>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { trigger: addBulletinPost } = useSWRMutation(
    "api/v1/bulletin/",
    addBulletinPostRequest
  );

  const createNewPost = async () => {
    const title = watch("title");
    const content = watch("content");

    // Check if title or content is empty
    if (!title.trim() || !content.trim()) {
      Alert.alert(
        "Empty Fields", // Title of the alert
        "Both title and content are required.", // Message of the alert
        [{ text: "OK" }] // Array of buttons
      );
      return; // Prevent the rest of the function from running
    }

    try {
      await addBulletinPost({
        title:
          board === "course"
            ? courseInfo + ": " + watch("title")
            : watch("title"),
        content: watch("content"),
        anonymity: isSelected,
        board,
      });

      if (board === "course") {
        courseBulletinMutate();
      } else {
        mutate();
      }

      goBack();
    } catch (error) {
      console.log("error in createNewPost", error);
      throw error;
    }
  };

  const { mutate } = useSWR<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(`/api/v1/bulletin?board=${board}`, fetcher);

  const { mutate: courseBulletinMutate } = useSWR<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(`/api/v1/bulletin?board=course&search=${courseInfo}`, fetcher);

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2" mb="-6">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb="4"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="600" mr="-8">
            {board === "Free"
              ? "자유 게시판"
              : board === "course"
              ? courseInfo
              : board === "courseRegister"
              ? "수강신청 게시판"
              : board === "Secret"
              ? "비밀 게시판"
              : board === "Freshmen"
              ? "새내기 게시판"
              : board === "Promotion"
              ? "홍보 게시판"
              : board === "Club"
              ? "동아리 게시판"
              : "본교 게시판"}
          </Text>
          <TouchableOpacity onPress={createNewPost}>
            <Box
              p="2"
              px="3"
              borderRadius="rounded-3xl"
              style={{
                backgroundColor: theme.colors.sbuRed,
              }}
            >
              <Text
                variant="textBase"
                fontWeight="600"
                style={{
                  color: theme.colors.white,
                }}
              >
                올리기
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>

        <Box height={"88%"} mx="3">
          <Box height={"90%"}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Title"
                  style={{
                    padding: 16,
                    height: "10%",
                    color: "black",
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.gray200,
                    marginBottom: 20,
                    fontSize: 20,
                  }}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoComplete={"off"}
                  autoCorrect={false}
                  keyboardAppearance={"default"}
                />
              )}
            />
            <Controller
              name="content"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Fill the content."
                  style={{
                    padding: 16,
                    color: "black",
                    fontSize: 16,
                    textAlignVertical: "top", // to align text to the top on Android
                    flex: 1,
                  }}
                  multiline
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoComplete={"off"}
                  autoCorrect={false}
                  keyboardAppearance={"default"}
                />
              )}
            />

            <Text mb="2" color="gray400">
              SSUGANGPYEONG established rules to operate the community where
              anyone can use without any discomfort. Violations may result in
              postings being deleted and use of the service permanently
              restricted.
            </Text>
            <Text color="gray400">
              Below is an summary of key content for using the bulletin board
              feature.
            </Text>
            <Text color="gray400">
              - In the case of posting illegaly filmed material, etc.
            </Text>
            <Text color="gray400">
              - Acts that infringe on the rights of others or cause discomfort.
            </Text>
            <Text color="gray400">
              - Acts that violate law, such as criminal or illegal acts.
            </Text>
            <Text color="gray400">
              - Acts of writing posts including content related to profanity,
              demeaning, discrimination, hatred, suicide, and violence.
            </Text>
            <Text color="gray400">
              - Pornography, acts that cause sexual shame.
            </Text>
          </Box>
        </Box>

        <Box alignSelf="flex-end" mr="3">
          <TouchableOpacity onPress={() => setSelection(!isSelected)}>
            <Box flexDirection="row" alignItems="center">
              <BouncyCheckbox
                size={25}
                fillColor={theme.colors.sbuRed}
                unfillColor="#FFFFFF"
                text="익명"
                iconStyle={{ borderColor: theme.colors.sbuRed }}
                innerIconStyle={{
                  borderWidth: 2,
                }}
                disableText
                isChecked={isSelected}
                disableBuiltInState
                onPress={() => setSelection(!isSelected)}
              />
              <Text
                ml="1"
                variant="textBase"
                style={{ color: theme.colors.sbuRed }}
              >
                익명
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default WritePost;
