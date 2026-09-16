export type PracticeObjective = "shape" | "defense" | "value";

export type PracticeOption = {
  id: string;
  label: string;
  rationale: string;
};

export type GuidedPracticeScenario = {
  id: string;
  title: string;
  objective: PracticeObjective;
  prompt: string;
  visibleFacts: string[];
  options: PracticeOption[];
  bestOptionId: string;
  coaching: string;
  difficulty: 1 | 2 | 3;
};

export type PracticeFeedback = {
  correct: boolean;
  title: string;
  detail: string;
};

export type ObjectiveStat = { attempts: number; correct: number };
export type ObjectiveStats = Record<PracticeObjective, ObjectiveStat>;

export type PracticeHistoryEntry = {
  scenarioId: string;
  objective: PracticeObjective;
  correct: boolean;
  confidenceBefore: number;
  confidenceAfter: number;
  confidenceDelta: number;
  answeredAt: string;
};

export type PracticeProgress = {
  completedScenarioIds: string[];
  attempts: number;
  correct: number;
  streak: number;
  objectiveStats: ObjectiveStats;
  mistakeCounts?: Record<string, number>;
  history?: PracticeHistoryEntry[];
  lastScenarioId?: string;
};

export const DEFAULT_OBJECTIVE_STATS: ObjectiveStats = {
  shape: { attempts: 0, correct: 0 },
  defense: { attempts: 0, correct: 0 },
  value: { attempts: 0, correct: 0 },
};

export const DEFAULT_PRACTICE_PROGRESS: PracticeProgress = {
  completedScenarioIds: [],
  attempts: 0,
  correct: 0,
  streak: 0,
  objectiveStats: DEFAULT_OBJECTIVE_STATS,
  mistakeCounts: {},
  history: [],
};

export function normalizePracticeProgress(value: unknown): PracticeProgress {
  if (!value || typeof value !== "object") return DEFAULT_PRACTICE_PROGRESS;
  const candidate = value as Record<string, unknown>;
  const completedScenarioIds = Array.isArray(candidate.completedScenarioIds) ? candidate.completedScenarioIds.filter((id): id is string => typeof id === "string").slice(-GUIDED_PRACTICE_SCENARIOS.length) : [];
  const attempts = typeof candidate.attempts === "number" && Number.isFinite(candidate.attempts) ? Math.max(0, Math.min(999, Math.floor(candidate.attempts))) : 0;
  const correct = typeof candidate.correct === "number" && Number.isFinite(candidate.correct) ? Math.max(0, Math.min(attempts, Math.floor(candidate.correct))) : 0;
  const streak = typeof candidate.streak === "number" && Number.isFinite(candidate.streak) ? Math.max(0, Math.min(999, Math.floor(candidate.streak))) : 0;
  const lastScenarioId = typeof candidate.lastScenarioId === "string" ? candidate.lastScenarioId : undefined;
  const rawMistakes = candidate.mistakeCounts && typeof candidate.mistakeCounts === "object" ? candidate.mistakeCounts as Record<string, unknown> : {};
  const mistakeCounts = Object.fromEntries(Object.entries(rawMistakes).filter(([id, count]) => typeof id === "string" && typeof count === "number" && Number.isFinite(count)).slice(-GUIDED_PRACTICE_SCENARIOS.length).map(([id, count]) => [id, Math.max(0, Math.min(99, Math.floor(count as number)))]));
  const rawHistory = Array.isArray(candidate.history) ? candidate.history : [];
  const history = rawHistory.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object")).slice(-12).map((item) => ({
    scenarioId: typeof item.scenarioId === "string" ? item.scenarioId : "unknown-scenario",
    objective: (item.objective === "defense" || item.objective === "value" ? item.objective : "shape") as PracticeObjective,
    correct: item.correct === true,
    confidenceBefore: typeof item.confidenceBefore === "number" && Number.isFinite(item.confidenceBefore) ? Math.max(0, Math.min(1, item.confidenceBefore)) : 0,
    confidenceAfter: typeof item.confidenceAfter === "number" && Number.isFinite(item.confidenceAfter) ? Math.max(0, Math.min(1, item.confidenceAfter)) : 0,
    confidenceDelta: typeof item.confidenceDelta === "number" && Number.isFinite(item.confidenceDelta) ? Math.max(-1, Math.min(1, item.confidenceDelta)) : 0,
    answeredAt: typeof item.answeredAt === "string" ? item.answeredAt : new Date(0).toISOString(),
  }));
  const storedStats = candidate.objectiveStats && typeof candidate.objectiveStats === "object" ? candidate.objectiveStats as Record<string, unknown> : {};
  const objectiveStats = (Object.keys(DEFAULT_OBJECTIVE_STATS) as PracticeObjective[]).reduce<ObjectiveStats>((stats, objective) => {
    const raw = storedStats[objective];
    const item = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
    const objectiveAttempts = typeof item.attempts === "number" && Number.isFinite(item.attempts) ? Math.max(0, Math.min(attempts, Math.floor(item.attempts))) : 0;
    const objectiveCorrect = typeof item.correct === "number" && Number.isFinite(item.correct) ? Math.max(0, Math.min(objectiveAttempts, Math.floor(item.correct))) : 0;
    stats[objective] = { attempts: objectiveAttempts, correct: objectiveCorrect };
    return stats;
  }, { ...DEFAULT_OBJECTIVE_STATS });
  return { completedScenarioIds, attempts, correct, streak, objectiveStats, mistakeCounts, history, lastScenarioId };
}

export function recordPracticeAnswer(progress: PracticeProgress, scenarioId: string, correct: boolean): PracticeProgress {
  const completedScenarioIds = progress.completedScenarioIds.includes(scenarioId) ? progress.completedScenarioIds : [...progress.completedScenarioIds, scenarioId].slice(-GUIDED_PRACTICE_SCENARIOS.length);
  const scenario = GUIDED_PRACTICE_SCENARIOS.find((item) => item.id === scenarioId);
  const objective = scenario?.objective;
  const objectiveStats = { ...progress.objectiveStats };
  if (objective) objectiveStats[objective] = { attempts: objectiveStats[objective].attempts + 1, correct: objectiveStats[objective].correct + (correct ? 1 : 0) };
  const mistakeCounts = { ...(progress.mistakeCounts ?? {}) };
  if (!correct) mistakeCounts[scenarioId] = (mistakeCounts[scenarioId] ?? 0) + 1;
  const beforeConfidence = objective ? objectiveAccuracy(progress.objectiveStats[objective]) / 100 : 0;
  const afterConfidence = objective ? objectiveAccuracy(objectiveStats[objective]) / 100 : 0;
  const history = objective ? [...(progress.history ?? []), { scenarioId, objective, correct, confidenceBefore: beforeConfidence, confidenceAfter: afterConfidence, confidenceDelta: Number((afterConfidence - beforeConfidence).toFixed(3)), answeredAt: new Date().toISOString() }].slice(-12) : progress.history ?? [];
  return { completedScenarioIds, attempts: progress.attempts + 1, correct: progress.correct + (correct ? 1 : 0), streak: correct ? progress.streak + 1 : 0, objectiveStats, mistakeCounts, history, lastScenarioId: scenarioId };
}

export function practiceDifficulty(progress: PracticeProgress): 1 | 2 | 3 {
  if (progress.attempts < 2) return 1;
  const accuracy = progress.correct / progress.attempts;
  if (accuracy >= 0.85 && progress.streak >= 2) return 3;
  if (accuracy >= 0.65) return 2;
  return 1;
}

export type PracticeMastery = "warming-up" | "developing" | "mastering";

export function difficultyLabel(difficulty: 1 | 2 | 3): string {
  return difficulty === 1 ? "Foundations" : difficulty === 2 ? "Focused" : "Challenge";
}

export function practiceMastery(progress: PracticeProgress): PracticeMastery {
  if (progress.attempts < 3) return "warming-up";
  const accuracy = progress.correct / progress.attempts;
  if (accuracy >= 0.85 && progress.streak >= 3 && progress.completedScenarioIds.length >= 3) return "mastering";
  return "developing";
}

export function masteryLabel(mastery: PracticeMastery): string {
  return mastery === "warming-up" ? "Warming up" : mastery === "developing" ? "Developing" : "Mastering";
}

export function masteryCoaching(mastery: PracticeMastery): string {
  return mastery === "warming-up" ? "Complete a few different drills so Sensei can calibrate your coaching." : mastery === "developing" ? "Your pattern is emerging. Keep alternating objectives before pushing into harder lines." : "You are consistently reading the visible trade-off. Challenge yourself with risk-budget and score-pressure decisions.";
}

export function objectiveMastery(stat: ObjectiveStat): PracticeMastery {
  if (stat.attempts < 2) return "warming-up";
  if (stat.correct / stat.attempts >= 0.85 && stat.attempts >= 3) return "mastering";
  return "developing";
}

export function weakestObjective(stats: ObjectiveStats): PracticeObjective {
  return (Object.keys(stats) as PracticeObjective[]).sort((left, right) => {
    const leftStat = stats[left];
    const rightStat = stats[right];
    const leftAccuracy = leftStat.attempts ? leftStat.correct / leftStat.attempts : -1;
    const rightAccuracy = rightStat.attempts ? rightStat.correct / rightStat.attempts : -1;
    return leftAccuracy - rightAccuracy || leftStat.attempts - rightStat.attempts;
  })[0];
}

export function objectiveLabel(objective: PracticeObjective): string {
  return objective === "shape" ? "Shape" : objective === "defense" ? "Defense" : "Value";
}

export function objectiveAccuracy(stat: ObjectiveStat): number {
  return stat.attempts ? Math.round((stat.correct / stat.attempts) * 100) : 0;
}

export function objectiveProgressPercent(stat: ObjectiveStat): number {
  return Math.min(100, Math.round((objectiveAccuracy(stat) / 85) * 100));
}

export function advancedDrillUnlocked(stats: ObjectiveStats): boolean {
  return (Object.keys(stats) as PracticeObjective[]).every((objective) => objectiveMastery(stats[objective]) === "mastering");
}

export function recommendedPracticeScenario(progress: PracticeProgress): GuidedPracticeScenario {
  const targetDifficulty = practiceDifficulty(progress);
  const remediation = GUIDED_PRACTICE_SCENARIOS.filter((scenario) => ((progress.mistakeCounts ?? {})[scenario.id] ?? 0) > 0).sort((left, right) => ((progress.mistakeCounts ?? {})[right.id] ?? 0) - ((progress.mistakeCounts ?? {})[left.id] ?? 0) || Math.abs(left.difficulty - targetDifficulty) - Math.abs(right.difficulty - targetDifficulty));
  if (remediation.length) return remediation[0];
  const unseen = GUIDED_PRACTICE_SCENARIOS.filter((scenario) => !progress.completedScenarioIds.includes(scenario.id));
  if (unseen.length) {
    return unseen.sort((left, right) => Math.abs(left.difficulty - targetDifficulty) - Math.abs(right.difficulty - targetDifficulty) || left.difficulty - right.difficulty)[0];
  }
  const currentIndex = GUIDED_PRACTICE_SCENARIOS.findIndex((scenario) => scenario.id === progress.lastScenarioId);
  return GUIDED_PRACTICE_SCENARIOS[(currentIndex + 1 + GUIDED_PRACTICE_SCENARIOS.length) % GUIDED_PRACTICE_SCENARIOS.length];
}

export function recommendedScenarioForObjective(progress: PracticeProgress, objective: PracticeObjective): GuidedPracticeScenario {
  const targetDifficulty = practiceDifficulty(progress);
  const unseen = GUIDED_PRACTICE_SCENARIOS.filter((scenario) => scenario.objective === objective && !progress.completedScenarioIds.includes(scenario.id));
  const matching = unseen.length ? unseen : GUIDED_PRACTICE_SCENARIOS.filter((scenario) => scenario.objective === objective);
  if (matching.length) return matching.sort((left, right) => Math.abs(left.difficulty - targetDifficulty) - Math.abs(right.difficulty - targetDifficulty) || left.difficulty - right.difficulty)[0];
  return recommendedPracticeScenario(progress);
}

export const GUIDED_PRACTICE_SCENARIOS: GuidedPracticeScenario[] = [
  {
    id: "shape-keep-two-sided",
    title: "Keep the flexible shape",
    objective: "shape",
    prompt: "You are one tile from tenpai. Which discard keeps the widest path to useful draws?",
    visibleFacts: ["The two-sided wait preserves more neighboring draws.", "No opponent threat is visible in this snapshot."],
    options: [
      { id: "keep-two-sided", label: "Discard the isolated honor", rationale: "Preserves the connected two-sided shape." },
      { id: "chase-pair", label: "Break the two-sided shape", rationale: "Keeps a pair but narrows the useful-draw path." },
    ],
    bestOptionId: "keep-two-sided",
    coaching: "When speed is the goal, protect flexible sequences before a speculative pair.",
    difficulty: 1,
  },
  {
    id: "defense-safe-visible",
    title: "Respect the visible threat",
    objective: "defense",
    prompt: "An opponent has declared riichi. Which principle should guide your next discard?",
    visibleFacts: ["The threat is active and opponent information is incomplete.", "A visibly safe tile is available."],
    options: [
      { id: "discard-safe", label: "Choose the visible safe tile", rationale: "Reduces immediate risk while preserving optionality." },
      { id: "push-value", label: "Push the highest-value tile", rationale: "Prioritizes score without accounting for the active threat." },
    ],
    bestOptionId: "discard-safe",
    coaching: "Separate visible safety facts from uncertain danger estimates before pushing value.",
    difficulty: 2,
  },
  {
    id: "value-delay",
    title: "Know when value is worth the delay",
    objective: "value",
    prompt: "Your hand is already near tenpai. When is a value detour most defensible?",
    visibleFacts: ["The score gap is meaningful.", "The detour does not destroy all useful draws."],
    options: [
      { id: "take-value", label: "Take the value upgrade", rationale: "The score context can justify a controlled delay." },
      { id: "always-speed", label: "Always choose the fastest line", rationale: "Ignores score pressure and the quality of the value upgrade." },
    ],
    bestOptionId: "take-value",
    coaching: "Value is strongest when score pressure is real and the shape remains resilient.",
    difficulty: 2,
  },
  {
    id: "defense-risk-budget",
    title: "Spend risk deliberately",
    objective: "defense",
    prompt: "You are behind on points with a live riichi threat. Which line best balances risk and recovery?",
    visibleFacts: ["You need a meaningful score swing, but the opponent’s threat is active.", "One discard is safer while another preserves a controlled value route."],
    options: [
      { id: "controlled-push", label: "Push the controlled value route", rationale: "Accepts measured risk because the score context requires recovery." },
      { id: "blind-push", label: "Push the most dangerous tile", rationale: "Takes maximum risk without a clear score-based payoff." },
      { id: "fold-always", label: "Fold every time", rationale: "Avoids risk but ignores the urgent score deficit." },
    ],
    bestOptionId: "controlled-push",
    coaching: "Advanced defense is not automatic folding: define the score goal, cap the risk, and keep a safer exit.",
    difficulty: 3,
  },
  {
    id: "value-score-pressure",
    title: "Protect the lead with a score plan",
    objective: "value",
    prompt: "You are ahead late in the hand. Which line keeps enough value without turning a controlled lead into unnecessary risk?",
    visibleFacts: ["Your lead is meaningful but not insurmountable.", "The value upgrade costs one draw while preserving a safe fallback."],
    options: [
      { id: "controlled-upgrade", label: "Take the controlled value upgrade", rationale: "Improves the hand while keeping a defined exit if the table turns dangerous." },
      { id: "maximum-gamble", label: "Chase the maximum score", rationale: "Adds volatility without a proportional need for upside." },
      { id: "fold-lead", label: "Abandon all value immediately", rationale: "Protects the lead but gives up useful low-risk improvement." },
    ],
    bestOptionId: "controlled-upgrade",
    coaching: "Score-aware play is a risk budget: take useful value when the lead can absorb one controlled delay, then preserve an exit.",
    difficulty: 3,
  },
  {
    id: "shape-challenge-keep-flexibility",
    title: "Keep flexibility under pressure",
    objective: "shape",
    prompt: "You are one draw from tenpai with a narrow pair and a flexible sequence. Which choice preserves the best recovery if the first plan stalls?",
    visibleFacts: ["The flexible sequence has two live neighboring draws.", "The pair is useful but does not improve the hand’s immediate direction."],
    options: [
      { id: "discard-pair", label: "Release the speculative pair", rationale: "Keeps the broader sequence path and avoids locking into one narrow wait." },
      { id: "break-sequence", label: "Break the flexible sequence", rationale: "Preserves a pair while discarding more useful neighboring draws." },
      { id: "hold-everything", label: "Wait for a perfect draw", rationale: "Delays the decision and gives up control over the shape." },
    ],
    bestOptionId: "discard-pair",
    coaching: "Under pressure, flexible shapes are an insurance policy: preserve more live draws before protecting a speculative pair.",
    difficulty: 3,
  },
  {
    id: "defense-challenge-count-safe",
    title: "Count the safe exits",
    objective: "defense",
    prompt: "A riichi threat is active and your hand has one meaningful route forward. Which line keeps a safe exit instead of spending all protection at once?",
    visibleFacts: ["Two visible safe tiles remain available after the next discard.", "The aggressive line uses the only flexible safety tile."],
    options: [
      { id: "preserve-exit", label: "Preserve the safe exit", rationale: "Keeps a future response available if the threat tightens." },
      { id: "push-once", label: "Push immediately", rationale: "Uses the flexible safety resource before the table requires it." },
      { id: "fold-blindly", label: "Discard any tile and fold", rationale: "Avoids planning around the actual count of safe exits." },
    ],
    bestOptionId: "preserve-exit",
    coaching: "Defense improves when you count exits: preserve at least one future safe response before accepting a calculated push.",
    difficulty: 3,
  },
  {
    id: "value-score-pressure-recovery",
    title: "Recover without overcommitting",
    objective: "value",
    prompt: "You are behind by a meaningful margin near the end of the hand. Which value line creates recovery chances without abandoning all useful draws?",
    visibleFacts: ["A controlled value upgrade costs one draw.", "The maximum-score route breaks the hand’s flexible shape."],
    options: [
      { id: "controlled-recovery", label: "Take the controlled upgrade", rationale: "Creates a realistic score route while keeping enough shape to continue." },
      { id: "maximum-recovery", label: "Chase the maximum score", rationale: "Accepts a large shape loss for upside that may never materialize." },
      { id: "ignore-score-gap", label: "Play as if the scores were equal", rationale: "Misses the reason a measured value delay is justified." },
    ],
    bestOptionId: "controlled-recovery",
    coaching: "Score pressure should change the acceptable risk budget, not erase it: choose the smallest value detour that keeps recovery plausible.",
    difficulty: 3,
  },
  {
    id: "defense-riichi-threat-line",
    title: "Choose the riichi response line",
    objective: "defense",
    prompt: "An opponent declares riichi while your hand is one step from a modest win. Which response best balances a real win chance with a defensible exit?",
    visibleFacts: ["One route keeps a visible safe tile for the next turn.", "The fastest route pushes a tile with uncertain danger and no clear score upgrade."],
    options: [
      { id: "safe-one-step", label: "Take the safe one-step line", rationale: "Preserves a win route while keeping a defensible follow-up discard." },
      { id: "fast-blind-push", label: "Push the fastest tile", rationale: "Prioritizes speed despite uncertain danger and limited upside." },
      { id: "fold-without-counting", label: "Fold without checking exits", rationale: "Avoids the threat but ignores the available safe continuation." },
    ],
    bestOptionId: "safe-one-step",
    coaching: "Against riichi, compare the next two turns: a modest win route is strongest when it still preserves a visible safe exit.",
    difficulty: 3,
  },
];

export function evaluatePracticeAnswer(scenario: GuidedPracticeScenario, optionId: string): PracticeFeedback {
  const option = scenario.options.find((candidate) => candidate.id === optionId);
  if (!option) return { correct: false, title: "Choose a visible line", detail: "Select one of the available actions so Sensei can explain the trade-off." };
  if (optionId === scenario.bestOptionId) return { correct: true, title: "Good read", detail: scenario.coaching };
  const best = scenario.options.find((candidate) => candidate.id === scenario.bestOptionId);
  return { correct: false, title: "Useful alternative, but risky here", detail: `Sensei would prefer “${best?.label ?? "the visible safer line"}” because ${best?.rationale.toLowerCase() ?? "it preserves more useful information"}. ${scenario.coaching}` };
}

export function nextPracticeScenario(currentId: string): GuidedPracticeScenario {
  const index = GUIDED_PRACTICE_SCENARIOS.findIndex((scenario) => scenario.id === currentId);
  return GUIDED_PRACTICE_SCENARIOS[(index + 1 + GUIDED_PRACTICE_SCENARIOS.length) % GUIDED_PRACTICE_SCENARIOS.length];
}
