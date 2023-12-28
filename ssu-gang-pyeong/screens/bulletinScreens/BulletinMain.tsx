import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Divider, SafeAreaWrapper } from "../../components";
import { Box, Text } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const BulletinMain: React.FC<NativeStackScreenProps<any, "BulletinMain">> = ({
  navigation: { navigate },
}) => {
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
              <TouchableOpacity onPress={() => navigate("BulletinSearch")}>
                <Ionicons name="md-search" size={30} color="black" />
              </TouchableOpacity>
            </Box>
            <Box>
              <TouchableOpacity>
                <FontAwesome name="user-circle" size={30} color="black" />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
        <ScrollView>
          <Box
            // bg="gray550"
            bg="white"
            mt="10"
            mx="4"
            p="4"
            height={380}
            borderRadius="rounded-2xl"
          >
            <TouchableOpacity>
              <Box mb="3">
                <Text variant="textLg" fontWeight="600">
                  자유 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  수강신청 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  비밀 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  새내기 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  홍보 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
              <Box mb="3" mt="3">
                <Text variant="textLg" fontWeight="600">
                  동아리 게시판
                </Text>
              </Box>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
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
              <Text></Text>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaWrapper>
  );
};

export default BulletinMain;
