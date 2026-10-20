import pg from 'pg'

const state = globalThis as typeof globalThis & { requestPool?: pg.Pool }
export const requestPool = state.requestPool ??= new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 })
