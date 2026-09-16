import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers";
import { getApiBaseUrl } from "@/constants/oauth";
import * as Auth from "@/lib/_core/auth";
import { hasAbortController } from "@/lib/stream-runtime-utils";

/**
 * tRPC React client for type-safe API calls.
 *
 * IMPORTANT (tRPC v11): The `transformer` must be inside `httpBatchLink`,
 * NOT at the root createClient level. This ensures client and server
 * use the same serialization format (superjson).
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Creates the tRPC client with proper configuration.
 * Call this once in your app's root layout.
 */
export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getApiBaseUrl()}/api/trpc`,
        // tRPC v11: transformer MUST be inside httpBatchLink, not at root
        transformer: superjson,
        async headers() {
          const token = await Auth.getSessionToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        // Custom fetch to include credentials for cookie-based auth
        async fetch(url, options) {
          const controller = hasAbortController() ? new AbortController() : null;
          const timeout = setTimeout(() => controller?.abort(), 20_000);
          const originalSignal = options?.signal;
          const forwardAbort = () => controller?.abort();
          originalSignal?.addEventListener("abort", forwardAbort, { once: true });
          try {
            return await fetch(url, { ...options, credentials: "include", signal: controller?.signal ?? originalSignal });
          } catch (error) {
            if (originalSignal?.aborted) throw error;
            if (error && typeof error === "object" && "name" in error && error.name === "AbortError") throw new Error("The server took too long to respond. Please retry.");
            if (error instanceof TypeError) throw new Error("Network connection failed. Check your connection and retry.");
            throw error;
          } finally {
            clearTimeout(timeout);
            originalSignal?.removeEventListener("abort", forwardAbort);
          }
        },
      }),
    ],
  });
}
