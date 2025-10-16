
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { TransactionItem } from '../components/TransactionItem';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import databaseService from '../services/database';
import { Transaction, Category } from '../types';

interface TransactionsScreenProps {
  navigation: any;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const txns = await databaseService.getTransactions();
      const cats = await databaseService.getCategories();
      setTransactions(txns);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCategoryForTransaction = (transaction: Transaction): Category | undefined => {
    return categories.find(c => c.id === transaction.categoryId);
  };

  const getTotalSpent = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
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
          <Text style={styles.title}>Transactions</Text>
          <View style={styles.placeholder} />
        </View>

        <GlassCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryAmount}>${getTotalSpent().toFixed(2)}</Text>
          <Text style={styles.summaryCount}>{transactions.length} transactions</Text>
        </GlassCard>

        {transactions.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first transaction to start tracking
            </Text>
          </GlassCard>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              category={getCategoryForTransaction(transaction)}
            />
          ))
        )}
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
  summaryCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  summaryAmount: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.mint.main,
    marginBottom: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
