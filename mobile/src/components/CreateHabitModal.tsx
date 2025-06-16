import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CreateHabitData } from '../services/habitService';

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (habitData: CreateHabitData) => Promise<void>;
}

// CONTEXT: Atomic habit creation interface implementing James Clear's principles
// Guides users toward "too small to fail" habits with suggested examples
export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cue, setCue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // CONTEXT: Suggested atomic habits based on James Clear's methodology
  // Encourages starting with tiny, consistent actions
  const atomicHabitSuggestions = [
    { title: 'Read one page', cue: 'After I sit down with my morning coffee' },
    { title: 'Write 50 words', cue: 'After I open my laptop' },
    { title: 'Do one push-up', cue: 'After I wake up' },
    { title: 'Meditate for 1 minute', cue: 'After I brush my teeth' },
    { title: 'Drink one glass of water', cue: 'After I check my phone in the morning' },
    { title: 'Write one thing I\'m grateful for', cue: 'Before I go to bed' },
    { title: 'Take one deep breath', cue: 'Before each meeting' },
    { title: 'Stand up and stretch', cue: 'After every hour of work' },
  ];

  // CONTEXT: Common habit stacking cues to help users build reliable triggers
  const habitStackingSuggestions = [
    'After I wake up',
    'After I brush my teeth',
    'After I have my morning coffee',
    'After I sit at my desk',
    'After I open my laptop',
    'After lunch',
    'After I finish work',
    'Before I go to bed',
    'When I feel stressed',
    'Before each meeting',
  ];

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your habit.');
      return;
    }

    // CONTEXT: Validate atomic habit principles - encourage small actions
    if (title.length > 50) {
      Alert.alert(
        'Keep It Simple',
        'Consider breaking this into a smaller, more manageable habit. Atomic habits are designed to be "too small to fail".'
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        cue: cue.trim() || undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCue('');
    } catch (error) {
      console.error('Error creating habit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestionSelect = (suggestion: { title: string; cue: string }) => {
    setTitle(suggestion.title);
    setCue(suggestion.cue);
  };

  const handleCueSelect = (selectedCue: string) => {
    setCue(selectedCue);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Atomic Habit</Text>
            <TouchableOpacity 
              onPress={handleSubmit} 
              style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
              disabled={submitting || !title.trim()}
            >
              <Text style={[styles.saveButtonText, (!title.trim() || submitting) && styles.saveButtonTextDisabled]}>
                {submitting ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* CONTEXT: Guidance section emphasizing atomic habit principles */}
            <View style={styles.guidance}>
              <Text style={styles.guidanceTitle}>🎯 The Power of Small</Text>
              <Text style={styles.guidanceText}>
                Start with a habit so small it feels "too easy to fail." Focus on consistency, not intensity. 
                You can always do more, but never less than your minimum commitment.
              </Text>
            </View>

            {/* Habit Title Input */}
            <View style={styles.section}>
              <Text style={styles.label}>What's your tiny habit?</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Read one page, Write 50 words, Do one push-up"
                maxLength={100}
                autoFocus
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            {/* CONTEXT: Atomic habit suggestions to guide users toward success */}
            <View style={styles.section}>
              <Text style={styles.label}>✨ Atomic Habit Ideas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
                {atomicHabitSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionCard}
                    onPress={() => handleSuggestionSelect(suggestion)}
                  >
                    <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    <Text style={styles.suggestionCue}>{suggestion.cue}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* CONTEXT: Habit stacking cue input for reliable triggers */}
            <View style={styles.section}>
              <Text style={styles.label}>🔗 When will you do it? (Habit Stacking)</Text>
              <TextInput
                style={styles.input}
                value={cue}
                onChangeText={setCue}
                placeholder="After I [existing habit/event]"
                maxLength={200}
              />
              <Text style={styles.helpText}>
                Link your new habit to something you already do consistently.
              </Text>
            </View>

            {/* Habit Stacking Suggestions */}
            <View style={styles.section}>
              <Text style={styles.label}>💡 Popular Habit Stacks</Text>
              <View style={styles.cueGrid}>
                {habitStackingSuggestions.map((cueSuggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.cueTag}
                    onPress={() => handleCueSelect(cueSuggestion)}
                  >
                    <Text style={styles.cueTagText}>{cueSuggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Optional Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Additional Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Any extra details about your habit..."
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            {/* CONTEXT: Success principles reminder */}
            <View style={styles.principles}>
              <Text style={styles.principlesTitle}>🏆 Keys to Success</Text>
              <View style={styles.principle}>
                <Text style={styles.principleText}>• Start ridiculously small</Text>
              </View>
              <View style={styles.principle}>
                <Text style={styles.principleText}>• Focus on consistency over quantity</Text>
              </View>
              <View style={styles.principle}>
                <Text style={styles.principleText}>• Stack onto existing routines</Text>
              </View>
              <View style={styles.principle}>
                <Text style={styles.principleText}>• Celebrate every completion</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#7f8c8d',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  guidance: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#2c3e50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  suggestionsScroll: {
    marginTop: 8,
  },
  suggestionCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: 180,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  suggestionCue: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  cueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  cueTag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cueTagText: {
    fontSize: 12,
    color: '#495057',
  },
  principles: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  principlesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  principle: {
    marginBottom: 8,
  },
  principleText: {
    fontSize: 14,
    color: '#495057',
  },
}); 