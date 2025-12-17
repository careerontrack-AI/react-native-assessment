import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { goalService } from '../services/api';
import Button from '../components/ui/Button';
import Label from '../components/ui/Label';
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

// TODO: Task 4 - Complete Goal Detail Screen
// Requirements:
// 1. Fetch goal details from goalService.getGoal(id)
// 2. Display all goal information
// 3. Add ability to update goal status
// 4. Show creation and update dates
// 5. Add delete goal functionality with confirmation
// 6. Navigate back after delete
// 7. Handle loading and error states

export default function GoalDetailScreen({ route, navigation }: any) {
  const theme = useTheme();
  const { goalId } = route.params;
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
  }, [goalId]);

  const loadGoal = async () => {
    try {
      setLoading(true);
      const data = await goalService.getGoal(goalId);
      setGoal(data);
    } catch (error) {
      console.error('Error loading goal:', error);
      Alert.alert('Error', 'Failed to load goal details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!goal) return;

    try {
      const updated = await goalService.updateGoal(goal.id, { status: newStatus });
      setGoal(updated);
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal status');
    }
  };

  const handleDelete = () => {
    if (!goal) return;

    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await goalService.deleteGoal(goal.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    content: {
      padding: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.size.xl,
      fontWeight: theme.typography.weight.bold,
      fontFamily: theme.typography.font.bold,
      marginBottom: theme.spacing.md,
      color: theme.colors.textPrimary,
    },
    description: {
      fontSize: theme.typography.size.md,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xxl,
      lineHeight: theme.typography.lineHeight.lg,
    },
    section: {
      marginBottom: theme.spacing.xxl,
    },
    statusContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    statusButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceAlt,
    },
    statusButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    statusButtonText: {
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
      textTransform: 'capitalize',
      color: theme.colors.textSecondary,
    },
    statusButtonTextActive: {
      color: theme.colors.white,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.divider,
      borderRadius: theme.radius.sm,
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    progressText: {
      fontSize: theme.typography.size.sm,
      fontWeight: theme.typography.weight.semiBold,
      fontFamily: theme.typography.font.semiBold,
      color: theme.colors.primary,
    },
    meta: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    metaText: {
      fontSize: theme.typography.size.xs,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.xs,
    },
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.font.regular }}>Goal not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={goal.title} onBack={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.content}>
        
        {goal.description && (
          <Text style={styles.description}>{goal.description}</Text>
        )}

        <View style={styles.section}>
          <Label>Status</Label>
          <View style={styles.statusContainer}>
            {['not_started', 'in_progress', 'completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  goal.status === status && styles.statusButtonActive,
                ]}
                onPress={() => handleUpdateStatus(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    goal.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Label>Progress</Label>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${goal.progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Created: {new Date(goal.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.metaText}>
            Updated: {new Date(goal.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <Button
          title="Delete Goal"
          onPress={handleDelete}
          variant="destructive"
          size="lg"
          style={{ marginTop: theme.spacing.xxl }}
        />
      </View>
    </ScrollView>
    </View>
  );
}

