import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../src/services/api';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../src/services/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('provides initial auth state', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loads stored auth data on mount', async () => {
    const mockToken = 'test-token';
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'auth_token') return Promise.resolve(mockToken);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles login successfully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const mockToken = 'new-token';
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    const mockResponse = { token: mockToken, user: mockUser };

    (authService.login as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles logout successfully', async () => {
    const mockToken = 'test-token';
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'auth_token') return Promise.resolve(mockToken);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('updates user data', async () => {
    const mockToken = 'test-token';
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'auth_token') return Promise.resolve(mockToken);
      if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    const updatedData = { name: 'Updated Name' };

    await act(async () => {
      await result.current.updateUser(updatedData);
    });

    expect(result.current.user?.name).toBe('Updated Name');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ ...mockUser, ...updatedData })
    );
  });
});

