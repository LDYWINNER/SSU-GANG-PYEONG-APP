import * as React from "react";
import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TimeTable from "@mikezzb/react-native-timetable";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useGlobalToggle from "../../store/useGlobalToggle";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useEffect } from "react";
import { ICourse } from "../../types";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { formatCourses } from "../../utils/helpers";
import { Loader } from "../../components";
import { useIsFocused } from "@react-navigation/native";

const TableView: React.FC<NativeStackScreenProps<any, "TableView">> = ({
  navigation,
}) => {
  const { user } = useUserGlobalStore();
  const { toggleInfo, updateToggleInfo } = useGlobalToggle();
  const isFocused = useIsFocused();

  const {
    data: courses,
    isLoading: isLoadingCourses,
    mutate,
  } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (isFocused) {
      updateToggleInfo({
        currentTableView: Object.keys(user!.classHistory)[
          navigation.getState().index
        ],
      });
      // console.log("Current tab:", currentRoute.name);
      mutate();
    }
  }, [isFocused, navigation]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar backgroundColor="rgba(21,101,192,1)" />
        <View style={styles.container}>
          {isLoadingCourses ? (
            <Loader />
          ) : (
            <TimeTable
              eventGroups={
                courses?.takingCourses.length === 0
                  ? []
                  : formatCourses(courses!.takingCourses)
              }
              eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default TableView;
