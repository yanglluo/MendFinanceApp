
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
}) => {
  const progress = Math.min((current / total) * 100, 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const getProgressColor = (): [ColorValue, ColorValue] => {
    if (progress < 70) {
      return [COLORS.calm, COLORS.mint.dark];
    }
    if (progress < 90) {
      return [COLORS.caution, '#F59E0B'];
    }
    return [COLORS.refocus, '#EC4899'];
  };

  const widthPercentage = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{progress.toFixed(0)}%</Text>
          )}
        </View>
      )}
      <View style={styles.barContainer}>
        <Animated.View style={[styles.bar, { width: widthPercentage }]}>
          <LinearGradient
            colors={getProgressColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.amount}>${current.toFixed(2)}</Text>
        <Text style={styles.total}>of ${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  percentage: {
    color: COLORS.mint.main,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  barContainer: {
    height: 12,
    backgroundColor: COLORS.glassDark,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  gradient: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  amount: {
    color: COLORS.text,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  total: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
});
