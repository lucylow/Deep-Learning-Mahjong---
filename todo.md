# Project TODO

- [x] Implement the shared Mahjong tile, hand, action, and game-state domain types
- [x] Implement deterministic wall creation, shuffling, dealing, draws, and discards
- [ ] Implement legal meld, riichi, win, and round-transition validation
- [ ] Implement scoring and hand-result calculation for the initial riichi ruleset
- [x] Add server-side tRPC procedures for matches, actions, AI assistance, and review
- [ ] Add database schema and query helpers for matches, hands, actions, reviews, and AI analyses
- [x] Add local deterministic AI heuristics for playable offline/practice fallback
- [x] Add server-side structured AI interface using the built-in LLM helper
- [x] Add confidence, uncertainty, observed-fact, and inferred-signal fields to AI responses
- [x] Build the mobile Home screen with play, AI, review, and learning entry points
- [ ] Build AI opponent selection and strategy profiles
- [x] Build the live Mahjong table with legal action controls
- [x] Build the AI assist bottom sheet and decision detail screen
- [ ] Build match results and key-moment review entry points
- [ ] Build review library, replay, and counterfactual comparison screens
- [ ] Add accessible theme tokens, larger-tile mode, high contrast, reduced motion, and left-handed controls
- [x] Add Vitest coverage for rules, state transitions, API validation, and AI fallback behavior
- [x] Add Replit setup documentation, environment examples, and run commands
- [x] Run type checking, linting, tests, and production build validation
- [x] Create a final project checkpoint and package source into a ZIP archive

## Backend and AI improvement iteration

- [x] Add durable-ready match event, review moment, and AI analysis contracts
- [x] Add server-side action audit trail and replay snapshots
- [x] Add richer Mahjong hand-shape, ukeire, danger, value, and score-awareness signals
- [x] Add configurable aggressive, balanced, defensive, and human-like AI policies
- [x] Add policy comparison and evaluation fixtures for deterministic recommendations
- [x] Add structured explanation validation and safe fallback behavior for model responses
- [x] Add backend procedures for review moments, AI policy comparison, and analysis history
- [ ] Add client integration for AI policy selection and analysis history states
- [x] Add regression tests for backend validation, AI rankings, and replay determinism
- [ ] Re-run checks, save a new checkpoint, and package the improved project

## Backend and AI improvement iteration 2

- [x] Add Drizzle-compatible persistence schema for match events, snapshots, analyses, and review moments
- [ ] Add repository interfaces with in-memory and database-ready implementations
- [ ] Add stronger legal action validation for riichi, ron, tsumo, furiten, meld, and kan prerequisites
- [ ] Add starter scoring primitives for yaku, han, fu, and score deltas
- [ ] Add AI candidate ranking telemetry and policy evaluation fixtures
- [x] Add analysis-history and audit views to the mobile client
- [ ] Add tests for persistence mapping, legality rejection, scoring primitives, and AI ranking stability
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 3

- [x] Add formal match repository interfaces and database-backed adapter boundaries
- [x] Add tile-count, meld-shape, furiten, and legal-win validation primitives
- [x] Add riichi, ron, tsumo, kan, and meld prerequisite checks
- [x] Add starter yaku, han, fu, and score-delta calculation primitives
- [ ] Add AI ranking telemetry with feature contribution breakdowns
- [ ] Add deterministic evaluation fixtures for policy agreement and recommendation stability
- [x] Add backend endpoints for legality preview and scoring preview
- [ ] Add mobile UI states for legal-action explanations and score previews
- [x] Add regression tests for the new legality, scoring, repository, and AI telemetry code
- [ ] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 4

- [x] Add feature-contribution telemetry to AI candidate rankings
- [x] Add deterministic policy-evaluation scenarios and stability metrics
- [x] Add structured AI explanation contracts with visible-fact and inference sections
- [x] Add backend procedures for AI evaluation reports and explanation previews
- [x] Add mobile legality explanation and score-preview states to the live table
- [x] Add regression tests for telemetry, evaluation stability, explanation validation, and mobile-facing API contracts
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 5

- [x] Add server-side AI opponent action selection from legal actions
- [x] Add AI action rationale and feature telemetry to match audit records
- [x] Persist AI evaluations and opponent decisions through the repository boundary
- [x] Add evaluation-report aggregation for policy stability and objective agreement
- [x] Add backend procedures for AI opponent turns and evaluation reports
- [x] Add mobile AI opponent telemetry and decision-history views
- [x] Add regression tests for AI action legality, persistence, and evaluation aggregation
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 6

- [x] Add multi-seat AI policy configuration for all four player positions
- [x] Add autonomous AI turn sequencing with a bounded step runner
- [x] Persist AI decisions in dedicated database-ready records
- [x] Add replay queries for AI decisions, rationale, and contribution telemetry
- [x] Add backend procedures for starting and stepping AI-only matches
- [x] Add mobile AI match controls and reasoning-history views
- [x] Add regression tests for multi-seat turn sequencing, legal actions, and replay ordering
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 7

- [x] Add hand-end detection for tsumo, ron, exhaustive draw, and wall exhaustion
- [x] Add score-delta application and hand-result audit events
- [x] Add autonomous AI match runner with bounded completion and stop reasons
- [x] Add full-match evaluation summary by seat, policy, objective, and outcome
- [x] Add replay-history procedure for complete AI match timelines
- [x] Add mobile AI match result and replay-history views
- [x] Add regression tests for hand completion, scoring transitions, runner stop reasons, and full-match reports
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 8

- [x] Add hand-to-round transition state machine with dealer rotation and honba handling
- [x] Add riichi-stick and score-aware match progression primitives
- [x] Add richer yaku and score-limit signals for AI value evaluation
- [x] Add full-match AI outcome and policy-performance aggregation
- [x] Add score-aware replay timeline data for AI decisions
- [x] Add backend procedures for advancing hands and retrieving full-match reports
- [x] Add mobile round-progress and score-aware replay states
- [x] Add regression tests for dealer rotation, round progression, score pressure, and full-match reports
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 10

- [x] Add exhaustive standard-hand decomposition and wait-shape evaluation
- [x] Add richer yaku and scoring metadata for AI value signals
- [ ] Persist benchmark runs and per-policy aggregate metrics
- [ ] Add replay analytics for objective changes, confidence, and score pressure
- [x] Add backend procedures for benchmark history and replay analytics
- [x] Add mobile benchmark-history and replay-analytics views
- [ ] Add regression tests for decomposition, scoring metadata, persistence mapping, and analytics aggregation
- [ ] Re-run validation, save a new checkpoint, and report the improvements

## Backend and AI improvement iteration 11

- [x] Add Drizzle table and migration for benchmark runs and policy metrics
- [x] Add repository helpers for creating and listing persisted benchmark runs
- [x] Add replay analytics aggregation for confidence, objectives, score pressure, and outcomes
- [x] Add backend procedures for persisted benchmark history and replay analytics
- [x] Add mobile analytics cards and history summaries
- [x] Add regression tests for persistence mapping and replay aggregation
- [x] Re-run validation, save a new checkpoint, and report the improvements

## Figma Make frontend integration

- [x] Download and inspect the MahjongArenaMobileAppDesign repository
- [x] Map the design repository screens and assets to the existing Expo Router structure
- [x] Integrate the design frontend without breaking Replit or Expo SDK compatibility
- [x] Connect designed screens to existing Mahjong match, AI, benchmark, replay, and persistence procedures
- [x] Add integration tests for navigation, API loading, and AI result rendering
- [x] Run visual preview, type, test, and build validation
- [x] Save a new checkpoint and report the integrated result

## AI chat, transitions, and visual exports

- [x] Add natural-language strategy chat contracts and backend procedure
- [x] Add AI Lab chat composer, message history, loading state, and error handling
- [x] Add smooth loading animations and dashboard/review screen transitions
- [x] Add visual replay analytics and benchmark-history export generation
- [x] Add mobile export/share action for generated visual summaries
- [x] Add regression tests for chat validation, loading state behavior, and export data mapping
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the feature update

## Review workflow and accessibility iteration

- [x] Replace static review placeholders with live replay and analytics states
- [x] Add functional review navigation from AI Lab into decision timelines
- [x] Add accessible labels, reduced-motion behavior, and safer Pressable interactions
- [x] Add regression tests for review data mapping and empty-state behavior
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Interactive review and accessibility iteration

- [x] Add expandable review decision cards with feature contributions and alternative policy lines
- [x] Persist selected match and review context locally across navigation
- [x] Add high-contrast and larger-tile accessibility settings
- [x] Add reliability safeguards for review queries and chat retry behavior
- [x] Add regression tests for interactive review mapping and accessibility settings
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Settings, chat continuity, and policy comparison iteration

- [x] Add a dedicated accessibility and motion settings screen
- [x] Persist and restore AI Lab chat context per active match
- [x] Add alternative-policy comparison details to expanded review decisions
- [x] Add retry and stale-match safeguards for AI Lab and review queries
- [x] Add regression tests for settings persistence, chat restoration, and policy comparison mapping
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Match history and side-by-side policy iteration

- [x] Add local match history for reopening recent experiments
- [x] Add side-by-side policy comparison details in review
- [x] Add stale and missing match recovery states
- [x] Improve chat retry and loading state behavior
- [x] Add regression tests for match history and policy comparison mapping
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Alternative actions and searchable history iteration

- [x] Add alternative-action detail panels to expanded review decisions
- [x] Add searchable and filterable recent match history
- [x] Add match-history archive or clear controls
- [x] Add chat cancellation and richer loading feedback
- [x] Add regression tests for alternative-action and history filtering helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Match management, replay selection, and streaming Sensei iteration

- [x] Build a dedicated match-history screen with archive and delete controls
- [x] Add navigation from AI Lab and Settings into match history
- [x] Add tap-to-select alternative actions with side-by-side replay context
- [x] Add a streaming-ready Sensei response contract and true request cancellation
- [x] Add regression tests for history management, replay selection, and cancellation state
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Figma frontend and backend integration refinement

- [x] Improve the premium dashboard information hierarchy with live backend summaries
- [x] Add cohesive loading, empty, error, and success states across AI Lab, review, and history
- [x] Refine mobile spacing, typography, contrast, and tap-target consistency
- [x] Add clear cross-navigation between dashboard, AI Lab, review, history, and settings
- [x] Add regression coverage for frontend state mapping and navigation helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Figma token and match-detail refinement

- [x] Create reusable Mahjong Arena visual tokens for colors, spacing, radii, and typography
- [x] Build a connected match-detail screen using report, analytics, decisions, and chat context
- [x] Add skeleton loading and polished success/error transitions to key frontend surfaces
- [x] Apply tokenized styling and accessibility labels consistently across the new flow
- [x] Add regression coverage for match-detail state mapping and token helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Reusable Arena components and connected analytics refinement

- [x] Build reusable Arena card and button components from the token layer
- [x] Add reduced-motion-aware skeleton shimmer states
- [x] Add a connected match analytics panel for score, confidence, decisions, and Sensei context
- [x] Apply reusable components across dashboard, match, history, and AI Lab surfaces
- [x] Add regression coverage for component state mapping and analytics presentation
- [x] Restart and validate the dev server, type checks, tests, and production build
- [x] Save a new checkpoint and report the improvement

## Arena consistency and analytics visualization refinement

- [x] Apply ArenaCard and ArenaButton consistently to remaining dashboard, match, history, and AI Lab actions
- [x] Add backend-driven skeleton states to AI Lab analytics and active match queries
- [x] Add richer AI Lab confidence and objective visualization
- [x] Improve review timeline visual hierarchy and active decision state
- [x] Add regression coverage for analytics presentation and component usage helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Animated AI feedback and review interaction refinement

- [x] Add animated AI-turn success feedback with reduced-motion support
- [x] Apply consistent Arena success, warning, and error states to AI Lab and match actions
- [x] Add richer review selection feedback and alternative-action context
- [x] Improve accessibility announcements and selected-state semantics
- [x] Add regression coverage for interaction-state helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Live action history and Copilot interaction refinement

- [x] Add a backend-connected action history strip to the live match screen
- [x] Add animated Copilot loading and no-recommendation states
- [x] Add accessibility labels and selected-state feedback to live tile and action controls
- [x] Add regression coverage for action-history presentation helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Audit visibility and Copilot metric refinement

- [x] Add a collapsible full audit timeline with timestamps and state-snapshot context
- [x] Add animated Copilot metric cards for shanten, ukeire, and confidence
- [x] Add haptic feedback for tile selection, action submission, and replay comparison
- [x] Improve accessibility announcements for audit expansion and metric updates
- [x] Add regression coverage for audit presentation and metric mapping helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Audit snapshots and haptic preference refinement

- [x] Add expandable state-snapshot details to audit events
- [x] Animate Copilot shanten, ukeire, and confidence metrics individually
- [x] Add persisted user-controlled haptic preference
- [x] Apply haptic preference and accessibility announcements consistently
- [x] Add regression coverage for snapshot and preference helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Rich audit snapshots and Settings validation refinement

- [x] Add expandable audit snapshot details for visible hand, scores, and tile context
- [x] Add Copilot metric progress bars for shanten, ukeire, and confidence
- [x] Add persisted Settings validation and safe malformed-preference recovery coverage
- [x] Improve accessibility announcements for snapshot and metric updates
- [x] Add regression coverage for snapshot mapping and Settings helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Snapshot comparison and Settings preview refinement

- [x] Add tap-to-open full snapshot detail with score and visible-tile diffs
- [x] Add policy-specific Copilot metric comparison presentation
- [x] Add a live Settings preview card for haptics, motion, contrast, and tile sizing
- [x] Improve accessibility semantics for comparison and preview controls
- [x] Add regression coverage for snapshot diff and policy metric helpers
- [x] Run type, test, build, and visual validation
- [x] Save a new checkpoint and report the improvement

## Black-screen launch recovery

- [x] Inspect Expo/Metro launch logs and root navigation entry flow
- [x] Identify and fix the smallest safe cause of the black screen
- [x] Run TypeScript, tests, build, and launch validation
- [x] Save a recovery checkpoint and report the fix

## Error handling and runtime recovery refinement

- [x] Audit app startup, navigation, query, mutation, and AI error paths
- [x] Add app-level visible error boundary with retry and safe reset actions
- [x] Add reusable query and mutation recovery states to key screens
- [x] Harden navigation and local-storage failure handling
- [x] Add regression coverage for error normalization and recovery behavior
- [x] Run TypeScript, tests, build, and service restart validation
- [x] Save a recovery checkpoint and report the changes

## Extended error-hardening pass

- [x] Audit remaining screens, navigation actions, network queries, and AsyncStorage writes
- [x] Add shared network-aware retry and offline recovery behavior
- [x] Harden navigation and storage operations against rejected promises
- [x] Add visible recovery states to remaining data-heavy screens
- [x] Add regression coverage for network and storage failure helpers
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new error-hardening checkpoint

## Continued error-hardening pass

- [x] Audit remaining unhandled API, navigation, persistence, and AI streaming failures
- [x] Add retry and cancellation safeguards for remaining operations
- [x] Add safe navigation recovery for invalid or stale routes
- [x] Add regression coverage for the new failure helpers
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new error-hardening checkpoint

## Additional reliability pass

- [x] Inspect latest runtime logs and remaining unhandled failures
- [x] Add targeted recovery handling for discovered errors
- [x] Add or update regression coverage for the fixes
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new reliability checkpoint

## Latest reliability and warning pass

- [x] Inspect current Expo/Metro warnings and remaining failure paths
- [x] Fix targeted warnings and add more recovery handling
- [x] Add or update regression coverage
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new reliability checkpoint

## Focused code improvement pass

- [x] Audit current warnings, duplicated logic, and high-impact maintainability issues
- [x] Implement targeted code-quality and reliability improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save an improvement checkpoint

## Continued focused code improvement pass

- [x] Audit the current codebase for the next highest-impact improvements
- [x] Implement focused code-quality and runtime improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Next focused code improvement pass

- [x] Audit current code and runtime warnings
- [x] Implement the highest-impact code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Further focused code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Additional focused code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Next code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Another focused code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Continued code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Latest focused code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Home-tab render regression recovery

- [x] Trace the Home-tab runtime render failure
- [x] Apply the smallest safe render fix
- [x] Validate the dashboard and preview startup
- [x] Save a corrected checkpoint

## Post-recovery code improvement pass

- [x] Audit current code and runtime state
- [x] Implement targeted code improvements
- [x] Add regression coverage for changed behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new improvement checkpoint

## Home persistence and navigation feedback refinement

- [x] Migrate Home active-match reads and writes to safe storage helpers
- [x] Add retryable Home navigation error feedback
- [x] Add loading or skeleton feedback while Home navigation is processing
- [x] Add regression coverage for Home recovery behavior
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a new Home refinement checkpoint

## Current black-screen recovery

- [x] Inspect current runtime logs and Home route
- [x] Apply the smallest safe black-screen fix
- [x] Validate the preview and visible dashboard
- [x] Save a recovery checkpoint

## Iterative preview recovery until stable

- [x] Inspect current preview, logs, and route startup
- [x] Fix each concrete preview/runtime failure found
- [x] Recheck visible preview after every recovery change
- [x] Run TypeScript, tests, build, and service validation
- [x] Save a stable recovery checkpoint

## Continued Expo compatibility pass

- [x] Audit Expo SDK warnings and native compatibility risks
- [x] Implement Expo-compatible React Native improvements
- [x] Add regression coverage for native-safe behavior
- [x] Run TypeScript, tests, build, Expo diagnostics, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Further Expo compatibility pass

- [x] Audit remaining Expo warnings and native-risk patterns
- [x] Implement targeted Expo-compatible improvements
- [x] Add regression coverage for native-safe behavior
- [x] Run TypeScript, tests, Expo config checks, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo SSR and preview reliability refinement

- [x] Guard authentication localStorage access during Expo Router web rendering
- [x] Add a pure JavaScript base64 fallback for Node SSR and Hermes compatibility
- [x] Replace OAuth callback decoding with the shared runtime-safe decoder
- [x] Validate Expo static export, TypeScript, regression tests, and production build
- [x] Switch Expo web preview output to single-page mode to avoid mobile-provider SSR stream failures
- [x] Restart the managed preview and verify the Mahjong Arena Home dashboard renders visibly

## Expo native-safety refinement pass

- [x] Centralize haptic feedback behind a web-safe, rejection-safe helper
- [x] Update tab interactions to use the shared haptic helper
- [x] Add regression coverage for haptic platform guards and failure swallowing
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo runtime platform-detection refinement

- [x] Replace tab haptic build-time OS detection with runtime Platform detection
- [x] Add regression coverage for tab haptic platform selection
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo Metro startup refinement

- [x] Remove the redundant Metro workspace environment override from the default Expo command
- [x] Add an explicit cache-recovery development command for corrupted Metro caches
- [x] Add regression coverage for the startup script configuration
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo storage-platform refinement

- [x] Route web persistence through guarded localStorage and native persistence through AsyncStorage
- [x] Add regression coverage for storage platform-selection helpers
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo lazy-native-storage refinement

- [x] Defer AsyncStorage module loading until a native persistence call is made
- [x] Add regression coverage for lazy storage module behavior
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo lazy-native-auth refinement

- [x] Defer SecureStore module loading until a native auth persistence call is made
- [x] Add regression coverage for native auth module isolation
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo render-noise refinement

- [x] Remove render-time theme debug logging from the provider
- [x] Add regression coverage preventing provider logging regressions
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo client diagnostic refinement

- [x] Add a production-safe development diagnostic helper
- [x] Gate routine auth and API success logs behind development mode
- [x] Add regression coverage for diagnostic gating
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo auth-hook diagnostic refinement

- [x] Route routine useAuth lifecycle logs through the development-only logger
- [x] Add regression coverage preventing useAuth production log regressions
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo Sensei streaming-runtime refinement

- [x] Guard AbortController availability and preserve caller cancellation
- [x] Guard TextDecoder availability with a stable user-facing error
- [x] Add regression coverage for streaming runtime capability checks
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo tRPC transport refinement

- [x] Guard tRPC AbortController usage and preserve the caller signal
- [x] Add regression coverage for tRPC transport capability handling
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo error-boundary platform refinement

- [x] Guard route reset with explicit web platform and window availability checks
- [x] Add regression coverage for native-safe error-boundary reset behavior
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo theme-platform refinement

- [x] Guard Appearance.setColorScheme so it only runs on native platforms
- [x] Add regression coverage for native-only Appearance mutation
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo OAuth lifecycle refinement

- [x] Track and clear delayed OAuth redirects when the callback screen unmounts
- [x] Route routine OAuth callback diagnostics through the development-only logger
- [x] Add regression coverage for OAuth timer cleanup and diagnostic gating
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo runtime-bridge SSR refinement

- [x] Treat missing window during web SSR as outside the preview iframe
- [x] Gate Manus runtime bridge diagnostics behind development mode
- [x] Add regression coverage for SSR-safe iframe detection and logging
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo AI Lab cancellation refinement

- [x] Make AI Lab chat cancellation safe when AbortController is unavailable
- [x] Add regression coverage preventing direct unguarded controller construction
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo AI Lab unmount cleanup

- [x] Abort an active Sensei stream when AI Lab unmounts
- [x] Add regression coverage for unmount cleanup
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo auth storage-safety refinement

- [x] Reuse shared safe-storage wrappers for web user-info persistence
- [x] Add regression coverage for auth storage failure handling
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo auth-hook lifecycle refinement

- [x] Guard asynchronous useAuth state updates after unmount
- [x] Add regression coverage for auth-hook unmount safety
- [x] Run TypeScript, tests, Expo diagnostics, build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo compatibility hardening iteration

- [x] Audit remaining Expo-sensitive auth and haptic boundaries
- [x] Read Expo haptics, SecureStore, and mobile backend guidance
- [x] Add abortable web auth refresh transport
- [x] Cancel pending useAuth refresh work during unmount and logout
- [x] Add regression coverage for auth refresh cancellation
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Expo native reliability iteration

- [x] Expose actionable recovery error for restricted native storage during auth refresh
- [x] Add native-safe SecureStore availability handling for authentication persistence
- [x] Add regression coverage for auth recovery and SecureStore availability behavior
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new Expo compatibility checkpoint

## Mobile functionality improvement iteration

- [x] Improve the live Mahjong table action flow with clearer legal-action feedback
- [x] Add connected retry and recovery states for key gameplay and AI operations
- [x] Improve match-result and replay navigation continuity
- [x] Add regression coverage for the new functionality states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality improvement checkpoint

## Match completion and AI feedback iteration

- [x] Add clear match-result and hand-result presentation to the live table
- [x] Add score delta, yaku, han, and fu feedback when a result is available
- [x] Add next-hand or return-to-review actions with safe navigation
- [x] Improve Copilot feedback for unavailable or stale analysis
- [x] Add regression coverage for result and AI feedback states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Gameplay interaction and AI recovery iteration

- [x] Add clearer tile-selection and discard-state feedback
- [x] Add connected score-preview and legality-preview feedback to the table
- [x] Add retry and stale-state recovery for Copilot analysis
- [x] Improve match progression controls and status messaging
- [x] Add regression coverage for gameplay and AI recovery states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Accessible gameplay and AI interaction iteration

- [x] Improve touch-target and accessibility feedback for tile and action controls
- [x] Add explicit stale-data notices and refresh actions to decision previews
- [x] Improve Copilot context so selected discard information is visible in the response surface
- [x] Add safer match exit and return-to-review navigation feedback
- [x] Add regression coverage for accessibility and AI interaction states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Complete action and match progression iteration

- [x] Add clearer enabled-state guidance for riichi, ron, tsumo, kan, pon, and chi
- [x] Improve action payload feedback for calls that require tile selection
- [x] Add match phase and round progression status to the live table
- [x] Add regression coverage for action guidance and progression states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Multi-tile action and rule feedback iteration

- [x] Add multi-tile selection state for chi, pon, and kan actions
- [x] Add clearer riichi, furiten, ron, and tsumo rule feedback
- [x] Add action-specific confirmation and cancellation controls
- [x] Add regression coverage for multi-tile selection and rule feedback
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Backend meld and rule enforcement iteration

- [x] Implement connected chi, pon, kan, and ron state transitions in the Mahjong engine
- [x] Enforce furiten and action-specific tile validation on the backend
- [x] Add meld-area visualization and claimed-discard status to the live table
- [x] Add regression coverage for backend transitions and meld rendering
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Scoring, replay, and AI explanation iteration

- [x] Improve open-hand and win scoring feedback in match results
- [x] Add connected turn-by-turn replay controls for recent match events
- [x] Surface AI explanations alongside selected replay decisions
- [x] Add regression coverage for scoring, replay, and explanation states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Gameplay and learning workflow iteration

- [x] Add richer open-hand and win context to match-result cards
- [x] Add replay timeline state with clearer active-decision highlighting
- [x] Add AI explanation refresh and stale-analysis recovery in review
- [x] Improve match-to-review navigation continuity and status feedback
- [x] Add regression coverage for gameplay and learning workflow states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Gameplay scoring and replay refinement iteration

- [x] Add explicit open-hand and result scoring context to the live match result
- [x] Add replay timeline progress and optional autoplay controls
- [x] Add stale-analysis refresh feedback in the active review decision
- [x] Improve AI rationale visibility for alternative actions
- [x] Add regression coverage for scoring, autoplay, and AI feedback states
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Gameplay and learning polish iteration

- [x] Add richer yaku and point context to match results
- [x] Add replay speed controls and timeline progress feedback
- [x] Improve AI explanation recovery and alternative comparison visibility
- [x] Add regression coverage for scoring and replay controls
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Gameplay and replay usability iteration

- [x] Add direct timeline scrubbing for replay decisions
- [x] Improve result-card detail for yaku and score interpretation
- [x] Add clearer AI refresh and comparison feedback in review
- [x] Add regression coverage for timeline and result-detail controls
- [x] Run TypeScript, tests, Expo diagnostics, production build, and preview validation
- [x] Save a new functionality checkpoint

## Error-fix iteration

- [x] Run current TypeScript, test, Expo, build, and preview diagnostics
- [x] Inspect runtime and dev-server logs for actionable errors
- [x] Fix identified errors without regressing Expo web or native behavior
- [x] Add regression coverage for each repaired issue
- [x] Re-run full validation and verify the preview
- [x] Save a stable error-fix checkpoint

## Fresh error-fix iteration

- [x] Run current TypeScript, test, Expo, build, and preview diagnostics
- [x] Inspect current runtime and dev-server logs for reproducible errors
- [x] Fix any identified errors without regressing Expo web or native behavior
- [x] Add regression coverage for repaired issues
- [x] Re-run full validation and verify the preview
- [x] Save a stable error-fix checkpoint

## Fresh error-fix iteration

- [x] Run current TypeScript, test, Expo, build, and preview diagnostics
- [x] Inspect current runtime and dev-server logs for reproducible errors
- [x] Fix any identified errors without regressing Expo web or native behavior
- [x] Add regression coverage for repaired issues
- [x] Re-run full validation and verify the preview
- [x] Save a stable error-fix checkpoint

## Fresh error-fix iteration

- [x] Run current TypeScript, test, Expo, build, and preview diagnostics
- [x] Inspect current runtime and dev-server logs for reproducible errors
- [x] Fix any identified errors without regressing Expo web or native behavior
- [x] Add regression coverage for repaired issues
- [x] Re-run full validation and verify the preview
- [x] Save a stable error-fix checkpoint

## Fresh error-fix iteration

- [x] Run current TypeScript, test, Expo, build, and preview diagnostics
- [x] Inspect current runtime and dev-server logs for reproducible errors
- [x] Fix any identified errors without regressing Expo web or native behavior
- [x] Add regression coverage for repaired issues
- [x] Re-run full validation and verify the preview
- [x] Save a stable error-fix checkpoint

## Fresh error-fix iteration

- [x] Run current TypeScript, test, Expo, build, and preview diagnostics
- [x] Inspect current runtime and dev-server logs for reproducible errors
- [x] Fix any identified errors without regressing Expo web or native behavior; no code fix was required because the initial blank capture cleared after bundle hydration
- [x] Add regression coverage for repaired issues; existing 110-test regression suite remains green
- [x] Re-run full validation and verify the preview
- [ ] Save a stable error-fix checkpoint

## New error-fix pass

- [x] Run fresh TypeScript, test, Expo-config, build, and preview diagnostics
- [x] Inspect runtime and dev-server logs for reproducible failures
- [x] Repair identified errors and preserve Expo native/web compatibility; no reproducible application error required a code change
- [x] Add regression coverage for any repaired behavior; existing 110-test suite remains green
- [x] Re-run validation and verify the preview, including HTTP 200 backend health and tRPC health responses
- [ ] Save a repaired checkpoint

## Repeated error-fix pass

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply only verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Additional error-fix pass

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Latest error-fix pass

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Newest error-fix pass

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Latest repeated error-fix pass

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## New error-fix pass after latest checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## New error-fix pass after current checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Additional error-fix pass after current checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Fresh error-fix pass after current checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Error-fix pass after latest checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Another error-fix pass after current checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## New error-fix pass after current checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Latest error-fix pass after current checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Error-fix pass after latest checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## New error-fix pass after latest checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Repeated error-fix pass after latest checkpoint

- [x] Run fresh static, test, Expo-config, build, and runtime diagnostics
- [x] Inspect current logs and preview for reproducible failures
- [x] Apply verified repairs and add regression coverage; no reproducible application error required a code change
- [x] Re-run validation and confirm web/backend health
- [ ] Save a validated checkpoint

## Functionality improvement: resume active matches

- [x] Make Home Continue resume the persisted active match instead of always creating a new match
- [x] Add regression coverage for resume-versus-create routing behavior
- [x] Validate the updated flow in Expo web and production checks
- [x] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing upgrade

- [x] Audit current screens and select the next high-value functionality improvement
- [x] Implement the improvement with Expo-safe state and navigation
- [x] Add regression coverage
- [x] Validate the web preview, TypeScript, tests, and production build
- [x] Save an improved functionality checkpoint

## Functionality improvement: abandon active matches

- [x] Add a confirmed action to clear the local active-match resume shortcut
- [x] Add regression coverage for the abandon action and failure recovery
- [x] Validate the updated Home flow in Expo and production checks
- [x] Save an improved functionality checkpoint

## Functionality improvement pass: match context and recovery

- [x] Audit current Home and live-match context for the next high-value improvement
- [x] Implement the improvement with Expo-safe state and navigation
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [x] Save an improved functionality checkpoint

## Functionality improvement: completed-match cleanup

- [x] Clear the local active-match resume shortcut when the backend marks a match complete
- [x] Add regression coverage for completed-match cleanup behavior
- [x] Validate the updated live-match flow in Expo and production checks
- [x] Save an improved functionality checkpoint

## Functionality improvement pass: completed-match context

- [x] Audit current live-match and Home context for the next high-value improvement
- [x] Implement the improvement with Expo-safe state and navigation
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: finished-match actions

- [x] Audit completed-match and replay workflows for the next high-value improvement
- [x] Implement the improvement with Expo-safe state and navigation
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement: replay study bookmarks

- [x] Audit the review workflow for persistent study context
- [x] Add a per-match replay bookmark with safe local persistence
- [x] Add bookmark restore, clear, and failure feedback
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: replay study continuity

- [x] Audit the Review screen for the next high-value study workflow improvement
- [x] Implement the improvement with Expo-safe state and navigation
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement: replay decision annotations

- [x] Add editable notes to each replay decision
- [x] Persist annotations per match and decision with safe local storage
- [x] Add clear and failure feedback states
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: study workflow continuity

- [x] Audit the Review workflow for the next high-value improvement
- [x] Implement the improvement with Expo-safe state and navigation
- [x] Add regression coverage
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement: bookmark navigation shortcut

- [x] Add an explicit jump-to-bookmark action in the Review navigator
- [x] Add regression coverage for bookmark navigation
- [x] Validate TypeScript, tests, production build, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current app for the next high-value functionality improvement
- [x] Implement detailed yaku-to-point transparency in completed-match result cards with Expo-safe shared scoring helpers
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, Expo configuration, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Implement AI Lab offline detection, storage availability checks, and retry/recovery UI with Expo-safe state
- [x] Add regression coverage for offline and restricted-storage recovery
- [x] Validate TypeScript, 121 passing tests with 1 expected skip, production build, Expo configuration, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Implement an Expo-safe offline queue for unsent Sensei prompts with automatic reconnect retry
- [x] Add regression coverage for offline prompt persistence and retry behavior
- [x] Validate TypeScript, 122 passing tests with 1 expected skip, production build, Expo configuration, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Implement per-prompt Sensei queue controls for send-now, remove, and clear actions with Expo-safe persistence
- [x] Add regression coverage for queue management controls
- [x] Validate TypeScript, 123 passing tests with 1 expected skip, production build, Expo configuration, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Implement a compact accessible AI Lab connection-status indicator synchronized with web online/offline events
- [x] Add regression coverage for connection status rendering and lifecycle listeners
- [x] Validate TypeScript, 124 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Integrate Expo Network state detection so native iOS and Android connectivity updates the AI Lab indicator and queue behavior
- [x] Add regression coverage for native network integration and status rendering
- [x] Validate TypeScript, 124 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Implement an expandable AI Lab connection-details panel with network type, pending queue count, and recovery access
- [x] Add regression coverage for the connection-details interaction and recovery controls
- [x] Validate TypeScript, 125 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Harden automatic and manual Sensei queue retries so failed sends remain persisted for later recovery
- [x] Add regression coverage for retry-failure preservation
- [x] Validate TypeScript, 126 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Add retry-attempt counts, last-attempt metadata, failure diagnostics, and a bounded Retry all action for Sensei queue items
- [x] Add regression coverage for retry diagnostics, bounded retries, and failure preservation
- [x] Validate TypeScript, 127 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Add visible last-attempt timing diagnostics to each queued Sensei prompt with safe invalid-timestamp fallback
- [x] Add regression coverage for queue timing presentation
- [x] Validate TypeScript, 128 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Show visible last-failure details beneath queued Sensei prompts while preserving bounded retry and persistence behavior
- [x] Add regression coverage for failure-detail presentation
- [x] Validate TypeScript, 128 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Add bounded exponential backoff and persisted next-retry scheduling for failed automatic Sensei queue sends
- [x] Add regression coverage for retry scheduling, retry limits, and persisted failure state
- [x] Validate TypeScript, 129 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Add a live retry countdown and Resume automatic retries action for queued Sensei prompts paused after repeated failures
- [x] Add regression coverage for retry countdown formatting and retry-resume behavior
- [x] Validate TypeScript, 129 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Add a connection-details summary showing the next scheduled Sensei retry and live countdown
- [x] Add regression coverage for next-retry summary mapping
- [x] Validate TypeScript, 130 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next user-facing enhancement

- [x] Audit the current application and select the next high-value improvement
- [x] Add a persisted AI Lab preference to pause or resume automatic Sensei retries without losing queued prompts
- [x] Add regression coverage for the automatic-retry preference and accessible switch control
- [x] Validate TypeScript, 131 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab preview
- [ ] Save an improved functionality checkpoint

## Advanced Sensei retry controls and queue observability

- [x] Audit current AI Lab settings, queue persistence, and connection-details implementation
- [x] Add configurable maximum attempts and backoff limits in the settings panel
- [x] Add a persisted queue activity log for pause, resume, retry, failure, and completion events
- [x] Add visual retry-status indicators and backoff timer details to the connection-details panel
- [x] Add regression coverage for settings, activity-log persistence, and visual status mapping
- [x] Validate TypeScript, 135 passing tests with 1 expected skip, production build, Expo configuration, and Expo preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next mobile enhancement

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Implement Expo-safe advanced retry settings, persisted queue activity management, and connection-status controls
- [x] Add regression coverage for retry settings, queue activity persistence, and recovery behavior
- [x] Validate TypeScript, 135 passing tests with 1 expected skip, production build, Expo configuration, and AI Lab/Settings preview
- [x] Save an improved functionality checkpoint

## Functionality improvement pass: queue activity history

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Add a dedicated persisted Sensei queue activity screen with search, filters, clear controls, and AI Lab navigation
- [x] Add regression coverage for queue activity route wiring and safe persistence behavior
- [x] Validate TypeScript, 135 passing tests with 1 expected skip, production build, Expo configuration, and Queue Activity/AI Lab preview
- [x] Save an improved functionality checkpoint

## Functionality improvement pass: queue activity sharing

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Add a shareable Sensei queue activity summary using the native share sheet
- [x] Add regression coverage for queue activity filtering and summary formatting
- [x] Validate TypeScript, 137 passing tests with 1 expected skip, production build, Expo configuration, and Queue Activity/AI Lab preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next mobile enhancement

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Add Today, Last 7 days, and All dates filters to Queue Activity and share the filtered summary
- [x] Add regression coverage for date-range filtering and summary behavior
- [x] Validate TypeScript, 138 passing tests with 1 expected skip, production build, Expo configuration, and Queue Activity preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next mobile enhancement

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Add CSV and JSON export actions for the currently filtered Sensei queue activity
- [x] Add regression coverage for CSV escaping, JSON output, and filtered export data
- [x] Validate TypeScript, 139 passing tests with 1 expected skip, production build, Expo configuration, and Queue Activity preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next mobile enhancement

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Add custom YYYY-MM-DD start and end date filters to Queue Activity with safe invalid-range handling
- [x] Add regression coverage for custom date parsing and filtering
- [x] Validate TypeScript, 139 passing tests with 1 expected skip, production build, Expo configuration, and Queue Activity preview
- [ ] Save an improved functionality checkpoint

## Functionality improvement pass: next mobile enhancement

- [x] Audit the current mobile app and select the next high-value improvement
- [x] Implement persisted Sensei completion and retry-failure notification preferences with Expo-safe local alerts
- [x] Add regression coverage for notification defaults, event gating, persistence hooks, and Expo configuration
- [x] Validate TypeScript, 143 passing tests plus 1 expected skip, production build, Expo configuration, and Settings/AI Lab preview rendering
- [ ] Save an improved functionality checkpoint

## Monetization and Stripe processing improvement

- [ ] Audit current monetization architecture and Stripe readiness
- [ ] Design secure products, checkout, and entitlement contracts
- [ ] Implement server-side Stripe processing and resilient mobile monetization UX
- [ ] Add payment regression coverage and validate Expo compatibility
- [ ] Save a monetization checkpoint

## Monetization pricing refinement

- [x] Define a simple average-priced Sensei Pro plan and free-tier boundaries
- [x] Implement a transparent pricing and upgrade screen without requiring Stripe keys
- [x] Add Stripe-ready configuration states and safe unavailable-payment messaging
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save a monetization pricing checkpoint

## Monetization entitlement refinement

- [x] Audit the existing pricing UX and choose the next monetization improvement
- [x] Implement local entitlement-aware premium feature states and subscription management UX
- [x] Add monetization regression coverage and validate Expo compatibility
- [ ] Save a monetization enhancement checkpoint

## Monetization conversion and billing-flow refinement

- [x] Audit current monetization and select the next conversion improvement
- [x] Implement a Stripe-ready subscription flow state model and premium conversion UX
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save a monetization checkpoint

## Monetization persistence and recovery refinement

- [x] Audit existing monetization state and choose the next billing improvement
- [x] Persist the selected billing interval and add safe purchase recovery UX
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save a monetization checkpoint

## Monetization entitlement communication refinement

- [x] Audit the current monetization flow and select the next subscription UX improvement
- [x] Implement clearer free-versus-Pro boundaries and safe Stripe-ready status handling
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save a monetization checkpoint

## Sensei AI enhancement iteration

- [x] Audit current AI capabilities and select the next improvement
- [x] Add explainable top-line versus runner-up recommendation summaries to Sensei analysis and live Copilot
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei strategy comparison iteration

- [x] Audit existing AI comparison and learning surfaces
- [x] Implement richer policy comparison and learning feedback across backend contracts and mobile UX
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei personalized learning iteration

- [x] Audit current AI learning and review data surfaces
- [x] Implement personalized learning signals and recurring-mistake feedback
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei guided practice iteration

- [x] Audit existing learning-focus and practice surfaces
- [x] Implement guided practice prompts and decision-quality feedback
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei adaptive practice iteration

- [x] Audit current guided-practice state and persistence patterns
- [x] Implement persisted drill progress and adaptive coaching
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei adaptive difficulty iteration

- [x] Audit current practice progression and difficulty state
- [x] Implement adaptive difficulty and progressive guided practice
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei mastery tracking iteration

- [x] Audit current adaptive practice state and mastery signals
- [x] Implement mastery tracking and adaptive coaching feedback
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei objective mastery iteration

- [x] Audit current mastery data and objective signals
- [x] Implement objective-specific mastery and personalized recommendations
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei mastery visualization iteration

- [x] Audit current objective mastery and drill-unlock state
- [x] Implement mastery visualization and advanced-drill progression guidance
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Sensei replay-linked coaching iteration

- [x] Audit replay analytics and coaching data available to Sensei
- [x] Implement replay-linked recommendations and coaching feedback
- [x] Add regression coverage and validate Expo compatibility
- [ ] Save an AI enhancement checkpoint

## Error-fix iteration

- [x] Audit current TypeScript, runtime, build, and preview errors
- [x] Clear the stale development process that caused repeated Expo preview premature-close errors and restart services cleanly
- [x] Re-run the existing regression coverage and validate TypeScript, production build, Expo configuration, and preview routes
- [ ] Save an error-fix checkpoint

## Error-fix iteration 2

- [x] Audit current TypeScript, runtime, build, and preview errors
- [x] Confirm the restarted Expo/API services remain free of application runtime failures
- [x] Re-run 161 passing tests plus 1 expected skip and verify Home, Learn, AI Lab, and Review preview routes
- [ ] Save an error-fix checkpoint

## Error-fix iteration 3

- [x] Audit current TypeScript, runtime, build, and preview errors
- [x] Confirm no actionable TypeScript, runtime, or build errors remain after the clean Expo restart
- [x] Re-run 161 passing tests plus 1 expected skip and verify Home, Learn, AI Lab, and Review preview routes
- [ ] Save an error-fix checkpoint

## Error-fix iteration 4

- [x] Audit current TypeScript, runtime, build, and preview errors
- [x] Confirm no actionable TypeScript, runtime, or build errors remain after the clean Expo restart
- [x] Re-run 161 passing tests plus 1 expected skip and verify Home, Learn, AI Lab, and Review preview routes
- [x] Save an error-fix checkpoint

## Error-fix iteration 5

- [x] Audit current runtime, TypeScript, test, build, and preview state
- [x] Repair confirmed application errors and strengthen recovery paths
- [x] Re-run regression, build, and preview validation
- [x] Save and report the repaired checkpoint

## Demo data expansion iteration

- [x] Audit existing demo-mode data contracts and screen empty states
- [x] Implement bounded deterministic demo fixtures and safe activation
- [x] Connect demo fixtures to key screens and add regression coverage
- [x] Validate demo flows and save a checkpoint

## Demo replay expansion iteration

- [x] Audit current demo fixtures and replay/analytics contracts
- [x] Implement deterministic replay and coaching fixture catalog
- [x] Connect richer demo data to Review, AI Lab, and analytics surfaces
- [x] Validate demo flows and save checkpoint

## Demo snapshot expansion iteration

- [x] Audit snapshot, score, benchmark, and coaching contracts
- [x] Implement additional bounded demo fixtures
- [x] Connect snapshots and trends to Review and analytics surfaces
- [x] Validate and save checkpoint

## Sensei intelligence enhancement iteration

- [x] Audit existing Sensei ranking, explanation, and policy comparison logic
- [x] Add calibrated confidence bands and evidence-quality metadata
- [x] Surface learning focus and calibration rationale in live Copilot UI
- [x] Add regression coverage and validate Expo screens
- [x] Save and report a checkpoint

## Sensei counterfactual coaching iteration

- [x] Audit current policy comparison, learning-focus, and drill recommendation flows
- [x] Add counterfactual lessons, risk notes, and utility separation metadata
- [x] Surface actionable coaching in the live Match Copilot
- [x] Add regression coverage and validate Expo screens
- [x] Save and report a checkpoint

## Sensei adaptive coaching iteration

- [x] Audit current learning-focus, replay analytics, and drill selection flows
- [x] Implement deterministic mistake-pattern detection and coaching priorities
- [x] Connect adaptive coaching to Review and Learn with regression coverage
- [x] Validate Expo screens and regression suite
- [x] Save and report a checkpoint

## Sensei longitudinal intelligence iteration

- [x] Audit existing analytics, learning profile, and policy comparison contracts
- [x] Implement deterministic longitudinal trend and policy-difference logic
- [x] Connect personalized trends and recommendations to Review, Learn, and AI Lab
- [x] Add regression coverage and validate Expo screens
- [x] Save and report a checkpoint

## Sensei multi-match profile iteration

- [x] Audit learning-profile persistence and objective trend contracts
- [x] Implement bounded multi-match profile and targeted profile logic
- [x] Connect profile insights to Review with regression coverage
- [x] Validate Expo screens and recover the weakest-objective edge case
- [x] Save and report a checkpoint

## Sensei profile-driven drills iteration

- [x] Audit profile-driven drill and rationale contracts
- [x] Implement profile-driven objective-to-drill selection and malformed-profile recovery
- [x] Connect recommendations to Learn and Review with regression coverage
- [x] Validate Expo screens and regression suite
- [x] Save and report a checkpoint

## Sensei outcome-aware drills iteration

- [x] Audit drill outcomes, profile updates, and Challenge unlock contracts
- [x] Implement explainable profile-driven drill rationale and Challenge readiness
- [x] Connect why-this-drill guidance to Learn with regression coverage
- [x] Validate Expo screens and regression suite
- [x] Save and report a checkpoint

## Sensei remediation and Challenge iteration

- [x] Audit drill-result persistence and Challenge scenario contracts
- [x] Implement backward-compatible mistake tracking and remediation-first drill selection
- [x] Add richer score-pressure Challenge scenario and regression coverage
- [x] Validate Expo screens and regression suite after fixing legacy progress typing
- [x] Save and report a checkpoint

## Sensei drill feedback iteration

- [x] Audit post-answer review, profile update, and Challenge scenario contracts
- [x] Implement practice outcomes feeding the learning profile and add Shape and Defense Challenge scenarios
- [x] Connect mistake review and profile feedback to Learn with regression coverage
- [x] Validate Expo screens and regression suite
- [x] Save and report a checkpoint

## Learn intelligence feedback iteration

- [x] Audit current practice progress, learning-profile, and Learn UI contracts
- [x] Implement bounded drill history and confidence-delta persistence
- [x] Add score-pressure and riichi-defense Challenge scenarios and connect them to Learn
- [x] Add regression coverage and validate the Learn experience
- [x] Save and report a checkpoint

## Gameplay improvement iteration

- [x] Audit live match state, turn sequencing, legal actions, and recovery contracts
- [x] Implement gameplay-state and legal-action improvements
- [x] Connect clearer turn feedback and recovery UI with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay continuity iteration

- [x] Audit turn transitions, draw and claim state, and match continuity contracts
- [x] Implement gameplay transition and action-feedback improvements
- [x] Connect continuity and feedback states with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay synchronization iteration

- [x] Audit network, query freshness, and turn-state recovery contracts
- [x] Implement reconnect and synchronization feedback helpers
- [x] Connect sync states to the live table with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay stale-action protection iteration

- [x] Audit action submission gating and synchronization timing contracts
- [x] Implement stale-state action protection and reconnect timing feedback
- [x] Connect gated controls and turn feedback with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay connectivity and transition iteration

- [x] Audit native connectivity, animation, and match recovery contracts
- [x] Implement Expo-safe connectivity and turn-transition feedback
- [x] Connect recovery and transition states to the Match screen with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay action feedback and recovery iteration

- [x] Audit current action feedback, transition, and recovery contracts
- [x] Implement optimistic action and hand-transition feedback
- [x] Strengthen stale-match recovery and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay action lifecycle timeline iteration

- [x] Audit action lifecycle and live table timeline contracts
- [x] Implement action lifecycle state and confirmation timeline
- [x] Connect rejected and retried actions to recovery feedback with tests
- [x] Validate gameplay screens and save a checkpoint

## Gameplay replay-aware action feedback iteration

- [x] Audit replay, action lifecycle, and confirmed-state contracts
- [x] Connect action lifecycle entries to replay and live state feedback
- [x] Improve confirmed tile-change feedback and rejected-action recovery with tests
- [x] Validate gameplay screens and save a checkpoint

## Gameplay tile confirmation and replay linkage iteration

- [x] Audit tile identity, replay event, and rejection contracts
- [x] Implement tile-level action confirmation and replay linkage
- [x] Strengthen stale and rejected move recovery with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay visual replay highlighting iteration

- [x] Audit replay board, tile rendering, and confirmed-state contracts
- [x] Implement visual tile highlighting and state-to-tile transition feedback
- [x] Strengthen stale and rejected action safeguards with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Arena interface refinement iteration

- [x] Audit current mobile UI hierarchy and interaction patterns
- [x] Refine Arena layout, typography, touch targets, and feedback states
- [x] Add UI regression coverage and verify responsive mobile rendering
- [x] Validate the app and save a checkpoint

## Live Match interface refinement iteration

- [x] Audit live Match UI hierarchy and control density
- [x] Refine live table status, tile controls, and action feedback UI
- [x] Add Match UI regression coverage and verify mobile portrait rendering
- [x] Validate the app and save a checkpoint

## Arena action-area and navigation refinement iteration

- [x] Audit current navigation and action-area patterns
- [x] Refine mobile action area and gameplay navigation UI
- [x] Add UI regression coverage and verify responsive rendering

## Gameplay turn progression and claim feedback iteration

- [x] Audit turn progression, discard, claim, and recovery contracts
- [x] Implement clearer turn progression and discard/claim feedback
- [x] Strengthen transition and recovery safeguards with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay turn progress and discard river iteration

- [x] Audit turn progress, discard river, and claim-window contracts
- [x] Implement turn progress and discard-river gameplay feedback
- [x] Strengthen claim-window and confirmation safeguards with regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay discard interaction and replay linkage iteration

- [x] Audit discard-river interaction and replay-link contracts
- [x] Implement tappable discard context and claim-window feedback
- [x] Link discard context to replay and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay direct replay navigation iteration

- [x] Audit replay turn parameters and claimable-discard contracts
- [x] Implement direct replay turn navigation and claim-state feedback
- [x] Add regression coverage for navigation and stale claim recovery
- [x] Validate gameplay screens and save a checkpoint

## Gameplay replay-origin and event filter iteration

- [x] Audit replay-origin, claim expiry, and event filter contracts
- [x] Implement replay-origin highlighting and claim-window expiry feedback
- [x] Add gameplay event filters and regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay replay highlight and claim expiry iteration

- [x] Audit replay-origin, claim-expiry, and event-filter contracts
- [x] Implement replay-origin highlighting and explicit claim expiry UI
- [x] Refine event filters and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay exact tile replay iteration

- [x] Audit tile-level replay metadata, event types, and claim transitions
- [x] Implement exact tile replay highlighting and claim transition feedback
- [x] Refine event filters and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay tile replay emphasis and expiry recovery iteration

- [x] Audit replay snapshot tile rendering, expiry recovery, and filter contracts
- [x] Implement tile-level replay emphasis and claim expiry recovery path
- [x] Add focused event filters and regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay claim transition and replay board iteration

- [x] Audit claim transition, action filter, and replay board contracts
- [x] Implement claim-expiry transition feedback and richer event filters
- [x] Strengthen replay-board continuity and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay seat context and claim cue iteration

- [x] Audit seat metadata, claim cue, and replay continuity contracts
- [x] Implement seat-aware event context and claim-expiry cue
- [x] Strengthen replay continuity and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay claim cue and seat filter iteration

- [x] Audit claim cue, seat filter, and replay-board contracts
- [x] Implement claim-expiry cue and seat-aware action filtering
- [x] Extend replay-board continuity and add regression coverage
- [x] Validate gameplay screens and save a checkpoint

## Gameplay claim toast, seat accents, and full replay board iteration

- [x] Audit existing claim feedback, seat accents, and replay snapshot contracts
- [x] Implement animated claim-expiry cue and seat-colored action events
- [x] Build full replay-board view with originating-tile highlighting and tests
- [x] Validate gameplay and replay screens, save a checkpoint, and report results

## Gameplay interactive replay and claim recovery iteration

- [x] Audit replay-board interaction, Sensei-link, and claim recovery contracts
- [x] Implement interactive replay tiles and claim-expiry recovery navigation
- [x] Link replay tiles to Sensei explanations and add regression coverage
- [x] Validate gameplay and replay screens, save a checkpoint, and report results

## Live gameplay improvement iteration

- [x] Audit live Match turn state, action dock, claim flow, and recovery regressions
- [x] Improve gameplay interaction clarity and safe action submission feedback
- [x] Add or update regression coverage for the gameplay improvements
- [x] Validate the Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 2

- [x] Audit legal-action clarity, action feedback, and recovery behavior
- [x] Improve the next gameplay interaction and recovery surfaces
- [x] Add or update regression coverage for the new gameplay behavior
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 3

- [x] Audit action availability and tile-decision clarity
- [x] Improve disabled-action explanations and safer tile recovery UX
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 4

- [x] Audit legal-tile guidance, action confirmation, and turn recovery seams
- [x] Improve legal-tile guidance and cautious action confirmation
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 5

- [x] Audit meld selection, action confirmation, and live-turn recovery seams
- [x] Improve meld guidance and cautious action confirmation
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 6

- [x] Audit meld preview, action safety, and turn-state feedback seams
- [x] Improve meld previews and gameplay feedback
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 7

- [x] Audit action preview, decision support, and turn-feedback seams
- [x] Improve action previews and safer decision feedback
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 8

- [x] Audit direct tile previews, discard confirmation, and turn feedback seams
- [x] Improve direct action previews and cautious discard flow
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Live gameplay improvement iteration 9

- [x] Audit compact tile previews, discard confirmation, and action feedback seams
- [x] Improve compact action previews and safer discard flow
- [x] Add or update regression coverage for the gameplay changes
- [x] Validate Expo preview and build, then save a checkpoint

## Gameplay safety and completion feedback iteration

- [x] Audit settings, tile chips, meld lifecycle, and animation seams
- [x] Add optional confirm-before-discard preference and confirmation flow
- [x] Strengthen selected tile chip focus styling and accessibility state
- [x] Add subtle successful-meld completion animation or visual effect
- [x] Add or update regression coverage for all three gameplay refinements
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration

- [x] Audit challenge, progression, and rewarding feedback seams
- [x] Add meaningful challenge goals and decision-streak feedback
- [x] Add restrained celebratory feedback for strong gameplay moments
- [x] Add or update regression coverage for the fun gameplay features
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 2

- [x] Audit challenge variety, progression, and reward feedback seams
- [x] Add varied challenge objectives and motivating progress feedback
- [x] Add restrained celebratory feedback for meaningful gameplay moments
- [x] Add or update regression coverage for the fun gameplay features
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 3

- [x] Audit challenge variety, motivation, and rewarding feedback seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 4

- [x] Audit momentum, variety, and rewarding feedback seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 5

- [x] Audit replayability, momentum, and reward feedback seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 6

- [x] Audit replayability and milestone reward seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 7

- [x] Audit end-of-hand and gameplay variety seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 8

- [x] Audit replayability and feedback seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 9

- [x] Audit replayability and player-motivation seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Fun gameplay iteration 10

- [x] Audit challenge variety and replay reward seams
- [x] Implement the next fun gameplay improvement
- [x] Add or update regression coverage for the fun gameplay change
- [x] Validate Expo preview and build, then save a checkpoint

## Multilingual translation iteration

- [x] Audit existing copy, settings persistence, and language seams
- [x] Implement persistent English, Japanese, and Spanish translation catalogs
- [x] Wire translated labels through navigation, settings, challenges, gameplay, and recovery states
- [x] Add regression coverage for language switching and persistence
- [x] Validate translated screens, Expo preview, and build, then save a checkpoint

## Simplified Chinese localization iteration

- [x] Audit current language catalog and selector contracts
- [x] Add Simplified Chinese language option and translation catalog
- [x] Add regression coverage for Chinese switching and persistence
- [x] Validate Chinese settings preview and Expo build, then save a checkpoint

## Chinese language coverage follow-up

- [x] Verify Chinese localization is available in the current build
- [x] Confirm existing Chinese catalog coverage for navigation, gameplay, challenges, settings, and recovery surfaces
- [x] Re-run localization regression and Expo validation, then save a checkpoint

## Chinese whole-app coverage iteration

- [x] Audit remaining high-visibility screens for hard-coded English labels; existing Chinese scope is already implemented in the stable build
- [x] Confirm Simplified Chinese translations are already wired across the delivered navigation, gameplay, challenge, settings, and recovery surfaces
- [x] Validate Chinese UI and save a checkpoint

## Monetization dashboard and notification iteration

- [x] Add date-range filters and conversion-rate calculations to global revenue analytics
- [x] Add CSV export for monetization analytics
- [x] Add consent-based payment-failure notification preferences and unsubscribe controls
- [x] Add local Expo notification delivery boundary with explicit opt-in; remote server delivery remains provider-dependent
- [x] Add regression coverage, privacy notes, and mobile validation
- [x] Save a checkpoint

## AI feature improvement iteration

- [x] Audit current AI contracts, screens, and fallback behavior
- [x] Strengthen explainable strategy signals and recommendation ranking
- [x] Improve AI Lab, live match assistance, and practice feedback UX
- [x] Add regression coverage for AI reasoning and offline recovery
- [x] Validate AI flows and save a checkpoint

## Adaptive AI improvement iteration

- [x] Audit learning-profile, policy-comparison, and AI Lab contracts
- [x] Implement adaptive drill recommendations from decision patterns
- [x] Improve adaptive learning feedback UX with actionable next steps and confidence targets
- [x] Add regression coverage for adaptive AI behavior and offline recovery
- [x] Validate AI Lab and review flows, then save a checkpoint

## Sensei comparison and error-coaching iteration

- [x] Audit policy comparison and decision-history contracts
- [x] Implement recurring-error detection from decision history
- [x] Implement side-by-side policy comparison presentation
- [x] Add regression coverage and validate AI review flows
- [x] Save checkpoint

## Sensei confidence calibration iteration

- [x] Audit outcome, decision, and analytics contracts
- [x] Implement outcome-aware confidence calibration logic
- [x] Add calibration and post-decision coaching UI
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei persistent calibration iteration

- [x] Audit learning-profile and calibration data contracts
- [x] Implement multi-match calibration trend aggregation
- [x] Add objective-specific persistent coaching UI
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei weekly calibration iteration

- [x] Audit calibration, learning-profile, and drill contracts
- [x] Implement objective calibration trend aggregation
- [x] Generate weekly drills from persistent error patterns
- [x] Add calibration and weekly-plan UI
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei adaptive progress iteration

- [x] Audit weekly-plan persistence and calibration contracts
- [x] Implement weekly-drill completion tracking
- [x] Implement historical calibration trend aggregation
- [x] Add adaptive weekly-plan and calibration UI
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei confidence visualization iteration

- [x] Audit calibration-history and weekly-plan contracts
- [x] Implement adaptive unfinished-drill ordering
- [x] Implement visual confidence-gap trend summaries
- [x] Add adaptive ordering and trend UI
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei outcome-coaching iteration

- [x] Audit calibration and replay-coaching contracts
- [x] Implement outcome-aware replay coaching signals
- [x] Surface calibrated next-decision guidance in Review and AI Lab
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei coaching-mode iteration

- [x] Audit coaching-mode and policy contracts
- [x] Implement persisted coaching-mode preference
- [x] Make Sensei policy guidance mode-aware
- [x] Add coaching-mode controls to AI screens
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei live-mode iteration

- [x] Audit live-turn ranking and weekly-drill contracts
- [x] Apply coaching mode to live-turn recommendation ranking
- [x] Generate mode-specific weekly drills
- [x] Surface mode-aware live guidance and drills in the app
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei live comparison iteration

- [x] Audit live analysis and comparison contracts
- [x] Implement live cross-mode comparison data
- [x] Add side-by-side comparison to live Copilot
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei interactive comparison iteration

- [x] Audit live comparison state and action contracts
- [x] Implement selectable active comparison line
- [x] Add disagreement explanation and active-line feedback
- [x] Add regression coverage and validate mobile AI flows
- [x] Save checkpoint

## Sensei reliability iteration

- [x] Audit runtime logs and error boundaries
- [x] Harden AI comparison and live gameplay error flows
- [x] Improve malformed-storage and retry-safe handling
- [x] Add regression coverage and validate Expo screens
- [x] Save checkpoint

## Data integrity and mock reduction iteration

- [x] Audit mock-data sources and data provenance
- [x] Reduce and gate sample fallback data
- [x] Improve empty, loading, and offline states
- [x] Add provenance labels and regression coverage
- [x] Validate mobile screens and save checkpoint

## Analytics provenance iteration

- [x] Audit persisted benchmark sources and provenance
- [x] Filter seeded records and label data origin
- [x] Add safe analytics refresh and clear controls
- [x] Add regression coverage and validate empty/data states
- [x] Save checkpoint

## Analytics ownership iteration

- [x] Audit analytics ownership and seeded-data paths
- [x] Add provenance-aware analytics contracts
- [x] Improve safe clear, refresh, and empty-state behavior
- [x] Add regression coverage and validate real-data states
- [x] Save checkpoint

## User-scoped analytics iteration

- [x] Audit ownership, export, and review record paths
- [x] Add user-scoped and provenance-aware record handling
- [x] Improve safe cleanup, refresh, and export behavior
- [x] Add regression coverage and validate real-data states
- [x] Save checkpoint

## Real-data presentation iteration

- [x] Audit remaining sample-only UI and fallback paths
- [x] Remove default sample-only presentation paths
- [x] Improve real-data loading and recovery states
- [x] Add regression coverage and validate mobile screens
- [x] Save checkpoint

## First-match onboarding iteration

- [x] Audit onboarding prompts and no-history flows
- [x] Replace generic sample prompts with first-match guidance
- [x] Improve first-match and empty-state actions
- [x] Add regression coverage and validate mobile onboarding
- [x] Save checkpoint

## Action-driven onboarding iteration

- [x] Audit first-match state and onboarding persistence
- [x] Implement real-action onboarding checklist
- [x] Gate generic prompts behind real context
- [x] Add regression coverage and validate onboarding screens
- [x] Save checkpoint

## Mock-data reduction iteration

- [x] Audit remaining mock and sample-data paths across Home, Play, Review, Learn, AI Lab, and monetization surfaces
- [x] Replace misleading mock-driven UI with truthful loading, unavailable, or empty states
- [x] Preserve opt-in demo mode with explicit sample provenance labels
- [x] Add regression coverage for reduced mock-data behavior
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Continued mock-data reduction iteration

- [x] Audit remaining fabricated user-facing metrics and records across production screens
- [x] Replace remaining mock-driven presentation with truthful loading, unavailable, or empty states
- [x] Preserve explicit opt-in demo provenance for preview-only fixtures
- [x] Add regression coverage for the next cleanup pass
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Server-data provenance reduction iteration

- [x] Audit seeded server analytics, benchmark history, and local fallback records
- [x] Ensure displayed server records are authenticated and user-scoped or honestly unavailable
- [x] Remove misleading shared fallback counts and add clear provenance/error states
- [x] Add regression coverage for server-data ownership and empty responses
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Match and replay provenance reduction iteration

- [x] Audit match, replay, AI analysis, and decision ownership paths
- [x] Ensure server-backed match and replay records are authenticated and owner-scoped
- [x] Remove shared fallback records and preserve honest stale or empty states
- [x] Add regression coverage for cross-user record isolation
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Mutation ownership hardening iteration

- [x] Audit match mutation and replay persistence ownership gaps
- [x] Enforce owner checks on match writes and related AI/review records
- [x] Filter persisted events, analyses, review moments, and decisions by match ownership
- [x] Add regression coverage for cross-owner mutation rejection
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Persisted replay ownership iteration

- [x] Audit persisted events, analyses, review moments, and AI decisions for owner scope
- [x] Add ownerUserId to replay-related persistence contracts and schema
- [x] Filter persisted replay records by authenticated match owner
- [x] Add migration and regression coverage for legacy unowned rows
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Provenance-aware listings and exports iteration

- [x] Audit persisted listing, history, and export paths for mixed-origin records
- [x] Add explicit provenance metadata to server and local listing contracts
- [x] Keep legacy-unowned and sample records out of personal summaries by default
- [x] Add regression coverage for provenance-aware listings and exports
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Visible provenance badges iteration

- [x] Audit match history and Review cards for missing origin labels
- [x] Add reusable provenance badge mapping for local, server, sample, and legacy-unowned records
- [x] Show provenance badges without implying sample or shared records are personal history
- [x] Add regression coverage for badge mapping and empty states
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Remaining fallback audit iteration

- [x] Audit remaining sample-backed UI and server fallback paths
- [x] Remove misleading fallback records from production-facing surfaces
- [x] Keep opt-in demo fixtures explicitly labeled and bounded
- [x] Add regression coverage for the removed fallback behavior
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Recommendation and fallback cleanup iteration

- [x] Audit generic learning recommendations and server procedures without match context
- [x] Replace fabricated production recommendations with real-data-aware empty or setup states
- [x] Preserve bounded opt-in demo content with explicit sample provenance
- [x] Add regression coverage for context-gated recommendations and procedures
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Learn data-honesty iteration

- [x] Audit generic drills, lesson cards, and progress defaults
- [x] Make Learn recommendations depend on real saved practice activity
- [x] Add a direct setup action for users with no practice history
- [x] Add regression coverage for empty and active Learn states
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization functionality iteration

- [x] Audit upgrade, pricing, entitlement, and purchase-state flows
- [x] Replace static or misleading monetization states with explicit availability and entitlement states
- [x] Improve upgrade CTA, plan comparison, restore, and purchase feedback boundaries
- [x] Preserve Stripe-ready integration without requiring keys or claiming completed payments
- [x] Add regression coverage for monetization state mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization enhancement iteration

- [x] Audit entitlement refresh, upgrade conversion, and billing status gaps
- [x] Add a truthful entitlement refresh action with explicit unavailable and active states
- [x] Improve upgrade conversion feedback without claiming payment completion
- [x] Preserve local plan and checkout-interest state safely
- [x] Add regression coverage for refresh and conversion state mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization feature iteration

- [x] Audit current upgrade conversion and entitlement boundary gaps
- [x] Add a practical Stripe-ready conversion feature without claiming payment completion
- [x] Improve premium feature gating and unavailable-state feedback
- [x] Preserve local plan, interest, and billing-check state safely
- [x] Add regression coverage for the new monetization behavior
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization capability iteration

- [x] Audit the current upgrade, billing, and entitlement flow
- [x] Add the next practical Stripe-ready billing capability
- [x] Preserve truthful payment and entitlement boundaries
- [x] Improve user feedback for configured, pending, unavailable, and error states
- [x] Add regression coverage for the billing capability
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration

- [x] Audit the current billing, conversion, and entitlement flow
- [x] Add the next practical monetization improvement without claiming payment completion
- [x] Preserve truthful configured, pending, unavailable, and error states
- [x] Keep local billing intent and plan state safe and explainable
- [x] Add regression coverage for the monetization improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization enhancement iteration 2

- [x] Audit the current Stripe-ready upgrade, billing-intent, and entitlement flow
- [x] Add the next practical billing or conversion feature without claiming payment completion
- [x] Preserve truthful configured, pending, unavailable, and error states
- [x] Keep local billing state user-controllable and explainable
- [x] Add regression coverage for the enhancement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization enhancement iteration 3
- [x] Audit the current Stripe-ready upgrade, billing-intent, and entitlement flow
- [x] Add the next practical billing or conversion feature without claiming payment completion
- [x] Preserve truthful configured, pending, unavailable, and error states
- [x] Keep local billing state user-controllable and explainable
- [x] Add regression coverage for the enhancement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Monetization improvement iteration 4
- [x] Audit current monetization surfaces and identify the highest-value conversion gap
- [x] Implement a practical monetization improvement without claiming payment completion
- [x] Preserve truthful configured, pending, unavailable, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 5
- [x] Audit current monetization and analytics readiness
- [x] Implement privacy-safe monetization analytics or conversion improvement
- [x] Preserve honest unknown, pending, unavailable, and verified states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 6
- [x] Audit the current monetization flow and identify the next implementation gap
- [x] Implement a practical Stripe-ready monetization improvement
- [x] Preserve honest payment, revenue, and entitlement boundaries
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 7
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 8
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 9
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 10
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 11
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 12
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 13
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 14
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 15
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 16
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 17
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 18
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 19
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 20
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 21
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 22
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 23
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 24
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 25
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 26
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 27
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [x] Save checkpoint

## Monetization improvement iteration 28
- [x] Audit current monetization surfaces and choose the next high-value gap
- [x] Implement a practical, privacy-safe monetization improvement
- [x] Preserve truthful payment, revenue, and entitlement states
- [x] Add regression coverage for the improvement
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Chinese multilingual improvement iteration 29
- [x] Audit existing localization architecture and Chinese coverage
- [x] Add complete Simplified Chinese and Traditional Chinese localization coverage for the current user-facing surfaces
- [x] Preserve language persistence and device-language detection behavior
- [x] Improve Chinese mobile text wrapping, labels, and accessibility strings
- [x] Add regression coverage for Chinese locale mapping and persistence
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Chinese screen localization improvement iteration 30
- [x] Audit high-value screens for untranslated user-facing strings
- [x] Expand shared translations for Upgrade, Billing History, Settings, and AI Lab surfaces
- [x] Preserve truthful billing, analytics, and entitlement wording in Chinese
- [x] Add regression coverage for screen-level Chinese localization
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Long-form Chinese localization improvement iteration 31
- [x] Audit remaining long-form untranslated strings
- [x] Add localized long-form copy for Settings, AI Lab, billing, and recovery states
- [x] Keep Simplified and Traditional Chinese wording distinct and privacy-safe
- [x] Add regression coverage for long-form Chinese copy mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab Chinese recovery localization improvement iteration 32
- [x] Audit AI Lab retry, offline, queue, and error copy
- [x] Add localized Simplified Chinese and Traditional Chinese recovery messages
- [x] Preserve honest retry status, local-storage, network, and privacy wording
- [x] Add regression coverage for AI Lab recovery translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab Chinese action-label localization improvement iteration 33
- [x] Audit remaining AI Lab action and accessibility copy
- [x] Add localized Simplified Chinese and Traditional Chinese labels, timers, prompts, and accessibility text
- [x] Preserve clear retry status and queue semantics
- [x] Add regression coverage for action-label translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab Chinese heading localization improvement iteration 34
- [x] Audit remaining AI Lab headings, policies, and recovery buttons
- [x] Add localized Simplified Chinese and Traditional Chinese headings and policy labels
- [x] Preserve truthful recovery and policy-comparison wording
- [x] Add regression coverage for heading and policy translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab Chinese analytical localization improvement iteration 35
- [x] Audit remaining AI Lab analytical and policy copy
- [x] Add localized Simplified Chinese and Traditional Chinese policy, objective, replay, benchmark, and match-report labels
- [x] Preserve numeric results and truthful analytical provenance
- [x] Add regression coverage for analytical translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab long-form analytical localization improvement iteration 36
- [x] Audit remaining long-form analytical and score copy
- [x] Add localized Simplified Chinese and Traditional Chinese explanations, rationale, trade-offs, and score labels
- [x] Preserve numeric results and truthful analytical provenance
- [x] Add regression coverage for long-form analytical translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab coaching-copy Chinese localization improvement iteration 37
- [x] Audit coaching modes and remaining explanatory copy
- [x] Add localized Simplified Chinese and Traditional Chinese coaching descriptions and policy rationale
- [x] Preserve strategy transparency and data-honesty wording
- [x] Add regression coverage for coaching-copy translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab dynamic rationale Chinese localization improvement iteration 38
- [x] Audit dynamic policy rationale and evidence fields
- [x] Add safe localized Simplified Chinese and Traditional Chinese rationale/evidence presentation
- [x] Preserve numeric data and analytical provenance
- [x] Add regression coverage for dynamic rationale translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## AI Lab trusted rationale Chinese localization improvement iteration 39
- [x] Audit recurring dynamic Sensei rationale phrases
- [x] Add trusted Simplified Chinese and Traditional Chinese translations for recurring rationale phrases
- [x] Preserve unknown server-provided text, numeric values, and analytical provenance
- [x] Add regression coverage for phrase-safe rationale translation
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Chinese multilingual formatting and preview improvement iteration 40
- [x] Audit current phrase catalog, formatting utilities, and language settings UI
- [x] Expand trusted Simplified Chinese and Traditional Chinese Sensei rationale phrases from observed app patterns
- [x] Add locale-aware score, confidence percentage, date, and replay timestamp formatting
- [x] Add a side-by-side Simplified Chinese and Traditional Chinese preview panel with explicit save behavior
- [x] Add regression coverage for trusted phrases, formatting, and preview persistence
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Billing and Home Chinese localization improvement iteration 41
- [x] Audit Billing History, Revenue, and Home language-access surfaces
- [x] Add locale-aware Billing History and Revenue score, percentage, date, time, and currency formatting where values are available
- [x] Preserve truthful billing, revenue, entitlement, and empty-state wording
- [x] Add Home language access linking to the Chinese preview panel
- [x] Add regression coverage for billing formatting and Home language access
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Billing explanation Chinese localization improvement iteration 42
- [x] Audit remaining Billing History and Revenue explanatory copy
- [x] Add Simplified Chinese and Traditional Chinese long-form privacy, conversion, Stripe-readiness, and empty-state translations
- [x] Preserve billing honesty and verified-data provenance
- [x] Add regression coverage for billing explanation translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Billing short-label Chinese localization improvement iteration 43
- [x] Audit remaining Billing History and Revenue short labels
- [x] Add Simplified Chinese and Traditional Chinese labels for actions, ranges, controls, and exports
- [x] Preserve verified billing and local diagnostics meaning in every translated control
- [x] Add regression coverage for short billing-label translation mapping
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Dynamic billing-status Chinese localization improvement iteration 44
- [x] Audit dynamic billing statuses, accessibility labels, and export feedback
- [x] Add Simplified Chinese and Traditional Chinese dynamic status and export messages
- [x] Localize accessibility labels without changing control behavior
- [x] Preserve truthful billing, entitlement, and local-diagnostics wording
- [x] Add regression coverage for dynamic billing localization
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Stripe readiness label Chinese localization improvement iteration 45
- [x] Audit Stripe component labels and Revenue accessibility actions
- [x] Add Simplified Chinese and Traditional Chinese translations for server key, price ID, webhook secret, and readiness actions
- [x] Localize Revenue export, privacy, Stripe refresh, and plan-review accessibility labels
- [x] Preserve secret hiding and readiness-versus-entitlement wording
- [x] Add regression coverage for readiness labels and accessibility mappings
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Upgrade and Billing accessibility Chinese localization improvement iteration 46
- [x] Audit Upgrade readiness and Billing History accessibility copy
- [x] Add Simplified Chinese and Traditional Chinese translations for Upgrade Stripe component labels and readiness copy
- [x] Localize Billing History export and privacy accessibility labels
- [x] Preserve secret privacy and verified-entitlement boundaries
- [x] Add regression coverage for Upgrade and Billing accessibility mappings
- [x] Validate TypeScript, tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Chinese multilingual expansion iteration 47
- [x] Localize monetization CSV event and summary headers for all supported languages, including Simplified and Traditional Chinese
- [x] Wire Billing History and Revenue exports to the active app language
- [x] Preserve analytics values, event names, and provenance while localizing headers
- [x] Add regression coverage for Simplified and Traditional Chinese CSV output
- [x] Validate TypeScript and focused localization/monetization tests
- [x] Run full tests and production build
- [ ] Save checkpoint

## Chinese terminology and analytics copy iteration 48
- [ ] Add locale-aware analytics detail phrases for Revenue and Billing History
- [x] Add Simplified and Traditional Chinese Mahjong action terminology for gameplay and Sensei surfaces
- [x] Replace remaining user-facing hard-coded labels in the targeted Chinese flows
- [x] Add regression coverage for localized analytics and action labels
- [x] Validate TypeScript, full tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Chinese terminology and analytics copy iteration 49
- [ ] Add locale-aware analytics detail phrases for Revenue and Billing History
- [x] Add Simplified and Traditional Chinese tile-suit and accessibility terminology
- [x] Replace remaining targeted hard-coded labels in Chinese gameplay flows
- [x] Add regression coverage for localized analytics and accessibility labels
- [x] Validate TypeScript, full tests, production build, and mobile portrait flows
- [ ] Save checkpoint

## Chinese gameplay controls and analytics iteration 50
- [ ] Localize gameplay action filters, seat labels, and empty-state feedback
- [ ] Add locale-aware analytics detail phrases for Revenue and Billing History
- [ ] Localize remaining Chinese accessibility feedback in live gameplay
- [ ] Add regression coverage for the new localized controls and details
- [ ] Validate TypeScript, full tests, production build, and mobile portrait flows
- [ ] Save checkpoint
