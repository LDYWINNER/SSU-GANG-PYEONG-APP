import React from "react";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FadeInRight, FadeInLeft } from "react-native-reanimated";
import { ICategory } from "../../types";
import { AnimatedBox, Box, Text } from "../../theme";
import { ToDoScreenNavigationType } from "../../navigation/types";

type CategoryProps = {
  category: ICategory;
};

const Category = ({ category }: CategoryProps) => {
  const navigation = useNavigation<ToDoScreenNavigationType>();
  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {
      category: category,
    });
  };

  const navigateToCategoryScreen = () => {
    navigation.navigate("Category", {
      id: category._id,
    });
  };

  return (
    <AnimatedBox entering={FadeInRight} exiting={FadeInLeft}>
      <TouchableOpacity onPress={navigateToCategoryScreen}>
        <Box bg="lightGray" p="4" borderRadius="rounded-5xl">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexDirection="row">
              <Text variant="textBase" fontWeight="600" mr="3">
                {category.icon.symbol}
              </Text>
              <Text variant="textBase" fontWeight="600">
                {category.name}
              </Text>
            </Box>
            <TouchableOpacity onPress={navigateToCreateCategory}>
              <Entypo name="dots-three-vertical" size={16} />
            </TouchableOpacity>
          </Box>
        </Box>
      </TouchableOpacity>
    </AnimatedBox>
  );
};

export default Category;
