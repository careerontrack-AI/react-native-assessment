import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme, useThemeContext } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import TopBar from '../components/TopBar';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// TODO: Task 2 - Complete Profile Screen
// Requirements:
// 1. Display user information (name, email)
// 2. Add edit profile functionality
// 3. Integrate with userService.getProfile() and userService.updateProfile()
// 4. Show loading and error states
// 5. Add logout functionality
// 6. Update local auth context after profile update

export default function ProfileScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeContext();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setName(profile.name);
      setEmail(profile.email);
      updateUser(profile);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await userService.updateProfile({ name, email });
      updateUser(updated);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    content: {
      padding: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.size.xxl,
      fontWeight: theme.typography.weight.bold,
      fontFamily: theme.typography.font.bold,
      marginBottom: theme.spacing.xxl,
      color: theme.colors.textPrimary,
    },
    section: {
      marginBottom: theme.spacing.xxl,
    },
    value: {
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textPrimary,
    },
    buttonContainer: {
      marginTop: theme.spacing.sm,
    },
    themeSection: {
      marginBottom: theme.spacing.xxl,
    },
    themeOptionContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surfaceAlt,
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    themeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.xs,
    },
    themeOptionActive: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.card,
    },
    themeOptionText: {
      fontSize: theme.typography.size.sm,
      fontFamily: theme.typography.font.medium,
      color: theme.colors.textSecondary,
    },
    themeOptionTextActive: {
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.font.semiBold,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.xxl,
    },
  });

  if (loading && !user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Profile" />
      <ScrollView>
        <View style={styles.content}>

        <View style={styles.section}>
          <Label>Name</Label>
          {isEditing ? (
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Label>Email</Label>
          {isEditing ? (
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <Button
                title="Save"
                onPress={handleSave}
                disabled={loading}
                loading={loading}
                variant="default"
                size="lg"
                style={{ marginBottom: theme.spacing.md }}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                }}
                disabled={loading}
                variant="outline"
                size="lg"
                style={{ marginBottom: theme.spacing.md }}
              />
            </>
          ) : (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="default"
              size="lg"
              style={{ marginBottom: theme.spacing.md }}
            />
          )}
        </View>

        <View style={styles.divider} />

        {/* Theme Toggle Section */}
        <View style={styles.themeSection}>
          <Label>Appearance</Label>
          <View style={styles.themeOptionContainer}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && styles.themeOptionActive,
              ]}
              onPress={() => setThemeMode('light')}
            >
              <Ionicons
                name="sunny-outline"
                size={18}
                color={
                  themeMode === 'light'
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'light' && styles.themeOptionTextActive,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && styles.themeOptionActive,
              ]}
              onPress={() => setThemeMode('dark')}
            >
              <Ionicons
                name="moon-outline"
                size={18}
                color={
                  themeMode === 'dark'
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'dark' && styles.themeOptionTextActive,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'system' && styles.themeOptionActive,
              ]}
              onPress={() => setThemeMode('system')}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={18}
                color={
                  themeMode === 'system'
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'system' && styles.themeOptionTextActive,
                ]}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="destructive"
          size="lg"
          style={{ marginTop: theme.spacing.xl }}
        />
      </View>
      </ScrollView>
    </View>
  );
}

