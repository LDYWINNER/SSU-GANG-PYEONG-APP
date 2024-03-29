import { createBox, createText, createTheme } from "@shopify/restyle";
import Animated from "react-native-reanimated";
import { colors, palette } from "./colors";
import { textVariants } from "./text-variants";

const theme = createTheme({
  colors: {
    ...colors,
    mainBgColor: "",
    textColor: "",
  },
  spacing: {
    "-1": -4,
    "-4": -16,
    "-6": -24,
    "-8": -32,
    "0": 0,
    "1": 4,
    "1.5": 6,
    "2": 8,
    "3": 12,
    "3.5": 14,
    "4": 16,
    "5": 20,
    "5.5": 22,
    "6": 24,
    "10": 40,
    "11": 44,
    "12": 48,
    "13": 56,
  },
  borderRadii: {
    none: 0,
    rounded: 4,
    "rounded-xl": 8,
    "rounded-2xl": 10,
    "rounded-3xl": 12,
    "rounded-4xl": 16,
    "rounded-5xl": 20,
    "rounded-7xl": 28,
  },
  textVariants,
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBgColor: palette.stBlack,
    textColor: palette.white,
  },
};

export const lightTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBgColor: palette.white,
    textColor: palette.stBlack,
  },
};

export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const AnimatedText = Animated.createAnimatedComponent(Text);
export const AnimatedBox = Animated.createAnimatedComponent(Box);
