import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Goal } from '../screens/GoalStackScreen';

interface GoalHierarchyCardProps {
  goal: Goal;
  level: number;
  onStatusUpdate: (goalId: string, status: Goal['status'], learnings?: string) => void;
  onCreateChild: (parent: Goal) => void;
}

// CONTEXT: Renders the hierarchical goal structure with visual indentation
// Implements the "Vision-to-Action Funnel" through expandable goal trees
export const GoalHierarchyCard: React.FC<GoalHierarchyCardProps> = ({
  goal,
  level,
  onStatusUpdate,
  onCreateChild,
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first two levels
  const [animation] = useState(new Animated.Value(isExpanded ? 1 : 0));

  const toggleExpansion = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    Animated.timing(animation, {
      toValue: newExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getGoalTypeInfo = (type: Goal['type']) => {
    const typeMap = {
      KEYSTONE: { label: 'Keystone', color: '#6f42c1', icon: '🎯' },
      ANNUAL: { label: 'Annual', color: '#0d6efd', icon: '📅' },
      QUARTERLY: { label: 'Quarterly', color: '#20c997', icon: '🎯' },
      WEEKLY: { label: 'Weekly', color: '#fd7e14', icon: '⏰' },
      DAILY_ATOMIC: { label: 'Daily', color: '#dc3545', icon: '⚡' },
    };
    return typeMap[type];
  };

  const getStatusInfo = (status: Goal['status']) => {
    // CONTEXT: Implements "Language of Growth" - no negative status labels
    const statusMap = {
      NOT_STARTED: { label: 'Ready to Begin', color: '#6c757d', backgroundColor: '#f8f9fa' },
      IN_PROGRESS: { label: 'In Progress', color: '#0d6efd', backgroundColor: '#e7f1ff' },
      COMPLETE: { label: 'Complete', color: '#198754', backgroundColor: '#d1f2eb' },
      LEARNING_IN_PROGRESS: { label: 'Learning in Progress', color: '#fd7e14', backgroundColor: '#fff3e0' },
    };
    return statusMap[status];
  };

  const typeInfo = getGoalTypeInfo(goal.type);
  const statusInfo = getStatusInfo(goal.status);
  const hasChildren = goal.children && goal.children.length > 0;

  // CONTEXT: Visual indentation shows hierarchy depth
  const indentationWidth = level * 20;

  return (
    <View style={[styles.container, { marginLeft: indentationWidth }]}>
      <View style={[styles.card, { borderLeftColor: typeInfo.color }]}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={hasChildren ? toggleExpansion : undefined}
          activeOpacity={hasChildren ? 0.7 : 1}
        >
          <View style={styles.titleRow}>
            <View style={styles.typeContainer}>
              <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
              <Text style={[styles.typeLabel, { color: typeInfo.color }]}>
                {typeInfo.label}
              </Text>
            </View>
            {hasChildren && (
              <Text style={styles.expandIcon}>
                {isExpanded ? '▼' : '▶'}
              </Text>
            )}
          </View>
          
          <Text style={styles.title}>{goal.title}</Text>
          
          {goal.description && (
            <Text style={styles.description}>{goal.description}</Text>
          )}

          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
            
            {goal.isHypothesis && (
              <View style={styles.hypothesisBadge}>
                <Text style={styles.hypothesisText}>🧪 Hypothesis</Text>
              </View>
            )}
          </View>

          {goal.targetDate && (
            <Text style={styles.targetDate}>
              Target: {new Date(goal.targetDate).toLocaleDateString()}
            </Text>
          )}

          {/* CONTEXT: Shows learnings for completed experiments */}
          {goal.learnings && (
            <View style={styles.learningsContainer}>
              <Text style={styles.learningsLabel}>💡 Learning:</Text>
              <Text style={styles.learningsText}>{goal.learnings}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* CONTEXT: Action buttons for status management and hierarchy expansion */}
        <View style={styles.actionRow}>
          {goal.status !== 'COMPLETE' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => onStatusUpdate(goal.id, 'COMPLETE')}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          )}

          {goal.status !== 'LEARNING_IN_PROGRESS' && goal.status !== 'COMPLETE' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.learningButton]}
              onPress={() => onStatusUpdate(goal.id, 'LEARNING_IN_PROGRESS')}
            >
              <Text style={styles.learningButtonText}>Learning Mode</Text>
            </TouchableOpacity>
          )}

          {/* CONTEXT: Allow creating child goals to maintain hierarchy */}
          {goal.type !== 'DAILY_ATOMIC' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.addChildButton]}
              onPress={() => onCreateChild(goal)}
            >
              <Text style={styles.addChildButtonText}>Add Child</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTEXT: Recursively render child goals with increased indentation */}
      {hasChildren && (
        <Animated.View
          style={[
            styles.childrenContainer,
            {
              opacity: animation,
              maxHeight: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000], // Approximate max height
              }),
            },
          ]}
        >
          {isExpanded &&
            goal.children.map((child) => (
              <GoalHierarchyCard
                key={child.id}
                goal={child}
                level={level + 1}
                onStatusUpdate={onStatusUpdate}
                onCreateChild={onCreateChild}
              />
            ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  expandIcon: {
    fontSize: 16,
    color: '#6c757d',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hypothesisBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hypothesisText: {
    fontSize: 12,
    color: '#f57c00',
    fontWeight: '600',
  },
  targetDate: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  learningsContainer: {
    backgroundColor: '#fff8e1',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  learningsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 4,
  },
  learningsText: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  completeButton: {
    backgroundColor: '#d1f2eb',
  },
  completeButtonText: {
    color: '#198754',
    fontSize: 12,
    fontWeight: '600',
  },
  learningButton: {
    backgroundColor: '#fff3e0',
  },
  learningButtonText: {
    color: '#fd7e14',
    fontSize: 12,
    fontWeight: '600',
  },
  addChildButton: {
    backgroundColor: '#e7f1ff',
  },
  addChildButtonText: {
    color: '#0d6efd',
    fontSize: 12,
    fontWeight: '600',
  },
  childrenContainer: {
    overflow: 'hidden',
  },
}); 