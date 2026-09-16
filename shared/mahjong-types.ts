export type Suit = "m" | "p" | "s" | "z";
export type TileCode = `${"m" | "p" | "s"}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `z${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
export type PlayerSeat = 0 | 1 | 2 | 3;
export type Wind = "east" | "south" | "west" | "north";
export type GamePhase = "waiting" | "dealing" | "playing" | "hand_complete" | "match_complete";
export type ActionType = "draw" | "discard" | "chi" | "pon" | "kan" | "riichi" | "ron" | "tsumo" | "pass";

export interface TileInstance {
  id: string;
  code: TileCode;
  copy: number;
  red: boolean;
}

export interface Meld {
  type: "chi" | "pon" | "kan";
  tiles: TileInstance[];
  fromSeat?: PlayerSeat;
  open: boolean;
}

export interface Discard {
  tile: TileInstance;
  seat: PlayerSeat;
  tsumogiri: boolean;
  riichiDeclaration?: boolean;
  turn: number;
}

export interface PlayerState {
  seat: PlayerSeat;
  displayName: string;
  wind: Wind;
  score: number;
  hand: TileInstance[];
  melds: Meld[];
  discards: Discard[];
  riichi: boolean;
  connected: boolean;
}

export interface DoraState {
  indicators: TileInstance[];
  revealed: TileInstance[];
}

export interface GameState {
  id: string;
  ruleSet: "riichi";
  phase: GamePhase;
  roundWind: "east" | "south";
  handNumber: number;
  honba: number;
  riichiSticks: number;
  dealer: PlayerSeat;
  currentSeat: PlayerSeat;
  wall: TileInstance[];
  deadWall: TileInstance[];
  dora: DoraState;
  players: [PlayerState, PlayerState, PlayerState, PlayerState];
  lastDiscard?: Discard;
  turn: number;
  seed: number;
  winner?: PlayerSeat;
  result?: HandResult;
}

export interface ActionEnvelope {
  type: ActionType;
  seat: PlayerSeat;
  tileIds?: string[];
  tileCodes?: TileCode[];
  tsumogiri?: boolean;
}

export interface LegalAction {
  type: ActionType;
  seat: PlayerSeat;
  tileIds?: string[];
  tileCodes?: TileCode[];
  label: string;
  enabled: boolean;
  reason?: string;
}

export interface HandResult {
  winner: PlayerSeat;
  method: "ron" | "tsumo";
  points: number;
  han: number;
  fu: number;
  yaku: string[];
  scoreDeltas: Record<PlayerSeat, number>;
}

export interface DecisionAlternative {
  action: ActionEnvelope;
  objective: "speed" | "value" | "defense" | "score";
  confidence: number;
  rationale: string;
  shantenAfter: number;
  ukeire: number;
}

export interface RecommendationSummary {
  recommendedTile?: TileCode;
  runnerUpTile?: TileCode;
  confidenceGap: number;
  ukeireDelta: number;
  keyTradeoff: string;
  confidenceBand?: "decisive" | "close" | "uncertain";
  evidenceQuality?: number;
  confidenceBasis?: string;
  learningFocus?: "speed" | "value" | "defense" | "score";
  counterfactualLesson?: string;
  riskNote?: string;
  utilityDelta?: number;
}

export interface DecisionAnalysis {
  recommendationId: string;
  policyName: string;
  observedFacts: string[];
  inferredSignals: Array<{ label: string; confidence: number }>;
  uncertainty: "low" | "medium" | "high";
  alternatives: DecisionAlternative[];
  recommendationSummary?: RecommendationSummary;
  disclaimer: string;
}

export interface ReviewMoment {
  id: string;
  turn: number;
  title: string;
  category: "efficiency" | "defense" | "value" | "interesting";
  originalAction: ActionEnvelope;
  analysis?: DecisionAnalysis;
}
