import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

interface KeystoneGoal {
  id: string;
  weekId: number;
  labelText: string;
  description?: string;
  isCompleted: boolean;
}

interface LifeGridProps {
  birthDate: Date;
  keystoneGoals: KeystoneGoal[];
  onWeekPress: (weekId: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const WEEKS_PER_ROW = 52; // 52 weeks per year
const TOTAL_WEEKS = 4680; // 90 years * 52 weeks
const SQUARE_SIZE = (screenWidth - 40) / WEEKS_PER_ROW - 2; // Account for padding and spacing

export const LifeGrid: React.FC<LifeGridProps> = ({
  birthDate,
  keystoneGoals,
  onWeekPress,
}) => {
  // CONTEXT: This component embodies the "Memento Mori Engine" principle from "The Finite Lifespan" philosophy
  const { currentWeek, pastWeeks, futureWeeks } = useMemo(() => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    const currentWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    const pastWeeks = Array.from({ length: currentWeek }, (_, i) => i);
    const futureWeeks = Array.from(
      { length: TOTAL_WEEKS - currentWeek },
      (_, i) => currentWeek + i
    );

    return { currentWeek, pastWeeks, futureWeeks };
  }, [birthDate]);

  const keystoneGoalMap = useMemo(() => {
    const map = new Map<number, KeystoneGoal>();
    keystoneGoals.forEach(goal => map.set(goal.weekId, goal));
    return map;
  }, [keystoneGoals]);

  const getWeekStyle = (weekId: number) => {
    const isPast = weekId < currentWeek;
    const isCurrent = weekId === currentWeek;
    const keystoneGoal = keystoneGoalMap.get(weekId);

    return [
      styles.week,
      isPast && styles.pastWeek,
      isCurrent && styles.currentWeek,
      keystoneGoal && styles.keystoneWeek,
      keystoneGoal?.isCompleted && styles.completedKeystoneWeek,
    ];
  };

  const handleWeekPress = (weekId: number) => {
    // CONTEXT: Prevents setting goals for past weeks, enforcing the forward-looking nature of the system
    if (weekId < currentWeek) {
      Alert.alert(
        'Cannot Modify Past',
        'The past weeks cannot be changed. Focus on the weeks ahead - they are your canvas for building an extraordinary life.',
        [{ text: 'Understood', style: 'default' }]
      );
      return;
    }

    onWeekPress(weekId);
  };

  const renderYear = (yearIndex: number) => {
    const yearStartWeek = yearIndex * WEEKS_PER_ROW;
    const currentAge = Math.floor(yearStartWeek / WEEKS_PER_ROW);
    
    return (
      <View key={yearIndex} style={styles.yearContainer}>
        <Text style={styles.yearLabel}>Age {currentAge}</Text>
        <View style={styles.yearRow}>
          {Array.from({ length: WEEKS_PER_ROW }, (_, weekInYear) => {
            const weekId = yearStartWeek + weekInYear;
            if (weekId >= TOTAL_WEEKS) return null;

            const keystoneGoal = keystoneGoalMap.get(weekId);

            return (
              <TouchableOpacity
                key={weekId}
                style={getWeekStyle(weekId)}
                onPress={() => handleWeekPress(weekId)}
                activeOpacity={weekId >= currentWeek ? 0.7 : 1}
              >
                {keystoneGoal && (
                  <Text style={styles.keystoneLabel} numberOfLines={1}>
                    {keystoneGoal.labelText.charAt(0)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Life in Weeks</Text>
        <Text style={styles.subtitle}>
          {TOTAL_WEEKS - currentWeek} weeks remaining to make them count
        </Text>
        <Text style={styles.currentWeekText}>
          Currently in week {currentWeek + 1} of your life
        </Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.pastWeek]} />
          <Text style={styles.legendText}>Past</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.currentWeek]} />
          <Text style={styles.legendText}>Now</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.futureWeek]} />
          <Text style={styles.legendText}>Future</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.keystoneWeek]} />
          <Text style={styles.legendText}>Keystone Goal</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {Array.from({ length: 90 }, (_, yearIndex) => renderYear(yearIndex))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          "The shortness of life, so often lamented, may be the best thing about it." - Arthur Schopenhauer
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 4,
  },
  currentWeekText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  legendItem: {
    alignItems: 'center',
  },
  legendSquare: {
    width: 12,
    height: 12,
    marginBottom: 4,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#6c757d',
  },
  grid: {
    padding: 20,
  },
  yearContainer: {
    marginBottom: 12,
  },
  yearLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  yearRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  week: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastWeek: {
    backgroundColor: '#adb5bd', // CONTEXT: Greyed out to emphasize "sunk time" - cannot be changed
  },
  currentWeek: {
    backgroundColor: '#fd7e14', // CONTEXT: Orange to highlight the present moment as the only field of action
    borderWidth: 2,
    borderColor: '#e55f1a',
  },
  futureWeek: {
    backgroundColor: '#e9ecef',
  },
  keystoneWeek: {
    backgroundColor: '#0d6efd', // CONTEXT: Blue for keystone goals - anchor points for the future
    borderWidth: 1,
    borderColor: '#0a58ca',
  },
  completedKeystoneWeek: {
    backgroundColor: '#198754', // CONTEXT: Green for completed goals - celebrating achievements
  },
  keystoneLabel: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 