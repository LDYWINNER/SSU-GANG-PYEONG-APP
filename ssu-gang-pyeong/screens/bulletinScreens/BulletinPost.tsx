import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Loader, SafeAreaWrapper } from "../../components";
import { Box, Text, Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BulletinStackParamList } from "../../navigation/types";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { IBulletinPost } from "../../types";
import { TouchableOpacity } from "react-native";

type BulletinPostScreenRouteProp = RouteProp<
  BulletinStackParamList,
  "BulletinPost"
>;

const BulletinPost: React.FC<NativeStackScreenProps<any, "BulletinPost">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();

  const route = useRoute<BulletinPostScreenRouteProp>();
  const { id } = route.params;

  const { data, isLoading: isLoadingPost } = useSWR<{ post: IBulletinPost }>(
    `/api/v1/bulletin/${id}`,
    fetcher
  );

  const { post } = data || {};

  if (isLoadingPost || !post) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2">
        <Text>{post?.title}</Text>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinPost;
