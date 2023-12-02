import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import useSWR, { mutate, useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance, { fetcher } from "../utils/config";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaWrapper, Input, Loader } from "../components";
import { Box, Text } from "../theme";
import { ICourse, ICourseRequest } from "../types";
import { FlatList, TouchableOpacity } from "react-native";
import { Rating } from "@kolking/react-native-rating";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";

interface ISearch {
  keyword: string;
}

const Search = () => {
  const theme = useTheme<Theme>();
  const instructors: string[] = [];
  const [searchSubj, setSearchSubj] = useState<string>("ALL");
  const [isSearching, setIsSearching] = useState<boolean>(false);

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

  const { data: allCourses, isLoading: isCourseLoading } = useSWR<ICourse[]>(
    "api/v1/course?searchSubj=ALL",
    fetcher
  );

  const { data, trigger } = useSWRMutation<{
    queryCourses: ICourse[];
    totalCourses: number;
  }>(
    watch("keyword") === undefined
      ? `api/v1/course?searchSubj=${searchSubj}`
      : `api/v1/course?searchSubj=${searchSubj}&keyword=${watch("keyword")}`,
    fetcher
  );

  useEffect(() => {
    if (watch("keyword") === undefined || watch("keyword") === "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }, [watch("keyword")]);

  const toFindDuplicates = (arr: string[]) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

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
  const togglePicker = (index: string) => {
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
    }
    setIsSearching(true);
    trigger();
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

  if (isCourseLoading) {
    return <Loader />;
  } else {
    if (isSearching && data?.queryCourses) {
      for (let index = 0; index < data!.queryCourses!.length; index++) {
        if (data!.queryCourses![index].instructor_names.includes(",")) {
          const duplicateElements = toFindDuplicates(
            data!.queryCourses![index].instructor
          );
          if (duplicateElements.length === 0) {
            instructors.push(data!.queryCourses![index].instructor_names);
          } else {
            const temp = data!.queryCourses![index].instructor;
            for (let i = 0; i < duplicateElements.length; i++) {
              const firstIndex = temp.indexOf(duplicateElements[i]);
              while (temp.lastIndexOf(duplicateElements[i]) !== firstIndex) {
                temp.splice(temp.lastIndexOf(duplicateElements[i]), 1);
              }
            }
            instructors.push(temp.join(","));
          }
        } else {
          instructors.push(data!.queryCourses![index].instructor_names);
        }
      }
    } else {
      for (let index = 0; index < allCourses!.length; index++) {
        if (allCourses![index].instructor_names.includes(",")) {
          const duplicateElements = toFindDuplicates(
            allCourses![index].instructor
          );
          if (duplicateElements.length === 0) {
            instructors.push(allCourses![index].instructor_names);
          } else {
            const temp = allCourses![index].instructor;
            for (let i = 0; i < duplicateElements.length; i++) {
              const firstIndex = temp.indexOf(duplicateElements[i]);
              while (temp.lastIndexOf(duplicateElements[i]) !== firstIndex) {
                temp.splice(temp.lastIndexOf(duplicateElements[i]), 1);
              }
            }
            instructors.push(temp.join(","));
          }
        } else {
          instructors.push(allCourses![index].instructor_names);
        }
      }
    }
  }

  return (
    <SafeAreaWrapper>
      <Box flexDirection="row" alignItems="center">
        <TouchableOpacity onPress={() => togglePicker("searchSubj")}>
          <Box flexDirection="row" alignItems="center" p="4">
            <Ionicons
              name="chevron-down"
              size={24}
              color={theme.colors.gray5}
            />
            <Text variant="text2Xl" marginLeft={"2"}>
              {searchSubj}
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
      <Box mb="6" />

      <FlatList
        data={isSearching ? data?.queryCourses : allCourses}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity>
              <Box
                borderRadius="rounded-xl"
                bg={
                  item.avgGrade === null
                    ? "lightGray"
                    : item.avgGrade <= 1
                    ? "red200"
                    : item.avgGrade <= 2
                    ? "amber200"
                    : item.avgGrade <= 3
                    ? "orange200"
                    : item.avgGrade <= 4
                    ? "blu200"
                    : "green200"
                }
                px="4"
                py="6"
                m="3"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Box>
                  <Text variant="text2Xl" mb="1">
                    {item.subj} {item.crs}
                  </Text>
                  <Box>
                    {instructors[index].includes(",") ? (
                      instructors[index]
                        .split(", ")
                        .map((prof, index) => <Text key={index}>{prof}</Text>)
                    ) : (
                      <Text>{instructors[index]}</Text>
                    )}
                  </Box>
                </Box>
                <Box justifyContent="center" alignItems="flex-end">
                  <Text mb="1">
                    {item.avgGrade ? (
                      <Rating
                        rating={Number(item.avgGrade.toFixed(1))}
                        disabled
                      />
                    ) : (
                      <Rating rating={0} disabled />
                    )}
                  </Text>
                  <Text>
                    {item.avgGrade ? "(" + item.avgGrade.toFixed(1) + ")" : ""}
                  </Text>
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
        backdropComponent={renderBackdrop}
        // backgroundStyle={{
        //   backgroundColor: isDark ? colors.DARKER_GREY : "white",
        // }}
      >
        <Box>
          <TouchableOpacity
            onPress={() => {
              setSearchSubj(searchSubj);
              handleClosePress();
            }}
          >
            <Text>확인</Text>
          </TouchableOpacity>
        </Box>
        <Picker
          ref={pickerRef}
          selectedValue={searchSubj}
          onValueChange={(itemValue, itemIndex) => setSearchSubj(itemValue)}
        >
          <Picker.Item label="AMS" value="AMS" />
          <Picker.Item label="ACC/BUS" value="ACC/BUS" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="ESE" value="ESE" />
          <Picker.Item label="EST/EMP" value="EST/EMP" />
          <Picker.Item label="MEC" value="MEC" />
          <Picker.Item label="교양/Writing" value="SH/Writing" />
        </Picker>
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default Search;
