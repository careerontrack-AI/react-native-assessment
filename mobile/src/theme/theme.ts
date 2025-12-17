import { palette, lightColors, darkColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';
import { shadows } from './tokens/shadows';

export type Theme = {
  colors: typeof lightColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  components: {
    card: { padding: number; radius: number };
    button: { height: number; radius: number };
  };
};

export const makeTheme = (mode: 'light' | 'dark'): Theme => ({
  colors: mode === 'light' ? lightColors : darkColors,
  spacing,
  radius,
  typography,
  shadows,
  components: {
    card: { padding: spacing.lg, radius: radius.lg },
    button: { height: 44, radius: radius.lg },
  },
});