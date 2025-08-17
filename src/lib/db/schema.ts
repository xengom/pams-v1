import { sql } from 'drizzle-orm'
import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core'

// 기존 테이블들 (CLAUDE.md 기준)
export const accountCategories = sqliteTable('account_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'asset' | 'liability' | 'equity' | 'income' | 'expense'
  description: text('description'),
  icon: text('icon').default('💰'),
  color: text('color').default('#3B82F6'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_id').notNull().references(() => accountCategories.id),
  accountType: text('account_type').notNull(), // 'asset' | 'liability' | 'equity' | 'income' | 'expense'
  currentBalance: real('current_balance').notNull().default(0),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const transactionEntries = sqliteTable('transaction_entries', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transactions.id),
  accountId: text('account_id').notNull().references(() => accounts.id),
  debitAmount: real('debit_amount'),
  creditAmount: real('credit_amount'),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 계획 관리를 위한 새로운 테이블들

// 고정비 관리
export const fixedExpenses = sqliteTable('fixed_expenses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  amount: real('amount').notNull(),
  frequency: text('frequency').notNull(), // 'annual' | 'monthly'
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 카드 관리
export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'credit' | 'debit'
  issuer: text('issuer').notNull(),
  lastFourDigits: text('last_four_digits').notNull(),
  creditLimit: real('credit_limit'),
  linkedAccountId: text('linked_account_id').references(() => accounts.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  color: text('color').default('#3B82F6'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 카드별 월간 사용 집계
export const cardMonthlyUsage = sqliteTable('card_monthly_usage', {
  id: text('id').primaryKey(),
  cardId: text('card_id').notNull().references(() => cards.id),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  totalAmount: real('total_amount').notNull().default(0),
  transactionCount: integer('transaction_count').notNull().default(0),
  calculatedAt: text('calculated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 예산 카테고리
export const budgetCategories = sqliteTable('budget_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  isFixed: integer('is_fixed', { mode: 'boolean' }).default(false),
  color: text('color').default('#6B7280'),
  icon: text('icon').default('💰'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 월별 지출 계획
export const spendingPlans = sqliteTable('spending_plans', {
  id: text('id').primaryKey(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  fixedExpenses: real('fixed_expenses').notNull().default(0),
  savings: real('savings').notNull().default(0),
  investment: real('investment').notNull().default(0),
  foodExpenses: real('food_expenses').notNull().default(0),
  transportation: real('transportation').notNull().default(0),
  utilities: real('utilities').notNull().default(0),
  entertainment: real('entertainment').notNull().default(0),
  healthcare: real('healthcare').notNull().default(0),
  education: real('education').notNull().default(0),
  miscellaneous: real('miscellaneous').notNull().default(0),
  totalIncome: real('total_income').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 카드 거래 매핑
export const transactionCards = sqliteTable('transaction_cards', {
  transactionId: text('transaction_id').notNull().references(() => transactions.id),
  cardId: text('card_id').notNull().references(() => cards.id)
}, (table) => ({
  pk: primaryKey({ columns: [table.transactionId, table.cardId] })
}))

// Assets 관련 테이블들 (기존 시스템 기준)
export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'stock' | 'etf' | 'bond' | 'crypto' | 'currency' | 'other'
  currency: text('currency').notNull().default('KRW'),
  dataSource: text('data_source').notNull(), // 'yahoo' | 'manual' | 'api'
  currentPrice: real('current_price'),
  lastUpdated: text('last_updated'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const assetTransactions = sqliteTable('asset_transactions', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  type: text('type').notNull(), // 'buy' | 'sell' | 'dividend'
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  totalAmount: real('total_amount').notNull(),
  currency: text('currency').notNull().default('KRW'),
  date: text('date').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const dividends = sqliteTable('dividends', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  exDate: text('ex_date').notNull(),
  payDate: text('pay_date').notNull(),
  amountKRW: real('amount_krw'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const portfolioSnapshots = sqliteTable('portfolio_snapshots', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  totalValue: real('total_value').notNull(),
  currency: text('currency').notNull().default('KRW'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  action: text('action').notNull(), // 'INSERT' | 'UPDATE' | 'DELETE'
  oldValues: text('old_values'),
  newValues: text('new_values'),
  timestamp: text('timestamp').notNull().default(sql`CURRENT_TIMESTAMP`)
})