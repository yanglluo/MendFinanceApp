
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import authService from '../services/auth';

interface SignupScreenProps {
  navigation: any;
  onSignupSuccess: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authService.signup(email, password, name);
      if (user) {
        onSignupSuccess();
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/mendi-logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Join Mend</Text>
            <Text style={styles.subtitle}>Start your mindful money journey</Text>
          </View>

          <GlassCard style={styles.formCard}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Log In</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  formCard: {
    marginTop: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.glassDark,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  error: {
    color: COLORS.refocus,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  link: {
    color: COLORS.mint.main,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
});
