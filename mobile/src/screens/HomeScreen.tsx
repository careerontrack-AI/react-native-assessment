import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import { goalService } from '../services/api';
import { CardBase, PressableCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import TopBar from '../components/TopBar';

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
  const theme = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  // Reload goals when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadGoals();
    }, [])
  );

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

  const getBadgeVariant = (status: string): 'owned' | 'notOwned' | 'outline' => {
    if (status === 'completed') return 'owned';
    if (status === 'in_progress') return 'notOwned';
    return 'outline';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.xl,
    },
    welcome: {
      fontSize: theme.typography.size.xxl,
      fontWeight: theme.typography.weight.bold,
      fontFamily: theme.typography.font.bold,
      marginBottom: theme.spacing.sm,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xxl,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    statCardBase: {
      padding: theme.spacing.lg,
    },
    statIcon: {
      marginBottom: theme.spacing.sm,
    },
    statValue: {
      fontSize: theme.typography.size.xxl,
      fontWeight: theme.typography.weight.bold,
      fontFamily: theme.typography.font.bold,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: theme.typography.size.xs,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
    },
    progressTitle: {
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
      marginBottom: theme.spacing.md,
      color: theme.colors.textPrimary,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.colors.divider,
      borderRadius: theme.radius.sm,
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    goalCardRow1: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    goalIcon: {
      marginRight: theme.spacing.sm,
    },
    goalTitle: {
      fontSize: theme.typography.size.md,
      fontWeight: theme.typography.weight.bold,
      fontFamily: theme.typography.font.bold,
      color: theme.colors.textPrimary,
      flex: 1,
    },
    goalCardRow2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    goalBadge: {
      marginRight: 0,
    },
    progressText: {
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
      color: theme.colors.primary,
    },
    recentSection: {
      marginTop: theme.spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.size.lg,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
      color: theme.colors.textPrimary,
    },
    viewAllText: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxxl,
    },
    emptyText: {
      fontSize: theme.typography.size.xl,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
      fontSize: theme.typography.size.sm,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textTertiary,
    },
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Home" />
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome back, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Your career goals overview</Text>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <CardBase style={[styles.statCardBase, { flex: 1, marginHorizontal: theme.spacing.xs, alignItems: 'center' }]}>
            <Ionicons name="flag" size={28} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>{totalGoals}</Text>
            <Text style={styles.statLabel}>Total Goals</Text>
          </CardBase>
          <CardBase style={[styles.statCardBase, { flex: 1, marginHorizontal: theme.spacing.xs, alignItems: 'center', backgroundColor: theme.colors.surfacePrimary }]}>
            <Ionicons name="hourglass" size={28} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>{inProgressGoals}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </CardBase>
          <CardBase style={[styles.statCardBase, { flex: 1, marginHorizontal: theme.spacing.xs, alignItems: 'center', backgroundColor: theme.colors.successLight }]}>
            <Ionicons name="checkmark-circle" size={28} color={theme.colors.success} style={styles.statIcon} />
            <Text style={styles.statValue}>{completedGoals}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </CardBase>
        </View>

        {/* Average Progress Card */}
        <CardBase style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.xxl }}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${averageProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{averageProgress}%</Text>
        </CardBase>

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
                iconName = 'checkmark-circle';
                iconColor = theme.colors.success;
              } else if (goal.progress > 0 && goal.progress < 100) {
                displayStatus = 'in_progress';
                iconName = 'refresh';
                iconColor = theme.colors.warning;
              } else {
                displayStatus = 'not_started';
                iconName = 'flag';
                iconColor = theme.colors.textTertiary;
              }

              return (
                <PressableCard
                  key={goal.id}
                  onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })}
                  style={{ marginBottom: theme.spacing.md }}
                >
                  {/* Row 1: Icon and Title */}
                  <View style={styles.goalCardRow1}>
                    <Ionicons 
                      name={iconName} 
                      size={24} 
                      color={iconColor} 
                      style={styles.goalIcon}
                    />
                    <Text style={styles.goalTitle} numberOfLines={1}>
                      {goal.title}
                    </Text>
                  </View>

                  {/* Row 2: Status and Progress */}
                  <View style={styles.goalCardRow2}>
                    <Badge 
                      label={displayStatus.replace('_', ' ')} 
                      variant={getBadgeVariant(displayStatus)}
                      style={styles.goalBadge}
                    />
                    <Text style={styles.progressText}>{goal.progress}%</Text>
                  </View>
                </PressableCard>
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
    </View>
  );
}

