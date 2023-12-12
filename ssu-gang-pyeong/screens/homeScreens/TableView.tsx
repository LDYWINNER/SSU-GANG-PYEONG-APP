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

const eventGroups = [
  {
    courseId: "AIST3020",
    title: "Intro to Computer Systems",
    sections: {
      "- - LEC": {
        days: [2, 3],
        startTimes: ["11:30", "16:30"],
        endTimes: ["12:15", "18:15"],
        locations: ["Online Teaching", "Online Teaching"],
      },
      "-L01 - LAB": {
        days: [2],
        startTimes: ["16:30"],
        endTimes: ["17:15"],
        locations: ["Online Teaching"],
      },
    },
  },
  {
    courseId: "CSCI2100",
    title: "Data Structures",
    sections: {
      "A - LEC": {
        days: [1, 3],
        startTimes: ["16:30", "14:30"],
        endTimes: ["17:15", "16:15"],
        locations: ["Online Teaching", "Online Teaching"],
      },
      "AT02 - TUT": {
        days: [4],
        startTimes: ["17:30"],
        endTimes: ["18:15"],
        locations: ["Online Teaching"],
      },
    },
  },
  {
    courseId: "ELTU2014",
    title: "English for ERG Stds I",
    sections: {
      "BEC1 - CLW": {
        days: [2, 4],
        startTimes: ["10:30", "8:30"],
        endTimes: ["11:15", "10:15"],
        locations: ["Online Teaching", "Online Teaching"],
      },
    },
  },
  {
    courseId: "ENGG2780",
    title: "Statistics for Engineers",
    sections: {
      "B - LEC": {
        days: [1],
        startTimes: ["12:30"],
        endTimes: ["14:15"],
        locations: ["Online Teaching"],
      },
      "BT01 - TUT": {
        days: [3],
        startTimes: ["12:30"],
        endTimes: ["14:15"],
        locations: ["Online Teaching"],
      },
    },
  },
  {
    courseId: "GESC1000",
    title: "College Assembly",
    sections: {
      "-A01 - ASB": {
        days: [5],
        startTimes: ["11:30"],
        endTimes: ["13:15"],
        locations: ["Online Teaching"],
      },
    },
  },
  {
    courseId: "UGEB1492",
    title: "Data Expl - Stat in Daily Life",
    sections: {
      "- - LEC": {
        days: [4],
        startTimes: ["14:30"],
        endTimes: ["17:15"],
        locations: ["Lady Shaw Bldg LT5"],
      },
    },
  },
  {
    courseId: "UGEC1685",
    title: "Drugs and Culture",
    sections: {
      "- - LEC": {
        days: [4],
        startTimes: ["11:30"],
        endTimes: ["13:15"],
        locations: ["Lee Shau Kee Building LT5"],
      },
    },
  },
  {
    courseId: "Eat!",
    title: "No work on SUNDAY!",
    sections: {
      "": {
        days: [7],
        startTimes: ["12:30"],
        endTimes: ["13:15"],
        locations: ["Home"],
      },
    },
  },
  {
    courseId: "Manga!",
    title: "",
    sections: {
      "": {
        days: [6],
        startTimes: ["16:30"],
        endTimes: ["19:15"],
        locations: ["Home"],
      },
    },
  },
];

const newEventGroup = [
  {
    courseId: "AMS 151",
    sections: {
      "": {
        days: [1, 3],
        endTimes: ["16:50", "16:50"],
        locations: ["C107", "C107"],
        startTimes: ["15:30", "15:30"],
      },
    },
    title: "Applied Calculus I",
  },
];

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
