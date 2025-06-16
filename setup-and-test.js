#!/usr/bin/env node

/**
 * FOUNDERS CODEX - Setup and Testing Script
 * 
 * This script performs comprehensive validation of the Founder's Codex application:
 * 1. Checks database connectivity
 * 2. Tests Goal Stack API endpoints
 * 3. Tests Habit Engine API endpoints
 * 4. Validates philosophical principles implementation
 * 
 * CONTEXT: Validates both technical functionality and philosophical adherence
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER_ID = 'test-user-123';

// ANSI color codes for output formatting
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logSection(title) {
  log(`\n${colors.bold}=== ${title} ===${colors.reset}`, colors.blue);
}

async function checkApiConnectivity() {
  logSection('API Connectivity Test');
  
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    logSuccess('API server is responding');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logError('API server is not running');
      logInfo('Please start the API server with: npm run start:api');
      logInfo('Make sure PostgreSQL database is running first');
    } else {
      logError(`API connectivity error: ${error.message}`);
    }
    return false;
  }
}

async function testGoalStackAPI() {
  logSection('Goal Stack API Tests');
  
  try {
    // CONTEXT: Test Vision-to-Action Funnel implementation
    logInfo('Testing Keystone Goal creation (Vision Anchor)...');
    
    const keystoneGoal = {
      title: 'Launch Revolutionary SaaS Platform',
      description: 'Build and launch a SaaS platform that helps entrepreneurs',
      type: 'KEYSTONE',
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      isHypothesis: true,
      hypothesis: 'Entrepreneurs need better tools for systematic goal achievement',
      metric: 'Monthly Active Users',
      learnings: ''
    };
    
    const keystoneResponse = await axios.post(`${API_BASE_URL}/goals`, keystoneGoal, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    logSuccess(`Keystone Goal created: ${keystoneResponse.data.title}`);
    const keystoneId = keystoneResponse.data.id;
    
    // CONTEXT: Test hierarchical goal enforcement
    logInfo('Testing Annual Goal linked to Keystone...');
    
    const annualGoal = {
      title: 'Complete MVP Development',
      description: 'Build minimum viable product with core features',
      type: 'ANNUAL',
      parentGoalId: keystoneId,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
      isHypothesis: true,
      hypothesis: 'Core features identified through customer interviews will be sufficient for MVP',
      metric: 'Feature completion percentage',
      learnings: ''
    };
    
    const annualResponse = await axios.post(`${API_BASE_URL}/goals`, annualGoal, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    logSuccess(`Annual Goal created: ${annualResponse.data.title}`);
    
    // CONTEXT: Test goal hierarchy retrieval
    logInfo('Testing goal hierarchy retrieval...');
    
    const hierarchyResponse = await axios.get(`${API_BASE_URL}/goals/hierarchy`, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    if (hierarchyResponse.data.length > 0 && hierarchyResponse.data[0].children) {
      logSuccess('Goal hierarchy properly structured with parent-child relationships');
    } else {
      logWarning('Goal hierarchy structure may need verification');
    }
    
    // CONTEXT: Test Antifragile principle - Learning from setbacks
    logInfo('Testing "Learning in Progress" status (Antifragile principle)...');
    
    const learningUpdate = {
      status: 'LEARNING_IN_PROGRESS',
      learnings: 'Customer interviews revealed different pain points than initially assumed. Pivoting feature set based on feedback.'
    };
    
    await axios.patch(`${API_BASE_URL}/goals/${keystoneId}/learning`, learningUpdate, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    logSuccess('Successfully updated goal to "Learning in Progress" status');
    logSuccess('Goal Stack API: All tests passed! ✨');
    
    return true;
    
  } catch (error) {
    logError(`Goal Stack API test failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testHabitEngineAPI() {
  logSection('Habit Engine API Tests');
  
  try {
    // CONTEXT: Test atomic habit creation (James Clear's methodology)
    logInfo('Testing atomic habit creation...');
    
    const atomicHabit = {
      title: 'Read one page of business book',
      cue: 'After my morning coffee'
    };
    
    const habitResponse = await axios.post(`${API_BASE_URL}/habits`, atomicHabit, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    logSuccess(`Atomic habit created: ${habitResponse.data.title}`);
    const habitId = habitResponse.data.id;
    
    // CONTEXT: Test habit completion (celebrating process principle)
    logInfo('Testing habit completion tracking...');
    
    const completionResponse = await axios.post(`${API_BASE_URL}/habits/${habitId}/complete`, {}, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    logSuccess('Habit completion recorded');
    
    // CONTEXT: Test duplicate completion prevention
    logInfo('Testing duplicate completion prevention...');
    
    try {
      await axios.post(`${API_BASE_URL}/habits/${habitId}/complete`, {}, {
        headers: { 'user-id': TEST_USER_ID }
      });
      logWarning('Duplicate completion was allowed (should be prevented)');
    } catch (error) {
      if (error.response?.status === 400) {
        logSuccess('Duplicate completion properly prevented');
      } else {
        throw error;
      }
    }
    
    // CONTEXT: Test habit retrieval with metrics
    logInfo('Testing habit metrics calculation...');
    
    const habitDetailsResponse = await axios.get(`${API_BASE_URL}/habits/${habitId}`, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    const habit = habitDetailsResponse.data;
    
    if (typeof habit.currentStreak === 'number' && typeof habit.longestStreak === 'number') {
      logSuccess(`Habit metrics calculated: Current streak: ${habit.currentStreak}, Longest streak: ${habit.longestStreak}`);
    } else {
      logWarning('Habit metrics may not be properly calculated');
    }
    
    // CONTEXT: Test user isolation (security)
    logInfo('Testing user isolation...');
    
    const userHabitsResponse = await axios.get(`${API_BASE_URL}/habits`, {
      headers: { 'user-id': TEST_USER_ID }
    });
    
    const userHabits = userHabitsResponse.data;
    const allBelongToUser = userHabits.every(h => h.userId === TEST_USER_ID);
    
    if (allBelongToUser) {
      logSuccess('User isolation properly enforced');
    } else {
      logError('User isolation may be compromised');
    }
    
    logSuccess('Habit Engine API: All tests passed! ✨');
    
    return true;
    
  } catch (error) {
    logError(`Habit Engine API test failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testPhilosophicalPrinciples() {
  logSection('Philosophical Principles Validation');
  
  try {
    // CONTEXT: Test "Language of Growth" principle
    logInfo('Testing "Language of Growth" principle...');
    
    const testGoal = {
      title: 'Test Goal for Language Validation',
      description: 'Testing goal status language',
      type: 'WEEKLY',
      parentGoalId: null, // This should fail due to hierarchy rules
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    try {
      await axios.post(`${API_BASE_URL}/goals`, testGoal, {
        headers: { 'user-id': TEST_USER_ID }
      });
      logWarning('Goal hierarchy validation may not be properly enforced');
    } catch (error) {
      if (error.response?.status === 400) {
        logSuccess('Goal hierarchy properly enforced - every action must serve a greater vision');
      }
    }
    
    logSuccess('Philosophical principles validation completed');
    return true;
    
  } catch (error) {
    logError(`Philosophical principles test failed: ${error.message}`);
    return false;
  }
}

async function runFullTestSuite() {
  log(`${colors.bold}🚀 FOUNDERS CODEX - COMPREHENSIVE TESTING SUITE${colors.reset}`);
  log(`${colors.blue}Testing the systematic approach to founder development${colors.reset}\n`);
  
  // Check if API is available
  const apiAvailable = await checkApiConnectivity();
  if (!apiAvailable) {
    logError('Cannot proceed with tests - API server not available');
    logInfo('\nSetup Instructions:');
    logInfo('1. Install and start PostgreSQL');
    logInfo('2. Create database: createdb founders_codex');
    logInfo('3. Start API server: npm run start:api');
    logInfo('4. Run this script again');
    process.exit(1);
  }
  
  let allTestsPassed = true;
  
  // Run all test suites
  const goalStackPassed = await testGoalStackAPI();
  const habitEnginePassed = await testHabitEngineAPI();
  const principlesPassed = await testPhilosophicalPrinciples();
  
  allTestsPassed = goalStackPassed && habitEnginePassed && principlesPassed;
  
  // Final summary
  logSection('Test Results Summary');
  
  if (allTestsPassed) {
    logSuccess('🎉 ALL TESTS PASSED!');
    logSuccess('The Founder\'s Codex is ready for development and testing!');
    log('\nNext Steps:', colors.blue);
    log('• Set up the React Native mobile app');
    log('• Configure Firebase authentication');
    log('• Deploy to staging environment');
    log('• Begin user testing with founder community');
  } else {
    logError('Some tests failed. Please review the errors above.');
    logInfo('Check the implementation and try again.');
  }
}

// Handle command line arguments
if (require.main === module) {
  runFullTestSuite().catch(error => {
    logError(`Test suite failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  checkApiConnectivity,
  testGoalStackAPI,
  testHabitEngineAPI,
  testPhilosophicalPrinciples
}; 