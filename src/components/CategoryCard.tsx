
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from './GlassCard';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  spent?: number;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, spent = 0, onPress }) => {
  const budget = category.budget || 0;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
            <Text style={styles.icon}>{category.icon}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{category.name}</Text>
            {budget > 0 && (
              <Text style={styles.budget}>
                ${spent.toFixed(0)} / ${budget.toFixed(0)}
              </Text>
            )}
          </View>
        </View>
        {budget > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: percentage > 90 ? COLORS.refocus : COLORS.calm,
                },
              ]}
            />
          </View>
        )}
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  budget: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.glassDark,
    borderRadius: 3,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
});
