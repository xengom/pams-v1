import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'd1',
  dbCredentials: {
    databaseId: '94ae9517-be8e-4692-ab2d-31f5dccd7de5',
  },
} satisfies Config