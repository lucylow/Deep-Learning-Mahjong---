import { Platform } from "react-native";
import { devLog } from "./dev-log";

type NativeSecureStore = {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
  isAvailableAsync: () => Promise<boolean>;
};

let secureStorePromise: Promise<NativeSecureStore> | null = null;

async function getSecureStore(): Promise<NativeSecureStore> {
  if (!secureStorePromise) {
    secureStorePromise = import("expo-secure-store").then((module) => module);
  }
  return secureStorePromise;
}

export async function assertNativeStorageAvailable(): Promise<void> {
  if (Platform.OS === "web") return;
  const available = await (await getSecureStore()).isAvailableAsync();
  if (!available) {
    throw new Error("Secure device storage is unavailable. Unlock the device and try again.");
  }
}
import { SESSION_TOKEN_KEY, USER_INFO_KEY } from "@/constants/oauth";
import { parseJsonText } from "@/shared/api-response";
import { isStoredUserPayload } from "@/shared/auth-utils";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/shared/storage-utils";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
};

export async function getSessionToken(): Promise<string | null> {
  try {
    // Web platform uses cookie-based auth, no manual token management needed
    if (Platform.OS === "web") {
      devLog("[Auth] Web platform uses cookie-based auth, skipping token retrieval");
      return null;
    }

    // Use SecureStore for native
    await assertNativeStorageAvailable();
    devLog("[Auth] Getting session token...");
    const token = await (await getSecureStore()).getItemAsync(SESSION_TOKEN_KEY);
    devLog(
      "[Auth] Session token retrieved from SecureStore:",
      token ? `present (${token.substring(0, 20)}...)` : "missing",
    );
    return token;
  } catch (error) {
    console.error("[Auth] Failed to get session token:", error);
    if (error instanceof Error && error.message.startsWith("Secure device storage is unavailable")) throw error;
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  try {
    // Web platform uses cookie-based auth, no manual token management needed
    if (Platform.OS === "web") {
      devLog("[Auth] Web platform uses cookie-based auth, skipping token storage");
      return;
    }

    // Use SecureStore for native
    await assertNativeStorageAvailable();
    devLog("[Auth] Setting session token...", token.substring(0, 20) + "...");
    await (await getSecureStore()).setItemAsync(SESSION_TOKEN_KEY, token);
    devLog("[Auth] Session token stored in SecureStore successfully");
  } catch (error) {
    console.error("[Auth] Failed to set session token:", error);
    throw error;
  }
}

export async function removeSessionToken(): Promise<void> {
  try {
    // Web platform uses cookie-based auth, logout is handled by server clearing cookie
    if (Platform.OS === "web") {
      devLog("[Auth] Web platform uses cookie-based auth, skipping token removal");
      return;
    }

    // Use SecureStore for native
    await assertNativeStorageAvailable();
    devLog("[Auth] Removing session token...");
    await (await getSecureStore()).deleteItemAsync(SESSION_TOKEN_KEY);
    devLog("[Auth] Session token removed from SecureStore successfully");
  } catch (error) {
    console.error("[Auth] Failed to remove session token:", error);
  }
}

export async function getUserInfo(): Promise<User | null> {
  try {
    devLog("[Auth] Getting user info...");

    let info: string | null = null;
    if (Platform.OS === "web") {
      // Shared storage guards SSR, private browsing, and unavailable browser storage.
      info = await safeGetItem(USER_INFO_KEY);
    } else {
      // Use SecureStore for native
      await assertNativeStorageAvailable();
      info = await (await getSecureStore()).getItemAsync(USER_INFO_KEY);
    }

    if (!info) {
      devLog("[Auth] No user info found");
      return null;
    }
    const parsed = parseJsonText<unknown>(info);
    if (!isStoredUserPayload(parsed)) { console.warn("[Auth] Stored user info was invalid"); return null; }
    const user: User = { ...parsed, lastSignedIn: new Date(parsed.lastSignedIn) };
    devLog("[Auth] User info retrieved:", user);
    return user;
  } catch (error) {
    console.error("[Auth] Failed to get user info:", error);
    return null;
  }
}

export async function setUserInfo(user: User): Promise<void> {
  try {
    devLog("[Auth] Setting user info...", user);

    if (Platform.OS === "web") {
      const saved = await safeSetItem(USER_INFO_KEY, JSON.stringify(user));
      if (!saved) {
        console.warn("[Auth] Web user info could not be saved locally");
        return;
      }
      devLog("[Auth] User info stored in localStorage successfully");
      return;
    }

    // Use SecureStore for native
    await assertNativeStorageAvailable();
    await (await getSecureStore()).setItemAsync(USER_INFO_KEY, JSON.stringify(user));
    devLog("[Auth] User info stored in SecureStore successfully");
  } catch (error) {
    console.error("[Auth] Failed to set user info:", error);
  }
}

export async function clearUserInfo(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      const removed = await safeRemoveItem(USER_INFO_KEY);
      if (!removed) console.warn("[Auth] Web user info could not be cleared locally");
      return;
    }

    // Use SecureStore for native
    await assertNativeStorageAvailable();
    await (await getSecureStore()).deleteItemAsync(USER_INFO_KEY);
  } catch (error) {
    console.error("[Auth] Failed to clear user info:", error);
  }
}
