import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { GoalHierarchyCard } from '../components/GoalHierarchyCard';
import { CreateGoalModal } from '../components/CreateGoalModal';
import { goalsApi } from '../services/goalsApi';

// CONTEXT: Type definitions that mirror the backend Goal entity
export interface Goal {
  id: string;
  userId: string;
  type: 'KEYSTONE' | 'ANNUAL' | 'QUARTERLY' | 'WEEKLY' | 'DAILY_ATOMIC';
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE' | 'LEARNING_IN_PROGRESS';
  parentId?: string;
  parent?: Goal;
  children: Goal[];
  weekId?: number;
  specificMeasure?: string;
  targetDate?: string;
  isHypothesis: boolean;
  hypothesisTest?: string;
  hypothesisMetric?: string;
  learnings?: string;
  createdAt: string;
  updatedAt: string;
}

interface GoalStackScreenProps {
  userId: string; // In a real app, this would come from authentication context
}

export const GoalStackScreen: React.FC<GoalStackScreenProps> = ({ userId }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Goal | null>(null);

  // CONTEXT: Loads the hierarchical goal structure for strategic overview
  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      const hierarchyData = await goalsApi.getHierarchy(userId);
      setGoals(hierarchyData);
    } catch (error) {
      Alert.alert(
        'Loading Error',
        'Unable to load your Goal Stack. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // CONTEXT: Handles refresh gesture with optimistic loading
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  }, [loadGoals]);

  // CONTEXT: Opens create modal with optional parent context for hierarchy enforcement
  const handleCreateGoal = (parent?: Goal) => {
    setSelectedParent(parent || null);
    setShowCreateModal(true);
  };

  // CONTEXT: Updates goal status with "Language of Growth" validation
  const handleStatusUpdate = async (goalId: string, status: Goal['status'], learnings?: string) => {
    try {
      if (status === 'LEARNING_IN_PROGRESS' && !learnings) {
        Alert.alert(
          'Learning Opportunity',
          'What did you learn from this experience? Capturing insights transforms setbacks into wisdom.',
          [
            {
              text: 'Skip for Now',
              style: 'cancel',
              onPress: () => updateGoalStatus(goalId, status),
            },
            {
              text: 'Add Learning',
              onPress: () => promptForLearnings(goalId),
            },
          ]
        );
        return;
      }

      await updateGoalStatus(goalId, status, learnings);
    } catch (error) {
      Alert.alert('Update Error', 'Unable to update goal status. Please try again.');
      console.error('Error updating goal:', error);
    }
  };

  const updateGoalStatus = async (goalId: string, status: Goal['status'], learnings?: string) => {
    await goalsApi.updateGoal(goalId, userId, { status, learnings });
    await loadGoals(); // Refresh to show updated state
  };

  // CONTEXT: Prompts user to capture learnings when goals transition to learning mode
  const promptForLearnings = (goalId: string) => {
    Alert.prompt(
      'Capture Your Learning',
      'What specific insight did you gain from this experience? This wisdom will serve you in future endeavors.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save Learning',
          onPress: (learnings) => {
            if (learnings && learnings.trim()) {
              updateGoalStatus(goalId, 'LEARNING_IN_PROGRESS', learnings.trim());
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  // CONTEXT: Renders the complete Goal Stack with philosophical context
  const renderGoalStack = () => {
    if (goals.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Your Goal Stack Awaits</Text>
          <Text style={styles.emptyStateDescription}>
            Create your first Keystone goal to anchor your 10-year vision. Every extraordinary
            journey begins with a clear destination.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleCreateGoal()}
          >
            <Text style={styles.primaryButtonText}>Create First Keystone</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {goals.map((keystoneGoal) => (
          <GoalHierarchyCard
            key={keystoneGoal.id}
            goal={keystoneGoal}
            onStatusUpdate={handleStatusUpdate}
            onCreateChild={handleCreateGoal}
            level={0}
          />
        ))}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text style={styles.loadingText}>Loading your Goal Stack...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goal Stack</Text>
        <Text style={styles.subtitle}>Vision → Action Funnel</Text>
        <Text style={styles.philosophyText}>
          "The focusing question: What's the ONE thing I can do such that by doing it,
          everything else will be easier or unnecessary?"
        </Text>
      </View>

      {renderGoalStack()}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => handleCreateGoal()}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateGoalModal
          userId={userId}
          parentGoal={selectedParent}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedParent(null);
          }}
          onGoalCreated={() => {
            setShowCreateModal(false);
            setSelectedParent(null);
            loadGoals();
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
  },
  philosophyText: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0d6efd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
}); 