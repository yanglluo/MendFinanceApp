
export type TransparencyMode = 'full' | 'soft' | 'hidden';
export type BudgetPeriod = 'semester' | 'monthly' | 'weekly';
export type MascotEmotion = 'happy' | 'neutral' | 'concerned' | 'proud' | 'worried' | 'excited';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  budgetPeriod: BudgetPeriod;
  transparencyMode: TransparencyMode;
  budgetAmount: number;
  semesterStartDate?: string;
  semesterEndDate?: string;
  enableNotifications: boolean;
  enableCloudSync: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  categoryId: string;
  date: string;
  time: string;
  note?: string;
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  spent: number;
}

export interface AIInsight {
  id: string;
  type: 'behavioral' | 'predictive' | 'habit' | 'progress' | 'educational' | 'emotional';
  title: string;
  message: string;
  emotion: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  actionable?: boolean;
}

export interface Nudge {
  id: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'suggestion' | 'celebration' | 'check-in';
  action?: string;
}

export interface MascotState {
  emotion: MascotEmotion;
  message: string;
  lastUpdated: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  totalSpent: number;
  budgetUsed: number;
  topCategory: string;
  insights: string[];
  reflection?: string;
}
