import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  GoalDetail: { goalId: number };
};

export type TabParamList = {
  Home: undefined;
  Goals: undefined;
  Profile: undefined;
};

// TODO: Task 5 - Add proper TypeScript types for navigation
// Use these types in your navigation components for type safety
