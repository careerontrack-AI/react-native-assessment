import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

// TODO: Task 1 - Complete Login Screen
// The UI is already set up! You just need to:
// 1. Call login() from useAuth() hook when button is pressed
// 2. Show loading state (use the loading state variable)
// 3. Show error message if login fails (use Alert.alert)
// 
// Hint: The form validation is already done, just implement handleLogin function!

export default function LoginScreen() {
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
    // TODO: Implement login functionality
    // 1. Validate form (already done above)
    // 2. Set loading to true
    // 3. Call login(email, password) from useAuth
    // 4. Show error with Alert.alert if it fails
    // 5. Set loading to false when done

    if (!validateForm()) {
      return;
    }

    // Your code here:
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Unable to connect to server. Please check your internet connection.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
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
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.demoText}>
          Demo: demo@careerontrack.ai / demo123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08, // 8% of screen width
    paddingVertical: height * 0.05, // 5% of screen height
  },
  title: {
    fontSize: Math.min(width * 0.08, 32), // Responsive font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.primary,
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    textAlign: 'center',
    marginBottom: height * 0.05, // 5% of screen height
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: height * 0.025, // 2.5% of screen height
  },
  label: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    padding: height * 0.018, // Responsive padding
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 12,
    padding: height * 0.02, // Responsive padding
    alignItems: 'center',
    marginTop: height * 0.015, // Responsive margin
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: colors.background,
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
  },
  demoText: {
    textAlign: 'center',
    marginTop: height * 0.03, // Responsive margin
    color: colors.textTertiary,
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    backgroundColor: colors.highlight,
    padding: height * 0.01,
    borderRadius: 8,
  },
});

