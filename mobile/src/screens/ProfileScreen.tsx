import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

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
      fontFamily: theme.typography.font.bold,
      fontWeight: '700',
      marginBottom: theme.spacing.xxl,
      color: theme.colors.textPrimary,
    },
    section: {
      marginBottom: theme.spacing.xxl,
    },
    label: {
      fontSize: theme.typography.size.sm,
      fontFamily: theme.typography.font.medium,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
      color: theme.colors.textSecondary,
    },
    value: {
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textPrimary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.regular,
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.textPrimary,
    },
    buttonContainer: {
      marginTop: theme.spacing.sm,
    },
    button: {
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.card,
    },
    editButton: {
      backgroundColor: theme.colors.primary,
    },
    saveButton: {
      backgroundColor: theme.colors.success,
    },
    cancelButton: {
      backgroundColor: theme.colors.textTertiary,
    },
    logoutButton: {
      backgroundColor: theme.colors.error,
      marginTop: theme.spacing.xl,
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.semiBold,
      fontWeight: '600',
    },
    logoutButtonText: {
      color: theme.colors.white,
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textTertiary}
            />
          ) : (
            <Text style={styles.value}>{name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.textTertiary}
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
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

