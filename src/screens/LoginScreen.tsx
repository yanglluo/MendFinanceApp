
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
} from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import authService from '../services/auth';

interface LoginScreenProps {
  navigation: any;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      if (user) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/mendi-logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome to Mend</Text>
            <Text style={styles.subtitle}>Your mindful money companion</Text>
          </View>

          <GlassCard style={styles.formCard}>
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
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
