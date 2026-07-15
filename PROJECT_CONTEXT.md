# StudyMitra Project Context

## 1. PROJECT OVERVIEW
- App name: StudyMitra
- One-line description: Gamified study tracker with Pomodoro, XP, badges, and leaderboard
- Target users: Students who want to make studying more engaging and rewarding
- Core value proposition: Turn study sessions into a motivating game loop with progress, streaks, and achievements

## 2. TECH STACK
### Frontend
- React + Vite
- Tailwind CSS for styling
- React Router for navigation
- Recharts for charts/visualization
- React Icons for UI icons
- State management: plain React useState/useMemo; no Redux or Zustand

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Cookies used for auth transport

### Other libraries found
- bcryptjs
- cookie-parser
- cors
- dotenv
- jsonwebtoken
- nodemon (dev)

### Auth pattern
- JWT token stored in localStorage on the client for app state checks
- Backend also sets an HTTP-only cookie for authentication

## 3. PROJECT STRUCTURE
```text
root/
  backend/
    src/
      app.js
      server.js
      config/
        db.js
      controllers/
        authController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      models/
        User.js
      routes/
        authRoutes.js
      utils/
        generateToken.js

  frontend/
    src/
      App.jsx
      main.jsx
      index.css
      assets/
      components/
        common/
          Footer.jsx
          Navbar.jsx
        landing/
          FeaturesSection.jsx
          HeroSection.jsx
          HowItWorksSection.jsx
      pages/
        DashboardPage.jsx
        LandingPage.jsx
        LoginPage.jsx
        RegisterPage.jsx
      utils/
        authApi.js
```

## 4. DESIGN SYSTEM
- Theme: Dark mode only
- Primary colors: Purple (#7c3aed / similar) with blue accents (#06b6d4)
- Background: Deep dark navy/black (#0f0f1a)
- Card style: Rounded corners, subtle borders, dark panels, subtle gradients
- Font: Inter (fallback to system UI)
- Component style: Card-based layouts, gradient CTAs, icon + text patterns, soft shadows
- Reusable UI elements already present:
  - Navbar
  - Footer
  - Landing page hero section
  - Feature cards
  - Auth form card panels
  - Dashboard starter cards

## 5. CORE FEATURES
- Pomodoro Timer: 25/5/15 default structure, customizable timings, subject-linked in future plans
- Tasks: Add, complete, delete; simple list; tied to subjects conceptually
- Subjects: CRUD-style subject management with color and icon
- XP & Leveling: Progress-based leveling system
- Streak System: Daily consistency tracking
- Badges & Achievements: Around 25 badges across 5 categories
- Leaderboard: Total XP-based ranking, refreshed on page load/refresh
- Profile Page: Preset avatars
- Settings: Pomodoro duration customization only

## 6. GAMIFICATION RULES
### XP Values
- 1 Pomodoro (25 min) = +250 XP
- 1 completed task = +100 XP
- First study session of the day = +50 XP bonus

### Level Thresholds
- Level 1: 0 XP (Beginner)
- Level 2: 500 XP (Novice)
- Level 3: 1,200 XP (Apprentice)
- Level 4: 2,000 XP (Student)
- Level 5: 3,000 XP (Learner)
- Level 6: 4,200 XP (Scholar)
- Level 7: 5,600 XP (Intellectual)
- Level 8: 7,200 XP (Thinker)
- Level 9: 9,000 XP (Expert)
- Level 10: 11,000 XP (Master)
- Higher levels continue exponentially toward Grandmaster at Level 20

### Streak Rules
- Complete at least one Pomodoro per day to maintain streak
- Missing a day resets streak to 0
- Track both currentStreak and longestStreak

### Badge Categories
- Streak: 3, 7, 30, 100 days
- Sessions: 1, 10, 50, 100
- Study Time: 1h, 10h, 50h, 100h
- Tasks: 1, 25, 100
- Special: Night Owl, Early Bird, Marathon, XP Collector

## 7. DATABASE SCHEMA
### User
- username or name (current code uses name)
- email
- password (hashed)
- avatar
- totalXP
- level
- currentStreak
- longestStreak
- lastStudyDate
- settings
- createdAt

### Subject
- userId
- name
- color
- icon
- createdAt

### Task
- userId
- subjectId
- title
- status
- xpReward
- completedAt
- createdAt

### StudySession
- userId
- subjectId
- taskId (optional)
- duration
- xpEarned
- completedAt

### Badge
- name
- description
- icon
- category
- condition

### UserBadge
- userId
- badgeId
- unlockedAt

## 8. API ROUTES
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/health | Server health check | No |
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/logout | Logout user | No |
| GET | /api/auth/me | Get current authenticated user | Yes |

## 9. FRONTEND ROUTES
### Implemented
- / → Landing page
- /login → Login page
- /register → Register page
- /dashboard → Protected dashboard starter page

### Planned / intended
- /timer → Pomodoro timer page
- /tasks → Tasks page
- /subjects → Subjects page
- /achievements → Badges page
- /leaderboard → Leaderboard page
- /profile → Profile page
- /settings → Settings page

## 10. CODING CONVENTIONS
- Component naming: PascalCase
- File organization: one component per file
- API calls: fetch-based helper layer in frontend auth utilities; no axios currently
- Error handling: try/catch with inline user-facing error messages
- Comments: sparse, mostly descriptive and functional
- Custom hooks: none currently; app is still in a simple starter phase

## 11. CURRENT PROGRESS
- ✅ Landing page complete
- ✅ Authentication (register/login) working
- ✅ Basic dashboard skeleton in place
- ⏳ Core gamified features and remaining pages still to be built

## 12. KNOWN CONSTRAINTS / DECISIONS
- No real-time features; leaderboard updates on refresh
- No friends/social features
- Web app only; responsive UI is desired but not a full mobile app
- Tasks do not have due dates
- Profile avatars are preset only
- Dark theme only; no light-mode toggle


