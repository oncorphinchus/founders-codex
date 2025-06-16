import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LifeGrid } from '../components/LifeGrid';

interface KeystoneGoal {
  id: string;
  weekId: number;
  labelText: string;
  description?: string;
  isCompleted: boolean;
}

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [keystoneGoals, setKeystoneGoals] = useState<KeystoneGoal[]>([]);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user has completed onboarding
      const storedBirthDate = await AsyncStorage.getItem('birthDate');
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');

      if (storedBirthDate && onboardingComplete === 'true') {
        setBirthDate(new Date(storedBirthDate));
        setIsOnboardingComplete(true);
        
        // Load keystone goals (mock data for MVP)
        await loadKeystoneGoals();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to load app data. Please restart the app.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadKeystoneGoals = async () => {
    try {
      // CONTEXT: In the full implementation, this would fetch from the API
      // For MVP, we'll load from local storage
      const storedGoals = await AsyncStorage.getItem('keystoneGoals');
      if (storedGoals) {
        setKeystoneGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Error loading keystone goals:', error);
    }
  };

  const handleOnboardingComplete = async (selectedBirthDate: Date) => {
    try {
      // Save birth date and mark onboarding as complete
      await AsyncStorage.setItem('birthDate', selectedBirthDate.toISOString());
      await AsyncStorage.setItem('onboardingComplete', 'true');
      
      setBirthDate(selectedBirthDate);
      setIsOnboardingComplete(true);

      // CONTEXT: This creates the powerful psychological moment described in the roadmap
      // The "greying out" of past weeks should be dramatic and impactful
      Alert.alert(
        'Your Life Grid is Ready',
        'Each week that has passed is now permanently greyed out. This is not to discourage you, but to remind you that the remaining weeks are precious and finite. Use them wisely.',
        [
          {
            text: 'I Understand',
            style: 'default',
            onPress: () => {
              // This moment reinforces the memento mori philosophy
              console.log('User acknowledged the finite nature of their remaining time');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    }
  };

  const handleWeekPress = async (weekId: number) => {
    // CONTEXT: This is the low-fidelity test of goal anchoring for the MVP
    // In Phase 2, this would open a full goal creation flow
    Alert.alert(
      'Set Keystone Goal',
      `Set a major life goal for week ${weekId + 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Goal',
          onPress: () => promptForGoalText(weekId),
        },
      ]
    );
  };

  const promptForGoalText = (weekId: number) => {
    // CONTEXT: Simplified goal creation for MVP
    // This would be replaced with a proper form in Phase 2
    Alert.prompt(
      'Keystone Goal',
      'What major achievement do you want to anchor to this week?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (text) => {
            if (text && text.trim()) {
              await createKeystoneGoal(weekId, text.trim());
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const createKeystoneGoal = async (weekId: number, labelText: string) => {
    try {
      const newGoal: KeystoneGoal = {
        id: Date.now().toString(), // Simple ID for MVP
        weekId,
        labelText,
        isCompleted: false,
      };

      const updatedGoals = [...keystoneGoals, newGoal];
      setKeystoneGoals(updatedGoals);

      // Save to local storage
      await AsyncStorage.setItem('keystoneGoals', JSON.stringify(updatedGoals));

      Alert.alert(
        'Goal Set!',
        `Your keystone goal "${labelText}" has been anchored to week ${weekId + 1}. This creates a compelling "pull" motivation towards your future vision.`,
        [{ text: 'Excellent', style: 'default' }]
      );
    } catch (error) {
      console.error('Error creating keystone goal:', error);
      Alert.alert('Error', 'Failed to save your goal. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
          <ActivityIndicator size="large" color="#0d6efd" />
          <Text style={styles.loadingText}>Loading The Founder's Codex...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!isOnboardingComplete || !birthDate) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <LifeGrid
          birthDate={birthDate}
          keystoneGoals={keystoneGoals}
          onWeekPress={handleWeekPress}
        />
      </SafeAreaView>
    </SafeAreaProvider>
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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
});
