import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

// Screens
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignupScreen } from "./src/screens/SignupScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { AddTransactionScreen } from "./src/screens/AddTransactionScreen";
import { TransactionsScreen } from "./src/screens/TransactionsScreen";
import { InsightsScreen } from "./src/screens/InsightsScreen";
import { CategoriesScreen } from "./src/screens/CategoriesScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

// Services
import authService from "./src/services/auth";
import databaseService from "./src/services/database";

// Constants
import { COLORS } from "./src/constants/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundLight,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.mint.main,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await databaseService.initDatabase();

      // Check authentication
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // Check if user needs onboarding
        const user = await databaseService.getCurrentUser();
        setNeedsOnboarding(!user);
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setNeedsOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setNeedsOnboarding(false);
  };

  if (loading || !fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Signup">
                {(props) => (
                  <SignupScreen
                    {...props}
                    onSignupSuccess={handleLoginSuccess}
                  />
                )}
              </Stack.Screen>
            </>
          ) : needsOnboarding ? (
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen onComplete={handleOnboardingComplete} />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="MainTabs">
                {(props) => <MainTabs onLogout={handleLogout} />}
              </Stack.Screen>
              <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
              />
              <Stack.Screen name="Settings">
                {(props) => (
                  <SettingsScreen {...props} onLogout={handleLogout} />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
