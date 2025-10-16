
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blur: {
    padding: SPACING.md,
  },
});
