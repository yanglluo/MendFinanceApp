
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SPACING, FONTS } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        style={[styles.button, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={[COLORS.mint.main, COLORS.lilac.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.primaryText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.button, styles.outlineButton, disabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.mint.main} />
        ) : (
          <Text style={styles.outlineText}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, styles.secondaryButton, disabled && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.text} />
      ) : (
        <Text style={styles.secondaryText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.glassDark,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.mint.main,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  outlineText: {
    color: COLORS.mint.main,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
