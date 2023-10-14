import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  Ionicons: keyof typeof Ionicons.glyphMap;
};

export default function App({ Ionicons }: Props) {
  const [ready, setReady] = useState(false);
  const onFinish = () => {
    setReady(true);
  };
  const startLoading = async () => {
    await Font.loadAsync(Ionicons);
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
