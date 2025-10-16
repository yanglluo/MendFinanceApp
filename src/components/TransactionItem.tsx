
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Transaction, Category } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, category }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          {category && (
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <Text style={styles.icon}>{category.icon}</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.merchant}>{transaction.merchant}</Text>
            <Text style={styles.date}>
              {formatDate(transaction.date)} · {transaction.time}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>-${transaction.amount.toFixed(2)}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  merchant: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
  },
  right: {
    marginLeft: SPACING.md,
  },
  amount: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});
