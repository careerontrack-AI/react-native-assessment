import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  GoalDetail: { goalId: number };
};

export type TabParamList = {
  Home: undefined;
  Goals: { refresh?: boolean } | undefined;
  Profile: undefined;
};

// Screen props for stack screens
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

// Screen props for tab screens (with access to parent stack)
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  StackScreenProps<RootStackParamList>
>;

// Convenience types for each screen
export type LoginScreenProps = RootStackScreenProps<'Login'>;
export type GoalDetailScreenProps = RootStackScreenProps<'GoalDetail'>;
export type HomeScreenProps = TabScreenProps<'Home'>;
export type GoalsScreenProps = TabScreenProps<'Goals'>;
export type ProfileScreenProps = TabScreenProps<'Profile'>;

