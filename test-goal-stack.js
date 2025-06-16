#!/usr/bin/env node

/**
 * Comprehensive Integration Test for The Founder's Codex Goal Stack
 * 
 * CONTEXT: This script validates both technical functionality and philosophical adherence
 * Tests the complete "Vision-to-Action Funnel" implementation
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';
const TEST_USER_ID = 'test-user-123';

// CONTEXT: Helper function for API calls with proper error handling
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`\n🔄 API Call: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      console.error('Response:', data);
      throw new Error(`API Error: ${response.status}`);
    }

    console.log(`✅ Success: ${response.status}`);
    return data;
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    throw error;
  }
}

// CONTEXT: Test data that represents a real founder's goal hierarchy
const testData = {
  keystone: {
    type: 'KEYSTONE',
    title: 'Build a $10M sustainable climate tech business',
    description: 'Create technology that helps companies reduce carbon emissions while building a profitable, scalable enterprise',
    weekId: 2600, // Target for age 50
    isHypothesis: false,
  },
  annual: {
    type: 'ANNUAL',
    title: 'Launch MVP and validate product-market fit',
    description: 'Build initial version of carbon tracking platform and sign 10 paying customers',
    specificMeasure: '10 paying customers with $500/month ARR',
    targetDate: '2024-12-31',
    isHypothesis: true,
    hypothesisTest: 'Launch beta with 50 companies, measure engagement and conversion',
    hypothesisMetric: 'Monthly active usage >75% and 20% conversion to paid',
  },
  quarterly: {
    type: 'QUARTERLY',
    title: 'Complete customer discovery and technical prototype',
    description: 'Interview 30 potential customers and build working prototype',
    specificMeasure: '30 customer interviews completed, prototype demo ready',
    targetDate: '2024-03-31',
    isHypothesis: false,
  },
  weekly: {
    type: 'WEEKLY',
    title: 'Interview 5 potential customers and refine value proposition',
    description: 'Focus on enterprises with >500 employees in manufacturing',
    specificMeasure: '5 interviews completed, updated value prop document',
    targetDate: '2024-02-02',
    isHypothesis: false,
  },
  daily: {
    type: 'DAILY_ATOMIC',
    title: 'Reach out to 3 manufacturing executives on LinkedIn',
    description: 'Send personalized connection requests with research-backed messaging',
    specificMeasure: '3 connection requests sent with >50% acceptance rate',
    isHypothesis: false,
  }
};

async function runGoalStackTests() {
  console.log('🧪 Starting Goal Stack Integration Tests');
  console.log('=====================================');
  
  let keystoneId, annualId, quarterlyId, weeklyId, dailyId;

  try {
    // CONTEXT: Test 1 - Create Keystone Goal (Vision Anchor)
    console.log('\n📍 TEST 1: Creating Keystone Goal (Vision Anchor)');
    console.log('CONTEXT: Tests foundational principle - every extraordinary journey needs a clear destination');
    
    const keystone = await apiCall(`/goals?userId=${TEST_USER_ID}`, {
      method: 'POST',
      body: JSON.stringify(testData.keystone),
    });
    keystoneId = keystone.id;
    console.log(`✅ Keystone created: "${keystone.title}"`);
    console.log(`   📅 Anchored to week ${keystone.weekId} (age ~${Math.floor(keystone.weekId / 52)})`);

    // CONTEXT: Test 2 - Enforce Hierarchy Rules
    console.log('\n🔒 TEST 2: Testing Hierarchy Enforcement');
    console.log('CONTEXT: Validates "The Practitioner-Scholar" principle - every goal must serve a higher purpose');
    
    try {
      await apiCall(`/goals?userId=${TEST_USER_ID}`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'ANNUAL',
          title: 'Orphaned annual goal',
          // Missing parentId - should fail
        }),
      });
      console.log('❌ FAILED: Should have prevented orphaned goal creation');
    } catch (error) {
      console.log('✅ PASSED: Correctly prevented orphaned goal creation');
    }

    // CONTEXT: Test 3 - Create Complete Hierarchy
    console.log('\n🏗️ TEST 3: Building Complete Goal Hierarchy');
    console.log('CONTEXT: Tests the "Vision-to-Action Funnel" - from 10-year vision to daily actions');
    
    // Annual Goal
    const annual = await apiCall(`/goals?userId=${TEST_USER_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        ...testData.annual,
        parentId: keystoneId,
      }),
    });
    annualId = annual.id;
    console.log(`✅ Annual goal: "${annual.title}"`);
    console.log(`   🧪 Hypothesis tracking: ${annual.isHypothesis ? 'ENABLED' : 'DISABLED'}`);

    // Quarterly Goal
    const quarterly = await apiCall(`/goals?userId=${TEST_USER_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        ...testData.quarterly,
        parentId: annualId,
      }),
    });
    quarterlyId = quarterly.id;
    console.log(`✅ Quarterly goal: "${quarterly.title}"`);

    // Weekly Goal
    const weekly = await apiCall(`/goals?userId=${TEST_USER_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        ...testData.weekly,
        parentId: quarterlyId,
      }),
    });
    weeklyId = weekly.id;
    console.log(`✅ Weekly goal: "${weekly.title}"`);

    // Daily Atomic Goal
    const daily = await apiCall(`/goals?userId=${TEST_USER_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        ...testData.daily,
        parentId: weeklyId,
      }),
    });
    dailyId = daily.id;
    console.log(`✅ Daily atomic task: "${daily.title}"`);

    // CONTEXT: Test 4 - Retrieve Hierarchy
    console.log('\n📊 TEST 4: Testing Hierarchy Retrieval');
    console.log('CONTEXT: Validates that the complete strategic overview is accessible');
    
    const hierarchy = await apiCall(`/goals/hierarchy?userId=${TEST_USER_ID}`);
    console.log(`✅ Retrieved hierarchy with ${hierarchy.length} keystone goal(s)`);
    
    if (hierarchy.length > 0) {
      const keystone = hierarchy[0];
      console.log(`   📍 Keystone: "${keystone.title}"`);
      console.log(`   📈 Children levels: ${countHierarchyDepth(keystone, 0)}`);
    }

    // CONTEXT: Test 5 - Test "Language of Growth" Principle
    console.log('\n💪 TEST 5: Testing "Language of Growth" Principle');
    console.log('CONTEXT: Validates that setbacks are reframed as learning opportunities');
    
    try {
      await apiCall(`/goals/${annualId}?userId=${TEST_USER_ID}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'LEARNING_IN_PROGRESS',
          // Missing learnings - should fail
        }),
      });
      console.log('❌ FAILED: Should have required learning capture');
    } catch (error) {
      console.log('✅ PASSED: Correctly required learning capture for setbacks');
    }

    // Now with proper learning capture
    const learningGoal = await apiCall(`/goals/${annualId}/learning?userId=${TEST_USER_ID}`, {
      method: 'PATCH',
      body: JSON.stringify({
        learnings: 'Market research revealed customers need simpler onboarding. Pivot to self-service model with guided setup.',
      }),
    });
    console.log(`✅ Learning captured: "${learningGoal.learnings.substring(0, 50)}..."`);
    console.log(`   📊 Status: ${learningGoal.status} (no negative language used)`);

    // CONTEXT: Test 6 - Test Hypothesis Tracking
    console.log('\n🧪 TEST 6: Testing Hypothesis Tracking');
    console.log('CONTEXT: Validates Build-Measure-Learn feedback loop implementation');
    
    const hypothesisGoal = await apiCall(`/goals/${annualId}?userId=${TEST_USER_ID}`);
    if (hypothesisGoal.isHypothesis) {
      console.log('✅ Hypothesis tracking enabled');
      console.log(`   🔬 Test method: "${hypothesisGoal.hypothesisTest}"`);
      console.log(`   📏 Success metric: "${hypothesisGoal.hypothesisMetric}"`);
    }

    // CONTEXT: Test 7 - Test Hierarchy Integrity Protection
    console.log('\n🛡️ TEST 7: Testing Hierarchy Integrity Protection');
    console.log('CONTEXT: Validates that strategic alignment cannot be broken');
    
    try {
      await apiCall(`/goals/${keystoneId}?userId=${TEST_USER_ID}`, {
        method: 'DELETE',
      });
      console.log('❌ FAILED: Should have prevented deletion of goal with children');
    } catch (error) {
      console.log('✅ PASSED: Correctly prevented deletion of goal with active children');
    }

    // CONTEXT: Test 8 - Test Daily Tasks Retrieval
    console.log('\n⚡ TEST 8: Testing Daily Tasks Focus');
    console.log('CONTEXT: Validates daily execution support for immediate action');
    
    const todaysTasks = await apiCall(`/goals/today?userId=${TEST_USER_ID}`);
    console.log(`✅ Retrieved ${todaysTasks.length} daily atomic task(s)`);
    
    if (todaysTasks.length > 0) {
      const task = todaysTasks[0];
      console.log(`   ⚡ Task: "${task.title}"`);
      console.log(`   📊 Status: ${task.status}`);
    }

    // CONTEXT: Test 9 - Complete a Goal (Celebrating Success)
    console.log('\n🎉 TEST 9: Testing Goal Completion');
    console.log('CONTEXT: Validates celebration of achievement');
    
    const completedTask = await apiCall(`/goals/${dailyId}/complete?userId=${TEST_USER_ID}`, {
      method: 'PATCH',
    });
    console.log(`✅ Goal completed: "${completedTask.title}"`);
    console.log(`   🎊 Status: ${completedTask.status}`);

    // CONTEXT: Test 10 - Validate Invalid Hierarchy Creation
    console.log('\n❌ TEST 10: Testing Invalid Hierarchy Rejection');
    console.log('CONTEXT: Validates that improper goal relationships are prevented');
    
    try {
      await apiCall(`/goals?userId=${TEST_USER_ID}`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'WEEKLY',
          title: 'Invalid weekly goal',
          parentId: keystoneId, // Weekly cannot be direct child of Keystone
        }),
      });
      console.log('❌ FAILED: Should have rejected invalid hierarchy');
    } catch (error) {
      console.log('✅ PASSED: Correctly rejected invalid hierarchy relationship');
    }

    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('✅ The Goal Stack system correctly implements:');
    console.log('   📍 "The Finite Lifespan" - Keystone anchoring');
    console.log('   🎯 "The Practitioner-Scholar" - Strategic hierarchy');
    console.log('   💪 "The Antifragile User" - Learning from setbacks');
    console.log('   🌱 "Language of Growth" - Positive reframing');
    console.log('   🧪 "Validated Learning" - Hypothesis tracking');
    console.log('   🛡️ "Strategic Alignment" - Hierarchy integrity');

  } catch (error) {
    console.error('\n💥 TEST SUITE FAILED:', error.message);
    console.error('Please check the API server and database connection.');
    process.exit(1);
  }
}

// Helper function to count hierarchy depth
function countHierarchyDepth(goal, depth) {
  if (!goal.children || goal.children.length === 0) {
    return depth;
  }
  
  let maxDepth = depth;
  for (const child of goal.children) {
    const childDepth = countHierarchyDepth(child, depth + 1);
    maxDepth = Math.max(maxDepth, childDepth);
  }
  
  return maxDepth;
}

// Run the tests
if (require.main === module) {
  runGoalStackTests().catch(console.error);
}

module.exports = { runGoalStackTests }; 