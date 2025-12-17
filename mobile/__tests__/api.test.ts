// Mock AsyncStorage first
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock axios with inline instance definition
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  })),
}));

// Import after mocking
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { authService, userService, goalService } from '../src/services/api';

// Get the mock instance that was created
const mockAxiosInstance = (axios.create as jest.Mock).mock.results[0].value;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authService', () => {
    it('login calls correct endpoint with credentials', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('register calls correct endpoint with user data', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authService.register(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('userService', () => {
    it('getProfile calls correct endpoint', async () => {
      const mockResponse = {
        data: { id: 1, email: 'test@example.com', name: 'Test User' },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userService.getProfile();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile');
      expect(result).toEqual(mockResponse.data);
    });

    it('updateProfile calls correct endpoint with data', async () => {
      const mockResponse = {
        data: { id: 1, email: 'test@example.com', name: 'Updated Name' },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await userService.updateProfile({ name: 'Updated Name' });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/profile', {
        name: 'Updated Name',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('goalService', () => {
    it('getGoals calls correct endpoint', async () => {
      const mockResponse = {
        data: {
          goals: [
            { id: 1, title: 'Goal 1', status: 'in_progress' },
            { id: 2, title: 'Goal 2', status: 'completed' },
          ],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await goalService.getGoals();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/goals');
      expect(result).toEqual(mockResponse.data);
    });

    it('getGoal calls correct endpoint with id', async () => {
      const mockResponse = {
        data: { id: 1, title: 'Goal 1', status: 'in_progress' },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await goalService.getGoal(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/goals/1');
      expect(result).toEqual(mockResponse.data);
    });

    it('createGoal calls correct endpoint with data', async () => {
      const mockGoalData = {
        title: 'New Goal',
        description: 'Description',
        status: 'not_started',
      };

      const mockResponse = {
        data: { id: 3, ...mockGoalData },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await goalService.createGoal(mockGoalData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/goals', mockGoalData);
      expect(result).toEqual(mockResponse.data);
    });

    it('updateGoal calls correct endpoint with id and data', async () => {
      const mockUpdateData = { status: 'completed', progress: 100 };
      const mockResponse = {
        data: { id: 1, title: 'Goal 1', ...mockUpdateData },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await goalService.updateGoal(1, mockUpdateData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/goals/1', mockUpdateData);
      expect(result).toEqual(mockResponse.data);
    });

    it('deleteGoal calls correct endpoint with id', async () => {
      const mockResponse = {
        data: { message: 'Goal deleted successfully' },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await goalService.deleteGoal(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/goals/1');
      expect(result).toEqual(mockResponse.data);
    });
  });
});

