
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { GlassCard } from './GlassCard';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { MascotEmotion } from '../types';

interface MascotBubbleProps {
  emotion: MascotEmotion;
  message: string;
}

export const MascotBubble: React.FC<MascotBubbleProps> = ({ emotion, message }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy':
        return COLORS.happy;
      case 'neutral':
        return COLORS.neutral;
      case 'concerned':
        return COLORS.concerned;
      case 'worried':
        return COLORS.worried;
      case 'proud':
        return COLORS.proud;
      case 'excited':
        return COLORS.excited;
      default:
        return COLORS.neutral;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim }
          ],
        },
      ]}
    >
      <View style={styles.mascotContainer}>
        <View style={[styles.mascotGlow, { backgroundColor: getEmotionColor() }]} />
        <Image
          source={require('../../assets/mendi-logo.png')}
          style={styles.mascotImage}
        />
      </View>
      <GlassCard style={styles.bubble}>
        <Text style={styles.message}>{message}</Text>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  mascotContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  mascotGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.full,
    opacity: 0.3,
    top: 10,
    left: 10,
  },
  mascotImage: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.full,
  },
  bubble: {
    maxWidth: '85%',
  },
  message: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
