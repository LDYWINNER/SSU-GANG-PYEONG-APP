import React, { useCallback, useState, useRef, useMemo } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useColorScheme } from "react-native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "@kolking/react-native-rating";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Picker } from "@react-native-picker/picker";

const Wrapper = styled.View<{ isDark: boolean }>`
  flex: 1;
  background-color: ${(props) => (props.isDark ? colors.BLACK_COLOR : "white")};
  padding: 0px 20px;
  padding-top: 70px;
`;

const Row = styled.View`
  flex-direction: row;
  width: 50%;
`;

const Col = styled.View``;

const Contents = styled.Text<{ isDark: boolean }>`
  color: ${(props) => (props.isDark ? "white" : colors.BLACK_COLOR)};
`;

const Btn = styled.TouchableOpacity<{ isDark: boolean; selected: boolean }>`
  padding: 10px;
  margin: 5px;
  border-width: 1px;
  border-color: ${(props) => (props.isDark ? "white" : colors.BLACK_COLOR)};
  border-radius: 5px;
  background-color: ${(props) =>
    props.selected ? colors.SBU_RED : "transparent"};
`;

const EvalInput = styled.TextInput<{ isDark: boolean }>`
  border-width: 1px;
  border-color: ${(props) => (props.isDark ? "white" : colors.BLACK_COLOR)};
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  min-height: 100px;
  color: ${(props) => (props.isDark ? "white" : colors.BLACK_COLOR)};
`;

const WriteReview = () => {
  const isDark = useColorScheme() === "dark";
  const [overallGrade, setOverallGrade] = useState(0);
  const [overallEvaluation, setOverallEvaluation] = useState("");
  const [anonymity, setAnonymity] = useState(false);

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

  const [semester, setSemester] = useState("2024-spring");
  const [instructor, setInstructor] = useState("Pick an item");
  const [myLetterGrade, setMyLetterGrade] = useState("Pick an item");
  const [difficulty, setDifficulty] = useState("");
  const [homeworkQuantity, setHomeworkQuantity] = useState("");
  const [testQuantity, setTestQuantity] = useState("");
  const [teamProjectPresence, setTeamProjectPresence] = useState("");
  const [quizPresence, setQuizPresence] = useState("");
  //new - 1. 성적은 어떻게 주시나요 2. 출석은 어떻게 확인하나요
  const [generosity, setGenerosity] = useState("");
  const [attendance, setAttendance] = useState("");

  const handleOGChange = (value: number) => setOverallGrade(value);

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
    <>
      <Wrapper isDark={isDark}>
        <ScrollView>
          <Contents isDark={isDark}>총 평점</Contents>
          <Rating
            size={40}
            rating={overallGrade}
            onChange={handleOGChange}
            spacing={30}
          />
          <Contents isDark={isDark}>총평</Contents>
          <EvalInput
            placeholder="이 곳에 대한 총평을 자유롭게 적어주세요."
            isDark={isDark}
            value={overallEvaluation}
            onChangeText={setOverallEvaluation}
            multiline
          />

          <Row>
            <Col>
              <Contents isDark={isDark}>수강학기</Contents>
              <TouchableOpacity onPress={() => togglePicker("semester")}>
                <Contents isDark={isDark}>{semester}</Contents>
              </TouchableOpacity>
            </Col>

            <Col>
              <Contents isDark={isDark}>교수님</Contents>
              <TouchableOpacity onPress={() => togglePicker("instructor")}>
                <Contents isDark={isDark}>{instructor}</Contents>
              </TouchableOpacity>
            </Col>
          </Row>

          <Contents isDark={isDark}>받은 Letter Grade(optional)</Contents>
          <TouchableOpacity onPress={() => togglePicker("myLetterGrade")}>
            <Contents isDark={isDark}>{myLetterGrade}</Contents>
          </TouchableOpacity>

          <Contents isDark={isDark}>수업 내용 난이도</Contents>
          <Row>
            {questions.difficulty.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={difficulty === option}
                onPress={() => setDifficulty(option)}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>성적은 어떻게 주시나요?</Contents>
          <Row>
            {questions.generosity.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={generosity === option}
                onPress={() => setGenerosity(option)}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>시험 개수(미드텀 & 파이널)</Contents>
          <Row>
            {questions.testQuantity.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={testQuantity === option}
                onPress={() => setTestQuantity(option)}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>과제량</Contents>
          <Row>
            {questions.homeworkQuantity.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={homeworkQuantity === option}
                onPress={() => setHomeworkQuantity(option)}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>퀴즈 유무</Contents>
          <Row>
            {questions.quizPresence.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={quizPresence === option}
                onPress={() => {
                  setQuizPresence(option);
                }}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>출석은 어떻게 확인하나요?</Contents>
          <Row>
            {questions.attendance.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={attendance === option}
                onPress={() => setAttendance(option)}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>팀플 유무</Contents>
          <Row>
            {questions.teamProjectPresence.map((option, index) => (
              <Btn
                key={index}
                isDark={isDark}
                selected={teamProjectPresence === option}
                onPress={() => {
                  setTeamProjectPresence(option);
                }}
              >
                <Contents isDark={isDark}>{option}</Contents>
              </Btn>
            ))}
          </Row>

          <Contents isDark={isDark}>익명</Contents>
        </ScrollView>
      </Wrapper>
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
        <Row>
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
            <Contents isDark={isDark}>확인</Contents>
          </TouchableOpacity>
        </Row>
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
    </>
  );
};

export default WriteReview;
