
# Mend - Financial Accountability App

Mend is a React Native mobile application designed to help students build mindful money habits with AI-powered insights and an empathetic mascot coach named "Mendi."

## Features

### Core Functionality
- **Authentication**: Secure login and signup system
- **Onboarding Flow**: Budget setup, category selection, and transparency mode preference
- **Dashboard**: Main view with mascot Mendi displaying current status and insights
- **Transaction Management**: Manual entry and tracking of expenses
- **Budget Tracking**: Visual progress indicators with period-based tracking (semester/monthly/weekly)
- **Category System**: Preset categories (Food, Rides, Fun, etc.) + custom categories
- **AI Insights**: Rule-based pattern detection providing behavioral, predictive, and habit insights
- **Mascot Emotional States**: Mendi reacts to user behavior (happy, neutral, concerned, worried, proud, excited)
- **Transparency Modes**: Three modes that transform the UI and feedback style
  - **Full**: Precise data and detailed insights
  - **Soft**: Trends with encouraging language
  - **Hidden**: Focus on habits, minimal numbers
- **Proactive Nudges**: Push notifications for spending alerts and check-ins
- **Settings**: Customize preferences, transparency mode, and budget settings

### Technical Features
- **Local-First Architecture**: SQLite database with secure storage
- **E2EE Cloud Sync**: Optional encrypted backup (architecture ready)
- **Cross-Platform**: iOS and Android compatible
- **Liquid-Glass UI**: Futuristic design with frosted glass cards and mint+lilac gradients
- **Smooth Animations**: Fade, pulse, and glide effects throughout

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: Expo SQLite
- **Secure Storage**: Expo Secure Store
- **Notifications**: Expo Notifications
- **UI Components**: Custom glass-morphism design
- **Animations**: React Native Animated API

## Project Structure

```
Mend/
├── assets/
│   └── mendi-logo.png
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GradientBackground.tsx
│   │   ├── MascotBubble.tsx
│   │   ├── ProgressBar.tsx
│   │   └── TransactionItem.tsx
│   ├── constants/
│   │   ├── categories.ts
│   │   └── theme.ts
│   ├── screens/
│   │   ├── AddTransactionScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── InsightsScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── TransactionsScreen.tsx
│   ├── services/
│   │   ├── aiEngine.ts
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── notifications.ts
│   └── types/
│       └── index.ts
├── App.tsx
├── app.json
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   cd /home/ubuntu/code_artifacts/Mend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   # iOS (requires macOS)
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## AI Insights Engine

Mend's AI engine analyzes transaction patterns and generates personalized insights:

### Insight Types
1. **Behavioral Patterns**: Day-of-week spending, recurring merchants, habit detection
2. **Predictive Budget**: Forecast spending trends and budget alerts
3. **Micro-Habit Triggers**: Emotional and situational spending patterns
4. **Progress Tracking**: Consistency streaks and improvement metrics
5. **Educational**: Redundancy detection, fee alerts, financial literacy tips

### Transparency Mode Framing
All insights are dynamically framed based on the user's selected transparency mode:
- **Full**: "You spent $132 on takeout this month, down 18% from last."
- **Soft**: "Your food spending is easing — you're finding balance again."
- **Hidden**: "Your routines are stabilizing — that's what matters most right now."

## Mascot System

Mendi's emotional state changes based on spending behavior:
- **Happy**: Under 50% budget usage
- **Neutral**: 50-75% budget usage
- **Concerned**: 75-90% budget usage
- **Worried**: 90%+ budget usage

Each emotion comes with contextual messages to encourage mindful spending.

## Database Schema

### Users
- id, email, name, created_at
- budget_period, transparency_mode, budget_amount
- semester_start_date, semester_end_date
- enable_notifications, enable_cloud_sync

### Categories
- id, name, icon, color, budget, is_custom

### Transactions
- id, amount, merchant, category_id
- date, time, note, is_recurring

### AI Insights
- id, type, title, message, emotion
- timestamp, priority, actionable

## Future Enhancements

- Plaid integration for automatic transaction tracking
- Multi-device sync with E2EE
- Buddy accountability features
- Advanced AI with machine learning models
- Biometric authentication
- Export and reporting features

## Design Philosophy

Mend focuses on **accountability without anxiety**:
- Calm, intelligent, and human interface
- Liquid-glass aesthetic for modern feel
- Smooth animations for delightful UX
- Empathetic language over judgemental tones
- Progressive disclosure of information
- Mindful color coding (green = calm, amber = caution, rose = refocus)

## License

MIT License

## Version

1.0.0

---

Built with ❤️ for students learning mindful money management
