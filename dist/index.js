// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var mahjongMatches = mysqlTable("mahjong_matches", {
  id: varchar("id", { length: 96 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  ruleSet: varchar("ruleSet", { length: 32 }).default("riichi").notNull(),
  seed: int("seed").notNull(),
  phase: varchar("phase", { length: 32 }).default("waiting").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var mahjongEvents = mysqlTable("mahjong_events", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  sequence: int("sequence").notNull(),
  eventType: varchar("eventType", { length: 48 }).notNull(),
  actorSeat: int("actorSeat"),
  actionJson: json("actionJson"),
  stateJson: json("stateJson").notNull(),
  stateHash: varchar("stateHash", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var mahjongAnalyses = mysqlTable("mahjong_analyses", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  turn: int("turn").notNull(),
  seat: int("seat").notNull(),
  policy: varchar("policy", { length: 32 }).notNull(),
  analysisJson: json("analysisJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var mahjongReviewMoments = mysqlTable("mahjong_review_moments", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  matchId: varchar("matchId", { length: 96 }).notNull(),
  turn: int("turn").notNull(),
  category: varchar("category", { length: 32 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  originalActionJson: json("originalActionJson").notNull(),
  analysisJson: json("analysisJson"),
  stateHash: varchar("stateHash", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var mahjongAIDecisions = mysqlTable("mahjong_ai_decisions", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var mahjongBenchmarkRuns = mysqlTable("mahjong_benchmark_runs", {
  id: varchar("id", { length: 128 }).primaryKey(),
  ownerUserId: int("ownerUserId"),
  seedsJson: json("seedsJson").notNull(),
  metricsJson: json("metricsJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function persistMahjongMatch(input) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongMatches).values({ id: input.id, ownerUserId: input.ownerUserId, seed: input.seed, phase: input.phase }).onDuplicateKeyUpdate({ set: { phase: input.phase } });
  return true;
}
async function persistMahjongEvent(input) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(mahjongEvents).values(input);
    return true;
  } catch (error) {
    const candidate = error;
    const message = [candidate.code, candidate.message, candidate.sqlMessage, String(error)].filter(Boolean).join(" ").toLowerCase();
    if (message.includes("duplicate") || message.includes("er_dup_entry") || message.includes("primary")) return true;
    throw error;
  }
}
async function persistMahjongAnalysis(input) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongAnalyses).values(input);
  return true;
}
async function persistMahjongReviewMoment(input) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongReviewMoments).values(input);
  return true;
}
async function persistMahjongAIDecision(input) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongAIDecisions).values({ ...input, confidence: Math.round(input.confidence * 100) });
  return true;
}
async function persistMahjongBenchmarkRun(input) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(mahjongBenchmarkRuns).values(input);
  return true;
}
async function listMahjongBenchmarkRuns(ownerUserId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mahjongBenchmarkRuns).where(eq(mahjongBenchmarkRuns.ownerUserId, ownerUserId));
}

// server/_core/cookies.ts
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getParentDomain(hostname) {
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return void 0;
  }
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return void 0;
  }
  return "." + parts.slice(-2).join(".");
}
function getSessionCookieOptions(req) {
  const hostname = req.hostname;
  const domain = getParentDomain(hostname);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// lib/_core/dev-log.ts
function isDevelopmentRuntime() {
  return typeof process === "undefined" || process.env?.NODE_ENV !== "production";
}
function devLog(...args) {
  if (isDevelopmentRuntime()) console.log(...args);
}

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(GET_USER_INFO_PATH, {
      accessToken: token.accessToken
    });
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(platforms.filter((p) => typeof p === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      devLog("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    }
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = token || cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now2 = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now2,
    updatedAt: now2,
    lastSignedIn: now2,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function syncUser(userInfo) {
  if (!userInfo.openId) {
    throw new Error("openId missing from user info");
  }
  const lastSignedIn = /* @__PURE__ */ new Date();
  await upsertUser({
    openId: userInfo.openId,
    name: userInfo.name || null,
    email: userInfo.email ?? null,
    loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
    lastSignedIn
  });
  const saved = await getUserByOpenId(userInfo.openId);
  return saved ?? {
    openId: userInfo.openId,
    name: userInfo.name,
    email: userInfo.email,
    loginMethod: userInfo.loginMethod ?? null,
    lastSignedIn
  };
}
function buildUserResponse(user) {
  return {
    id: user?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? /* @__PURE__ */ new Date()).toISOString()
  };
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const frontendUrl = process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
      res.redirect(302, frontendUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app.get("/api/oauth/mobile", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const user = await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({
        app_session_id: sessionToken,
        user: buildUserResponse(user)
      });
    } catch (error) {
      console.error("[OAuth] Mobile exchange failed", error);
      res.status(500).json({ error: "OAuth mobile exchange failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
  app.post("/api/auth/session", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/session failed:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error("tool_choice 'required' was provided but no tools were configured");
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error("responseFormat json_schema requires a defined schema object");
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
var RETRY_MAX_RETRIES = 4;
var RETRY_BASE_DELAY_MS = 500;
var RETRY_MAX_DELAY_MS = 3e4;
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var parseRetryAfter = (value) => {
  if (!value) return void 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1e3);
  const at = Date.parse(value);
  return Number.isNaN(at) ? void 0 : Math.max(0, at - Date.now());
};
var computeBackoffDelay = (attempt, retryAfterMs) => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};
var fetchWithBackoff = async (url, init) => {
  let lastError;
  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, init);
      if (response.ok || attempt === RETRY_MAX_RETRIES) {
        return response;
      }
      const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"));
      try {
        await response.body?.cancel();
      } catch {
      }
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after status ${response.status}`
      );
      await sleep(computeBackoffDelay(attempt, retryAfterMs));
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after network error`
      );
      await sleep(computeBackoffDelay(attempt));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("LLM request failed after exhausting retries");
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    model,
    thinking,
    reasoning,
    maxTokens,
    max_tokens
  } = params;
  const payload = {
    messages: messages.map(normalizeMessage)
  };
  if (model) {
    payload.model = model;
  }
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(toolChoice || tool_choice, tools);
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  const resolvedMaxTokens = max_tokens ?? maxTokens;
  if (typeof resolvedMaxTokens === "number") {
    payload.max_tokens = resolvedMaxTokens;
  }
  if (thinking) {
    payload.thinking = thinking;
  }
  if (reasoning) {
    payload.reasoning = reasoning;
  }
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetchWithBackoff(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`);
  }
  return await response.json();
}
async function invokeLLMStream(params) {
  assertApiKey();
  const { messages, model, maxTokens, max_tokens, signal } = params;
  const payload = { messages: messages.map(normalizeMessage), stream: true };
  if (model) payload.model = model;
  const resolvedMaxTokens = max_tokens ?? maxTokens;
  if (typeof resolvedMaxTokens === "number") payload.max_tokens = resolvedMaxTokens;
  const response = await fetchWithBackoff(resolveApiUrl(), {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${ENV.forgeApiKey}` },
    body: JSON.stringify(payload),
    signal
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM stream failed: ${response.status} ${response.statusText} \u2013 ${errorText}`);
  }
  return response;
}

// lib/mahjong-tiles.ts
var SUITED_TILES = [
  ...["m", "p", "s"].flatMap(
    (suit) => Array.from({ length: 9 }, (_, index) => `${suit}${index + 1}`)
  )
];
var HONOR_TILES = Array.from({ length: 7 }, (_, index) => `z${index + 1}`);
var ALL_TILE_CODES = [...SUITED_TILES, ...HONOR_TILES];
function tileNumber(code) {
  return Number(code.slice(1));
}
function tileSuit(code) {
  return code[0];
}
function isHonor(code) {
  return tileSuit(code) === "z";
}
function isTerminal(code) {
  return !isHonor(code) && (tileNumber(code) === 1 || tileNumber(code) === 9);
}
function isSimple(code) {
  return !isHonor(code) && !isTerminal(code);
}
function createWall() {
  return ALL_TILE_CODES.flatMap(
    (code) => Array.from({ length: 4 }, (_, copy) => ({
      id: `${code}-${copy + 1}`,
      code,
      copy: copy + 1,
      red: code === "m5" && copy === 0
    }))
  );
}
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = 1664525 * state + 1013904223 >>> 0;
    return state / 4294967296;
  };
}
function shuffle(items, seed) {
  const output = [...items];
  const random = seededRandom(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}
function sortTiles(tiles) {
  return [...tiles].sort((a, b) => {
    const suitOrder = tileSuit(a.code).localeCompare(tileSuit(b.code));
    return suitOrder || tileNumber(a.code) - tileNumber(b.code) || a.copy - b.copy;
  });
}
function countTileCodes(tiles) {
  const counts = /* @__PURE__ */ new Map();
  for (const tile of tiles) counts.set(tile.code, (counts.get(tile.code) ?? 0) + 1);
  return counts;
}

// lib/mahjong-rules.ts
function codeKey(code) {
  return `${code[0]}${code[1]}`;
}
function canFormMelds(counts, remaining) {
  if (remaining === 0) return true;
  const first = [...counts.entries()].find(([, count]) => count > 0)?.[0];
  if (!first) return false;
  const current = counts.get(first) ?? 0;
  if (current >= 3) {
    counts.set(first, current - 3);
    if (canFormMelds(counts, remaining - 3)) return true;
    counts.set(first, current);
  }
  const suit = first[0];
  const number = Number(first[1]);
  if (!isHonor(first) && number <= 7) {
    const second = `${suit}${number + 1}`;
    const third = `${suit}${number + 2}`;
    if ((counts.get(second) ?? 0) > 0 && (counts.get(third) ?? 0) > 0) {
      counts.set(first, current - 1);
      counts.set(second, (counts.get(second) ?? 0) - 1);
      counts.set(third, (counts.get(third) ?? 0) - 1);
      if (canFormMelds(counts, remaining - 3)) return true;
      counts.set(first, current);
      counts.set(second, (counts.get(second) ?? 0) + 1);
      counts.set(third, (counts.get(third) ?? 0) + 1);
    }
  }
  return false;
}
function isWinningHand(tiles) {
  if (tiles.length !== 14) return false;
  const counts = countTileCodes(tiles);
  for (const [pairCode, pairCount] of counts.entries()) {
    if (pairCount < 2) continue;
    counts.set(pairCode, pairCount - 2);
    if (canFormMelds(new Map([...counts].map(([code, count]) => [codeKey(code), count])), 12)) return true;
    counts.set(pairCode, pairCount);
  }
  return false;
}
function isTenpai(tiles, wallCodes) {
  if (tiles.length !== 13) return false;
  return wallCodes.some((code) => isWinningHand([...tiles, { id: `test-${code}`, code, copy: 0, red: false }]));
}
function isFuriten(state, seat) {
  const player = state.players[seat];
  const winningDiscardCodes = /* @__PURE__ */ new Set();
  for (const discard of player.discards) winningDiscardCodes.add(discard.tile.code);
  return state.lastDiscard?.seat !== seat && state.lastDiscard ? winningDiscardCodes.has(state.lastDiscard.tile.code) : false;
}
function canDeclareRiichi(state, seat) {
  const player = state.players[seat];
  if (state.phase !== "playing") return { allowed: false, reason: "The hand is not active." };
  if (state.currentSeat !== seat) return { allowed: false, reason: "It is not this player\u2019s turn." };
  if (player.riichi) return { allowed: false, reason: "Riichi has already been declared." };
  if (player.score < 1e3) return { allowed: false, reason: "At least 1,000 points are required." };
  if (!isTenpai(player.hand, state.wall.map((tile) => tile.code))) return { allowed: false, reason: "The hand must be tenpai." };
  return { allowed: true };
}
function canTsumo(state, seat) {
  const player = state.players[seat];
  if (state.currentSeat !== seat) return { allowed: false, reason: "It is not this player\u2019s turn." };
  if (player.hand.length !== 14) return { allowed: false, reason: "A tsumo hand must contain 14 tiles." };
  if (!isWinningHand(player.hand)) return { allowed: false, reason: "The tiles do not form a complete hand." };
  return { allowed: true };
}
function canRon(state, seat) {
  const discard = state.lastDiscard;
  if (!discard || discard.seat === seat) return { allowed: false, reason: "There is no opponent discard to claim." };
  if (isFuriten(state, seat)) return { allowed: false, reason: "The player is furiten." };
  const player = state.players[seat];
  if (!isWinningHand([...player.hand, discard.tile])) return { allowed: false, reason: "The discard does not complete the hand." };
  return { allowed: true };
}
function canPon(playerTiles, discard) {
  return playerTiles.filter((tile) => tile.code === discard.code).length >= 2;
}
function canKan(playerTiles, discard) {
  return playerTiles.filter((tile) => tile.code === discard.code).length >= 3;
}
function canChi(playerSeat, discardSeat, playerTiles, discard) {
  if ((playerSeat + 3) % 4 !== discardSeat) return false;
  if (isHonor(discard.code)) return false;
  const number = tileNumber(discard.code);
  const suit = tileSuit(discard.code);
  const codes = new Set(playerTiles.map((tile) => tile.code));
  const choices = [];
  if (number >= 3) choices.push([`${suit}${number - 2}`, `${suit}${number - 1}`]);
  if (number >= 2 && number <= 8) choices.push([`${suit}${number - 1}`, `${suit}${number + 1}`]);
  if (number <= 7) choices.push([`${suit}${number + 1}`, `${suit}${number + 2}`]);
  return choices.some((choice) => choice.every((code) => codes.has(code)));
}

// lib/mahjong-engine.ts
var WINDS = ["east", "south", "west", "north"];
function drawFromWall(state, seat) {
  const tile = state.wall.shift();
  if (tile) state.players[seat].hand.push(tile);
  return tile;
}
function createGame(seed = Date.now(), names = ["You", "Mika", "Ren", "Sora"]) {
  const wall = shuffle(createWall(), seed);
  const deadWall = wall.splice(0, 14);
  const players = [0, 1, 2, 3].map((seat) => ({
    seat,
    displayName: names[seat] ?? `Player ${seat + 1}`,
    wind: WINDS[seat],
    score: 25e3,
    hand: [],
    melds: [],
    discards: [],
    riichi: false,
    connected: true
  }));
  for (let round2 = 0; round2 < 13; round2 += 1) {
    for (const player of players) {
      const tile = wall.shift();
      if (tile) player.hand.push(tile);
    }
  }
  for (const player of players) player.hand = sortTiles(player.hand);
  const indicators = deadWall.slice(0, 1);
  return {
    id: `match-${seed.toString(36)}`,
    ruleSet: "riichi",
    phase: "playing",
    roundWind: "east",
    handNumber: 1,
    honba: 0,
    riichiSticks: 0,
    dealer: 0,
    currentSeat: 0,
    wall,
    deadWall,
    dora: { indicators, revealed: indicators.map((tile) => tile) },
    players,
    turn: 0,
    seed
  };
}
function hasTile(state, seat, tileId) {
  return state.players[seat].hand.find((tile) => tile.id === tileId);
}
function handShanten(tiles) {
  const counts = /* @__PURE__ */ new Map();
  for (const tile of tiles) counts.set(tile.code, (counts.get(tile.code) ?? 0) + 1);
  let pairs = 0;
  let groups = 0;
  for (const count of counts.values()) {
    if (count >= 3) groups += 1;
    if (count >= 2) pairs += 1;
  }
  const sequences = ["m", "p", "s"].reduce((total, suit) => {
    let found = 0;
    for (let number = 1; number <= 7; number += 1) {
      if (counts.has(`${suit}${number}`) && counts.has(`${suit}${number + 1}`) && counts.has(`${suit}${number + 2}`)) found += 1;
    }
    return total + found;
  }, 0);
  groups += sequences;
  const usefulGroups = Math.min(groups, 4);
  const usefulPairs = Math.min(Math.max(pairs - Math.min(usefulGroups, pairs), 0), 1);
  return Math.max(0, 8 - usefulGroups * 2 - usefulPairs);
}
function estimateUkeire(tiles) {
  const counts = /* @__PURE__ */ new Map();
  for (const tile of tiles) counts.set(tile.code, (counts.get(tile.code) ?? 0) + 1);
  let value = 0;
  for (const tile of tiles) {
    if (isSimple(tile.code)) value += 2;
    else if (isTerminal(tile.code)) value += 1;
    else if (isHonor(tile.code)) value += counts.get(tile.code) === 2 ? 1 : 0;
  }
  return Math.min(23, value);
}
function legalActions(state, seat = state.currentSeat) {
  if (state.phase !== "playing" || seat !== state.currentSeat) return [];
  const player = state.players[seat];
  const actions = player.hand.map((tile) => ({
    type: "discard",
    seat,
    tileIds: [tile.id],
    label: `Discard ${tile.code}`,
    enabled: true
  }));
  const riichi = canDeclareRiichi(state, seat);
  if (riichi.allowed) actions.push({ type: "riichi", seat, tileIds: player.hand.map((tile) => tile.id), label: "Declare riichi", enabled: true });
  const tsumo = canTsumo(state, seat);
  if (tsumo.allowed) actions.push({ type: "tsumo", seat, label: "Tsumo", enabled: true });
  if (state.lastDiscard && state.lastDiscard.seat !== seat) {
    const ron = canRon(state, seat);
    if (ron.allowed) actions.push({ type: "ron", seat, label: "Ron", enabled: true });
    if (canPon(player.hand, state.lastDiscard.tile)) actions.push({ type: "pon", seat, tileIds: player.hand.filter((tile) => tile.code === state.lastDiscard?.tile.code).slice(0, 2).map((tile) => tile.id), label: "Pon", enabled: true });
    if (canKan(player.hand, state.lastDiscard.tile)) actions.push({ type: "kan", seat, tileIds: player.hand.filter((tile) => tile.code === state.lastDiscard?.tile.code).slice(0, 3).map((tile) => tile.id), label: "Kan", enabled: true });
    if (canChi(seat, state.lastDiscard.seat, player.hand, state.lastDiscard.tile)) actions.push({ type: "chi", seat, label: "Chi", enabled: true });
    actions.push({ type: "pass", seat, label: "Pass", enabled: true });
  }
  return actions;
}
function advanceToNextSeat(state) {
  state.currentSeat = (state.currentSeat + 1) % 4;
  state.turn += 1;
}
function isValidChiSelection(tiles, discard) {
  if (tiles.length !== 2 || discard.code[0] === "z") return false;
  const suit = tileSuit(discard.code);
  const number = tileNumber(discard.code);
  const selectedCodes = new Set(tiles.map((tile) => tile.code));
  const choices = [];
  if (number >= 3) choices.push([`${suit}${number - 2}`, `${suit}${number - 1}`]);
  if (number >= 2 && number <= 8) choices.push([`${suit}${number - 1}`, `${suit}${number + 1}`]);
  if (number <= 7) choices.push([`${suit}${number + 1}`, `${suit}${number + 2}`]);
  return choices.some((choice) => choice.every((code) => selectedCodes.has(code)));
}
function applyAction(input, action) {
  const state = structuredClone(input);
  if (state.phase !== "playing") throw new Error("MATCH_NOT_PLAYING");
  if (action.seat !== state.currentSeat) throw new Error("NOT_YOUR_TURN");
  const legal = legalActions(state, action.seat).some((candidate) => candidate.type === action.type && (action.type === "chi" || !action.tileIds?.[0] || candidate.tileIds?.includes(action.tileIds[0])));
  if (!legal) throw new Error("ILLEGAL_ACTION");
  const player = state.players[action.seat];
  if (action.type === "discard") {
    const tile = hasTile(state, action.seat, action.tileIds?.[0]);
    if (!tile) throw new Error("TILE_NOT_IN_HAND");
    player.hand = player.hand.filter((candidate) => candidate.id !== tile.id);
    const discard = { tile, seat: action.seat, tsumogiri: Boolean(action.tsumogiri), turn: state.turn };
    player.discards.push(discard);
    state.lastDiscard = discard;
    advanceToNextSeat(state);
    drawFromWall(state, state.currentSeat);
  } else if (action.type === "riichi") {
    player.riichi = true;
    player.score -= 1e3;
    state.riichiSticks += 1;
    const discard = hasTile(state, action.seat, action.tileIds?.[0]);
    if (!discard) throw new Error("RIICHI_TILE_NOT_IN_HAND");
    player.hand = player.hand.filter((candidate) => candidate.id !== discard.id);
    const riichiDiscard = { tile: discard, seat: action.seat, tsumogiri: false, riichiDeclaration: true, turn: state.turn };
    player.discards.push(riichiDiscard);
    state.lastDiscard = riichiDiscard;
    advanceToNextSeat(state);
    drawFromWall(state, state.currentSeat);
  } else if (action.type === "tsumo" || action.type === "ron") {
    state.phase = "hand_complete";
    state.winner = action.seat;
    state.result = createBasicResult(state, action.seat, action.type);
  } else if (action.type === "pon" || action.type === "kan" || action.type === "chi") {
    const discard = state.lastDiscard;
    if (!discard || discard.seat === action.seat) throw new Error("CLAIM_NOT_AVAILABLE");
    const selectedIds = action.tileIds ?? [];
    const selected = selectedIds.map((id) => hasTile(state, action.seat, id));
    if (selected.some((tile) => !tile)) throw new Error("CLAIM_TILE_NOT_IN_HAND");
    const tiles = selected;
    const expectedCount = action.type === "chi" || action.type === "pon" ? 2 : 3;
    if (tiles.length !== expectedCount) throw new Error("CLAIM_TILE_COUNT_INVALID");
    if (action.type === "pon" && !canPon(player.hand, discard.tile)) throw new Error("PON_NOT_ALLOWED");
    if (action.type === "kan" && !canKan(player.hand, discard.tile)) throw new Error("KAN_NOT_ALLOWED");
    if (action.type === "chi" && (!canChi(action.seat, discard.seat, player.hand, discard.tile) || !isValidChiSelection(tiles, discard.tile))) throw new Error("CHI_NOT_ALLOWED");
    if (action.type !== "chi" && tiles.some((tile) => tile.code !== discard.tile.code)) throw new Error("CLAIM_TILE_MISMATCH");
    player.hand = player.hand.filter((candidate) => !selectedIds.includes(candidate.id));
    player.melds.push({ type: action.type, tiles: [...tiles, discard.tile], fromSeat: discard.seat, open: true });
    state.currentSeat = action.seat;
  } else if (action.type === "pass") {
    advanceToNextSeat(state);
    drawFromWall(state, state.currentSeat);
  }
  player.hand = sortTiles(player.hand);
  return state;
}
function createBasicResult(state, winner, method) {
  const points = method === "tsumo" ? 2e3 : 1e3;
  const scoreDeltas = { 0: -points, 1: -points, 2: -points, 3: -points };
  scoreDeltas[winner] = points * 3;
  return { winner, method, points, han: 1, fu: 30, yaku: [method === "tsumo" ? "Menzen Tsumo" : "Ron"], scoreDeltas };
}

// server/mahjong-ai.ts
var POLICY_WEIGHTS = {
  aggressive: { shantenAfter: -1.9, ukeire: 1.5, tileDanger: -0.2, valuePotential: 0.8, shapeFlexibility: 0.8, scorePressure: 0.3 },
  balanced: { shantenAfter: -2, ukeire: 1.2, tileDanger: -0.8, valuePotential: 0.7, shapeFlexibility: 1, scorePressure: 0.5 },
  defensive: { shantenAfter: -1.3, ukeire: 0.7, tileDanger: -1.8, valuePotential: 0.4, shapeFlexibility: 0.5, scorePressure: 0.8 },
  "human-like": { shantenAfter: -1.7, ukeire: 0.95, tileDanger: -0.95, valuePotential: 0.65, shapeFlexibility: 0.85, scorePressure: 0.65 }
};
function round(value) {
  return Number(value.toFixed(3));
}
function visibleTileCounts(state) {
  const visible = [...state.deadWall, ...state.dora.indicators];
  for (const player of state.players) visible.push(...player.discards.map((discard) => discard.tile), ...player.melds.flatMap((meld) => meld.tiles));
  return countTileCodes(visible);
}
function tileDangerScore(state, seat, code) {
  const visible = visibleTileCounts(state);
  const sameSuitDiscards = state.players.filter((player) => player.seat !== seat).flatMap((player) => player.discards).filter((discard) => tileSuit(discard.tile.code) === tileSuit(code)).length;
  const isGenbutsu = state.players.some((player) => player.seat !== seat && player.riichi && player.discards.some((discard) => discard.tile.code === code));
  const base = isHonor(code) ? 0.45 : isTerminal(code) ? 0.35 : 0.58;
  const visibilityRelief = Math.min(0.45, (visible.get(code) ?? 0) * 0.12 + sameSuitDiscards * 0.04);
  return round(Math.max(0, Math.min(1, base - visibilityRelief - (isGenbutsu ? 0.5 : 0))));
}
function valuePotential(tiles, code) {
  const count = tiles.get(code) ?? 0;
  if (isHonor(code)) return count >= 2 ? 0.95 : 0.25;
  if (isTerminal(code)) return count >= 2 ? 0.7 : 0.35;
  return isSimple(code) ? 0.55 : 0.45;
}
function shapeFlexibility(tiles, code) {
  if (isHonor(code)) return 0.15;
  const suit = tileSuit(code);
  const number = tileNumber(code);
  const neighbors = [number - 2, number - 1, number + 1, number + 2].filter((candidate) => candidate >= 1 && candidate <= 9).reduce((sum, candidate) => sum + (tiles.get(`${suit}${candidate}`) ?? 0), 0);
  return round(Math.min(1, neighbors / 4));
}
function scoreFeatures(features, policy, coachingMode = "balanced") {
  const base = POLICY_WEIGHTS[policy];
  const weights = coachingMode === "defensive" ? { ...base, tileDanger: base.tileDanger + 0.24, scorePressure: base.scorePressure - 0.08 } : coachingMode === "exploratory" ? { ...base, valuePotential: base.valuePotential + 0.16, shapeFlexibility: base.shapeFlexibility + 0.1, tileDanger: base.tileDanger - 0.1 } : base;
  return round(Object.keys(weights).reduce((score, key) => score + features[key] * weights[key], 0));
}
function candidateDiscards(state, seat, policy, coachingMode = "balanced") {
  const player = state.players[seat];
  const currentShanten = handShanten(player.hand);
  const counts = countTileCodes(player.hand);
  const scorePressure = player.score < 2e4 ? 0.8 : player.score > 3e4 ? 0.25 : 0.5;
  return player.hand.map((tile) => {
    const remaining = player.hand.filter((candidate) => candidate.id !== tile.id);
    const features = {
      shantenAfter: handShanten(remaining),
      ukeire: estimateUkeire(remaining) / 23,
      tileDanger: tileDangerScore(state, seat, tile.code),
      valuePotential: valuePotential(counts, tile.code),
      shapeFlexibility: shapeFlexibility(counts, tile.code),
      scorePressure
    };
    const objective = policy === "aggressive" ? "speed" : policy === "defensive" ? "defense" : features.valuePotential > 0.7 ? "value" : "speed";
    const score = scoreFeatures({ ...features, shantenAfter: features.shantenAfter - currentShanten }, policy, coachingMode);
    const confidence = Math.max(0.28, Math.min(0.94, 0.52 + Math.abs(score) / 8));
    return {
      action: { type: "discard", seat, tileIds: [tile.id], tileCodes: [tile.code] },
      objective,
      confidence: round(confidence),
      rationale: objective === "defense" ? `Defense line: ${features.tileDanger < 0.3 ? "the discard is relatively safe from visible evidence" : "the safety cost is elevated"}; it preserves a fold path at ${features.shantenAfter} shanten with approximately ${Math.round(features.ukeire * 23)} useful draws.` : objective === "value" ? `Value line: the hand keeps ${Math.round(features.valuePotential * 100)}% value potential while accepting a speed trade-off at ${features.shantenAfter} shanten and ${Math.round(features.ukeire * 23)} useful draws.` : `Speed line: it reaches ${features.shantenAfter} shanten with approximately ${Math.round(features.ukeire * 23)} useful draws and ${Math.round(features.shapeFlexibility * 100)}% shape flexibility; review the danger estimate before committing.`,
      shantenAfter: features.shantenAfter,
      ukeire: Math.round(features.ukeire * 23),
      featureVector: features,
      score
    };
  }).sort((a, b) => b.score - a.score).slice(0, 4);
}
function heuristicAnalysis(state, seat, policy = "balanced", coachingMode = "balanced") {
  const player = state.players[seat];
  const alternatives = candidateDiscards(state, seat, policy, coachingMode);
  const riichiOpponents = state.players.filter((candidate) => candidate.seat !== seat && candidate.riichi).length;
  const [top, runnerUp] = alternatives;
  const topFeatures = top;
  const runnerUpFeatures = runnerUp;
  const topTile = top?.action.tileCodes?.[0];
  const runnerUpTile = runnerUp?.action.tileCodes?.[0];
  const confidenceGap = round(Math.max(0, (top?.confidence ?? 0) - (runnerUp?.confidence ?? 0)));
  const ukeireDelta = (top?.ukeire ?? 0) - (runnerUp?.ukeire ?? 0);
  const evidenceQuality = round(Math.min(1, 0.42 + Math.min(0.22, state.wall.length / 300) + Math.min(0.18, player.discards.length * 0.04) + Math.min(0.18, riichiOpponents * 0.09)));
  const confidenceBand = confidenceGap >= 0.12 && (top?.confidence ?? 0) >= 0.76 ? "decisive" : confidenceGap <= 0.05 || evidenceQuality < 0.52 ? "uncertain" : "close";
  const confidenceBasis = confidenceBand === "decisive" ? "The leading line has a meaningful separation from the runner-up and is supported by the visible state." : confidenceBand === "close" ? "The leading line is slightly ahead, but the runner-up remains a credible table choice." : "The visible evidence is incomplete or the top two lines are close; treat this as a study prompt, not a command.";
  const utilityDelta = round((topFeatures?.score ?? 0) - (runnerUpFeatures?.score ?? 0));
  const counterfactualLesson = top?.objective === "defense" ? "The counterfactual line may gain speed, but it spends more of the visible safety budget." : top?.objective === "value" ? "The counterfactual line reaches faster, but gives up part of the hand\u2019s scoring ceiling." : "The counterfactual line is playable, but gives up useful-draw flexibility for a narrower benefit.";
  const riskNote = riichiOpponents > 0 ? "Active riichi makes the risk estimate more fragile; confirm a visible safe tile before pushing." : player.score < 2e4 ? "The score deficit creates a reason to accept measured risk, not to ignore danger signals." : "No immediate riichi threat is visible, so the main risk is committing too early to a narrow shape.";
  const keyTradeoff = top?.objective === "defense" ? "The recommendation prioritizes visible safety signals over maximum speed." : top?.objective === "value" ? "The recommendation preserves value potential while accepting a measured speed trade-off." : top?.objective === "score" ? "The recommendation responds to score pressure while preserving a playable hand shape." : "The recommendation prioritizes useful draws and flexible shape for faster development.";
  return {
    recommendationId: `heuristic-${state.id}-${state.turn}-${seat}-${policy}-${coachingMode}`,
    policyName: policy,
    observedFacts: [
      `Current player has ${player.hand.length} tiles in hand and ${player.score.toLocaleString()} points.`,
      `Current estimated shanten is ${handShanten(player.hand)} using a lightweight shape estimator; the leading line is ${topTile ?? "not available"}.`,
      `${riichiOpponents} visible opponents have declared riichi.`,
      `${state.wall.length} tiles remain in the live wall, so useful-draw estimates should be treated as directional rather than exact.`
    ],
    inferredSignals: [
      { label: "Hand-shape flexibility", confidence: round(Math.min(0.92, 0.46 + (topFeatures?.featureVector?.shapeFlexibility ?? 0) * 0.45)) },
      { label: "Opponent danger estimate", confidence: round(riichiOpponents ? Math.min(0.86, 0.57 + riichiOpponents * 0.12) : 0.36) },
      { label: "Score pressure", confidence: round(player.score < 2e4 || player.score > 3e4 ? 0.63 : 0.42) }
    ],
    uncertainty: riichiOpponents > 1 ? "high" : "medium",
    alternatives,
    recommendationSummary: {
      recommendedTile: topTile,
      runnerUpTile,
      confidenceGap,
      ukeireDelta,
      keyTradeoff,
      confidenceBand,
      evidenceQuality,
      confidenceBasis,
      learningFocus: top?.objective ?? "speed",
      counterfactualLesson,
      riskNote,
      utilityDelta: Number.isFinite(utilityDelta) ? utilityDelta : 0
    },
    disclaimer: "This is an estimate from visible state and a lightweight policy. It is not a guaranteed winning move and does not reveal concealed tiles."
  };
}
async function comparePolicies(state, seat, policies = ["aggressive", "balanced", "defensive", "human-like"]) {
  return policies.map((policy) => heuristicAnalysis(state, seat, policy));
}
function compareCoachingModes(state, seat) {
  return ["defensive", "balanced", "exploratory"].map((coachingMode) => heuristicAnalysis(state, seat, "balanced", coachingMode));
}
function isSafeExplanation(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return typeof candidate.explanation === "string" && candidate.explanation.length >= 20 && candidate.explanation.length <= 700 && ["low", "medium", "high"].includes(String(candidate.uncertainty));
}
async function explainAnalysisWithLLM(analysis) {
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You explain Mahjong AI recommendations. Never claim hidden tiles are known. Keep observed facts separate from inferences. Mention alternatives when useful. Return only the requested JSON." },
        { role: "user", content: JSON.stringify({ analysis }) }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "mahjong_explanation",
          strict: true,
          schema: {
            type: "object",
            properties: { explanation: { type: "string" }, uncertainty: { type: "string", enum: ["low", "medium", "high"] } },
            required: ["explanation", "uncertainty"],
            additionalProperties: false
          }
        }
      }
    });
    const content = response.choices?.[0]?.message?.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : null;
    if (!isSafeExplanation(parsed)) return analysis;
    return { ...analysis, disclaimer: `${parsed.explanation} ${analysis.disclaimer}`, uncertainty: parsed.uncertainty };
  } catch {
    return analysis;
  }
}
async function getDecisionAnalysis(state, seat, policy, useLLM = false, coachingMode = "balanced") {
  const base = heuristicAnalysis(state, seat, policy, coachingMode);
  return useLLM ? explainAnalysisWithLLM(base) : base;
}
function getFeatureContributions(state, seat, policy) {
  const analysis = heuristicAnalysis(state, seat, policy);
  const top = analysis.alternatives[0];
  if (!top?.featureVector) return [];
  const weights = POLICY_WEIGHTS[policy];
  const featureLabels = {
    shantenAfter: "shanten",
    ukeire: "ukeire",
    tileDanger: "danger",
    valuePotential: "value",
    shapeFlexibility: "shape",
    scorePressure: "scorePressure"
  };
  return Object.keys(weights).map((key) => ({
    feature: featureLabels[key],
    rawValue: round(top.featureVector?.[key] ?? 0),
    weight: round(weights[key]),
    contribution: round((top.featureVector?.[key] ?? 0) * weights[key]),
    explanation: key === "tileDanger" ? "Estimated from visible discards and riichi information." : key === "shantenAfter" ? "Distance estimate after this discard." : key === "ukeire" ? "Approximate useful-draw flexibility." : key === "valuePotential" ? "Potential to preserve valuable tile patterns." : key === "shapeFlexibility" ? "Nearby tiles that preserve sequence options." : "Score situation pressure adjustment."
  }));
}
function evaluatePolicyScenarios(scenarios) {
  return scenarios.map((scenario) => {
    const first = heuristicAnalysis(createGameForScenario(scenario.seed), 0, scenario.policy);
    const second = heuristicAnalysis(createGameForScenario(scenario.seed), 0, scenario.policy);
    const top = first.alternatives[0];
    return {
      scenarioId: scenario.id,
      policy: scenario.policy,
      topActionId: top?.action.tileIds?.[0],
      topObjective: top?.objective,
      stableAcrossRuns: top?.action.tileIds?.[0] === second.alternatives[0]?.action.tileIds?.[0],
      agreementWithExpectedObjective: top?.objective === scenario.expectedTopObjective,
      contributions: getFeatureContributions(createGameForScenario(scenario.seed), 0, scenario.policy),
      topConfidence: top?.confidence ?? 0
    };
  });
}
function benchmarkPolicies(seeds, policies = ["aggressive", "balanced", "defensive", "human-like"]) {
  const byPolicy = {};
  for (const policy of policies) {
    const scenarios = seeds.map((seed, index) => ({ id: `${policy}-${seed}-${index}`, seed, policy, expectedTopObjective: policy === "defensive" ? "defense" : policy === "aggressive" ? "speed" : policy === "human-like" ? "value" : "score" }));
    const results = evaluatePolicyScenarios(scenarios);
    byPolicy[policy] = {
      scenarios: results.length,
      stable: results.filter((result) => result.stableAcrossRuns).length,
      objectiveAgreement: results.filter((result) => result.agreementWithExpectedObjective).length,
      averageConfidence: results.length ? results.reduce((sum, result) => sum + (result.topConfidence ?? 0), 0) / results.length : 0
    };
  }
  return { seeds, byPolicy };
}
function chooseAIOpponentAction(state, seat, policy = "balanced") {
  const legal = legalActions(state, seat).filter((action2) => action2.enabled);
  const analysis = heuristicAnalysis(state, seat, policy);
  const preferred = analysis.alternatives.find((alternative) => legal.some((action2) => action2.type === alternative.action.type && action2.tileIds?.[0] === alternative.action.tileIds?.[0]));
  const fallback = legal[0];
  if (!preferred && !fallback) throw new Error("AI_NO_LEGAL_ACTION");
  const action = preferred?.action ?? { type: fallback.type, seat, tileIds: fallback.tileIds };
  return {
    policy,
    seat,
    action,
    rationale: preferred?.rationale ?? "The policy selected the first legal action because no ranked discard matched the current action set.",
    objective: preferred?.objective ?? "speed",
    confidence: preferred?.confidence ?? 0.25,
    contributions: getFeatureContributions(state, seat, policy),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function createGameForScenario(seed) {
  return requireGame(seed);
}
function requireGame(seed) {
  return createGame(seed);
}

// server/mahjong-benchmark-store.ts
var runsByOwner = /* @__PURE__ */ new Map();
function runAndStoreBenchmark(seeds, ownerUserId) {
  const report = benchmarkPolicies(seeds);
  const ownerRuns = runsByOwner.get(ownerUserId) ?? [];
  const run = { ...report, id: `benchmark-${Date.now()}-${ownerUserId}-${ownerRuns.length + 1}`, createdAt: (/* @__PURE__ */ new Date()).toISOString(), ownerUserId };
  ownerRuns.unshift(run);
  if (ownerRuns.length > 20) ownerRuns.length = 20;
  runsByOwner.set(ownerUserId, ownerRuns);
  void persistMahjongBenchmarkRun({ id: run.id, ownerUserId, seedsJson: run.seeds, metricsJson: run.byPolicy }).catch((error) => console.warn("[Benchmark] Persistence fallback:", error));
  return run;
}
async function listBenchmarkRuns(ownerUserId) {
  const local = structuredClone(runsByOwner.get(ownerUserId) ?? []);
  try {
    const persisted = await listMahjongBenchmarkRuns(ownerUserId);
    const records = persisted.map((record) => ({ id: record.id, ownerUserId, createdAt: record.createdAt.toISOString(), seeds: record.seedsJson, byPolicy: record.metricsJson }));
    return [...local, ...records.filter((record) => !local.some((run) => run.id === record.id))].slice(0, 20);
  } catch (error) {
    console.warn("[Benchmark] History fallback:", error);
    return local;
  }
}

// lib/mahjong-scoring.ts
function detectYaku(tiles, context) {
  const yaku = [];
  if (context.tsumo && !context.riichi) yaku.push("Menzen Tsumo");
  if (context.riichi) yaku.push("Riichi");
  const allSimple = tiles.every((tile) => isSimple(tile.code));
  if (allSimple) yaku.push("Tanyao");
  const counts = countTileCodes(tiles);
  const hasHonor = tiles.some((tile) => isHonor(tile.code));
  const hasTerminal = tiles.some((tile) => isTerminal(tile.code));
  if (!hasHonor && !hasTerminal && allSimple) yaku.push("No Honors or Terminals");
  const tripletCount = [...counts.values()].filter((count) => count >= 3).length;
  if (tripletCount >= 3) yaku.push("Triplet-rich hand");
  return [...new Set(yaku)];
}
function estimateFu(tiles, context) {
  let fu = 20;
  if (context.tsumo) fu += 2;
  if (context.riichi) fu += 2;
  const counts = countTileCodes(tiles);
  for (const [code, count] of counts.entries()) {
    if (count < 3) continue;
    const honorOrTerminal = isHonor(code) || isTerminal(code);
    fu += honorOrTerminal ? 8 : 4;
  }
  return Math.ceil(fu / 10) * 10;
}
function calculateBasePoints(han, fu) {
  if (han >= 13) return 8e3;
  if (han >= 11) return 6e3;
  if (han >= 8) return 4e3;
  if (han >= 6) return 3e3;
  return Math.min(2e3, fu * 2 ** (han + 2));
}
function calculateScoreDeltas(basePoints, context) {
  const deltas = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!context.tsumo) {
    const payer = (context.seat + 1) % 4;
    deltas[payer] -= context.seat === context.dealer ? basePoints * 6 : basePoints * 4;
    deltas[context.seat] += context.seat === context.dealer ? basePoints * 6 : basePoints * 4;
    return deltas;
  }
  for (let seat = 0; seat < 4; seat += 1) {
    if (seat === context.seat) continue;
    const amount = context.seat === context.dealer || seat === context.dealer ? basePoints * 2 : basePoints;
    deltas[seat] -= amount;
    deltas[context.seat] += amount;
  }
  return deltas;
}
function scoreHand(tiles, context) {
  const yaku = detectYaku(tiles, context);
  const han = yaku.length + (context.doraCount ?? 0);
  const fu = estimateFu(tiles, context);
  const points = calculateBasePoints(Math.max(1, han), fu);
  return { winner: context.seat, method: context.tsumo ? "tsumo" : "ron", points, han: Math.max(1, han), fu, yaku, scoreDeltas: calculateScoreDeltas(points, context) };
}

// lib/mahjong-match.ts
function resolveHandEnd(previous, next, action) {
  if (action.type === "tsumo") {
    const check = canTsumo(previous, action.seat);
    if (check.allowed) {
      const result = scoreHand(previous.players[action.seat].hand, { seat: action.seat, dealer: previous.dealer, tsumo: true, riichi: previous.players[action.seat].riichi, roundWind: previous.roundWind, seatWind: previous.players[action.seat].wind });
      return applyResult(next, result, "tsumo");
    }
  }
  if (action.type === "ron") {
    const check = canRon(previous, action.seat);
    if (check.allowed && previous.lastDiscard) {
      const result = scoreHand([...previous.players[action.seat].hand, previous.lastDiscard.tile], { seat: action.seat, dealer: previous.dealer, tsumo: false, riichi: previous.players[action.seat].riichi, roundWind: previous.roundWind, seatWind: previous.players[action.seat].wind });
      return applyResult(next, result, "ron");
    }
  }
  if (next.wall.length === 0) {
    return { state: { ...next, phase: "hand_complete" }, reason: "exhaustive_draw" };
  }
  return { state: next, reason: null };
}
function applyResult(state, result, reason) {
  const players = state.players.map((player) => ({ ...player, score: player.score + (result.scoreDeltas[player.seat] ?? 0) }));
  return { state: { ...state, players, phase: "hand_complete", winner: result.winner, result }, reason };
}

// lib/mahjong-round.ts
function advanceAfterHand(state) {
  if (state.phase !== "hand_complete") throw new Error("HAND_NOT_COMPLETE");
  const winner = state.winner;
  const dealerWon = winner === state.dealer;
  const nextDealer = dealerWon ? state.dealer : (state.dealer + 1) % 4;
  const nextHandNumber = state.handNumber + 1;
  const entersSouth = state.roundWind === "east" && nextHandNumber >= 4;
  const nextRoundWind = entersSouth || state.roundWind === "south" ? "south" : "east";
  const normalizedHandNumber = nextHandNumber >= 4 ? nextHandNumber - 4 : nextHandNumber;
  const matchComplete = state.roundWind === "south" && nextHandNumber >= 4;
  if (matchComplete) return { state: { ...state, phase: "match_complete" }, matchComplete: true, reason: "south_round_complete" };
  const next = createGame(state.seed + nextHandNumber + 1);
  const players = next.players.map((player) => ({ ...player, score: state.players[player.seat].score }));
  const honba = dealerWon ? state.honba + 1 : 0;
  const riichiSticks = state.riichiSticks + (state.result?.yaku.includes("Riichi") ? 1 : 0);
  return {
    state: { ...next, id: state.id, seed: state.seed, roundWind: nextRoundWind, handNumber: normalizedHandNumber, dealer: nextDealer, honba, riichiSticks, players, phase: "playing" },
    matchComplete: false,
    reason: dealerWon ? "dealer_continues" : "dealer_rotates"
  };
}

// server/mahjong-store.ts
var matches = /* @__PURE__ */ new Map();
var audits = /* @__PURE__ */ new Map();
var matchOwners = /* @__PURE__ */ new Map();
function stableHash(value) {
  const text2 = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text2.length; index += 1) {
    hash ^= text2.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function snapshot(state, sequence) {
  return { matchId: state.id, sequence, turn: state.turn, state: structuredClone(state), stateHash: stableHash(state) };
}
function appendEvent(state, event) {
  const audit = audits.get(state.id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const sequence = audit.events.length + 1;
  const record = { ...event, id: `${state.id}-event-${sequence}`, matchId: state.id, sequence, stateHash: stableHash(state), createdAt: now() };
  audit.events.push(record);
  audit.snapshots.push(snapshot(state, sequence));
  void persistMahjongEvent({ id: record.id, ownerUserId: matchOwners.get(state.id), matchId: record.matchId, sequence: record.sequence, eventType: record.type, actorSeat: record.actorSeat, stateJson: state, actionJson: record.action, stateHash: record.stateHash }).catch((error) => {
    void error;
    devLog("[MahjongStore] Event persistence unavailable; using local audit fallback");
  });
}
function createMatch(seed, ownerUserId) {
  const state = createGame(seed);
  matches.set(state.id, state);
  matchOwners.set(state.id, ownerUserId);
  audits.set(state.id, { matchId: state.id, events: [], snapshots: [snapshot(state, 0)], analyses: [], aiDecisions: [], reviewMoments: [] });
  void persistMahjongMatch({ id: state.id, ownerUserId, seed: state.seed, phase: state.phase });
  appendEvent(state, { type: "match_created" });
  return state;
}
function assertMatchAccess(id, ownerUserId) {
  if (!matches.has(id)) throw new Error("MATCH_NOT_FOUND");
  const matchOwner = matchOwners.get(id);
  if (matchOwner !== void 0 && matchOwner !== ownerUserId) throw new Error("MATCH_NOT_FOUND");
}
function getMatch(id) {
  const state = matches.get(id);
  if (!state) throw new Error("MATCH_NOT_FOUND");
  return state;
}
function submitAction(id, action) {
  const previous = getMatch(id);
  const applied = applyAction(previous, action);
  const resolved = resolveHandEnd(previous, applied, action);
  const next = resolved.state;
  matches.set(id, next);
  appendEvent(next, { type: "action_submitted", actorSeat: action.seat, action });
  if (next.phase === "hand_complete") appendEvent(next, { type: "hand_completed", actorSeat: action.seat });
  return next;
}
function listLegalActions(id, seat) {
  return legalActions(getMatch(id), seat);
}
async function analyzeMatch(id, seat, policy, useLLM, coachingMode = "balanced") {
  const state = getMatch(id);
  const analysis = await getDecisionAnalysis(state, seat, policy, useLLM, coachingMode);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const record = { id: `${id}-analysis-${audit.analyses.length + 1}`, matchId: id, turn: state.turn, seat, policy, analysis, createdAt: now() };
  audit.analyses.push(record);
  void persistMahjongAnalysis({ id: record.id, ownerUserId: matchOwners.get(id), matchId: id, turn: record.turn, seat, policy, analysisJson: analysis });
  appendEvent(state, { type: "analysis_requested", actorSeat: seat });
  return analysis;
}
function saveReviewMoment(id, moment) {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const record = { ...moment, matchId: id, stateHash: stableHash(state), createdAt: now() };
  audit.reviewMoments.push(record);
  void persistMahjongReviewMoment({ id: record.id, ownerUserId: matchOwners.get(id), matchId: id, turn: record.turn, category: record.category, title: record.title, originalActionJson: record.originalAction, analysisJson: record.analysis, stateHash: record.stateHash });
  return record;
}
function recordAIOpponentDecision(id, decision) {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  audit.aiDecisions.push(decision);
  void persistMahjongAIDecision({ id: `${id}-ai-${audit.aiDecisions.length}`, ownerUserId: matchOwners.get(id), matchId: id, turn: state.turn, seat: decision.seat, policy: decision.policy, actionJson: decision.action, rationale: decision.rationale, objective: decision.objective, confidence: decision.confidence, contributionsJson: decision.contributions });
  appendEvent(state, { type: "ai_decision", actorSeat: decision.seat, action: decision.action });
  return decision;
}
function runAIMatchSteps(id, policies, maxSteps = 4) {
  const decisions = [];
  for (let step = 0; step < Math.min(maxSteps, 32); step += 1) {
    const state = getMatch(id);
    const seat = state.currentSeat;
    const policy = policies[seat];
    if (!policy || state.phase !== "playing") break;
    const decision = chooseAIOpponentAction(state, seat, policy);
    submitAction(id, decision.action);
    const recorded = recordAIOpponentDecision(id, decision);
    decisions.push(recorded);
  }
  return { state: getMatch(id), decisions };
}
function advanceMatchRound(id) {
  const current = getMatch(id);
  const transition = advanceAfterHand(current);
  matches.set(id, transition.state);
  appendEvent(transition.state, { type: transition.matchComplete ? "hand_completed" : "state_snapshot" });
  return transition;
}
function runAIMatchToCompletion(id, policies, maxSteps = 64) {
  const decisions = [];
  let stopReason = "step_limit";
  for (let step = 0; step < Math.min(maxSteps, 128); step += 1) {
    const state = getMatch(id);
    if (state.phase === "match_complete") {
      stopReason = "match_complete";
      break;
    }
    if (state.phase === "hand_complete") {
      stopReason = "hand_complete";
      break;
    }
    const policy = policies[state.currentSeat];
    if (!policy) {
      stopReason = "policy_missing";
      break;
    }
    const decision = chooseAIOpponentAction(state, state.currentSeat, policy);
    submitAction(id, decision.action);
    decisions.push(recordAIOpponentDecision(id, decision));
  }
  return { state: getMatch(id), decisions, stopReason };
}
function getReplayAnalytics(id) {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const bySeat = {};
  const byObjective = {};
  let confidenceTotal = 0;
  for (const decision of audit.aiDecisions) {
    const key = String(decision.seat);
    const entry = bySeat[key] ?? { decisions: 0, averageConfidence: 0, objectives: {} };
    entry.decisions += 1;
    entry.averageConfidence += decision.confidence;
    entry.objectives[decision.objective] = (entry.objectives[decision.objective] ?? 0) + 1;
    bySeat[key] = entry;
    byObjective[decision.objective] = (byObjective[decision.objective] ?? 0) + 1;
    confidenceTotal += decision.confidence;
  }
  for (const entry of Object.values(bySeat)) entry.averageConfidence = entry.decisions ? entry.averageConfidence / entry.decisions : 0;
  return { matchId: id, decisionCount: audit.aiDecisions.length, averageConfidence: audit.aiDecisions.length ? confidenceTotal / audit.aiDecisions.length : 0, bySeat, byObjective, scoreContext: { phase: state.phase, roundWind: state.roundWind, handNumber: state.handNumber, dealer: state.dealer, scores: Object.fromEntries(state.players.map((player) => [String(player.seat), player.score])) } };
}
function getAIMatchReport(id) {
  const state = getMatch(id);
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const bySeat = {};
  for (const decision of audit.aiDecisions) {
    const key = String(decision.seat);
    const entry = bySeat[key] ?? { policy: decision.policy, decisions: 0, averageConfidence: 0, objectives: {} };
    entry.decisions += 1;
    entry.averageConfidence += decision.confidence;
    entry.objectives[decision.objective] = (entry.objectives[decision.objective] ?? 0) + 1;
    entry.policy = decision.policy;
    bySeat[key] = entry;
  }
  for (const entry of Object.values(bySeat)) entry.averageConfidence = entry.decisions ? entry.averageConfidence / entry.decisions : 0;
  return { matchId: id, phase: state.phase, decisions: audit.aiDecisions.length, bySeat, scores: Object.fromEntries(state.players.map((player) => [String(player.seat), player.score])) };
}
function getAuditBundle(id) {
  const bundle = audits.get(id);
  if (!bundle) throw new Error("MATCH_NOT_FOUND");
  return structuredClone(bundle);
}
function getAnalysisHistory(id) {
  return structuredClone(getAuditBundle(id).analyses);
}
function savePolicyComparison(id, comparison) {
  const audit = audits.get(id);
  if (!audit) throw new Error("AUDIT_NOT_FOUND");
  const record = { ...comparison, matchId: id };
  const best = comparison.analyses[0];
  if (best) audit.analyses.push({ id: `${id}-comparison-${audit.analyses.length + 1}`, matchId: id, turn: comparison.turn, seat: comparison.seat, policy: "comparison", analysis: best, createdAt: now() });
  return record;
}

// server/mahjong-chat.ts
var disclaimer = "Strategy suggestions are estimates based on visible information; they are not guaranteed winning moves and must not reveal concealed tiles.";
function fallbackAnswer(message, matchId) {
  if (!matchId) return { answer: "Create or select a real experiment first. Sensei needs the visible table state to explain a decision without inventing tiles, scores, or recommendations.", suggestions: ["Create an experiment", "Open match history"], disclaimer, usedFallback: true };
  const lower = message.toLowerCase();
  if (lower.includes("defen") || lower.includes("fold") || lower.includes("safe")) {
    return { answer: "Start with visible danger: respect riichi declarations, avoid tiles adjacent to an opponent's recent sequences, and prefer genbutsu when available. Compare the defensive line with the fastest legal route before discarding.", suggestions: ["Which discard is safest?", "Explain genbutsu simply", "Compare speed versus defense"], disclaimer, usedFallback: true };
  }
  if (lower.includes("shanten") || lower.includes("ukeire") || lower.includes("shape")) {
    return { answer: "For hand shape, prefer the discard that preserves the most useful acceptance tiles while keeping multiple routes to tenpai. A slightly lower-value line can be stronger when it keeps the hand flexible.", suggestions: ["What is my best ukeire line?", "Should I prioritize speed?", "Explain this shape without jargon"], disclaimer, usedFallback: true };
  }
  if (lower.includes("riichi") || lower.includes("reach") || lower.includes("call")) {
    return { answer: "Before declaring riichi or calling, check whether the action improves your winning path, preserves enough value, and changes your defensive options. The right choice depends on score pressure, visible danger, and remaining draws.", suggestions: ["Should I declare riichi here?", "When should I call chi or pon?", "What changes when I am ahead?"], disclaimer, usedFallback: true };
  }
  return { answer: matchId ? "I can help you inspect this match. Ask about speed, value, defense, riichi, calls, shanten, ukeire, or a specific discard. I will separate visible facts from uncertain inferences." : "Ask me about shanten, ukeire, defense, riichi, calls, scoring, or how to compare two discard choices.", suggestions: ["What should I discard?", "How do I improve this hand?", "What is the safer line?"], disclaimer, usedFallback: true };
}
function extractText(content) {
  if (typeof content === "string") return content;
  return content.filter((part) => part.type === "text").map((part) => part.text ?? "").join("\n");
}
function buildStrategyChatMessages(input) {
  const message = input.message.trim();
  if (!message) throw new Error("CHAT_MESSAGE_REQUIRED");
  const context = input.matchId ? getMatch(input.matchId) : void 0;
  const visibleContext = context ? JSON.stringify({ phase: context.phase, roundWind: context.roundWind, handNumber: context.handNumber, dealer: context.dealer, turn: context.turn, wallRemaining: context.wall.length, scores: context.players.map((player) => ({ seat: player.seat, score: player.score, discards: player.discards.map((discard) => discard.tile.code), meldCount: player.melds.length })), yourHand: context.players[0]?.hand.map((tile) => tile.code) }) : "No live match context was provided.";
  return { message, matchId: input.matchId, messages: [
    { role: "system", content: `You are Mahjong Sensei inside a riichi Mahjong mobile app. Give concise, practical strategy guidance. Use only visible state. Never claim to know concealed opponent tiles. Separate observed facts from inferences, mention uncertainty, and avoid guarantees. Explain technical terms briefly. End with one actionable next step. Current visible context: ${visibleContext}` },
    ...(input.history ?? []).slice(-8).map((entry) => ({ role: entry.role, content: entry.content })),
    { role: "user", content: message }
  ] };
}
async function askStrategyChat(input) {
  if (!input.matchId) return fallbackAnswer(input.message.trim(), void 0);
  const request = buildStrategyChatMessages(input);
  const message = request.message;
  try {
    const result = await invokeLLM({
      messages: request.messages,
      maxTokens: 700
    });
    const answer = extractText(result.choices[0]?.message?.content ?? "").trim();
    if (!answer) return fallbackAnswer(message, input.matchId);
    return { answer, suggestions: ["Compare speed and value", "Show the defensive alternative", "Explain the terms"], disclaimer, usedFallback: false };
  } catch (error) {
    console.warn("[MahjongChat] AI fallback:", error);
    return fallbackAnswer(message, input.matchId);
  }
}
async function streamStrategyChat(input, signal, onDelta) {
  const request = buildStrategyChatMessages(input);
  const response = await invokeLLMStream({ messages: request.messages, maxTokens: 700, signal });
  if (!response.body) throw new Error("LLM_STREAM_BODY_MISSING");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\\n\\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const data = event.split("\\n").find((line) => line.startsWith("data:"))?.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onDelta(delta);
        } catch {
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => void 0);
  }
}

// shared/monetization.ts
var stripeConfigurationState = (values) => {
  if (!values.secretKey || !values.priceId || !values.webhookSecret) return "not_configured";
  return "ready";
};

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  billing: router({
    status: publicProcedure.query(() => {
      const state = stripeConfigurationState({
        secretKey: process.env.STRIPE_SECRET_KEY,
        priceId: process.env.STRIPE_PRICE_ID,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
      });
      return { state, checkoutAvailable: state === "ready", components: { secretKeyConfigured: Boolean(process.env.STRIPE_SECRET_KEY), priceIdConfigured: Boolean(process.env.STRIPE_PRICE_ID), webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET) } };
    })
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  mahjong: router({
    create: publicProcedure.input(z2.object({ seed: z2.number().int().optional() }).optional()).mutation(({ ctx, input }) => createMatch(input?.seed, ctx.user?.id)),
    get: publicProcedure.input(z2.object({ id: z2.string().min(1) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getMatch(input.id);
    }),
    legalActions: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3) })).query(({ input }) => listLegalActions(input.id, input.seat)),
    submitAction: publicProcedure.input(z2.object({
      id: z2.string().min(1),
      action: z2.object({
        type: z2.enum(["draw", "discard", "chi", "pon", "kan", "riichi", "ron", "tsumo", "pass"]),
        seat: z2.number().int().min(0).max(3),
        tileIds: z2.array(z2.string()).optional(),
        tileCodes: z2.array(z2.string()).optional(),
        tsumogiri: z2.boolean().optional()
      })
    })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return submitAction(input.id, input.action);
    }),
    analyze: publicProcedure.input(z2.object({
      id: z2.string().min(1),
      seat: z2.number().int().min(0).max(3),
      policy: z2.enum(["aggressive", "balanced", "defensive", "human-like"]).default("balanced"),
      useLLM: z2.boolean().default(false),
      coachingMode: z2.enum(["defensive", "balanced", "exploratory"]).default("balanced")
    })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return analyzeMatch(input.id, input.seat, input.policy, input.useLLM, input.coachingMode);
    }),
    comparePolicies: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3) })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return comparePolicies(getMatch(input.id), input.seat);
    }),
    compareCoachingModes: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3) })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return compareCoachingModes(getMatch(input.id), input.seat);
    }),
    audit: publicProcedure.input(z2.object({ id: z2.string().min(1) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getAuditBundle(input.id);
    }),
    analysisHistory: publicProcedure.input(z2.object({ id: z2.string().min(1) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getAnalysisHistory(input.id);
    }),
    saveReviewMoment: publicProcedure.input(z2.object({
      id: z2.string().min(1),
      moment: z2.object({
        id: z2.string().min(1),
        turn: z2.number().int().nonnegative(),
        title: z2.string().min(1).max(120),
        category: z2.enum(["efficiency", "defense", "value", "interesting"]),
        originalAction: z2.object({
          type: z2.enum(["draw", "discard", "chi", "pon", "kan", "riichi", "ron", "tsumo", "pass"]),
          seat: z2.number().int().min(0).max(3),
          tileIds: z2.array(z2.string()).optional(),
          tileCodes: z2.array(z2.string()).optional(),
          tsumogiri: z2.boolean().optional()
        }),
        analysis: z2.unknown().optional()
      })
    })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return saveReviewMoment(input.id, input.moment);
    }),
    savePolicyComparison: publicProcedure.input(z2.object({ id: z2.string().min(1), turn: z2.number().int().nonnegative(), seat: z2.number().int().min(0).max(3), analyses: z2.array(z2.unknown()).min(1) })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return savePolicyComparison(input.id, input);
    }),
    legalityPreview: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      const state = getMatch(input.id);
      const seat = input.seat;
      const player = state.players[seat];
      const discard = state.lastDiscard;
      return {
        riichi: canDeclareRiichi(state, seat),
        tsumo: canTsumo(state, seat),
        ron: canRon(state, seat),
        pon: discard ? canPon(player.hand, discard.tile) : false,
        kan: discard ? canKan(player.hand, discard.tile) : false,
        chi: discard ? canChi(seat, discard.seat, player.hand, discard.tile) : false
      };
    }),
    scorePreview: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3), tsumo: z2.boolean(), riichi: z2.boolean(), doraCount: z2.number().int().min(0).max(13).default(0) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      const state = getMatch(input.id);
      const seat = input.seat;
      return scoreHand(state.players[seat].hand, { seat, dealer: state.dealer, tsumo: input.tsumo, riichi: input.riichi, roundWind: state.roundWind, seatWind: state.players[seat].wind, doraCount: input.doraCount });
    }),
    aiContributions: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3), policy: z2.enum(["aggressive", "balanced", "defensive", "human-like"]).default("balanced") })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getFeatureContributions(getMatch(input.id), input.seat, input.policy);
    }),
    aiEvaluation: publicProcedure.input(z2.object({ scenarios: z2.array(z2.object({ id: z2.string().min(1), seed: z2.number().int(), policy: z2.string(), expectedTopObjective: z2.enum(["speed", "value", "defense", "score"]) })).min(1).max(50) })).query(({ input }) => evaluatePolicyScenarios(input.scenarios)),
    aiTurn: publicProcedure.input(z2.object({ id: z2.string().min(1), seat: z2.number().int().min(0).max(3), policy: z2.enum(["aggressive", "balanced", "defensive", "human-like"]).default("balanced") })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      const decision = chooseAIOpponentAction(getMatch(input.id), input.seat, input.policy);
      const state = submitAction(input.id, decision.action);
      recordAIOpponentDecision(input.id, decision);
      return { state, decision };
    }),
    aiMatchStep: publicProcedure.input(z2.object({ id: z2.string().min(1), maxSteps: z2.number().int().min(1).max(16).default(4), policies: z2.record(z2.string(), z2.enum(["aggressive", "balanced", "defensive", "human-like"])) })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return runAIMatchSteps(input.id, Object.fromEntries(Object.entries(input.policies).map(([seat, policy]) => [Number(seat), policy])), input.maxSteps);
    }),
    aiDecisionHistory: publicProcedure.input(z2.object({ id: z2.string().min(1) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getAuditBundle(input.id).aiDecisions;
    }),
    aiMatchComplete: publicProcedure.input(z2.object({ id: z2.string().min(1), maxSteps: z2.number().int().min(1).max(128).default(64), policies: z2.record(z2.string(), z2.enum(["aggressive", "balanced", "defensive", "human-like"])) })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return runAIMatchToCompletion(input.id, Object.fromEntries(Object.entries(input.policies).map(([seat, policy]) => [Number(seat), policy])), input.maxSteps);
    }),
    advanceRound: publicProcedure.input(z2.object({ id: z2.string().min(1) })).mutation(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return advanceMatchRound(input.id);
    }),
    aiMatchReport: publicProcedure.input(z2.object({ id: z2.string().min(1) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getAIMatchReport(input.id);
    }),
    replayAnalytics: publicProcedure.input(z2.object({ id: z2.string().min(1) })).query(({ ctx, input }) => {
      assertMatchAccess(input.id, ctx.user?.id);
      return getReplayAnalytics(input.id);
    }),
    benchmarkRun: protectedProcedure.input(z2.object({ seeds: z2.array(z2.number().int()).min(1).max(50) })).mutation(({ ctx, input }) => runAndStoreBenchmark(input.seeds, ctx.user.id)),
    benchmarkHistory: protectedProcedure.query(({ ctx }) => listBenchmarkRuns(ctx.user.id)),
    strategyChat: publicProcedure.input(z2.object({
      message: z2.string().trim().min(1).max(1200),
      matchId: z2.string().min(1).optional(),
      history: z2.array(z2.object({ role: z2.enum(["user", "assistant"]), content: z2.string().min(1).max(2e3), createdAt: z2.string() })).max(12).optional()
    })).mutation(({ input }) => askStrategyChat(input))
  })
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });
  app.post("/api/mahjong/strategy-chat/stream", async (req, res) => {
    const controller = new AbortController();
    let finished = false;
    const onClose = () => {
      if (!finished) controller.abort();
    };
    req.on("close", onClose);
    res.status(200).set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive", "X-Accel-Buffering": "no" });
    res.flushHeaders();
    try {
      await streamStrategyChat(req.body, controller.signal, (delta) => {
        if (!finished && !res.writableEnded) res.write(`data: ${JSON.stringify({ delta })}\\n\\n`);
      });
      if (!finished && !res.writableEnded) {
        finished = true;
        res.write("data: [DONE]\\n\\n");
        res.end();
      }
    } catch (error) {
      if (controller.signal.aborted || res.writableEnded) return;
      finished = true;
      res.write(`event: error\\ndata: ${JSON.stringify({ message: error instanceof Error ? error.message : "STREAM_FAILED" })}\\n\\n`);
      res.end();
    } finally {
      req.off("close", onClose);
    }
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}
startServer().catch(console.error);
