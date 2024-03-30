import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import useSWRMutation from "swr/mutation";
import { fetcher } from "../utils/config";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaWrapper, Loader } from "../components";
import { Box, Text } from "../theme";
import { ICourse } from "../types";
import { FlatList, TouchableOpacity } from "react-native";
import { Rating } from "@kolking/react-native-rating";
import BottomSheet, {
  BottomSheetBackdrop,
  WINDOW_HEIGHT,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface ISearch {
  keyword: string;
}

const Search: React.FC<NativeStackScreenProps<any, "Search">> = ({
  navigation: { navigate },
}) => {
  const theme = useTheme<Theme>();

  const [searchSubj, setSearchSubj] = useState<string>("ALL");

  const navigateToCourseDetail = (courseId: string) => {
    navigate("MainStack", { screen: "CourseDetail", params: { id: courseId } });
  };

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
      ? `api/v1/course?searchSubj=${searchSubj}`
      : `api/v1/course?searchSubj=${searchSubj}&keyword=${watch("keyword")}`,
    fetcher
  );

  //bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [270], []);
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

  if (!data) {
    return <Loader />;
  }
  return (
    <SafeAreaWrapper>
      <Box flexDirection="row" alignItems="center">
        <TouchableOpacity onPress={() => togglePicker("searchSubj")}>
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
                  fontSize: 18,
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
      <Box mb="3" />

      {isMutating ? (
        <Loader />
      ) : (
        <FlatList
          data={data!.queryCourses}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => navigateToCourseDetail(item._id)}
              >
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
                      {data.queryCourses[index].unique_instructor.includes(
                        "/"
                      ) ? (
                        data.queryCourses[index].unique_instructor
                          .split("/")
                          .map((prof, index) =>
                            prof.length > 14 ? (
                              <Box key={index}>
                                <Text>{prof.split(" ").slice(0, -1)}</Text>
                                <Text>{"~" + prof.split(" ").at(-1)}</Text>
                              </Box>
                            ) : (
                              <Text key={index}>{prof}</Text>
                            )
                          )
                      ) : data.queryCourses[index].unique_instructor.length >
                        14 ? (
                        <Box>
                          <Text>
                            {data.queryCourses[index].unique_instructor
                              .split(" ")
                              .slice(0, -1)}
                          </Text>
                          <Text>
                            {"~" +
                              data.queryCourses[index].unique_instructor
                                .split(" ")
                                .at(-1)}
                          </Text>
                        </Box>
                      ) : (
                        <Text>
                          {data.queryCourses[index].unique_instructor}
                        </Text>
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
                      {item.avgGrade
                        ? "(" + item.avgGrade.toFixed(1) + ")"
                        : ""}
                    </Text>
                  </Box>
                </Box>
              </TouchableOpacity>
            );
          }}
        />
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
    </SafeAreaWrapper>
  );
};

export default Search;
