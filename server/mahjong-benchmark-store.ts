import type { AIPolicyBenchmark } from "@/shared/mahjong-backend";
import { benchmarkPolicies } from "./mahjong-ai";
import { listMahjongBenchmarkRuns, persistMahjongBenchmarkRun } from "./db";

export interface BenchmarkRun extends AIPolicyBenchmark {
  id: string;
  createdAt: string;
  ownerUserId: number;
}

const runsByOwner = new Map<number, BenchmarkRun[]>();

export function runAndStoreBenchmark(seeds: number[], ownerUserId: number): BenchmarkRun {
  const report = benchmarkPolicies(seeds);
  const ownerRuns = runsByOwner.get(ownerUserId) ?? [];
  const run: BenchmarkRun = { ...report, id: `benchmark-${Date.now()}-${ownerUserId}-${ownerRuns.length + 1}`, createdAt: new Date().toISOString(), ownerUserId };
  ownerRuns.unshift(run);
  if (ownerRuns.length > 20) ownerRuns.length = 20;
  runsByOwner.set(ownerUserId, ownerRuns);
  void persistMahjongBenchmarkRun({ id: run.id, ownerUserId, seedsJson: run.seeds, metricsJson: run.byPolicy }).catch((error) => console.warn("[Benchmark] Persistence fallback:", error));
  return run;
}

export async function listBenchmarkRuns(ownerUserId: number): Promise<BenchmarkRun[]> {
  const local = structuredClone(runsByOwner.get(ownerUserId) ?? []);
  try {
    const persisted = await listMahjongBenchmarkRuns(ownerUserId);
    const records = persisted.map((record) => ({ id: record.id, ownerUserId, createdAt: record.createdAt.toISOString(), seeds: record.seedsJson as number[], byPolicy: record.metricsJson as BenchmarkRun["byPolicy"] }));
    return [...local, ...records.filter((record) => !local.some((run) => run.id === record.id))].slice(0, 20);
  } catch (error) {
    console.warn("[Benchmark] History fallback:", error);
    return local;
  }
}
