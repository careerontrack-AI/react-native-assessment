import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { useAuth } from '../src/context/AuthContext';

// Mock dependencies
jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByText('CareerOnTrack')).toBeTruthy();
    expect(getByText('Sign in to continue')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows validation error for empty email', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Email is invalid')).toBeTruthy();
    });
  });

  it('shows validation error for empty password', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for short password', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('calls login function with valid credentials', async () => {
    mockLogin.mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows error alert on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Failed', errorMessage);
    });
  });

  it('shows loading indicator during login', async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { getByText, getByPlaceholderText, UNSAFE_getByType } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
    });
  });
});

