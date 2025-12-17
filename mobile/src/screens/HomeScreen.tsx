import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { goalService } from '../services/api';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await goalService.getGoals();
      setGoals(response.goals || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics based on progress
  const totalGoals = goals.length;
  const inProgressGoals = goals.filter(g => g.progress > 0 && g.progress < 100).length;
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const notStartedGoals = goals.filter(g => g.progress === 0).length;
  const averageProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;
  const recentGoals = [...goals].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome back, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Your career goals overview</Text>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flag" size={28} color="#007AFF" style={styles.statIcon} />
            <Text style={styles.statValue}>{totalGoals}</Text>
            <Text style={styles.statLabel}>Total Goals</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Ionicons name="hourglass" size={28} color="#2196F3" style={styles.statIcon} />
            <Text style={styles.statValue}>{inProgressGoals}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSuccess]}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" style={styles.statIcon} />
            <Text style={styles.statValue}>{completedGoals}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Average Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${averageProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{averageProgress}%</Text>
        </View>

        {/* Recent Goals */}
        {recentGoals.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Goals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentGoals.map((goal) => {
              // Determine status and icon based on progress
              let displayStatus: string;
              let iconName: keyof typeof Ionicons.glyphMap;
              let iconColor: string;

              if (goal.progress === 100) {
                displayStatus = 'completed';
                iconName = 'checkmark-circle-outline';
                iconColor = '#4CAF50';
              } else if (goal.progress > 0 && goal.progress < 100) {
                displayStatus = 'in_progress';
                iconName = 'refresh-outline';
                iconColor = '#FF9800';
              } else {
                displayStatus = 'not_started';
                iconName = 'flag-outline';
                iconColor = '#9E9E9E';
              }

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
                >
                  <View style={styles.goalHeader}>
                    <Ionicons name={iconName} size={20} color={iconColor} style={styles.goalIcon} />
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                  </View>
                  <View style={styles.goalFooter}>
                    <Text style={[styles.statusBadge, styles[`status${displayStatus}`]]}>
                      {displayStatus.replace('_', ' ')}
                    </Text>
                    <Text style={styles.progressText}>{goal.progress}%</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {goals.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No goals yet</Text>
            <Text style={styles.emptySubtext}>Start by creating your first career goal!</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  },
  content: {
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statCardPrimary: {
    backgroundColor: '#E3F2FD',
  },
  statCardSuccess: {
    backgroundColor: '#E8F5E9',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  recentSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
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
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalIcon: {
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    color: '#1a1a1a',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusin_progress: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  statuscompleted: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  statusnot_started: {
    backgroundColor: '#E0E0E0',
    color: '#424242',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
});

