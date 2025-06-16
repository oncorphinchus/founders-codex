import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { habitService } from '../services/habitService';
import { HabitCard } from '../components/HabitCard';
import { CreateHabitModal } from '../components/CreateHabitModal';

// CONTEXT: Main interface for "The 1% Better System" - displaying atomic habits
// Implements "Celebrating Process" through visual feedback and progress tracking
export const HabitsScreen: React.FC = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const celebrationOpacity = new Animated.Value(0);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const habitsData = await habitService.getHabits();
      setHabits(habitsData);
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Error', 'Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  // CONTEXT: Implements "Make it satisfying" principle with celebratory animation
  // Provides immediate positive feedback for habit completion
  const handleHabitComplete = async (habitId: string) => {
    try {
      await habitService.completeHabit(habitId);
      
      // CONTEXT: Visual celebration reinforces positive behavior
      // Creates dopamine hit that strengthens habit loop
      triggerCelebration();
      
      // Refresh habits to show updated streaks and completion status
      await loadHabits();
    } catch (error: any) {
      console.error('Error completing habit:', error);
      
      // CONTEXT: Handle duplicate completion gracefully with positive language
      if (error.message?.includes('already completed')) {
        Alert.alert(
          'Already Done! 🎉',
          'You\'ve already completed this habit today. Great consistency!'
        );
      } else {
        Alert.alert('Error', 'Failed to mark habit as complete. Please try again.');
      }
    }
  };

  // CONTEXT: "Celebrating Process" - visual reward for completing any habit
  // Reinforces the value of small, consistent actions over outcomes
  const triggerCelebration = () => {
    celebrationOpacity.setValue(1);
    Animated.sequence([
      Animated.timing(celebrationOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCreateHabit = async (habitData: any) => {
    try {
      await habitService.createHabit(habitData);
      setIsCreateModalVisible(false);
      await loadHabits();
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    }
  };

  // CONTEXT: Calculates total active streak for motivational summary
  const getTotalActiveStreaks = () => {
    return habits.reduce((total, habit) => total + (habit.currentStreak || 0), 0);
  };

  const getCompletedTodayCount = () => {
    return habits.filter(habit => habit.isCompletedToday).length;
  };

  if (loading && habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* CONTEXT: Celebration overlay for habit completion feedback */}
      <Animated.View 
        style={[
          styles.celebrationOverlay,
          { opacity: celebrationOpacity }
        ]}
        pointerEvents="none"
      >
        <Text style={styles.celebrationText}>🎉 Progress Made! 🎉</Text>
        <Text style={styles.celebrationSubtext}>Building better, 1% at a time</Text>
      </Animated.View>

      <View style={styles.header}>
        <Text style={styles.title}>The 1% Better System</Text>
        <Text style={styles.subtitle}>Small habits. Remarkable results.</Text>
        
        {/* CONTEXT: Summary stats to motivate continued engagement */}
        {habits.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{getCompletedTodayCount()}/{habits.length}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{getTotalActiveStreaks()}</Text>
              <Text style={styles.statLabel}>Total Streaks</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Start Your Journey</Text>
            <Text style={styles.emptySubtitle}>
              Create your first atomic habit and begin building the compound power of small improvements.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Text style={styles.emptyActionText}>Create Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={() => handleHabitComplete(habit.id)}
                onEdit={() => {/* TODO: Implement edit */}}
                onDelete={() => {/* TODO: Implement delete */}}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* CONTEXT: Floating action button for easy habit creation */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <CreateHabitModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateHabit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
  },
  celebrationSubtext: {
    fontSize: 16,
    color: '#27ae60',
    textAlign: 'center',
    marginTop: 4,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  scrollView: {
    flex: 1,
  },
  habitsList: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyActionButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    backgroundColor: '#3498db',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 