import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemedStyles } from '../../theme/useThemedStyles';

interface InputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const Input = React.forwardRef<TextInput, InputProps>(({ style, editable = true, ...props }, ref) => {
  const theme = useTheme();
  const styles = useThemedStyles(theme => ({
    container: {
      width: '100%',
    },
    input: {
      height: 40,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.size.md,
      color: theme.colors.textPrimary,
    },
    disabled: {
      opacity: 0.5,
    },
  }));

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        style={[styles.input, !editable && styles.disabled, style]}
        editable={editable}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
