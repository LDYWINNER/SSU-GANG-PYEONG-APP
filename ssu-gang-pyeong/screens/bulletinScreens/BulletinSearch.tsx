import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "@shopify/restyle";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaWrapper } from "../../components";
import { Box, Theme } from "../../theme";

interface ISearch {
  keyword: string;
}

const BulletinSearch: React.FC<
  NativeStackScreenProps<any, "BulletinSearch">
> = ({ navigation: { navigate } }) => {
  const theme = useTheme<Theme>();

  const { control, handleSubmit, watch } = useForm<ISearch>({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmit = async (data: ISearch) => {
    try {
    } catch (error) {
      console.log("error in submitting search course", error);
      throw error;
    }
  };

  return (
    <SafeAreaWrapper>
      <Box width={"100%"} mx="5">
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
              width={"90%"}
            >
              <Ionicons name="search" size={24} color={theme.colors.gray5} />
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Search with keywords"
                style={{
                  fontSize: 20,
                  lineHeight: 26,
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
    </SafeAreaWrapper>
  );
};

export default BulletinSearch;
