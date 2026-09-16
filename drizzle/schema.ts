import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const mahjongMatches = mysqlTable("mahjong_matches", {
  id: varchar("id", { length: 96 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  ruleSet: varchar("ruleSet", { length: 32 }).default("riichi").notNull(),
  seed: int("seed").notNull(),
  phase: varchar("phase", { length: 32 }).default("waiting").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const mahjongEvents = mysqlTable("mahjong_events", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  sequence: int("sequence").notNull(),
  eventType: varchar("eventType", { length: 48 }).notNull(),
  actorSeat: int("actorSeat"),
  actionJson: json("actionJson"),
  stateJson: json("stateJson").notNull(),
  stateHash: varchar("stateHash", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mahjongAnalyses = mysqlTable("mahjong_analyses", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  turn: int("turn").notNull(),
  seat: int("seat").notNull(),
  policy: varchar("policy", { length: 32 }).notNull(),
  analysisJson: json("analysisJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mahjongReviewMoments = mysqlTable("mahjong_review_moments", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  turn: int("turn").notNull(),
  category: varchar("category", { length: 32 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  originalActionJson: json("originalActionJson").notNull(),
  analysisJson: json("analysisJson"),
  stateHash: varchar("stateHash", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MahjongMatch = typeof mahjongMatches.$inferSelect;
export type MahjongEvent = typeof mahjongEvents.$inferSelect;
export type MahjongAnalysis = typeof mahjongAnalyses.$inferSelect;
export const mahjongAIDecisions = mysqlTable("mahjong_ai_decisions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  turn: int("turn").notNull(),
  seat: int("seat").notNull(),
  policy: varchar("policy", { length: 32 }).notNull(),
  actionJson: json("actionJson").notNull(),
  rationale: text("rationale").notNull(),
  objective: varchar("objective", { length: 32 }).notNull(),
  confidence: int("confidence").notNull(),
  contributionsJson: json("contributionsJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MahjongReviewMoment = typeof mahjongReviewMoments.$inferSelect;
export type MahjongAIDecision = typeof mahjongAIDecisions.$inferSelect;

export const mahjongBenchmarkRuns = mysqlTable("mahjong_benchmark_runs", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  seedsJson: json("seedsJson").notNull(),
  metricsJson: json("metricsJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MahjongBenchmarkRun = typeof mahjongBenchmarkRuns.$inferSelect;
