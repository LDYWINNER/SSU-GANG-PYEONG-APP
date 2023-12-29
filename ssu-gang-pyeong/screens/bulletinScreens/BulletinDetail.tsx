import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { BulletinStackParamList } from "../../navigation/types";
import {
  Divider,
  Loader,
  NavigateBack,
  SafeAreaWrapper,
} from "../../components";
import { Box, Text, Theme } from "../../theme";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { IBulletinPost } from "../../types";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import moment from "moment";

type BulletinDetailScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinDetail"
>;

const BulletinDetail: React.FC<
  NativeStackScreenProps<any, "BulletinDetail">
> = ({ navigation: { navigate } }) => {
  const theme = useTheme<Theme>();

  const route = useRoute<BulletinDetailScreenRouteProp>();
  const { name } = route.params;

  const navigateToBulletinPost = (postId: string) => {
    navigate("BulletinStack", {
      screen: "BulletinPost",
      params: { id: postId },
    });
  };

  const { data: posts, isLoading: isLoadingPosts } = useSWR<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(`/api/v1/bulletin?board=${name}`, fetcher);

  if (isLoadingPosts) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="600" mr="2">
            {name === "Free"
              ? "자유 게시판"
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
            <TouchableOpacity onPress={() => navigate("BulletinSearch")}>
              <Ionicons name="md-search" size={30} color="black" />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box mt="3" ml="3">
          <Text variant="textLg" fontWeight="600">
            {posts?.bulletinTotalPosts} posts
          </Text>
        </Box>

        <ScrollView>
          {posts?.bulletinAllPosts.map((post) => (
            <Box key={post._id}>
              <TouchableOpacity
                onPress={() => navigateToBulletinPost(post._id)}
              >
                <Box my="5" mx="4">
                  <Text variant="textBase" fontWeight="600">
                    {post.title}
                  </Text>
                  <Text
                    variant="textBase"
                    fontWeight="500"
                    style={{
                      color: theme.colors.gray600,
                    }}
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
        </ScrollView>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinDetail;
