import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, mahjongAIDecisions, mahjongAnalyses, mahjongBenchmarkRuns, mahjongEvents, mahjongMatches, mahjongReviewMoments, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function persistMahjongMatch(input: { id: string; ownerUserId?: number; seed: number; phase: string }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongMatches).values({ id: input.id, ownerUserId: input.ownerUserId, seed: input.seed, phase: input.phase }).onDuplicateKeyUpdate({ set: { phase: input.phase } });
  return true;
}

export async function persistMahjongEvent(input: { id: string; ownerUserId?: number; matchId: string; sequence: number; eventType: string; actorSeat?: number; actionJson?: unknown; stateJson: unknown; stateHash: string }) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(mahjongEvents).values(input as never);
    return true;
  } catch (error) {
    const candidate = error as { code?: string; message?: string; sqlMessage?: string };
    const message = [candidate.code, candidate.message, candidate.sqlMessage, String(error)].filter(Boolean).join(" ").toLowerCase();
    if (message.includes("duplicate") || message.includes("er_dup_entry") || message.includes("primary")) return true;
    throw error;
  }
}

export async function persistMahjongAnalysis(input: { id: string; ownerUserId?: number; matchId: string; turn: number; seat: number; policy: string; analysisJson: unknown }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongAnalyses).values(input as never);
  return true;
}

export async function persistMahjongReviewMoment(input: { id: string; ownerUserId?: number; matchId: string; turn: number; category: string; title: string; originalActionJson: unknown; analysisJson?: unknown; stateHash: string }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongReviewMoments).values(input as never);
  return true;
}

export async function listMahjongReviewMoments(matchId: string, ownerUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mahjongReviewMoments).where(and(eq(mahjongReviewMoments.matchId, matchId), eq(mahjongReviewMoments.ownerUserId, ownerUserId)));
}

export async function persistMahjongAIDecision(input: { id: string; ownerUserId?: number; matchId: string; turn: number; seat: number; policy: string; actionJson: unknown; rationale: string; objective: string; confidence: number; contributionsJson: unknown }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongAIDecisions).values({ ...input, confidence: Math.round(input.confidence * 100) } as never);
  return true;
}

export async function persistMahjongBenchmarkRun(input: { id: string; ownerUserId: number; seedsJson: unknown; metricsJson: unknown }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongBenchmarkRuns).values(input as never);
  return true;
}

export async function listMahjongBenchmarkRuns(ownerUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mahjongBenchmarkRuns).where(eq(mahjongBenchmarkRuns.ownerUserId, ownerUserId));
}
