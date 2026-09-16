# MahjongArenaMobileAppDesign Integration Notes

Source repository: https://github.com/lucylow/MahjongArenaMobileAppDesign

The public repository is a TypeScript Figma Make export generated from the `figma/repo-template`. The root contains `src/App.tsx`, `src/main.tsx`, `src/index.css`, `index.html`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, and `vite.config.ts`. It is a Vite web frontend rather than an Expo Router mobile project. The repository is TypeScript-heavy and was created by the Figma Make bot on Aug 15, 2026.

Integration implication: do not replace the existing Expo project wholesale. Inspect and port the visual component structure, design tokens, screen content, and assets from `src/App.tsx` and `src/index.css` into Expo-compatible React Native screens. Preserve the existing Expo Router, tRPC client, server routes, Drizzle schema, and mobile-safe layout conventions. Avoid importing Vite-only or DOM-only dependencies into native screens.
