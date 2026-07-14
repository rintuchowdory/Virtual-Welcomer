import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema/index.js";

// Re-exported so consumers never need their own direct "drizzle-orm"
// dependency, which would otherwise resolve to a second, structurally
// incompatible copy of drizzle-orm's classes (it uses private class
// fields for nominal typing) alongside the one baked into this
// package's own schema/query types.
export { eq, asc, and, or, desc, sql } from "drizzle-orm";
