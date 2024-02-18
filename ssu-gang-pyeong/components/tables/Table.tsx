import React from "react";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FadeInRight, FadeInLeft } from "react-native-reanimated";
import { ITable } from "../../types";
import { AnimatedBox, Box, Text } from "../../theme";
import { HomeScreenNavigationType } from "../../navigation/types";

type TableProps = {
  table: ITable;
};

const Table = ({ table }: TableProps) => {
  const navigation = useNavigation<HomeScreenNavigationType>();
  const navigateToCreateTable = () => {
    navigation.navigate("CreateTable", {
      table: table,
    });
  };

  return (
    <AnimatedBox entering={FadeInRight} exiting={FadeInLeft}>
      <Box bg="lightGray" p="4" borderRadius="rounded-5xl">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row">
            <Text variant="textBase" fontWeight="600">
              {table.name}
            </Text>
          </Box>
          <TouchableOpacity onPress={navigateToCreateTable}>
            <Entypo name="dots-three-vertical" size={16} />
          </TouchableOpacity>
        </Box>
      </Box>
    </AnimatedBox>
  );
};

export default Table;
