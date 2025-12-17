import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import GoalsScreen from '../src/screens/GoalsScreen';
import { goalService } from '../src/services/api';

// Mock Modal to render children when visible
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Modal = ({ children, visible }: any) => (visible ? children : null);
  return RN;
});

// Mock dependencies
jest.mock('../src/services/api', () => ({
  goalService: {
    getGoals: jest.fn(),
    createGoal: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn((callback) => {
      // Don't call the callback to avoid double loading in tests
      // The useEffect will handle the initial load
    }),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.spyOn(Alert, 'alert');

const mockNavigation = {
  navigate: jest.fn(),
};

describe('GoalsScreen', () => {
  const mockGoals = [
    {
      id: 1,
      title: 'Learn React Native',
      description: 'Complete the course',
      status: 'in_progress',
      progress: 50,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
    {
      id: 2,
      title: 'Build Portfolio',
      description: 'Create 5 projects',
      status: 'not_started',
      progress: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (goalService.getGoals as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { UNSAFE_getByType } = render(<GoalsScreen navigation={mockNavigation} />);
    expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
  });

  it('renders goals list after loading', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: mockGoals });

    const { getByText } = render(<GoalsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Learn React Native')).toBeTruthy();
      expect(getByText('Build Portfolio')).toBeTruthy();
    });
  });

  it('shows empty state when no goals exist', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: [] });

    const { getByText } = render(<GoalsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('No goals yet')).toBeTruthy();
      expect(getByText('Create your first career goal!')).toBeTruthy();
    });
  });

  it('navigates to goal detail when goal is pressed', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: mockGoals });

    const { getByText } = render(<GoalsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Learn React Native')).toBeTruthy();
    });

    fireEvent.press(getByText('Learn React Native'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('GoalDetail', { goalId: 1 });
  });

  it('handles error when loading goals fails', async () => {
    (goalService.getGoals as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { UNSAFE_queryByType } = render(<GoalsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to load goals');
    }, { timeout: 3000 });
  });
});

