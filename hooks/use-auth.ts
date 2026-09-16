import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { devLog } from "@/lib/_core/dev-log";
import { hasAbortController } from "@/lib/stream-runtime-utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

type UseAuthOptions = {
  autoFetch?: boolean;
};

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  const refreshControllerRef = useRef<AbortController | null>(null);
  const safeSetUser = useCallback((next: Auth.User | null) => {
    if (mountedRef.current) setUser(next);
  }, []);
  const safeSetLoading = useCallback((next: boolean) => {
    if (mountedRef.current) setLoading(next);
  }, []);
  const safeSetError = useCallback((next: Error | null) => {
    if (mountedRef.current) setError(next);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      refreshControllerRef.current?.abort();
      refreshControllerRef.current = null;
    };
  }, []);

  const fetchUser = useCallback(async () => {
    devLog("[useAuth] fetchUser called");
    refreshControllerRef.current?.abort();
    const controller = hasAbortController() ? new AbortController() : null;
    refreshControllerRef.current = controller;

    try {
      safeSetLoading(true);
      safeSetError(null);

      // Web platform: use cookie-based auth, fetch user from API.
      if (Platform.OS === "web") {
        devLog("[useAuth] Web platform: fetching user from API...");
        const apiUser = await Api.getMe(controller?.signal);
        if (controller?.signal.aborted) return;
        devLog("[useAuth] API user response:", apiUser);

        if (apiUser) {
          const userInfo: Auth.User = {
            id: apiUser.id,
            openId: apiUser.openId,
            name: apiUser.name,
            email: apiUser.email,
            loginMethod: apiUser.loginMethod,
            lastSignedIn: new Date(apiUser.lastSignedIn),
          };
          safeSetUser(userInfo);
          await Auth.setUserInfo(userInfo);
          devLog("[useAuth] Web user set from API:", userInfo);
        } else {
          devLog("[useAuth] Web: No authenticated user from API");
          safeSetUser(null);
          await Auth.clearUserInfo();
        }
        return;
      }

      // Native platform: use token-based auth.
      devLog("[useAuth] Native platform: checking for session token...");
      const sessionToken = await Auth.getSessionToken();
      if (controller?.signal.aborted) return;
      devLog(
        "[useAuth] Session token:",
        sessionToken ? `present (${sessionToken.substring(0, 20)}...)` : "missing",
      );
      if (!sessionToken) {
        safeSetUser(null);
        return;
      }

      const cachedUser = await Auth.getUserInfo();
      if (controller?.signal.aborted) return;
      devLog("[useAuth] Cached user:", cachedUser);
      safeSetUser(cachedUser);
    } catch (err) {
      if (isAbortError(err) || controller?.signal.aborted) {
        devLog("[useAuth] Auth refresh cancelled");
        return;
      }
      const authError = err instanceof Error ? err : new Error("Failed to fetch user");
      console.error("[useAuth] fetchUser error:", authError);
      safeSetError(authError);
      safeSetUser(null);
    } finally {
      if (refreshControllerRef.current === controller) {
        refreshControllerRef.current = null;
        safeSetLoading(false);
      }
      devLog("[useAuth] fetchUser completed");
    }
  }, [safeSetError, safeSetLoading, safeSetUser]);

  const logout = useCallback(async () => {
    refreshControllerRef.current?.abort();
    refreshControllerRef.current = null;
    try {
      await Api.logout();
    } catch (err) {
      console.error("[Auth] Logout API call failed:", err);
    } finally {
      await Auth.removeSessionToken();
      await Auth.clearUserInfo();
      safeSetUser(null);
      safeSetError(null);
      safeSetLoading(false);
    }
  }, [safeSetError, safeSetLoading, safeSetUser]);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    devLog("[useAuth] useEffect triggered, autoFetch:", autoFetch, "platform:", Platform.OS);
    if (!autoFetch) {
      safeSetLoading(false);
      return;
    }

    void fetchUser();
  }, [autoFetch, fetchUser, safeSetLoading]);

  useEffect(() => {
    devLog("[useAuth] State updated:", {
      hasUser: !!user,
      loading,
      isAuthenticated,
      error: error?.message,
    });
  }, [user, loading, isAuthenticated, error]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    refresh: fetchUser,
    logout,
  };
}
