import { drizzle } from "drizzle-orm/neon-http";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

let _db: NeonHttpDatabase<Record<string, never>> | null = null;

export const getDb = () => {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _db = drizzle(process.env.DATABASE_URL);
  }
  return _db;
};

// For backward compatibility - lazy getter
export const db = new Proxy({} as NeonHttpDatabase<Record<string, never>>, {
  get(target, prop) {
    return getDb()[prop as keyof NeonHttpDatabase<Record<string, never>>];
  },
});
