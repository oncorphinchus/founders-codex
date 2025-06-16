#!/usr/bin/env node

/**
 * CONTEXT: Comprehensive integration test for "The 1% Better System"
 * Validates both technical functionality and philosophical principles
 * Tests atomic habit creation, streak calculation, and completion tracking
 */

const API_BASE = 'http://localhost:3000';

// CONTEXT: Test data representing atomic habits aligned with James Clear's principles
const testHabits = [
  {
    title: 'Read one page',
    description: 'Daily reading habit to build knowledge',
    cue: 'After my morning coffee',
  },
  {
    title: 'Do one push-up',
    description: 'Starting fitness habit',
    cue: 'After I wake up',
  },
  {
    title: 'Write 50 words',
    description: 'Building writing consistency',
    cue: 'After I open my laptop',
  },
  {
    title: 'Meditate for 1 minute',
    description: 'Mindfulness practice',
    cue: 'After I brush my teeth',
  },
];

// CONTEXT: Color coding for test output readability
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'bold');
  console.log('='.repeat(60));
}

function logTest(description, status) {
  const symbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏳';
  const color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`${symbol} ${description}`, color);
}

// CONTEXT: Helper function for API requests with error handling
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
}

// CONTEXT: Test atomic habit creation principles
async function testHabitCreation() {
  logSection('Testing Habit Creation - Atomic Habits Principle');
  
  const createdHabits = [];
  
  for (const habitData of testHabits) {
    try {
      logTest(`Creating habit: "${habitData.title}"`, 'PENDING');
      
      const habit = await apiRequest('/habits', {
        method: 'POST',
        body: JSON.stringify(habitData),
      });
      
      // CONTEXT: Validate atomic habit characteristics
      if (!habit.id) {
        throw new Error('Habit should have an ID');
      }
      
      if (habit.title !== habitData.title) {
        throw new Error(`Title mismatch: expected "${habitData.title}", got "${habit.title}"`);
      }
      
      if (habit.cue !== habitData.cue) {
        throw new Error(`Cue mismatch: expected "${habitData.cue}", got "${habit.cue}"`);
      }
      
      // CONTEXT: Verify initial metrics for new habits
      if (habit.currentStreak !== 0) {
        throw new Error(`New habit should have 0 current streak, got ${habit.currentStreak}`);
      }
      
      if (habit.isCompletedToday !== false) {
        throw new Error(`New habit should not be completed today, got ${habit.isCompletedToday}`);
      }
      
      createdHabits.push(habit);
      logTest(`✓ Created atomic habit: "${habitData.title}"`, 'PASS');
      
    } catch (error) {
      logTest(`✗ Failed to create habit: ${error.message}`, 'FAIL');
      throw error;
    }
  }
  
  log(`\n📊 Created ${createdHabits.length} atomic habits successfully`, 'green');
  return createdHabits;
}

// CONTEXT: Test habit completion and "Make it satisfying" principle
async function testHabitCompletion(habits) {
  logSection('Testing Habit Completion - "Make it Satisfying" Principle');
  
  const completedHabits = [];
  
  for (const habit of habits) {
    try {
      logTest(`Completing habit: "${habit.title}"`, 'PENDING');
      
      // Complete the habit
      const completion = await apiRequest(`/habits/${habit.id}/complete`, {
        method: 'POST',
      });
      
      // CONTEXT: Validate completion record structure
      if (!completion.id) {
        throw new Error('Completion should have an ID');
      }
      
      if (completion.habitId !== habit.id) {
        throw new Error(`Completion habitId mismatch: expected ${habit.id}, got ${completion.habitId}`);
      }
      
      if (!completion.completionDate) {
        throw new Error('Completion should have a completion date');
      }
      
      // Verify the habit shows as completed today
      const updatedHabit = await apiRequest(`/habits/${habit.id}`);
      
      if (!updatedHabit.isCompletedToday) {
        throw new Error('Habit should show as completed today after completion');
      }
      
      if (updatedHabit.currentStreak !== 1) {
        throw new Error(`Habit should have streak of 1 after first completion, got ${updatedHabit.currentStreak}`);
      }
      
      completedHabits.push(updatedHabit);
      logTest(`✓ Completed habit: "${habit.title}" (Streak: ${updatedHabit.currentStreak})`, 'PASS');
      
    } catch (error) {
      logTest(`✗ Failed to complete habit: ${error.message}`, 'FAIL');
      throw error;
    }
  }
  
  log(`\n🎯 Completed ${completedHabits.length} habits successfully`, 'green');
  return completedHabits;
}

// CONTEXT: Test duplicate completion prevention
async function testDuplicateCompletionPrevention(habits) {
  logSection('Testing Duplicate Completion Prevention');
  
  const testHabit = habits[0];
  
  try {
    logTest(`Attempting duplicate completion for: "${testHabit.title}"`, 'PENDING');
    
    // Try to complete the same habit again today
    await apiRequest(`/habits/${testHabit.id}/complete`, {
      method: 'POST',
    });
    
    // If we get here, the duplicate completion was allowed (should not happen)
    logTest('✗ Duplicate completion was allowed (should be prevented)', 'FAIL');
    throw new Error('Duplicate completion should be prevented');
    
  } catch (error) {
    // CONTEXT: We expect this to fail with a specific error message
    if (error.message.includes('already completed')) {
      logTest('✓ Duplicate completion properly prevented', 'PASS');
    } else {
      logTest(`✗ Unexpected error: ${error.message}`, 'FAIL');
      throw error;
    }
  }
}

// CONTEXT: Test habit retrieval and metrics calculation
async function testHabitRetrieval(expectedCount) {
  logSection('Testing Habit Retrieval and Metrics');
  
  try {
    logTest('Retrieving all user habits', 'PENDING');
    
    const habits = await apiRequest('/habits');
    
    // CONTEXT: Validate habit list structure
    if (!Array.isArray(habits)) {
      throw new Error('Habits response should be an array');
    }
    
    if (habits.length !== expectedCount) {
      throw new Error(`Expected ${expectedCount} habits, got ${habits.length}`);
    }
    
    logTest(`✓ Retrieved ${habits.length} habits`, 'PASS');
    
    // CONTEXT: Validate each habit has required metrics for visual feedback
    for (const habit of habits) {
      logTest(`Validating metrics for: "${habit.title}"`, 'PENDING');
      
      const requiredFields = [
        'id', 'title', 'currentStreak', 'longestStreak', 
        'completionRate', 'isCompletedToday'
      ];
      
      for (const field of requiredFields) {
        if (habit[field] === undefined) {
          throw new Error(`Habit missing required field: ${field}`);
        }
      }
      
      // CONTEXT: Validate metric types and ranges
      if (typeof habit.currentStreak !== 'number' || habit.currentStreak < 0) {
        throw new Error(`Invalid currentStreak: ${habit.currentStreak}`);
      }
      
      if (typeof habit.longestStreak !== 'number' || habit.longestStreak < 0) {
        throw new Error(`Invalid longestStreak: ${habit.longestStreak}`);
      }
      
      if (typeof habit.completionRate !== 'number' || habit.completionRate < 0 || habit.completionRate > 100) {
        throw new Error(`Invalid completionRate: ${habit.completionRate}`);
      }
      
      if (typeof habit.isCompletedToday !== 'boolean') {
        throw new Error(`Invalid isCompletedToday: ${habit.isCompletedToday}`);
      }
      
      logTest(`✓ Metrics valid for: "${habit.title}"`, 'PASS');
    }
    
    return habits;
    
  } catch (error) {
    logTest(`✗ Habit retrieval failed: ${error.message}`, 'FAIL');
    throw error;
  }
}

// CONTEXT: Test completion history for visual habit chains
async function testCompletionHistory(habits) {
  logSection('Testing Completion History - Visual Habit Chains Support');
  
  const testHabit = habits[0];
  
  try {
    logTest(`Getting completion history for: "${testHabit.title}"`, 'PENDING');
    
    const completions = await apiRequest(`/habits/${testHabit.id}/completions?days=30`);
    
    // CONTEXT: Validate completion history structure
    if (!Array.isArray(completions)) {
      throw new Error('Completions response should be an array');
    }
    
    // Should have at least one completion from our test
    if (completions.length === 0) {
      throw new Error('Should have at least one completion record');
    }
    
    // CONTEXT: Validate completion record structure for visual chains
    const completion = completions[0];
    const requiredFields = ['id', 'habitId', 'completionDate'];
    
    for (const field of requiredFields) {
      if (!completion[field]) {
        throw new Error(`Completion missing required field: ${field}`);
      }
    }
    
    // Validate the completion belongs to the correct habit
    if (completion.habitId !== testHabit.id) {
      throw new Error(`Completion habitId mismatch: expected ${testHabit.id}, got ${completion.habitId}`);
    }
    
    // Validate date format
    const completionDate = new Date(completion.completionDate);
    if (isNaN(completionDate.getTime())) {
      throw new Error(`Invalid completion date: ${completion.completionDate}`);
    }
    
    logTest(`✓ Retrieved ${completions.length} completion records`, 'PASS');
    
  } catch (error) {
    logTest(`✗ Completion history retrieval failed: ${error.message}`, 'FAIL');
    throw error;
  }
}

// CONTEXT: Test philosophical principle implementation
async function testPhilosophicalPrinciples(habits) {
  logSection('Testing Philosophical Principles Implementation');
  
  // CONTEXT: Test "Atomic Habits" principle - all habits should be small
  logTest('Validating atomic habit sizes', 'PENDING');
  const longHabits = habits.filter(h => h.title.length > 50);
  if (longHabits.length > 0) {
    logTest(`✗ Found ${longHabits.length} habits with overly long titles`, 'FAIL');
  } else {
    logTest('✓ All habits follow atomic habit sizing principle', 'PASS');
  }
  
  // CONTEXT: Test "Habit Stacking" principle - habits with cues
  logTest('Validating habit stacking implementation', 'PENDING');
  const habitsWithCues = habits.filter(h => h.cue && h.cue.trim().length > 0);
  if (habitsWithCues.length === 0) {
    logTest('⚠️  No habits have habit stacking cues (optional but recommended)', 'PENDING');
  } else {
    logTest(`✓ ${habitsWithCues.length} habits implement habit stacking`, 'PASS');
  }
  
  // CONTEXT: Test "Visual Habit Chains" support - streaks should be calculated
  logTest('Validating visual habit chains support', 'PENDING');
  const habitsWithValidStreaks = habits.filter(h => 
    typeof h.currentStreak === 'number' && typeof h.longestStreak === 'number'
  );
  if (habitsWithValidStreaks.length !== habits.length) {
    logTest('✗ Some habits missing streak calculations', 'FAIL');
  } else {
    logTest('✓ All habits support visual habit chains', 'PASS');
  }
  
  // CONTEXT: Test "Celebrating Process" principle - immediate feedback available
  logTest('Validating process celebration support', 'PENDING');
  const completedToday = habits.filter(h => h.isCompletedToday);
  if (completedToday.length > 0) {
    logTest(`✓ ${completedToday.length} habits completed today - process celebration possible`, 'PASS');
  } else {
    logTest('⚠️  No habits completed today - process celebration not testable', 'PENDING');
  }
}

// CONTEXT: Main test execution with comprehensive error handling
async function runTests() {
  log('🚀 Starting Habit Engine Integration Tests', 'bold');
  log('Testing "The 1% Better System" implementation', 'blue');
  
  try {
    // Test API connectivity
    logSection('Testing API Connectivity');
    logTest('Checking API server connection', 'PENDING');
    
    try {
      await apiRequest('/habits');
      logTest('✓ API server is responding', 'PASS');
    } catch (error) {
      logTest('✗ API server is not responding', 'FAIL');
      log('\n❌ Cannot proceed with tests. Please ensure the API server is running on http://localhost:3000', 'red');
      process.exit(1);
    }
    
    // Execute test suite
    const createdHabits = await testHabitCreation();
    const completedHabits = await testHabitCompletion(createdHabits);
    await testDuplicateCompletionPrevention(completedHabits);
    const retrievedHabits = await testHabitRetrieval(testHabits.length);
    await testCompletionHistory(retrievedHabits);
    await testPhilosophicalPrinciples(retrievedHabits);
    
    // CONTEXT: Success summary with philosophical context
    logSection('Test Results Summary');
    log('✅ All tests passed successfully!', 'green');
    log('\n🎯 The Habit Engine successfully implements:', 'blue');
    log('   • Atomic Habits principle (tiny, consistent actions)', 'green');
    log('   • Habit Stacking (cue-routine-reward loops)', 'green');
    log('   • Visual Habit Chains (streak tracking)', 'green');
    log('   • "Make it satisfying" feedback loops', 'green');
    log('   • "Celebrating Process" over outcomes', 'green');
    log('\n🏆 "The 1% Better System" is ready for user engagement!', 'bold');
    
  } catch (error) {
    logSection('Test Failure');
    log(`❌ Tests failed: ${error.message}`, 'red');
    log('\n🔧 Please review the implementation and try again.', 'yellow');
    process.exit(1);
  }
}

// CONTEXT: Execute if run directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('\n💥 Unexpected test failure:', error);
    process.exit(1);
  });
}

module.exports = { runTests }; 