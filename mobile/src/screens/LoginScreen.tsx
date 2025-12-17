import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (loading) return; // Prevent double submission
    
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;

    // Validate with normalized email
    if (!normalizedEmail) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setErrors({ email: 'Email is invalid' });
      return;
    }
    if (!normalizedPassword) {
      setErrors({ password: 'Password is required' });
      return;
    }
    if (normalizedPassword.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    setErrors({});
    setLoading(true);
    
    try {
      console.log('Attempting login with:', normalizedEmail);
      await login(normalizedEmail, normalizedPassword);
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Invalid email or password';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.size.xxl,
      fontWeight: theme.typography.weight.bold,
      fontFamily: theme.typography.font.bold,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.regular,
      textAlign: 'center',
      marginBottom: theme.spacing.xxxl,
      color: theme.colors.textSecondary,
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.size.xs,
      fontFamily: theme.typography.font.regular,
      marginTop: theme.spacing.xs,
    },
    demoText: {
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      color: theme.colors.textTertiary,
      fontSize: theme.typography.size.xs,
      fontFamily: theme.typography.font.regular,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>CareerOnTrack</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Label>Email</Label>
            <Input
              style={errors.email ? { borderColor: theme.colors.error } : undefined}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Label>Password</Label>
            <Input
              style={errors.password ? { borderColor: theme.colors.error } : undefined}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="default"
            size="lg"
            style={{ marginTop: theme.spacing.md }}
          />
        </View>

        <Text style={styles.demoText}>
          Demo: demo@careerontrack.ai / demo123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

