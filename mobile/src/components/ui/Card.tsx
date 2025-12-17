import { useThemedStyles } from '../../theme/useThemedStyles';
import React, { forwardRef } from 'react';
import {
  View,
  Text,
  ViewProps,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';

interface WithStyle {
  style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[];
}

export const CardBase = forwardRef<View, ViewProps & WithStyle>(({ style, ...props }, ref) => {
  const styles = useThemedStyles(theme => ({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderColor: theme.colors.border,
      borderWidth: 1,
      padding: theme.spacing.lg,
    },
  }));

  return <View ref={ref} style={[styles.card, style]} {...props} />;
});
CardBase.displayName = 'CardBase';

// Pressable card container for clickable cards (no animation)
export interface PressableCardProps extends ViewProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | (ViewStyle | TextStyle)[];
  children: React.ReactNode;
}

export const PressableCard: React.FC<PressableCardProps> = ({
  onPress,
  disabled = false,
  style,
  children,
  ...props
}) => {
  const styles = useThemedStyles(theme => ({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderColor: theme.colors.border,
      borderWidth: 1,
      padding: theme.spacing.lg,
    },
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && !disabled && { opacity: 1 }, // No visual feedback on press
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};
PressableCard.displayName = 'PressableCard';
