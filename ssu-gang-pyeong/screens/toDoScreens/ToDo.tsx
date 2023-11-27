import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Loader, SafeAreaWrapper } from "../../components";
import { Task, TaskActions } from "../../components/tasks";
import { fetcher } from "../../utils/config";
import { format, isEqual, parseISO } from "date-fns";
import { FlatList, TouchableOpacity, useColorScheme } from "react-native";
import { ZoomInEasyDown } from "react-native-reanimated";
import { ITask } from "../../types";
import useUserGlobalStore from "../../store/useUserGlobal";
import { AnimatedText, Box, Text } from "../../theme";
import { getGreeting } from "../../utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import colors from "../../colors";
import MoreMenu from "./MoreMenu";

const today = new Date();

const todayISODate = new Date().setHours(-5, 0, 0, 0);

const greeting = getGreeting({ hour: new Date().getHours() });

const HomeScreen = () => {
  const { user } = useUserGlobalStore();
  const isDark = useColorScheme() === "dark";
  const color = isDark ? "white" : colors.BLACK_COLOR;

  // date picking
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);
  const [pickedDate, setPickedDate] = useState(String(todayISODate));
  const [dateForHeader, setDateForHeader] = useState<Date>(today);

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

  const {
    data: tasks,
    isLoading,
    mutate: mutateTasks,
  } = useSWR<ITask[]>("api/v1/todotask/today", fetcher);

  const { data: specificDayTasks, trigger } = useSWRMutation<ITask[]>(
    `api/v1/todotask/${pickedDate}`,
    fetcher
  );

  useEffect(() => {
    console.log("is it working?");
    trigger();
    console.log(specificDayTasks);
  }, [pickedDate]);

  if (isLoading || !tasks) {
    return <Loader />;
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
            <AnimatedText
              variant="textXl"
              fontWeight="500"
              entering={ZoomInEasyDown.delay(500).duration(700)}
            >
              Good {greeting} {user?.username}
            </AnimatedText>
            <Text variant="textXl" fontWeight="500">
              It’s {dateForHeader.toISOString()}- {tasks.length} tasks
            </Text>
          </Box>
          <Box flexDirection="row">
            <TouchableOpacity
              onPress={() => setIsSelectingDate((prev) => !prev)}
            >
              <Ionicons
                name={isDark ? "ios-calendar-outline" : "ios-calendar"}
                color={color}
                size={35}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleMoreMenu()}>
              <Ionicons
                name={
                  isDark
                    ? "ellipsis-horizontal-circle-outline"
                    : "ellipsis-horizontal-circle-sharp"
                }
                color={color}
                size={35}
              />
            </TouchableOpacity>
          </Box>
        </Box>
        <Box height={26} />
        {isSelectingDate && (
          <Box>
            <Calendar
              onDayPress={(day) => {
                // console.log("here day");
                // console.log(new Date(day.dateString).toISOString());

                setIsSelectingDate(false);
                const selectedDate = new Date(day.dateString).toISOString();
                // console.log("selected date");
                // console.log(selectedDate);
                setPickedDate(selectedDate);
                console.log("picked date");
                console.log(pickedDate);
                setDateForHeader(parseISO(selectedDate));
                console.log("date for header");
                console.log(dateForHeader);
              }}
            />
            <Box height={26} />
          </Box>
        )}
        <TaskActions categoryId="" />
        <Box height={26} />
        <FlatList
          data={
            specificDayTasks
            // isEqual(todayISODate, parseISO(pickedDate))
            //   ? specificDayTasks
            //   : tasks
          }
          renderItem={({ item }) => (
            <Task task={item} mutateTasks={mutateTasks} />
          )}
          ItemSeparatorComponent={() => <Box height={14} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
        />
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
          backgroundColor: isDark ? colors.BLACK_COLOR : "white",
        }}
      >
        <MoreMenu />
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
