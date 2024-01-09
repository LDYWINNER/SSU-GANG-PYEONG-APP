import React, { useCallback, useState, useRef, useMemo } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Rating } from "@kolking/react-native-rating";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";
import { Divider, NavigateBack, SafeAreaWrapper } from "../components";
import { Box, Text, Theme } from "../theme";
import { Controller, useForm } from "react-hook-form";
import axiosInstance from "../utils/config";
import useSWRMutation from "swr/mutation";
import { ICourseEvalPostRequest } from "../types";
import { MainStackParamList } from "../navigation/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface ICourseEval {
  overallGrade: number;
  overallEvaluation: string;
  anonymity: boolean;
  semester: string;
  instructor: string;
  myLetterGrade: string;
  difficulty: string;
  homeworkQuantity: string;
  testQuantity: string;
  teamProjectPresence: string;
  quizPresence: string;
  //new - 1. 성적은 어떻게 주시나요 2. 출석은 어떻게 확인하나요
  generosity: string;
  attendance: string;
}

type WriteReviewScreenRouteProp = RouteProp<MainStackParamList, "WriteReview">;

const addCourseEvalRequest = async (
  url: string,
  { arg }: { arg: ICourseEvalPostRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
      teamProjectPresence: "Yes" ? true : false,
      quizPresence: "Yes" ? true : false,
    });
  } catch (error) {
    console.log("error in addCourseEvalRequest", error);
    throw error;
  }
};

const WriteReview = () => {
  const isDark = useColorScheme() === "dark";
  const theme = useTheme<Theme>();
  const route = useRoute<WriteReviewScreenRouteProp>();
  const { id } = route.params;
  const navigation = useNavigation();

  const [semester, setSemester] = useState("2024-spring");
  const [instructor, setInstructor] = useState("Pick the instructor");
  const [myLetterGrade, setMyLetterGrade] = useState("Pick an item");
  const [anonymity, setAnonymity] = useState(true);

  const questions = {
    difficulty: ["difficult", "soso", "easy"],
    homeworkQuantity: ["many", "soso", "few"],
    //test quantity was orignially number type in sunytime
    testQuantity: ["morethan4", "three", "two", "one", "none"],
    //new
    generosity: ["generous", "normal", "meticulous"],
    attendance: ["calloutname", "rollpaper", "qrcode", "googleform", "none"],
    teamProjectPresence: ["Yes", "No"],
    quizPresence: ["Yes", "No"],
  };

  const { control, watch } = useForm<ICourseEval>({
    defaultValues: {
      overallGrade: 0,
      overallEvaluation: "",
      anonymity: false,
      difficulty: "",
      homeworkQuantity: "",
      testQuantity: "",
      teamProjectPresence: "",
      quizPresence: "",
      generosity: "",
      attendance: "",
    },
  });

  const { trigger: addCourseEval } = useSWRMutation(
    `api/v1/course/${id}`,
    addCourseEvalRequest
  );

  const createCourseEval = async () => {
    try {
      await addCourseEval({
        overallGrade: watch("overallGrade"),
        overallEvaluation: watch("overallEvaluation"),
        difficulty: watch("difficulty"),
        homeworkQuantity: watch("homeworkQuantity"),
        testQuantity: watch("testQuantity"),
        teamProjectPresence: watch("teamProjectPresence"),
        quizPresence: watch("quizPresence"),
        //new - 1. 성적은 어떻게 주시나요 2. 출석은 어떻게 확인하나요
        generosity: watch("generosity"),
        attendance: watch("attendance"),
        semester,
        instructor,
        myLetterGrade,
        anonymity,
      });
      navigation.goBack();
    } catch (error) {
      console.log("error in createNewPost", error);
      throw error;
    }
  };

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

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="2">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb="3"
        >
          <NavigateBack />
          <Text variant="textXl" fontWeight="600" mr="10">
            강의평 등록
          </Text>
          <Box></Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Box mx="3" style={{ marginBottom: "33%" }}>
            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                총 평점
              </Text>
              <Controller
                control={control}
                name="overallGrade"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Rating
                    size={40}
                    rating={value}
                    onChange={onChange}
                    spacing={30}
                  />
                )}
              />
            </Box>

            <Box mb="4" height={"15%"}>
              <Text variant="textBase" mb="2" fontWeight="600">
                총평
              </Text>
              <Controller
                name="overallEvaluation"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Fill the content."
                    style={{
                      paddingTop: 16,
                      padding: 16,
                      color: "black",
                      fontSize: 16,
                      textAlignVertical: "top", // to align text to the top on Android
                      flex: 1,
                      backgroundColor: theme.colors.gray300,
                      borderRadius: 10,
                    }}
                    multiline
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoComplete={"off"}
                    autoCorrect={false}
                    keyboardAppearance={"default"}
                  />
                )}
              />
            </Box>
            <Divider />

            <Box my="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                수강학기
              </Text>
              <Box flexDirection="row">
                <TouchableOpacity onPress={() => togglePicker("semester")}>
                  <Box
                    style={{
                      backgroundColor: theme.colors.gray300,
                      borderRadius: 10,
                    }}
                    flexDirection="row"
                    alignItems="center"
                    p="2"
                  >
                    <Text
                      fontWeight="600"
                      style={{
                        color: theme.colors.gray600,
                      }}
                    >
                      {semester}
                    </Text>
                    <Box width={1} />
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.gray5}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                교수님
              </Text>
              <Box flexDirection="row">
                <TouchableOpacity onPress={() => togglePicker("instructor")}>
                  <Box
                    style={{
                      backgroundColor: theme.colors.gray300,
                      borderRadius: 10,
                    }}
                    flexDirection="row"
                    alignItems="center"
                    p="2"
                  >
                    <Text
                      fontWeight="600"
                      style={{
                        color: theme.colors.gray600,
                      }}
                    >
                      {instructor}
                    </Text>
                    <Box width={1} />
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.gray5}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                받은 Letter Grade(optional)
              </Text>
              <Box flexDirection="row">
                <TouchableOpacity onPress={() => togglePicker("myLetterGrade")}>
                  <Box
                    style={{
                      backgroundColor: theme.colors.gray300,
                      borderRadius: 10,
                    }}
                    flexDirection="row"
                    alignItems="center"
                    p="2"
                  >
                    <Text
                      fontWeight="600"
                      style={{
                        color: theme.colors.gray600,
                      }}
                    >
                      {myLetterGrade}
                    </Text>
                    <Box width={1} />
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.gray5}
                    />
                  </Box>
                </TouchableOpacity>
              </Box>
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                수업 내용 난이도
              </Text>
              <Controller
                control={control}
                name="difficulty"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box flexDirection="row" alignItems="center">
                    {questions.difficulty.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(option)}
                      >
                        <Box
                          style={{
                            backgroundColor: value === option ? "red" : "white",
                          }}
                          p="3"
                          mx="1"
                          borderRadius="rounded-xl"
                          borderColor="gray4"
                          borderWidth={1}
                        >
                          <Text>{option}</Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                성적은 어떻게 주시나요?
              </Text>
              <Controller
                control={control}
                name="generosity"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box flexDirection="row" alignItems="center">
                    {questions.generosity.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(option)}
                      >
                        <Box
                          style={{
                            backgroundColor: value === option ? "red" : "white",
                          }}
                          p="3"
                          mx="1"
                          borderRadius="rounded-xl"
                          borderColor="gray4"
                          borderWidth={1}
                        >
                          <Text>{option}</Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                시험 개수(미드텀 & 파이널)
              </Text>
              <Controller
                control={control}
                name="testQuantity"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box flexDirection="row" alignItems="center">
                    {questions.testQuantity.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(option)}
                      >
                        <Box
                          style={{
                            backgroundColor: value === option ? "red" : "white",
                          }}
                          p="3"
                          mx="1"
                          borderRadius="rounded-xl"
                          borderColor="gray4"
                          borderWidth={1}
                        >
                          <Text>{option}</Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                과제량
              </Text>
              <Controller
                control={control}
                name="homeworkQuantity"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box flexDirection="row" alignItems="center">
                    {questions.homeworkQuantity.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(option)}
                      >
                        <Box
                          style={{
                            backgroundColor: value === option ? "red" : "white",
                          }}
                          p="3"
                          mx="1"
                          borderRadius="rounded-xl"
                          borderColor="gray4"
                          borderWidth={1}
                        >
                          <Text>{option}</Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                퀴즈 유무
              </Text>
              <Controller
                control={control}
                name="quizPresence"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box flexDirection="row" alignItems="center">
                    {questions.quizPresence.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(option)}
                      >
                        <Box
                          style={{
                            backgroundColor: value === option ? "red" : "white",
                          }}
                          p="3"
                          mx="1"
                          borderRadius="rounded-xl"
                          borderColor="gray4"
                          borderWidth={1}
                        >
                          <Text>{option}</Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Box mb="4">
              <Text variant="textBase" mb="2" fontWeight="600">
                출석은 어떻게 확인하나요?
              </Text>
              <Controller
                control={control}
                name="attendance"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Box flexDirection="row" alignItems="center">
                      {questions.attendance.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => onChange(option)}
                        >
                          <Box
                            style={{
                              backgroundColor:
                                value === option ? "red" : "white",
                            }}
                            p="3"
                            mx="1"
                            borderRadius="rounded-xl"
                            borderColor="gray4"
                            borderWidth={1}
                          >
                            <Text>{option}</Text>
                          </Box>
                        </TouchableOpacity>
                      ))}
                    </Box>
                  </ScrollView>
                )}
              />
            </Box>

            <Box mb="6">
              <Text variant="textBase" mb="2" fontWeight="600">
                팀플 유무
              </Text>
              <Controller
                control={control}
                name="teamProjectPresence"
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box flexDirection="row" alignItems="center">
                    {questions.teamProjectPresence.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(option)}
                      >
                        <Box
                          style={{
                            backgroundColor: value === option ? "red" : "white",
                          }}
                          p="3"
                          mx="1"
                          borderRadius="rounded-xl"
                          borderColor="gray4"
                          borderWidth={1}
                        >
                          <Text>{option}</Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </Box>
                )}
              />
            </Box>

            <TouchableOpacity onPress={() => setAnonymity(!anonymity)}>
              <Box flexDirection="row" alignItems="center">
                <BouncyCheckbox
                  size={25}
                  fillColor={theme.colors.sbuRed}
                  unfillColor="#FFFFFF"
                  text="익명"
                  iconStyle={{ borderColor: theme.colors.sbuRed }}
                  innerIconStyle={{
                    borderWidth: 2,
                  }}
                  disableText
                  isChecked={anonymity}
                  disableBuiltInState
                  onPress={() => setAnonymity(!anonymity)}
                />
                <Text
                  ml="1"
                  variant="textBase"
                  style={{ color: theme.colors.sbuRed }}
                >
                  익명
                </Text>
              </Box>
            </TouchableOpacity>

            <Box my="4" mb="10">
              <Text mb="1">수정 및 삭제가 불가능한 점 유의 바랍니다.</Text>
              <Text>
                비판은 괜찮지만 지나친 비난 혹은 수강평과 관련 없는 내용을
                작성할 경우 서비스 이용이 제한될 수 있습니다.
              </Text>
            </Box>

            <TouchableOpacity onPress={createCourseEval}>
              <Box
                style={{
                  backgroundColor: theme.colors.sbuRed,
                }}
                p="3"
                justifyContent="center"
                alignItems="center"
                borderRadius="rounded"
              >
                <Text
                  variant="textBase"
                  fontWeight="700"
                  style={{ color: "white" }}
                >
                  평가하기
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </ScrollView>
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
          backgroundColor: isDark ? colors.DARKER_GREY : "white",
        }}
      >
        <Box>
          <TouchableOpacity
            onPress={() => {
              if (pickerContents === "semester") {
                setSemester(semester);
                handleClosePress();
              } else if (pickerContents === "instructor") {
                setInstructor(instructor);
                handleClosePress();
              } else {
                setMyLetterGrade(myLetterGrade);
                handleClosePress();
              }
            }}
          >
            <Text>확인</Text>
          </TouchableOpacity>
        </Box>
        {pickerContents === "semester" ? (
          <Picker
            ref={pickerRef}
            selectedValue={semester}
            onValueChange={(itemValue, itemIndex) => setSemester(itemValue)}
          >
            <Picker.Item label="2024 Spring" value="2024-spring" />
            <Picker.Item label="2023 Fall" value="2023-fall" />
            <Picker.Item label="2023 Spring" value="2023-spring" />
            <Picker.Item label="2022 Fall" value="2022-fall" />
            <Picker.Item label="2022 Spring" value="2022-spring" />
            <Picker.Item label="2021 Fall" value="2021-fall" />
            <Picker.Item label="2021 Spring" value="2021-spring" />
          </Picker>
        ) : pickerContents === "instructor" ? (
          <Picker
            ref={pickerRef}
            selectedValue={instructor}
            onValueChange={(itemValue, itemIndex) => setInstructor(itemValue)}
          >
            <Picker.Item label="dongyoonlee" value="dongyoonlee" />
          </Picker>
        ) : (
          <Picker
            ref={pickerRef}
            selectedValue={myLetterGrade}
            onValueChange={(itemValue, itemIndex) =>
              setMyLetterGrade(itemValue)
            }
          >
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="C+" value="C+" />
            <Picker.Item label="C" value="C" />
            <Picker.Item label="C-" value="C-" />
            <Picker.Item label="D+" value="D+" />
            <Picker.Item label="D" value="D" />
            <Picker.Item label="F" value="F" />
            <Picker.Item label="I" value="I" />
            <Picker.Item label="W" value="W" />
          </Picker>
        )}
      </BottomSheet>
    </SafeAreaWrapper>
  );
};

export default WriteReview;
