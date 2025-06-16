# Founder's Codex - Complete Architecture Overview & Documentation

## 🚀 **DEPLOYMENT STATUS: LIVE IN PRODUCTION**

**✅ Successfully Deployed on DigitalOcean App Platform**
- **Live API URL**: `https://founders-codex-25cux.ondigitalocean.app/api`
- **Health Check**: `https://founders-codex-25cux.ondigitalocean.app/api/health`
- **Database**: DigitalOcean Managed PostgreSQL (SSL-enabled)
- **Deployment Date**: June 16, 2025
- **Status**: All critical systems operational

---

## 🏗️ System Architecture

The Founder's Codex is a full-stack application built with modern technologies to operationalize principles from behavioral psychology and business strategy into a practical personal development system.

### Tech Stack Overview

```mermaid
graph TB
    subgraph "Frontend - React Native"
        A[Mobile App] --> B[React Native 0.76]
        B --> C[TypeScript]
        B --> D[React Native Vector Icons]
        B --> E[SafeAreaView]
    end
    
    subgraph "Backend - NestJS API"
        F[API Server] --> G[NestJS 11.x]
        G --> H[TypeORM]
        G --> I[PostgreSQL]
        G --> J[Firebase Auth]
    end
    
    subgraph "Infrastructure"
        K[Nx Workspace]
        L[Docker Support]
        M[Environment Config]
    end
    
    A --> F
    F --> I
```

---

## 📱 Frontend Architecture (React Native)

### Directory Structure
```
mobile/
├── src/
│   ├── app/                    # Main application setup
│   ├── components/             # Reusable UI components
│   │   ├── CreateHabitModal.tsx    # Atomic habit creation
│   │   └── HabitCard.tsx           # Individual habit display
│   ├── screens/                # Screen components
│   │   └── HabitsScreen.tsx        # Main habits interface
│   ├── services/               # API integration layer
│   │   └── habitService.ts         # Habit CRUD operations
│   └── assets/                 # Static resources
├── ios/                        # iOS specific files
├── android/                    # Android specific files
└── project.json               # Nx project configuration
```

### Key Components

#### 1. **HabitsScreen** (`src/screens/HabitsScreen.tsx`)
- **Purpose**: Main interface for "The 1% Better System"
- **Features**:
  - Displays all user habits with real-time stats
  - Implements "Celebrating Process" with completion animations
  - Shows progress summaries (streaks, completion rates)
  - Handles habit completion with visual feedback

#### 2. **CreateHabitModal** (`src/components/CreateHabitModal.tsx`)
- **Purpose**: Atomic habit creation interface
- **Features**:
  - Guided habit creation following James Clear's principles
  - Pre-built atomic habit suggestions
  - Habit stacking cue suggestions
  - Validation for "too small to fail" habits

#### 3. **HabitCard** (`src/components/HabitCard.tsx`)
- **Purpose**: Individual habit display with visual feedback
- **Features**:
  - Visual habit chains (30-day completion history)
  - Streak tracking with motivational colors
  - Completion rate statistics
  - "Don't break the chain" psychology

### State Management
- **Local State**: React hooks (`useState`, `useEffect`)
- **Data Flow**: Unidirectional from API services
- **Refresh Control**: Pull-to-refresh functionality
- **Error Handling**: User-friendly error messages

---

## 🔧 Backend Architecture (NestJS API)

### Directory Structure
```
api/
├── src/
│   ├── app/                    # Application module
│   ├── controllers/            # HTTP endpoint handlers
│   │   ├── goals.controller.ts     # Goal management endpoints
│   │   └── habits.controller.ts    # Habit management endpoints
│   ├── services/               # Business logic layer
│   │   ├── goals.service.ts        # Goal operations & validation
│   │   └── habits.service.ts       # Habit operations & metrics
│   ├── entities/               # Database models
│   │   ├── goal.entity.ts          # Goal hierarchy structure
│   │   ├── habit.entity.ts         # Habit definition
│   │   └── habit-completion.entity.ts # Completion tracking
│   ├── dto/                    # Data transfer objects
│   ├── modules/                # Feature modules
│   │   ├── goals.module.ts         # Goal Stack module
│   │   └── habits.module.ts        # Habit Engine module
│   └── guards/                 # Authentication & authorization
└── project.json               # Nx project configuration
```

### Core Modules

#### 1. **Habit Engine** (`modules/habits.module.ts`)
Implements "The 1% Better System" for atomic habit formation.

**Key Features**:
- Atomic habit creation with validation
- Daily completion tracking (prevents duplicates)
- Streak calculation algorithms
- Completion rate analytics
- Habit stacking cue management

**Database Schema**:
```sql
-- Habit Definition
CREATE TABLE habits (
    id UUID PRIMARY KEY,
    userId VARCHAR NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cue VARCHAR(200),              -- Habit stacking trigger
    creationDate TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Completion Tracking
CREATE TABLE habit_completions (
    id UUID PRIMARY KEY,
    habitId UUID REFERENCES habits(id) ON DELETE CASCADE,
    completionDate DATE NOT NULL,
    UNIQUE(habitId, completionDate)  -- Prevents gaming system
);
```

#### 2. **Goal Stack** (`modules/goals.module.ts`)
Implements "The Practitioner-Scholar" hierarchical goal system.

**Key Features**:
- Hierarchical goal structure enforcement
- Strategic alignment validation
- Hypothesis tracking for business experiments
- "Language of Growth" status management

**Database Schema**:
```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY,
    userId VARCHAR NOT NULL,
    type ENUM('KEYSTONE', 'ANNUAL', 'QUARTERLY', 'WEEKLY', 'DAILY_ATOMIC'),
    title VARCHAR NOT NULL,
    description TEXT,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE', 'LEARNING_IN_PROGRESS'),
    parentId UUID REFERENCES goals(id),  -- Self-referencing hierarchy
    isHypothesis BOOLEAN DEFAULT false,
    hypothesisTest TEXT,
    hypothesisMetric VARCHAR,
    learnings TEXT,
    targetDate DATE,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Business Logic Validation

#### Philosophical Principles Implementation

1. **"Language of Growth"**
   - No negative status terms (no "FAILED" status)
   - Uses "LEARNING_IN_PROGRESS" instead
   - Positive error messages and feedback

2. **"Celebrating Process"**
   - Completion tracking rewards the act of doing
   - Visual feedback for every completion
   - Streak celebrations at milestone levels

3. **"The Practitioner-Scholar"**
   - Enforces goal hierarchy (every goal serves higher purpose)
   - Prevents "orphan" goals without strategic alignment
   - Hypothesis tracking for validated learning

#### Hierarchy Validation Rules
```typescript
// Enforced parent-child relationships
const validHierarchy = {
  KEYSTONE: null,           // No parent (10-year vision)
  ANNUAL: KEYSTONE,         // Must serve keystone goal
  QUARTERLY: ANNUAL,        // Must serve annual objective
  WEEKLY: QUARTERLY,        // Must serve quarterly rock
  DAILY_ATOMIC: WEEKLY      // Must serve weekly sprint
};
```

---

## 🗄️ Database Design

### Entity Relationships

```mermaid
erDiagram
    GOALS {
        uuid id
        string userId
        enum type
        string title
        text description
        enum status
        uuid parentId
        boolean isHypothesis
        text hypothesisTest
        string hypothesisMetric
        text learnings
        date targetDate
        timestamp createdAt
        timestamp updatedAt
    }
    
    HABITS {
        uuid id
        string userId
        string title
        text description
        string cue
        timestamp creationDate
        timestamp updatedAt
    }
    
    HABIT_COMPLETIONS {
        uuid id
        uuid habitId
        date completionDate
    }
    
    GOALS ||--o{ GOALS : "parentId (self-referencing)"
    HABITS ||--o{ HABIT_COMPLETIONS : "habitId"
```

### Key Design Decisions

1. **Self-Referencing Goals**: Enables unlimited hierarchy depth
2. **Date-Only Completions**: Prevents gaming with multiple daily completions
3. **Cascade Deletion**: Habit completions auto-delete with habit
4. **Unique Constraints**: One completion per habit per day
5. **Status Enums**: Enforces "Language of Growth" principle

---

## 🔄 API Endpoints

### Habit Management
```
POST   /habits                 # Create atomic habit
GET    /habits                 # Get all user habits with metrics
POST   /habits/:id/complete    # Mark habit complete for today
GET    /habits/:id/completions # Get completion history
PUT    /habits/:id             # Update habit details
DELETE /habits/:id             # Remove habit
```

### Goal Management
```
POST   /goals                  # Create goal with hierarchy validation
GET    /goals                  # Get all user goals
GET    /goals/hierarchy        # Get hierarchical tree structure
GET    /goals/type/:type       # Get goals by type (KEYSTONE, ANNUAL, etc.)
PUT    /goals/:id              # Update goal
POST   /goals/:id/complete     # Mark goal complete
DELETE /goals/:id              # Remove goal (validates no active children)
```

---

## 🎨 UI/UX Design Principles

### Visual Design Language

1. **Progress Visualization**
   - Habit chains (30-day grid view)
   - Streak counters with color coding
   - Completion rate percentages
   - Visual hierarchy trees

2. **Feedback Mechanisms**
   - Completion animations
   - Celebratory overlays
   - Progress badges
   - Motivational messages

3. **Color Psychology**
   ```typescript
   const streakColors = {
     0: '#95a5a6',      // Neutral - ready to start
     1-6: '#f39c12',    // Orange - building momentum
     7-29: '#e67e22',   // Dark orange - habit forming
     30-99: '#27ae60',  // Green - strong habit
     100+: '#8e44ad'    // Purple - legendary dedication
   };
   ```

### Accessibility Features

- Clear typography hierarchy
- High contrast color schemes
- Touch target sizing (44px minimum)
- Screen reader compatible
- Reduced motion options

---

## 🔧 Development Workflow

### Nx Workspace Configuration

```json
{
  "version": 2,
  "projects": {
    "api": "api",
    "mobile": "mobile",
    "api-e2e": "api-e2e"
  },
  "defaultProject": "api"
}
```

### Build Commands
```bash
# Start API server
npm run start:api

# Start mobile development
npm run start:mobile

# Build all projects
nx run-many -t build

# Run tests
nx run-many -t test

# Lint code
nx run-many -t lint
```

### Environment Configuration
```bash
# API Environment Variables
DATABASE_URL=postgresql://user:pass@localhost:5432/founders_codex
NODE_ENV=development
PORT=3000

# Mobile Environment
API_BASE_URL=http://localhost:3000
```

---

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Service layer business logic
- **Integration Tests**: Database operations
- **E2E Tests**: Complete API workflows

### Frontend Testing
- **Component Tests**: Individual component behavior
- **Screen Tests**: User interaction flows
- **Service Tests**: API integration

### Philosophy Testing
```typescript
// Example: Testing "Language of Growth" principle
it('should use "Learning in Progress" instead of "Failed" status', () => {
  const goal = new Goal();
  goal.status = GoalStatus.LEARNING_IN_PROGRESS;
  expect(goal.status).not.toBe('FAILED');
  expect(goal.status).toBe('LEARNING_IN_PROGRESS');
});
```

---

## 🔐 Security & Authentication

### Current Implementation
- Firebase Authentication integration
- User ID isolation in all queries
- Input validation with class-validator
- SQL injection prevention via TypeORM

### Security Headers
```typescript
app.use(helmet()); // Security headers
app.enableCors({   // CORS configuration
  origin: process.env.FRONTEND_URL,
  credentials: true
});
```

---

## 🚀 Deployment Architecture

### Local Development Environment
```
Local Development:
├── PostgreSQL (localhost:5432)
├── NestJS API (localhost:3000)
└── React Native (Metro bundler)
```

### ✅ Production Environment (LIVE)
```
DigitalOcean App Platform:
├── Container Runtime: Ubuntu 22.04
├── Node.js: 22.14.0 
├── NestJS API: Auto-scaling containers
├── PostgreSQL: Managed Database with SSL
├── SSL Certificates: Automated management
└── Auto-deployment: Git-based CI/CD
```

### Production Infrastructure Details
- **Platform**: DigitalOcean App Platform
- **Runtime**: Node.js 22.14.0 with npm 10.9.2
- **Database**: DigitalOcean Managed PostgreSQL
- **SSL**: Automatic HTTPS with certificate management
- **Scaling**: Auto-scaling based on traffic
- **Monitoring**: Built-in application metrics
- **Deployment**: Automated from GitHub main branch

### Environment Variables (Production)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://[managed-db-connection]
DB_SSL_MODE=require
DB_CA_CERT=[ca-certificate-content]
PORT=8080
NODE_TLS_REJECT_UNAUTHORIZED=0  # For DigitalOcean SSL compatibility
PGSSLMODE=prefer
```