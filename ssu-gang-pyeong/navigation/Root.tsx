import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import MainStack from "./MainStack";
import useUserGlobalStore from "../store/useUserGlobal";
import AuthStack from "./AuthStack";

const Nav = createNativeStackNavigator();

const Root = () => {
  const { user, updateUser } = useUserGlobalStore();

  // useEffect(() => {
  //   updateUser({
  //     username: "",
  //     email: "",
  //     school: "",
  //     major: "",
  //     courseReviewNum: 0,
  //     adminAccount: false,
  //   });
  // }, []);

  useEffect(() => {
    updateUser(null);
  }, []);

  return (
    <>
      {user ? (
        <Nav.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Nav.Screen name="MainTabs" component={MainTabs} />
          <Nav.Screen name="MainStack" component={MainStack} />
        </Nav.Navigator>
      ) : (
        <AuthStack />
      )}
    </>
  );
};
export default Root;
