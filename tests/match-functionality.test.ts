import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/match/[id].tsx"),
  "utf8",
);
const reviewSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../app/review.tsx"),
  "utf8",
);

describe("live match functionality", () => {
  it("communicates turn ownership and prevents actions while waiting", () => {
    expect(source).toContain("const isYourTurn = state?.currentSeat === 0");
    expect(source).toContain("Seat ${state.currentSeat} thinking");
    expect(source).toContain("!isYourTurn || submit.isPending");
    expect(source).toContain('"Waiting"');
  });

  it("exposes retry states for match and legal-action failures", () => {
    expect(source).toContain('title="Match could not be loaded"');
    expect(source).toContain('>Retry match</Text>');
    expect(source).toContain('title="Action state unavailable"');
    expect(source).toContain('>Retry legal actions</Text>');
  });

  it("offers a direct return-home action after match completion", () => {
    expect(source).toContain('state.phase === "match_complete"');
    expect(source).toContain('router.replace("/")');
    expect(source).toContain('accessibilityLabel="Return home after match completion"');
    expect(source).toContain(">Return home</Text>");
  });

  it("clears the local resume shortcut when the match is complete", () => {
    expect(source).toContain('import { safeRemoveItem } from "@/shared/storage-utils";');
    expect(source).toContain('if (state?.phase !== "match_complete") {');
    expect(source).toContain('safeRemoveItem("mahjong.activeMatchId")');
    expect(source).toContain("completionFeedbackSent");
    expect(source).toContain("haptic.success()");
  });

  it("filters the action timeline and links selected discards to replay", () => {
    expect(source).toContain('const [actionFilter, setActionFilter]');
    expect(source).toContain("Claim expired · inspect the latest discard");
    expect(source).toContain("Inspect the expired claim discard");
    expect(source).toContain("claimToastOpacity");
    expect(source).toContain('"seat0"');
    expect(source).toContain("borderLeftColor");
    expect(source).toContain('Show ${filter} actions');
    expect(source).toContain('visibleActionTimeline');
    expect(source).toContain('Review this turn');
    expect(source).toContain('selectedDiscard.turn');
    expect(source).toContain('tile: selectedDiscard.tile.code');
    expect(source).toContain('Claim window closed. The table advanced before a claim was confirmed.');
  });

  it("supports replay seat filtering, larger tiles, and tile-to-Sensei navigation", () => {
    expect(reviewSource).toContain("Show all replay seats");
    expect(reviewSource).toContain("Show replay seat ${filter}");
    expect(reviewSource).toContain("minWidth: largeTiles ? 44 : 32");
    expect(reviewSource).toContain("onTilePress={focusReplayTile}");
    expect(reviewSource).toContain("setIsAutoplaying(false)");
  });

  it("locks duplicate submissions and supports clearing the discard candidate", () => {
    expect(source).toContain("Duplicate submissions are paused until the table responds.");
    expect(source).toContain('accessibilityLabel="Clear selected discard"');
    expect(source).toContain("Action sent. Waiting for the confirmed table state.");
    expect(source).toContain("setSelectedTile(undefined)");
  });

  it("requires a backend-approved discard and clears stale discard context", () => {
    expect(source).toContain('const discardAction = legalActions.find((action) => action.type === "discard")');
    expect(source).toContain("const canSubmitDiscard = Boolean(discardAction?.enabled && selectedTile && selectedTileIsAllowed(discardAction) && canAct)");
    expect(source).toContain("backend-approved discard");
    expect(source).toContain("selectedDiscard.tile.id !== state.lastDiscard.tile.id");
  });

  it("highlights legal discard candidates and explains selected-tile state", () => {
    expect(source).toContain("legal?: boolean");
    expect(source).toContain("legal discard candidate");
    expect(source).toContain("tileIsLegalForDiscard");
    expect(source).toContain("Green borders mark backend-approved discard candidates");
    expect(source).toContain('"legal candidate"');
  });

  it("shows ready action counts and meld combination previews", () => {
    expect(source).toContain("const enabledLegalActionCount = legalActions.filter((action) => action.enabled).length");
    expect(source).toContain("ready · ${legalActions.length} checked");
    expect(source).toContain("legal combination");
    expect(source).toContain("This chooser stays open only while the confirmed table state is unchanged");
  });

  it("shows inline meld previews and numbered combination options", () => {
    expect(source).toContain("tile combinations");
    expect(source).toContain("· ${claimChoices(action).length} combos");
    expect(source).toContain("combination ${index + 1} of ${pendingChoices.length}");
  });

  it("shows direct backend tile previews for legal actions", () => {
    expect(source).toContain('className="mr-1 text-[10px] uppercase tracking-wide text-[#D7AA58]">Tiles</Text>');
    expect(source).toContain("Uses tile codes ${action.tileCodes.join(\", \")}");
    expect(source).toContain("action.tileCodes?.length");
  });

  it("renders compact bounded tile chips for legal actions", () => {
    expect(source).toContain("action.tileCodes.slice(0, 4).map");
    expect(source).toContain('className="mr-1 text-[10px] uppercase tracking-wide text-[#D7AA58]">Tiles</Text>');
    expect(source).toContain('className="rounded-md border border-[#D7AA58] bg-[#123C35] px-2 py-1"');
  });

  it("supports optional discard confirmation and stronger selected focus", () => {
    expect(source).toContain("confirmBeforeDiscard");
    expect(source).toContain("Review before sending");
    expect(source).toContain("Confirm discard");
    expect(source).toContain("border-[3px] border-[#B87843]");
    expect(source).toContain("shadowOpacity: 0.65");
  });

  it("adds a lightweight Sensei decision streak goal and milestone feedback", () => {
    expect(source).toContain("const confirmedDecisionCount = actionTimeline.filter((entry) => entry.status === \"confirmed\").length");
    expect(source).toContain("const streakGoal = 3");
    expect(source).toContain("Sensei streak");
    expect(source).toContain("Sensei streak unlocked");
    expect(source).toContain("Keep the table rhythm going.");
  });

  it("rotates the starting Arena challenge from a deterministic daily seed", () => {
    expect(source).toContain('const dailyChallengeKey = new Date().toISOString().slice(0, 10)');
    expect(source).toContain('const dailyChallengeSeed = dailyChallengeKey.split("-").reduce((sum, part) => sum + Number(part), 0)');
    expect(source).toContain('t("dailyChallenge")');
  });

  it("offers a fresh-objective rematch choice", () => {
    expect(source).toContain("Rematch choice");
    expect(source).toContain("Queue fresh objective");
    expect(source).toContain("A fresh Arena objective is queued for the next hand.");
    expect(source).toContain("setChallengeOffset((current) => (current + 1) % funChallenges.length)");
  });

  it("offers a one-tap decisive-turn replay shortcut", () => {
    expect(source).toContain("const decisiveTurn = historyItems.filter((item) => item.snapshot).at(-1)?.snapshot?.turn ?? state?.turn ?? 0");
    expect(source).toContain("Replay decisive turn");
    expect(source).toContain('pathname: "/review", params: { matchId: String(id), turn: String(decisiveTurn) }');
  });

  it("shows a satisfying end-of-hand recap with real run metrics", () => {
    expect(source).toContain("const handRecapHeadline = funChallengeComplete");
    expect(source).toContain('{t("yourHand")} recap');
    expect(source).toContain("Compare one strong line and one turning point before continuing.");
    expect(source).toContain("Run grade");
    expect(source).toContain("Confirmed");
    expect(source).toContain("Momentum");
  });

  it("shows readable momentum run-grade labels", () => {
    expect(source).toContain('const momentumLabel = momentum >= 5 ? "On fire" : momentum >= 3 ? "In rhythm" : momentum > 0 ? "Warming up" : "Fresh table"');
    expect(source).toContain("On fire");
    expect(source).toContain("In rhythm");
    expect(source).toContain("Warming up");
    expect(source).toContain("Fresh table");
  });

  it("celebrates Momentum Mastery at the full meter", () => {
    expect(source).toContain("const momentumComplete = momentum >= momentumGoal");
    expect(source).toContain("Momentum mastery");
    expect(source).toContain("Five confirmed decisions in rhythm.");
  });

  it("tracks table momentum from confirmed and rejected actions", () => {
    expect(source).toContain('const rejectedActionCount = actionTimeline.filter((entry) => entry.status === "rejected").length');
    expect(source).toContain("const momentum = Math.max(0, Math.min(5, confirmedDecisionCount - rejectedActionCount))");
    expect(source).toContain('t("tableMomentum")');
    expect(source).toContain("Confirmed decisions build momentum; rejected moves give you room to reset.");
  });

  it("offers varied Arena challenges with progress and completion feedback", () => {
    expect(source).toContain('const [challengeOffset, setChallengeOffset] = useState(0)');
    expect(source).toContain("Choose a different Arena challenge");
    expect(source).toContain("Cycles to a different gameplay objective for this table");
    expect(source).toContain('{t("newObjective")}</Text>');
    expect(source).toContain("const funChallenges = [");
    expect(source).toContain("Streak runner");
    expect(source).toContain("Call explorer");
    expect(source).toContain("Table reader");
    expect(source).toContain("Arena challenge");
    expect(source).toContain("Arena challenge complete");
    expect(source).toContain("funChallenge.progress / funChallenge.goal");
  });

  it("shows a subtle successful meld completion effect", () => {
    expect(source).toContain('setMeldSuccessVisible(true)');
    expect(source).toContain('Meld completed · table state refreshing');
    expect(source).toContain("meldSuccessOpacity");
    expect(source).toContain('Animated.sequence');
    expect(source).toContain('reducedMotion');
  });

  it("shows backend-provided legal-action reasons and disables unavailable actions", () => {
    expect(source).toContain("action.reason");
    expect(source).toContain("const canSubmitLegalAction = (action: LegalAction)");
    expect(source).toContain("submitLegalAction(action)");
    expect(source).toContain("actionNeedsSelection(action)");
    expect(source).toContain("No special calls are available");
  });
});
