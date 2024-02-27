import React from "react";
import { TouchableOpacity, useColorScheme, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import useSWR from "swr";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider } from "../../components";
import useGlobalToggle from "../../store/useGlobalToggle";
import { Box, Text, Theme } from "../../theme";
import { ICourse, IGlobalToggle } from "../../types";
import axiosInstance, { fetcher } from "../../utils/config";
import { useTheme } from "@shopify/restyle";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  HomeStackParamList,
  MainStackNavigationType,
} from "../../navigation/types";
import useSWRMutation from "swr/mutation";
import useDarkMode from "../../store/useDarkMode";

type ManualPickScreenRouteProp = RouteProp<HomeStackParamList, "ManualPick">;

interface ITVAuthRequest {
  tableName: IGlobalToggle;
  courseId: string;
}

const deleteTVCourseRequest = async (
  url: string,
  { arg }: { arg: ITVAuthRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in patchTVCourseRequest", error);
    throw error;
  }
};

const ManualPick = () => {
  const navigation = useNavigation<MainStackNavigationType>();
  const { toggleInfo } = useGlobalToggle();

  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

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

  const { data: courses, mutate } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher);

  const { trigger: deleteTVCourse } = useSWRMutation(
    "api/v1/course/deleteTVCourse",
    deleteTVCourseRequest
  );

  return (
    <Box flex={1}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="text2Xl" fontWeight="700" mt="3" color="textColor">
          Table Name: {toggleInfo?.currentTableView}
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Box mr="2" mt="2">
            <Ionicons
              name={
                isDarkMode?.mode === "system"
                  ? systemIsDark
                    ? "add-circle-outline"
                    : "add-circle"
                  : isDarkMode?.mode === "dark"
                  ? "add-circle-outline"
                  : "add-circle"
              }
              color={theme.colors.textColor}
              size={35}
            />
          </Box>
        </TouchableOpacity>
      </Box>
      <Box height={12} />

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
      ></ScrollView>
    </Box>
  );
};

export default ManualPick;
