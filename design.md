# Mahjong AI Mobile Interface Design Plan

## Product direction

Mahjong AI is a portrait-first Expo mobile app for Japanese riichi Mahjong that combines playable matches, explainable AI assistance, adaptive opponents, and post-game review. The product should feel like a calm, premium tabletop rather than a casino. The first screen should communicate three actions: play a match, ask the AI for help, and review a past decision.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Home | Continue match, start AI match, review last game, learning focus, recent performance |
| AI Opponent Selection | Opponent profiles, difficulty, strategy, aggression/defense presets |
| Live Table | Four-player board, hand, discards, melds, scores, legal actions, AI assist sheet |
| AI Decision Detail | Recommendation, alternatives, visible facts, inferred signals, uncertainty |
| Match Result | Placement, score, key decisions, next training focus |
| Review Library | Imported games, saved moments, review status, filters |
| Decision Replay | Exact game state, original action, AI alternatives, explanation |
| Learning Drill | One Mahjong situation, answer choices, feedback, progress |
| Profile and Settings | AI preferences, accessibility, theme, language, privacy and deletion |

## Key user flows

The primary flow is Home → AI Opponent Selection → Live Table → legal action → optional AI Assist → Decision Detail → Live Table → Match Result. The assistant never mutates game state directly; it only recommends or explains actions.

The review flow is Home → Review Library → Decision Replay → AI Decision Detail → Save to Practice → Learning Drill. Review screens should distinguish observed facts from inferred opponent information and from simulated alternatives.

## Color choices

Use deep jade `#123C35` for the table, warm ivory `#F7F0E3` for tile faces, ink `#17211F` for primary text, copper `#B87843` for active accents, muted gold `#D7AA58` for recommendations, and coral `#C95C55` for danger states. Use accessible contrast and never rely on red/green alone.

## Mobile interaction rules

All screens assume 9:16 portrait orientation and one-handed use. Use `ScreenContainer` for safe areas. Keep the live-game action tray in the lower thumb zone. Use bottom sheets for AI explanations, with the player hand still visible. Use large tile hit areas, subtle haptic feedback for primary actions, and no essential content hidden behind the tab bar.
