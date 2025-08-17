// Database schema types
export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense'
export type AssetType = 'stock' | 'etf' | 'bond' | 'crypto' | 'currency' | 'other'
export type DataSource = 'yahoo' | 'manual' | 'api'
export type Currency = 'KRW' | 'USD'

// Account management types
export interface AccountCategory {
  id: string
  name: string
  type: AccountType
  description?: string
  icon?: string
  color?: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  categoryId: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Transaction types
export interface Transaction {
  id: string
  date: Date
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionEntry {
  id: string
  transactionId: string
  accountId: string
  debitAmount?: number
  creditAmount?: number
  createdAt: Date
  updatedAt: Date
}

// Asset management types
export interface Asset {
  id: string
  symbol: string
  name: string
  type: AssetType
  currency: Currency
  dataSource: DataSource
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AssetTransaction {
  id: string
  accountId: string
  assetId: string
  type: 'buy' | 'sell'
  quantity: number
  pricePerShare: number
  totalAmount: number
  currency: Currency
  date: Date
  createdAt: Date
  updatedAt: Date
}

// Form types
export interface AccountFormData {
  categoryId: string
  name: string
  description?: string
}

export interface TransactionFormData {
  date: string
  description: string
  entries: {
    accountId: string
    debitAmount?: number
    creditAmount?: number
  }[]
}

export interface AssetFormData {
  symbol: string
  name: string
  type: AssetType
  currency: Currency
  dataSource: DataSource
}

// Planning system types
export interface FixedExpense {
  id: string
  name: string
  category: string
  amount: number
  frequency: 'annual' | 'monthly'
  startDate: string
  endDate?: string
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Card {
  id: string
  name: string
  type: 'credit' | 'debit'
  issuer: string
  lastFourDigits: string
  creditLimit?: number
  linkedAccountId?: string
  isActive: boolean
  color: string
  createdAt: string
  updatedAt: string
}

export interface CardUsage {
  id: string
  cardId: string
  year: number
  month: number
  totalAmount: number
  transactionCount: number
  calculatedAt: string
}

export interface BudgetCategory {
  id: string
  name: string
  isFixed: boolean
  color: string
  icon: string
  sortOrder: number
  createdAt: string
}

export interface SpendingPlan {
  id: string
  year: number
  month: number
  fixedExpenses: number
  savings: number
  investment: number
  foodExpenses: number
  transportation: number
  utilities: number
  entertainment: number
  healthcare: number
  education: number
  miscellaneous: number
  totalIncome: number
  createdAt: string
  updatedAt: string
}

// Form types for planning system
export interface FixedExpenseFormData {
  name: string
  category: string
  amount: number
  frequency: 'annual' | 'monthly'
  startDate: string
  endDate?: string
  description?: string
}

export interface CardFormData {
  name: string
  type: 'credit' | 'debit'
  issuer: string
  lastFourDigits: string
  creditLimit?: number
  linkedAccountId?: string
  color: string
}

export interface SpendingPlanFormData {
  savings: number
  investment: number
  foodExpenses: number
  transportation: number
  utilities: number
  entertainment: number
  healthcare: number
  education: number
  miscellaneous: number
  totalIncome: number
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface FixedExpensesResponse {
  annual: FixedExpense[]
  monthly: FixedExpense[]
  summary: {
    totalAnnual: number
    totalMonthly: number
    monthlyAverage: number
  }
}

export interface CardsResponse {
  cards: Card[]
  summary: {
    totalCards: number
    activeCards: number
    thisMonthTotal: number
    lastMonthTotal: number
    changePercent: number
  }
}

export interface SpendingPlanResponse extends SpendingPlan {
  actual: {
    fixedExpenses: number
    savings: number
    investment: number
    foodExpenses: number
    transportation: number
    utilities: number
    entertainment: number
    healthcare: number
    education: number
    miscellaneous: number
  }
  comparison: {
    category: string
    planned: number
    actual: number
    difference: number
    achievementRate: number
  }[]
}