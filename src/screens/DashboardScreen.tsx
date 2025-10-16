
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { MascotBubble } from '../components/MascotBubble';
import { ProgressBar } from '../components/ProgressBar';
import { GlassCard } from '../components/GlassCard';
import { TransactionItem } from '../components/TransactionItem';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import databaseService from '../services/database';
import aiEngine from '../services/aiEngine';
import authService from '../services/auth';
import notificationService from '../services/notifications';
import { Transaction, Category, MascotEmotion } from '../types';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>('happy');
  const [mascotMessage, setMascotMessage] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(1000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    await notificationService.requestPermissions();
  };

  const loadData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setBudgetAmount(user.budgetAmount);
      }

      const txns = await databaseService.getTransactions(10);
      const cats = await databaseService.getCategories();
      setTransactions(txns);
      setCategories(cats);

      const total = txns.reduce((sum, t) => sum + t.amount, 0);
      setTotalSpent(total);

      // Update mascot state
      const mascotState = aiEngine.determineMascotEmotion(total, user?.budgetAmount || 1000, txns);
      setMascotEmotion(mascotState.emotion as MascotEmotion);
      setMascotMessage(mascotState.message);

      // Generate AI insights
      const generatedInsights = await aiEngine.generateInsights(
        txns,
        cats,
        user?.transparencyMode || 'full',
        user?.budgetAmount || 1000
      );
      setInsights(generatedInsights);

      // Check for budget warnings
      const percentUsed = (total / (user?.budgetAmount || 1000)) * 100;
      if (percentUsed >= 80) {
        await notificationService.scheduleBudgetWarning(percentUsed);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <MascotBubble emotion={mascotEmotion} message={mascotMessage} />

        <GlassCard style={styles.budgetCard}>
          <Text style={styles.sectionTitle}>Your Budget</Text>
          <ProgressBar current={totalSpent} total={budgetAmount} />
        </GlassCard>

        {insights.length > 0 && (
          <GlassCard style={styles.insightsCard}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            {insights.slice(0, 2).map((insight) => (
              <View key={insight.id} style={styles.insightItem}>
                <Text style={styles.insightEmoji}>{insight.emotion}</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={() => navigation.navigate('Insights')}>
              <Text style={styles.viewAllLink}>View All Insights →</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button below to add your first transaction
            </Text>
          </GlassCard>
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              category={getCategoryForTransaction(transaction)}
            />
          ))
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Text style={styles.addButtonText}>+ Add Transaction</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  settingsIcon: {
    fontSize: 24,
  },
  budgetCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  insightsCard: {
    marginBottom: SPACING.lg,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  viewAllLink: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.mint.main,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  quickActions: {
    marginTop: SPACING.xl,
  },
  addButton: {
    backgroundColor: COLORS.mint.main,
    borderRadius: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.background,
  },
});
