import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import MainStack from "./MainStack";
import useUserGlobalStore from "../store/useUserGlobal";
import AuthStack from "./AuthStack";

const Nav = createNativeStackNavigator();

const Root = () => {
  const { user } = useUserGlobalStore();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Simulate an async task, e.g., fetching user data
    const checkUserStatus = async () => {
      setLoading(true);
      // Add your logic here to check user status
      if (user && user.courseReviewNum >= 3) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    };

    checkUserStatus();
  }, [user]); // Rerun when `user` changes

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Nav.Navigator screenOptions={{ headerShown: false }}>
      {isAuthorized ? (
        <>
          <Nav.Screen name="MainTabs" component={MainTabs} />
          <Nav.Screen name="MainStack" component={MainStack} />
        </>
      ) : (
        <Nav.Screen name="AuthStack" component={AuthStack} />
      )}
    </Nav.Navigator>
  );
};

export default Root;
