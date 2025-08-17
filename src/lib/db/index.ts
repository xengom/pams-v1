import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// 개발 환경에서는 로컬 D1 사용
export function getDB(env?: any) {
  if (typeof window !== 'undefined') {
    throw new Error('Database should only be accessed on the server side')
  }
  
  // Cloudflare Pages Functions 환경에서 env.DB 사용
  // 로컬 개발에서는 wrangler dev를 통해 접근
  const db = env?.DB || globalThis.DB
  
  if (!db) {
    throw new Error('Database not available. Make sure to run with wrangler dev')
  }
  
  return drizzle(db, { schema })
}

export * from './schema'
export type DB = ReturnType<typeof getDB>