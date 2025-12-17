import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';

interface TopBarProps {
  title?: string;
  backgroundColor?: string;
  onBack?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title = '',
  backgroundColor,
  onBack,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(theme => ({
    container: {
      backgroundColor: backgroundColor || theme.colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      // Platform-specific styling
      ...(Platform.OS === 'android' && {
        elevation: 2,
      }),
      ...(Platform.OS === 'ios' && {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }),
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // Platform-specific heights: iOS ~44pt, Android 56dp
      height: Platform.OS === 'ios' ? 44 : 56,
      paddingHorizontal: theme.spacing.lg,
    },
    backButton: {
      marginRight: theme.spacing.md,
      padding: theme.spacing.xs,
      borderRadius: theme.radius.md,
      minWidth: 40,
      minHeight: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      color: theme.colors.primary,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.typography.size.xl,
      fontWeight: theme.typography.weight.bold,
      color: theme.colors.textPrimary,
      lineHeight: theme.typography.lineHeight.lg,
      // Platform-specific title styling
      ...(Platform.OS === 'ios' && {
        fontWeight: theme.typography.weight.semiBold,
      }),
      ...(Platform.OS === 'android' && {
        fontSize: theme.typography.size.lg,
      }),
    },
  }));

  // Calculate total height including safe area insets
  const totalHeight = Platform.OS === 'ios' 
    ? 44 + insets.top 
    : 56 + insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          minHeight: totalHeight,
        },
      ]}
    >
      <View style={styles.inner}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.6 },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size={Platform.OS === 'ios' ? 28 : 24}
              style={styles.backIcon}
            />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TopBar;

