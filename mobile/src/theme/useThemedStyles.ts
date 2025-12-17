import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';
import type { Theme } from './theme';

export const useThemedStyles = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (t: Theme) => T
) => {
  const t = useTheme();
  return StyleSheet.create(factory(t));
};