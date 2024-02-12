import React from "react";
import { Box, Text } from "../theme";
import { Divider, SafeAreaWrapper } from "../components";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import {
  MaterialCommunityIcons,
  Foundation,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { Alert, Image } from "react-native";

const SchoolInfo = () => {
  const openLink = async (index: string) => {
    let baseUrl = "";
    switch (index) {
      case "ACCL":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030501.html";
        break;
      case "Monthly":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub05/0505.html";
        break;
      case "Scholarship":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030503.html";
        break;
      case "Forms":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030505.html";
        break;

      case "CDCMeeting":
        baseUrl = "https://sunykoreacdc.youcanbook.me/";
        break;
      case "CR":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub04/040405.html";
        break;
      case "CE":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub04/040404.html";
        break;

      case "Housing":
        baseUrl = "https://housing.igc.or.kr/";
        break;
      case "MR":
        baseUrl = "https://housing.igc.or.kr/house/requests.do";
        break;
      case "Menu":
        baseUrl = "https://housing.igc.or.kr/about/cafeteria_menu.do";
        break;

      case "AMS":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030101.html";
        break;
      case "BUS":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030105.html";
        break;
      case "CSE":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030104.html";
        break;
      case "ECE":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030106.html";
        break;
      case "MEC":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030102.html";
        break;
      case "TSM":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/030103.html";
        break;
      case "SciHum":
        baseUrl = "https://www.sunykorea.ac.kr/en/html/sub03/0303.html";
        break;

      case "SUNYK":
        baseUrl = "https://www.sunykorea.ac.kr/en/";
        break;
      case "SBU":
        baseUrl = "https://www.stonybrook.edu/";
        break;
    }

    // await Linking.openURL(baseUrl);
    await WebBrowser.openBrowserAsync(baseUrl);
  };

  return (
    <SafeAreaWrapper>
      <ScrollView>
        <Box mx="4">
          <Text
            variant="text2Xl"
            fontWeight="700"
            textDecorationLine="underline"
            textDecorationColor="iconBlue"
            textDecorationStyle="double"
            mb="6"
          >
            School Info
          </Text>

          <Text variant="textXl" fontWeight="500" mb="2">
            Academic
          </Text>
          <Box>
            <TouchableOpacity onPress={() => openLink("ACCL")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <FontAwesome name="list-alt" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="3">
                  Academic Calendar & Course List
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("Monthly")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <FontAwesome name="calendar" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="3">
                  SUNY Korea Monthly Schedule
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("Scholarship")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <FontAwesome5 name="money-bill" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Scholarship
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("Forms")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <AntDesign name="form" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="3">
                  Forms
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Divider />

          <Text variant="textXl" fontWeight="500" mb="2">
            Career
          </Text>
          <Box>
            <TouchableOpacity onPress={() => openLink("CDCMeeting")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="human-greeting-proximity"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="500" ml="3">
                  Book meeting with CDC
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("CR")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="file-document"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="500" ml="3">
                  Career Resources
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("CE")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialIcons name="event" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="3">
                  Career Events
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Divider />

          <Text variant="textXl" fontWeight="500" mb="2">
            Housing
          </Text>
          <Box>
            <TouchableOpacity onPress={() => openLink("Housing")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialIcons name="apartment" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Housing Website
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Housing Office Contact",
                  "1. Office Contact Point \n (TEL) 032-626-4856 \n (KaKaoTalk Channel ID): igchousing \n\n 2. Security Office (After Office Hour) \n (A114) 032-626-0110 \n(B150) 032-626-0111 \n\n 3. Housing Office Location \nHousing A117(1F) \n(In front of Housing A Fitness center) \n\n 4. Office Hour \n-Weekday(Mon-Fri) 9:00 ~ 18:00 \n * Break Time: 12:00 ~ 13:00\n-Weekend(Sat-Sun) Closed",
                  [{ text: "OK", onPress: () => {} }]
                )
              }
            >
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <AntDesign name="contacts" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Housing Office Contact
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("MR")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <AntDesign name="exclamationcircleo" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Housing Maintenance Request
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("Menu")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialIcons name="restaurant-menu" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Housing Cafeteria menu
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Divider />

          <Text variant="textXl" fontWeight="500" mb="2">
            Major Websites
          </Text>
          <Box>
            <TouchableOpacity onPress={() => openLink("AMS")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="math-integral"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Applied Mathematics and Statistics
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("BUS")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
                pl="4"
              >
                <Foundation name="torso-business" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="3">
                  Business Management
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("CSE")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <AntDesign name="codesquareo" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Computer Science
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("ECE")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="electric-switch"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Electrical and Computer Engineering
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("MEC")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="robot-dead"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Mechanical Engineering
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("TSM")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <FontAwesome5 name="people-arrows" size={24} color="black" />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Technology Systems Management
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("SciHum")}>
              <Box
                bg="gray200"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <MaterialCommunityIcons
                  name="nature-people"
                  size={24}
                  color="black"
                />
                <Text variant="textBase" fontWeight="500" ml="2">
                  Faculty of Sciences and Humanities
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Divider />

          <Text variant="textXl" fontWeight="500" mb="2">
            School
          </Text>
          <Box>
            <TouchableOpacity onPress={() => openLink("SUNYK")}>
              <Box
                bg="iconBlue"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <Image
                  source={require("../assets/images/SUNY_logo.png")}
                  style={{ width: 36, height: 30 }}
                />
                <Text variant="textBase" fontWeight="500" ml="2" color="white">
                  SUNY Korea
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("SBU")}>
              <Box
                bg="sbuRed"
                borderRadius="rounded-2xl"
                mb="3"
                p="3"
                flexDirection="row"
                alignItems="center"
              >
                <Image
                  source={require("../assets/images/woolfie.png")}
                  style={{ width: 36, height: 30 }}
                />
                <Text variant="textBase" fontWeight="500" ml="2" color="white">
                  Stony Brook University
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Divider />
        </Box>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SchoolInfo;
