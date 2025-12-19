import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
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

export default function GoalsScreen({ navigation }: any) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getGoals();
      setGoals(response.goals || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load goals");
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
      onPress={() => navigation.navigate("GoalDetail", { goalId: item.id })}
    >
      <Text style={styles.goalTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.goalDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.goalFooter}>
        <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
          <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  list: {
    padding: 16,
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  goalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusnot_started: {
    backgroundColor: "#e0e0e0",
  },
  statusin_progress: {
    backgroundColor: "#fff3cd",
  },
  statuscompleted: {
    backgroundColor: "#d4edda",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});
