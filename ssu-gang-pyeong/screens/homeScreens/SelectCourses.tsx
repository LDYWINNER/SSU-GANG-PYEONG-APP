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
import { ICategory, ICourse, IGlobalToggle } from "../../types";
import { Loader } from "../../components";
import { FlatList, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import useGlobalToggle from "../../store/useGlobalToggle";
import useSWR, { mutate } from "swr";

interface ISearch {
  keyword: string;
}

interface ITVAuthRequest {
  tableName: IGlobalToggle;
  courseId: string;
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

  const { control, handleSubmit, watch } = useForm<ISearch>({
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

  const { data, trigger } = useSWRMutation<{
    queryCourses: ICourse[];
    totalCourses: number;
  }>(
    watch("keyword") === undefined || watch("keyword") === ""
      ? `api/v1/course?searchSubj=${searchSubj}`
      : `api/v1/course?searchSubj=${searchSubj}&keyword=${watch("keyword")}`,
    fetcher
  );

  const { trigger: patchTVCourse, isMutating } = useSWRMutation(
    "api/v1/course/patchTVCourse",
    patchTVCourseRequest
  );

  const { mutate } = useSWR<ICategory[]>("api/v1/todocategory/", fetcher);

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
              color={theme.colors.gray5}
            />
            <Text variant="text2Xl" marginLeft={"2"}>
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
              width={"70%"}
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

      <FlatList
        data={data!.queryCourses}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                patchTVCourse({
                  tableName: toggleInfo as IGlobalToggle,
                  courseId: item._id,
                });
                togglePicker();
                mutate();
              }}
              style={{ width: "50%" }}
            >
              <Box
                borderRadius="rounded-xl"
                bg={tvCoursesId.includes(item._id) ? "red400" : "lightGray"}
                px="4"
                py="6"
                m="3"
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
                        .map((prof, index) => <Text key={index}>{prof}</Text>)
                    ) : (
                      <Text>{data.queryCourses[index].unique_instructor}</Text>
                    )}
                  </Box>
                </Box>
              </Box>
            </TouchableOpacity>
          );
        }}
      />
      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        onChange={handleSheetChange}
        // backgroundStyle={{
        //   backgroundColor: isDark ? colors.DARKER_GREY : "white",
        // }}
      >
        <Box flexDirection="row" justifyContent="flex-end" mr="5">
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
          <Picker.Item label="ALL" value="ALL" />
          <Picker.Item label="AMS" value="AMS" />
          <Picker.Item label="ACC/BUS" value="ACC/BUS" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="ESE" value="ESE" />
          <Picker.Item label="EST/EMP" value="EST/EMP" />
          <Picker.Item label="MEC" value="MEC" />
          <Picker.Item label="교양/Writing" value="SHCourse" />
        </Picker>
      </BottomSheet>
    </>
  );
};

export default SelectCourses;
