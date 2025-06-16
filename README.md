# 🚀 The Founder's Codex: Lifetime Calendar - LIVE IN PRODUCTION

## ✅ **BACKEND SUCCESSFULLY DEPLOYED**

**Live API**: [https://founders-codex-25cux.ondigitalocean.app/api](https://founders-codex-25cux.ondigitalocean.app/api)  
**Health Check**: [https://founders-codex-25cux.ondigitalocean.app/api/health](https://founders-codex-25cux.ondigitalocean.app/api/health)

A life-planning and execution system designed for ambitious entrepreneurs, built on the philosophy of finite time awareness and strategic goal anchoring. Currently deployed as a production-ready API with mobile app in development.

### 🎯 Core Mission

Transform your relationship with time by visualizing your entire life as 4,680 weeks (90 years), creating positive pressure to focus on what truly matters while anchoring your most important goals to specific future weeks.

### 🏗️ Architecture

This is a monorepo built with Nx containing:

- **API** (NestJS): Backend service with PostgreSQL database
- **Mobile** (React Native): Cross-platform mobile application

### 📱 MVP Features

#### The 90-Year View (Memento Mori Dashboard)
- Visual grid of 4,680 weeks representing a potential 90-year lifespan
- Past weeks automatically greyed out (irreversible "sunk time")
- Current week highlighted in orange
- Future weeks available for goal anchoring

#### Manual Keystone Marking
- Simple text labels for major life goals
- Anchor important achievements to specific future weeks
- Visual representation of long-term vision

#### Onboarding Flow
- Two-step philosophical introduction
- Birth date input for life grid calculation
- Powerful first-time user experience emphasizing finite time

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for API)
- React Native development environment
- iOS Simulator or Android Emulator

#### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd founders-codex
npm install
```

2. **Set up the database:**
```bash
# Create PostgreSQL database
createdb founders_codex

# The API will auto-sync tables on first run
```

3. **Configure environment variables:**
```bash
# Copy example env file
cp api/.env.example api/.env

# Update with your database credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=founders_codex
```

4. **Install mobile dependencies:**
```bash
cd mobile
npm install
```

5. **For iOS (macOS only):**
```bash
cd ios
pod install
cd ..
```

#### Running the Applications

**Start the API:**
```bash
nx serve api
# API will be available at http://localhost:3000
```

**Start the Mobile App:**

For iOS:
```bash
nx run mobile:run-ios
```

For Android:
```bash
nx run mobile:run-android
```

For Web (development):
```bash
nx serve mobile
```

### 🧠 Philosophical Foundation

#### The Finite Lifespan: The Memento Mori Engine
The core organizing principle is the visceral, visual representation of a finite 90-year lifespan. This creates what Oliver Burkeman terms "positive pressure" - shifting focus from the impossible goal of "getting everything done" to the essential task of doing what truly matters.

#### The Practitioner-Scholar
Designed for founders who understand that building a company is an applied intellectual pursuit, bridging the gap between learning and doing through structured frameworks and feedback loops.

#### The Antifragile User
Built to help users navigate "The Struggle" (Ben Horowitz) and emerge stronger, systematically reframing setbacks as features that trigger growth subroutines.

#### Integrated Well-Being
Extraordinary achievement cannot be sustained at the cost of well-being. The system ensures professional goals are integrated with, not opposed to, holistic flourishing.

### 🎨 Design Principles

#### Language of Growth
- No judgmental or negative language in UI
- "Overdue" becomes "Awaiting Action"
- "Failed" becomes "Learning in Progress"
- Reinforces growth mindset through every interaction

#### From Vision to Action
- Seamless navigation between macro (90-year) and micro (daily) perspectives
- Visual reinforcement of the connection between long-term purpose and immediate execution

#### The Coach in the Code
- Proactive guidance and intelligent interventions
- Built-in wisdom from foundational frameworks
- Helps users apply principles in real-time

### 📂 Project Structure

```
founders-codex/
├── api/                          # NestJS Backend
│   ├── src/
│   │   ├── entities/            # Database entities
│   │   │   ├── user.entity.ts
│   │   │   └── keystone-goal.entity.ts
│   │   ├── dto/                 # Data transfer objects
│   │   ├── services/            # Business logic
│   │   ├── controllers/         # HTTP endpoints
│   │   └── guards/              # Authentication
│   └── project.json
├── mobile/                       # React Native App
│   ├── src/
│   │   ├── app/                 # Main application
│   │   ├── components/          # Reusable components
│   │   │   └── LifeGrid.tsx     # Core 90-year visualization
│   │   ├── screens/             # Screen components
│   │   │   └── OnboardingScreen.tsx
│   │   └── assets/              # Images, fonts, etc.
│   └── project.json
├── nx.json                       # Nx workspace configuration
├── package.json                  # Root dependencies
└── README.md
```

### 🔧 Development Commands

**Build all projects:**
```bash
nx run-many -t build
```

**Test all projects:**
```bash
nx run-many -t test
```

**Lint all projects:**
```bash
nx run-many -t lint
```

**View project graph:**
```bash
nx graph
```

### 🌟 Key Components

#### LifeGrid Component
The heart of the MVP - displays 4,680 touchable squares representing weeks, with:
- Dynamic calculation of past/present/future weeks
- Visual distinction through color coding
- Keystone goal markers
- Touch interactions for goal setting

#### OnboardingScreen Component
Two-step philosophical introduction:
1. Welcome and philosophy explanation
2. Birth date input with real-time life statistics

#### User Entity
Core database model with:
- Firebase authentication integration
- Birth date for life grid calculations
- Helper methods for week calculations

#### KeystoneGoal Entity
Simple goal anchoring with:
- Week-based targeting
- Text labels and descriptions
- Completion tracking

### 📱 MVP User Journey

1. **First Launch**: Philosophical introduction to finite time awareness
2. **Birth Date Input**: Calculate personal life grid with dramatic "greying out" moment
3. **Life Grid Exploration**: Visual confrontation with remaining weeks
4. **Goal Anchoring**: Set major life goals to specific future weeks
5. **Daily Return**: Regular exposure to finite time reminder

### 🔮 Future Phases

#### Phase 2: "The Integrated System"
- Full Goal Stack (10-year → Annual → Quarterly → Weekly → Daily)
- Habit Engine with atomic habits tracking
- Resilience Toolkit with Stoic practices
- Learning Ledger for systematic wisdom capture
- Well-Being Monitor with PERMA tracking

#### Phase 3: "The Ecosystem & AI Coach"
- AI-driven personalized insights
- Privacy-first mastermind groups
- Health and productivity integrations

### 🛡️ Security & Privacy

- Firebase Authentication for secure user management
- Minimal data collection (only birth date required)
- Local storage for MVP goal data
- PostgreSQL with proper encryption for production

### 🤝 Contributing

This is a philosophical software project. Every feature must:
1. Be justifiable by referencing core principles
2. Include `// CONTEXT:` comments linking to philosophical origins
3. Follow the "Language of Growth" UX principles
4. Serve the mission of finite time awareness

### 📞 Support

For issues related to:
- **Technical Setup**: Check the troubleshooting section below
- **Philosophy**: Reference the source documents for context
- **Feature Requests**: Must align with core mission and principles

### 🔧 Troubleshooting

**Metro bundler issues:**
```bash
cd mobile
npx react-native start --reset-cache
```

**iOS build issues:**
```bash
cd mobile/ios
pod install --repo-update
```

**Database connection issues:**
- Verify PostgreSQL is running
- Check environment variables in `api/.env`
- Ensure database exists and user has proper permissions

### 📚 References

- Oliver Burkeman - "Four Thousand Weeks"
- Gary Keller - "The ONE Thing"
- Eric Ries - "The Lean Startup"
- Martin Seligman - PERMA Model
- Stoic Philosophy - Marcus Aurelius, Seneca
- Carol Dweck - "Growth Mindset"

---

*"Four thousand weeks is absurdly, outrageously, terrifyingly short... But that isn't a reason for despair. It's a cause for relief."* - Oliver Burkeman

**Built with philosophical intention. Every line of code serves the mission of helping founders make their finite time count.**
