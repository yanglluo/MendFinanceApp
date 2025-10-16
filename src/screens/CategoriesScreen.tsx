
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { CategoryCard } from '../components/CategoryCard';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import databaseService from '../services/database';
import { Category, Transaction } from '../types';

interface CategoriesScreenProps {
  navigation: any;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySpending, setCategorySpending] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cats = await databaseService.getCategories();
      const transactions = await databaseService.getTransactions();
      
      setCategories(cats);
      
      // Calculate spending per category
      const spending: Record<string, number> = {};
      transactions.forEach((t: Transaction) => {
        spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
      });
      setCategorySpending(spending);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.mint.main} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Categories</Text>
          <View style={styles.placeholder} />
        </View>

        <GlassCard style={styles.infoCard}>
          <Text style={styles.infoText}>
            Track your spending across different categories
          </Text>
        </GlassCard>

        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            spent={categorySpending[category.id] || 0}
          />
        ))}
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
  infoCard: {
    marginBottom: SPACING.lg,
  },
  infoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
