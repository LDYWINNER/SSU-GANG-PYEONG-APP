import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "@shopify/restyle";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Divider, NavigateBack, SafeAreaWrapper } from "../../components";
import { Box, Text, Theme } from "../../theme";
import useSWRMutation from "swr/mutation";
import { IBulletinPost } from "../../types";
import { fetcher } from "../../utils/config";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BulletinStackParamList } from "../../navigation/types";
import moment from "moment";

interface ISearch {
  keyword: string;
}

type BulletinSearchScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinSearch"
>;

const BulletinSearch: React.FC<
  NativeStackScreenProps<any, "BulletinSearch">
> = ({ navigation: { navigate } }) => {
  const theme = useTheme<Theme>();

  const route = useRoute<BulletinSearchScreenRouteProp>();
  const { board } = route.params;

  const navigateToBulletinPost = (postId: string) => {
    navigate("BulletinStack", {
      screen: "BulletinPost",
      params: { id: postId },
    });
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm<ISearch>({
    defaultValues: {
      keyword: "",
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

  const { data: posts, trigger } = useSWRMutation<{
    bulletinAllPosts: IBulletinPost[];
    bulletinTotalPosts: number;
  }>(
    watch("keyword") === undefined || watch("keyword") === ""
      ? `api/v1/bulletin?board=${board}`
      : `api/v1/bulletin?board=${board}&search=${watch("keyword")}`,
    fetcher
  );

  return (
    <SafeAreaWrapper>
      <Box flex={1} mb="-6" mx="2">
        <Box
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          width={"100%"}
        >
          <NavigateBack />
          <Box width={"6%"} />
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
                width={"85%"}
              >
                <Ionicons name="search" size={24} color={theme.colors.gray5} />
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="글 제목, 내용"
                  style={{
                    fontSize: 18,
                    lineHeight: 20,
                    padding: 16,
                  }}
                  value={value}
                  maxLength={36}
                  placeholderTextColor={theme.colors.gray5}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </Box>
            )}
            name="keyword"
          />
        </Box>
        <Box mb="6" />
        {!isSubmitSuccessful ? (
          <Box height={"80%"} justifyContent="center" alignItems="center">
            <Ionicons name="search" size={50} color={theme.colors.gray400} />
            <Box height={5} />
            <Text
              variant="textXl"
              style={{ color: theme.colors.gray500 }}
              fontWeight="600"
            >
              게시판의 글을 검색해보세요
            </Text>
          </Box>
        ) : posts?.bulletinTotalPosts === 0 ||
          posts?.bulletinTotalPosts === undefined ? (
          <Box height={"80%"} justifyContent="center" alignItems="center">
            <Ionicons name="search" size={50} color={theme.colors.gray400} />
            <Box height={5} />
            <Text
              variant="textXl"
              style={{ color: theme.colors.gray500 }}
              fontWeight="600"
            >
              해당 키워드로 검색된 글이 없습니다.
            </Text>
          </Box>
        ) : (
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
        )}
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinSearch;
