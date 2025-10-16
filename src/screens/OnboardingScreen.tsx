
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { BudgetPeriod, TransparencyMode } from '../types';
import authService from '../services/auth';
import databaseService from '../services/database';
import { PRESET_CATEGORIES } from '../constants/categories';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>('monthly');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [transparencyMode, setTransparencyMode] = useState<TransparencyMode>('full');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        user.budgetPeriod = budgetPeriod;
        user.budgetAmount = parseFloat(budgetAmount) || 1000;
        user.transparencyMode = transparencyMode;
        await authService.updateUser(user);
        await databaseService.createUser(user);

        // Initialize preset categories
        for (const category of PRESET_CATEGORIES) {
          await databaseService.addCategory(category);
        }
      }
      onComplete();
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Image
        source={require('../../assets/mendi-logo.png')}
        style={styles.mascot}
      />
      <Text style={styles.greeting}>Hi! I'm Mendi 👋</Text>
      <Text style={styles.description}>
        I'm here to help you build mindful money habits without the stress.
        Let's set up your budget together!
      </Text>
      <Button title="Let's Start" onPress={() => setStep(2)} />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Budget Period</Text>
      <Text style={styles.stepDescription}>
        How would you like to track your spending?
      </Text>

      <View style={styles.optionsContainer}>
        {(['semester', 'monthly', 'weekly'] as BudgetPeriod[]).map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setBudgetPeriod(period)}
            style={styles.optionButton}
          >
            <GlassCard
              style={[
                styles.optionCard,
                budgetPeriod === period ? styles.selectedOption : undefined,
              ]}
            >
              <Text style={styles.optionText}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
              {budgetPeriod === period && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </GlassCard>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Continue" onPress={() => setStep(3)} />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set Your Budget</Text>
      <Text style={styles.stepDescription}>
        How much do you want to budget for this {budgetPeriod}?
      </Text>

      <GlassCard style={styles.inputCard}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.budgetInput}
          placeholder="1000"
          placeholderTextColor={COLORS.textMuted}
          value={budgetAmount}
          onChangeText={setBudgetAmount}
          keyboardType="numeric"
        />
      </GlassCard>

      <Text style={styles.hint}>
        Don't worry, you can adjust this anytime in settings
      </Text>

      <Button
        title="Continue"
        onPress={() => setStep(4)}
        disabled={!budgetAmount || parseFloat(budgetAmount) <= 0}
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Transparency Mode</Text>
      <Text style={styles.stepDescription}>
        How much detail do you want to see about your spending?
      </Text>

      <View style={styles.transparencyContainer}>
        <TouchableOpacity onPress={() => setTransparencyMode('full')}>
          <GlassCard
            style={[
              styles.transparencyCard,
              transparencyMode === 'full' ? styles.selectedOption : undefined,
            ]}
          >
            <Text style={styles.transparencyTitle}>Full Transparency</Text>
            <Text style={styles.transparencyDescription}>
              See all numbers, precise data, and detailed insights
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTransparencyMode('soft')}>
          <GlassCard
            style={[
              styles.transparencyCard,
              transparencyMode === 'soft' ? styles.selectedOption : undefined,
            ]}
          >
            <Text style={styles.transparencyTitle}>Soft Mode</Text>
            <Text style={styles.transparencyDescription}>
              See trends and patterns with encouraging language
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTransparencyMode('hidden')}>
          <GlassCard
            style={[
              styles.transparencyCard,
              transparencyMode === 'hidden' ? styles.selectedOption : undefined,
            ]}
          >
            <Text style={styles.transparencyTitle}>Hidden Mode</Text>
            <Text style={styles.transparencyDescription}>
              Focus on habits and emotions, minimal numbers
            </Text>
          </GlassCard>
        </TouchableOpacity>
      </View>

      <Button
        title="Complete Setup"
        onPress={handleComplete}
        loading={loading}
      />
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xxl,
  },
  stepTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  stepDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    marginBottom: SPACING.xl,
  },
  optionButton: {
    marginBottom: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: COLORS.mint.main,
    borderWidth: 2,
  },
  optionText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.mint.main,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  currencySymbol: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.mint.main,
    fontWeight: '700',
    marginRight: SPACING.sm,
  },
  budgetInput: {
    flex: 1,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
    fontWeight: '700',
  },
  hint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  transparencyContainer: {
    marginBottom: SPACING.xl,
  },
  transparencyCard: {
    marginBottom: SPACING.md,
  },
  transparencyTitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  transparencyDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
