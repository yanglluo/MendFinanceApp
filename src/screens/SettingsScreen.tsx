
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import authService from '../services/auth';
import databaseService from '../services/database';
import { TransparencyMode, User } from '../types';

interface SettingsScreenProps {
  navigation: any;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setNotifications(currentUser.enableNotifications);
      setCloudSync(currentUser.enableCloudSync);
    }
  };

  const handleTransparencyModeChange = async (mode: TransparencyMode) => {
    if (user) {
      user.transparencyMode = mode;
      await authService.updateUser(user);
      await databaseService.updateUserTransparencyMode(mode);
      setUser({ ...user });
      Alert.alert('Success', `Transparency mode changed to ${mode}`);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    if (user) {
      user.enableNotifications = value;
      await authService.updateUser(user);
    }
  };

  const handleToggleCloudSync = async (value: boolean) => {
    setCloudSync(value);
    if (user) {
      user.enableCloudSync = value;
      await authService.updateUser(user);
      if (value) {
        Alert.alert(
          'Cloud Sync',
          'Your data will be encrypted and backed up securely. Multi-device sync coming soon!'
        );
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          onLogout();
        },
      },
    ]);
  };

  const budgetPeriodLabel = (() => {
    const period = user?.budgetPeriod;
    if (!period) {
      return 'Not set';
    }
    return period.charAt(0).toUpperCase() + period.slice(1);
  })();

  const budgetAmountLabel = (() => {
    const amount = user?.budgetAmount;
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    return '$0.00';
  })();

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {user && (
          <GlassCard style={styles.profileCard}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </GlassCard>
        )}

        <Text style={styles.sectionTitle}>Transparency Mode</Text>
        <GlassCard style={styles.card}>
          {(['full', 'soft', 'hidden'] as TransparencyMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => handleTransparencyModeChange(mode)}
              style={styles.modeOption}
            >
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
                <Text style={styles.modeDescription}>
                  {mode === 'full' && 'See all numbers and detailed insights'}
                  {mode === 'soft' && 'See trends with encouraging language'}
                  {mode === 'hidden' && 'Focus on habits, minimal numbers'}
                </Text>
              </View>
              {user?.transparencyMode === mode && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </GlassCard>

        <Text style={styles.sectionTitle}>Budget</Text>
        <GlassCard style={styles.card}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Period</Text>
            <Text style={styles.budgetValue}>{budgetPeriodLabel}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Amount</Text>
            <Text style={styles.budgetValue}>{budgetAmountLabel}</Text>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Get proactive nudges and reminders
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: COLORS.glassDark, true: COLORS.mint.main }}
              thumbColor={COLORS.text}
            />
          </View>

          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Cloud Sync (Beta)</Text>
              <Text style={styles.settingDescription}>
                Encrypted backup & multi-device sync
              </Text>
            </View>
            <Switch
              value={cloudSync}
              onValueChange={handleToggleCloudSync}
              trackColor={{ false: COLORS.glassDark, true: COLORS.mint.main }}
              thumbColor={COLORS.text}
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Account</Text>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
        />

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    fontSize: FONTS.sizes.md,
    color: COLORS.mint.main,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    width: 60,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  profileName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.md,
  },
  modeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  checkmark: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.mint.main,
    marginLeft: SPACING.md,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  budgetLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  budgetValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  version: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
