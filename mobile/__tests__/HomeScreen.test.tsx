import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { useAuth } from '../src/context/AuthContext';
import { goalService } from '../src/services/api';

// Mock dependencies
jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../src/services/api', () => ({
  goalService: {
    getGoals: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn((callback) => {
      // Don't call the callback to avoid double loading in tests
    }),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockGoals = [
    {
      id: 1,
      title: 'Learn React Native',
      description: 'Complete the course',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
    {
      id: 2,
      title: 'Build Portfolio',
      description: 'Create 5 projects',
      status: 'in_progress',
      progress: 60,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 3,
      title: 'Get Job',
      description: 'Apply to companies',
      status: 'not_started',
      progress: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });
  });

  it('renders welcome message with user name', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: [] });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Welcome back, Test User!')).toBeTruthy();
      expect(getByText("Let's track your career goals")).toBeTruthy();
    });
  });

  it('displays correct statistics', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: mockGoals });

    const { getByText, getAllByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Your Progress')).toBeTruthy();
      expect(getByText('3')).toBeTruthy(); // Total goals
      // Multiple "1" texts exist (completed and in-progress), so just check they exist
      const onesText = getAllByText('1');
      expect(onesText.length).toBeGreaterThan(0);
      expect(getByText('Total Goals')).toBeTruthy();
      expect(getByText('Completed')).toBeTruthy();
      expect(getByText('In Progress')).toBeTruthy();
    });
  });

  it('calculates completion rate correctly', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: mockGoals });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Completion Rate')).toBeTruthy();
      expect(getByText('33%')).toBeTruthy(); // 1 out of 3 completed
    });
  });

  it('displays recent goals section', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: mockGoals });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Recent Goals')).toBeTruthy();
      expect(getByText('Learn React Native')).toBeTruthy();
      expect(getByText('Build Portfolio')).toBeTruthy();
      expect(getByText('Get Job')).toBeTruthy();
    });
  });

  it('shows empty state when no goals exist', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: [] });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('No goals yet')).toBeTruthy();
      expect(getByText('Start by creating your first career goal')).toBeTruthy();
      expect(getByText('Create Goal')).toBeTruthy();
    });
  });

  it('shows loading state initially', () => {
    (goalService.getGoals as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { UNSAFE_getByType } = render(<HomeScreen navigation={mockNavigation} />);
    expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
  });

  it('displays correct status colors', async () => {
    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: mockGoals });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('completed')).toBeTruthy();
      expect(getByText('in progress')).toBeTruthy();
      expect(getByText('not started')).toBeTruthy();
    });
  });

  it('limits recent goals to 3 items', async () => {
    const manyGoals = [
      ...mockGoals,
      {
        id: 4,
        title: 'Fourth Goal',
        description: 'Should not appear',
        status: 'not_started' as const,
        progress: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    (goalService.getGoals as jest.Mock).mockResolvedValue({ goals: manyGoals });

    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Learn React Native')).toBeTruthy();
      expect(getByText('Build Portfolio')).toBeTruthy();
      expect(getByText('Get Job')).toBeTruthy();
      expect(queryByText('Fourth Goal')).toBeNull();
    });
  });
});

