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
import {
  IBulletinCommentRequest,
  IBulletinPost,
  IComment,
  ILikePostRequest,
} from "../../types";
import {
  Alert,
  Dimensions,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from "react-native";
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
import { Controller, useForm } from "react-hook-form";
import { Octicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";

type BulletinPostScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinPost"
>;

const reportPostRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.post(url + "/" + arg.id);
  } catch (error) {
    console.log("error in reportPostRequest", error);
    throw error;
  }
};

const reportCommentRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.post(url + "/" + arg.id);
  } catch (error) {
    console.log("error in reportCommentRequest", error);
    throw error;
  }
};

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

const addBulletinCommentRequest = async (
  url: string,
  { arg }: { arg: IBulletinCommentRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in addBulletinCommentRequest", error);
    throw error;
  }
};

const deleteCommentRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id);
  } catch (error) {
    console.log("error in deleteCommentRequest", error);
    throw error;
  }
};

const likeCommentRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.patch(url + "/" + arg.id);
  } catch (error) {
    console.log("error in likeCommentRequest", error);
    throw error;
  }
};

const hateUserRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.patch(url + "/" + arg.id);
  } catch (error) {
    console.log("error in hateUserRequest", error);
    throw error;
  }
};

const BulletinPost: React.FC<NativeStackScreenProps<any, "BulletinPost">> = ({
  navigation: { navigate, goBack },
}) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const windowHeight = Dimensions.get("window").height;

  const { user } = useUserGlobalStore();

  const [anonymity, setAnonymity] = useState(true);

  const route = useRoute<BulletinPostScreenRouteProp>();
  const { id, board } = route.params;

  const { control, watch, reset } = useForm<IComment>({
    defaultValues: {
      text: "",
    },
  });

  const {
    data,
    isLoading: isLoadingPost,
    mutate: mutatePost,
  } = useSWR<{ post: IBulletinPost }>(`/api/v1/bulletin/${id}`, fetcher);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await mutatePost();
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const { trigger: updatePosts } = useSWRMutation<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(`/api/v1/bulletin?board=${board}`, fetcher);

  const { trigger: triggerDelete } = useSWRMutation(
    "api/v1/bulletin/",
    deletePostRequest
  );

  const { trigger: likePostTrigger } = useSWRMutation(
    "api/v1/bulletin/",
    likePostRequest
  );

  const { trigger: addBulletinComment } = useSWRMutation(
    `api/v1/bulletin/${id}`,
    addBulletinCommentRequest
  );

  const { trigger: commentDeleteTrigger } = useSWRMutation(
    "api/v1/bulletin/comment",
    deleteCommentRequest
  );

  const { trigger: likeCommentTrigger } = useSWRMutation(
    "api/v1/bulletin/comment",
    likeCommentRequest
  );

  const { trigger: hateUserTrigger } = useSWRMutation(
    "api/v1/bulletin/hateUser",
    hateUserRequest
  );

  const { trigger: reportPostTrigger } = useSWRMutation(
    `api/v1/bulletin/report-post`,
    reportPostRequest
  );

  const { trigger: reportCommentTrigger } = useSWRMutation(
    `api/v1/bulletin/report-comment`,
    reportCommentRequest
  );

  const hateUser = async (userId: string) => {
    try {
      await hateUserTrigger({
        id: userId,
      });
      goBack();
    } catch (error) {
      console.log("error in hateUser", error);
      throw error;
    }
  };

  const reportPost = async () => {
    try {
      const _reportPostReq = {
        id: post!._id,
      };
      await reportPostTrigger(_reportPostReq);
    } catch (error) {
      console.log("error in reportPost", error);
      throw error;
    }
  };

  const reportComment = async (commentId: string) => {
    try {
      const _reportCommentReq = {
        id: commentId,
      };
      await reportCommentTrigger(_reportCommentReq);
    } catch (error) {
      console.log("error in reportComment", error);
      throw error;
    }
  };

  const addComment = async () => {
    const text = watch("text");

    if (!text.trim()) {
      Alert.alert("Empty Fields", "Text is required.", [{ text: "OK" }]);
      return;
    }

    try {
      await addBulletinComment({
        text: text,
        anonymity: anonymity,
      });

      reset({ text: "" });

      mutatePost();
    } catch (error) {
      console.log("error in addComment", error);
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

  const deleteComment = async (commentId: string) => {
    try {
      await commentDeleteTrigger({
        id: commentId,
      });
      await mutatePost();
    } catch (error) {
      console.log("error in deleteTask", error);
      throw error;
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      const _updateCommentReq = {
        id: commentId,
      };
      await likeCommentTrigger(_updateCommentReq);
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
            mr={!user?.blocked ? "2" : "10"}
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
          {!user?.blocked ? (
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
              {post.createdBy === user?._id ? (
                <>
                  <MenuItem
                    onPress={() => {
                      hideMenu();
                      navigate("MainStack", {
                        screen: "WritePost",
                        params: { post },
                      });
                    }}
                  >
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
                </>
              ) : (
                <Box mt="2" mb="1">
                  <MenuItem
                    onPress={() => {
                      Alert.alert(
                        "신고",
                        "해당 게시물이 부적절하다고 판단하시나요? 게시물을 신고하면 24시간 내에 검토되며, 부적절하다고 판단되면 해당 게시물은 해당 기간내에 삭제될 것입니다. 해당 작성자에 대해서도 조취를 취하게 됩니다.",
                        [
                          { text: "아니오", onPress: () => {} },
                          {
                            text: "네",
                            onPress: () => {
                              reportPost();
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Box width={14} />
                      <Octicons name="report" size={24} color="black" />
                      <Box width={10} />
                      <Text>글 신고하기</Text>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onPress={() => {
                      Alert.alert(
                        "유저 차단",
                        "글쓴이를 차단하시겠습니까? 차단하면 해당 유저의 글과 댓글을 영구적으로 볼 수 없습니다.",
                        [
                          { text: "아니오", onPress: () => {} },
                          {
                            text: "네",
                            onPress: () => hateUser(post.createdBy),
                          },
                        ]
                      );
                    }}
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Box width={14} />
                      <Entypo name="block" size={24} color="black" />
                      <Box width={10} />
                      <Text>유저 차단하기</Text>
                    </Box>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          ) : (
            <Box />
          )}
        </Box>

        <ScrollView
          contentContainerStyle={{ minHeight: WINDOW_HEIGHT * 1.1 }}
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

                {!user?.blocked ? (
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
                ) : null}
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
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert("공감", "이 댓글에 공감하시겠습니까?", [
                              { text: "아니오", onPress: () => {} },
                              {
                                text: "네",
                                onPress: () => likeComment(comment._id),
                              },
                            ])
                          }
                        >
                          <FontAwesome5
                            name="thumbs-up"
                            size={16}
                            color={theme.colors.gray500}
                          />
                        </TouchableOpacity>
                        <>
                          <Text color="gray500">
                            {"   "}| {"  "}
                          </Text>
                          {comment.createdBy === user?._id ? (
                            <TouchableOpacity
                              onPress={() =>
                                Alert.alert(
                                  "삭제",
                                  "이 댓글을 삭제하시겠습니까?",
                                  [
                                    { text: "아니오", onPress: () => {} },
                                    {
                                      text: "네",
                                      onPress: () => deleteComment(comment._id),
                                    },
                                  ]
                                )
                              }
                            >
                              <FontAwesome5
                                name="trash"
                                size={16}
                                color={theme.colors.gray500}
                              />
                            </TouchableOpacity>
                          ) : (
                            <>
                              <TouchableOpacity
                                onPress={() =>
                                  Alert.alert(
                                    "신고",
                                    "해당 댓글이 부적절하다고 판단하시나요? 댓글을 신고하면 24시간 내에 검토되며, 부적절하다고 판단되면 해당 댓글은 해당 기간내에 삭제될 것입니다. 해당 작성자에 대해서도 조취를 취하게 됩니다.",
                                    [
                                      { text: "아니오", onPress: () => {} },
                                      {
                                        text: "네",
                                        onPress: () =>
                                          reportComment(comment._id),
                                      },
                                    ]
                                  )
                                }
                              >
                                <Octicons
                                  name="report"
                                  size={16}
                                  color={theme.colors.gray500}
                                />
                              </TouchableOpacity>
                              <Text color="gray500">
                                {"   "}| {"  "}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  Alert.alert(
                                    "유저 차단",
                                    "글쓴이를 차단하시겠습니까? 차단하면 해당 유저의 글과 댓글을 영구적으로 볼 수 없습니다.",
                                    [
                                      { text: "아니오", onPress: () => {} },
                                      {
                                        text: "네",
                                        onPress: () =>
                                          hateUser(comment.createdBy),
                                      },
                                    ]
                                  );
                                }}
                              >
                                <Box flexDirection="row" alignItems="center">
                                  <Entypo
                                    name="block"
                                    size={16}
                                    color={theme.colors.gray500}
                                  />
                                </Box>
                              </TouchableOpacity>
                            </>
                          )}
                        </>
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

        {!user?.blocked ? (
          <Box
            flexDirection="row"
            alignItems="center"
            position="absolute"
            bottom={windowHeight * -0.09 + 110}
            style={{ backgroundColor: theme.colors.gray400 }}
            p="2"
            borderRadius="rounded-2xl"
            width={"100%"}
            pr="4"
          >
            <TouchableOpacity onPress={() => setAnonymity(!anonymity)}>
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
                  isChecked={anonymity}
                  disableBuiltInState
                  onPress={() => setAnonymity(!anonymity)}
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
              <Controller
                name="text"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
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
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    autoComplete={"off"}
                    autoCorrect={false}
                    keyboardAppearance={"default"}
                  />
                )}
              />
            </Box>
            <Box width={6} />
            <TouchableOpacity onPress={addComment}>
              <FontAwesome name="send" size={24} color={theme.colors.sbuRed} />
            </TouchableOpacity>
          </Box>
        ) : null}
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinPost;
