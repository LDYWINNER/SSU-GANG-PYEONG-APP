import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BulletinMain,
  BulletinDetail,
  BulletinPost,
  BulletinSearch,
  WritePost,
} from "../../screens/bulletinScreens";

const NativeStack = createNativeStackNavigator();

const BulletinStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NativeStack.Screen
        name="BulletinMain"
        component={BulletinMain}
        options={{ presentation: "card" }}
      />
      <NativeStack.Screen
        name="BulletinDetail"
        component={BulletinDetail}
        options={{ presentation: "card" }}
      />

      <NativeStack.Screen
        name="BulletinSearch"
        component={BulletinSearch}
        options={{ presentation: "card" }}
      />
      <NativeStack.Screen
        name="BulletinPost"
        component={BulletinPost}
        options={{ presentation: "card" }}
      />
      <NativeStack.Screen
        name="WritePost"
        component={WritePost}
        options={{ presentation: "card" }}
      />
    </NativeStack.Navigator>
  );
};

export default BulletinStack;
