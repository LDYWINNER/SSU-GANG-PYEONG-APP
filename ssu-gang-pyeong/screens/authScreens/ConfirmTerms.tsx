import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SmoothButton } from "../../components";
import { AuthScreenNavigationType } from "../../navigation/types";
import { Box, Text, Theme } from "../../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Alert } from "react-native";

const ConfirmTerms = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"ConfirmTerms">>();

  const theme = useTheme<Theme>();

  const [confirm, setConfirm] = useState(false);

  return (
    <Box flex={1} px="5.5" justifyContent="center">
      <Text variant="text2Xl" fontWeight="600" mb="3">
        이용 규칙
      </Text>
      <Text mb="2" fontWeight="600">
        SSUGANGPYEONG established rules to operate the community where anyone
        can use without any discomfort.
      </Text>
      <Text mb="2" fontWeight="600">
        Violations may result in postings being deleted and use of the service
        permanently restricted.
      </Text>
      <Text mb="2" fontWeight="600">
        Below is an summary of key content.
      </Text>
      <Text mb="2" fontWeight="500">
        - Acts that infringe on the rights of others or cause discomfort.
      </Text>
      <Text mb="2" fontWeight="500">
        - Acts that violate law, such as criminal or illegal acts.
      </Text>
      <Text mb="2" fontWeight="500">
        - Acts of writing posts including content related to profanity,
        demeaning, discrimination, hatred, suicide, and violence.
      </Text>
      <Text mb="6" fontWeight="500">
        - Pornography, acts that cause sexual shame.
      </Text>

      <Box alignSelf="flex-end" mr="3" mb="5">
        <TouchableOpacity onPress={() => setConfirm(!confirm)}>
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
              isChecked={confirm}
              disableBuiltInState
              onPress={() => setConfirm(!confirm)}
            />
            <Text
              ml="1"
              variant="textBase"
              style={{ color: theme.colors.sbuRed }}
            >
              동의
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>

      <SmoothButton
        label="Next"
        onPress={() => {
          if (confirm) {
            navigation.navigate("RegisterReviewCourse");
          } else {
            Alert.alert("이용 규칙에 동의해주세요.");
          }
        }}
        uppercase
      />
    </Box>
  );
};

export default ConfirmTerms;
