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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { goalService } from '../services/api';
import CreateGoalModal from '../modals/CreateGoal';

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
  const [loading, setLoading] = useState(false); // By default, loading will be false, until the goals will actually start fetching.
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // update the goals list
      loadGoals();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.headerButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadGoals = async () => {
    // TODO: Implement goal fetching
    // 1. Set loading to true
    // 2. Call goalService.getGoals()
    // 3. Update goals state with response.goals
    // 4. Show error with Alert.alert if it fails
    // 5. Set loading to false when done

    try {
      // Set loading to true
      setLoading(true);
      // Call goalService.getGoals()
      const response = await goalService.getGoals();
      // Update goals state with response.goals sorted by createdAt (newest first)
      const fetchedGoals: Goal[] = response.goals || [];
      fetchedGoals.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setGoals(fetchedGoals);
    } catch (error) {
      // Show error with Alert.alert if it fails
      Alert.alert('Error', 'Failed to load goals');
    } finally {
      // Set loading to false when done
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals((prev) =>
      [newGoal, ...prev].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (goals.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No goals yet</Text>
        <Text style={styles.emptySubtext}>Create your first career goal!</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.primaryButtonText}>Create Goal</Text>
        </TouchableOpacity>

        <CreateGoalModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onCreated={handleGoalCreated}
        />
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

      <CreateGoalModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreated={handleGoalCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusnot_started: {
    backgroundColor: '#e0e0e0',
  },
  statusin_progress: {
    backgroundColor: '#fff3cd',
  },
  statuscompleted: {
    backgroundColor: '#d4edda',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  headerButton: {
    marginRight: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    height: 16,
  },
  primaryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

