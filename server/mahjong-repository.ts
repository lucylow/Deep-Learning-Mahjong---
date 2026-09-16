import type { AIAnalysisRecord, MatchAuditBundle, MatchEvent, ReplaySnapshot, ReviewMomentRecord } from "@/shared/mahjong-backend";
import type { GameState } from "@/shared/mahjong-types";

export interface MahjongRepository {
  createMatch(state: GameState): Promise<void>;
  appendEvent(event: MatchEvent, snapshot: ReplaySnapshot): Promise<void>;
  saveAnalysis(analysis: AIAnalysisRecord): Promise<void>;
  saveReviewMoment(moment: ReviewMomentRecord): Promise<void>;
  getAuditBundle(matchId: string): Promise<MatchAuditBundle | null>;
}

export class InMemoryMahjongRepository implements MahjongRepository {
  private readonly bundles = new Map<string, MatchAuditBundle>();

  async createMatch(state: GameState) {
    this.bundles.set(state.id, { matchId: state.id, events: [], snapshots: [{ matchId: state.id, sequence: 0, turn: state.turn, state: structuredClone(state), stateHash: "initial" }], analyses: [], aiDecisions: [], reviewMoments: [] });
  }

  async appendEvent(event: MatchEvent, snapshot: ReplaySnapshot) {
    const bundle = this.bundles.get(event.matchId);
    if (!bundle) throw new Error("REPOSITORY_MATCH_NOT_FOUND");
    bundle.events.push(structuredClone(event));
    bundle.snapshots.push(structuredClone(snapshot));
  }

  async saveAnalysis(analysis: AIAnalysisRecord) {
    const bundle = this.bundles.get(analysis.matchId);
    if (!bundle) throw new Error("REPOSITORY_MATCH_NOT_FOUND");
    bundle.analyses.push(structuredClone(analysis));
  }

  async saveReviewMoment(moment: ReviewMomentRecord) {
    const bundle = this.bundles.get(moment.matchId);
    if (!bundle) throw new Error("REPOSITORY_MATCH_NOT_FOUND");
    bundle.reviewMoments.push(structuredClone(moment));
  }

  async getAuditBundle(matchId: string) {
    const bundle = this.bundles.get(matchId);
    return bundle ? structuredClone(bundle) : null;
  }
}

export function createRepository(): MahjongRepository {
  return new InMemoryMahjongRepository();
}
