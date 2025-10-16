
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundLight, COLORS.mint.dark]}
      locations={[0, 0.7, 1]}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
