import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { goalService } from "../services/api";

interface Goal {
  id: number;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
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
      console.error("Error loading goal:", error);
      Alert.alert("Error", "Failed to load goal details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!goal) return;

    try {
      const updated = await goalService.updateGoal(goal.id, {
        status: newStatus,
      });
      setGoal(updated);
    } catch (error) {
      Alert.alert("Error", "Failed to update goal status");
    }
  };

  const handleDelete = () => {
    if (!goal) return;

    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await goalService.deleteGoal(goal.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", "Failed to delete goal");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={styles.centerContainer}>
        <Text>Goal not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{goal.title}</Text>

          {goal.description && (
            <Text style={styles.description}>{goal.description}</Text>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusContainer}>
              {["not_started", "in_progress", "completed"].map((status) => (
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
                    {status.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
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

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Goal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  statusButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#666",
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  meta: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  metaText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  deleteButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ff4444",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
