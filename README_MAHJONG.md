# Mahjong AI Backend and Mobile Client

This project is an Expo SDK 54 React Native mobile app with a TypeScript tRPC backend. The first vertical slice includes a deterministic riichi Mahjong game state, legal discard and pass actions, a server-side heuristic copilot, an optional built-in LLM explanation path, an AI-focused live table, review and learning routes, and Vitest coverage.

## Run in Replit

Use the project’s existing package manager and start command:

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

For device preview, run Expo and scan the generated QR code with Expo Go. If the device cannot reach the workspace directly, use tunnel mode. When native modules or app configuration change, create an Expo development build instead of assuming Expo Go can load every module.

## Backend boundaries

The mobile app calls typed tRPC procedures. The server owns match state and validates actions. The mobile client never decides whether an action is legal. The current store is an in-memory development store so the rules and UI can be tested without requiring a database migration. Replace `server/mahjong-store.ts` with Drizzle-backed persistence when cross-device match history, private rooms, or durable reviews are enabled.

The main procedures are:

| Procedure | Purpose |
|---|---|
| `mahjong.create` | Create a seeded practice match |
| `mahjong.get` | Read the authoritative game state |
| `mahjong.legalActions` | Return legal actions for a seat |
| `mahjong.submitAction` | Validate and apply a player action |
| `mahjong.analyze` | Return heuristic or optional LLM-assisted decision analysis |

## AI safety and trust

The heuristic service is the default because it is deterministic, inexpensive, and available when the model service is unavailable. The optional LLM path runs only on the server. AI output is structured, includes alternatives, provides uncertainty, and uses explicit disclaimers. The model is never allowed to mutate match state or claim to know concealed opponent tiles.

## Known implementation scope

The scoring implementation is intentionally a starter slice and does not yet cover every yaku, fu calculation, pao rule, abortive draw, kan replacement flow, or full four-player multiplayer transport. These should be added as separate vertical features with fixtures from authoritative rule references. The current UI is a functional foundation for the AI copilot rather than a finished commercial game.

## Replit troubleshooting

If TypeScript fails, run `pnpm check`. If a device shows an old bundle, reload Expo Go. If the preview remains stale, run `npx expo start --clear`. If a package is incompatible with Expo Go, move to a development build and rebuild after native configuration changes. Never commit `.env` files or place AI credentials in client code.
