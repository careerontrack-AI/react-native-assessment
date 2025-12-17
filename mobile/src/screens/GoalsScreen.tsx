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
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { goalService } from '../services/api';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { PressableCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
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

export default function GoalsScreen({ navigation }: any) {
  const theme = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getGoals();
      setGoals(response.goals || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    try {
      setAddingGoal(true);
      await goalService.createGoal({
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim() || undefined,
        status: 'not_started',
      });
      
      // Reset form
      setNewGoalTitle('');
      setNewGoalDescription('');
      setModalVisible(false);
      
      // Reload goals
      await loadGoals();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create goal');
    } finally {
      setAddingGoal(false);
    }
  };

  const handleCloseModal = () => {
    setNewGoalTitle('');
    setNewGoalDescription('');
    setModalVisible(false);
  };

  const getBadgeVariant = (status: string): 'owned' | 'notOwned' | 'outline' => {
    if (status === 'completed') return 'owned';
    if (status === 'in_progress') return 'notOwned';
    return 'outline';
  };

  const getGoalIcon = (progress: number): { name: keyof typeof Ionicons.glyphMap; color: string } => {
    if (progress === 100) {
      return { name: 'checkmark-circle', color: theme.colors.success };
    } else if (progress > 0 && progress < 100) {
      return { name: 'refresh', color: theme.colors.warning };
    } else {
      return { name: 'flag', color: theme.colors.textTertiary };
    }
  };

  const getGoalStatus = (progress: number): string => {
    if (progress === 100) return 'completed';
    if (progress > 0 && progress < 100) return 'in_progress';
    return 'not_started';
  };

  const renderGoal = ({ item }: { item: Goal }) => {
    const displayStatus = getGoalStatus(item.progress);
    const icon = getGoalIcon(item.progress);

    return (
      <PressableCard
        onPress={() => navigation.navigate('GoalDetail', { goalId: item.id })}
        style={{ marginBottom: theme.spacing.md }}
      >
        {/* Row 1: Icon and Title */}
        <View style={styles.goalCardRow1}>
          <Ionicons 
            name={icon.name} 
            size={24} 
            color={icon.color} 
            style={styles.goalIcon}
          />
          <Text style={styles.goalTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {/* Row 2: Status and Progress */}
        <View style={styles.goalCardRow2}>
          <Badge 
            label={displayStatus.replace('_', ' ')} 
            variant={getBadgeVariant(displayStatus)}
            style={styles.goalBadge}
          />
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </PressableCard>
    );
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
      padding: theme.spacing.xl,
    },
    list: {
      padding: theme.spacing.lg,
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
      color: theme.colors.primary,
    },
    emptyText: {
      fontSize: theme.typography.size.xl,
      fontFamily: theme.typography.font.semiBold,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
      fontSize: theme.typography.size.sm,
      fontFamily: theme.typography.font.regular,
      color: theme.colors.textTertiary,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.xl,
      bottom: theme.spacing.xl,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.floating,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentContainer: {
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: '80%',
      paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.xl,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: theme.typography.size.xl,
      fontFamily: theme.typography.font.bold,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    modalBody: {
      padding: theme.spacing.xl,
    },
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.md,
    },
  });

  if (loading && goals.length === 0) {
    return (
      <View style={styles.container}>
        <TopBar title="Goals" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (goals.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <TopBar title="Goals" />
      <View style={{ flex: 1 }}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No goals yet</Text>
          <Text style={styles.emptySubtext}>Create your first career goal!</Text>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={28} color={theme.colors.white} />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={handleCloseModal}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContentContainer}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Goal</Text>
                  <TouchableOpacity onPress={handleCloseModal}>
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.inputContainer}>
                    <Label>Title *</Label>
                    <Input
                      placeholder="Enter goal title"
                      value={newGoalTitle}
                      onChangeText={setNewGoalTitle}
                      autoFocus
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Label>Description</Label>
                    <Input
                      style={{ height: 100, paddingTop: theme.spacing.md, textAlignVertical: 'top' }}
                      placeholder="Enter goal description (optional)"
                      value={newGoalDescription}
                      onChangeText={setNewGoalDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Button
                    title="Cancel"
                    onPress={handleCloseModal}
                    disabled={addingGoal}
                    variant="outline"
                    size="lg"
                    style={{ flex: 1 }}
                    textStyle={{ color: theme.colors.textSecondary }}
                  />
                  <Button
                    title="Add Goal"
                    onPress={handleAddGoal}
                    disabled={addingGoal}
                    loading={addingGoal}
                    variant="default"
                    size="lg"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </View>
  );
}

  return (
    <View style={styles.container}>
      <TopBar title="Goals" />
    <View style={{ flex: 1 }}>
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        
        {/* FAB Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={28} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Bottom Sheet Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={handleCloseModal}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContentContainer}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Goal</Text>
                  <TouchableOpacity onPress={handleCloseModal}>
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.inputContainer}>
                    <Label>Title *</Label>
                    <Input
                      placeholder="Enter goal title"
                      value={newGoalTitle}
                      onChangeText={setNewGoalTitle}
                      autoFocus
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Label>Description</Label>
                    <Input
                      style={{ height: 100, paddingTop: theme.spacing.md, textAlignVertical: 'top' }}
                      placeholder="Enter goal description (optional)"
                      value={newGoalDescription}
                      onChangeText={setNewGoalDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Button
                    title="Cancel"
                    onPress={handleCloseModal}
                    disabled={addingGoal}
                    variant="outline"
                    size="lg"
                    style={{ flex: 1 }}
                    textStyle={{ color: theme.colors.textSecondary }}
                  />
                  <Button
                    title="Add Goal"
                    onPress={handleAddGoal}
                    disabled={addingGoal}
                    loading={addingGoal}
                    variant="default"
                    size="lg"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
        </View>
      </Modal>
      </View>
    </View>
  );
}

