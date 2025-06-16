import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface OnboardingScreenProps {
  onComplete: (birthDate: Date) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const validateAndProceed = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

    if (birthDate > maxDate) {
      Alert.alert(
        'Age Requirement',
        'You must be at least 13 years old to use this app.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (birthDate < minDate) {
      Alert.alert(
        'Invalid Date',
        'Please enter a valid birth date.',
        [{ text: 'OK' }]
      );
      return;
    }

    onComplete(birthDate);
  };

  const renderWelcomeStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to The Founder's Codex</Text>
        <Text style={styles.subtitle}>Lifetime Calendar</Text>
      </View>

      <View style={styles.philosophySection}>
        <Text style={styles.philosophyTitle}>Transform Your Relationship with Time</Text>
        
        <View style={styles.philosophyPoint}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.philosophyText}>
            <Text style={styles.bold}>Finite Perspective:</Text> See your entire life as 4,680 weeks (90 years) 
            to create positive pressure and focus on what truly matters.
          </Text>
        </View>

        <View style={styles.philosophyPoint}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.philosophyText}>
            <Text style={styles.bold}>Present Awareness:</Text> Every greyed-out week is irreversible time, 
            making each remaining week precious and purposeful.
          </Text>
        </View>

        <View style={styles.philosophyPoint}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.philosophyText}>
            <Text style={styles.bold}>Strategic Vision:</Text> Anchor your most important life goals to specific 
            future weeks, creating a clear roadmap for extraordinary achievement.
          </Text>
        </View>
      </View>

      <View style={styles.quoteSection}>
        <Text style={styles.quote}>
          "Four thousand weeks is absurdly, outrageously, terrifyingly short... 
          But that isn't a reason for despair. It's a cause for relief."
        </Text>
        <Text style={styles.quoteAuthor}>— Oliver Burkeman, Four Thousand Weeks</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
        <Text style={styles.primaryButtonText}>Begin Your Journey</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderBirthDateStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Life Timeline</Text>
        <Text style={styles.subtitle}>When did your journey begin?</Text>
      </View>

      <View style={styles.explanationSection}>
        <Text style={styles.explanationText}>
          To create your personal 90-year view, we need to know your birth date. 
          This allows us to calculate which weeks have passed (and cannot be changed) 
          and which weeks remain as your canvas for building an extraordinary life.
        </Text>
        
        <Text style={styles.privacyText}>
          🔒 Your birth date is stored securely and used only for calculating your life grid.
        </Text>
      </View>

      <View style={styles.datePickerSection}>
        <Text style={styles.dateLabel}>Birth Date</Text>
        
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {birthDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>Your Life at a Glance</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.floor((new Date().getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))}
            </Text>
            <Text style={styles.statLabel}>Weeks Lived</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {4680 - Math.floor((new Date().getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))}
            </Text>
            <Text style={styles.statLabel}>Weeks Remaining</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={validateAndProceed}>
          <Text style={styles.primaryButtonText}>Create My Grid</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return step === 1 ? renderWelcomeStep() : renderBirthDateStep();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
  philosophySection: {
    marginBottom: 32,
  },
  philosophyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 16,
    textAlign: 'center',
  },
  philosophyPoint: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#0d6efd',
    marginRight: 12,
    marginTop: 2,
  },
  philosophyText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    flex: 1,
  },
  bold: {
    fontWeight: '600',
    color: '#212529',
  },
  quoteSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0d6efd',
    marginBottom: 32,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#495057',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'right',
  },
  primaryButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  explanationSection: {
    marginBottom: 32,
  },
  explanationText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  datePickerSection: {
    marginBottom: 32,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  previewSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d6efd',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '500',
  },
}); 