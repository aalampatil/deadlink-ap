import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { env } from "../env.js";

export const db: NodePgDatabase = drizzle(env.DATABASE_URL!);
