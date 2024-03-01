import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SmoothButton, SafeAreaWrapper, NavigateBack } from "../../components";
import { HomeStackParamList } from "../../navigation/types";
import axiosInstance from "../../utils/config";
import { IPSRequest, IPSUpdateRequest } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text, Theme } from "../../theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { TouchableOpacity, TextInput } from "react-native";
import useSWRMutation from "swr/mutation";
import useUserGlobalStore from "../../store/useUserGlobal";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import useGlobalToggle from "../../store/useGlobalToggle";
import uuid from "react-native-uuid";

const hours = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];
const minutes = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const createPSRequest = async (url: string, { arg }: { arg: IPSRequest }) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in createPSRequest", error);
    throw error;
  }
};

const updatePSRequest = async (
  url: string,
  { arg }: { arg: IPSUpdateRequest }
) => {
  try {
    await axiosInstance.patch(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in updatePSRequest", error);
    throw error;
  }
};

type PersonalScheduleRouteTypes = RouteProp<
  HomeStackParamList,
  "PersonalSchedule"
>;

const PersonalSchedule = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation();

  const { toggleInfo } = useGlobalToggle();

  const route = useRoute<PersonalScheduleRouteTypes>();

  const isEditing = route.params.schedule ? true : false;

  const { trigger } = useSWRMutation("api/v1/ps/create", createPSRequest);

  const { trigger: updateTrigger } = useSWRMutation(
    "api/v1/ps/update",
    updatePSRequest
  );

  const { user, updateUser } = useUserGlobalStore();

  // console.log(`route.params`, JSON.stringify(route.params, null, 2));

  const createNewPS = async () => {
    try {
      if (isEditing) {
        // console.log(psCourseId);
        const updatedPSItem = {
          ...route.params.schedule,
          id: route.params.schedule!.id,
          courseId: psCourseId,
          sections: {
            "": {
              days: inputSections.map((section) => section[0]),
              startTimes: inputSections.map(
                (section) => section[1] + ":" + section[2]
              ),
              endTimes: inputSections.map(
                (section) => section[3] + ":" + section[4]
              ),
              locations: inputSections.map((section) => section[5]),
            },
          },
        };
        // console.log(updatedPSItem.courseId);
        // console.log(`updatedPSItem`, updatedPSItem.sections[""]);
        await updateTrigger({
          ...updatedPSItem,
        });

        const itemIndex = user!.personalSchedule.findIndex(
          (item) => item.id === route.params.schedule!.id
        );
        const newUser = { ...user! };
        newUser!.personalSchedule[itemIndex].courseId = updatedPSItem.courseId;
        newUser!.personalSchedule[itemIndex].sections = updatedPSItem.sections;
        updateUser(newUser);
      } else {
        const newPS = {
          id: uuid.v4().toString(),
          table: toggleInfo!.currentTableView,
          courseId: psCourseId,
          sections: {
            "": {
              days: inputSections.map((section) => section[0]),
              startTimes: inputSections.map(
                (section) => section[1] + ":" + section[2]
              ),
              endTimes: inputSections.map(
                (section) => section[3] + ":" + section[4]
              ),
              locations: inputSections.map((section) => section[5]),
            },
          },
        };
        // console.log(newPS.sections.LEC);
        await trigger({
          ...newPS,
        });
        updateUser({
          ...user!,
          personalSchedule: [...user!.personalSchedule, newPS],
        });
      }
      navigation.goBack();
    } catch (error) {
      console.log("error in createNewPS", error);
      throw error;
    }
  };

  // [
  //   [2, "9:00", "10:20", "C103"],
  //   [4, "9:00", "10:20", "C103"],
  // ]

  // inputs
  const [inputSections, setInputSections] = useState<any[]>([
    [1, "09", "00", "10", "00", ""],
  ]);

  const addInputSection = () => {
    setInputSections([...inputSections, [1, "09", "00", "10", "00", ""]]);
  };

  const [psCourseId, setPSCourseId] = useState(
    route.params.schedule?.courseId ?? ""
  );
  const [tempDay, setTempDay] = useState<number>(1);
  const [tempStartHour, setTempStartHour] = useState<String>("09");
  const [tempStartMinute, setTempStartMinute] = useState<String>("00");
  const [tempEndHour, setTempEndHour] = useState<String>("10");
  const [tempEndMinute, setTempEndMinute] = useState<String>("00");

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [picker, setPicker] = useState(true);
  const [pickerContents, setPickerContents] = useState("");
  const [whichIndex, setWhichIndex] = useState(0);
  const pickerRef = useRef<Picker<string | number>>(null);
  const togglePicker = (index: string, indexNum: number) => {
    if (picker) {
      handleSnapPress();
      setPicker(false);
      setPickerContents(index);
      setWhichIndex(indexNum);
    } else {
      handleClosePress();
      setPicker(true);
      setPickerContents(index);
      setWhichIndex(indexNum);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setPicker(true);
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

  useEffect(() => {
    if (isEditing) {
      const presetSections = route.params.schedule!.sections[""].days.map(
        (day, i) => {
          return [
            day,
            route.params.schedule!.sections[""].startTimes[i].split(":")[0],
            route.params.schedule!.sections[""].startTimes[i].split(":")[1],
            route.params.schedule!.sections[""].endTimes[i].split(":")[0],
            route.params.schedule!.sections[""].endTimes[i].split(":")[1],
            route.params.schedule!.sections[""].locations[i],
          ];
        }
      );
      setInputSections(presetSections);
      setTempDay(route.params.schedule!.sections[""].days[whichIndex]);
      setTempStartHour(
        route.params.schedule!.sections[""].startTimes[whichIndex].split(":")[0]
      );
      setTempStartMinute(
        route.params.schedule!.sections[""].startTimes[whichIndex].split(":")[1]
      );
      setTempEndHour(
        route.params.schedule!.sections[""].endTimes[whichIndex].split(":")[0]
      );
      setTempEndMinute(
        route.params.schedule!.sections[""].endTimes[whichIndex].split(":")[1]
      );
    } else {
      // reset to default
      setTempDay(inputSections[whichIndex][0]);
      setTempStartHour(inputSections[whichIndex][1]);
      setTempStartMinute(inputSections[whichIndex][2]);
      setTempEndHour(inputSections[whichIndex][3]);
      setTempEndMinute(inputSections[whichIndex][4]);
    }
  }, [whichIndex]);

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box height={16} />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box bg="gray250" borderRadius="rounded-2xl">
          <TextInput
            autoComplete="off"
            style={{
              fontSize: 20,
              lineHeight: 26,
              padding: 16,
            }}
            value={psCourseId}
            maxLength={36}
            placeholder="Enter title"
            placeholderTextColor={theme.colors.gray5}
            onChangeText={(text) => {
              setPSCourseId(text);
            }}
          />
        </Box>
        <Box height={24} />

        {inputSections.map((section: any, index: any) => (
          <Box key={index} mx="2">
            <Box flexDirection="row" alignItems="center" mb="6">
              <TouchableOpacity onPress={() => togglePicker("day", index)}>
                <Box flexDirection="row" alignItems="center">
                  <Text variant="textLg" fontWeight="600" color="textColor">
                    {inputSections[index][0] === 1
                      ? "월요일"
                      : inputSections[index][0] === 2
                      ? "화요일"
                      : inputSections[index][0] === 3
                      ? "수요일"
                      : inputSections[index][0] === 4
                      ? "목요일"
                      : inputSections[index][0] === 5
                      ? "금요일"
                      : inputSections[index][0] === 6
                      ? "토요일"
                      : "일요일"}
                  </Text>
                  <Box width={6} />
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.sbuRed}
                  />
                </Box>
              </TouchableOpacity>
              <Box width={16} />

              <TouchableOpacity onPress={() => togglePicker("time", index)}>
                <Box flexDirection="row" alignItems="center">
                  <Text variant="textLg" fontWeight="600" color="textColor">
                    {inputSections[index][1]}:{inputSections[index][2]} -{" "}
                    {inputSections[index][3]}:{inputSections[index][4]}
                  </Text>
                  <Box width={6} />
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.sbuRed}
                  />
                </Box>
              </TouchableOpacity>
            </Box>

            <Box bg="gray250" borderRadius="rounded-2xl" mb="6">
              <TextInput
                autoComplete="off"
                style={{
                  backgroundColor: theme.colors.mainBgColor,
                  fontSize: 20,
                  lineHeight: 26,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.gray5,
                  color: theme.colors.textColor,
                }}
                value={inputSections[index][5]}
                maxLength={36}
                placeholder="장소"
                placeholderTextColor={theme.colors.gray5}
                onChangeText={(text) => {
                  setInputSections((prevSections) => {
                    const newSections = [...prevSections];
                    newSections[index] = [...newSections[index]];
                    newSections[index][5] = text;
                    return newSections;
                  });
                }}
              />
            </Box>
          </Box>
        ))}
        <TouchableOpacity onPress={addInputSection}>
          <Text variant="textLg" fontWeight="600" color="sbuRed">
            시간 및 장소 추가
          </Text>
        </TouchableOpacity>
        <Box position="absolute" bottom={4} left={0} right={0}>
          <SmoothButton
            label={isEditing ? "Edit table item" : "Done"}
            onPress={() => createNewPS()}
          />
        </Box>
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
        <Box flexDirection="row" justifyContent="flex-end" mr="5">
          <TouchableOpacity
            onPress={() => {
              if (pickerContents === "day") {
                setInputSections((prevSections) => {
                  const newSections = [...prevSections];
                  newSections[whichIndex][0] = tempDay;
                  return newSections;
                });
                handleClosePress();
              } else {
                setInputSections((prevSections) => {
                  const newSections = [...prevSections];
                  newSections[whichIndex][1] = tempStartHour;
                  newSections[whichIndex][2] = tempStartMinute;
                  newSections[whichIndex][3] = tempEndHour;
                  newSections[whichIndex][4] = tempEndMinute;
                  return newSections;
                });
                handleClosePress();
              }
            }}
          >
            <Text
              variant="textLg"
              fontWeight="600"
              style={{ color: theme.colors.iconBlue }}
            >
              확인
            </Text>
          </TouchableOpacity>
        </Box>
        {pickerContents === "day" ? (
          <Picker
            ref={pickerRef}
            selectedValue={tempDay}
            onValueChange={(itemValue) => {
              setTempDay(itemValue as number);
            }}
          >
            <Picker.Item label="월요일" value={1} color={theme.colors.white} />
            <Picker.Item label="화요일" value={2} color={theme.colors.white} />
            <Picker.Item label="수요일" value={3} color={theme.colors.white} />
            <Picker.Item label="목요일" value={4} color={theme.colors.white} />
            <Picker.Item label="금요일" value={5} color={theme.colors.white} />
            <Picker.Item label="토요일" value={6} color={theme.colors.white} />
            <Picker.Item label="일요일" value={7} color={theme.colors.white} />
          </Picker>
        ) : (
          <Box flexDirection="row" justifyContent="center">
            <Picker
              style={{ width: 100 }}
              selectedValue={tempStartHour}
              onValueChange={(itemValue) => {
                setTempStartHour(itemValue);
              }}
            >
              {hours.map((hour) => (
                <Picker.Item
                  key={hour}
                  label={hour}
                  value={hour}
                  color={theme.colors.textColor}
                />
              ))}
            </Picker>
            <Picker
              style={{ width: 100 }}
              selectedValue={tempStartMinute}
              onValueChange={(itemValue) => {
                setTempStartMinute(itemValue);
              }}
            >
              {minutes.map((minute) => (
                <Picker.Item
                  key={minute}
                  label={minute}
                  value={minute}
                  color={theme.colors.textColor}
                />
              ))}
            </Picker>
            <Picker
              style={{ width: 100 }}
              selectedValue={tempEndHour}
              onValueChange={(itemValue) => {
                setTempEndHour(itemValue);
              }}
            >
              {hours.map((hour) => (
                <Picker.Item
                  key={hour}
                  label={hour}
                  value={hour}
                  color={theme.colors.textColor}
                />
              ))}
            </Picker>
            <Picker
              style={{ width: 100 }}
              selectedValue={tempEndMinute}
              onValueChange={(itemValue) => {
                setTempEndMinute(itemValue);
              }}
            >
              {minutes.map((minute) => (
                <Picker.Item
                  key={minute}
                  label={minute}
                  value={minute}
                  color={theme.colors.textColor}
                />
              ))}
            </Picker>
          </Box>
        )}
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default PersonalSchedule;
