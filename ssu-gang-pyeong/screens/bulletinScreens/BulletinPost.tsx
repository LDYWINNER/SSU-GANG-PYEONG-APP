import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
import { fetcher } from "../../utils/config";
import { IBulletinPost } from "../../types";
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
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

type BulletinPostScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinPost"
>;

const BulletinPost: React.FC<NativeStackScreenProps<any, "BulletinPost">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();
  const windowHeight = Dimensions.get("window").height;

  const { user } = useUserGlobalStore();

  const [isSelected, setSelection] = useState(true);

  const route = useRoute<BulletinPostScreenRouteProp>();
  const { id } = route.params;

  const { data, isLoading: isLoadingPost } = useSWR<{ post: IBulletinPost }>(
    `/api/v1/bulletin/${id}`,
    fetcher
  );

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
                  <MaterialIcons name="more-vert" size={30} color="black" />
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
              <MenuItem onPress={hideMenu}>
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
              <FontAwesome name="user-circle" size={36} color="black" />
              <Box ml="2">
                <Text variant="textXl" fontWeight="700">
                  {post.anonymity ? "익명" : post.createdByUsername}
                </Text>
                <Text
                  style={{
                    color: theme.colors.gray500,
                  }}
                >
                  {moment(post.createdAt).format("MMMM Do, h:mm a")}
                </Text>
              </Box>
            </Box>

            <Box mt="3">
              <Text variant="textLg" fontWeight="600">
                {post.title}
              </Text>
              <Box height={6} />
              <Text variant="textBase">{post.content}</Text>

              <Box mt="5" flexDirection="row" alignItems="center">
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
                <Box width={10} />
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
              </Box>

              <Box mt="3" mb="5" flexDirection="row" alignItems="center">
                <TouchableOpacity>
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
                      <FontAwesome name="user-circle" size={24} color="black" />
                      <Box ml="2">
                        <Text variant="textBase" fontWeight="700">
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
                  <Text variant="textBase">{comment.text}</Text>
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
          bottom={windowHeight * 0}
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
