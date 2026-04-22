import { uuid, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const linksTable = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  displayTitle: varchar("display_title", { length: 255 }).default(""),
  mappedUrl: varchar("mapped_url", { length: 2048 }),
  mappedOn: timestamp("mapped_on", { withTimezone: true }),
  publicUrl: varchar("public_url", { length: 2048 }).notNull(),
  manageUrl: varchar("manage_url", { length: 2048 }).notNull(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  status: varchar("status", { length: 10 }).generatedAlwaysAs(
    sql`CASE 
          WHEN mapped_url IS NOT NULL THEN 'ready' 
          ELSE 'pending' 
        END`,
  ),
});
