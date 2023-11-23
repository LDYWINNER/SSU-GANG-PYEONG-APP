import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Image, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "@shopify/restyle";
import { darkTheme, lightTheme } from "./theme/index";
import { QueryClient, QueryClientProvider } from "react-query";
import Root from "./navigation/Root";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

type Props = {
  Ionicons: keyof typeof Ionicons.glyphMap | any;
};

const loadFonts = (fonts: any[]) => fonts.map((font) => Font.loadAsync(font));

const loadImages = (images: any[]) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.loadAsync(image);
    }
  });

export default function App({ Ionicons }: Props) {
  const [ready, setReady] = useState(false);
  const onFinish = () => {
    setReady(true);
  };
  const startLoading = async () => {
    const images = loadImages([
      require("./assets/images/logo.png"),
      require("./assets/images/logo-transparent.png"),
    ]);
    // font preload not working
    //const fonts = loadFonts([Ionicons.font]);
    //await Promise.all([...fonts, ...images]);
    await Promise.all([...images]);
  };
  const isDark = useColorScheme() === "dark";
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <Root />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
