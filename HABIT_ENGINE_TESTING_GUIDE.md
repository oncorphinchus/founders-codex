# Habit Engine Testing Guide
## Complete Validation Instructions for "The 1% Better System"

### Quick Start Testing

1. **Start the API Server**:
   ```bash
   cd founders-codex/api
   npm install
   npm run start:dev
   ```

2. **Run Integration Tests**:
   ```bash
   cd founders-codex
   node test-habit-engine.js
   ```

3. **Run Unit Tests**:
   ```bash
   cd founders-codex/api
   npm test habits.service.spec.ts
   ```

---

## What You'll See When Tests Pass

### Integration Test Output
```
🚀 Starting Habit Engine Integration Tests
Testing "The 1% Better System" implementation

============================================================
  Testing API Connectivity
============================================================
✅ API server is responding

============================================================
  Testing Habit Creation - Atomic Habits Principle
============================================================
✅ ✓ Created atomic habit: "Read one page"
✅ ✓ Created atomic habit: "Do one push-up"
✅ ✓ Created atomic habit: "Write 50 words"
✅ ✓ Created atomic habit: "Meditate for 1 minute"

📊 Created 4 atomic habits successfully

============================================================
  Testing Habit Completion - "Make it Satisfying" Principle
============================================================
✅ ✓ Completed habit: "Read one page" (Streak: 1)
✅ ✓ Completed habit: "Do one push-up" (Streak: 1)
✅ ✓ Completed habit: "Write 50 words" (Streak: 1)
✅ ✓ Completed habit: "Meditate for 1 minute" (Streak: 1)

🎯 Completed 4 habits successfully

============================================================
  Testing Duplicate Completion Prevention
============================================================
✅ ✓ Duplicate completion properly prevented

============================================================
  Testing Habit Retrieval and Metrics
============================================================
✅ ✓ Retrieved 4 habits
✅ ✓ Metrics valid for: "Read one page"
✅ ✓ Metrics valid for: "Do one push-up"
✅ ✓ Metrics valid for: "Write 50 words"
✅ ✓ Metrics valid for: "Meditate for 1 minute"

============================================================
  Testing Completion History - Visual Habit Chains Support
============================================================
✅ ✓ Retrieved 1 completion records

============================================================
  Testing Philosophical Principles Implementation
============================================================
✅ ✓ All habits follow atomic habit sizing principle
✅ ✓ 4 habits implement habit stacking
✅ ✓ All habits support visual habit chains
✅ ✓ 4 habits completed today - process celebration possible

============================================================
  Test Results Summary
============================================================
✅ All tests passed successfully!

🎯 The Habit Engine successfully implements:
   • Atomic Habits principle (tiny, consistent actions)
   • Habit Stacking (cue-routine-reward loops)
   • Visual Habit Chains (streak tracking)
   • "Make it satisfying" feedback loops
   • "Celebrating Process" over outcomes

🏆 "The 1% Better System" is ready for user engagement!
```

---

## Manual Testing Checklist

### Backend API Testing

1. **Create a Habit**:
   ```bash
   curl -X POST http://localhost:3000/habits \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Read one page",
       "description": "Daily reading habit",
       "cue": "After my morning coffee"
     }'
   ```

2. **Get All Habits**:
   ```bash
   curl http://localhost:3000/habits
   ```

3. **Complete a Habit**:
   ```bash
   curl -X POST http://localhost:3000/habits/{HABIT_ID}/complete \
     -H "Content-Type: application/json"
   ```

4. **Test Duplicate Prevention**:
   ```bash
   # Run the same completion request twice - second should fail
   curl -X POST http://localhost:3000/habits/{HABIT_ID}/complete \
     -H "Content-Type: application/json"
   ```

### Frontend Testing (React Native)

1. **Start Metro Bundler**:
   ```bash
   cd founders-codex/mobile
   npx expo start
   ```

2. **Test HabitsScreen Features**:
   - [ ] Create new habit modal opens
   - [ ] Atomic habit suggestions work
   - [ ] Habit stacking cues save correctly
   - [ ] Habit cards display properly
   - [ ] Completion button works
   - [ ] Celebration animation triggers
   - [ ] Streak counters update
   - [ ] Visual habit chains show

3. **Test Edge Cases**:
   - [ ] Empty state shows encouragement
   - [ ] Duplicate completion shows positive message
   - [ ] Network errors handled gracefully
   - [ ] Pull-to-refresh works

---

## Database Verification

### Check Tables Created
```sql
-- Connect to PostgreSQL
psql -d founders_codex

-- Verify tables exist
\dt

-- Should show:
-- habits
-- habit_completions
-- goals (from previous implementation)
```

### Sample Data Queries
```sql
-- View all habits
SELECT id, title, cue, "creationDate" FROM habits;

-- View completions with streaks
SELECT 
  h.title,
  COUNT(hc.id) as total_completions,
  MAX(hc."completionDate") as last_completion
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc."habitId"
GROUP BY h.id, h.title;
```

---

## Performance Testing

### Load Testing Script
```javascript
// test-habit-load.js
const NUM_HABITS = 100;
const NUM_COMPLETIONS = 30;

async function loadTest() {
  console.log('Creating habits...');
  const habits = [];
  
  for (let i = 0; i < NUM_HABITS; i++) {
    const habit = await createHabit({
      title: `Test habit ${i}`,
      cue: `After action ${i}`,
    });
    habits.push(habit);
  }
  
  console.log('Creating completions...');
  for (const habit of habits) {
    for (let day = 0; day < NUM_COMPLETIONS; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      await completeHabit(habit.id, date.toISOString().split('T')[0]);
    }
  }
  
  console.log('Testing retrieval performance...');
  const start = Date.now();
  const allHabits = await getHabits();
  const end = Date.now();
  
  console.log(`Retrieved ${allHabits.length} habits in ${end - start}ms`);
}
```

---

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**:
   ```bash
   cd founders-codex/api
   npm install
   
   cd ../mobile
   npm install
   ```

2. **Database connection fails**:
   - Ensure PostgreSQL is running
   - Check connection string in `.env`
   - Verify database exists

3. **Tests fail with authentication errors**:
   - Current implementation uses placeholder userId
   - For production, integrate with authentication system

4. **Frontend icons not showing**:
   - Install Expo vector icons: `npx expo install @expo/vector-icons`

### Debug Mode

Enable detailed logging:
```typescript
// In habits.service.ts, add debug logs
console.log('Creating habit:', createHabitDto);
console.log('Calculated streak:', currentStreak);
```

---

## Success Criteria

### ✅ Implementation Complete When:

1. **All Integration Tests Pass**: `node test-habit-engine.js` shows all green
2. **Unit Tests Pass**: Jest tests validate business logic
3. **Manual API Testing**: All endpoints respond correctly
4. **Frontend Functions**: React Native app creates/completes habits
5. **Database Integrity**: Proper relationships and constraints
6. **Performance Acceptable**: Sub-100ms habit retrieval
7. **Philosophical Principles**: Atomic habits, stacking, chains all work

### 🎯 Ready for Production When:

- [ ] User authentication integrated
- [ ] Error handling comprehensive
- [ ] Performance optimized for scale
- [ ] Real completion data in visual chains
- [ ] Offline support implemented
- [ ] Integration with Goal Stack complete

---

## Next Steps

After validating this implementation:

1. **Phase 2.3**: Implement The Resilience Toolkit (Stoic practices)
2. **Phase 2.4**: Build The Learning Ledger (metacognition tools)
3. **Phase 2.5**: Create The Well-Being Monitor (PERMA tracking)
4. **Integration**: Connect all systems for holistic founder support

The Habit Engine provides the foundational automation layer that powers consistent daily execution - the engine that drives progress up the Goal Stack through small, compound improvements. 