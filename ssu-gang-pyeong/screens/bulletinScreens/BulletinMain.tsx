import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Divider, Loader, SafeAreaWrapper } from "../../components";
import { Box, Text, Theme } from "../../theme";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { IBulletinPost } from "../../types";
import { useTheme } from "@shopify/restyle";
import moment from "moment";

const BulletinMain: React.FC<NativeStackScreenProps<any, "BulletinMain">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();

  const navigateToBulletinDetail = (BulletinName: string) => {
    navigate("BulletinStack", {
      screen: "BulletinDetail",
      params: { name: BulletinName },
    });
  };

  const navigateToCourseBulletin = () => {
    navigate("BulletinStack", {
      screen: "CourseBulletin",
    });
  };

  const navigateToBulletinPost = (postId: string) => {
    navigate("BulletinStack", {
      screen: "BulletinPost",
      params: { id: postId },
    });
  };

  const navigateToBulletinSearch = (name: string) => {
    navigate("BulletinStack", {
      screen: "BulletinSearch",
      params: { board: name },
    });
  };

  const navigateToUserMain = () => {
    navigate("MainStack", {
      screen: "UserMain",
    });
  };

  const { data: posts, isLoading: isLoadingPosts } = useSWR<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>("/api/v1/bulletin?board=Promotion", fetcher);

  if (isLoadingPosts) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box bg="gray200" height={"105%"}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mx="4"
          mt="4"
        >
          <Text variant="text2Xl" fontWeight="600">
            게시판
          </Text>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box mr="3">
              <TouchableOpacity onPress={() => navigateToBulletinSearch("ALL")}>
                <Ionicons name="md-search" size={30} color="black" />
              </TouchableOpacity>
            </Box>
            <Box>
              <TouchableOpacity onPress={() => navigateToUserMain()}>
                <FontAwesome name="user-circle" size={30} color="black" />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            // bg="gray550"
            bg="white"
            mt="10"
            mx="4"
            p="4"
            height={"34%"}
            borderRadius="rounded-2xl"
          >
            <TouchableOpacity onPress={() => navigateToBulletinDetail("Free")}>
              <Box mb="3">
                <Text variant="textLg" fontWeight="600">
                  자유 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => navigateToCourseBulletin()}>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  수업별 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              onPress={() => navigateToBulletinDetail("courseRegister")}
            >
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  수강신청 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              onPress={() => navigateToBulletinDetail("Secret")}
            >
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  비밀 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              onPress={() => navigateToBulletinDetail("Freshmen")}
            >
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  새내기 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              onPress={() => navigateToBulletinDetail("Promotion")}
            >
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  홍보 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => navigateToBulletinDetail("Club")}>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  동아리 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => navigateToBulletinDetail("Sbu")}>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  본교 게시판
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          <Box height={40} />

          <Box mx="4">
            <Text variant="text2Xl" fontWeight="600">
              홍보
            </Text>
            <Box>
              {posts?.bulletinAllPosts.slice(0, 2).map((promotionPost) => (
                <Box key={promotionPost._id}>
                  <TouchableOpacity
                    onPress={() => navigateToBulletinPost(promotionPost._id)}
                  >
                    <Box my="5" mx="4">
                      <Text variant="textBase" fontWeight="600">
                        {promotionPost.title}
                      </Text>
                      <Text
                        variant="textBase"
                        fontWeight="500"
                        style={{
                          color: theme.colors.gray600,
                        }}
                      >
                        {promotionPost.content}
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
                            {promotionPost.likes.length}
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
                            {promotionPost.comments.length}
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
                          {moment(promotionPost.createdAt).format(
                            "MMMM Do, h:mm a"
                          )}
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
                          {promotionPost.anonymity
                            ? "익명"
                            : promotionPost.createdByUsername}
                        </Text>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                  <Divider />
                </Box>
              ))}
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinMain;
