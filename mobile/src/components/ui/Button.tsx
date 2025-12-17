import { useThemedStyles } from '../../theme/useThemedStyles';
import React from 'react';
import {
    Text,
    Pressable,
    ActivityIndicator,
    GestureResponderEvent,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: Variant;
    size?: Size;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled,
    loading,
    variant = 'default',
    size = 'default',
    style,
    textStyle,
}) => {
    const styles = useThemedStyles(theme => ({
        base: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.lg,
        },

        // Size styles
        size_default: {
            height: 40,
            paddingHorizontal: theme.spacing.lg,
        },
        size_sm: {
            height: 36,
            paddingHorizontal: theme.spacing.md,
        },
        size_lg: {
            height: 44,
            paddingHorizontal: theme.spacing.xl,
        },
        size_icon: {
            height: 40,
            width: 40,
            padding: 0,
        },

        // Variant backgrounds
        variant_default: {
            backgroundColor: theme.colors.primary,
        },
        variant_destructive: {
            backgroundColor: theme.colors.error,
        },
        variant_outline: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        variant_secondary: {
            backgroundColor: theme.colors.border,
        },
        variant_ghost: {
            backgroundColor: 'transparent',
        },
        variant_link: {
            backgroundColor: 'transparent',
        },

        // Pressed effect
        pressed: {
            opacity: 0.85,
        },

        // Disabled state
        disabled: {
            opacity: 0.5,
        },

        // Text styles
        text: {
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.medium,
            fontFamily: theme.typography.font.medium,
        },
        text_default: {
            color: theme.colors.white,
        },
        text_destructive: {
            color: theme.colors.white,
        },
        text_outline: {
            color: theme.colors.textPrimary,
        },
        text_secondary: {
            color: theme.colors.textPrimary,
        },
        text_ghost: {
            color: theme.colors.primary,
        },
        text_link: {
            color: theme.colors.primary,
            textDecorationLine: 'underline',
        },
    }));

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.base,
                styles[`variant_${variant}`],
                styles[`size_${size}`],
                disabled && styles.disabled,
                pressed && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={styles.text_default.color} />
            ) : (
                <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
};

export default Button;
