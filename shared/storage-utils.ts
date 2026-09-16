type NativeStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

let nativeStoragePromise: Promise<NativeStorage> | null = null;

async function getNativeStorage(): Promise<NativeStorage> {
  if (!nativeStoragePromise) {
    nativeStoragePromise = import("@react-native-async-storage/async-storage").then((module) => module.default);
  }
  return nativeStoragePromise;
}

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}

function getWebStorage(): Storage | null {
  if (!isBrowserRuntime()) return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    if (isBrowserRuntime()) return getWebStorage()?.getItem(key) ?? null;
    return (await getNativeStorage()).getItem(key);
  } catch {
    return null;
  }
}

export async function safeSetItem(key: string, value: string): Promise<boolean> {
  try {
    if (isBrowserRuntime()) {
      const webStorage = getWebStorage();
      if (!webStorage) return false;
      webStorage.setItem(key, value);
      return true;
    }
    await (await getNativeStorage()).setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export async function safeRemoveItem(key: string): Promise<boolean> {
  try {
    if (isBrowserRuntime()) {
      const webStorage = getWebStorage();
      if (!webStorage) return false;
      webStorage.removeItem(key);
      return true;
    }
    await (await getNativeStorage()).removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}

export function safeParseArray<T>(value: string | null, isItem: (item: unknown) => item is T): T[] | null {
  const parsed = safeParseJson<unknown>(value);
  return Array.isArray(parsed) && parsed.every(isItem) ? parsed : null;
}
