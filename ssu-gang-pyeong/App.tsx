import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

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
    const images = loadImages([require("./"), require("./")]);
    const fonts = loadFonts([Ionicons.font]);
    await Promise.all([...fonts, ...images]);
  };
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return null;
}
