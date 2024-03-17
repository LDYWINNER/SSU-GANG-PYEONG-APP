import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import useSWRMutation from "swr/mutation";
import axiosInstance, { fetcher } from "../../utils/config";
import { Controller, useForm } from "react-hook-form";
import { Box, Text, Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import { ICategory, IColor, ICourse, IGlobalToggle } from "../../types";
import { Loader } from "../../components";
import { Alert, FlatList, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  WINDOW_HEIGHT,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import useGlobalToggle from "../../store/useGlobalToggle";
import useSWR from "swr";
import { getColors } from "../../utils/helpers";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

const COLORS = getColors();

const DEFAULT_COLOR = COLORS[0];

interface ISearch {
  keyword: string;
}

interface ITVAuthRequest {
  tableName: IGlobalToggle;
  courseId: string;
  color: IColor;
  twoOptionsDay?: string;
  optionsTime?: string;
  complicatedCourseOption?: string;
}

const patchTVCourseRequest = async (
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

const SelectCourses = ({ togglePicker, courses }: any) => {
  const { toggleInfo } = useGlobalToggle();
  const theme = useTheme<Theme>();
  const [searchSubj, setSearchSubj] = useState<string>("ALL");
  let tvCoursesId: string[] = [];

  const { control, handleSubmit, watch, setValue } = useForm<ISearch>({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmit = async (data: ISearch) => {
    try {
      await trigger();
    } catch (error) {
      console.log("error in submitting search course", error);
      throw error;
    }
  };

  const { data, trigger, isMutating } = useSWRMutation<{
    queryCourses: ICourse[];
    totalCourses: number;
  }>(
    watch("keyword") === undefined || watch("keyword") === ""
      ? `api/v1/course/tableSelect?searchSubj=${searchSubj}`
      : `api/v1/course/tableSelect?searchSubj=${searchSubj}&keyword=${watch(
          "keyword"
        )}`,
    fetcher
  );

  const { trigger: patchTVCourse } = useSWRMutation(
    "api/v1/course/patchTVCourse",
    patchTVCourseRequest
  );

  const { mutate } = useSWR<ICategory[]>("api/v1/todocategory/", fetcher);

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%"], []);
  const handleSnapPress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const [picker, setPicker] = useState(true);
  const [pickerContents, setPickerContents] = useState("");
  const pickerRef = useRef<Picker<string>>(null);
  const toggleSubjPicker = (index: string) => {
    if (picker) {
      handleSnapPress();
      setPicker(false);
      setPickerContents(index);
    } else {
      handleClosePress();
      setPicker(true);
      setPickerContents(index);
    }
  };
  const handleSheetChange = useCallback((index: any) => {
    if (index == -1) {
      setPicker(true);
      trigger();
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
    trigger();
  }, []);

  if (!data || !courses) {
    return <Loader />;
  } else {
    // console.log(courses);
    for (let i = 0; i < courses.length; i++) {
      tvCoursesId.push(courses[i]._id);
    }
    // console.log(tvCoursesId);
  }

  return (
    <>
      <Box flexDirection="row" alignItems="center" mt="2">
        <TouchableOpacity onPress={() => toggleSubjPicker("searchSubj")}>
          <Box flexDirection="row" alignItems="center" p="4">
            <Ionicons
              name="chevron-down"
              size={24}
              color={theme.colors.textColor}
            />
            <Text variant="text2Xl" marginLeft={"2"} color="textColor">
              {searchSubj === "SHCourse" ? "교양/Writing" : searchSubj}
            </Text>
          </Box>
        </TouchableOpacity>

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
              flex={1}
              mr="4"
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
      <Box mb="2" />

      {isMutating ? (
        <Loader />
      ) : (
        <>
          <FlatList
            data={data!.queryCourses}
            numColumns={2}
            renderItem={({ item, index }) => {
              const isSelected = tvCoursesId.includes(item._id);
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log(item.day);
                    if (isSelected) {
                      return Alert.alert("이미 선택된 수업입니다.", "", [
                        { text: "확인" },
                      ]);
                    }
                    //chi 111 courses
                    if (item.subj === "CHI" && item.crs === "111") {
                      const LECStartTimeOptions = item.startTime
                        .split(", ")
                        .at(-1)
                        ?.split("/");
                      const LECEndTimeOptions = item.endTime
                        .split(", ")
                        .at(-1)
                        ?.split("/");
                      const dayOptions = item.day
                        .split(", ")
                        .at(-1)
                        ?.split("/")
                        .map(
                          (dayOption, dayOptionIndex) =>
                            dayOption +
                            "  " +
                            LECStartTimeOptions![dayOptionIndex] +
                            "  ~  " +
                            LECEndTimeOptions![dayOptionIndex]
                        );
                      console.log(JSON.stringify(dayOptions));
                      const options = dayOptions?.map((dayOption) => ({
                        text: dayOption,
                        onPress: () => {
                          patchTVCourse({
                            tableName: toggleInfo as IGlobalToggle,
                            courseId: item._id,
                            color: DEFAULT_COLOR,
                            complicatedCourseOption: dayOption,
                          });
                          togglePicker();
                          mutate();
                        },
                      }));
                      Alert.alert(
                        "수업 선택",
                        "LEC 수업 옵션들 중 듣고 계신 수업의 요일과 시간을 선택해주세요.",
                        [{ text: "취소", style: "cancel" }, ...options!]
                      );
                    } else if (
                      item.day.split(", ").at(-1)?.includes("/") &&
                      item.day.split(", ").at(-1)?.includes("(")
                    ) {
                      const dayOptions = item.day
                        .split(", ")
                        .at(-1)
                        ?.split("(")[0]
                        ?.split("/");
                      const options = dayOptions?.map((dayOption) => ({
                        text: dayOption,
                        onPress: () => {
                          patchTVCourse({
                            tableName: toggleInfo as IGlobalToggle,
                            courseId: item._id,
                            color: DEFAULT_COLOR,
                            twoOptionsDay: dayOption,
                          });
                          togglePicker();
                          mutate();
                        },
                      }));
                      Alert.alert(
                        "수업 선택",
                        "LEC 수업 옵션들 중 듣고 계신 수업의 요일을 선택해주세요.",
                        [{ text: "취소", style: "cancel" }, ...options!]
                      );
                    } else if (item.day.split(", ").at(-1)?.includes("/")) {
                      Alert.alert(
                        "수업 선택",
                        "두 옵션 중 어떤 요일의 수업을 듣고 계신지 선택해주세요.",
                        [
                          { text: "취소", style: "cancel" },
                          {
                            text: item.day.split(", ").at(-1)?.split("/").at(0),
                            onPress: () => {
                              patchTVCourse({
                                tableName: toggleInfo as IGlobalToggle,
                                courseId: item._id,
                                color: DEFAULT_COLOR,
                                twoOptionsDay: item.day
                                  .split(", ")
                                  .at(-1)
                                  ?.split("/")
                                  .at(0),
                              });
                              togglePicker();
                              mutate();
                            },
                          },
                          {
                            text: item.day.split(", ").at(-1)?.split("/").at(1),
                            onPress: () => {
                              patchTVCourse({
                                tableName: toggleInfo as IGlobalToggle,
                                courseId: item._id,
                                color: DEFAULT_COLOR,
                                twoOptionsDay: item.day
                                  .split(", ")
                                  .at(-1)
                                  ?.split("/")
                                  .at(1),
                              });
                              togglePicker();
                              mutate();
                            },
                          },
                        ]
                      );
                    } else if (
                      item.startTime.split(", ").at(-1)?.includes("/")
                    ) {
                      const timeOptions = item.startTime
                        .split(", ")
                        .at(-1)
                        ?.split("/");
                      const options = timeOptions?.map((timeOption) => ({
                        text: timeOption,
                        onPress: () => {
                          patchTVCourse({
                            tableName: toggleInfo as IGlobalToggle,
                            courseId: item._id,
                            color: DEFAULT_COLOR,
                            optionsTime: timeOption,
                          });
                          togglePicker();
                          mutate();
                        },
                      }));
                      Alert.alert(
                        "수업 선택",
                        "옵션들 중 듣고 계신 수업의 시작 시간을 선택해주세요.",
                        [{ text: "취소", style: "cancel" }, ...options!]
                      );
                    } else {
                      patchTVCourse({
                        tableName: toggleInfo as IGlobalToggle,
                        courseId: item._id,
                        color: DEFAULT_COLOR,
                      });
                      togglePicker();
                      mutate();
                    }
                  }}
                  style={{ width: "50%" }}
                >
                  <Box
                    borderRadius="rounded-xl"
                    bg={"lightGray"}
                    px="4"
                    py="6"
                    m="3"
                    borderWidth={isSelected ? 2 : 0}
                    borderColor="sbuRed"
                    position="relative" //for woolfie image
                  >
                    <Box>
                      <Text variant="text2Xl" mb="1">
                        {item.subj} {item.crs}
                      </Text>
                      <Box>
                        {data.queryCourses[index].unique_instructor.includes(
                          ","
                        ) ? (
                          data.queryCourses[index].unique_instructor
                            .split(", ")
                            .map((prof, index) => (
                              <Text key={index}>{prof}</Text>
                            ))
                        ) : (
                          <Text>
                            {data.queryCourses[index].unique_instructor}
                          </Text>
                        )}
                      </Box>
                    </Box>
                    {isSelected && (
                      <Image
                        source={require("../../assets/images/woolfie.png")}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 10,
                          width: 50,
                          height: 50,
                          resizeMode: "contain", // Ensure the entire image is visible and maintains aspect ratio
                        }}
                      />
                    )}
                  </Box>
                </TouchableOpacity>
              );
            }}
          />
          <Box height={WINDOW_HEIGHT * 0.04} />
        </>
      )}

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
        <Box flexDirection="row" justifyContent="space-between" mr="5" ml="4">
          <TouchableOpacity
            onPress={() => {
              setSearchSubj("ALL");
              setValue("keyword", "");
              handleClosePress();
            }}
          >
            <Text
              variant="textLg"
              fontWeight="600"
              style={{ color: theme.colors.sbuRed }}
            >
              초기화
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSearchSubj(searchSubj);
              handleClosePress();
            }}
          >
            <Text
              variant="textLg"
              fontWeight="600"
              style={{ color: theme.colors.sbuRed }}
            >
              확인
            </Text>
          </TouchableOpacity>
        </Box>
        <Picker
          ref={pickerRef}
          selectedValue={searchSubj}
          onValueChange={(itemValue, itemIndex) => setSearchSubj(itemValue)}
        >
          <Picker.Item label="ALL" value="ALL" color={theme.colors.textColor} />
          <Picker.Item label="AMS" value="AMS" color={theme.colors.textColor} />
          <Picker.Item
            label="ACC/BUS"
            value="ACC/BUS"
            color={theme.colors.textColor}
          />
          <Picker.Item label="CSE" value="CSE" color={theme.colors.textColor} />
          <Picker.Item label="ESE" value="ESE" color={theme.colors.textColor} />
          <Picker.Item
            label="EST/EMP"
            value="EST/EMP"
            color={theme.colors.textColor}
          />
          <Picker.Item label="MEC" value="MEC" color={theme.colors.textColor} />
          <Picker.Item
            label="교양/Writing"
            value="SHCourse"
            color={theme.colors.textColor}
          />
        </Picker>
      </BottomSheet>
    </>
  );
};

export default SelectCourses;
