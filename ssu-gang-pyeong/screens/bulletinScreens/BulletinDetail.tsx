import React, { useCallback } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { BulletinStackParamList } from "../../navigation/types";
import {
  Divider,
  Loader,
  NavigateBack,
  SafeAreaWrapper,
} from "../../components";
import { Box, Text, Theme } from "../../theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { IBulletinPost } from "../../types";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import moment from "moment";
import useDarkMode from "../../store/useDarkMode";
import { useFocusEffect } from "@react-navigation/native";
import useUserGlobalStore from "../../store/useUserGlobal";

type BulletinDetailScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinDetail"
>;

const BulletinDetail: React.FC<
  NativeStackScreenProps<any, "BulletinDetail">
> = ({ navigation: { navigate } }) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const { user } = useUserGlobalStore();

  const route = useRoute<BulletinDetailScreenRouteProp>();
  const { name } = route.params;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await mutate();
    } catch (error) {
      console.error("Error refreshing data: ", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const navigateToBulletinPost = (postId: string) => {
    navigate("BulletinStack", {
      screen: "BulletinPost",
      params: { id: postId, board: name },
    });
  };

  const navigateToWritePost = (name: string) => {
    navigate("MainStack", {
      screen: "WritePost",
      params: { board: name },
    });
  };

  const navigateToBulletinSearch = (name: string) => {
    navigate("BulletinStack", {
      screen: "BulletinSearch",
      params: { board: name },
    });
  };

  const {
    data: posts,
    isLoading: isLoadingPosts,
    mutate,
  } = useSWR<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(`/api/v1/bulletin?board=${name}`, fetcher);

  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [])
  );

  if (isLoadingPosts) {
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
          <Text variant="textXl" fontWeight="600" mr="2" color="textColor">
            {name === "Free"
              ? "자유 게시판"
              : name === "course"
              ? "수업별 게시판"
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
          <Box mr="1">
            <TouchableOpacity onPress={() => navigateToBulletinSearch(name)}>
              <Ionicons
                name="md-search"
                size={30}
                color={theme.colors.textColor}
              />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box mt="3" ml="3">
          <Text variant="textLg" fontWeight="600" color="textColor">
            {posts?.bulletinTotalPosts} posts
          </Text>
        </Box>

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
                    color={
                      isDarkMode?.mode === "system"
                        ? systemIsDark
                          ? "gray300"
                          : "gray650"
                        : isDarkMode?.mode === "dark"
                        ? "gray300"
                        : "gray650"
                    }
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
                      style={{
                        color: theme.colors.gray400,
                      }}
                    >
                      {" "}
                      |{" "}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.gray500,
                      }}
                    >
                      {moment(post.createdAt).format("MMMM Do, h:mm a")}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.gray400,
                      }}
                    >
                      {" "}
                      |{" "}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.gray500,
                      }}
                    >
                      {post.anonymity ? "익명" : post.createdByUsername}
                    </Text>
                  </Box>
                </Box>
              </TouchableOpacity>
              <Divider />
            </Box>
          ))}
          <Box height={windowHeight * 0.1} />
        </ScrollView>

        {!user!.blocked ? (
          Platform.OS === "ios" ? (
            <TouchableOpacity
              onPress={() => navigateToWritePost(name)}
              style={{ zIndex: 1 }}
            >
              <Box
                flexDirection="row"
                alignItems="center"
                position="absolute"
                right={windowWidth * 0.38}
                bottom={windowHeight * -0.09 + 110}
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
            <TouchableNativeFeedback
              onPress={() => navigateToWritePost(name)}
              style={{ zIndex: 1 }}
              // background={TouchableNativeFeedback.Ripple("white", false)}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
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
            </TouchableNativeFeedback>
          )
        ) : (
          <TouchableOpacity disabled>
            <Box
              flexDirection="row"
              alignItems="center"
              position="absolute"
              right={windowWidth * 0.38}
              bottom={
                Platform.OS === "ios"
                  ? windowHeight * -0.09 + 110
                  : windowHeight * -0.09 + 130
              }
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
    </SafeAreaWrapper>
  );
};

export default BulletinDetail;
