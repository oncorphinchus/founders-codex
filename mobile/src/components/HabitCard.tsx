import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Habit } from '../services/habitService';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// CONTEXT: Individual habit display implementing "Visual Habit Chains"
// Creates satisfying feedback loops and "not breaking the chain" psychology
export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onEdit,
  onDelete,
}) => {
  // CONTEXT: Generate visual chain representation for the last 30 days
  // Creates immediate visual feedback for consistency
  const generateHabitChain = () => {
    const days = [];
    const today = new Date();
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // For demo purposes, we'll create a simple visual representation
      // In a real implementation, this would use actual completion data
      const isCompleted = Math.random() > 0.3; // Mock data
      const isToday = i === 0;
      
      days.push(
        <View
          key={i}
          style={[
            styles.chainDot,
            isCompleted && styles.chainDotCompleted,
            isToday && styles.chainDotToday,
            habit.isCompletedToday && isToday && styles.chainDotCompletedToday,
          ]}
        />
      );
    }
    
    return days;
  };

  // CONTEXT: Color coding for different streak levels to motivate progress
  const getStreakColor = (streak: number) => {
    if (streak === 0) return '#95a5a6';
    if (streak < 7) return '#f39c12';
    if (streak < 30) return '#e67e22';
    if (streak < 100) return '#27ae60';
    return '#8e44ad'; // Epic streak!
  };

  // CONTEXT: Motivational messages based on streak length
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Ready to start';
    if (streak === 1) return 'Great start!';
    if (streak < 7) return 'Building momentum';
    if (streak < 30) return 'Strong habit forming';
    if (streak < 100) return 'Incredible consistency!';
    return 'Legendary dedication!';
  };

  return (
    <View style={styles.container}>
      {/* Header with title and cue */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{habit.title}</Text>
          {habit.cue && (
            <Text style={styles.cue}>📍 {habit.cue}</Text>
          )}
        </View>
        
        {/* CONTEXT: Completion button with visual state management */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            habit.isCompletedToday && styles.completeButtonDone,
          ]}
          onPress={onComplete}
          disabled={habit.isCompletedToday}
        >
          <Ionicons
            name={habit.isCompletedToday ? "checkmark-circle" : "radio-button-off"}
            size={32}
            color={habit.isCompletedToday ? "#27ae60" : "#bdc3c7"}
          />
        </TouchableOpacity>
      </View>

      {/* CONTEXT: Visual habit chain - core "not breaking the chain" feature */}
      <View style={styles.chainContainer}>
        <Text style={styles.chainLabel}>Last 30 days</Text>
        <View style={styles.chain}>
          {generateHabitChain()}
        </View>
      </View>

      {/* CONTEXT: Streak and stats display for motivation */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: getStreakColor(habit.currentStreak || 0) }]}>
            {habit.currentStreak || 0}
          </Text>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statMessage}>{getStreakMessage(habit.currentStreak || 0)}</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{habit.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{habit.completionRate || 0}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      {/* CONTEXT: Action buttons for habit management */}
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="pencil" size={16} color="#7f8c8d" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash" size={16} color="#e74c3c" />
              <Text style={[styles.actionText, { color: '#e74c3c' }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cue: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  completeButton: {
    padding: 4,
  },
  completeButtonDone: {
    opacity: 0.7,
  },
  chainContainer: {
    marginBottom: 16,
  },
  chainLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  chain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  chainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  chainDotCompleted: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  chainDotToday: {
    borderWidth: 2,
    borderColor: '#3498db',
  },
  chainDotCompletedToday: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
    transform: [{ scale: 1.2 }],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  statMessage: {
    fontSize: 10,
    color: '#95a5a6',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
}); 