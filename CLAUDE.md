# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PAMS (Personal Asset Management System) is a web-based double-entry bookkeeping and asset management system inspired by GnuCash. Built with modern web technologies focusing on functional programming principles.

## Technology Stack

- **Frontend**: React + TypeScript + Vite + Radix UI components + TanStack Query + Cloudflare Pages
- **Database**: Cloudflare D1 with Drizzle ORM
- **API**: Cloudflare Pages Functions
- **Styling**: CSS with Tailwind-like utility classes
- **Validation**: Zod schemas
- **Architecture**: Functional programming principles

## Development Commands

### Core Development
```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

### Database Management
```bash
# Sync schema changes to local DB
pnpm db:sync:local

# Reset local DB completely
pnpm db:reset:local

# Check database status
pnpm db:status

# Deploy to production (use with caution)
pnpm db:sync:remote
```

## Architecture Overview

### Database Schema (Double-Entry Bookkeeping)
The system implements proper double-entry bookkeeping with these core tables:
- `account_categories`: User-friendly categorization (저축계좌, 투자계좌, 급여소득 etc.) with UI metadata
- `accounts`: Individual accounts linked to categories (국민은행 적금, Apple 주식 etc.)
- `transactions`: Financial transactions with date and description
- `transaction_entries`: Individual debit/credit entries (enforces debit OR credit per entry with database triggers)
- `assets`: Investment assets with external data integration (stocks, ETFs, crypto)
- `asset_transactions`: Buy/sell/dividend transactions for investments
- `dividends`: Dividend tracking with currency handling
- `portfolio_snapshots`: Daily portfolio valuations
- `user_settings`: User preferences and configuration
- `audit_log`: Change tracking for all operations

### Component Architecture
```
src/
├── components/
│   ├── ui/              # Radix UI components (button, card, input, etc.)
│   ├── layout/          # Header, Sidebar, Layout
│   ├── accounts/        # Account management (AccountForm, AccountList)
│   └── [future]/        # transactions/, assets/, portfolio/
├── pages/               # Route components (Dashboard, Accounts)
├── lib/
│   ├── db/             # Drizzle schema and database connection
│   ├── api.ts          # API client for D1 database
│   ├── utils.ts        # Utility functions
│   └── validations.ts  # Zod validation schemas
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks (planned)

functions/               # Cloudflare Pages Functions (API)
├── types.d.ts          # Pages Functions type definitions
└── api/
    ├── health.ts       # Health check endpoint
    └── accounts/
        ├── index.ts    # GET /api/accounts, POST /api/accounts  
        └── [id].ts     # GET/PUT/DELETE /api/accounts/[id]
```

### Key Design Patterns

1. **Double-Entry Bookkeeping Validation**: Transaction entries must have either debitAmount OR creditAmount (never both), enforced at database level with triggers
2. **Category-Based Account System**: Accounts are organized by user-friendly categories with UI metadata (icons, colors, sort order)
3. **Investment Integration**: Unified accounting and investment tracking with proper double-entry principles
4. **Multi-Currency Support**: Built-in currency handling for international investments
5. **Type Safety**: Comprehensive TypeScript types in `src/types/index.ts`
6. **Functional Programming**: Emphasizes pure functions and immutable updates
7. **Data Integrity**: Database triggers ensure transaction balance and referential integrity

### Database Configuration

- **Development & Production**: Cloudflare D1 Database (pams-d1)
- **Database ID**: 94ae9517-be8e-4692-ab2d-31f5dccd7de5  
- **ORM**: Drizzle Kit with D1 HTTP driver for migrations and schema management
- **Constraints**: Database-level checks ensure double-entry integrity with automatic balance validation
- **Automation**: Full schema sync automation with comprehensive npm scripts
- **Data Integrity**: SQLite triggers ensure transaction balance within 0.01 precision
- **Referential Integrity**: Foreign key constraints with proper CASCADE/RESTRICT policies

## Important Implementation Notes

### Double-Entry Bookkeeping Rules
- Every transaction must have balanced debits and credits
- Account types follow accounting standards:
  - Assets increase with debits, decrease with credits
  - Liabilities/Equity increase with credits, decrease with debits
  - Income increases with credits, Expenses increase with debits
- Use `AccountType` enum: `'asset' | 'liability' | 'equity' | 'income' | 'expense'`

### Asset Management
- Category-based investment account organization (투자계좌 category)
- Asset types: `'stock' | 'etf' | 'bond' | 'crypto' | 'currency' | 'other'`
- Multi-currency support with automatic currency handling
- Data sources: `'yahoo' | 'manual' | 'api'` for flexible price integration
- Portfolio tracking with current holdings calculated from transaction history
- Dividend tracking with cumulative KRW conversion

### Validation and Forms
- All forms use Zod schemas for validation
- Form data types defined in `src/types/index.ts`
- React Hook Form integration for form handling

### Development Workflow
1. Database changes: Update `src/lib/db/schema.ts` → run `pnpm db:sync:local`
2. New features: Add types to `src/types/index.ts`, create components, add validation schemas
3. Path aliases: Use `@/` for `src/` imports (configured in Vite)
4. Testing: Use `pnpm db:status` to verify database state
5. Production: Use `pnpm db:sync:remote` after thorough local testing

## Current Implementation Status

Currently implemented:
- ✅ Database schema with all core tables
- ✅ Account management UI (AccountForm, AccountList)
- ✅ Basic routing (Dashboard, Accounts pages)
- ✅ Type system and validation schemas
- ✅ UI component library integration

Still needed:
- Transaction management UI
- Asset and investment tracking
- Portfolio reporting and charts
- API layer (planned for Cloudflare Workers)
- External data integration

## Key Files to Understand

- `src/lib/db/schema.ts` - Complete database schema definition
- `src/types/index.ts` - All TypeScript type definitions  
- `DATABASE_DESIGN.md` - Comprehensive database design with ERD and Korean documentation
- `src/components/accounts/` - Reference implementation for CRUD operations
- `drizzle.config.ts` - Database configuration and connection
- `scripts/seed.sql` - Default account categories and seed data
- `package.json` - Database management scripts for local and remote operations

This system prioritizes data integrity through proper double-entry bookkeeping while providing modern web interfaces for personal financial management.