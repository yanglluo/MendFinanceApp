# Mend

**A budgeting prototype that makes spending feedback easier to face.**

Mend is a React Native app for students to record expenses, track a budget, and understand spending patterns. Its central product idea is adjustable transparency: the same information can appear as precise numbers, gentler trends, or habit-focused feedback.

**Built by [Yang Luo](https://github.com/yanglluo)** · [Portfolio](https://povhiringyang.vercel.app/)

## The experience

1. Enter the prototype's sign-up/login flow and set a budget and feedback preference.
2. Add an expense with a merchant, category, amount, and date.
3. Review spending and budget progress on the dashboard.
4. Explore rules-based insights and Mendi, the mascot whose messages respond to budget usage.
5. Switch between **Full**, **Soft**, and **Hidden** feedback in settings.

Mend is a mobile product prototype with local persistence. Authentication is mocked; use synthetic accounts and expense data when exploring it.

## Engineering highlights

| Area | Implementation | Product/engineering tradeoff |
| --- | --- | --- |
| Local data | Expo SQLite stores users, categories, transactions, and insights behind a database service | Supports local persistence without requiring a hosted backend; multi-user isolation and cloud sync remain future work |
| Feedback modes | A shared insight engine frames messages for Full, Soft, and Hidden modes | Changes how feedback is presented without requiring separate analysis pipelines |
| Spending insights | Deterministic rules for merchant frequency, spending days, budget projections, and habit patterns | Inspectable logic with no external model/API requirement; forecasts are simplified heuristics |
| Navigation | React Navigation stack for account/onboarding flows and tabs for Home, Transactions, Categories, and Insights | Keeps the everyday loop separate from setup and secondary screens |
| UI and reminders | Reusable cards, budget progress, mascot feedback, and Expo notification helpers | Connects visual feedback to spending state; notification behavior depends on device permissions |

## Architecture

```text
Screens → database service → local SQLite records
Transactions + budget + feedback mode → insight engine → insights and mascot feedback
Dashboard/settings → notification service → device notification scheduling
Prototype account flow → SecureStore → local mock session
```

### Start with these files

- [App.tsx](App.tsx): initialization, authentication/onboarding state, and navigation composition.
- [Database service](src/services/database.ts): schema creation, SQL operations, and row-to-domain mapping.
- [Insight engine](src/services/aiEngine.ts): rules, forecasts, feedback framing, and mascot state. Despite the filename, this is not an LLM integration.
- [Dashboard](src/screens/DashboardScreen.tsx): combines transactions, budget progress, insights, and reminders.
- [Settings](src/screens/SettingsScreen.tsx): feedback preferences and notification controls.
- [Auth service](src/services/auth.ts): clearly scoped mock login and local session storage.
- [UI components](src/components) and [theme](src/constants/theme.ts): shared visual building blocks.

## Stack

Expo SDK 54 · React Native 0.81 · React 19.1 · TypeScript · React Navigation 7 · Expo SQLite · Expo SecureStore · Expo Notifications

## Run locally

Use a Node.js version compatible with Expo SDK 54; its [release notes](https://expo.dev/changelog/sdk-54) specify a minimum of `20.19.4`. Use an SDK 54-compatible Expo client or development build, plus an iOS Simulator or Android emulator/device.

```bash
git clone https://github.com/yanglluo/MendFinanceApp.git
cd MendFinanceApp
npm install
npm start
```

Platform scripts:

```bash
npm run ios       # Expo on iOS Simulator; requires macOS and Xcode
npm run android   # Expo on an Android emulator/device
```

`App.tsx` imports `expo-font` and `@expo/vector-icons`, but the current package manifest does not declare them directly. If dependency resolution reports either missing package, add SDK-compatible versions in your local checkout:

```bash
npx expo install expo-font @expo/vector-icons
```

No bank credentials, cloud account, or external model API key is required for the current mock/local flow. The repository also exposes `npm run web`, but its native storage dependencies mean browser support should be evaluated separately.

## Current scope and next steps

- **Implemented in source:** manual expense entry, local database services, budget views, feedback modes, rules-based insights, and notification scheduling helpers.
- **Prototype boundaries:** login does not validate credentials against a backend. SecureStore holds the mock session; this does not establish encryption of the SQLite expense database. The cloud-sync preference is a UI/state placeholder, not a working encrypted backup service.
- **Next engineering work:** real authentication and account-scoped data, accurate budget-period calculations, tested backup/sync, and device-level accessibility and notification checks. The budget forecast currently uses a simplified 30-day model.

## Validation

The package currently defines start/platform scripts but no automated test or lint script. To review the core loop, use synthetic data to create an account, finish onboarding, add an expense, restart the app, and compare the three feedback modes. Check notification permission denial as well as permission approval.

Automated coverage for database mapping, budget calculations, and insight framing is a useful next step. iOS/Android runtime behavior and store release readiness should be verified independently.
