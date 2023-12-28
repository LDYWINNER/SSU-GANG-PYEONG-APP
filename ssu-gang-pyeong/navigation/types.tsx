import { ICategory } from "../types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type BulletinStackParamList = {
  BulletinMain: undefined;
  BulletinDetail: undefined;
  BulletinPost: undefined;
  BulletinSearch: undefined;
};

export type SearchStackParamList = {
  Search: undefined;
};

export type HomeStackParamList = {
  HomeTopTabs: undefined;
  EasyPick: {
    togglePicker: any;
  };
  AddCourse: undefined;
};

export type ToDoStackParamList = {
  ToDo: undefined;
  CreateCategory: {
    category?: ICategory;
  };
  Categories: undefined;
  Category: {
    id: string;
  };
  CompletedToDo: undefined;
};

export type NotificationStackParamList = {
  Notification: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

export type MainTabsParamList = {
  BulletinStack: NavigatorScreenParams<BulletinStackParamList>;
  SearchStack: NavigatorScreenParams<SearchStackParamList>;
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ToDoStack: NavigatorScreenParams<ToDoStackParamList>;
  MotificationStack: NavigatorScreenParams<NotificationStackParamList>;
};

export type MainStackParamList = {
  CourseDetail: {
    id: string;
  };
  CourseReview: {
    courseIndex: number[];
    id: string;
  };
  WriteReview: undefined;
  MyAccount: undefined;
  MainStack: { screen: string; params: { id: string } };
};

export type MainParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  MainStack: NavigatorScreenParams<MainStackParamList>;
};

export type RootStackParamList = {
  Root: NavigatorScreenParams<MainParamList>;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AuthScreenNavigationType<
  RouteName extends keyof AuthStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, RouteName>,
  NativeStackNavigationProp<RootStackParamList, "Root">
>;

export type RootTabScreenProps<Screen extends keyof MainTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabsParamList, Screen>,
    NativeStackScreenProps<MainTabsParamList>
  >;

export type HomeScreenNavigationType =
  NativeStackNavigationProp<HomeStackParamList>;

export type ToDoScreenNavigationType =
  NativeStackNavigationProp<ToDoStackParamList>;

export type MainStackNavigationType =
  NativeStackNavigationProp<MainStackParamList>;
