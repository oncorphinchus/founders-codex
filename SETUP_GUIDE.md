# 🚀 The Founder's Codex - Setup Guide

## Overview

This guide will help you set up and test "The Founder's Codex: Lifetime Calendar" application for the first time. The application implements a systematic approach to founder development through the Goal Stack and Habit Engine systems.

## Issues Identified and Resolved

### ✅ Issues Fixed
1. **Missing npm scripts** - Added essential scripts to package.json
2. **Webpack configuration issues** - Fixed API build configuration  
3. **Jest type errors** - Added proper TypeScript configuration for tests
4. **Mobile project configuration** - Added React Native targets
5. **Missing configuration files** - Created Jest configs and Babel setup

### ⚠️ Remaining Requirements
1. **PostgreSQL Database** - Required for API to function
2. **Test file compilation** - Jest types need to be resolved for test runs

## Prerequisites

### Required Software
- **Node.js** (v18+ recommended, currently using v23.7.0)
- **PostgreSQL** (v14+ recommended)
- **npm** (included with Node.js)

### For Mobile Development (Optional)
- **React Native CLI**
- **iOS Development**: Xcode (macOS only)
- **Android Development**: Android Studio

## Setup Instructions

### 1. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# macOS with Homebrew:
brew install postgresql
brew services start postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create the database
createdb founders_codex

# Optional: Create a dedicated user
psql -c "CREATE USER founders_user WITH PASSWORD 'secure_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE founders_codex TO founders_user;"
```

### 2. Environment Configuration

Create a `.env` file in the `founders-codex` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=founders_codex

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 3. Install Dependencies

```bash
cd founders-codex
npm install
```

### 4. Start the Application

```bash
# Start the API server
npm run start:api

# In a separate terminal, for mobile development:
npm run start:mobile
```

### 5. Verify Installation

```bash
# Run the comprehensive test suite
node setup-and-test.js

# Or test individual components:
node test-goal-stack.js
node test-habit-engine.js
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:api` | Start the NestJS API server |
| `npm run build:api` | Build the API for production |
| `npm run start:mobile` | Start React Native development server |
| `npm run build:mobile` | Build mobile app |
| `npm test` | Run test suite |
| `npm run lint` | Run code linting |

## API Endpoints

### Goal Stack API
- `POST /api/goals` - Create a new goal
- `GET /api/goals` - Get user's goals
- `GET /api/goals/hierarchy` - Get hierarchical goal structure
- `PATCH /api/goals/:id/learning` - Update goal to learning status
- `DELETE /api/goals/:id` - Delete a goal

### Habit Engine API  
- `POST /api/habits` - Create a new habit
- `GET /api/habits` - Get user's habits
- `GET /api/habits/:id` - Get specific habit with metrics
- `POST /api/habits/:id/complete` - Mark habit as completed
- `PATCH /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

## Testing

The application includes comprehensive testing to validate both technical functionality and philosophical principles:

### Automated Testing
```bash
# Run the full test suite
node setup-and-test.js

# Individual test files
node test-goal-stack.js    # Tests Vision-to-Action Funnel
node test-habit-engine.js  # Tests 1% Better System
```

### Manual Testing Checklist

#### Goal Stack Validation
- [ ] Can create Keystone goals (vision anchors)
- [ ] Hierarchical relationships enforced (Annual → Quarterly → Weekly → Daily)
- [ ] Hypothesis tracking works for business goals
- [ ] "Learning in Progress" status properly applied
- [ ] Goal hierarchy retrieval displays parent-child relationships

#### Habit Engine Validation
- [ ] Atomic habits can be created
- [ ] Habit stacking cues are preserved
- [ ] Completion tracking works
- [ ] Duplicate completions are prevented
- [ ] Streak calculations are accurate
- [ ] User isolation is enforced

#### Philosophical Principles
- [ ] "Language of Growth" - No negative status terms
- [ ] "Celebrating Process" - Completion feedback is satisfying
- [ ] "Antifragile User" - Setbacks become learning opportunities
- [ ] "Coach in the Code" - Proactive guidance works

## Architecture Overview

```
founders-codex/
├── api/                     # NestJS Backend
│   ├── src/
│   │   ├── entities/       # Database entities
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # API endpoints
│   │   └── modules/        # Feature modules
├── mobile/                  # React Native Frontend
│   └── src/
│       ├── components/     # UI components
│       ├── screens/        # App screens
│       └── services/       # API integration
└── dist/                   # Build output
```

## Troubleshooting

### API Server Won't Start
1. **Database Connection Error**: Ensure PostgreSQL is running and accessible
2. **Port Already in Use**: Change PORT in .env or stop conflicting process
3. **Missing Dependencies**: Run `npm install`

### Build Errors
1. **TypeScript Errors**: Check tsconfig.json configurations
2. **Webpack Issues**: Verify webpack.config.js settings
3. **Jest Type Errors**: Ensure @types/jest is installed

### Mobile Development
1. **React Native Setup**: Follow official React Native environment setup
2. **iOS Issues**: Ensure Xcode and iOS Simulator are properly configured
3. **Android Issues**: Verify Android Studio and SDK setup

## Next Steps

Once setup is complete:

1. **Database Initialization**: The app uses TypeORM synchronization in development
2. **Authentication**: Implement Firebase Authentication integration
3. **Mobile Testing**: Test on iOS/Android simulators or devices
4. **Production Deployment**: Configure environment for staging/production

## Support

For technical issues:
1. Check the logs in the terminal
2. Verify database connectivity
3. Ensure all dependencies are installed
4. Review the error messages in the test scripts

The application is designed with comprehensive error handling and detailed logging to help identify and resolve issues quickly.

---

**The Founder's Codex** - Transforming entrepreneurial vision into systematic action through the power of philosophical principles and modern technology. 