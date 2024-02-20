import { useTheme } from "@shopify/restyle";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../theme";

type SafeAreaWrapperProps = {
  children: ReactNode;
};

const SafeAreaWrapper = ({ children }: SafeAreaWrapperProps) => {
  const theme = useTheme<Theme>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.mainBgColor,
        marginBottom: -25,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
