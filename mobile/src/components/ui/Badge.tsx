
import { useThemedStyles } from '../../theme/useThemedStyles';
import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'owned' | 'notOwned';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
  textStyle,
}) => {
  const styles = useThemedStyles(theme => ({
    base: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.weight.medium,
    },
    default: {
      backgroundColor: theme.colors.primary,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: theme.colors.textPrimary,
      borderColor: 'transparent',
    },
    destructive: {
      backgroundColor: theme.colors.error,
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    },
    owned: {
      backgroundColor: theme.colors.success,
      borderColor: 'transparent',
    },
    notOwned: {
      backgroundColor: theme.colors.warning,
      borderColor: 'transparent',
    },
  }));

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
      case 'owned':
      case 'notOwned':
        return '#111827'; // Dark text for these variants
      default:
        return '#ffffff'; // White text for others
    }
  };

  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{label}</Text>
    </View>
  );
};

export default Badge;
