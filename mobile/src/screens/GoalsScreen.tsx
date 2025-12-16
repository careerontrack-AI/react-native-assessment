import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { goalService } from '../services/api';
import { colors } from '../theme/colors';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// TODO: Task 2 - Display Goals List
// The UI is already set up! You just need to:
// 1. Fetch goals when screen loads (use useEffect)
// 2. Call goalService.getGoals() to get the data
// 3. Update the goals state with the response
// 4. Show loading indicator while fetching
// 5. Show error message if API call fails
//
// Hint: The list rendering is already done, just implement loadGoals()!

export default function GoalsScreen({ navigation }: any) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    // TODO: Implement goal fetching
    // 1. Set loading to true
    // 2. Call goalService.getGoals()
    // 3. Update goals state with response.goals
    // 4. Show error with Alert.alert if it fails
    // 5. Set loading to false when done

    // Your code here:
    try {
      setLoading(true);
      const response = await goalService.getGoals();
      setGoals(response.goals || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Unable to load goals. Please check your internet connection.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <TouchableOpacity
      style={styles.goalCard}
      onPress={() => navigation.navigate('GoalDetail', { goalId: item.id })}
    >
      <Text style={styles.goalTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.goalDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.goalFooter}>
        <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && goals.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (goals.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No goals yet</Text>
        <Text style={styles.emptySubtext}>Create your first career goal!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05, // 5% of screen width
  },
  list: {
    paddingHorizontal: 16, // 16px from left and right
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: width * 0.04, // 4% of screen width
    marginBottom: height * 0.015, // 1.5% of screen height
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalTitle: {
    fontSize: Math.min(width * 0.045, 18), // Responsive font size
    fontWeight: '600',
    marginBottom: 8,
    color: colors.primary,
  },
  goalDescription: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: Math.min(width * 0.05, 20), // Responsive line height
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: width * 0.03, // 3% of screen width
    paddingVertical: height * 0.005, // 0.5% of screen height
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusnot_started: {
    backgroundColor: colors.notStarted,
    borderColor: colors.secondary,
  },
  statusin_progress: {
    backgroundColor: colors.inProgress,
    borderColor: colors.primary,
  },
  statuscompleted: {
    backgroundColor: colors.completed,
    borderColor: colors.primary,
  },
  statusText: {
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    fontWeight: '600',
    textTransform: 'capitalize',
    color: colors.text,
  },
  progressText: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    fontWeight: '600',
    color: colors.accent,
  },
  emptyText: {
    fontSize: Math.min(width * 0.05, 20), // Responsive font size
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

