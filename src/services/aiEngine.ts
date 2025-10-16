
import { Transaction, AIInsight, TransparencyMode, Category } from '../types';

class AIEngineService {
  /**
   * Analyze transactions and generate AI insights
   */
  async generateInsights(
    transactions: Transaction[],
    categories: Category[],
    transparencyMode: TransparencyMode,
    budgetAmount: number
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    if (transactions.length === 0) return insights;

    // 1. Behavioral Pattern Insights
    const behavioralInsights = this.analyzeBehavioralPatterns(transactions, categories, transparencyMode);
    insights.push(...behavioralInsights);

    // 2. Predictive Budget Insights
    const predictiveInsights = this.analyzePredictiveBudget(transactions, budgetAmount, transparencyMode);
    insights.push(...predictiveInsights);

    // 3. Micro-Habit & Trigger Insights
    const habitInsights = this.analyzeHabitTriggers(transactions, transparencyMode);
    insights.push(...habitInsights);

    // 4. Progress & Growth Insights
    const progressInsights = this.analyzeProgress(transactions, budgetAmount, transparencyMode);
    insights.push(...progressInsights);

    // 5. Educational Insights
    const educationalInsights = this.analyzeEducational(transactions, categories, transparencyMode);
    insights.push(...educationalInsights);

    return insights.slice(0, 5); // Return top 5 insights
  }

  private analyzeBehavioralPatterns(
    transactions: Transaction[],
    categories: Category[],
    mode: TransparencyMode
  ): AIInsight[] {
    const insights: AIInsight[] = [];

    // Analyze day of week patterns
    const daySpending = this.groupByDayOfWeek(transactions);
    const highestSpendDay = Object.entries(daySpending).sort((a, b) => b[1] - a[1])[0];
    
    if (highestSpendDay && highestSpendDay[1] > 0) {
      const message = this.frameMessage(
        mode,
        `You tend to spend the most on ${highestSpendDay[0]}s — one small tweak here could stretch your week.`,
        `${highestSpendDay[0]}s are your high-spend window — your awareness is key.`,
        `Your spending patterns are shifting — stay mindful.`
      );

      insights.push({
        id: `behavioral_day_${Date.now()}`,
        type: 'behavioral',
        title: 'Spending Pattern Detected',
        message,
        emotion: '📊',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        actionable: true,
      });
    }

    // Analyze recurring merchant patterns
    const merchantFrequency = this.getMerchantFrequency(transactions);
    const topMerchant = Object.entries(merchantFrequency).sort((a, b) => b[1].count - a[1].count)[0];
    
    if (topMerchant && topMerchant[1].count >= 5) {
      const monthlyAmount = topMerchant[1].total;
      const message = this.frameMessage(
        mode,
        `Your ${topMerchant[0]} habit adds up to $${monthlyAmount.toFixed(2)}/month — want to set a prepaid budget?`,
        `${topMerchant[0]} is a consistent expense — that's $${monthlyAmount.toFixed(2)} monthly.`,
        `You have regular spending habits forming — that's okay.`
      );

      insights.push({
        id: `behavioral_merchant_${Date.now()}`,
        type: 'behavioral',
        title: 'Recurring Expense Noticed',
        message,
        emotion: '☕',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        actionable: true,
      });
    }

    return insights;
  }

  private analyzePredictiveBudget(
    transactions: Transaction[],
    budgetAmount: number,
    mode: TransparencyMode
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Calculate current spending
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const percentUsed = (totalSpent / budgetAmount) * 100;

    // Predict end-of-period status
    const daysInPeriod = 30; // Simplified for monthly
    const currentDay = new Date().getDate();
    const projectedSpend = (totalSpent / currentDay) * daysInPeriod;
    
    if (projectedSpend > budgetAmount * 1.1) {
      const message = this.frameMessage(
        mode,
        `At your current pace, you're trending to exceed your budget by ${((projectedSpend / budgetAmount - 1) * 100).toFixed(0)}% — want help rebalancing now?`,
        `Your spending is trending higher than planned — small adjustments now can help.`,
        `Your patterns are shifting — let's focus on what matters most to you.`
      );

      insights.push({
        id: `predictive_overage_${Date.now()}`,
        type: 'predictive',
        title: 'Budget Forecast',
        message,
        emotion: '⚠️',
        timestamp: new Date().toISOString(),
        priority: 'high',
        actionable: true,
      });
    } else if (projectedSpend < budgetAmount * 0.8) {
      const surplus = budgetAmount - projectedSpend;
      const message = this.frameMessage(
        mode,
        `You're pacing really well — that's $${surplus.toFixed(0)} extra at period end!`,
        `Your balance is looking strong — great pacing.`,
        `Your habits are serving you well this period.`
      );

      insights.push({
        id: `predictive_surplus_${Date.now()}`,
        type: 'predictive',
        title: 'Great Progress',
        message,
        emotion: '🎉',
        timestamp: new Date().toISOString(),
        priority: 'low',
        actionable: false,
      });
    }

    return insights;
  }

  private analyzeHabitTriggers(
    transactions: Transaction[],
    mode: TransparencyMode
  ): AIInsight[] {
    const insights: AIInsight[] = [];

    // Analyze late-night spending
    const lateNightTxns = transactions.filter(t => {
      const hour = parseInt(t.time.split(':')[0]);
      return hour >= 22 || hour <= 2;
    });

    if (lateNightTxns.length >= 3) {
      const lateNightTotal = lateNightTxns.reduce((sum, t) => sum + t.amount, 0);
      const message = this.frameMessage(
        mode,
        `Late-night spending is adding up to $${lateNightTotal.toFixed(2)} — want a gentle reminder after 10 PM?`,
        `Late hours sometimes lead to extra spending — stay aware of your patterns.`,
        `Your evening habits are worth noticing — no judgment, just awareness.`
      );

      insights.push({
        id: `habit_latenight_${Date.now()}`,
        type: 'habit',
        title: 'Habit Trigger Detected',
        message,
        emotion: '🌙',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        actionable: true,
      });
    }

    return insights;
  }

  private analyzeProgress(
    transactions: Transaction[],
    budgetAmount: number,
    mode: TransparencyMode
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const percentUsed = (totalSpent / budgetAmount) * 100;

    // Check if under budget consistently
    if (percentUsed < 85) {
      const message = this.frameMessage(
        mode,
        `You've stayed within budget — that's consistency in action 💪`,
        `Your balance is strong — you're finding your rhythm.`,
        `Your awareness is building — that's real growth.`
      );

      insights.push({
        id: `progress_consistency_${Date.now()}`,
        type: 'progress',
        title: 'Consistent Progress',
        message,
        emotion: '✨',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        actionable: false,
      });
    }

    return insights;
  }

  private analyzeEducational(
    transactions: Transaction[],
    categories: Category[],
    mode: TransparencyMode
  ): AIInsight[] {
    const insights: AIInsight[] = [];

    // Check for potential subscription duplicates
    const subscriptions = transactions.filter(t => 
      t.merchant.toLowerCase().includes('netflix') || 
      t.merchant.toLowerCase().includes('spotify') ||
      t.merchant.toLowerCase().includes('hulu')
    );

    if (subscriptions.length > 2) {
      const message = this.frameMessage(
        mode,
        `Multiple streaming services detected — consolidating could save ~$15/month.`,
        `Some subscriptions might overlap — worth a quick review.`,
        `Your spending is spread across services — awareness is key.`
      );

      insights.push({
        id: `educational_subscriptions_${Date.now()}`,
        type: 'educational',
        title: 'Subscription Insight',
        message,
        emotion: '💡',
        timestamp: new Date().toISOString(),
        priority: 'low',
        actionable: true,
      });
    }

    return insights;
  }

  private frameMessage(mode: TransparencyMode, full: string, soft: string, hidden: string): string {
    switch (mode) {
      case 'full':
        return full;
      case 'soft':
        return soft;
      case 'hidden':
        return hidden;
      default:
        return soft;
    }
  }

  private groupByDayOfWeek(transactions: Transaction[]): Record<string, number> {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const spending: Record<string, number> = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const dayName = days[date.getDay()];
      spending[dayName] = (spending[dayName] || 0) + t.amount;
    });

    return spending;
  }

  private getMerchantFrequency(transactions: Transaction[]): Record<string, { count: number; total: number }> {
    const merchants: Record<string, { count: number; total: number }> = {};

    transactions.forEach(t => {
      if (!merchants[t.merchant]) {
        merchants[t.merchant] = { count: 0, total: 0 };
      }
      merchants[t.merchant].count++;
      merchants[t.merchant].total += t.amount;
    });

    return merchants;
  }

  /**
   * Determine mascot emotion based on spending behavior
   */
  determineMascotEmotion(
    totalSpent: number,
    budgetAmount: number,
    recentTransactions: Transaction[]
  ): { emotion: string; message: string } {
    const percentUsed = (totalSpent / budgetAmount) * 100;

    if (percentUsed < 50) {
      return {
        emotion: 'happy',
        message: "You're doing amazing! Your budget is looking healthy 🌟",
      };
    } else if (percentUsed < 75) {
      return {
        emotion: 'neutral',
        message: "You're on track — steady and mindful 💚",
      };
    } else if (percentUsed < 90) {
      return {
        emotion: 'concerned',
        message: "Getting close to your limit — let's pace together 💛",
      };
    } else if (percentUsed < 100) {
      return {
        emotion: 'worried',
        message: "Almost at your budget — small choices matter now 🧡",
      };
    } else {
      return {
        emotion: 'worried',
        message: "Over budget — let's reflect and adjust together ❤️",
      };
    }
  }
}

export default new AIEngineService();
