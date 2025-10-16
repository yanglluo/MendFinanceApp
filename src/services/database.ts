import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import {
  Category,
  User,
  AIInsight,
  Transaction as BudgetTransaction,
} from '../types';

type UserRow = {
  id: string;
  email: string;
  name: string;
  created_at: string;
  budget_period: string;
  transparency_mode: string;
  budget_amount: number;
  semester_start_date: string | null;
  semester_end_date: string | null;
  enable_notifications: number;
  enable_cloud_sync: number;
};

type TransactionRow = {
  id: string;
  amount: number;
  merchant: string;
  category_id: string;
  date: string;
  time: string;
  note: string | null;
  is_recurring: number | null;
};

type CategoryRow = {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number | null;
  is_custom: number;
};

type AIInsightRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  emotion: string;
  timestamp: string;
  priority: string;
  actionable: number | null;
};

class DatabaseService {
  private dbPromise: Promise<SQLiteDatabase> | null = null;

  private getDatabase(): Promise<SQLiteDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDatabaseAsync('mend.db');
    }

    return this.dbPromise;
  }

  private mapUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.created_at,
      budgetPeriod: row.budget_period as User['budgetPeriod'],
      transparencyMode: row.transparency_mode as User['transparencyMode'],
      budgetAmount: row.budget_amount,
      semesterStartDate: row.semester_start_date ?? undefined,
      semesterEndDate: row.semester_end_date ?? undefined,
      enableNotifications: row.enable_notifications === 1,
      enableCloudSync: row.enable_cloud_sync === 1,
    };
  }

  private mapTransaction(row: TransactionRow): BudgetTransaction {
    return {
      id: row.id,
      amount: row.amount,
      merchant: row.merchant,
      categoryId: row.category_id,
      date: row.date,
      time: row.time,
      note: row.note ?? undefined,
      isRecurring: row.is_recurring === 1,
    };
  }

  private mapCategory(row: CategoryRow): Category {
    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      budget: row.budget ?? undefined,
      isCustom: row.is_custom === 1,
    };
  }

  private mapInsight(row: AIInsightRow): AIInsight {
    return {
      id: row.id,
      type: row.type as AIInsight['type'],
      title: row.title,
      message: row.message,
      emotion: row.emotion,
      timestamp: row.timestamp,
      priority: row.priority as AIInsight['priority'],
      actionable: row.actionable === 1,
    };
  }

  async initDatabase(): Promise<void> {
    const db = await this.getDatabase();
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        created_at TEXT,
        budget_period TEXT,
        transparency_mode TEXT,
        budget_amount REAL,
        semester_start_date TEXT,
        semester_end_date TEXT,
        enable_notifications INTEGER,
        enable_cloud_sync INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        icon TEXT,
        color TEXT,
        budget REAL,
        is_custom INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL,
        merchant TEXT,
        category_id TEXT,
        date TEXT,
        time TEXT,
        note TEXT,
        is_recurring INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );`,
      `CREATE TABLE IF NOT EXISTS ai_insights (
        id TEXT PRIMARY KEY,
        type TEXT,
        title TEXT,
        message TEXT,
        emotion TEXT,
        timestamp TEXT,
        priority TEXT,
        actionable INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS weekly_reviews (
        id TEXT PRIMARY KEY,
        week_start TEXT,
        week_end TEXT,
        total_spent REAL,
        budget_used REAL,
        top_category TEXT,
        insights TEXT,
        reflection TEXT
      );`,
    ];

    await db.withTransactionAsync(async () => {
      for (const statement of statements) {
        await db.execAsync(statement);
      }
    });
  }

  async createUser(user: User): Promise<void> {
    const db = await this.getDatabase();

    await db.runAsync(
      `INSERT INTO users (
        id,
        email,
        name,
        created_at,
        budget_period,
        transparency_mode,
        budget_amount,
        semester_start_date,
        semester_end_date,
        enable_notifications,
        enable_cloud_sync
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        user.id,
        user.email,
        user.name,
        user.createdAt,
        user.budgetPeriod,
        user.transparencyMode,
        user.budgetAmount,
        user.semesterStartDate ?? null,
        user.semesterEndDate ?? null,
        user.enableNotifications ? 1 : 0,
        user.enableCloudSync ? 1 : 0,
      ]
    );
  }

  async getCurrentUser(): Promise<User | null> {
    const db = await this.getDatabase();
    const rows = await db.getAllAsync<UserRow>('SELECT * FROM users LIMIT 1;', []);
    const row = rows[0];

    return row ? this.mapUser(row) : null;
  }

  async addTransaction(transaction: BudgetTransaction): Promise<void> {
    const db = await this.getDatabase();

    await db.runAsync(
      `INSERT INTO transactions (
        id,
        amount,
        merchant,
        category_id,
        date,
        time,
        note,
        is_recurring
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        transaction.id,
        transaction.amount,
        transaction.merchant,
        transaction.categoryId,
        transaction.date,
        transaction.time,
        transaction.note ?? null,
        transaction.isRecurring ? 1 : 0,
      ]
    );
  }

  async getTransactions(limit?: number): Promise<BudgetTransaction[]> {
    const db = await this.getDatabase();
    const limitClause = typeof limit === 'number' ? ' LIMIT ?' : '';
    const params = typeof limit === 'number' ? [limit] : [];

    const rows = await db.getAllAsync<TransactionRow>(
      `SELECT * FROM transactions ORDER BY date DESC, time DESC${limitClause};`,
      params
    );

    return rows.map((row) => this.mapTransaction(row));
  }

  async addCategory(category: Category): Promise<void> {
    const db = await this.getDatabase();

    await db.runAsync(
      `INSERT INTO categories (
        id,
        name,
        icon,
        color,
        budget,
        is_custom
      ) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        category.id,
        category.name,
        category.icon,
        category.color,
        category.budget ?? null,
        category.isCustom ? 1 : 0,
      ]
    );
  }

  async getCategories(): Promise<Category[]> {
    const db = await this.getDatabase();
    const rows = await db.getAllAsync<CategoryRow>('SELECT * FROM categories;', []);

    return rows.map((row) => this.mapCategory(row));
  }

  async saveInsight(insight: AIInsight): Promise<void> {
    const db = await this.getDatabase();

    await db.runAsync(
      `INSERT INTO ai_insights (
        id,
        type,
        title,
        message,
        emotion,
        timestamp,
        priority,
        actionable
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        insight.id,
        insight.type,
        insight.title,
        insight.message,
        insight.emotion,
        insight.timestamp,
        insight.priority,
        insight.actionable ? 1 : 0,
      ]
    );
  }

  async getInsights(limit: number = 10): Promise<AIInsight[]> {
    const db = await this.getDatabase();
    const rows = await db.getAllAsync<AIInsightRow>(
      'SELECT * FROM ai_insights ORDER BY timestamp DESC LIMIT ?;',
      [limit]
    );

    return rows.map((row) => this.mapInsight(row));
  }

  async updateUserTransparencyMode(mode: string): Promise<void> {
    const db = await this.getDatabase();

    await db.runAsync(
      'UPDATE users SET transparency_mode = ? WHERE id IN (SELECT id FROM users LIMIT 1);',
      [mode]
    );
  }
}

export default new DatabaseService();
