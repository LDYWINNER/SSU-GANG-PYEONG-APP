import React from "react";
import { NavigateBack, SafeAreaWrapper } from "../../components";
import { useTheme } from "@shopify/restyle";
import { Box, Text, Theme } from "../../theme";
import { ScrollView } from "react-native-gesture-handler";
import { Alert, TouchableOpacity, Dimensions } from "react-native";
import TimeTable from "@mikezzb/react-native-timetable";

const AddCourse = () => {
  const theme = useTheme<Theme>();
  const windowHeight = Dimensions.get("window").height;

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <NavigateBack />
            <Text ml="13" variant="textXl" fontWeight="600" mr="10">
              수업추가
            </Text>
            <TouchableOpacity>
              <Box
                style={{
                  backgroundColor: theme.colors.sbuRed,
                }}
                p="2"
                px="3"
                borderRadius="rounded-4xl"
              >
                <Text
                  variant="textBase"
                  fontWeight="600"
                  style={{ color: "white" }}
                >
                  완료
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box height={16} />

          <Box height={windowHeight * 0.3}>
            <TimeTable
              eventGroups={[]}
              // events={events}
              eventOnPress={(event) => Alert.alert(`${JSON.stringify(event)}`)}
            />
          </Box>

          <Box></Box>
        </ScrollView>
      </Box>
    </SafeAreaWrapper>
  );
};

export default AddCourse;
