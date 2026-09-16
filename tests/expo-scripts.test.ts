import { describe, expect, it } from "vitest";
import packageJson from "../package.json";

describe("Expo Metro scripts", () => {
  it("keeps the default web command free of redundant workspace overrides", () => {
    expect(packageJson.scripts["dev:metro"]).toContain("expo start --web");
    expect(packageJson.scripts["dev:metro"]).not.toContain("EXPO_USE_METRO_WORKSPACE_ROOT");
  });

  it("keeps the managed server command non-watching to avoid orphaned compiler processes", () => {
    expect(packageJson.scripts["dev:server"]).toContain("tsx server/_core/index.ts");
    expect(packageJson.scripts["dev:server"]).not.toContain("tsx watch");
    expect(packageJson.scripts["dev:server:watch"]).toContain("tsx watch server/_core/index.ts");
  });

  it("provides an explicit cache-recovery command", () => {
    expect(packageJson.scripts["dev:metro:clear"]).toContain("expo start --clear --web");
  });
});
