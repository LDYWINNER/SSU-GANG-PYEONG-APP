import * as React from "react";
import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TimeTable from "@mikezzb/react-native-timetable";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useGlobalToggle from "../../store/useGlobalToggle";
import useUserGlobalStore from "../../store/useUserGlobal";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { ICourse } from "../../types";
import useSWR from "swr";
import { fetcher } from "../../utils/config";
import { formatCourses } from "../../utils/helpers";
import { Loader } from "../../components";

const TableView: React.FC<NativeStackScreenProps<any, "TableView">> = ({
  navigation,
}) => {
  const { user } = useUserGlobalStore();
  const { toggleInfo, updateToggleInfo } = useGlobalToggle();
  const route = useRoute();

  const { data: courses, isLoading: isLoadingCourses } = useSWR<{
    takingCourses: ICourse[];
  }>(`/api/v1/course/tableView/${toggleInfo?.currentTableView}`, fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    updateToggleInfo({
      currentTableView: Object.keys(user!.classHistory)[
        navigation.getState().index
      ],
    });
  }, [route]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar backgroundColor="rgba(21,101,192,1)" />
        <View style={styles.container}>
          {isLoadingCourses ? (
            <Loader />
          ) : (
            <TimeTable
              eventGroups={formatCourses(courses!.takingCourses)}
              // eventGroups={newEventGroup}
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
