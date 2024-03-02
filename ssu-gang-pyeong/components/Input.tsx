import { lightTheme, Box, Text } from "../theme";
import { FieldError } from "react-hook-form";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

type InputProps = {
  label: string;
  error?: FieldError | undefined;
} & TextInputProps;

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <Box flexDirection="column">
      <Text variant="textSm" textTransform="uppercase" mb="3.5">
        {label}
      </Text>
      <TextInput
        autoComplete="off"
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: error
            ? lightTheme.colors.rose500
            : lightTheme.colors.grey,
          borderRadius: lightTheme.borderRadii["rounded-7xl"],
        }}
        {...props}
      />
      {error && (
        <Text mt="3.5" color="rose500">
          {error.message}
        </Text>
      )}
    </Box>
  );
};

export default Input;
