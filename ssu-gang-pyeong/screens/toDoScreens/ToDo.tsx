import React, { useCallback, useMemo, useRef, useState } from "react";
import { Loader, SafeAreaWrapper } from "../../components";
import { Task, TaskActions } from "../../components/tasks";
import { fetcher } from "../../utils/config";
import { format, parseISO } from "date-fns";
import { FlatList, TouchableOpacity, useColorScheme } from "react-native";
import { ITask } from "../../types";
import useUserGlobalStore from "../../store/useUserGlobal";
import { Box, Text, Theme } from "../../theme";
import { getGreeting } from "../../utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import MoreMenu from "./MoreMenu";
import { useTheme } from "@shopify/restyle";
import useDarkMode from "../../store/useDarkMode";
import { useFocusEffect } from "@react-navigation/native";

const todayISODate = new Date();
todayISODate.setHours(-5, 0, 0, 0);

const greeting = getGreeting({ hour: new Date().getHours() });

const AMS = { key: "AMS", color: "red", selectedDotColor: "red" };
const ACC = { key: "ACC", color: "orange", selectedDotColor: "orange" };
const BUS = { key: "BUS", color: "orange", selectedDotColor: "orange" };
const CSE = { key: "CSE", color: "yellow", selectedDotColor: "yellow" };
const ESE = { key: "ESE", color: "green", selectedDotColor: "green" };
const EST = { key: "EST", color: "blue", selectedDotColor: "blue" };
const EMP = { key: "EMP", color: "blue", selectedDotColor: "blue" };
const MEC = { key: "MEC", color: "purple", selectedDotColor: "purple" };
const OTHER = { key: "OTHER", color: "black", selectedDotColor: "black" };

const HomeScreen = () => {
  const { user } = useUserGlobalStore();

  const theme = useTheme<Theme>();
  const { isDarkMode } = useDarkMode();
  const systemIsDark = useColorScheme() === "dark";

  // date picking
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(true);
  const [pickedDate, setPickedDate] = useState(todayISODate.toISOString());
  const [dateForHeader, setDateForHeader] = useState<Date>(todayISODate);
  const [selected, setSelected] = useState("");

  const presetTasks: any = {};

  // const koreaDate = new Date().toLocaleString("en-US", {
  //   timeZone: "Asia/Seoul",
  // });
  // console.log(koreaDate); // This will show the current date and time in South Korea.

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [moreMenu, setmoreMenu] = useState(true);
  const toggleMoreMenu = () => {
    if (moreMenu) {
      handleSnapPress();
      setmoreMenu(false);
    } else {
      handleClosePress();
      setmoreMenu(true);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setmoreMenu(true);
    }
  }, []);
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  const { data: monthlyTasks, isLoading } = useSWR<ITask[]>(
    `api/v1/todotask/`,
    fetcher
  );

  const {
    data: specificDayTasks,
    trigger,
    isMutating,
  } = useSWRMutation<ITask[]>(`api/v1/todotask/${pickedDate}`, fetcher);

  // useEffect(() => {
  //   trigger();
  //   // console.log(specificDayTasks);
  // }, [pickedDate]);

  useFocusEffect(
    useCallback(() => {
      trigger();
    }, [pickedDate])
  );

  if (isLoading || !specificDayTasks) {
    return <Loader />;
  } else {
    //preset tasks for calendar dots representation
    // Loop over the monthlyTasks array
    monthlyTasks!.forEach((task) => {
      // Extract the date part from the task's date
      const taskDate = task.date.split("T")[0];
      // Initialize the array for the date if it doesn't exist
      if (!presetTasks[taskDate]) {
        presetTasks[taskDate] = {
          dots: [],
          selected: selected === taskDate,
          selectedColor: theme.colors.iconBlue,
          selectedTextColor: "white",
        };
      }

      // console.log(presetTasks[taskDate].dots);

      // Push the category color object to the dots array
      let dotColorSubj = null;
      if (task.categoryTitle === "AMS") {
        dotColorSubj = AMS;
      } else if (task.categoryTitle === "ACC") {
        dotColorSubj = ACC;
      } else if (task.categoryTitle === "BUS") {
        dotColorSubj = BUS;
      } else if (task.categoryTitle === "CSE") {
        dotColorSubj = CSE;
      } else if (task.categoryTitle === "ESE") {
        dotColorSubj = ESE;
      } else if (task.categoryTitle === "EST") {
        dotColorSubj = EST;
      } else if (task.categoryTitle === "EMP") {
        dotColorSubj = EMP;
      } else if (task.categoryTitle === "MEC") {
        dotColorSubj = MEC;
      } else {
        dotColorSubj = OTHER;
      }

      if (
        !presetTasks[taskDate].dots
          .map((obj: any) => obj.key)
          .join()
          .includes(dotColorSubj.key)
      ) {
        presetTasks[taskDate].dots.push(dotColorSubj);
      }
    });
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text variant="textXl" fontWeight="500" color="textColor">
              Good {greeting} {user?.username}
            </Text>
            <Text variant="textXl" fontWeight="500" color="textColor">
              It’s{" "}
              {format(
                new Date(dateForHeader).setHours(29, 0, 0, 0),
                "yyyy.MM.dd"
              )}{" "}
              - {specificDayTasks.length} tasks
            </Text>
          </Box>
          <Box flexDirection="row">
            <TouchableOpacity
              onPress={() => setIsSelectingDate((prev) => !prev)}
            >
              <Ionicons
                name={
                  isDarkMode?.mode === "system"
                    ? systemIsDark
                      ? "ios-calendar-outline"
                      : "ios-calendar"
                    : isDarkMode?.mode === "dark"
                    ? "ios-calendar-outline"
                    : "ios-calendar"
                }
                color={theme.colors.textColor}
                size={35}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleMoreMenu()}>
              <Ionicons
                name={
                  isDarkMode?.mode === "system"
                    ? systemIsDark
                      ? "ellipsis-horizontal-circle-outline"
                      : "ellipsis-horizontal-circle-sharp"
                    : isDarkMode?.mode === "dark"
                    ? "ellipsis-horizontal-circle-outline"
                    : "ellipsis-horizontal-circle-sharp"
                }
                color={theme.colors.textColor}
                size={35}
              />
            </TouchableOpacity>
          </Box>
        </Box>
        <Box height={26} />

        {isSelectingDate && (
          <Box>
            <Calendar
              theme={{
                calendarBackground: theme.colors.mainBgColor,
                dayTextColor: theme.colors.textColor,
                textDisabledColor: "#444",
                monthTextColor: "#888",
              }}
              displayLoadingIndicator={isMutating}
              onDayPress={(day) => {
                const selectedDate = new Date(day.dateString).toISOString();
                setPickedDate(selectedDate);
                setDateForHeader(parseISO(selectedDate));
                setSelected(day.dateString);
              }}
              markingType={"multi-dot"}
              markedDates={{
                [selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: theme.colors.sbuRed,
                  selectedTextColor: "white",
                },
                ...presetTasks,
              }}
            />
            <Box height={26} />
          </Box>
        )}

        <TaskActions categoryId="" updateTaskStatus={trigger} />
        <Box height={14} />

        {isMutating ? (
          <Loader />
        ) : (
          <FlatList
            data={specificDayTasks}
            renderItem={({ item }) => (
              <Task task={item} updateTaskStatus={trigger} date={pickedDate} />
            )}
            ItemSeparatorComponent={() => <Box height={14} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
          />
        )}
      </Box>

      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.mainBgColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.textColor,
        }}
      >
        <MoreMenu />
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
