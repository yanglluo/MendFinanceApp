
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import databaseService from '../services/database';
import aiEngine from '../services/aiEngine';
import authService from '../services/auth';
import { AIInsight } from '../types';

interface InsightsScreenProps {
  navigation: any;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const user = await authService.getCurrentUser();
      const transactions = await databaseService.getTransactions();
      const categories = await databaseService.getCategories();

      if (user) {
        const generatedInsights = await aiEngine.generateInsights(
          transactions,
          categories,
          user.transparencyMode,
          user.budgetAmount
        );
        setInsights(generatedInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'behavioral':
        return COLORS.lilac.main;
      case 'predictive':
        return COLORS.mint.main;
      case 'habit':
        return COLORS.caution;
      case 'progress':
        return COLORS.calm;
      case 'educational':
        return COLORS.lilac.dark;
      default:
        return COLORS.neutral;
    }
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
          <Text style={styles.title}>AI Insights</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>
          Mendi has been watching your patterns and has some insights to share
        </Text>

        {insights.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No insights yet</Text>
            <Text style={styles.emptySubtext}>
              Add more transactions to get personalized insights
            </Text>
          </GlassCard>
        ) : (
          insights.map((insight) => (
            <GlassCard key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getInsightColor(insight.type) },
                  ]}
                >
                  <Text style={styles.typeBadgeText}>
                    {insight.type.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.insightEmoji}>{insight.emotion}</Text>
              </View>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightMessage}>{insight.message}</Text>
              <Text style={styles.insightTime}>
                {new Date(insight.timestamp).toLocaleString()}
              </Text>
            </GlassCard>
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
    marginBottom: SPACING.md,
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
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  insightCard: {
    marginBottom: SPACING.lg,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: SPACING.sm,
  },
  typeBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.background,
  },
  insightEmoji: {
    fontSize: 32,
  },
  insightTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  insightMessage: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  insightTime: {
    fontSize: FONTS.sizes.xs,
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
