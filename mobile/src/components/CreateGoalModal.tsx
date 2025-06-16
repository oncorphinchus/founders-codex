import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Goal } from '../screens/GoalStackScreen';
import { goalsApi } from '../services/goalsApi';

interface CreateGoalModalProps {
  userId: string;
  parentGoal?: Goal | null;
  onClose: () => void;
  onGoalCreated: () => void;
}

// CONTEXT: Modal that enforces strategic hierarchy through guided goal creation
// Implements SMART goal framework and hypothesis tracking for validated learning
export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  userId,
  parentGoal,
  onClose,
  onGoalCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [specificMeasure, setSpecificMeasure] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isHypothesis, setIsHypothesis] = useState(false);
  const [hypothesisTest, setHypothesisTest] = useState('');
  const [hypothesisMetric, setHypothesisMetric] = useState('');
  const [loading, setLoading] = useState(false);

  // CONTEXT: Determine goal type based on parent hierarchy
  const getGoalType = (): Goal['type'] => {
    if (!parentGoal) return 'KEYSTONE';
    
    const typeHierarchy: Record<Goal['type'], Goal['type']> = {
      KEYSTONE: 'ANNUAL',
      ANNUAL: 'QUARTERLY',
      QUARTERLY: 'WEEKLY',
      WEEKLY: 'DAILY_ATOMIC',
      DAILY_ATOMIC: 'DAILY_ATOMIC', // This shouldn't happen due to UI restrictions
    };
    
    return typeHierarchy[parentGoal.type];
  };

  const goalType = getGoalType();

  const getGoalTypeInfo = (type: Goal['type']) => {
    const typeMap = {
      KEYSTONE: { 
        label: 'Keystone Goal', 
        description: 'Your 10-year vision anchor',
        placeholder: 'e.g., Build a $10M sustainable business',
        color: '#6f42c1',
        icon: '🎯'
      },
      ANNUAL: { 
        label: 'Annual Goal', 
        description: 'This year\'s major objective',
        placeholder: 'e.g., Launch MVP and reach 1,000 users',
        color: '#0d6efd',
        icon: '📅'
      },
      QUARTERLY: { 
        label: 'Quarterly Rock', 
        description: 'This quarter\'s focus',
        placeholder: 'e.g., Complete user research and validate core features',
        color: '#20c997',
        icon: '🎯'
      },
      WEEKLY: { 
        label: 'Weekly Sprint', 
        description: 'This week\'s commitment',
        placeholder: 'e.g., Interview 5 potential customers',
        color: '#fd7e14',
        icon: '⏰'
      },
      DAILY_ATOMIC: { 
        label: 'Daily Atomic Task', 
        description: 'Today\'s specific action',
        placeholder: 'e.g., Write interview questions',
        color: '#dc3545',
        icon: '⚡'
      },
    };
    return typeMap[type];
  };

  const typeInfo = getGoalTypeInfo(goalType);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a goal title.');
      return;
    }

    // CONTEXT: For hypothesis goals, ensure proper experimental design
    if (isHypothesis && (!hypothesisTest.trim() || !hypothesisMetric.trim())) {
      Alert.alert(
        'Hypothesis Design',
        'For hypothesis goals, please define both how you\'ll test it and how you\'ll measure success. This ensures validated learning.'
      );
      return;
    }

    try {
      setLoading(true);
      
      const goalData = {
        type: goalType,
        title: title.trim(),
        description: description.trim() || undefined,
        parentId: parentGoal?.id,
        specificMeasure: specificMeasure.trim() || undefined,
        targetDate: targetDate.trim() || undefined,
        isHypothesis,
        hypothesisTest: isHypothesis ? hypothesisTest.trim() : undefined,
        hypothesisMetric: isHypothesis ? hypothesisMetric.trim() : undefined,
      };

      await goalsApi.createGoal(userId, goalData);
      onGoalCreated();
      
      Alert.alert(
        'Goal Created',
        `Your ${typeInfo.label.toLowerCase()} has been added to your Goal Stack. Remember: every action should serve this greater purpose.`,
        [{ text: 'Great!' }]
      );
    } catch (error) {
      Alert.alert(
        'Creation Error',
        'Unable to create goal. Please check your input and try again.',
        [{ text: 'OK' }]
      );
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create {typeInfo.label}</Text>
        <TouchableOpacity 
          onPress={handleCreate} 
          style={[styles.createButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* CONTEXT: Shows hierarchy context for strategic alignment */}
        {parentGoal && (
          <View style={styles.hierarchyContainer}>
            <Text style={styles.hierarchyLabel}>Child of:</Text>
            <View style={styles.parentGoalCard}>
              <Text style={styles.parentGoalTitle}>{parentGoal.title}</Text>
              <Text style={styles.parentGoalType}>{parentGoal.type}</Text>
            </View>
          </View>
        )}

        <View style={styles.typeHeader}>
          <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
          <View style={styles.typeInfo}>
            <Text style={[styles.typeLabel, { color: typeInfo.color }]}>
              {typeInfo.label}
            </Text>
            <Text style={styles.typeDescription}>{typeInfo.description}</Text>
          </View>
        </View>

        {/* CONTEXT: SMART goal framework implementation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal Title *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder={typeInfo.placeholder}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Provide context and details..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success Measure (SMART Goals)</Text>
          <TextInput
            style={styles.textInput}
            value={specificMeasure}
            onChangeText={setSpecificMeasure}
            placeholder="How will you know you've succeeded?"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Date</Text>
          <TextInput
            style={styles.textInput}
            value={targetDate}
            onChangeText={setTargetDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* CONTEXT: Hypothesis tracking for validated learning */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.sectionTitle}>🧪 Mark as Hypothesis</Text>
              <Text style={styles.switchDescription}>
                Flag this as a business experiment for validated learning
              </Text>
            </View>
            <Switch
              value={isHypothesis}
              onValueChange={setIsHypothesis}
              trackColor={{ false: '#e9ecef', true: '#0d6efd' }}
              thumbColor={isHypothesis ? '#ffffff' : '#ffffff'}
            />
          </View>
        </View>

        {isHypothesis && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Test Method *</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={hypothesisTest}
                onChangeText={setHypothesisTest}
                placeholder="How will you test this hypothesis?"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Success Metric *</Text>
              <TextInput
                style={styles.textInput}
                value={hypothesisMetric}
                onChangeText={setHypothesisMetric}
                placeholder="What metric will prove/disprove this?"
              />
            </View>
          </>
        )}

        {/* CONTEXT: Educational content about the goal hierarchy */}
        <View style={styles.philosophyBox}>
          <Text style={styles.philosophyTitle}>Strategic Alignment</Text>
          <Text style={styles.philosophyText}>
            Every goal in your stack should serve a higher purpose. This {typeInfo.label.toLowerCase()} 
            {parentGoal ? ` contributes to "${parentGoal.title}"` : ' anchors your 10-year vision'}.
            Ask yourself: Does this move me closer to my ultimate objectives?
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#6c757d',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  createButton: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  hierarchyContainer: {
    marginBottom: 16,
  },
  hierarchyLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  parentGoalCard: {
    backgroundColor: '#e7f1ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0d6efd',
  },
  parentGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  parentGoalType: {
    fontSize: 12,
    color: '#0d6efd',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  philosophyBox: {
    backgroundColor: '#fff8e1',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  philosophyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5d4037',
    marginBottom: 8,
  },
  philosophyText: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 20,
  },
}); 