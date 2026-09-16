import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { listBenchmarkRuns, runAndStoreBenchmark } from "./mahjong-benchmark-store";
import { advanceMatchRound, analyzeMatch, assertMatchAccess, createMatch, getAIMatchReport, getAnalysisHistory, getAuditBundle, getMatch, getReplayAnalytics, listLegalActions, recordAIOpponentDecision, runAIMatchSteps, runAIMatchToCompletion, savePolicyComparison, saveReviewMoment, submitAction } from "./mahjong-store";
import { chooseAIOpponentAction, comparePolicies, compareCoachingModes, evaluatePolicyScenarios, getFeatureContributions } from "./mahjong-ai";
import { askStrategyChat } from "./mahjong-chat";
import { canChi, canDeclareRiichi, canKan, canPon, canRon, canTsumo } from "@/lib/mahjong-rules";
import { scoreHand } from "@/lib/mahjong-scoring";
import type { ActionEnvelope, PlayerSeat } from "@/shared/mahjong-types";
import type { CoachingMode } from "@/shared/coaching-mode";
import { stripeConfigurationState } from "@/shared/monetization";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  billing: router({
    status: publicProcedure.query(() => {
      const state = stripeConfigurationState({
        secretKey: process.env.STRIPE_SECRET_KEY,
        priceId: process.env.STRIPE_PRICE_ID,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      });
      return { state, checkoutAvailable: state === "ready", components: { secretKeyConfigured: Boolean(process.env.STRIPE_SECRET_KEY), priceIdConfigured: Boolean(process.env.STRIPE_PRICE_ID), webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET) } } as const;
    }),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  mahjong: router({
    create: publicProcedure
      .input(z.object({ seed: z.number().int().optional() }).optional())
      .mutation(({ ctx, input }) => createMatch(input?.seed, ctx.user?.id)),
    get: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getMatch(input.id); }),
    legalActions: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3) }))
      .query(({ input }) => listLegalActions(input.id, input.seat as PlayerSeat)),
    submitAction: publicProcedure
      .input(z.object({
        id: z.string().min(1),
        action: z.object({
          type: z.enum(["draw", "discard", "chi", "pon", "kan", "riichi", "ron", "tsumo", "pass"]),
          seat: z.number().int().min(0).max(3),
          tileIds: z.array(z.string()).optional(),
          tileCodes: z.array(z.string()).optional(),
          tsumogiri: z.boolean().optional(),
        }),
      }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return submitAction(input.id, input.action as ActionEnvelope); }),
    analyze: publicProcedure
      .input(z.object({
        id: z.string().min(1),
        seat: z.number().int().min(0).max(3),
        policy: z.enum(["aggressive", "balanced", "defensive", "human-like"]).default("balanced"),
        useLLM: z.boolean().default(false),
        coachingMode: z.enum(["defensive", "balanced", "exploratory"]).default("balanced"),
      }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return analyzeMatch(input.id, input.seat as PlayerSeat, input.policy, input.useLLM, input.coachingMode as CoachingMode); }),
    comparePolicies: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3) }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return comparePolicies(getMatch(input.id), input.seat as PlayerSeat); }),
    compareCoachingModes: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3) }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return compareCoachingModes(getMatch(input.id), input.seat as PlayerSeat); }),
    audit: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getAuditBundle(input.id); }),
    analysisHistory: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getAnalysisHistory(input.id); }),
    saveReviewMoment: publicProcedure
      .input(z.object({
        id: z.string().min(1),
        moment: z.object({
          id: z.string().min(1),
          turn: z.number().int().nonnegative(),
          title: z.string().min(1).max(120),
          category: z.enum(["efficiency", "defense", "value", "interesting"]),
          originalAction: z.object({
            type: z.enum(["draw", "discard", "chi", "pon", "kan", "riichi", "ron", "tsumo", "pass"]),
            seat: z.number().int().min(0).max(3),
            tileIds: z.array(z.string()).optional(),
            tileCodes: z.array(z.string()).optional(),
            tsumogiri: z.boolean().optional(),
          }),
          analysis: z.unknown().optional(),
        }),
      }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return saveReviewMoment(input.id, input.moment as never); }),
    savePolicyComparison: publicProcedure
      .input(z.object({ id: z.string().min(1), turn: z.number().int().nonnegative(), seat: z.number().int().min(0).max(3), analyses: z.array(z.unknown()).min(1) }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return savePolicyComparison(input.id, input as never); }),
    legalityPreview: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3) }))
      .query(({ ctx, input }) => {
        assertMatchAccess(input.id, ctx.user?.id);
        const state = getMatch(input.id);
        const seat = input.seat as PlayerSeat;
        const player = state.players[seat];
        const discard = state.lastDiscard;
        return {
          riichi: canDeclareRiichi(state, seat),
          tsumo: canTsumo(state, seat),
          ron: canRon(state, seat),
          pon: discard ? canPon(player.hand, discard.tile) : false,
          kan: discard ? canKan(player.hand, discard.tile) : false,
          chi: discard ? canChi(seat, discard.seat, player.hand, discard.tile) : false,
        };
      }),
    scorePreview: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3), tsumo: z.boolean(), riichi: z.boolean(), doraCount: z.number().int().min(0).max(13).default(0) }))
      .query(({ ctx, input }) => {
        assertMatchAccess(input.id, ctx.user?.id);
        const state = getMatch(input.id);
        const seat = input.seat as PlayerSeat;
        return scoreHand(state.players[seat].hand, { seat, dealer: state.dealer, tsumo: input.tsumo, riichi: input.riichi, roundWind: state.roundWind, seatWind: state.players[seat].wind, doraCount: input.doraCount });
      }),
    aiContributions: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3), policy: z.enum(["aggressive", "balanced", "defensive", "human-like"]).default("balanced") }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getFeatureContributions(getMatch(input.id), input.seat as PlayerSeat, input.policy); }),
    aiEvaluation: publicProcedure
      .input(z.object({ scenarios: z.array(z.object({ id: z.string().min(1), seed: z.number().int(), policy: z.string(), expectedTopObjective: z.enum(["speed", "value", "defense", "score"]) })).min(1).max(50) }))
      .query(({ input }) => evaluatePolicyScenarios(input.scenarios)),
    aiTurn: publicProcedure
      .input(z.object({ id: z.string().min(1), seat: z.number().int().min(0).max(3), policy: z.enum(["aggressive", "balanced", "defensive", "human-like"]).default("balanced") }))
      .mutation(({ ctx, input }) => {
        assertMatchAccess(input.id, ctx.user?.id);
        const decision = chooseAIOpponentAction(getMatch(input.id), input.seat as PlayerSeat, input.policy);
        const state = submitAction(input.id, decision.action as ActionEnvelope);
        recordAIOpponentDecision(input.id, decision);
        return { state, decision };
      }),
    aiMatchStep: publicProcedure
      .input(z.object({ id: z.string().min(1), maxSteps: z.number().int().min(1).max(16).default(4), policies: z.record(z.string(), z.enum(["aggressive", "balanced", "defensive", "human-like"])) }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return runAIMatchSteps(input.id, Object.fromEntries(Object.entries(input.policies).map(([seat, policy]) => [Number(seat), policy])) as Partial<Record<PlayerSeat, "aggressive" | "balanced" | "defensive" | "human-like">>, input.maxSteps); }),
    aiDecisionHistory: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getAuditBundle(input.id).aiDecisions; }),
    aiMatchComplete: publicProcedure
      .input(z.object({ id: z.string().min(1), maxSteps: z.number().int().min(1).max(128).default(64), policies: z.record(z.string(), z.enum(["aggressive", "balanced", "defensive", "human-like"])) }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return runAIMatchToCompletion(input.id, Object.fromEntries(Object.entries(input.policies).map(([seat, policy]) => [Number(seat), policy])) as Partial<Record<PlayerSeat, "aggressive" | "balanced" | "defensive" | "human-like">>, input.maxSteps); }),
    advanceRound: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .mutation(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return advanceMatchRound(input.id); }),
    aiMatchReport: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getAIMatchReport(input.id); }),
    replayAnalytics: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ ctx, input }) => { assertMatchAccess(input.id, ctx.user?.id); return getReplayAnalytics(input.id); }),
    benchmarkRun: protectedProcedure
      .input(z.object({ seeds: z.array(z.number().int()).min(1).max(50) }))
      .mutation(({ ctx, input }) => runAndStoreBenchmark(input.seeds, ctx.user.id)),
    benchmarkHistory: protectedProcedure
      .query(({ ctx }) => listBenchmarkRuns(ctx.user.id)),
    strategyChat: publicProcedure
      .input(z.object({
        message: z.string().trim().min(1).max(1200),
        matchId: z.string().min(1).optional(),
        history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000), createdAt: z.string() })).max(12).optional(),
      }))
      .mutation(({ input }) => askStrategyChat(input)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
