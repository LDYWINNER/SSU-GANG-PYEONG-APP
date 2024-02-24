import React, { useState } from "react";
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
import useSWR from "swr";
import axiosInstance, { fetcher } from "../../utils/config";
import { IBulletinPost, ILikePostRequest } from "../../types";
import { Dimensions, TextInput, TouchableOpacity } from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import useUserGlobalStore from "../../store/useUserGlobal";
import { Menu, MenuItem } from "react-native-material-menu";
import useDarkMode from "../../store/useDarkMode";
import useSWRMutation from "swr/mutation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type BulletinPostScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinPost"
>;

const deletePostRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id);
  } catch (error) {
    console.log("error in deletePostRequest", error);
    throw error;
  }
};

const likePostRequest = async (
  url: string,
  { arg }: { arg: ILikePostRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in likePostRequest", error);
    throw error;
  }
};

const BulletinPost: React.FC<NativeStackScreenProps<any, "BulletinPost">> = ({
  navigation: { goBack },
}) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();

  const windowHeight = Dimensions.get("window").height;

  const { user } = useUserGlobalStore();

  const [isSelected, setSelection] = useState(true);

  const route = useRoute<BulletinPostScreenRouteProp>();
  const { id, board } = route.params;

  const {
    data,
    isLoading: isLoadingPost,
    mutate: mutatePost,
  } = useSWR<{ post: IBulletinPost }>(`/api/v1/bulletin/${id}`, fetcher);

  const { trigger: triggerDelete } = useSWRMutation(
    "api/v1/bulletin/",
    deletePostRequest
  );

  const { trigger: updatePosts } = useSWRMutation<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(`/api/v1/bulletin?board=${board}`, fetcher);

  const { trigger: likePostTrigger } = useSWRMutation(
    "api/v1/bulletin/",
    likePostRequest
  );

  const deletePost = async () => {
    try {
      await triggerDelete({
        id: post!._id,
      });
      updatePosts();
      goBack();
    } catch (error) {
      console.log("error in deleteTask", error);
      throw error;
    }
  };

  const likePost = async () => {
    try {
      const _updatePostReq = {
        id: post!._id,
        like: true,
      };
      await likePostTrigger(_updatePostReq);
      await mutatePost();
    } catch (error) {
      console.log("error in likePost", error);
      throw error;
    }
  };

  const { post } = data || {};

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  if (isLoadingPost || !post) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2" mb="-6">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text
            variant="textXl"
            fontWeight="600"
            mr={post.createdBy === user?._id ? "2" : "10"}
            color="textColor"
          >
            {post.board === "Free"
              ? "자유 게시판"
              : post.board === "courseRegister"
              ? "수강신청 게시판"
              : post.board === "Secret"
              ? "비밀 게시판"
              : post.board === "Freshmen"
              ? "새내기 게시판"
              : post.board === "Promotion"
              ? "홍보 게시판"
              : post.board === "Club"
              ? "동아리 게시판"
              : "본교 게시판"}
          </Text>
          {post.createdBy === user?._id ? (
            <Menu
              visible={visible}
              anchor={
                <Text onPress={showMenu}>
                  <MaterialIcons
                    name="more-vert"
                    size={30}
                    color={theme.colors.textColor}
                  />
                </Text>
              }
              onRequestClose={hideMenu}
            >
              <MenuItem onPress={hideMenu}>
                <Box flexDirection="row" alignItems="center">
                  <Box width={10} />
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={28}
                    color="black"
                  />
                  <Box width={6} />
                  <Text>글 수정하기</Text>
                </Box>
              </MenuItem>
              <MenuItem onPress={deletePost}>
                <Box flexDirection="row" alignItems="center">
                  <Box width={14} />
                  <FontAwesome5 name="trash" size={24} color="black" />
                  <Box width={10} />
                  <Text>글 삭제하기</Text>
                </Box>
              </MenuItem>
            </Menu>
          ) : (
            <Box />
          )}
        </Box>

        <ScrollView>
          <Box mt="5" mx="4">
            <Box flexDirection="row" alignItems="center">
              <FontAwesome
                name="user-circle"
                size={36}
                color={theme.colors.textColor}
              />
              <Box ml="2">
                <Text variant="textXl" fontWeight="700" color="textColor">
                  {post.anonymity ? "익명" : post.createdByUsername}
                </Text>
                <Text
                  color={isDarkMode?.mode === "dark" ? "gray300" : "gray650"}
                >
                  {moment(post.createdAt).format("MMMM Do, h:mm a")}
                </Text>
              </Box>
            </Box>

            <Box mt="3">
              <Text variant="textLg" fontWeight="600" color="textColor">
                {post.title}
              </Text>
              <Box height={6} />
              <Text variant="textBase" color="textColor">
                {post.content}
              </Text>

              <Box
                my="5"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box flexDirection="row" alignItems="center">
                  <FontAwesome5
                    name="thumbs-up"
                    size={24}
                    color={theme.colors.sbuRed}
                  />
                  <Box width={1} />
                  <Text
                    style={{
                      color: theme.colors.sbuRed,
                    }}
                    variant="textBase"
                  >
                    {post.likes.length}
                  </Text>
                  <Box width={10} />
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color={theme.colors.blu600}
                  />
                  <Box width={2} />
                  <Text
                    style={{
                      color: theme.colors.blu600,
                    }}
                    variant="textBase"
                  >
                    {post.comments.length}
                  </Text>
                </Box>

                <TouchableOpacity onPress={likePost}>
                  <Box
                    bg="gray300"
                    px="3"
                    py="2"
                    borderRadius="rounded-xl"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <FontAwesome5
                      name="thumbs-up"
                      size={16}
                      color={theme.colors.gray500}
                    />
                    <Box width={6} />
                    <Text fontWeight="500">공감</Text>
                  </Box>
                </TouchableOpacity>
              </Box>

              <Divider />

              {post.comments.map((comment, commentIndex) => (
                <Box mt="3" key={comment._id}>
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb="2"
                  >
                    <Box flexDirection="row" alignItems="center">
                      <FontAwesome
                        name="user-circle"
                        size={24}
                        color={theme.colors.textColor}
                      />
                      <Box ml="2">
                        <Text
                          variant="textBase"
                          fontWeight="700"
                          color="textColor"
                        >
                          {post.anonymity
                            ? `익명${commentIndex + 1}`
                            : post.createdByUsername}
                        </Text>
                      </Box>
                    </Box>

                    <Box>
                      <Box
                        bg="gray300"
                        px="3"
                        py="2"
                        borderRadius="rounded-xl"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <TouchableOpacity>
                          <Ionicons
                            name="chatbubble-outline"
                            size={16}
                            color={theme.colors.gray500}
                          />
                        </TouchableOpacity>
                        <Text>
                          {"   "}| {"  "}
                        </Text>
                        <TouchableOpacity>
                          <FontAwesome5
                            name="thumbs-up"
                            size={16}
                            color={theme.colors.gray500}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </Box>
                  <Text variant="textBase" color="textColor">
                    {comment.text}
                  </Text>
                  <Box height={6} />
                  <Box flexDirection="row" alignItems="center">
                    <Text
                      style={{
                        color: theme.colors.gray500,
                      }}
                    >
                      {moment(comment.createdAt).format("MMMM Do, h:mm a")}
                    </Text>
                    <Box width={10} />
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
                      {comment.likes.length}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </ScrollView>

        <Box
          flexDirection="row"
          alignItems="center"
          position="absolute"
          bottom={windowHeight * 0.03}
          style={{ backgroundColor: theme.colors.gray400 }}
          p="2"
          borderRadius="rounded-2xl"
          width={"100%"}
        >
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
          <Box width={"75%"}>
            <Box height={5} />
            <TextInput
              placeholder="Write a comment."
              placeholderTextColor={theme.colors.gray300}
              style={{
                padding: 16,
                borderColor: theme.colors.grey,
                borderRadius: theme.borderRadii["rounded-7xl"],
                height: "100%",
                marginBottom: -6,
              }}
              multiline
              autoComplete={"off"}
              autoCorrect={false}
              keyboardAppearance={"default"}
            />
          </Box>
          <Box width={6} />
          <TouchableOpacity>
            <FontAwesome name="send" size={24} color={theme.colors.sbuRed} />
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinPost;
