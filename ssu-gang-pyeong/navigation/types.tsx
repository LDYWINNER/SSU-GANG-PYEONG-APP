import { IBulletinPost, ICategory, ITable, ITask } from "../types";
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
  BulletinDetail: {
    name: string;
  };
  BulletinPost: {
    id: string;
    board: string;
  };
  BulletinSearch: {
    board?: string;
  };
  WritePost: {
    post?: IBulletinPost;
    courseInfo?: string;
    board: string;
  };
};

export type SearchStackParamList = {
  Search: undefined;
};

export type HomeStackParamList = {
  HomeTopTabs: undefined;
  EasyPick: {
    togglePicker: () => void;
  };
  ManualPick: undefined;
  AddCourse: undefined;
  Tables: undefined;
  CreateTable: {
    table?: ITable;
  };
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
  EditTask: {
    task: ITask;
    date: string | undefined;
  };
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
  CourseBulletin: {
    courseSubj?: string;
    courseNumber?: string;
  };
  WriteReview: {
    id: string;
  };
  MyAccount: undefined;
  UserMain: undefined;
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
